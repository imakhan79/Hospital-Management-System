
import { useState, useEffect } from "react";
import {
    Card, CardContent, CardHeader, CardTitle, CardDescription
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    ArrowLeft, Save, FileText, Activity, Pill, Beaker, CheckCircle, Clock, Scissors
} from "lucide-react";
import { SurgeryBookingDialog } from "../ot/SurgeryBookingDialog";
import {
    OPDVisit, fetchPatientVitals, saveConsultation,
    VitalsRecord, Prescription, LabOrder, labTests, LabRequest
} from "@/services/opdService";
import { toast } from "sonner";
import { format } from "date-fns";

interface DoctorConsultationProps {
    patient: OPDVisit;
    onBack: () => void;
    onComplete: () => void;
}

export const DoctorConsultation = ({ patient, onBack, onComplete }: DoctorConsultationProps) => {
    const [loading, setLoading] = useState(false);
    const [vitals, setVitals] = useState<VitalsRecord[]>([]);
    const [completedLabs, setCompletedLabs] = useState<LabRequest[]>([]);

    // Clinical Form State
    const [complaint, setComplaint] = useState(patient.reasonForVisit || "");
    const [diagnosis, setDiagnosis] = useState("");
    const [notes, setNotes] = useState("");
    const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
    const [labOrders, setLabOrders] = useState<LabOrder[]>([]);
    const [bookingDialogOpen, setBookingDialogOpen] = useState(false);

    // Rx Input State
    const [rxInput, setRxInput] = useState({ drug: "", dose: "", freq: "", dur: "" });

    useEffect(() => {
        fetchPatientVitals(patient.patientId).then(setVitals);
        // Fetch completed labs for this visit
        import("@/services/opdService").then(service => {
            service.getLabQueue().then(labs => {
                setCompletedLabs(labs.filter(l => l.visitId === patient.id && l.status === 'completed'));
            });
        });
    }, [patient.id, patient.patientId]);

    const latestVitals = vitals[0];

    const handleAddRx = () => {
        if (!rxInput.drug) return;
        setPrescriptions([...prescriptions, {
            drugName: rxInput.drug,
            dosage: rxInput.dose,
            frequency: rxInput.freq,
            duration: rxInput.dur
        }]);
        setRxInput({ drug: "", dose: "", freq: "", dur: "" });
    };

    const handleRemoveRx = (index: number) => {
        setPrescriptions(prescriptions.filter((_, i) => i !== index));
    };

    const handleFinish = async (status: 'completed' | 'admitted' | 'referred') => {
        if (!diagnosis) return toast.error("Diagnosis is required");

        setLoading(true);
        try {
            await saveConsultation({
                visitId: patient.id,
                patientId: patient.patientId,
                doctorName: patient.doctor,
                chiefComplaint: complaint,
                diagnosis,
                notes,
                prescriptions,
                labOrders,
                status,
                dispositionNote: `Discharged as ${status}`
            });
            onComplete();
        } catch (e: any) {
            toast.error("Failed to save consultation");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-full flex flex-col overflow-hidden">
            {/* Header */}
            <div className="bg-white p-4 border-b flex justify-between items-center shadow-sm z-10">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={onBack}>
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">{patient.patientName}</h2>
                        <div className="text-sm text-muted-foreground flex gap-3">
                            <span className="font-mono">{patient.patientId}</span>
                            <span>|</span>
                            <span>{patient.age || 'N/A'}Y / {patient.gender}</span>
                            <span>|</span>
                            <span className="font-semibold text-blue-600">{patient.visitNumber}</span>
                        </div>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50" onClick={() => setBookingDialogOpen(true)}>
                        <Scissors className="w-4 h-4 mr-2" />
                        Schedule Surgery
                    </Button>
                    <Button variant="outline" className="text-red-600 hover:bg-red-50" onClick={() => handleFinish('admitted')}>Admit</Button>
                    <Button className="bg-green-600 hover:bg-green-700" onClick={() => handleFinish('completed')} disabled={loading}>
                        {loading ? "Saving..." : "End Consultation"}
                    </Button>
                </div>
            </div>

            <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
                {/* LEFT PANEL: History & Vitals */}
                <div className="w-full lg:w-1/3 bg-slate-50 border-r overflow-y-auto p-4 space-y-4">
                    {/* Vitals Card */}
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                <Activity className="w-4 h-4" /> Latest Vitals
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {latestVitals ? (
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="text-muted-foreground">BP</span>
                                        <div className="font-semibold text-lg">{latestVitals.bpSystolic}/{latestVitals.bpDiastolic}</div>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">Heart Rate</span>
                                        <div className="font-semibold text-lg">{latestVitals.heartRate} <span className="text-xs font-normal text-muted-foreground">bpm</span></div>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">Temp</span>
                                        <div className="font-semibold text-lg">{latestVitals.temperature}°F</div>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">SpO2</span>
                                        <div className="font-semibold text-lg">{latestVitals.oxygenSaturation}%</div>
                                    </div>
                                    {latestVitals.bmi && (
                                        <div className="col-span-2 pt-2 border-t mt-2">
                                            <div className="flex justify-between items-center">
                                                <span className="text-muted-foreground">BMI</span>
                                                <span className={`font-bold ${latestVitals.bmi > 25 ? 'text-orange-500' : 'text-green-600'}`}>{latestVitals.bmi}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="text-center py-4 text-muted-foreground italic">No vitals recorded</div>
                            )}
                            <Button variant="link" size="sm" className="w-full mt-2">View History</Button>
                        </CardContent>
                    </Card>

                    {/* Lab Results Card */}
                    {completedLabs.length > 0 && (
                        <Card className="border-blue-100 bg-blue-50/20">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm uppercase tracking-wider text-blue-700 flex items-center gap-2">
                                    <Beaker className="w-4 h-4" /> Lab Reports
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {completedLabs.map(lab => (
                                    <div key={lab.id} className="text-sm p-2 bg-white rounded border border-blue-100 shadow-sm">
                                        <div className="font-bold text-blue-900">{lab.testName}</div>
                                        <div className="text-xs text-muted-foreground mt-1 bg-slate-50 p-1.5 rounded italic">
                                            {lab.result}
                                        </div>
                                        <div className="text-[10px] text-right mt-1 text-slate-400">
                                            {lab.reportedAt ? format(new Date(lab.reportedAt), 'dd MMM HH:mm') : ''}
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    )}

                    {/* Past Encounters (Mock) */}
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                <Clock className="w-4 h-4" /> Past Visits
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="text-sm border-l-2 border-blue-200 pl-3">
                                <div className="font-medium">05 Jan 2024 - General Medicine</div>
                                <div className="text-muted-foreground truncate">Follow up for viral fever...</div>
                            </div>
                            <div className="text-sm border-l-2 border-blue-200 pl-3">
                                <div className="font-medium">12 Dec 2023 - Orthopedics</div>
                                <div className="text-muted-foreground truncate">Knee pain, X-Ray advised...</div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* RIGHT PANEL: Clinical Form */}
                <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-6 bg-white">

                    {/* Complaint & Diagnosis */}
                    <div className="space-y-4">
                        <div className="grid lg:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="font-semibold">Chief Complaint</Label>
                                <Textarea
                                    value={complaint}
                                    onChange={e => setComplaint(e.target.value)}
                                    placeholder="e.g. Fever for 3 days, cough..."
                                    className="resize-none"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="font-semibold">Diagnosis / ICO-10</Label>
                                <Textarea
                                    value={diagnosis}
                                    onChange={e => setDiagnosis(e.target.value)}
                                    placeholder="Start typing diagnosis..."
                                    className="resize-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Lab & Radiology Orders */}
                    <div className="space-y-4 border rounded-lg p-4 bg-slate-50/50">
                        <div className="flex justify-between items-center mb-2">
                            <Label className="flex items-center gap-2 font-semibold text-base">
                                <Beaker className="w-4 h-4 text-blue-600" /> Lab & Radiology Orders
                            </Label>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4">
                            {labTests.map(test => (
                                <Button
                                    key={test.id}
                                    variant={labOrders.some(o => o.testId === test.id) ? "default" : "outline"}
                                    size="sm"
                                    className="text-xs h-8 rounded-full"
                                    onClick={() => {
                                        if (labOrders.some(o => o.testId === test.id)) {
                                            setLabOrders(labOrders.filter(o => o.testId !== test.id));
                                        } else {
                                            setLabOrders([...labOrders, { testId: test.id, urgency: 'routine' }]);
                                        }
                                    }}
                                >
                                    {test.name}
                                </Button>
                            ))}
                        </div>

                        {labOrders.length > 0 && (
                            <div className="bg-white rounded border border-blue-100 p-2 space-y-2">
                                {labOrders.map((order, i) => {
                                    const test = labTests.find(t => t.id === order.testId);
                                    return (
                                        <div key={i} className="flex justify-between items-center bg-blue-50/30 p-2 rounded text-sm">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-blue-500" />
                                                <span className="font-medium text-blue-900">{test?.name}</span>
                                            </div>
                                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-slate-400 hover:text-red-500" onClick={() => setLabOrders(labOrders.filter((_, idx) => idx !== i))}>
                                                &times;
                                            </Button>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Prescriptions */}
                    <div className="space-y-4 border rounded-lg p-4 bg-slate-50/50">
                        <div className="flex justify-between items-center mb-2">
                            <Label className="flex items-center gap-2 font-semibold text-base"><Pill className="w-4 h-4 text-purple-600" /> Prescriptions</Label>
                        </div>

                        {/* Rx Table */}
                        {prescriptions.length > 0 && (
                            <div className="bg-white rounded border shadow-sm mb-4">
                                <table className="w-full text-sm">
                                    <thead className="bg-slate-50 border-b text-left">
                                        <tr>
                                            <th className="p-2 font-medium">Drug Name</th>
                                            <th className="p-2 font-medium">Dosage</th>
                                            <th className="p-2 font-medium">Frequency</th>
                                            <th className="p-2 font-medium">Duration</th>
                                            <th className="p-2"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {prescriptions.map((Rx, i) => (
                                            <tr key={i} className="border-b last:border-0 hover:bg-slate-50">
                                                <td className="p-2 font-medium">{Rx.drugName}</td>
                                                <td className="p-2">{Rx.dosage}</td>
                                                <td className="p-2">{Rx.frequency}</td>
                                                <td className="p-2">{Rx.duration}</td>
                                                <td className="p-2 text-right">
                                                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-red-500" onClick={() => handleRemoveRx(i)}>
                                                        &times;
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* Rx Input */}
                        <div className="grid grid-cols-12 gap-2 items-end">
                            <div className="col-span-12 sm:col-span-4">
                                <Input placeholder="Drug Name (e.g. Panadol)" value={rxInput.drug} onChange={e => setRxInput({ ...rxInput, drug: e.target.value })} />
                            </div>
                            <div className="col-span-6 sm:col-span-2">
                                <Input placeholder="Dose (500mg)" value={rxInput.dose} onChange={e => setRxInput({ ...rxInput, dose: e.target.value })} />
                            </div>
                            <div className="col-span-6 sm:col-span-2">
                                <Input placeholder="Freq (1-0-1)" value={rxInput.freq} onChange={e => setRxInput({ ...rxInput, freq: e.target.value })} />
                            </div>
                            <div className="col-span-6 sm:col-span-2">
                                <Input placeholder="Dur (5 days)" value={rxInput.dur} onChange={e => setRxInput({ ...rxInput, dur: e.target.value })} />
                            </div>
                            <div className="col-span-6 sm:col-span-2">
                                <Button className="w-full" variant="secondary" onClick={handleAddRx} disabled={!rxInput.drug}>Add</Button>
                            </div>
                        </div>
                    </div>

                    {/* Additional Notes */}
                    <div className="space-y-2">
                        <Label className="font-semibold">Clinical Notes / Advice</Label>
                        <Textarea
                            value={notes}
                            onChange={e => setNotes(e.target.value)}
                            placeholder="Additional instructions for patient..."
                            className="min-h-[100px]"
                        />
                    </div>

                </div>
            </div>
            <SurgeryBookingDialog
                open={bookingDialogOpen}
                onOpenChange={setBookingDialogOpen}
                patientDetails={{ id: patient.patientId, name: patient.patientName }}
            />
        </div>
    );
};
