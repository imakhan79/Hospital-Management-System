
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { fetchPatientVitals, saveVitals, updateAppointmentStatus, VitalsRecord, OPDAppointment, fetchOPDAppointments } from "@/services/opdService";
import { toast } from "sonner";
import { ArrowLeft, Save, Send, AlertTriangle, History, Thermometer, Heart, Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface VitalsCaptureProps {
    appointmentId: string;
    patientId: string;
    onBack: () => void;
    onComplete: () => void;
}

export const VitalsCapture = ({ appointmentId, patientId, onBack, onComplete }: VitalsCaptureProps) => {
    const [patient, setPatient] = useState<OPDAppointment | null>(null);
    const [history, setHistory] = useState<VitalsRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // Form State
    const [vitals, setVitals] = useState({
        bpSystolic: '',
        bpDiastolic: '',
        heartRate: '',
        respiratoryRate: '',
        temperature: '',
        oxygenSaturation: '',
        weight: '',
        height: '',
        painScore: '',
        notes: ''
    });

    const bmi = (vitals.weight && vitals.height)
        ? (parseFloat(vitals.weight) / ((parseFloat(vitals.height) / 100) ** 2)).toFixed(1)
        : null;

    useEffect(() => {
        loadData();
    }, [appointmentId, patientId]);

    const loadData = async () => {
        try {
            setLoading(true);
            const [allAppointments, vitalsHistory] = await Promise.all([
                fetchOPDAppointments(),
                fetchPatientVitals(patientId)
            ]);
            const currentPatient = allAppointments.find(a => a.id === appointmentId);
            setPatient(currentPatient || null);
            setHistory(vitalsHistory);
        } catch (e) {
            toast.error("Failed to load patient data");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (submit: boolean) => {
        if (!vitals.bpSystolic || !vitals.bpDiastolic || !vitals.heartRate || !vitals.temperature) {
            toast.error("Please fill in all required fields (BP, HR, Temp)");
            return;
        }

        setSubmitting(true);
        try {
            await saveVitals({
                encounterId: appointmentId,
                patientId: patientId,
                bpSystolic: parseInt(vitals.bpSystolic),
                bpDiastolic: parseInt(vitals.bpDiastolic),
                heartRate: parseInt(vitals.heartRate),
                respiratoryRate: vitals.respiratoryRate ? parseInt(vitals.respiratoryRate) : undefined,
                temperature: parseFloat(vitals.temperature),
                oxygenSaturation: parseFloat(vitals.oxygenSaturation),
                weight: vitals.weight ? parseFloat(vitals.weight) : undefined,
                height: vitals.height ? parseFloat(vitals.height) : undefined,
                bmi: bmi ? parseFloat(bmi) : undefined,
                painScore: vitals.painScore ? parseInt(vitals.painScore) : undefined,
                notes: vitals.notes,
                capturedBy: 'Nurse Station', // Replace with actual user
            });

            if (submit) {
                await updateAppointmentStatus(appointmentId, 'waiting-doctor');
                toast.success("Vitals submitted. Patient moved to Doctor Queue.");
                onComplete();
            } else {
                toast.success("Vitals saved as draft.");
            }
        } catch (e) {
            toast.error("Failed to save vitals");
        } finally {
            setSubmitting(false);
        }
    };

    const isCritical = (type: string, value: string) => {
        const v = parseFloat(value);
        if (!v) return false;
        switch (type) {
            case 'temp': return v > 38.0 || v < 36.0;
            case 'spo2': return v < 92;
            case 'hr': return v > 100 || v < 60;
            case 'bpSys': return v > 140 || v < 90;
            default: return false;
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between border-b pb-4">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={onBack}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h2 className="text-2xl font-bold">{patient?.patientName}</h2>
                        <div className="flex gap-4 text-sm text-muted-foreground">
                            <span>MRN: <span className="font-mono text-foreground">MR-12345</span></span>
                            <span>Token: <span className="font-mono text-foreground font-bold">{patient?.queueNumber || '--'}</span></span>
                            <Badge variant="outline">{patient?.department}</Badge>
                        </div>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => handleSave(false)} disabled={submitting}>
                        <Save className="w-4 h-4 mr-2" /> Save Draft
                    </Button>
                    <Button onClick={() => handleSave(true)} disabled={submitting}>
                        <Send className="w-4 h-4 mr-2" /> Submit & Next
                    </Button>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Main Form */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Current Vitals</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="col-span-2 space-y-2">
                                <Label>Blood Pressure (mmHg) *</Label>
                                <div className="flex gap-2 items-center">
                                    <Input
                                        placeholder="Sys"
                                        value={vitals.bpSystolic}
                                        onChange={e => setVitals({ ...vitals, bpSystolic: e.target.value })}
                                        className={isCritical('bpSys', vitals.bpSystolic) ? "border-red-500 bg-red-50" : ""}
                                    />
                                    <span className="text-muted-foreground">/</span>
                                    <Input
                                        placeholder="Dia"
                                        value={vitals.bpDiastolic}
                                        onChange={e => setVitals({ ...vitals, bpDiastolic: e.target.value })}
                                    />
                                </div>
                                {isCritical('bpSys', vitals.bpSystolic) && <p className="text-xs text-red-600 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> High BP Alert</p>}
                            </div>

                            <div className="space-y-2">
                                <Label>Heart Rate (bpm) *</Label>
                                <div className="relative">
                                    <Heart className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        className={`pl-9 ${isCritical('hr', vitals.heartRate) ? "border-red-500 bg-red-50" : ""}`}
                                        placeholder="e.g. 72"
                                        value={vitals.heartRate}
                                        onChange={e => setVitals({ ...vitals, heartRate: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Resp. Rate</Label>
                                <Input
                                    placeholder="e.g. 18"
                                    value={vitals.respiratoryRate}
                                    onChange={e => setVitals({ ...vitals, respiratoryRate: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Temperature (°C) *</Label>
                                <div className="relative">
                                    <Thermometer className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        className={`pl-9 ${isCritical('temp', vitals.temperature) ? "border-red-500" : ""}`}
                                        placeholder="e.g. 36.6"
                                        value={vitals.temperature}
                                        onChange={e => setVitals({ ...vitals, temperature: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>SpO2 (%) *</Label>
                                <Input
                                    className={isCritical('spo2', vitals.oxygenSaturation) ? "border-red-500" : ""}
                                    placeholder="e.g. 98"
                                    value={vitals.oxygenSaturation}
                                    onChange={e => setVitals({ ...vitals, oxygenSaturation: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Weight (kg)</Label>
                                <Input
                                    placeholder="e.g. 70"
                                    value={vitals.weight}
                                    onChange={e => setVitals({ ...vitals, weight: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Height (cm)</Label>
                                <Input
                                    placeholder="e.g. 175"
                                    value={vitals.height}
                                    onChange={e => setVitals({ ...vitals, height: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                            <div className="space-y-2">
                                <Label>Calculated BMI</Label>
                                <div className="text-3xl font-bold text-slate-700">{bmi || '--'}</div>
                                <p className="text-xs text-muted-foreground">kg/m²</p>
                            </div>
                            <div className="space-y-2">
                                <Label>Pain Score (0-10)</Label>
                                <Input
                                    type="number" min="0" max="10"
                                    placeholder="0"
                                    value={vitals.painScore}
                                    onChange={e => setVitals({ ...vitals, painScore: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Notes / Observations</Label>
                            <Textarea
                                placeholder="Any additional observations..."
                                value={vitals.notes}
                                onChange={e => setVitals({ ...vitals, notes: e.target.value })}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* History Sidebar */}
                <Card className="h-fit">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <History className="w-5 h-5" /> Previous Vitals
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {history.length === 0 ? (
                            <div className="text-sm text-muted-foreground text-center py-4">No previous records</div>
                        ) : (
                            <div className="space-y-4">
                                {history.map(record => (
                                    <div key={record.id} className="p-3 border rounded-lg text-sm space-y-2 bg-slate-50">
                                        <div className="flex justify-between text-muted-foreground text-xs">
                                            <span>{new Date(record.capturedAt).toLocaleDateString()}</span>
                                            <span>{new Date(record.capturedAt).toLocaleTimeString()}</span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2 font-medium">
                                            <div>BP: {record.bpSystolic}/{record.bpDiastolic}</div>
                                            <div>HR: {record.heartRate}</div>
                                            <div>Temp: {record.temperature}</div>
                                            <div>SpO2: {record.oxygenSaturation}%</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
