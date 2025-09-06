
"use server";

import { generateSessionLog, type GenerateSessionLogInput } from '@/ai/flows/generate-session-log';
import type { LogEntry } from '@/components/SessionLog';

type ActionResult = {
  log?: LogEntry;
  error?: string;
}

export async function createLogEntry(input: GenerateSessionLogInput): Promise<ActionResult> {
  try {
    const { logEntry } = await generateSessionLog(input);
    const newLog: LogEntry = {
      id: new Date().toISOString(),
      elapsedTime: input.elapsedTime,
      description: input.description,
      generatedLog: logEntry,
    };
    return { log: newLog };
  } catch (error) {
    console.error("Error generating session log:", error);
    return { error: "Failed to generate log entry." };
  }
}
