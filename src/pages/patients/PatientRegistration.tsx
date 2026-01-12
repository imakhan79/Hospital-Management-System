import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Search, UserPlus, FileText, Check, AlertCircle, Printer, AlertTriangle, X, Send, Smartphone, Plus, Stethoscope } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import { PatientService } from "@/services/patient-service";
import { createVisit, departments, addNewDoctor } from "@/services/opdService"; // Import departments
import { PatientProfile, RegistrationInput, DuplicateMatch, IdentificationType } from "@/types/patient-types";
import { useAuth } from "@/hooks/use-auth";

// Helper for Token Generation - slightly enhanced format
const generateToken = (dept: string, doctorName?: string) => {
  const prefix = dept === 'Emergency' ? 'ER' : dept.substring(0, 2).toUpperCase();
  const docCode = doctorName ? doctorName.split(' ').pop()?.substring(0, 2).toUpperCase() : 'GN';
  const num = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${prefix}-${docCode}-${num}`;
};

const PatientRegistration = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [mode, setMode] = useState<'search' | 'register'>('search');

  // Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<PatientProfile[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<PatientProfile | null>(null);

  // Registration State
  const [isUnknown, setIsUnknown] = useState(false);
  const [duplicates, setDuplicates] = useState<DuplicateMatch[]>([]);
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  // Add Doctor State
  const [isAddDoctorOpen, setIsAddDoctorOpen] = useState(false);
  const [isAddingDoctor, setIsAddingDoctor] = useState(false);
  const [newDoctor, setNewDoctor] = useState<{
    name: string;
    department: string;
    specialization: string;
    qualification: string;
    phone: string;
    room: string;
    status: "Active" | "Inactive";
  }>({
    name: "",
    department: "",
    specialization: "",
    qualification: "",
    phone: "",
    room: "",
    status: "Active"
  });

  const canAddDoctor = user?.role === 'admin' || user?.role === 'supervisor';

  // Confirmation & Success State
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState<{
    token: string;
    mrNumber: string;
    name: string;
    dept: string;
    doctor: string; // Add doctor to success state
    priority: string;
    timestamp: string;
  } | null>(null);

  const [regForm, setRegForm] = useState<Partial<RegistrationInput>>({
    firstName: "", lastName: "", gender: "Male", phone: "",
    identificationType: "CNIC", identificationNumber: "",
    dob: "", address: "",
    visitDetails: { type: 'OPD', department: 'General Medicine', priority: 'routine', doctor: "" }
  });

  // Derived state for Doctors based on selected Department
  const availableDoctors = regForm.visitDetails?.department
    ? departments.find(d => d.name === regForm.visitDetails?.department)?.doctors || []
    : [];

  // Handlers
  const handleSearch = async () => {
    if (!searchQuery) return;
    setIsSearching(true);
    const results = await PatientService.searchPatients(searchQuery);
    setSearchResults(results);
    setIsSearching(false);
  };

  const handleDuplicateCheck = async () => {
    if (isUnknown) return;
    if ((regForm.firstName && regForm.phone) || regForm.identificationNumber) {
      const matches = await PatientService.checkDuplicates(regForm as any);
      if (matches.length > 0) {
        setDuplicates(matches);
        setShowDuplicateModal(true);
      }
    }
  };

  const handleUnknownToggle = (checked: boolean) => {
    setIsUnknown(checked);
    if (checked) {
      setRegForm(prev => ({
        ...prev,
        firstName: "Unknown",
        lastName: `Patient-${Math.floor(Math.random() * 1000)}`,
        phone: "0000-0000000",
        identificationType: "None",
        identificationNumber: "",
        dob: "1990-01-01",
        address: "Unknown"
      }));
    } else {
      setRegForm(prev => ({
        ...prev,
        firstName: "", lastName: "", phone: "", identificationType: "CNIC", identificationNumber: "", dob: ""
      }));
    }
  };

  // Add New Doctor Handler
  const handleAddDoctor = async () => {
    if (!newDoctor.name || !newDoctor.department) {
      toast({ variant: "destructive", title: "Error", description: "Doctor Name and Department are required" });
      return;
    }
    setIsAddingDoctor(true);
    try {
      const addedDoc = await addNewDoctor({
        ...newDoctor,
        createdBy: user?.email || 'Unknown'
      }, newDoctor.department); // Use selected department

      setIsAddDoctorOpen(false);
      setNewDoctor({ name: "", department: "", specialization: "", qualification: "", phone: "", room: "", status: "Active" });

      // Check if added to current department
      if (newDoctor.department === regForm.visitDetails?.department) {
        toast({ title: "Success", description: "Doctor added and selected." });
        // Auto-select the new doctor
        setRegForm(prev => ({
          ...prev,
          visitDetails: {
            ...prev.visitDetails!,
            doctor: addedDoc.name
          }
        }));
      } else {
        toast({
          title: "Doctor Added",
          description: `Doctor added to ${newDoctor.department}. Change Department to view.`,
          action: <Button variant="outline" size="sm" onClick={() => {
            setRegForm(prev => ({
              ...prev,
              visitDetails: { ...prev.visitDetails!, department: newDoctor.department, doctor: addedDoc.name }
            }));
          }}>Switch</Button>
        });
      }

    } catch (error: any) {
      toast({ variant: "destructive", title: "Failed", description: error.message });
    }
    setIsAddingDoctor(false);
  };

  // Finalize Registration (New)
  const handleRegister = async () => {
    // Validation for Doctor
    if (regForm.visitDetails?.type === 'OPD' && !regForm.visitDetails.doctor) {
      toast({ variant: "destructive", title: "Missing Information", description: "Please select a doctor for OPD visit." });
      return;
    }

    setIsRegistering(true);
    const result = await PatientService.registerPatient(regForm as RegistrationInput);

    if (result.success) {
      // Add to OPD Queue if applicable
      if (regForm.visitDetails?.type === 'OPD') {
        await createVisit({
          patientId: result.patientId!,
          patientName: `${regForm.firstName} ${regForm.lastName}`,
          patientPhone: regForm.phone!,
          department: regForm.visitDetails.department!,
          doctor: regForm.visitDetails.doctor!,
          date: new Date().toISOString().split('T')[0],
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'booked', // Or 'checked-in' if we want to skip a step
          type: 'walk-in',
          priority: (regForm.visitDetails.priority?.toLowerCase() as any) || 'routine'
        });
      }

      const token = generateToken(regForm.visitDetails?.department || 'GEN', regForm.visitDetails?.doctor);
      setRegistrationSuccess({
        token,
        mrNumber: result.mrNumber!,
        name: `${regForm.firstName} ${regForm.lastName}`,
        dept: regForm.visitDetails?.department || 'General',
        doctor: regForm.visitDetails?.doctor || 'N/A',
        priority: regForm.visitDetails?.priority || 'Routine',
        timestamp: new Date().toLocaleString()
      });
    } else {
      toast({ variant: "destructive", title: "Registration Failed", description: result.message });
    }
    setIsRegistering(false);
  };

  // Trigger Check-In Confirmation (Existing)
  const initiateCheckIn = () => {
    if (!selectedPatient) return;
    if (regForm.visitDetails?.type === 'OPD' && !regForm.visitDetails.doctor) {
      toast({ variant: "destructive", title: "Missing Information", description: "Please select a doctor for OPD visit." });
      return;
    }
    setShowConfirmModal(true);
  };

  // Finalize Check-In (Existing)
  const handleConfirmCheckIn = async () => {
    if (!selectedPatient) return;

    const token = generateToken(regForm.visitDetails?.department || 'GEN', regForm.visitDetails?.doctor);

    // Add to OPD Queue
    if (regForm.visitDetails?.type === 'OPD') {
      await createVisit({
        patientId: selectedPatient.id,
        patientName: `${selectedPatient.firstName} ${selectedPatient.lastName}`,
        patientPhone: selectedPatient.phone,
        department: regForm.visitDetails?.department!,
        doctor: regForm.visitDetails?.doctor!,
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'booked',
        type: 'walk-in',
        priority: (regForm.visitDetails.priority?.toLowerCase() as any) || 'routine'
      });
    }

    setShowConfirmModal(false);
    setRegistrationSuccess({
      token,
      mrNumber: selectedPatient.mrNumber,
      name: `${selectedPatient.firstName} ${selectedPatient.lastName}`,
      dept: regForm.visitDetails?.department || 'General',
      doctor: regForm.visitDetails?.doctor || 'N/A',
      priority: regForm.visitDetails?.priority || 'Routine',
      timestamp: new Date().toLocaleString()
    });
  };

  const resetFlow = () => {
    setRegistrationSuccess(null);
    setMode('search');
    setSelectedPatient(null);
    setSearchQuery("");
    setSearchResults([]);
    setRegForm({
      firstName: "", lastName: "", gender: "Male", phone: "",
      identificationType: "CNIC", identificationNumber: "",
      dob: "", address: "",
      visitDetails: { type: 'OPD', department: 'General Medicine', priority: 'routine', doctor: "" }
    });
  };

  if (registrationSuccess) {
    return (
      <MainLayout>
        <div className="h-[calc(100vh-100px)] flex items-center justify-center p-4">
          <Card className="w-full max-w-md border-2 border-green-500 shadow-xl animate-in zoom-in-95 duration-300">
            <CardHeader className="text-center bg-green-50/50 pb-2">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl text-green-700">Registration Complete</CardTitle>
              <CardDescription>Patient has been added to the queue.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6 text-center">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground uppercase tracking-wider">Queue Token Number</p>
                <div className="text-5xl font-black text-slate-900 tracking-tight">{registrationSuccess.token}</div>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg border text-left space-y-2 text-sm">
                <div className="flex justify-between border-b pb-2 mb-2">
                  <span className="text-muted-foreground">Patient:</span>
                  <span className="font-bold text-lg">{registrationSuccess.name}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-xs text-muted-foreground block">MR Number</span>
                    <span className="font-mono font-medium">{registrationSuccess.mrNumber}</span>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground block">Priority</span>
                    <Badge variant={registrationSuccess.priority === 'urgent' ? 'destructive' : 'outline'}>
                      {registrationSuccess.priority}
                    </Badge>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground block">Department</span>
                    <span className="font-medium">{registrationSuccess.dept}</span>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground block">Doctor</span>
                    <span className="font-medium text-blue-600">{registrationSuccess.doctor}</span>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground mt-2 text-center pt-2 border-t">
                  Generated: {registrationSuccess.timestamp}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="gap-2"><Printer className="w-4 h-4" /> Print Token</Button>
                <Button variant="outline" className="gap-2"><Smartphone className="w-4 h-4" /> Send SMS</Button>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" size="lg" onClick={resetFlow}>Register Next Patient</Button>
            </CardFooter>
          </Card>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6 max-w-6xl mx-auto p-4">
        {/* ... Header and Search ... */}
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon" asChild>
              <Link to="/dashboard"><ArrowLeft className="h-4 w-4" /></Link>
            </Button>
            <h1 className="text-3xl font-bold tracking-tight">Patient Registration</h1>
          </div>
          <div className="flex gap-2">
            <Button variant={mode === 'search' ? 'default' : 'outline'} onClick={() => setMode('search')}>
              <Search className="mr-2 h-4 w-4" /> Search Existing
            </Button>
            <Button variant={mode === 'register' ? 'default' : 'outline'} onClick={() => setMode('register')}>
              <UserPlus className="mr-2 h-4 w-4" /> Register New
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Content Area - Truncated for brevity, focusing on changes */}
          <Card className="lg:col-span-8 shadow-md min-h-[500px]">
            <CardHeader>
              <CardTitle>{mode === 'search' ? "Search Patient Database" : "New Patient Registration"}</CardTitle>
              <CardDescription>
                {mode === 'search'
                  ? "Identify existing patients by MR, CNIC, or Phone."
                  : "Enter patient demographics to create a new Medical Record."}
              </CardDescription>
            </CardHeader>

            <CardContent>
              {mode === 'search' ? (
                <div className="space-y-6">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        placeholder="Type Name, MR Number, Phone or CNIC..."
                        className="pl-9 text-lg py-6"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleSearch()}
                        autoFocus
                      />
                    </div>
                    <Button size="lg" onClick={handleSearch} disabled={isSearching}>
                      {isSearching ? "..." : "Search"}
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {searchResults.length === 0 && !isSearching && searchQuery && (
                      <div className="text-center py-8 text-muted-foreground bg-muted/50 rounded-lg">
                        <AlertCircle className="w-10 h-10 mx-auto mb-2 opacity-20" />
                        <p>No matches found.</p>
                        <Button variant="link" onClick={() => setMode('register')}>Create New Record</Button>
                      </div>
                    )}
                    {/* ... Search Results ... */}
                    {searchResults.map(patient => (
                      <div key={patient.id}
                        onClick={() => setSelectedPatient(patient)}
                        className={`p-4 border rounded-lg cursor-pointer transition-all hover:bg-slate-50 flex justify-between items-center group
                                                    ${selectedPatient?.id === patient.id ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-500' : ''}`}
                      >
                        <div>
                          <h3 className="font-bold text-lg group-hover:text-blue-600 transition-colors">{patient.firstName} {patient.lastName}</h3>
                          <div className="flex gap-3 text-sm text-muted-foreground mt-1 items-center">
                            <Badge variant="outline" className="font-mono">{patient.mrNumber}</Badge>
                            <span>{patient.phone}</span>
                            <span className="w-1 h-1 bg-gray-300 rounded-full" />
                            <span>{patient.gender}, {patient.age || 'N/A'}y</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <Button variant="ghost" size="sm" className={selectedPatient?.id === patient.id ? 'text-blue-600' : 'text-gray-400'}>
                            Select <Check className={`ml-2 w-4 h-4 ${selectedPatient?.id === patient.id ? 'opacity-100' : 'opacity-0'}`} />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* ... New Patient Form Fields ... */}
                  <div className="flex items-center justify-between bg-red-50 p-4 rounded-lg border border-red-100">
                    {/* ... Unknown Toggle ... */}
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="text-red-600 w-5 h-5" />
                      <div>
                        <Label htmlFor="unknown-mode" className="font-bold text-red-900">Emergency / Unknown Patient</Label>
                        <p className="text-xs text-red-700">Auto-fills temporary identity.</p>
                      </div>
                    </div>
                    <Switch id="unknown-mode" checked={isUnknown} onCheckedChange={handleUnknownToggle} />
                  </div>

                  {/* Demographics */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* ... Name, Phone, DOB Inputs ... */}
                    <div className="space-y-2">
                      <Label>First Name *</Label>
                      <Input disabled={isUnknown} value={regForm.firstName}
                        onChange={e => setRegForm({ ...regForm, firstName: e.target.value })}
                        onBlur={handleDuplicateCheck}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Last Name *</Label>
                      <Input disabled={isUnknown} value={regForm.lastName} onChange={e => setRegForm({ ...regForm, lastName: e.target.value })} />
                    </div>

                    <div className="space-y-2">
                      <Label>Phone Number *</Label>
                      <Input disabled={isUnknown} value={regForm.phone}
                        onChange={e => setRegForm({ ...regForm, phone: e.target.value })}
                        onBlur={handleDuplicateCheck}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Date of Birth</Label>
                      <Input disabled={isUnknown} type="date" value={regForm.dob} onChange={e => setRegForm({ ...regForm, dob: e.target.value })} />
                    </div>

                    <div className="space-y-2">
                      <Label>Identity Doc</Label>
                      <div className="flex gap-2">
                        <Select disabled={isUnknown} value={regForm.identificationType} onValueChange={(v: any) => setRegForm({ ...regForm, identificationType: v })}>
                          <SelectTrigger className="w-[110px]"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="CNIC">CNIC</SelectItem>
                            <SelectItem value="Passport">Passport</SelectItem>
                          </SelectContent>
                        </Select>
                        <Input disabled={isUnknown} value={regForm.identificationNumber}
                          onChange={e => setRegForm({ ...regForm, identificationNumber: e.target.value })}
                          onBlur={handleDuplicateCheck}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Gender</Label>
                      <Select value={regForm.gender} onValueChange={(v: any) => setRegForm({ ...regForm, gender: v })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent><SelectItem value="Male">Male</SelectItem><SelectItem value="Female">Female</SelectItem></SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Address</Label>
                    <Input disabled={isUnknown} value={regForm.address} onChange={e => setRegForm({ ...regForm, address: e.target.value })} />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Right Action Panel */}
          <div className="lg:col-span-4 space-y-6">
            {/* Selected / Summary Card */}
            <Card className="bg-slate-50 border-slate-200 shadow-inner">
              <CardHeader className="pb-2">
                <CardTitle className="text-md font-medium text-slate-500 uppercase tracking-widest">
                  {mode === 'search' ? "Check-In" : "Registration"} Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {mode === 'search' && selectedPatient ? (
                  <div className="bg-white p-4 rounded-md border text-sm space-y-2 shadow-sm">
                    <div className="font-bold text-lg text-primary">{selectedPatient.firstName} {selectedPatient.lastName}</div>
                    <div className="flex justify-between"><span>MRN:</span> <span className="font-mono bg-slate-100 px-1 rounded">{selectedPatient.mrNumber}</span></div>
                    <div className="flex justify-between"><span>Phone:</span> <span>{selectedPatient.phone}</span></div>
                  </div>
                ) : mode === 'register' ? (
                  <div className="bg-white p-4 rounded-md border text-sm text-center text-muted-foreground">
                    Entering New Patient Details
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground py-8 border-2 border-dashed rounded-lg">
                    Select a patient to proceed
                  </div>
                )}

                <div className="space-y-4 pt-4 border-t border-slate-200">
                  <div className="space-y-1">
                    <Label>Visit Type</Label>
                    <Select
                      value={regForm.visitDetails?.type}
                      onValueChange={(v: any) => setRegForm({ ...regForm, visitDetails: { ...regForm.visitDetails!, type: v } })}
                    >
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent><SelectItem value="OPD">OPD Consultation</SelectItem><SelectItem value="ER">Emergency</SelectItem><SelectItem value="IPD">In-Patient (Admit)</SelectItem></SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label>Department</Label>
                    <Select
                      value={regForm.visitDetails?.department}
                      onValueChange={v => setRegForm({ ...regForm, visitDetails: { ...regForm.visitDetails!, department: v, doctor: "" } })} // Reset doctor on dept change
                    >
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {departments.map(d => (
                          <SelectItem key={d.id} value={d.name}>{d.name}</SelectItem>
                        ))}
                        <SelectItem value="General Medicine">General Medicine</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Doctor Selection */}
                  <div className="space-y-1">
                    <Label>Doctor</Label>
                    <Select
                      value={regForm.visitDetails?.doctor}
                      onValueChange={(v) => setRegForm({ ...regForm, visitDetails: { ...regForm.visitDetails!, doctor: v } })}
                      disabled={!regForm.visitDetails?.department}
                    >
                      <SelectTrigger><SelectValue placeholder="Select Doctor" /></SelectTrigger>
                      <SelectContent>
                        {availableDoctors.map(doc => (
                          <SelectItem key={doc.id} value={doc.name}>{doc.name}</SelectItem>
                        ))}
                        {canAddDoctor && (
                          <div className="p-2 border-t mt-1">
                            <Button variant="ghost" className="w-full justify-start h-8 font-normal text-blue-600" onClick={(e) => {
                              e.preventDefault();
                              setNewDoctor(prev => ({ ...prev, department: regForm.visitDetails?.department || "" }));
                              setIsAddDoctorOpen(true);
                            }}>
                              <Plus className="mr-2 h-4 w-4" /> Add New Doctor
                            </Button>
                          </div>
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label>Priority</Label>
                    <Select
                      value={regForm.visitDetails?.priority}
                      onValueChange={(v: any) => setRegForm({ ...regForm, visitDetails: { ...regForm.visitDetails!, priority: v } })}
                    >
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="routine">Routine</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                        <SelectItem value="emergency">Emergency</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full gap-2 text-lg h-12"
                  onClick={mode === 'search' ? initiateCheckIn : handleRegister}
                  disabled={(mode === 'search' && !selectedPatient) || (mode === 'register' && isRegistering)}
                >
                  <Check className="w-5 h-5" />
                  {mode === 'search' ? "Generate Token" : "Register & Token"}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>

        {/* Add Doctor Modal */}
        <Dialog open={isAddDoctorOpen} onOpenChange={setIsAddDoctorOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Doctor</DialogTitle>
              <DialogDescription>
                Register a new doctor for <strong>{regForm.visitDetails?.department}</strong>.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Department *</Label>
                <Select
                  value={newDoctor.department}
                  onValueChange={(v) => setNewDoctor({ ...newDoctor, department: v })}
                >
                  <SelectTrigger><SelectValue placeholder="Select Department" /></SelectTrigger>
                  <SelectContent>
                    {departments.map(d => (
                      <SelectItem key={d.id} value={d.name}>{d.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Full Name *</Label>
                <div className="relative">
                  <Stethoscope className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input className="pl-9" placeholder="Dr. Name" value={newDoctor.name} onChange={e => setNewDoctor({ ...newDoctor, name: e.target.value })} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Specialization</Label>
                  <Input placeholder="e.g. Cardiology" value={newDoctor.specialization} onChange={e => setNewDoctor({ ...newDoctor, specialization: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Qualification</Label>
                  <Input placeholder="MBBS, FCPS" value={newDoctor.qualification} onChange={e => setNewDoctor({ ...newDoctor, qualification: e.target.value })} />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Phone (Optional)</Label>
                <Input placeholder="0300-0000000" value={newDoctor.phone} onChange={e => setNewDoctor({ ...newDoctor, phone: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Room / Counter</Label>
                  <Input placeholder="e.g. Room 101" value={newDoctor.room} onChange={e => setNewDoctor({ ...newDoctor, room: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    value={newDoctor.status}
                    onValueChange={(v) => setNewDoctor({ ...newDoctor, status: v as "Active" | "Inactive" })}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDoctorOpen(false)}>Cancel</Button>
              <Button onClick={handleAddDoctor} disabled={isAddingDoctor}>
                {isAddingDoctor ? "Saving..." : "Save & Select"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Duplicate Warning Modal ... */}
        <Dialog open={showDuplicateModal} onOpenChange={setShowDuplicateModal}>
          {/* ... */}
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-orange-600">
                <AlertTriangle className="h-5 w-5" /> Possible Duplicates Found
              </DialogTitle>
              <DialogDescription>
                Similar records exist. Avoid creating duplicate MR numbers.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-2 py-4">
              {duplicates.map((match, idx) => (
                <div key={idx} className="flex justify-between items-center p-3 bg-muted rounded border">
                  <div>
                    <div className="font-bold">{match.patient.firstName} {match.patient.lastName}</div>
                    <div className="text-xs text-muted-foreground">{match.patient.phone} | {match.patient.mrNumber}</div>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => {
                    setMode('search');
                    setSearchResults([match.patient]);
                    setSelectedPatient(match.patient);
                    setShowDuplicateModal(false);
                  }}>
                    Select Existing
                  </Button>
                </div>
              ))}
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setShowDuplicateModal(false)}>Ignore & Create New</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Confirmation Dialog for Existing Patient */}
        <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Check-In Details</DialogTitle>
              <DialogDescription>
                Creating a new <strong>{regForm.visitDetails?.type}</strong> visit for:
              </DialogDescription>
            </DialogHeader>
            {selectedPatient && (
              <div className="py-4 space-y-3">
                <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
                  <h3 className="font-bold text-lg text-blue-900">{selectedPatient.firstName} {selectedPatient.lastName}</h3>
                  <p className="text-blue-700">{selectedPatient.mrNumber}</p>
                </div>
                <div className="text-sm space-y-1">
                  <div className="flex justify-between"><span>Department:</span> <span className="font-medium">{regForm.visitDetails?.department}</span></div>
                  <div className="flex justify-between"><span>Doctor:</span> <span className="font-medium text-blue-600">{regForm.visitDetails?.doctor}</span></div>
                  <div className="flex justify-between"><span>Priority:</span> <span className="font-medium uppercase">{regForm.visitDetails?.priority}</span></div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowConfirmModal(false)}>Cancel</Button>
              <Button onClick={handleConfirmCheckIn}>Confirm & Generate Token</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </div>
    </MainLayout>
  );
};

export default PatientRegistration;
