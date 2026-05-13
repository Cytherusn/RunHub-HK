import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// ─── Community Runs ───────────────────────────────────────────────────────────
export const communityRuns = sqliteTable("community_runs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  hostId: integer("host_id").notNull(),
  title: text("title").notNull(),
  runType: text("run_type").notNull(),
  date: text("date").notNull(),
  startTime: text("start_time").notNull(),
  meetingPoint: text("meeting_point").notNull(),
  meetingLat: real("meeting_lat"),
  meetingLng: real("meeting_lng"),
  distanceKm: real("distance_km").notNull(),
  paceMin: text("pace_min"),
  paceMax: text("pace_max"),
  maxParticipants: integer("max_participants"),
  description: text("description"),
  visibility: text("visibility").notNull().default("public"),
  status: text("status").notNull().default("active"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const insertCommunityRunSchema = createInsertSchema(communityRuns).omit({ id: true });
export type InsertCommunityRun = z.infer<typeof insertCommunityRunSchema>;
export type CommunityRun = typeof communityRuns.$inferSelect;

// ─── Run Participants ─────────────────────────────────────────────────────────
export const runParticipants = sqliteTable("run_participants", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  runId: integer("run_id").notNull(),
  userId: integer("user_id").notNull(),
  status: text("status").notNull().default("joined"),
  joinedAt: text("joined_at").notNull(),
});

export const insertRunParticipantSchema = createInsertSchema(runParticipants).omit({ id: true });
export type InsertRunParticipant = z.infer<typeof insertRunParticipantSchema>;
export type RunParticipant = typeof runParticipants.$inferSelect;

// ─── Run Chat Messages ────────────────────────────────────────────────────────
export const runMessages = sqliteTable("run_messages", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  runId: integer("run_id").notNull(),
  userId: integer("user_id").notNull(),
  message: text("message").notNull(),
  createdAt: text("created_at").notNull(),
});

export const insertRunMessageSchema = createInsertSchema(runMessages).omit({ id: true });
export type InsertRunMessage = z.infer<typeof insertRunMessageSchema>;
export type RunMessage = typeof runMessages.$inferSelect;

// ─── Run Ratings ──────────────────────────────────────────────────────────────
export const runRatings = sqliteTable("run_ratings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  runId: integer("run_id").notNull(),
  raterId: integer("rater_id").notNull(),
  hostId: integer("host_id").notNull(),
  stars: integer("stars").notNull(),
  review: text("review"),
  createdAt: text("created_at").notNull(),
});

export const insertRunRatingSchema = createInsertSchema(runRatings).omit({ id: true });
export type InsertRunRating = z.infer<typeof insertRunRatingSchema>;
export type RunRating = typeof runRatings.$inferSelect;

// ─── Users ────────────────────────────────────────────────────────────────────
export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  handle: text("handle").notNull(),
  avatarInitials: text("avatar_initials").notNull(),
  avatarColor: text("avatar_color").notNull(),
  location: text("location").notNull().default("Hong Kong"),
  bio: text("bio"),
  gender: text("gender"), // 'male', 'female', 'prefer-not-to-say'
  profilePictureUrl: text("profile_picture_url"), // URL to uploaded profile photo
  runningSince: integer("running_since"), // Year they started running
  preferredPace: text("preferred_pace"), // e.g. "6:30/km"
  personalRecords: text("personal_records"), // JSON string: [{distance, time, date}]
  preferredTypes: text("preferred_types"), // JSON string: ["Trail", "Road", "Track", etc]
  totalRuns: integer("total_runs").notNull().default(0),
  totalHosted: integer("total_hosted").notNull().default(0),
  totalRsvps: integer("total_rsvps").notNull().default(0),
  avgRating: real("avg_rating"),
  createdAt: text("created_at").notNull(),
  email: text("email"),
  passwordHash: text("password_hash"),
  googleId: text("google_id"),
  googleAvatar: text("google_avatar"),
  authProvider: text("auth_provider").notNull().default("local"),
  role: text("role").notNull().default("user"),
});

export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
