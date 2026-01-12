
import { useState, useEffect } from "react";
import {
    Card, CardContent, CardHeader, CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
    User, Activity, Pill, FileText, Calendar, LogOut, ArrowLeft
} from "lucide-react";
import {
    getPatientChart, addClinicalNote, dischargePatient,
    IPDAdmission, ClinicalNote, Bed
} from "@/services/ipdService";
import { DischargeModal } from "./DischargeModal";
import { toast } from "sonner";
import { format } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    LabRequest, labTests, createLabOrder, labRequests
} from "@/services/opdService";
import {
    Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle
} from "@/components/ui/dialog";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { TestTube, Plus, Scissors } from "lucide-react";
import {
    getSurgeryBookings, bookSurgery, SurgeryBooking, mockOTs
} from "@/services/otService";
import { SurgeryBookingDialog } from "../ot/SurgeryBookingDialog";
import { SurgeryReportModal } from "../ot/SurgeryReportModal";

interface Props {
    admissionId: string;
    onClose: () => void;
}

export const IPDPatientChart = ({ admissionId, onClose }: Props) => {
    const [data, setData] = useState<{ admission: IPDAdmission, notes: ClinicalNote[], bed: Bed } | null>(null);
    const [loading, setLoading] = useState(true);
    const [newNote, setNewNote] = useState("");
    const [noteType, setNoteType] = useState<ClinicalNote['type']>("Progress Note");
    const [savingNote, setSavingNote] = useState(false);
    const [showDischargeModal, setShowDischargeModal] = useState(false);
    const [patientLabs, setPatientLabs] = useState<LabRequest[]>([]);
    const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false);
    const [selectedTestId, setSelectedTestId] = useState("");
    const [orderingLab, setOrderingLab] = useState(false);
    const [patientSurgeries, setPatientSurgeries] = useState<SurgeryBooking[]>([]);
    const [isSurgeryDialogOpen, setIsSurgeryDialogOpen] = useState(false);
    const [reportModalOpen, setReportModalOpen] = useState(false);
    const [selectedSurgery, setSelectedSurgery] = useState<SurgeryBooking | null>(null);

    useEffect(() => {
        loadChart();
        loadLabs();
        loadSurgeries();
    }, [admissionId]);

    const loadSurgeries = async () => {
        if (!data?.admission.patientId) return;
        const all = await getSurgeryBookings();
        setPatientSurgeries(all.filter(s => s.patientId === data.admission.patientId));
    };

    const handleBookSurgery = () => {
        setIsSurgeryDialogOpen(true);
    };

    const loadLabs = () => {
        const labs = labRequests.filter(r => r.patientId === data?.admission.patientId);
        setPatientLabs(labs);
    };

    useEffect(() => {
        if (data) {
            loadLabs();
        }
    }, [data, isOrderDialogOpen]);

    const loadChart = async () => {
        setLoading(true);
        try {
            const chartData = await getPatientChart(admissionId);
            setData(chartData);
        } catch (e) {
            toast.error("Failed to load chart");
        } finally {
            setLoading(false);
        }
    };

    const handleAddNote = async () => {
        if (!newNote.trim() || !data) return;
        setSavingNote(true);
        try {
            await addClinicalNote({
                admissionId: data.admission.id,
                note: newNote,
                author: "Dr. Admin", // Mock current user
                type: noteType
            });
            setNewNote("");
            toast.success("Note added");
            loadChart(); // Refresh
        } catch (e) {
            toast.error("Failed to add note");
        } finally {
            setSavingNote(false);
        }
    };

    const handleDischarge = () => {
        setShowDischargeModal(true);
    };

    const handleDischargeComplete = () => {
        setShowDischargeModal(false);
        onClose(); // Close chart after discharge
    };

    const handleOrderLab = async () => {
        if (!selectedTestId || !data) return;
        setOrderingLab(true);
        try {
            const test = labTests.find(t => t.id === selectedTestId);
            if (!test) throw new Error("Test not found");

            await createLabOrder({
                visitId: data.admission.id,
                patientId: data.admission.patientId,
                testId: test.id,
                testName: test.name
            });

            toast.success("Lab test ordered successfully");
            setIsOrderDialogOpen(false);
            setSelectedTestId("");
            loadLabs();
        } catch (e) {
            toast.error("Failed to order lab test");
        } finally {
            setOrderingLab(false);
        }
    };

    if (loading) return <div className="p-8 text-center">Loading Chart...</div>;
    if (!data) return <div className="p-8 text-center">Patient not found</div>;

    return (
        <div className="flex flex-col h-full bg-slate-50">
            {data && (
                <DischargeModal
                    admissionId={data.admission.id}
                    isOpen={showDischargeModal}
                    onClose={() => setShowDischargeModal(false)}
                    onDischargeComplete={handleDischargeComplete}
                />
            )}
            {/* Header */}
            <div className="bg-white border-b px-6 py-4 flex justify-between items-center shadow-sm">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={onClose}>
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <h1 className="text-xl font-bold flex items-center gap-2">
                            {data.admission.patientName}
                            <Badge variant={data.admission.status === 'admitted' ? 'default' : 'secondary'}>
                                {data.admission.status}
                            </Badge>
                        </h1>
                        <div className="text-sm text-muted-foreground flex items-center gap-4 mt-1">
                            <span className="flex items-center"><User className="w-3 h-3 mr-1" /> ID: {data.admission.patientId}</span>
                            <span className="flex items-center"><Calendar className="w-3 h-3 mr-1" /> Admitted: {format(new Date(data.admission.admittedAt), 'PP p')}</span>
                        </div>
                    </div>
                </div>
                <div className="text-right">
                    <div className="font-semibold text-lg">{data.bed.bedNumber}</div>
                    <div className="text-sm text-muted-foreground">{data.admission.doctor}</div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-6 overflow-hidden">
                <Tabs defaultValue="overview" className="h-full flex flex-col">
                    <TabsList className="w-full justify-start border-b rounded-none p-0 bg-transparent h-auto">
                        <TabsTrigger value="overview" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 py-2">Overview</TabsTrigger>
                        <TabsTrigger value="notes" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 py-2">Clinical Notes</TabsTrigger>
                        <TabsTrigger value="meds" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 py-2">Medications</TabsTrigger>
                        <TabsTrigger value="labs" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 py-2">Labs</TabsTrigger>
                        <TabsTrigger value="surgeries" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 py-2">Surgeries</TabsTrigger>
                        <TabsTrigger value="vitals" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 py-2">Vitals Graph</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="flex-1 overflow-auto py-4">
                        <div className="grid grid-cols-3 gap-6">
                            {/* Diagnosis */}
                            <Card className="col-span-2">
                                <CardHeader>
                                    <CardTitle className="text-base flex items-center"><Activity className="w-4 h-4 mr-2" /> Diagnosis & History</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="bg-slate-50 p-3 rounded-md border">
                                        <label className="text-xs font-semibold text-muted-foreground uppercase">Admission Diagnosis</label>
                                        <p className="text-lg font-medium">{data.admission.diagnosis}</p>
                                    </div>
                                    <div className="mt-4 grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs font-semibold text-muted-foreground uppercase">Allergies</label>
                                            <p>-</p>
                                        </div>
                                        <div>
                                            <label className="text-xs font-semibold text-muted-foreground uppercase">Blood Group</label>
                                            <p>-</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Quick Actions */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base">Actions</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <Button variant="destructive" className="w-full justify-start" onClick={handleDischarge}>
                                        <LogOut className="w-4 h-4 mr-2" /> Discharge Patient
                                    </Button>
                                    <Button variant="outline" className="w-full justify-start">
                                        Transfer Bed
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="notes" className="flex-1 overflow-hidden flex flex-col gap-4 py-4">
                        <div className="flex gap-2">
                            <Select value={noteType} onValueChange={(v: any) => setNoteType(v)}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Note Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Progress Note">Progress Note</SelectItem>
                                    <SelectItem value="Nurse Note">Nurse Note</SelectItem>
                                    <SelectItem value="Round">Doctor Round</SelectItem>
                                </SelectContent>
                            </Select>
                            <Textarea
                                placeholder="Enter clinical observations..."
                                className="min-h-[80px] flex-1 resize-none"
                                value={newNote}
                                onChange={e => setNewNote(e.target.value)}
                            />
                            <Button className="h-[80px] w-[100px]" onClick={handleAddNote} disabled={savingNote}>
                                Add Note
                            </Button>
                        </div>

                        <ScrollArea className="flex-1 rounded-md border bg-white p-4">
                            {data.notes.length === 0 ? (
                                <p className="text-center text-muted-foreground py-10">No clinical notes recorded yet.</p>
                            ) : (
                                <div className="space-y-6">
                                    {data.notes.map(note => (
                                        <div key={note.id} className="flex gap-4">
                                            <div className="flex flex-col items-center">
                                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center border text-xs font-bold text-slate-600">
                                                    {note.author.charAt(0)}
                                                </div>
                                                <div className="w-px h-full bg-slate-200 my-2" />
                                            </div>
                                            <div className="flex-1 pb-4">
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="font-semibold text-sm">{note.author}</span>
                                                    <span className="text-xs text-muted-foreground">{format(new Date(note.timestamp), 'PP p')}</span>
                                                </div>
                                                <Badge variant="outline" className="mb-2 text-xs">{note.type}</Badge>
                                                <p className="text-sm text-slate-700 whitespace-pre-wrap">{note.note}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </ScrollArea>
                    </TabsContent>

                    <TabsContent value="meds" className="flex-1 py-4">
                        <div className="text-center text-muted-foreground py-10">
                            <Pill className="mx-auto h-10 w-10 mb-4 opacity-50" />
                            No active medications assigned.
                        </div>
                    </TabsContent>

                    <TabsContent value="labs" className="flex-1 flex flex-col gap-4 py-4">
                        {/* Existing Labs Content */}
                        <div className="flex justify-between items-center px-2">
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                <TestTube className="w-5 h-5 text-blue-500" />
                                Lab Investigations
                            </h3>
                            <Button size="sm" onClick={() => setIsOrderDialogOpen(true)}>
                                <Plus className="w-4 h-4 mr-2" /> Order Test
                            </Button>
                        </div>

                        <div className="bg-white rounded-md border shadow-sm flex-1 overflow-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Test Name</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Ordered At</TableHead>
                                        <TableHead>Result</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {patientLabs.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-center py-10 text-muted-foreground">
                                                No lab tests ordered for this admission.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        patientLabs.map(lab => (
                                            <TableRow key={lab.id}>
                                                <TableCell className="font-medium">{lab.testName}</TableCell>
                                                <TableCell>
                                                    <Badge variant={lab.status === 'completed' ? 'default' : 'secondary'}>
                                                        {lab.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>{format(new Date(lab.orderedAt), 'PP p')}</TableCell>
                                                <TableCell className="max-w-[200px] truncate italic">
                                                    {lab.result || "Awaiting results..."}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </TabsContent>

                    <TabsContent value="surgeries" className="flex-1 flex flex-col gap-4 py-4">
                        <div className="flex justify-between items-center px-2">
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                <Scissors className="w-5 h-5 text-red-500" />
                                Surgical Procedures
                            </h3>
                            <Button size="sm" onClick={() => setIsSurgeryDialogOpen(true)}>
                                <Plus className="w-4 h-4 mr-2" /> Book Surgery
                            </Button>
                        </div>

                        <div className="grid gap-4">
                            {patientSurgeries.length === 0 ? (
                                <div className="text-center py-12 bg-white border rounded-md text-muted-foreground">
                                    No surgeries scheduled or performed.
                                </div>
                            ) : patientSurgeries.map(s => (
                                <Card key={s.id}>
                                    <CardContent className="p-4 flex items-center justify-between">
                                        <div className="space-y-1">
                                            <div className="font-semibold">{s.surgeryName}</div>
                                            <div className="text-sm text-muted-foreground">
                                                Surgeon: {s.surgeon} | OT: {mockOTs.find(o => o.id === s.otId)?.name || s.otId}
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                Scheduled: {format(new Date(s.scheduledAt), 'PP p')}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            {s.status !== 'completed' && s.status !== 'cancelled' && (
                                                <Button size="sm" variant="ghost" onClick={() => {
                                                    setSelectedSurgery(s);
                                                    setReportModalOpen(true);
                                                }}>
                                                    <FileText className="w-4 h-4 mr-2" />
                                                    Report
                                                </Button>
                                            )}
                                            <Badge variant={s.status === 'completed' ? 'default' : s.status === 'cancelled' ? 'destructive' : 'secondary'}>
                                                {s.status}
                                            </Badge>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>
                </Tabs>
            </div>

            {/* Order Lab Dialog */}
            <Dialog open={isOrderDialogOpen} onOpenChange={setIsOrderDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Order Lab Investigation</DialogTitle>
                        <DialogDescription>
                            Select a test to order for {data.admission.patientName}.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <Select value={selectedTestId} onValueChange={setSelectedTestId}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a lab test" />
                            </SelectTrigger>
                            <SelectContent>
                                {labTests.map(test => (
                                    <SelectItem key={test.id} value={test.id}>
                                        {test.name} - ₹{test.price}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsOrderDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleOrderLab} disabled={!selectedTestId || orderingLab}>
                            {orderingLab ? "Ordering..." : "Confirm Order"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            {/* Book Surgery Dialog */}
            <SurgeryBookingDialog
                open={isSurgeryDialogOpen}
                onOpenChange={setIsSurgeryDialogOpen}
                patientDetails={{ id: data.admission.patientId, name: data.admission.patientName }}
                onSuccess={loadSurgeries}
            />

            <SurgeryReportModal
                open={reportModalOpen}
                onOpenChange={setReportModalOpen}
                booking={selectedSurgery}
                onSuccess={loadSurgeries}
            />
        </div>
    );
};
