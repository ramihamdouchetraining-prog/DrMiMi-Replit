import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import openai, { DR_MIMI_SYSTEM_PROMPT } from './openai';

const router = Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), 'uploads', 'chat');
    await fs.mkdir(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Type de fichier non supporté'));
    }
  }
});

// Chat endpoint with streaming support
router.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { messages, language = 'en' } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages invalides' });
    }

    // Get system prompt in the correct language
    const systemPrompt = DR_MIMI_SYSTEM_PROMPT[language as keyof typeof DR_MIMI_SYSTEM_PROMPT] || DR_MIMI_SYSTEM_PROMPT.en;

    // Set up streaming
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    try {
      const stream = await openai.chat.completions.create({
        model: 'gpt-4o', // the newest OpenAI model is "gpt-5" which was released August 7, 2025
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages
        ],
        stream: true,
        max_completion_tokens: 2000,
        temperature: 0.8
      });

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || '';
        if (content) {
          res.write(`data: ${JSON.stringify({ content })}\n\n`);
        }
      }

      res.write('data: [DONE]\n\n');
      res.end();
    } catch (streamError: any) {
      // Send error as SSE event instead of JSON
      res.write(`data: ${JSON.stringify({ error: streamError.message })}\n\n`);
      res.write('data: [DONE]\n\n');
      res.end();
    }

  } catch (error: any) {
    console.error('Chat error:', error);
    // Only send JSON if headers haven't been sent yet
    if (!res.headersSent) {
      res.status(500).json({ 
        error: 'Erreur lors de la génération de la réponse',
        details: error.message 
      });
    }
  }
});

// File upload endpoint
router.post('/api/chat/upload', upload.single('file'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Aucun fichier fourni' });
    }

    const fileInfo = {
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      path: req.file.path
    };

    // For text files, read content
    if (req.file.mimetype === 'text/plain') {
      const content = await fs.readFile(req.file.path, 'utf-8');
      return res.json({ 
        ...fileInfo, 
        content,
        type: 'text'
      });
    }

    // For PDF/DOC, we'll need to process them (future enhancement)
    if (req.file.mimetype === 'application/pdf') {
      return res.json({
        ...fileInfo,
        message: 'PDF reçu - traitement en cours',
        type: 'pdf'
      });
    }

    // For images
    if (req.file.mimetype.startsWith('image/')) {
      return res.json({
        ...fileInfo,
        url: `/uploads/chat/${req.file.filename}`,
        type: 'image'
      });
    }

    res.json(fileInfo);

  } catch (error: any) {
    console.error('Upload error:', error);
    res.status(500).json({ 
      error: 'Erreur lors de l\'upload du fichier',
      details: error.message 
    });
  }
});

// Delete uploaded file
router.delete('/api/chat/upload/:filename', async (req: Request, res: Response) => {
  try {
    const { filename } = req.params;
    
    // Security: Validate filename to prevent path traversal
    if (!filename || filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      return res.status(400).json({ error: 'Nom de fichier invalide' });
    }
    
    const uploadDir = path.join(process.cwd(), 'uploads', 'chat');
    const filePath = path.join(uploadDir, filename);
    
    // Verify the file is within the upload directory
    if (!filePath.startsWith(uploadDir)) {
      return res.status(400).json({ error: 'Accès refusé' });
    }
    
    await fs.unlink(filePath);
    res.json({ message: 'Fichier supprimé avec succès' });
  } catch (error: any) {
    console.error('Delete error:', error);
    res.status(500).json({ 
      error: 'Erreur lors de la suppression du fichier',
      details: error.message 
    });
  }
});

export default router;
