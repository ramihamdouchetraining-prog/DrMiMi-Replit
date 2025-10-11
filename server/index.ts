// Main server entry point for MediMimi backend
import 'dotenv/config'; // Load environment variables
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { registerRoutes } from './routes';
import { seedModules } from './seed';
import { seedMedicalContent } from './seedMedicalContent';
import { seedOwner } from './seed-owner';
import { seedAdmin } from './seed-admin';

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'"],
    },
  },
}));

// CORS configuration for frontend
const allowedOrigins = [
  'http://localhost:5000',
  'http://localhost:5173',
  'https://dr-mimi.netlify.app',
  'https://dr-mi-mi-replit.vercel.app', // Production Vercel URL
  'https://drmimi-replit.onrender.com',
];

// Add FRONTEND_URL from environment if provided
if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) {
      return callback(null, true);
    }

    // Check if origin is in the allowed list
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // Allow any Vercel preview deployment (*.vercel.app)
    if (origin.endsWith('.vercel.app')) {
      console.log(`✅ CORS: Allowing Vercel preview URL: ${origin}`);
      return callback(null, true);
    }

    // Origin not allowed
    console.warn(`⚠️ CORS: Origin blocked: ${origin}`);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

// Body parsing middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static file serving for uploads
app.use('/uploads', express.static('uploads'));

// Root endpoint - Backend API info
app.get('/', (req, res) => {
  res.json({
    name: 'MediMimi API',
    version: '1.0.0',
    status: 'running',
    message: 'Backend API pour la plateforme MediMimi',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth/*',
      courses: '/api/courses',
      quizzes: '/api/quizzes',
      cases: '/api/cases',
      admin: '/api/admin/*',
    },
    documentation: 'https://github.com/ramihamdouchetraining-prog/DrMiMi-Replit',
  });
});

// Health check endpoint for monitoring
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

async function startServer() {
  try {
    // Seed database with initial data
    await seedModules();
    await seedMedicalContent();
    await seedOwner();
    await seedAdmin();
    
    const httpServer = await registerRoutes(app);
    
    httpServer.listen(PORT, () => {
      console.log(`🚀 MediMimi backend server running on port ${PORT}`);
      console.log(`📊 Database: Connected to PostgreSQL`);
      console.log(`🔐 Authentication: Replit Auth enabled`);
      console.log(`🌱 Database seeded with medical modules and content`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();