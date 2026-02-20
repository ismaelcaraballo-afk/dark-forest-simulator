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
  type Teacher,
  type InsertTeacher,
  type Class,
  type InsertClass,
  type ClassStudent,
  type InsertClassStudent,
  users, 
  simulationSessions, 
  sessionDecisions,
  multiplayerRooms,
  roomParticipants,
  teachers,
  classes,
  classStudents 
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
  
  // Teacher operations
  createTeacher(teacher: InsertTeacher): Promise<Teacher>;
  getTeacher(id: string): Promise<Teacher | undefined>;
  getTeacherByUserId(userId: string): Promise<Teacher | undefined>;
  
  // Class operations
  createClass(cls: InsertClass): Promise<Class>;
  getClass(id: string): Promise<Class | undefined>;
  getClassBySessionCode(sessionCode: string): Promise<Class | undefined>;
  getTeacherClasses(teacherId: string): Promise<Class[]>;
  updateClass(id: string, updates: Partial<Class>): Promise<Class | undefined>;
  
  // Class student operations
  addStudentToClass(classStudent: InsertClassStudent): Promise<ClassStudent>;
  getClassStudents(classId: string): Promise<(ClassStudent & { user: User })[]>;
  getStudentClasses(userId: string): Promise<(ClassStudent & { class: Class })[]>;
  removeStudentFromClass(classId: string, userId: string): Promise<boolean>;
  
  // Teacher analytics
  getTeacherAnalytics(teacherId: string): Promise<{
    totalClasses: number;
    totalStudents: number;
    activeSessions: number;
    completedSessions: number;
    averageScores: {
      cooperation: number;
      caution: number;
      aggression: number;
    };
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

  // Teacher operations
  async createTeacher(teacher: InsertTeacher): Promise<Teacher> {
    const [newTeacher] = await db
      .insert(teachers)
      .values(teacher)
      .returning();
    return newTeacher;
  }

  async getTeacher(id: string): Promise<Teacher | undefined> {
    const [teacher] = await db.select().from(teachers).where(eq(teachers.id, id));
    return teacher || undefined;
  }

  async getTeacherByUserId(userId: string): Promise<Teacher | undefined> {
    const [teacher] = await db.select().from(teachers).where(eq(teachers.userId, userId));
    return teacher || undefined;
  }

  // Class operations
  async createClass(cls: InsertClass): Promise<Class> {
    const [newClass] = await db
      .insert(classes)
      .values(cls)
      .returning();
    return newClass;
  }

  async getClass(id: string): Promise<Class | undefined> {
    const [cls] = await db.select().from(classes).where(eq(classes.id, id));
    return cls || undefined;
  }

  async getClassBySessionCode(sessionCode: string): Promise<Class | undefined> {
    const [cls] = await db.select().from(classes).where(eq(classes.sessionCode, sessionCode));
    return cls || undefined;
  }

  async getTeacherClasses(teacherId: string): Promise<Class[]> {
    return await db
      .select()
      .from(classes)
      .where(eq(classes.teacherId, teacherId))
      .orderBy(desc(classes.createdAt));
  }

  async updateClass(id: string, updates: Partial<Class>): Promise<Class | undefined> {
    const [updatedClass] = await db
      .update(classes)
      .set(updates)
      .where(eq(classes.id, id))
      .returning();
    return updatedClass || undefined;
  }

  // Class student operations
  async addStudentToClass(classStudent: InsertClassStudent): Promise<ClassStudent> {
    const [newClassStudent] = await db
      .insert(classStudents)
      .values(classStudent)
      .returning();
    return newClassStudent;
  }

  async getClassStudents(classId: string): Promise<(ClassStudent & { user: User })[]> {
    return await db
      .select({
        id: classStudents.id,
        classId: classStudents.classId,
        userId: classStudents.userId,
        joinedAt: classStudents.joinedAt,
        user: users
      })
      .from(classStudents)
      .innerJoin(users, eq(classStudents.userId, users.id))
      .where(eq(classStudents.classId, classId))
      .orderBy(classStudents.joinedAt);
  }

  async getStudentClasses(userId: string): Promise<(ClassStudent & { class: Class })[]> {
    return await db
      .select({
        id: classStudents.id,
        classId: classStudents.classId,
        userId: classStudents.userId,
        joinedAt: classStudents.joinedAt,
        class: classes
      })
      .from(classStudents)
      .innerJoin(classes, eq(classStudents.classId, classes.id))
      .where(eq(classStudents.userId, userId))
      .orderBy(classStudents.joinedAt);
  }

  async removeStudentFromClass(classId: string, userId: string): Promise<boolean> {
    const result = await db
      .delete(classStudents)
      .where(and(eq(classStudents.classId, classId), eq(classStudents.userId, userId)));
    return (result.rowCount ?? 0) > 0;
  }

  // Teacher analytics
  async getTeacherAnalytics(teacherId: string): Promise<{
    totalClasses: number;
    totalStudents: number;
    activeSessions: number;
    completedSessions: number;
    averageScores: {
      cooperation: number;
      caution: number;
      aggression: number;
    };
  }> {
    // Get teacher's classes
    const teacherClasses = await this.getTeacherClasses(teacherId);
    const classIds = teacherClasses.map(c => c.id);
    
    if (classIds.length === 0) {
      return {
        totalClasses: 0,
        totalStudents: 0,
        activeSessions: 0,
        completedSessions: 0,
        averageScores: { cooperation: 0, caution: 0, aggression: 0 }
      };
    }

    // Get total students across all classes
    let totalStudents = 0;
    for (const classId of classIds) {
      const students = await this.getClassStudents(classId);
      totalStudents += students.length;
    }

    // Get sessions from students in teacher's classes
    const allStudentIds: string[] = [];
    for (const classId of classIds) {
      const students = await this.getClassStudents(classId);
      allStudentIds.push(...students.map(s => s.userId));
    }

    // Get sessions for these students
    const studentSessions = await db
      .select()
      .from(simulationSessions)
      .where(eq(simulationSessions.userId, allStudentIds[0])); // Simplified for now

    const activeSessions = studentSessions.filter(s => s.isCompleted === 0).length;
    const completedSessions = studentSessions.filter(s => s.isCompleted === 1).length;

    // Calculate average scores
    const completed = studentSessions.filter(s => s.isCompleted === 1);
    const avgCooperation = completed.length > 0 ? completed.reduce((sum, s) => sum + s.cooperationScore, 0) / completed.length : 0;
    const avgCaution = completed.length > 0 ? completed.reduce((sum, s) => sum + s.cautionScore, 0) / completed.length : 0;
    const avgAggression = completed.length > 0 ? completed.reduce((sum, s) => sum + s.aggressionScore, 0) / completed.length : 0;

    return {
      totalClasses: teacherClasses.length,
      totalStudents,
      activeSessions,
      completedSessions,
      averageScores: {
        cooperation: avgCooperation,
        caution: avgCaution,
        aggression: avgAggression
      }
    };
  }
}

export const storage = new DatabaseStorage();
