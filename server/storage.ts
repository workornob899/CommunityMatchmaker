import { users, profiles, matches, type User, type InsertUser, type Profile, type InsertProfile, type Match, type InsertMatch } from "@shared/schema";
import { db } from "./db";
import { eq, and, or, desc, sql } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserEmail(id: number, email: string): Promise<User | undefined>;
  updateUserPassword(id: number, password: string): Promise<User | undefined>;

  // Profile methods
  getAllProfiles(): Promise<Profile[]>;
  getProfile(id: number): Promise<Profile | undefined>;
  createProfile(profile: InsertProfile): Promise<Profile>;
  updateProfile(id: number, profile: Partial<InsertProfile>): Promise<Profile | undefined>;
  deleteProfile(id: number): Promise<boolean>;
  searchProfiles(filters: Partial<{
    gender: string;
    profession: string;
    birthYear: number;
    height: string;
    age: number;
    date: string;
  }>): Promise<Profile[]>;
  getProfilesByGender(gender: string): Promise<Profile[]>;

  // Match methods
  createMatch(match: InsertMatch): Promise<Match>;
  getMatchesForProfile(profileId: number): Promise<Match[]>;
  getRecentMatches(): Promise<Array<Match & { profile: Profile; matchedProfile: Profile }>>;

  // Statistics
  getProfileStats(): Promise<{
    totalProfiles: number;
    brideProfiles: number;
    groomProfiles: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
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

  async updateUserEmail(id: number, email: string): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({ email })
      .where(eq(users.id, id))
      .returning();
    return user || undefined;
  }

  async updateUserPassword(id: number, password: string): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({ password })
      .where(eq(users.id, id))
      .returning();
    return user || undefined;
  }

  async getAllProfiles(): Promise<Profile[]> {
    return await db.select().from(profiles).orderBy(desc(profiles.createdAt));
  }

  async getProfile(id: number): Promise<Profile | undefined> {
    const [profile] = await db.select().from(profiles).where(eq(profiles.id, id));
    return profile || undefined;
  }

  async createProfile(profile: InsertProfile): Promise<Profile> {
    const [newProfile] = await db
      .insert(profiles)
      .values({
        ...profile,
        updatedAt: new Date(),
      })
      .returning();
    return newProfile;
  }

  async updateProfile(id: number, profile: Partial<InsertProfile>): Promise<Profile | undefined> {
    const [updatedProfile] = await db
      .update(profiles)
      .set({
        ...profile,
        updatedAt: new Date(),
      })
      .where(eq(profiles.id, id))
      .returning();
    return updatedProfile || undefined;
  }

  async deleteProfile(id: number): Promise<boolean> {
    const result = await db.delete(profiles).where(eq(profiles.id, id));
    return (result.rowCount || 0) > 0;
  }

  async searchProfiles(filters: Partial<{
    gender: string;
    profession: string;
    birthYear: number;
    height: string;
    age: number;
    date: string;
  }>): Promise<Profile[]> {
    let query = db.select().from(profiles);
    
    const conditions = [];
    
    if (filters.gender) {
      conditions.push(eq(profiles.gender, filters.gender));
    }
    
    if (filters.profession) {
      conditions.push(sql`${profiles.profession} ILIKE ${`%${filters.profession}%`}`);
    }
    
    if (filters.birthYear) {
      conditions.push(eq(profiles.birthYear, filters.birthYear));
    }
    
    if (filters.height) {
      conditions.push(eq(profiles.height, filters.height));
    }
    
    if (filters.age) {
      const currentYear = new Date().getFullYear();
      const birthYear = currentYear - filters.age;
      conditions.push(eq(profiles.birthYear, birthYear));
    }
    
    if (conditions.length > 0) {
      const result = await query.where(and(...conditions)).orderBy(desc(profiles.createdAt));
      return result;
    }
    
    return await query.orderBy(desc(profiles.createdAt));
  }

  async getProfilesByGender(gender: string): Promise<Profile[]> {
    return await db.select().from(profiles).where(eq(profiles.gender, gender));
  }

  async createMatch(match: InsertMatch): Promise<Match> {
    const [newMatch] = await db
      .insert(matches)
      .values(match)
      .returning();
    return newMatch;
  }

  async getMatchesForProfile(profileId: number): Promise<Match[]> {
    return await db.select().from(matches).where(
      or(
        eq(matches.profileId, profileId),
        eq(matches.matchedProfileId, profileId)
      )
    );
  }

  async getRecentMatches(): Promise<Array<Match & { profile: Profile; matchedProfile: Profile }>> {
    const result = await db
      .select({
        match: matches,
        profile: profiles,
        matchedProfile: {
          id: sql`mp.id`,
          name: sql`mp.name`,
          age: sql`mp.age`,
          gender: sql`mp.gender`,
          profession: sql`mp.profession`,
          height: sql`mp.height`,
          profilePicture: sql`mp.profile_picture`,
          document: sql`mp.document`,
          birthYear: sql`mp.birth_year`,
          createdAt: sql`mp.created_at`,
          updatedAt: sql`mp.updated_at`,
        }
      })
      .from(matches)
      .innerJoin(profiles, eq(matches.profileId, profiles.id))
      .innerJoin(sql`profiles mp`, sql`matches.matched_profile_id = mp.id`)
      .orderBy(desc(matches.createdAt))
      .limit(10);

    return result.map(r => ({
      ...r.match,
      profile: r.profile,
      matchedProfile: r.matchedProfile as Profile,
    }));
  }

  async getProfileStats(): Promise<{
    totalProfiles: number;
    brideProfiles: number;
    groomProfiles: number;
  }> {
    const totalResult = await db.select({ count: sql<number>`count(*)` }).from(profiles);
    const brideResult = await db.select({ count: sql<number>`count(*)` }).from(profiles).where(eq(profiles.gender, 'Female'));
    const groomResult = await db.select({ count: sql<number>`count(*)` }).from(profiles).where(eq(profiles.gender, 'Male'));

    return {
      totalProfiles: totalResult[0]?.count || 0,
      brideProfiles: brideResult[0]?.count || 0,
      groomProfiles: groomResult[0]?.count || 0,
    };
  }
}

export const storage = new DatabaseStorage();
