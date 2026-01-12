
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
    ArrowLeft, Save, AlertTriangle, Activity,
    Thermometer, Heart, Wind, Scale, CheckCircle
} from "lucide-react";
import { OPDVisit, submitVitals, fetchPatientVitals, VitalsRecord } from "@/services/opdService";
import { toast } from "sonner";
import { format } from "date-fns";

interface VitalsCaptureFormProps {
    patient: OPDVisit;
    onBack: () => void;
    onComplete: () => void;
}

export const VitalsCaptureForm = ({ patient, onBack, onComplete }: VitalsCaptureFormProps) => {
    const [loading, setLoading] = useState(false);
    const [history, setHistory] = useState<VitalsRecord[]>([]);

    const [formData, setFormData] = useState({
        bpSystolic: "",
        bpDiastolic: "",
        heartRate: "",
        respiratoryRate: "",
        temperature: "",
        oxygenSaturation: "",
        weight: "",
        height: "",
        painScore: "0",
        bloodSugar: "",
        notes: ""
    });

    const [bmi, setBmi] = useState<number | null>(null);

    // Load History
    useEffect(() => {
        fetchPatientVitals(patient.patientId).then(setHistory);
    }, [patient.patientId]);

    // Auto-Calc BMI
    useEffect(() => {
        const w = parseFloat(formData.weight);
        const h = parseFloat(formData.height); // assuming cm or meters? Let's assume CM for input, convert to M
        if (w && h) {
            // Height in Meters
            const hm = h / 100;
            const b = w / (hm * hm);
            setBmi(parseFloat(b.toFixed(1)));
        } else {
            setBmi(null);
        }
    }, [formData.weight, formData.height]);

    const handleSubmit = async () => {
        // Basic Validation
        if (!formData.bpSystolic || !formData.bpDiastolic) return toast.error("Blood Pressure is required");
        if (!formData.temperature) return toast.error("Temperature is required");
        if (!formData.heartRate) return toast.error("Heart Rate is required");

        setLoading(true);
        try {
            await submitVitals({
                visitId: patient.id,
                patientId: patient.patientId,
                bpSystolic: Number(formData.bpSystolic),
                bpDiastolic: Number(formData.bpDiastolic),
                heartRate: Number(formData.heartRate),
                respiratoryRate: formData.respiratoryRate ? Number(formData.respiratoryRate) : undefined,
                temperature: Number(formData.temperature),
                oxygenSaturation: Number(formData.oxygenSaturation),
                weight: formData.weight ? Number(formData.weight) : undefined,
                height: formData.height ? Number(formData.height) : undefined,
                bmi: bmi || undefined,
                painScore: Number(formData.painScore),
                bloodSugar: formData.bloodSugar ? Number(formData.bloodSugar) : undefined,
                notes: formData.notes,
                capturedBy: "Nurse Station", // Mock user
                isAbnormal: isCritical()
            });
            onComplete();
        } catch (e: any) {
            toast.error(e.message || "Failed to save vitals");
        } finally {
            setLoading(false);
        }
    };

    const isCritical = () => {
        const sys = Number(formData.bpSystolic);
        const temp = Number(formData.temperature);
        const spo2 = Number(formData.oxygenSaturation);

        if (sys > 160 || sys < 90) return true;
        if (temp > 102 || temp < 95) return true;
        if (spo2 < 92) return true;
        return false;
    };

    const critical = isCritical();

    return (
        <div className="h-full flex flex-col gap-4 overflow-hidden">
            {/* Header */}
            <div className="bg-slate-50 p-4 border-b flex justify-between items-center shadow-sm z-10">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={onBack}>
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">{patient.patientName}</h2>
                        <div className="text-sm text-muted-foreground flex gap-3">
                            <span>{patient.patientId}</span>
                            <span>|</span>
                            <span className="font-semibold text-blue-600">Visit: {patient.visitNumber}</span>
                            <span>|</span>
                            <span>{patient.age || 'N/A'} Y / {patient.gender}</span>
                            <span>|</span>
                            <span className="capitalize">{patient.type}</span>
                        </div>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-sm font-medium">{patient.doctor}</div>
                    <div className="text-xs text-muted-foreground">{patient.department}</div>
                </div>
            </div>

            <div className="flex-1 overflow-auto p-4 grid lg:grid-cols-3 gap-6">

                {/* Left: Form */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className={`border-t-4 ${critical ? 'border-t-red-500' : 'border-t-blue-500'} shadow-md`}>
                        <CardHeader>
                            <CardTitle className="flex justify-between">
                                <span>Record Vitals</span>
                                {critical &&
                                    <span className="flex items-center text-red-600 text-sm bg-red-50 px-3 py-1 rounded-full animate-pulse">
                                        <AlertTriangle className="w-4 h-4 mr-2" /> Critical Values Detected
                                    </span>
                                }
                            </CardTitle>
                            <CardDescription>Enter patient's current vital signs.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* BP & Heart */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2"><Activity className="w-4 h-4 text-blue-500" /> BP (mmHg) *</Label>
                                    <div className="flex gap-2 items-center">
                                        <Input
                                            placeholder="Sys"
                                            className={Number(formData.bpSystolic) > 140 ? "border-red-300 bg-red-50" : ""}
                                            value={formData.bpSystolic}
                                            onChange={e => setFormData({ ...formData, bpSystolic: e.target.value })}
                                        />
                                        <span className="text-slate-400">/</span>
                                        <Input
                                            placeholder="Dia"
                                            value={formData.bpDiastolic}
                                            onChange={e => setFormData({ ...formData, bpDiastolic: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2"><Heart className="w-4 h-4 text-red-500" /> Heart Rate (bpm) *</Label>
                                    <Input
                                        type="number"
                                        placeholder="72"
                                        value={formData.heartRate}
                                        onChange={e => setFormData({ ...formData, heartRate: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2"><Wind className="w-4 h-4 text-cyan-500" /> SpO₂ (%)</Label>
                                    <Input
                                        type="number"
                                        placeholder="98"
                                        className={Number(formData.oxygenSaturation) < 92 && formData.oxygenSaturation ? "border-red-300 bg-red-50" : ""}
                                        value={formData.oxygenSaturation}
                                        onChange={e => setFormData({ ...formData, oxygenSaturation: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* Temp & Resp */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2"><Thermometer className="w-4 h-4 text-orange-500" /> Temp (°F) *</Label>
                                    <Input
                                        type="number"
                                        placeholder="98.6"
                                        value={formData.temperature}
                                        onChange={e => setFormData({ ...formData, temperature: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Resp. Rate (bpm)</Label>
                                    <Input
                                        type="number"
                                        placeholder="16"
                                        value={formData.respiratoryRate}
                                        onChange={e => setFormData({ ...formData, respiratoryRate: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Blood Sugar (mg/dL)</Label>
                                    <Input
                                        type="number"
                                        placeholder="RBS"
                                        value={formData.bloodSugar}
                                        onChange={e => setFormData({ ...formData, bloodSugar: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* Physical */}
                            <div className="p-4 bg-slate-50 rounded-lg border grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2"><Scale className="w-4 h-4" /> Weight (kg)</Label>
                                    <Input
                                        type="number"
                                        placeholder="kg"
                                        value={formData.weight}
                                        onChange={e => setFormData({ ...formData, weight: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Height (cm)</Label>
                                    <Input
                                        type="number"
                                        placeholder="cm"
                                        value={formData.height}
                                        onChange={e => setFormData({ ...formData, height: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>BMI</Label>
                                    <div className="h-10 px-3 py-2 bg-white border rounded text-slate-900 font-semibold">
                                        {bmi || "--"}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Notes / Observations</Label>
                                <Textarea
                                    placeholder="Patient complaints, visible distress, etc."
                                    className="min-h-[80px]"
                                    value={formData.notes}
                                    onChange={e => setFormData({ ...formData, notes: e.target.value })}
                                />
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-between bg-slate-50/50 p-4 border-t">
                            <Button variant="ghost" onClick={onBack}>Cancel</Button>
                            <Button
                                size="lg"
                                onClick={handleSubmit}
                                disabled={loading}
                                className={critical ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}
                            >
                                {loading ? "Submitting..." : (
                                    <>
                                        <Save className="w-4 h-4 mr-2" />
                                        {critical ? "Submit Critical Vitals" : "Submit & Send to Doctor"}
                                    </>
                                )}
                            </Button>
                        </CardFooter>
                    </Card>
                </div>

                {/* Right: History */}
                <div className="lg:col-span-1 space-y-4">
                    <Card className="h-full border-l-4 border-l-purple-500 shadow-md">
                        <CardHeader>
                            <CardTitle className="text-lg">Recent History</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Date</TableHead>
                                        <TableHead>BP</TableHead>
                                        <TableHead>HR</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {history.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={3} className="text-center text-muted-foreground py-4">No previous records</TableCell>
                                        </TableRow>
                                    ) : (
                                        history.map(rec => (
                                            <TableRow key={rec.id}>
                                                <TableCell className="font-medium text-xs">
                                                    {format(new Date(rec.capturedAt), 'MMM dd')}
                                                </TableCell>
                                                <TableCell className="text-xs">{rec.bpSystolic}/{rec.bpDiastolic}</TableCell>
                                                <TableCell className="text-xs">{rec.heartRate}</TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};
