"use client";

import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AddSessionDialog } from '@/components/AddSessionDialog';
import { formatTime } from '@/lib/utils';
import type { LogEntry } from '@/components/SessionLog';

interface TimerProps {
  onLog: (log: LogEntry) => void;
}

export function Timer({ onLog }: TimerProps) {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setElapsedTime((prevTime) => prevTime + 1);
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  const handleStartStop = () => {
    if (isRunning) {
      setIsRunning(false);
      if (elapsedTime > 0) {
        setIsDialogOpen(true);
      }
    } else {
      setIsRunning(true);
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setElapsedTime(0);
  };

  const handleLogSuccess = (log: LogEntry) => {
    onLog(log);
    handleReset();
  };

  return (
    <>
      <Card className="shadow-lg">
        <CardContent className="p-8 flex flex-col items-center justify-center gap-8">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Elapsed Time</p>
            <p className="text-6xl md:text-7xl font-bold font-mono tracking-tighter text-foreground tabular-nums">
              {formatTime(elapsedTime)}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Button
              size="lg"
              onClick={handleStartStop}
              className="w-32 bg-primary hover:bg-primary/90"
            >
              {isRunning ? <Pause className="mr-2 h-5 w-5" /> : <Play className="mr-2 h-5 w-5" />}
              {isRunning ? 'Stop' : 'Start'}
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={handleReset}
              disabled={elapsedTime === 0 && !isRunning}
              className="w-32"
            >
              <RotateCcw className="mr-2 h-5 w-5" />
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>
      <AddSessionDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        elapsedTime={elapsedTime}
        onLogSuccess={handleLogSuccess}
      />
    </>
  );
}
