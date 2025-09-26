import { 
  type User, 
  type InsertUser, 
  type SimulationSession, 
  type InsertSimulationSession, 
  type SessionDecision, 
  type InsertSessionDecision,
  type MultiplayerRoom,
  type InsertMultiplayerRoom,
  type RoomParticipant,
  type InsertRoomParticipant,
  users, 
  simulationSessions, 
  sessionDecisions,
  multiplayerRooms,
  roomParticipants 
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Simulation session operations
  createSession(session: InsertSimulationSession): Promise<SimulationSession>;
  getSession(id: string): Promise<SimulationSession | undefined>;
  getUserSessions(userId: string): Promise<SimulationSession[]>;
  updateSession(id: string, updates: Partial<SimulationSession>): Promise<SimulationSession | undefined>;
  
  // Decision operations
  addDecision(decision: InsertSessionDecision): Promise<SessionDecision>;
  getSessionDecisions(sessionId: string): Promise<SessionDecision[]>;
  
  // Multiplayer operations
  createRoom(room: InsertMultiplayerRoom): Promise<MultiplayerRoom>;
  getRoom(id: string): Promise<MultiplayerRoom | undefined>;
  getActiveRooms(): Promise<MultiplayerRoom[]>;
  joinRoom(participant: InsertRoomParticipant): Promise<RoomParticipant>;
  getRoomParticipants(roomId: string): Promise<RoomParticipant[]>;
  updateRoom(id: string, updates: Partial<MultiplayerRoom>): Promise<MultiplayerRoom | undefined>;
  
  // Analytics operations
  getAggregatedStats(): Promise<{
    totalSessions: number;
    completedSessions: number;
    averageCooperationScore: number;
    averageCautionScore: number;
    averageAggressionScore: number;
    profileDistribution: Record<string, number>;
    contextDistribution: Record<string, number>;
  }>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  // Simulation session operations
  async createSession(session: InsertSimulationSession): Promise<SimulationSession> {
    const [newSession] = await db
      .insert(simulationSessions)
      .values(session)
      .returning();
    return newSession;
  }

  async getSession(id: string): Promise<SimulationSession | undefined> {
    const [session] = await db
      .select()
      .from(simulationSessions)
      .where(eq(simulationSessions.id, id));
    return session || undefined;
  }

  async getUserSessions(userId: string): Promise<SimulationSession[]> {
    return await db
      .select()
      .from(simulationSessions)
      .where(eq(simulationSessions.userId, userId))
      .orderBy(desc(simulationSessions.createdAt));
  }

  async updateSession(id: string, updates: Partial<SimulationSession>): Promise<SimulationSession | undefined> {
    const [updatedSession] = await db
      .update(simulationSessions)
      .set(updates)
      .where(eq(simulationSessions.id, id))
      .returning();
    return updatedSession || undefined;
  }

  // Decision operations
  async addDecision(decision: InsertSessionDecision): Promise<SessionDecision> {
    const [newDecision] = await db
      .insert(sessionDecisions)
      .values(decision)
      .returning();
    return newDecision;
  }

  async getSessionDecisions(sessionId: string): Promise<SessionDecision[]> {
    return await db
      .select()
      .from(sessionDecisions)
      .where(eq(sessionDecisions.sessionId, sessionId))
      .orderBy(sessionDecisions.scenarioIndex);
  }

  // Multiplayer operations
  async createRoom(room: InsertMultiplayerRoom): Promise<MultiplayerRoom> {
    const [newRoom] = await db
      .insert(multiplayerRooms)
      .values(room)
      .returning();
    return newRoom;
  }

  async getRoom(id: string): Promise<MultiplayerRoom | undefined> {
    const [room] = await db
      .select()
      .from(multiplayerRooms)
      .where(eq(multiplayerRooms.id, id));
    return room || undefined;
  }

  async getActiveRooms(): Promise<MultiplayerRoom[]> {
    return await db
      .select()
      .from(multiplayerRooms)
      .where(eq(multiplayerRooms.isActive, 1))
      .orderBy(desc(multiplayerRooms.createdAt));
  }

  async joinRoom(participant: InsertRoomParticipant): Promise<RoomParticipant> {
    const [newParticipant] = await db
      .insert(roomParticipants)
      .values(participant)
      .returning();
    return newParticipant;
  }

  async getRoomParticipants(roomId: string): Promise<RoomParticipant[]> {
    return await db
      .select()
      .from(roomParticipants)
      .where(eq(roomParticipants.roomId, roomId));
  }

  async updateRoom(id: string, updates: Partial<MultiplayerRoom>): Promise<MultiplayerRoom | undefined> {
    const [updatedRoom] = await db
      .update(multiplayerRooms)
      .set(updates)
      .where(eq(multiplayerRooms.id, id))
      .returning();
    return updatedRoom || undefined;
  }

  // Analytics operations
  async getAggregatedStats(): Promise<{
    totalSessions: number;
    completedSessions: number;
    averageCooperationScore: number;
    averageCautionScore: number;
    averageAggressionScore: number;
    profileDistribution: Record<string, number>;
    contextDistribution: Record<string, number>;
  }> {
    // Get basic counts
    const allSessions = await db.select().from(simulationSessions);
    const completedSessions = allSessions.filter(s => s.isCompleted === 1);
    
    const totalSessions = allSessions.length;
    const completedCount = completedSessions.length;
    
    if (completedCount === 0) {
      return {
        totalSessions,
        completedSessions: completedCount,
        averageCooperationScore: 0,
        averageCautionScore: 0,
        averageAggressionScore: 0,
        profileDistribution: {},
        contextDistribution: {}
      };
    }
    
    // Calculate averages
    const avgCooperation = completedSessions.reduce((sum, s) => sum + s.cooperationScore, 0) / completedCount;
    const avgCaution = completedSessions.reduce((sum, s) => sum + s.cautionScore, 0) / completedCount;
    const avgAggression = completedSessions.reduce((sum, s) => sum + s.aggressionScore, 0) / completedCount;
    
    // Calculate distributions
    const profileDistribution: Record<string, number> = {};
    const contextDistribution: Record<string, number> = {};
    
    completedSessions.forEach(session => {
      if (session.profileType) {
        profileDistribution[session.profileType] = (profileDistribution[session.profileType] || 0) + 1;
      }
      contextDistribution[session.educationContext] = (contextDistribution[session.educationContext] || 0) + 1;
    });
    
    return {
      totalSessions,
      completedSessions: completedCount,
      averageCooperationScore: avgCooperation,
      averageCautionScore: avgCaution,
      averageAggressionScore: avgAggression,
      profileDistribution,
      contextDistribution
    };
  }
}

export const storage = new DatabaseStorage();
