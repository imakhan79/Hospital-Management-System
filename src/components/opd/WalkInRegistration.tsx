
import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    UserPlus, Search, Save, X, RefreshCw, User,
    MapPin, Stethoscope, AlertTriangle, CheckCircle
} from "lucide-react";
import {
    createPatient, searchPatients, updatePatient,
    fetchDepartments, createVisit, checkDuplicates,
    Department, Doctor, Patient, OPDVisit
} from "@/services/opdService";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { format } from "date-fns";

export const WalkInRegistration = () => {
    // --- State ---
    const [departments, setDepartments] = useState<Department[]>([]);
    const [selectedDepartment, setSelectedDepartment] = useState<string>("");
    const [selectedDoctor, setSelectedDoctor] = useState<string>("");

    // Patient Form State
    const [patientId, setPatientId] = useState<string | null>(null); // If editing existing
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        age: "",
        gender: "",
        complaint: "",
        emergencyContact: ""
    });

    // UI State
    const [loading, setLoading] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<Patient[]>([]);
    const [successData, setSuccessData] = useState<{
        token: string, mrn: string, doctor: string, queue: number,
        patientName: string, department: string, visitType: string, priority: string, timestamp: string
    } | null>(null);

    // Duplicate Logic
    const [duplicateList, setDuplicateList] = useState<Patient[]>([]);
    const [showDuplicateModal, setShowDuplicateModal] = useState(false);

    // --- Effects ---
    useEffect(() => {
        loadDepartments();
    }, []);

    // Keyboard Shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                handleSave(false);
            }
            if (e.key === 'Escape') {
                if (isSearchOpen) setIsSearchOpen(false);
                else if (showDuplicateModal) setShowDuplicateModal(false);
                else handleClear();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [formData, selectedDepartment, selectedDoctor, showDuplicateModal]); // Re-bind on form change

    // --- Handlers ---

    const loadDepartments = async () => {
        try {
            const depts = await fetchDepartments();
            setDepartments(depts);
        } catch (e) { toast.error("Failed to load departments"); }
    };

    const selectedDept = departments.find(d => d.id === selectedDepartment);
    const selectedDoc = selectedDept?.doctors.find(d => d.id === selectedDoctor);

    const handleSearch = async () => {
        if (!searchQuery) return;
        setLoading(true);
        try {
            const results = await searchPatients(searchQuery);
            setSearchResults(results);
        } catch (e) { toast.error("Search failed"); }
        setLoading(false);
    };

    const selectPatient = (patient: Patient) => {
        setPatientId(patient.id);
        setFormData({
            name: patient.name,
            phone: patient.phone,
            age: patient.age || "",
            gender: patient.gender,
            complaint: "",
            emergencyContact: patient.emergencyContact || ""
        });
        setIsSearchOpen(false);
        toast.info(`Loaded patient: ${patient.name}`);
    };

    const handleClear = () => {
        setPatientId(null);
        setFormData({ name: "", phone: "", age: "", gender: "", complaint: "", emergencyContact: "" });
        setSuccessData(null);
        setSearchQuery("");
        setSearchResults([]);
    };

    const handleSave = async (force: boolean = false) => {
        // Validation
        if (!selectedDepartment) return toast.error("Department is required");
        if (!selectedDoctor) return toast.error("Doctor is required");
        if (!formData.name) return toast.error("Name is required");
        if (!formData.phone) return toast.error("Phone is required");
        if (!formData.complaint) return toast.error("Complaint is required");

        setLoading(true);
        try {
            let currentPid = patientId;

            // 0. Check Duplicates (if new patient and not forcing)
            if (!currentPid && !force) {
                const dups = await checkDuplicates(formData.name, formData.phone);
                if (dups.length > 0) {
                    setDuplicateList(dups);
                    setShowDuplicateModal(true);
                    setLoading(false);
                    return;
                }
            }

            // 1. Create/Update Patient
            if (!currentPid) {
                const newPatient = await createPatient({
                    name: formData.name,
                    phone: formData.phone,
                    age: formData.age,
                    gender: formData.gender,
                    emergencyContact: formData.emergencyContact
                });
                currentPid = newPatient.id;
            } else {
                await updatePatient(currentPid, {
                    name: formData.name,
                    phone: formData.phone,
                    age: formData.age,
                    gender: formData.gender,
                    emergencyContact: formData.emergencyContact
                });
            }

            // 2. Create Visit (OPD Encounter)
            const visit = await createVisit({
                patientId: currentPid,
                patientName: formData.name,
                patientPhone: formData.phone,
                department: selectedDept?.name,
                doctor: selectedDoc?.name,
                date: new Date().toISOString().split('T')[0],
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                status: 'booked',
                type: 'walk-in',
                reasonForVisit: formData.complaint,
                priority: 'routine'
            });

            // 3. Success
            setSuccessData({
                token: visit.visitNumber,
                mrn: currentPid,
                patientName: formData.name,
                department: selectedDept?.name || "",
                doctor: selectedDoc?.name || "",
                queue: 0,
                visitType: "Walk-in OPD",
                priority: "Routine",
                timestamp: format(new Date(), "PPpp")
            });
            toast.success("Registration Submitted Successfully");
            setShowDuplicateModal(false);

        } catch (e: any) {
            toast.error(e.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    // --- Render Success Screen ---
    if (successData) {
        return (
            <div className="flex flex-col items-center justify-center p-8 space-y-6 bg-slate-50 rounded-lg border border-slate-200 h-full animate-in fade-in zoom-in-95 duration-200">
                <div className="bg-green-100 p-4 rounded-full shadow-sm">
                    <CheckCircle className="w-16 h-16 text-green-600" />
                </div>
                <div className="text-center space-y-1">
                    <h2 className="text-3xl font-bold text-slate-800">Registration Submitted</h2>
                    <p className="text-muted-foreground text-lg">Patient has been added to the queue</p>
                </div>

                <div className="w-full max-w-lg bg-white rounded-xl border shadow-lg overflow-hidden">
                    <div className="bg-slate-50 p-4 border-b flex justify-between items-center">
                        <span className="font-semibold text-slate-600">Registration Details</span>
                        <Badge variant="outline" className="bg-white">{successData.timestamp}</Badge>
                    </div>
                    <div className="p-6 grid grid-cols-2 gap-6">
                        <div className="text-center p-4 border rounded-lg bg-blue-50/50 border-blue-100">
                            <div className="text-xs text-blue-600 uppercase font-bold tracking-wider">Queue Token</div>
                            <div className="text-4xl font-black text-blue-700 mt-1">{successData.token}</div>
                        </div>
                        <div className="text-center p-4 border rounded-lg bg-orange-50/50 border-orange-100">
                            <div className="text-xs text-orange-600 uppercase font-bold tracking-wider">MRN Number</div>
                            <div className="text-2xl font-bold text-orange-700 mt-2 font-mono">{successData.mrn}</div>
                        </div>

                        <div className="col-span-2 space-y-3 pt-2">
                            <div className="flex justify-between border-b pb-2">
                                <span className="text-muted-foreground">Patient Name</span>
                                <span className="font-semibold text-lg">{successData.patientName}</span>
                            </div>
                            <div className="flex justify-between border-b pb-2">
                                <span className="text-muted-foreground">Department</span>
                                <span className="font-medium">{successData.department}</span>
                            </div>
                            <div className="flex justify-between border-b pb-2">
                                <span className="text-muted-foreground">Assigned Doctor</span>
                                <span className="font-medium text-blue-600">{successData.doctor}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Visit Type</span>
                                <div className="flex gap-2">
                                    <Badge variant="secondary">{successData.visitType}</Badge>
                                    <Badge variant="outline">{successData.priority}</Badge>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-slate-50 p-4 border-t flex gap-3">
                        <Button className="flex-1" variant="outline" onClick={() => toast.success("Printing Slip...")}>Print Slip</Button>
                        <Button className="flex-1" variant="outline" onClick={() => toast.success("SMS Sent!")}>Send SMS</Button>
                    </div>
                </div>

                <Button size="lg" onClick={handleClear} className="min-w-[200px]">
                    Register New Patient
                </Button>
            </div>
        );
    }

    // --- Render Main Screen ---
    return (
        <div className="grid lg:grid-cols-12 gap-6 h-full">
            {/* LEFT PANEL: Selection */}
            <div className="lg:col-span-4 space-y-6">
                <Card className="border-l-4 border-l-blue-500 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <UserPlus className="w-5 h-5 text-blue-500" /> Quick Selection
                        </CardTitle>
                        <CardDescription>Department & Doctor</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Department *</Label>
                            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                                <SelectTrigger className="bg-slate-50">
                                    <SelectValue placeholder="Select Department" />
                                </SelectTrigger>
                                <SelectContent>
                                    {departments.map(d => (
                                        <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {selectedDepartment && (
                            <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                                <Label>Doctor *</Label>
                                <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
                                    <SelectTrigger className="bg-slate-50">
                                        <SelectValue placeholder="Select Doctor" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {selectedDept?.doctors.map(d => (
                                            <SelectItem key={d.id} value={d.id}>
                                                <span className="font-medium">{d.name}</span>
                                                <span className="ml-2 text-xs text-muted-foreground">({d.status || 'Active'})</span>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        {selectedDoc && (
                            <div className="p-4 bg-blue-50 rounded-lg border border-blue-100 text-sm space-y-2">
                                <div className="flex items-center gap-2 text-blue-800 font-semibold">
                                    <Stethoscope className="w-4 h-4" /> {selectedDoc.name}
                                </div>
                                <div className="flex justify-between items-center text-blue-700">
                                    <span>Fee:</span>
                                    <Badge variant="secondary" className="bg-white text-blue-800">
                                        Rs. {selectedDoc.consultationFee}
                                    </Badge>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Info Card / Tips */}
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 text-xs text-yellow-800 flex gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <div>
                        <strong>Keyboard Shortcuts:</strong><br />
                        Start typing to search existing patients.<br />
                        <strong>Ctrl + Enter</strong> to Save.<br />
                        <strong>Esc</strong> to Clear form.
                    </div>
                </div>
            </div>

            {/* RIGHT PANEL: Form */}
            <div className="lg:col-span-8">
                <Card className="h-full border-t-4 border-t-green-500 shadow-sm">
                    <CardHeader className="pb-4 flex flex-row items-center justify-between space-y-0">
                        <div>
                            <CardTitle className="text-xl">Patient Registration</CardTitle>
                            <CardDescription>Enter patient demographics</CardDescription>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => setIsSearchOpen(true)}>
                                <Search className="w-4 h-4 mr-2" /> Search Existing
                            </Button>
                            <Button variant="ghost" size="sm" onClick={handleClear} className="text-red-500 hover:text-red-600 hover:bg-red-50">
                                <RefreshCw className="w-4 h-4 mr-2" /> Reset
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Row 1 */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Full Name *</Label>
                                <Input
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="e.g. John Doe"
                                    className="text-lg font-medium"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Phone Number *</Label>
                                <Input
                                    value={formData.phone}
                                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                    placeholder="0300-1234567"
                                />
                            </div>
                        </div>

                        {/* Row 2 */}
                        <div className="grid grid-cols-4 gap-4">
                            <div className="space-y-2 col-span-2 sm:col-span-1">
                                <Label>Age (Y)</Label>
                                <Input
                                    type="number"
                                    value={formData.age}
                                    onChange={e => setFormData({ ...formData, age: e.target.value })}
                                    placeholder="30"
                                />
                            </div>
                            <div className="space-y-2 col-span-2 sm:col-span-1">
                                <Label>Gender</Label>
                                <Select value={formData.gender} onValueChange={v => setFormData({ ...formData, gender: v })}>
                                    <SelectTrigger><SelectValue placeholder="Gender" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="male">Male</SelectItem>
                                        <SelectItem value="female">Female</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2 col-span-4 sm:col-span-2">
                                <Label>Emergency Contact</Label>
                                <Input
                                    value={formData.emergencyContact}
                                    onChange={e => setFormData({ ...formData, emergencyContact: e.target.value })}
                                    placeholder="Optional"
                                />
                            </div>
                        </div>

                        {/* Row 3 */}
                        <div className="space-y-2">
                            <Label>Chief Complaint / Symptoms *</Label>
                            <Textarea
                                value={formData.complaint}
                                onChange={e => setFormData({ ...formData, complaint: e.target.value })}
                                className="min-h-[100px] text-base resize-none bg-slate-50 focus:bg-white transition-colors"
                                placeholder="Describe main symptoms..."
                            />
                            <div className="text-xs text-muted-foreground text-right">Press Enter for new line. Ctrl+Enter to Save.</div>
                        </div>

                        <div className="pt-4 flex justify-end gap-3">
                            <Button variant="ghost" onClick={handleClear}>Cancel</Button>
                            <Button
                                size="lg"
                                onClick={() => handleSave(false)}
                                disabled={loading}
                                className="bg-green-600 hover:bg-green-700 w-full sm:w-auto min-w-[200px]"
                            >
                                {loading ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                                {patientId ? "Update & Submit" : "Submit Registration"}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Duplicate Modal */}
            <Dialog open={showDuplicateModal} onOpenChange={setShowDuplicateModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-orange-600">
                            <AlertTriangle className="w-5 h-5" /> Possible Duplicates Found
                        </DialogTitle>
                        <DialogDescription>
                            We found existing patients with similar details.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-3 py-4">
                        {duplicateList.map(dup => (
                            <div key={dup.id} className="flex justify-between items-center p-3 border rounded bg-slate-50">
                                <div>
                                    <div className="font-bold text-slate-800">{dup.name}</div>
                                    <div className="text-sm text-muted-foreground">{dup.phone} | {dup.mrn}</div>
                                </div>
                                <Button size="sm" variant="outline" onClick={() => { selectPatient(dup); setShowDuplicateModal(false); }}>
                                    Use Existing
                                </Button>
                            </div>
                        ))}
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setShowDuplicateModal(false)}>Cancel</Button>
                        <Button variant="default" onClick={() => handleSave(true)}>
                            Ignore & Create New
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Search Dialog */}
            <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Search Patient Database</DialogTitle>
                        <DialogDescription>Search by Name, Phone or MRN</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 pt-4">
                        <div className="flex gap-2">
                            <Input
                                placeholder="Type search query..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleSearch()}
                                autoFocus
                            />
                            <Button onClick={handleSearch} disabled={loading}>{loading ? '...' : 'Search'}</Button>
                        </div>
                        <div className="max-h-[300px] overflow-y-auto space-y-2">
                            {searchResults.map(p => (
                                <div key={p.id}
                                    className="p-3 border rounded hover:bg-slate-50 cursor-pointer flex justify-between items-center"
                                    onClick={() => selectPatient(p)}
                                >
                                    <div>
                                        <div className="font-semibold">{p.name}</div>
                                        <div className="text-xs text-muted-foreground">{p.mrn} | {p.phone}</div>
                                    </div>
                                    <Badge variant="outline">Select</Badge>
                                </div>
                            ))}
                            {searchResults.length === 0 && searchQuery && !loading && (
                                <div className="text-center text-sm text-muted-foreground py-4">No patients found.</div>
                            )}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};
