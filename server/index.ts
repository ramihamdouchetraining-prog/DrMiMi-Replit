// Main server entry point for MediMimi backend
import "dotenv/config"; // Load environment variables
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { registerRoutes } from "./routes";
import { seedModules } from "./seed";
import { seedMedicalContent } from "./seedMedicalContent";
import { seedOwner } from "./seed-owner";
import { seedAdmin } from "./seed-admin";

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https:"],
        scriptSrc: ["'self'"],
      },
    },
  })
);

// CORS configuration for frontend - Dynamique pour Vercel
app.use(
  cors({
    origin: (origin, callback) => {
      // Liste des origines statiques autorisées
      const allowedOrigins = [
        "http://localhost:5000",
        "http://localhost:5173",
        "https://dr-mimi.netlify.app",
        "https://dr-mi-mi-replit.vercel.app", // Production Vercel
        "https://drmimi-replit.onrender.com",
      ];

      // Accepter les requêtes sans origin (Postman, curl, etc.)
      if (!origin) {
        return callback(null, true);
      }

      // Vérifier si l'origin est dans la liste statique
      if (allowedOrigins.includes(origin)) {
        console.log(`✅ CORS: Origin autorisée (statique): ${origin}`);
        return callback(null, true);
      }

      // Accepter TOUTES les URLs Preview Vercel (dr-mi-mi-replit-*.vercel.app)
      // Pattern: https://dr-mi-mi-replit-[hash]-[user].vercel.app
      if (origin.match(/^https:\/\/dr-mi-mi-replit-[a-z0-9]+-.*\.vercel\.app$/i)) {
        console.log(`✅ CORS: Vercel Preview URL autorisée: ${origin}`);
        return callback(null, true);
      }

      // Rejeter toutes les autres origines
      console.warn(`⚠️ CORS: Origin NON autorisée: ${origin}`);
      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    exposedHeaders: ["Set-Cookie"],
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);

// Body parsing middleware
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Static file serving for uploads
app.use("/uploads", express.static("uploads"));

// Root endpoint - Backend API info
app.get("/", (req, res) => {
  res.json({
    name: "MediMimi API",
    version: "1.0.0",
    status: "running",
    message: "Backend API pour la plateforme MediMimi",
    endpoints: {
      health: "/api/health",
      auth: "/api/auth/*",
      courses: "/api/courses",
      quizzes: "/api/quizzes",
      cases: "/api/cases",
      admin: "/api/admin/*",
    },
    documentation:
      "https://github.com/ramihamdouchetraining-prog/DrMiMi-Replit",
  });
});

// Health check endpoint for monitoring
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
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
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
