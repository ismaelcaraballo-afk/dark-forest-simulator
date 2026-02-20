import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { createRepository, pushToRepository, getUncachableGitHubClient } from "./github";
import { insertTeacherSchema, insertClassSchema, insertClassStudentSchema } from "@shared/schema";
import { z } from "zod";
import fs from "fs/promises";
import path from "path";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Teacher routes
  app.post("/api/teachers", async (req, res) => {
    try {
      const validatedData = insertTeacherSchema.parse(req.body);
      const teacher = await storage.createTeacher(validatedData);
      res.json(teacher);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ error: "Invalid input", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create teacher", details: error.message });
    }
  });

  app.get("/api/teachers/:id", async (req, res) => {
    try {
      const teacher = await storage.getTeacher(req.params.id);
      if (!teacher) {
        return res.status(404).json({ error: "Teacher not found" });
      }
      res.json(teacher);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to get teacher", details: error.message });
    }
  });

  app.get("/api/teachers/user/:userId", async (req, res) => {
    try {
      const teacher = await storage.getTeacherByUserId(req.params.userId);
      if (!teacher) {
        return res.status(404).json({ error: "Teacher not found" });
      }
      res.json(teacher);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to get teacher", details: error.message });
    }
  });

  // Class routes
  app.post("/api/classes", async (req, res) => {
    try {
      const validatedData = insertClassSchema.parse(req.body);
      const cls = await storage.createClass(validatedData);
      res.json(cls);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ error: "Invalid input", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create class", details: error.message });
    }
  });

  app.get("/api/classes/:id", async (req, res) => {
    try {
      const cls = await storage.getClass(req.params.id);
      if (!cls) {
        return res.status(404).json({ error: "Class not found" });
      }
      res.json(cls);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to get class", details: error.message });
    }
  });

  app.get("/api/classes/code/:sessionCode", async (req, res) => {
    try {
      const cls = await storage.getClassBySessionCode(req.params.sessionCode);
      if (!cls) {
        return res.status(404).json({ error: "Class not found" });
      }
      res.json(cls);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to get class", details: error.message });
    }
  });

  app.get("/api/teachers/:teacherId/classes", async (req, res) => {
    try {
      const classes = await storage.getTeacherClasses(req.params.teacherId);
      res.json(classes);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to get teacher classes", details: error.message });
    }
  });

  app.put("/api/classes/:id", async (req, res) => {
    try {
      // Validate class ID
      const classId = z.string().min(1).parse(req.params.id);
      // Validate updates - only allow safe fields to be updated
      const updateSchema = z.object({
        name: z.string().min(1).optional(),
        description: z.string().optional(),
        isActive: z.number().int().min(0).max(1).optional(),
      });
      const validatedUpdates = updateSchema.parse(req.body);
      
      const updatedClass = await storage.updateClass(classId, validatedUpdates);
      if (!updatedClass) {
        return res.status(404).json({ error: "Class not found" });
      }
      res.json(updatedClass);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ error: "Invalid input", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update class", details: error.message });
    }
  });

  // Class student routes
  app.post("/api/classes/:classId/students", async (req, res) => {
    try {
      // Validate class ID and user ID
      const classId = z.string().min(1).parse(req.params.classId);
      const addStudentSchema = z.object({
        userId: z.string().min(1)
      });
      const { userId } = addStudentSchema.parse(req.body);
      
      const classStudent = await storage.addStudentToClass({
        classId,
        userId
      });
      res.json(classStudent);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ error: "Invalid input", details: error.errors });
      }
      res.status(500).json({ error: "Failed to add student to class", details: error.message });
    }
  });

  app.get("/api/classes/:classId/students", async (req, res) => {
    try {
      const students = await storage.getClassStudents(req.params.classId);
      res.json(students);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to get class students", details: error.message });
    }
  });

  app.get("/api/students/:userId/classes", async (req, res) => {
    try {
      const classes = await storage.getStudentClasses(req.params.userId);
      res.json(classes);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to get student classes", details: error.message });
    }
  });

  app.delete("/api/classes/:classId/students/:userId", async (req, res) => {
    try {
      // Validate path parameters
      const classId = z.string().min(1).parse(req.params.classId);
      const userId = z.string().min(1).parse(req.params.userId);
      
      const success = await storage.removeStudentFromClass(classId, userId);
      if (!success) {
        return res.status(404).json({ error: "Student not found in class" });
      }
      res.json({ success: true });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ error: "Invalid input", details: error.errors });
      }
      res.status(500).json({ error: "Failed to remove student from class", details: error.message });
    }
  });

  // Teacher analytics routes
  app.get("/api/teachers/:teacherId/analytics", async (req, res) => {
    try {
      const analytics = await storage.getTeacherAnalytics(req.params.teacherId);
      res.json(analytics);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to get teacher analytics", details: error.message });
    }
  });
  
  // GitHub integration endpoint
  app.post("/api/github/export", async (req, res) => {
    try {
      const { repoName, description, isPrivate } = req.body;
      
      if (!repoName) {
        return res.status(400).json({ error: "Repository name is required" });
      }

      // Get authenticated user info
      const octokit = await getUncachableGitHubClient();
      const { data: user } = await octokit.users.getAuthenticated();
      
      let repo;
      try {
        // Try to create the repository
        repo = await createRepository(repoName, description || "Dark Forest Simulator - Educational Game Theory Tool", isPrivate || false);
      } catch (error: any) {
        if (error.message.includes("already exists")) {
          // Repository exists, get it
          const existingRepo = await octokit.repos.get({ owner: user.login, repo: repoName });
          repo = existingRepo.data;
        } else {
          throw error;
        }
      }

      // Read all project files
      const files = await collectProjectFiles();
      
      // Push files to repository
      await pushToRepository(user.login, repoName, files);
      
      res.json({
        success: true,
        repository: {
          name: repo.name,
          url: repo.html_url,
          clone_url: repo.clone_url
        },
        message: "Project successfully exported to GitHub!"
      });
      
    } catch (error: any) {
      console.error("GitHub export error:", error);
      res.status(500).json({ 
        error: "Failed to export to GitHub", 
        details: error.message 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

async function collectProjectFiles(): Promise<Array<{path: string, content: string}>> {
  const files: Array<{path: string, content: string}> = [];
  
  // Key project files to include
  const projectFiles = [
    "package.json",
    "tsconfig.json", 
    "tailwind.config.ts",
    "postcss.config.js",
    "vite.config.ts",
    "drizzle.config.ts",
    "client/index.html",
    "client/src/main.tsx",
    "client/src/App.tsx",
    "client/src/index.css",
    "client/src/components/DarkForestSimulator.tsx",
    "client/src/pages/home.tsx",
    "client/src/pages/not-found.tsx",
    "client/src/lib/utils.ts",
    "client/src/lib/queryClient.ts",
    "client/src/hooks/use-toast.ts",
    "client/src/hooks/use-mobile.tsx",
    "server/index.ts",
    "server/routes.ts",
    "server/storage.ts",
    "server/db.ts",
    "server/github.ts",
    "server/vite.ts",
    "shared/schema.ts",
    "components.json"
  ];

  // Read all UI components
  try {
    const uiDir = "client/src/components/ui";
    const uiFiles = await fs.readdir(uiDir);
    for (const file of uiFiles) {
      if (file.endsWith(".tsx")) {
        projectFiles.push(`${uiDir}/${file}`);
      }
    }
  } catch (error) {
    // UI directory might not exist or be accessible
  }

  // Read each file
  for (const filePath of projectFiles) {
    try {
      const content = await fs.readFile(filePath, "utf-8");
      files.push({ path: filePath, content });
    } catch (error) {
      // File might not exist, skip it
      console.warn(`Could not read file: ${filePath}`);
    }
  }

  // Add README
  files.push({
    path: "README.md",
    content: `# Dark Forest Simulator

An interactive educational web application that explores the "Dark Forest" theory from science fiction through scenario-based decision-making exercises.

## Features

- **Educational Contexts**: Business strategy, philosophy & ethics, science & SETI, policy & governance
- **Interactive Scenarios**: 4 scenarios per context with real-world analogies
- **Decision Analysis**: Three strategic choices - Communicate, Maintain Silence, or Preemptive Strike
- **Scoring System**: Context-specific weighting for cooperation, caution, and aggression tendencies
- **Results Analysis**: Detailed profile generation and export functionality
- **Database Persistence**: PostgreSQL backend for session and user data
- **Multiplayer Support**: Group simulation sessions

## Technology Stack

- **Frontend**: React with TypeScript, Tailwind CSS, shadcn/ui components
- **Backend**: Node.js with Express, Drizzle ORM
- **Database**: PostgreSQL (Neon)
- **Build Tools**: Vite, ESBuild
- **Authentication**: Session-based with secure cookie handling

## Getting Started

1. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

2. Set up environment variables:
   \`\`\`bash
   DATABASE_URL=your_postgresql_connection_string
   SESSION_SECRET=your_session_secret
   \`\`\`

3. Push database schema:
   \`\`\`bash
   npm run db:push
   \`\`\`

4. Start the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

## Usage

The simulator guides users through:

1. **Introduction**: Theory explanation and context selection
2. **Simulation**: 4 scenarios with strategic decision-making
3. **Results**: Profile analysis, scoring, and export options

Each decision is weighted according to the selected educational context, providing personalized insights into decision-making patterns under uncertainty.

## Educational Applications

Perfect for courses in:
- Game Theory and Strategic Decision Making
- International Relations and Security Studies  
- Business Strategy and Competitive Intelligence
- Philosophy and Ethics
- Science Policy and Research Ethics

## License

MIT License - Educational Use Encouraged
`
  });

  return files;
}
