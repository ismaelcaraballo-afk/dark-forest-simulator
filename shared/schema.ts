import { sql, relations } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, real, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const simulationSessions = pgTable("simulation_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  educationContext: text("education_context").notNull(), // business, philosophy, science, policy
  currentStep: text("current_step").notNull().default("intro"), // intro, simulation, results
  currentScenario: integer("current_scenario").notNull().default(0),
  cooperationScore: real("cooperation_score").notNull().default(0),
  cautionScore: real("caution_score").notNull().default(0),
  aggressionScore: real("aggression_score").notNull().default(0),
  profileType: text("profile_type"), // Dark Forest Adherent, Collaborative Optimist, Strategic Observer
  isCompleted: integer("is_completed").notNull().default(0), // 0 = false, 1 = true
  isMultiplayer: integer("is_multiplayer").notNull().default(0), // 0 = false, 1 = true
  multiplayerRoomId: varchar("multiplayer_room_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
});

export const sessionDecisions = pgTable("session_decisions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: varchar("session_id").notNull().references(() => simulationSessions.id),
  scenarioIndex: integer("scenario_index").notNull(),
  scenarioTitle: text("scenario_title").notNull(),
  choiceId: text("choice_id").notNull(), // communicate, silence, escalate
  choiceLabel: text("choice_label").notNull(),
  weightsApplied: json("weights_applied").$type<{cooperation: number, caution: number, aggression: number}>().notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export const multiplayerRooms = pgTable("multiplayer_rooms", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  educationContext: text("education_context").notNull(),
  currentScenario: integer("current_scenario").notNull().default(0),
  isActive: integer("is_active").notNull().default(1), // 0 = false, 1 = true
  createdBy: varchar("created_by").notNull().references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const roomParticipants = pgTable("room_participants", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  roomId: varchar("room_id").notNull().references(() => multiplayerRooms.id),
  userId: varchar("user_id").notNull().references(() => users.id),
  sessionId: varchar("session_id").references(() => simulationSessions.id),
  joinedAt: timestamp("joined_at").defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(simulationSessions),
  createdRooms: many(multiplayerRooms),
  roomParticipations: many(roomParticipants),
}));

export const simulationSessionsRelations = relations(simulationSessions, ({ one, many }) => ({
  user: one(users, {
    fields: [simulationSessions.userId],
    references: [users.id],
  }),
  decisions: many(sessionDecisions),
  roomParticipant: one(roomParticipants),
}));

export const sessionDecisionsRelations = relations(sessionDecisions, ({ one }) => ({
  session: one(simulationSessions, {
    fields: [sessionDecisions.sessionId],
    references: [simulationSessions.id],
  }),
}));

export const multiplayerRoomsRelations = relations(multiplayerRooms, ({ one, many }) => ({
  creator: one(users, {
    fields: [multiplayerRooms.createdBy],
    references: [users.id],
  }),
  participants: many(roomParticipants),
}));

export const roomParticipantsRelations = relations(roomParticipants, ({ one }) => ({
  room: one(multiplayerRooms, {
    fields: [roomParticipants.roomId],
    references: [multiplayerRooms.id],
  }),
  user: one(users, {
    fields: [roomParticipants.userId],
    references: [users.id],
  }),
  session: one(simulationSessions, {
    fields: [roomParticipants.sessionId],
    references: [simulationSessions.id],
  }),
}));

// New tables for enhanced features

// Teacher and class management
export const teachers = pgTable("teachers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  institutionName: text("institution_name"),
  department: text("department"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const classes = pgTable("classes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  teacherId: varchar("teacher_id").notNull().references(() => teachers.id),
  name: text("name").notNull(),
  description: text("description"),
  sessionCode: text("session_code").unique().notNull(), // For students to join
  isActive: integer("is_active").notNull().default(1),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const classStudents = pgTable("class_students", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  classId: varchar("class_id").notNull().references(() => classes.id),
  userId: varchar("user_id").notNull().references(() => users.id),
  joinedAt: timestamp("joined_at").defaultNow().notNull(),
});

// Interactive glossary
export const glossaryTerms = pgTable("glossary_terms", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  term: text("term").notNull().unique(),
  definition: text("definition").notNull(),
  context: text("context"), // business, philosophy, science, policy, general
  examples: json("examples").$type<string[]>(),
  relatedTerms: json("related_terms").$type<string[]>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Case studies and examples
export const caseStudies = pgTable("case_studies", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  context: text("context").notNull(), // business, philosophy, science, policy
  scenarioType: text("scenario_type"), // historical, contemporary, hypothetical
  outcomes: json("outcomes").$type<{cooperation: string, caution: string, aggression: string}>(),
  sources: json("sources").$type<string[]>(),
  difficulty: text("difficulty").notNull().default("intermediate"), // beginner, intermediate, advanced
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Discussion prompts and reflection
export const discussionPrompts = pgTable("discussion_prompts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  prompt: text("prompt").notNull(),
  context: text("context").notNull(),
  scenarioIndex: integer("scenario_index"),
  promptType: text("prompt_type").notNull(), // pre_scenario, post_scenario, post_simulation, reflection
  suggestedDuration: integer("suggested_duration"), // minutes
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Student reflections and responses
export const studentReflections = pgTable("student_reflections", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: varchar("session_id").notNull().references(() => simulationSessions.id),
  promptId: varchar("prompt_id").references(() => discussionPrompts.id),
  response: text("response").notNull(),
  isPublic: integer("is_public").notNull().default(0), // Can other students see this?
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Assessment and testing
export const assessments = pgTable("assessments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description"),
  assessmentType: text("assessment_type").notNull(), // pre_test, post_test, quiz, reflection
  context: text("context"), // business, philosophy, science, policy, general
  questions: json("questions").$type<{id: string, question: string, type: string, options?: string[], correctAnswer?: string}[]>().notNull(),
  timeLimit: integer("time_limit"), // minutes
  isActive: integer("is_active").notNull().default(1),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const studentAssessments = pgTable("student_assessments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  assessmentId: varchar("assessment_id").notNull().references(() => assessments.id),
  userId: varchar("user_id").notNull().references(() => users.id),
  classId: varchar("class_id").references(() => classes.id),
  sessionId: varchar("session_id").references(() => simulationSessions.id),
  responses: json("responses").$type<{questionId: string, answer: string}[]>().notNull(),
  score: real("score"),
  isCompleted: integer("is_completed").notNull().default(0),
  startedAt: timestamp("started_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
});

// Analytics and insights
export const sessionAnalytics = pgTable("session_analytics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: varchar("session_id").notNull().references(() => simulationSessions.id),
  timeSpentTotal: integer("time_spent_total"), // seconds
  timePerScenario: json("time_per_scenario").$type<{scenarioIndex: number, timeSpent: number}[]>(),
  decisionChanges: integer("decision_changes").notNull().default(0), // How many times user changed their mind
  mostDifficultScenario: integer("most_difficult_scenario"), // Scenario that took longest
  consistencyScore: real("consistency_score"), // How consistent decisions were across scenarios
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Extended scenarios and content
export const customScenarios = pgTable("custom_scenarios", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  context: text("context").notNull(),
  realWorldAnalogy: text("real_world_analogy").notNull(),
  choices: json("choices").$type<{id: string, label: string, description: string}[]>().notNull(),
  consequences: json("consequences").$type<{choiceId: string, immediate: string, longTerm: string}[]>(),
  difficulty: text("difficulty").notNull().default("intermediate"),
  isActive: integer("is_active").notNull().default(1),
  createdBy: varchar("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// User preferences and settings
export const userSettings = pgTable("user_settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  theme: text("theme").notNull().default("light"), // light, dark, auto
  language: text("language").notNull().default("en"),
  accessibilityMode: integer("accessibility_mode").notNull().default(0),
  fontSize: text("font_size").notNull().default("medium"), // small, medium, large
  keyboardNavigation: integer("keyboard_navigation").notNull().default(0),
  emailNotifications: integer("email_notifications").notNull().default(1),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Additional relations for new tables
export const teachersRelations = relations(teachers, ({ one, many }) => ({
  user: one(users, {
    fields: [teachers.userId],
    references: [users.id],
  }),
  classes: many(classes),
}));

export const classesRelations = relations(classes, ({ one, many }) => ({
  teacher: one(teachers, {
    fields: [classes.teacherId],
    references: [teachers.id],
  }),
  students: many(classStudents),
}));

export const classStudentsRelations = relations(classStudents, ({ one }) => ({
  class: one(classes, {
    fields: [classStudents.classId],
    references: [classes.id],
  }),
  user: one(users, {
    fields: [classStudents.userId],
    references: [users.id],
  }),
}));

export const studentReflectionsRelations = relations(studentReflections, ({ one }) => ({
  session: one(simulationSessions, {
    fields: [studentReflections.sessionId],
    references: [simulationSessions.id],
  }),
  prompt: one(discussionPrompts, {
    fields: [studentReflections.promptId],
    references: [discussionPrompts.id],
  }),
}));

export const studentAssessmentsRelations = relations(studentAssessments, ({ one }) => ({
  assessment: one(assessments, {
    fields: [studentAssessments.assessmentId],
    references: [assessments.id],
  }),
  user: one(users, {
    fields: [studentAssessments.userId],
    references: [users.id],
  }),
  class: one(classes, {
    fields: [studentAssessments.classId],
    references: [classes.id],
  }),
  session: one(simulationSessions, {
    fields: [studentAssessments.sessionId],
    references: [simulationSessions.id],
  }),
}));

export const sessionAnalyticsRelations = relations(sessionAnalytics, ({ one }) => ({
  session: one(simulationSessions, {
    fields: [sessionAnalytics.sessionId],
    references: [simulationSessions.id],
  }),
}));

export const customScenariosRelations = relations(customScenarios, ({ one }) => ({
  creator: one(users, {
    fields: [customScenarios.createdBy],
    references: [users.id],
  }),
}));

export const userSettingsRelations = relations(userSettings, ({ one }) => ({
  user: one(users, {
    fields: [userSettings.userId],
    references: [users.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertSimulationSessionSchema = createInsertSchema(simulationSessions).omit({
  id: true,
  createdAt: true,
  completedAt: true,
});

export const insertSessionDecisionSchema = createInsertSchema(sessionDecisions).omit({
  id: true,
  timestamp: true,
});

export const insertMultiplayerRoomSchema = createInsertSchema(multiplayerRooms).omit({
  id: true,
  createdAt: true,
});

export const insertRoomParticipantSchema = createInsertSchema(roomParticipants).omit({
  id: true,
  joinedAt: true,
});

export const insertTeacherSchema = createInsertSchema(teachers).omit({
  id: true,
  createdAt: true,
});

export const insertClassSchema = createInsertSchema(classes).omit({
  id: true,
  createdAt: true,
});

export const insertClassStudentSchema = createInsertSchema(classStudents).omit({
  id: true,
  joinedAt: true,
});

export const insertGlossaryTermSchema = createInsertSchema(glossaryTerms).omit({
  id: true,
  createdAt: true,
});

export const insertCaseStudySchema = createInsertSchema(caseStudies).omit({
  id: true,
  createdAt: true,
});

export const insertDiscussionPromptSchema = createInsertSchema(discussionPrompts).omit({
  id: true,
  createdAt: true,
});

export const insertStudentReflectionSchema = createInsertSchema(studentReflections).omit({
  id: true,
  createdAt: true,
});

export const insertAssessmentSchema = createInsertSchema(assessments).omit({
  id: true,
  createdAt: true,
});

export const insertStudentAssessmentSchema = createInsertSchema(studentAssessments).omit({
  id: true,
  startedAt: true,
  completedAt: true,
});

export const insertSessionAnalyticsSchema = createInsertSchema(sessionAnalytics).omit({
  id: true,
  createdAt: true,
});

export const insertCustomScenarioSchema = createInsertSchema(customScenarios).omit({
  id: true,
  createdAt: true,
});

export const insertUserSettingsSchema = createInsertSchema(userSettings).omit({
  id: true,
  updatedAt: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertSimulationSession = z.infer<typeof insertSimulationSessionSchema>;
export type SimulationSession = typeof simulationSessions.$inferSelect;
export type InsertSessionDecision = z.infer<typeof insertSessionDecisionSchema>;
export type SessionDecision = typeof sessionDecisions.$inferSelect;
export type InsertMultiplayerRoom = z.infer<typeof insertMultiplayerRoomSchema>;
export type MultiplayerRoom = typeof multiplayerRooms.$inferSelect;
export type InsertRoomParticipant = z.infer<typeof insertRoomParticipantSchema>;
export type RoomParticipant = typeof roomParticipants.$inferSelect;

export type InsertTeacher = z.infer<typeof insertTeacherSchema>;
export type Teacher = typeof teachers.$inferSelect;
export type InsertClass = z.infer<typeof insertClassSchema>;
export type Class = typeof classes.$inferSelect;
export type InsertClassStudent = z.infer<typeof insertClassStudentSchema>;
export type ClassStudent = typeof classStudents.$inferSelect;
export type InsertGlossaryTerm = z.infer<typeof insertGlossaryTermSchema>;
export type GlossaryTerm = typeof glossaryTerms.$inferSelect;
export type InsertCaseStudy = z.infer<typeof insertCaseStudySchema>;
export type CaseStudy = typeof caseStudies.$inferSelect;
export type InsertDiscussionPrompt = z.infer<typeof insertDiscussionPromptSchema>;
export type DiscussionPrompt = typeof discussionPrompts.$inferSelect;
export type InsertStudentReflection = z.infer<typeof insertStudentReflectionSchema>;
export type StudentReflection = typeof studentReflections.$inferSelect;
export type InsertAssessment = z.infer<typeof insertAssessmentSchema>;
export type Assessment = typeof assessments.$inferSelect;
export type InsertStudentAssessment = z.infer<typeof insertStudentAssessmentSchema>;
export type StudentAssessment = typeof studentAssessments.$inferSelect;
export type InsertSessionAnalytics = z.infer<typeof insertSessionAnalyticsSchema>;
export type SessionAnalytics = typeof sessionAnalytics.$inferSelect;
export type InsertCustomScenario = z.infer<typeof insertCustomScenarioSchema>;
export type CustomScenario = typeof customScenarios.$inferSelect;
export type InsertUserSettings = z.infer<typeof insertUserSettingsSchema>;
export type UserSettings = typeof userSettings.$inferSelect;
