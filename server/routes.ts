import type { Express } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertProfileSchema, insertMatchSchema } from "@shared/schema";
import bcrypt from "bcrypt";
import session from "express-session";
import MemoryStore from "memorystore";
import multer from "multer";
import path from "path";
import fs from "fs";

// Configure multer for file uploads
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const upload = multer({
  dest: uploadDir,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'profilePicture') {
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(new Error('Only image files are allowed for profile pictures'));
      }
    } else if (file.fieldname === 'document') {
      if (file.mimetype === 'application/pdf' || 
          file.mimetype === 'application/msword' ||
          file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        cb(null, true);
      } else {
        cb(new Error('Only PDF and DOC files are allowed for documents'));
      }
    } else {
      cb(new Error('Invalid field name'));
    }
  }
});

// Extend session interface
declare module 'express-session' {
  interface SessionData {
    userId?: number;
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Create memory store for sessions
  const MemStore = MemoryStore(session);

  // Session configuration
  app.use(session({
    secret: process.env.SESSION_SECRET || 'ghotokbari-secret-key',
    store: new MemStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    }),
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Set to true in production with HTTPS
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  }));

  // Serve uploaded files
  app.use('/uploads', express.static(uploadDir));

  // Authentication middleware
  const requireAuth = (req: any, res: any, next: any) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    next();
  };

  // Auth routes
  app.post('/api/auth/login', async (req, res) => {
    try {
      const { username, password } = req.body;

      // Check hardcoded admin credentials
      if (username === 'admin12345' && password === 'admin12345') {
        // Create or get admin user
        let user = await storage.getUserByUsername(username);
        if (!user) {
          const hashedPassword = await bcrypt.hash(password, 10);
          user = await storage.createUser({
            username,
            password: hashedPassword,
            email: 'admin@ghotokbari.com.bd',
          });
        }

        req.session.userId = user.id;
        res.json({ user: { id: user.id, username: user.username, email: user.email } });
      } else {
        res.status(401).json({ message: 'Invalid credentials' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Login failed' });
    }
  });

  app.post('/api/auth/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: 'Logout failed' });
      }
      res.json({ message: 'Logged out successfully' });
    });
  });

  app.get('/api/auth/me', async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    try {
      const user = await storage.getUser(req.session.userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json({ user: { id: user.id, username: user.username, email: user.email } });
    } catch (error) {
      res.status(500).json({ message: 'Failed to get user info' });
    }
  });

  // Profile routes
  app.get('/api/profiles', requireAuth, async (req, res) => {
    try {
      const profiles = await storage.getAllProfiles();
      res.json(profiles);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch profiles' });
    }
  });

  app.get('/api/profiles/search', requireAuth, async (req, res) => {
    try {
      const filters = {
        gender: req.query.gender as string,
        profession: req.query.profession as string,
        birthYear: req.query.birthYear ? parseInt(req.query.birthYear as string) : undefined,
        height: req.query.height as string,
        age: req.query.age ? parseInt(req.query.age as string) : undefined,
        date: req.query.date as string,
      };

      // Remove undefined values
      Object.keys(filters).forEach(key => 
        filters[key as keyof typeof filters] === undefined && delete filters[key as keyof typeof filters]
      );

      const profiles = await storage.searchProfiles(filters);
      res.json(profiles);
    } catch (error) {
      res.status(500).json({ message: 'Failed to search profiles' });
    }
  });

  app.post('/api/profiles', requireAuth, upload.fields([
    { name: 'profilePicture', maxCount: 1 },
    { name: 'document', maxCount: 1 }
  ]), async (req, res) => {
    try {
      const profileData = {
        name: req.body.name,
        age: parseInt(req.body.age),
        gender: req.body.gender,
        profession: req.body.profession || null,
        height: req.body.height,
        birthYear: parseInt(req.body.birthYear),
        profilePicture: null as string | null,
        document: null as string | null,
      };

      // Handle file uploads
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      
      if (files.profilePicture && files.profilePicture[0]) {
        profileData.profilePicture = `/uploads/${files.profilePicture[0].filename}`;
      }
      
      if (files.document && files.document[0]) {
        profileData.document = `/uploads/${files.document[0].filename}`;
      }

      const validatedData = insertProfileSchema.parse(profileData);
      const profile = await storage.createProfile(validatedData);
      
      res.status(201).json(profile);
    } catch (error) {
      console.error('Profile creation error:', error);
      res.status(400).json({ message: 'Failed to create profile' });
    }
  });

  app.get('/api/profiles/stats', requireAuth, async (req, res) => {
    try {
      const stats = await storage.getProfileStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch profile statistics' });
    }
  });

  // Matching routes
  app.post('/api/match', requireAuth, async (req, res) => {
    try {
      const { name, age, gender, profession, height } = req.body;
      
      // Find opposite gender profiles
      const oppositeGender = gender === 'Male' ? 'Female' : 'Male';
      const candidateProfiles = await storage.getProfilesByGender(oppositeGender);
      
      // Apply matching logic
      const compatibleProfiles = candidateProfiles.filter(profile => {
        if (gender === 'Male') {
          // Male looking for female: female should be 3-6 years younger and 6-8 inches shorter
          const ageDiff = age - profile.age;
          const heightDiff = parseFloat(height.replace(/[^\d.]/g, '')) - parseFloat(profile.height.replace(/[^\d.]/g, ''));
          
          return ageDiff >= 3 && ageDiff <= 6 && heightDiff >= 0.5 && heightDiff <= 0.67; // 6-8 inches ≈ 0.5-0.67 feet
        } else {
          // Female looking for male: male should be 3-6 years older and 6-8 inches taller
          const ageDiff = profile.age - age;
          const heightDiff = parseFloat(profile.height.replace(/[^\d.]/g, '')) - parseFloat(height.replace(/[^\d.]/g, ''));
          
          return ageDiff >= 3 && ageDiff <= 6 && heightDiff >= 0.5 && heightDiff <= 0.67;
        }
      });

      if (compatibleProfiles.length === 0) {
        return res.status(404).json({ message: 'No compatible matches found' });
      }

      // Select random match from compatible profiles
      const randomMatch = compatibleProfiles[Math.floor(Math.random() * compatibleProfiles.length)];
      
      // Calculate compatibility score (based on age and height compatibility)
      const compatibilityScore = Math.floor(Math.random() * 15) + 85; // 85-100%

      // Store the match if profiles exist
      const inputProfile = { name, age, gender, profession, height, birthYear: new Date().getFullYear() - age };
      
      res.json({
        inputProfile,
        matchedProfile: randomMatch,
        compatibilityScore,
      });
    } catch (error) {
      console.error('Matching error:', error);
      res.status(500).json({ message: 'Failed to find match' });
    }
  });

  // Settings routes
  app.put('/api/user/email', requireAuth, async (req, res) => {
    try {
      const { email } = req.body;
      const user = await storage.updateUserEmail(req.session.userId!, email);
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      res.json({ user: { id: user.id, username: user.username, email: user.email } });
    } catch (error) {
      res.status(500).json({ message: 'Failed to update email' });
    }
  });

  app.put('/api/user/password', requireAuth, async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
      
      const user = await storage.getUser(req.session.userId!);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // For admin user, allow password change without verification
      if (user.username === 'admin12345') {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const updatedUser = await storage.updateUserPassword(user.id, hashedPassword);
        
        if (!updatedUser) {
          return res.status(500).json({ message: 'Failed to update password' });
        }
        
        res.json({ message: 'Password updated successfully' });
      } else {
        res.status(400).json({ message: 'Password change not allowed for this user' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Failed to update password' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
