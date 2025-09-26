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
