import { index, pgTable, text, integer, timestamp, jsonb, boolean } from "drizzle-orm/pg-core";

export const leads = pgTable(
  "leads",
  {
    id: text("id").primaryKey(), // vapi call_id — natural dedup key
    dealerEmail: text("dealer_email").notNull(),

    callerName: text("caller_name"),
    callerPhone: text("caller_phone"),
    locality: text("locality"),
    budget: text("budget"),
    propertyType: text("property_type"),
    timeline: text("timeline"),
    score: integer("score"),

    summary: text("summary"),
    transcript: text("transcript"),
    recordingUrl: text("recording_url"),

    status: text("status").notNull().default("new"),
    scoringStatus: text("scoring_status").notNull().default("pending"),
    alertSent: boolean("alert_sent").notNull().default(false),

    rawPayload: jsonb("raw_payload"),

    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    index("leads_dealer_email_idx").on(table.dealerEmail),
    index("leads_created_at_idx").on(table.createdAt),
  ],
);

export type Lead = typeof leads.$inferSelect;
export type NewLead = typeof leads.$inferInsert;
