// Main server entry point for MediMimi backend
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { registerRoutes } from './routes';
import { seedModules } from './seed';
import { seedMedicalContent } from './seedMedicalContent';
import { seedOwner } from './seed-owner';

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
app.use(cors({
  origin: true, // Allow all origins in development
  credentials: true,
}));

// Body parsing middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static file serving for uploads
app.use('/uploads', express.static('uploads'));

async function startServer() {
  try {
    // Seed database with initial data
    await seedModules();
    await seedMedicalContent();
    await seedOwner();
    
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