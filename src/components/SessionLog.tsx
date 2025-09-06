import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { FileText } from 'lucide-react';

export interface LogEntry {
  id: string;
  elapsedTime: string;
  description: string;
  generatedLog: string;
}

interface SessionLogProps {
  logs: LogEntry[];
}

export function SessionLog({ logs }: SessionLogProps) {
  if (logs.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <FileText className="h-5 w-5 text-primary" />
        <h2 className="text-2xl font-semibold tracking-tight">Session Log</h2>
      </div>
      <Card className="shadow-lg">
        <CardContent className="p-0">
          <ScrollArea className="h-72">
            <div className="p-6 space-y-6">
              {logs.map((log, index) => (
                <div key={log.id}>
                  <div className="space-y-1">
                    <p className="font-semibold">{log.description}</p>
                    <p className="text-sm text-muted-foreground">
                      Time Logged: {log.elapsedTime}
                    </p>
                  </div>
                  <div className="mt-2 p-4 bg-secondary/50 rounded-md border text-sm text-foreground/80 whitespace-pre-wrap">
                    <p className="font-medium text-foreground mb-2">AI Generated Entry:</p>
                    {log.generatedLog}
                  </div>
                  {index < logs.length - 1 && <Separator className="mt-6" />}
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
