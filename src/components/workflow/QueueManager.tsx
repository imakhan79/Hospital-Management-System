import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Clock, User, ArrowRight, Play, AlertCircle, PauseCircle } from "lucide-react";
import { QueueEntry, WorkflowStation, WORKFLOW_STAGES } from "@/types/workflow-types";
import { cn } from "@/lib/utils";

interface QueueManagerProps {
    station: WorkflowStation;
    queue: QueueEntry[];
    onCallNext: (entry: QueueEntry) => void;
    onHold: (entry: QueueEntry) => void;
    onComplete?: (entry: QueueEntry) => void;
    title?: string;
}

export function QueueManager({ station, queue, onCallNext, onHold, title }: QueueManagerProps) {
    const waitingPatients = queue.filter(q => q.status === 'waiting');
    const inProgressPatients = queue.filter(q => q.status === 'in_progress');

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'emergency': return 'bg-red-100 text-red-800 border-red-200';
            case 'urgent': return 'bg-orange-100 text-orange-800 border-orange-200';
            default: return 'bg-blue-100 text-blue-800 border-blue-200';
        }
    };

    return (
        <div className="flex flex-col h-full space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">{title || `${WORKFLOW_STAGES[station]} Queue`}</h2>
                <Badge variant="outline" className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>Avg Wait: 12m</span>
                </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
                {/* Waiting List Column */}
                <Card className="md:col-span-2 flex flex-col h-full border-l-4 border-l-blue-500">
                    <CardHeader className="py-3 bg-muted/30">
                        <CardTitle className="text-sm font-medium flex justify-between">
                            <span>Waiting for Call Out ({waitingPatients.length})</span>
                            <span className="text-xs text-muted-foreground uppercase tracking-wider">Queue</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 flex-1 overflow-hidden">
                        <ScrollArea className="h-full">
                            <div className="divide-y">
                                {waitingPatients.length === 0 ? (
                                    <div className="p-8 text-center text-muted-foreground">
                                        <User className="w-12 h-12 mx-auto mb-2 opacity-20" />
                                        <p>No patients in waiting queue.</p>
                                    </div>
                                ) : (
                                    waitingPatients.map((entry) => (
                                        <div key={entry.id} className="p-4 hover:bg-muted/50 transition-colors flex items-center justify-between group">
                                            <div className="flex items-start gap-3">
                                                <div className={cn("w-2 h-12 rounded-full", getPriorityColor(entry.priority).split(' ')[0])} />
                                                <div>
                                                    <div className="font-semibold flex items-center gap-2">
                                                        {entry.patientName}
                                                        <Badge variant="secondary" className="text-[10px] h-5">{entry.mrNumber}</Badge>
                                                    </div>
                                                    <div className="text-sm text-muted-foreground flex items-center gap-3 mt-1">
                                                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {entry.waitTime}m wait</span>
                                                        <span className={cn("text-[10px] px-1.5 py-0.5 rounded border", getPriorityColor(entry.priority))}>
                                                            {entry.priority}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => onHold(entry)} title="Hold">
                                                    <PauseCircle className="w-4 h-4 text-orange-500" />
                                                </Button>
                                                <Button size="sm" className="gap-1 bg-blue-600 hover:bg-blue-700" onClick={() => onCallNext(entry)}>
                                                    <Play className="w-4 h-4" /> Call Next
                                                </Button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </ScrollArea>
                    </CardContent>
                </Card>

                {/* In Progress Column */}
                <Card className="flex flex-col h-full border-l-4 border-l-green-500">
                    <CardHeader className="py-3 bg-green-50/50">
                        <CardTitle className="text-sm font-medium flex justify-between">
                            <span>In Progress ({inProgressPatients.length})</span>
                            <span className="text-xs text-muted-foreground uppercase tracking-wider">Active</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 flex-1 overflow-hidden flex flex-col gap-3">
                        {inProgressPatients.map((entry) => (
                            <div key={entry.id} className="bg-white p-4 rounded-lg border shadow-sm">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <h3 className="font-bold text-lg">{entry.patientName}</h3>
                                        <p className="text-sm text-muted-foreground">{entry.mrNumber}</p>
                                    </div>
                                    <Badge variant="outline" className="animate-pulse bg-green-100 text-green-700 border-green-200">
                                        In Consultation
                                    </Badge>
                                </div>

                                <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground mb-4">
                                    <div className="flex flex-col">
                                        <span className="text-xs">Started</span>
                                        <span className="font-medium text-foreground">10:42 AM</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs">Duration</span>
                                        <span className="font-medium text-foreground">14m</span>
                                    </div>
                                </div>

                                <Button className="w-full" variant="outline">
                                    Open Record <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            </div>
                        ))}

                        {inProgressPatients.length === 0 && (
                            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground text-center p-4">
                                <AlertCircle className="w-10 h-10 mb-2 opacity-20" />
                                <p className="text-sm">No active patients.</p>
                                <p className="text-xs">Call a patient from the queue to start.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
