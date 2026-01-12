import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { AlertTriangle, Clock, Heart, CheckCircle2, ChevronRight, ChevronLeft, AlertOctagon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { MTS_PROTOCOLS, MTSPresentingComplaint, TRIAGE_LEVELS, TriageLevel } from "@/data/mts-protocols";
import { calculateTriageLevel, getTriageColor, getTriageLabel, VitalSigns } from "@/lib/triage-engine";
import { cn } from "@/lib/utils";

// Mock Data
import { QueueManager } from "@/components/workflow/QueueManager";
import { QueueEntry } from "@/types/workflow-types";

// Mock Data adapted for QueueManager
const MOCK_TRIAGE_QUEUE: QueueEntry[] = [
  { id: "Q1", patientId: "1", patientName: "Hassan Ali", mrNumber: "ER-003", encounterId: "E1", station: "vitals", status: "waiting", priority: "urgent", checkInTime: "15:30", waitTime: 12, notes: "Severe headache" },
  { id: "Q2", patientId: "2", patientName: "Mariam Shah", mrNumber: "ER-004", encounterId: "E2", station: "vitals", status: "waiting", priority: "emergency", checkInTime: "15:15", waitTime: 27, notes: "Chest pain" },
  { id: "Q3", patientId: "3", patientName: "Abdullah Khan", mrNumber: "ER-005", encounterId: "E3", station: "vitals", status: "in_progress", priority: "routine", checkInTime: "15:45", waitTime: 5, notes: "Minor cut" },
];

type WizardStep = 1 | 2 | 3 | 4;

export function TriageManagement() {
  const { toast } = useToast();
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<WizardStep>(1);

  // Assessment State
  const [vitals, setVitals] = useState<VitalSigns>({});
  const [selectedComplaintId, setSelectedComplaintId] = useState<string>("");
  const [selectedDiscriminators, setSelectedDiscriminators] = useState<string[]>([]);
  const [overrideLevel, setOverrideLevel] = useState<string>("");
  const [overrideReason, setOverrideReason] = useState("");

  const selectedPatient = MOCK_TRIAGE_QUEUE.find(p => p.patientId === selectedPatientId);
  const selectedComplaint = MTS_PROTOCOLS.find(c => c.id === selectedComplaintId);

  // Calculated Result
  const triageResult = useMemo(() => {
    return calculateTriageLevel(selectedComplaintId, selectedDiscriminators, vitals);
  }, [selectedComplaintId, selectedDiscriminators, vitals]);

  const finalLevel = overrideLevel ? parseInt(overrideLevel) as TriageLevel : triageResult.level;
  const finalReason = overrideLevel ? `Override: ${overrideReason}` : triageResult.reason;

  const handleCallNext = (entry: QueueEntry) => {
    setSelectedPatientId(entry.patientId);
    setStep(1);
    setVitals({});
    setSelectedComplaintId("");
    setSelectedDiscriminators([]);
    setOverrideLevel("");
    setOverrideReason("");
    setIsOpen(true);
  };

  const handleSubmit = () => {
    toast({
      title: "Triage Complete",
      description: `Patient categorized as Level ${finalLevel} (${getTriageLabel(finalLevel)})`,
      variant: finalLevel <= 2 ? "destructive" : "default",
    });
    setIsOpen(false);
  };

  const getStepTitle = (s: WizardStep) => {
    switch (s) {
      case 1: return "Patient & Vitals";
      case 2: return "Presenting Complaint";
      case 3: return "Discriminators";
      case 4: return "Review & Assign";
      default: return "";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Manchester Triage System</h2>
          <p className="text-muted-foreground">Standardized patient priority assessment</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground p-2 bg-muted rounded-md">
          <Clock className="h-4 w-4" />
          <span>Queue Average: 12 mins</span>
        </div>
      </div>

      {/* MTS Ladder (Visual Reference) */}
      <div className="grid grid-cols-5 gap-2">
        {(Object.entries(TRIAGE_LEVELS) as [string, typeof TRIAGE_LEVELS[1]][]).map(([lvl, info]) => (
          <div key={lvl} className={cn(
            "p-3 rounded-lg border flex flex-col items-center text-center gap-1",
            info.color === "red" && "bg-red-50 border-red-200 text-red-900",
            info.color === "orange" && "bg-orange-50 border-orange-200 text-orange-900",
            info.color === "yellow" && "bg-yellow-50 border-yellow-200 text-yellow-900",
            info.color === "green" && "bg-green-50 border-green-200 text-green-900",
            info.color === "blue" && "bg-blue-50 border-blue-200 text-blue-900",
          )}>
            <span className="text-lg font-bold">{lvl}</span>
            <span className="text-xs font-semibold uppercase">{info.name}</span>
            <span className="text-[10px] opacity-80">{info.sla} mins</span>
          </div>
        ))}
      </div>

      <div className="h-[600px]">
        <QueueManager
          title="Triage Queue"
          station="vitals"
          queue={MOCK_TRIAGE_QUEUE}
          onCallNext={handleCallNext}
          onHold={() => { }}
        />
      </div>

      {/* Triage Wizard Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-3xl min-h-[500px] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Triage Assessment: {selectedPatient?.patientName}</span>
              <span className="text-sm font-normal text-muted-foreground">Step {step} of 4: {getStepTitle(step)}</span>
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 py-4">
            {/* Step 1: Vitals */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Heart Rate (bpm)</Label>
                    <Input type="number" value={vitals.heartRate || ''} onChange={e => setVitals({ ...vitals, heartRate: parseInt(e.target.value) || undefined })} />
                  </div>
                  <div className="space-y-2">
                    <Label>BP Systolic (mmHg)</Label>
                    <Input type="number" value={vitals.systolicBP || ''} onChange={e => setVitals({ ...vitals, systolicBP: parseInt(e.target.value) || undefined })} />
                  </div>
                  <div className="space-y-2">
                    <Label>SpO2 (%)</Label>
                    <Input type="number" value={vitals.oxygenSaturation || ''} onChange={e => setVitals({ ...vitals, oxygenSaturation: parseInt(e.target.value) || undefined })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Respiratory Rate</Label>
                    <Input type="number" value={vitals.respiratoryRate || ''} onChange={e => setVitals({ ...vitals, respiratoryRate: parseInt(e.target.value) || undefined })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Temperature (°C)</Label>
                    <Input type="number" value={vitals.temperature || ''} onChange={e => setVitals({ ...vitals, temperature: parseFloat(e.target.value) || undefined })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Pain Scale (0-10)</Label>
                    <Input type="number" min="0" max="10" value={vitals.painScale || ''} onChange={e => setVitals({ ...vitals, painScale: parseInt(e.target.value) || undefined })} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Consciousness Level</Label>
                  <Select value={vitals.consciousness} onValueChange={(v: any) => setVitals({ ...vitals, consciousness: v })}>
                    <SelectTrigger><SelectValue placeholder="Select level" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="alert">Alert</SelectItem>
                      <SelectItem value="verbal">Responds to Verbal</SelectItem>
                      <SelectItem value="pain">Responds to Pain</SelectItem>
                      <SelectItem value="unresponsive">Unresponsive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Step 2: Complaint */}
            {step === 2 && (
              <div className="space-y-4">
                <Label>Select Presenting Complaint</Label>
                <div className="grid grid-cols-2 gap-4">
                  {MTS_PROTOCOLS.map(p => (
                    <Button
                      key={p.id}
                      variant={selectedComplaintId === p.id ? "default" : "outline"}
                      className={cn("h-auto py-4 justify-start", selectedComplaintId === p.id && "border-primary ring-2 ring-primary")}
                      onClick={() => setSelectedComplaintId(p.id)}
                    >
                      <div className="text-left">
                        <div className="font-semibold">{p.name}</div>
                        <div className="text-xs opacity-70">{p.discriminators.length} discriminators</div>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Discriminators */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="bg-muted p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Complaint: {selectedComplaint?.name}</h3>
                  <p className="text-sm text-muted-foreground">Select all that apply. The system will calculate the highest priority.</p>
                </div>

                <div className="space-y-2">
                  {selectedComplaint?.discriminators.map(d => (
                    <div key={d.id}
                      className={cn(
                        "flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors hover:bg-accent",
                        selectedDiscriminators.includes(d.id) && "border-primary bg-accent/50"
                      )}
                      onClick={() => {
                        setSelectedDiscriminators(prev =>
                          prev.includes(d.id) ? prev.filter(x => x !== d.id) : [...prev, d.id]
                        );
                      }}
                    >
                      <div className={cn("w-4 h-4 rounded-full border border-primary", selectedDiscriminators.includes(d.id) ? "bg-primary" : "bg-transparent")} />
                      <div className="flex-1">
                        <span className="font-medium">{d.description}</span>
                      </div>
                      <Badge variant="outline" className={cn(
                        d.level === 1 && "text-red-600 border-red-200",
                        d.level === 2 && "text-orange-600 border-orange-200",
                        d.level === 3 && "text-yellow-600 border-yellow-200",
                        d.level === 4 && "text-green-600 border-green-200",
                      )}>Level {d.level}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 4: Result */}
            {step === 4 && (
              <div className="space-y-6">
                <div className={cn(
                  "p-6 rounded-xl border-2 text-center space-y-2",
                  getTriageColor(finalLevel) === "red" && "bg-red-50 border-red-500 text-red-900",
                  getTriageColor(finalLevel) === "orange" && "bg-orange-50 border-orange-500 text-orange-900",
                  getTriageColor(finalLevel) === "yellow" && "bg-yellow-50 border-yellow-500 text-yellow-900",
                  getTriageColor(finalLevel) === "green" && "bg-green-50 border-green-500 text-green-900",
                  getTriageColor(finalLevel) === "blue" && "bg-blue-50 border-blue-500 text-blue-900",
                )}>
                  <h3 className="text-lg uppercase tracking-widest font-semibold">Triage Category</h3>
                  <div className="text-5xl font-black">{finalLevel} - {getTriageLabel(finalLevel)}</div>
                  <p className="font-medium">Target Time: {TRIAGE_LEVELS[finalLevel].sla} minutes</p>
                  <div className="pt-4 border-t border-black/10 mt-4 text-sm">
                    <strong>Basis:</strong> {finalReason}
                  </div>
                </div>

                <div className="space-y-4 pt-4">
                  <div className="flex items-center gap-4">
                    <Label>Manual Override?</Label>
                    <Select value={overrideLevel} onValueChange={setOverrideLevel}>
                      <SelectTrigger className="w-[200px]"><SelectValue placeholder="No Override" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">No Override</SelectItem>
                        <SelectItem value="1">Level 1 - Immediate</SelectItem>
                        <SelectItem value="2">Level 2 - Very Urgent</SelectItem>
                        <SelectItem value="3">Level 3 - Urgent</SelectItem>
                        <SelectItem value="4">Level 4 - Standard</SelectItem>
                        <SelectItem value="5">Level 5 - Non-Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {overrideLevel && (
                    <Textarea
                      placeholder="Please provide a clinical justification for overriding the system calculation..."
                      value={overrideReason}
                      onChange={e => setOverrideReason(e.target.value)}
                    />
                  )}
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="flex justify-between sm:justify-between w-full">
            <Button variant="ghost" onClick={() => step > 1 ? setStep(s => s - 1 as WizardStep) : setIsOpen(false)}>
              {step === 1 ? "Cancel" : "Back"}
            </Button>
            {step < 4 ? (
              <Button onClick={() => setStep(s => s + 1 as WizardStep)} disabled={step === 2 && !selectedComplaintId}>
                Next <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} variant={finalLevel <= 2 ? "destructive" : "default"}>
                Confirm Triage
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}