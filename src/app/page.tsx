"use client";

import { useState } from 'react';
import { Timer } from '@/components/Timer';
import { SessionLog, type LogEntry } from '@/components/SessionLog';

export default function Home() {
  const [logs, setLogs] = useState<LogEntry[]>([]);

  const addLog = (newLog: LogEntry) => {
    setLogs((prevLogs) => [newLog, ...prevLogs]);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 md:p-12 bg-background">
      <div className="w-full max-w-2xl mx-auto space-y-12">
        <header className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-primary tracking-tight font-headline">
            Ad Hoc Time
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Your simple, private timer for billable hours.
          </p>
        </header>
        
        <Timer onLog={addLog} />

        <SessionLog logs={logs} />
      </div>
    </main>
  );
}
