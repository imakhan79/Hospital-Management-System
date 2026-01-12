import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  FileText, 
  Plus, 
  Download, 
  Send, 
  Eye, 
  Edit, 
  Trash2,
  Printer,
  Search,
  Filter,
  Calendar,
  User,
  Pill
} from "lucide-react";

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
  quantity: number;
}

interface Prescription {
  id: string;
  patientId: string;
  patientName: string;
  patientAge: number;
  doctorId: string;
  doctorName: string;
  consultationId: string;
  date: Date;
  diagnosis: string;
  medications: Medication[];
  status: 'draft' | 'issued' | 'dispensed' | 'completed';
  notes?: string;
  validUntil: Date;
}

export const TelemedicinePrescriptions = () => {
  const { toast } = useToast();
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([
    {
      id: '1',
      patientId: 'p1',
      patientName: 'John Doe',
      patientAge: 45,
      doctorId: 'd1',
      doctorName: 'Dr. Smith',
      consultationId: 'c1',
      date: new Date(),
      diagnosis: 'Hypertension',
      medications: [
        {
          id: 'm1',
          name: 'Lisinopril',
          dosage: '10mg',
          frequency: 'Once daily',
          duration: '30 days',
          instructions: 'Take with food in the morning',
          quantity: 30
        },
        {
          id: 'm2',
          name: 'Amlodipine',
          dosage: '5mg',
          frequency: 'Once daily',
          duration: '30 days',
          instructions: 'Take in the evening',
          quantity: 30
        }
      ],
      status: 'issued',
      notes: 'Monitor blood pressure weekly',
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    },
    {
      id: '2',
      patientId: 'p2',
      patientName: 'Jane Smith',
      patientAge: 32,
      doctorId: 'd2',
      doctorName: 'Dr. Davis',
      consultationId: 'c2',
      date: new Date(Date.now() - 24 * 60 * 60 * 1000),
      diagnosis: 'Upper Respiratory Infection',
      medications: [
        {
          id: 'm3',
          name: 'Amoxicillin',
          dosage: '500mg',
          frequency: 'Three times daily',
          duration: '7 days',
          instructions: 'Take with meals, complete full course',
          quantity: 21
        }
      ],
      status: 'dispensed',
      validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    }
  ]);

  const [isNewPrescriptionOpen, setIsNewPrescriptionOpen] = useState(false);
  const [editingPrescription, setEditingPrescription] = useState<Prescription | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const [newPrescription, setNewPrescription] = useState({
    patientName: '',
    patientAge: '',
    doctorName: 'Dr. Smith',
    diagnosis: '',
    medications: [] as Medication[],
    notes: ''
  });

  const [newMedication, setNewMedication] = useState({
    name: '',
    dosage: '',
    frequency: '',
    duration: '',
    instructions: '',
    quantity: 0
  });

  const filteredPrescriptions = prescriptions.filter(prescription => {
    const matchesStatus = filterStatus === 'all' || prescription.status === filterStatus;
    const matchesSearch = prescription.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prescription.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prescription.diagnosis.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'issued': return 'bg-blue-100 text-blue-800';
      case 'dispensed': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const addMedication = () => {
    if (newMedication.name && newMedication.dosage && newMedication.frequency) {
      const medication: Medication = {
        id: Date.now().toString(),
        ...newMedication
      };
      setNewPrescription({
        ...newPrescription,
        medications: [...newPrescription.medications, medication]
      });
      setNewMedication({
        name: '',
        dosage: '',
        frequency: '',
        duration: '',
        instructions: '',
        quantity: 0
      });
    }
  };

  const removeMedication = (medicationId: string) => {
    setNewPrescription({
      ...newPrescription,
      medications: newPrescription.medications.filter(med => med.id !== medicationId)
    });
  };

  const handleCreatePrescription = async () => {
    try {
      const prescription: Prescription = {
        id: Date.now().toString(),
        patientId: `p${Date.now()}`,
        patientName: newPrescription.patientName,
        patientAge: parseInt(newPrescription.patientAge),
        doctorId: `d${Date.now()}`,
        doctorName: newPrescription.doctorName,
        consultationId: `c${Date.now()}`,
        date: new Date(),
        diagnosis: newPrescription.diagnosis,
        medications: newPrescription.medications,
        status: 'draft',
        notes: newPrescription.notes,
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      };

      setPrescriptions([...prescriptions, prescription]);
      setIsNewPrescriptionOpen(false);
      setNewPrescription({
        patientName: '',
        patientAge: '',
        doctorName: 'Dr. Smith',
        diagnosis: '',
        medications: [],
        notes: ''
      });

      toast({
        title: "Prescription Created",
        description: `Prescription created for ${newPrescription.patientName}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create prescription",
        variant: "destructive"
      });
    }
  };

  const handleIssuePrescription = async (prescriptionId: string) => {
    try {
      setPrescriptions(prev => prev.map(prescription => 
        prescription.id === prescriptionId 
          ? { ...prescription, status: 'issued' as const }
          : prescription
      ));

      toast({
        title: "Prescription Issued",
        description: "Prescription has been issued to patient",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to issue prescription",
        variant: "destructive"
      });
    }
  };

  const handleDownloadPrescription = async (prescriptionId: string) => {
    try {
      // In a real app, this would generate and download a PDF
      toast({
        title: "Download Started",
        description: "Prescription PDF is being generated...",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download prescription",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
            <FileText className="h-5 w-5 sm:h-6 sm:w-6" />
            Digital Prescriptions
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Create and manage digital prescriptions for telemedicine consultations
          </p>
        </div>
        
        <Dialog open={isNewPrescriptionOpen} onOpenChange={setIsNewPrescriptionOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              New Prescription
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Prescription</DialogTitle>
            </DialogHeader>
            
            <Tabs defaultValue="patient" className="space-y-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="patient">Patient Info</TabsTrigger>
                <TabsTrigger value="medications">Medications</TabsTrigger>
                <TabsTrigger value="review">Review</TabsTrigger>
              </TabsList>
              
              <TabsContent value="patient" className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="patientName">Patient Name *</Label>
                    <Input
                      id="patientName"
                      value={newPrescription.patientName}
                      onChange={(e) => setNewPrescription({...newPrescription, patientName: e.target.value})}
                      placeholder="Enter patient name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="patientAge">Patient Age *</Label>
                    <Input
                      id="patientAge"
                      type="number"
                      value={newPrescription.patientAge}
                      onChange={(e) => setNewPrescription({...newPrescription, patientAge: e.target.value})}
                      placeholder="Enter patient age"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="doctorName">Prescribing Doctor *</Label>
                  <Select value={newPrescription.doctorName} onValueChange={(value) => setNewPrescription({...newPrescription, doctorName: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Dr. Smith">Dr. Smith - Cardiology</SelectItem>
                      <SelectItem value="Dr. Davis">Dr. Davis - Internal Medicine</SelectItem>
                      <SelectItem value="Dr. Johnson">Dr. Johnson - Dermatology</SelectItem>
                      <SelectItem value="Dr. Wilson">Dr. Wilson - Pediatrics</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="diagnosis">Diagnosis *</Label>
                  <Input
                    id="diagnosis"
                    value={newPrescription.diagnosis}
                    onChange={(e) => setNewPrescription({...newPrescription, diagnosis: e.target.value})}
                    placeholder="Enter diagnosis"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="notes">Clinical Notes</Label>
                  <Textarea
                    id="notes"
                    value={newPrescription.notes}
                    onChange={(e) => setNewPrescription({...newPrescription, notes: e.target.value})}
                    placeholder="Additional clinical notes..."
                    rows={3}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="medications" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Add Medication</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="medName">Medication Name *</Label>
                        <Input
                          id="medName"
                          value={newMedication.name}
                          onChange={(e) => setNewMedication({...newMedication, name: e.target.value})}
                          placeholder="e.g., Lisinopril"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="dosage">Dosage *</Label>
                        <Input
                          id="dosage"
                          value={newMedication.dosage}
                          onChange={(e) => setNewMedication({...newMedication, dosage: e.target.value})}
                          placeholder="e.g., 10mg"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="frequency">Frequency *</Label>
                        <Select value={newMedication.frequency} onValueChange={(value) => setNewMedication({...newMedication, frequency: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select frequency" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Once daily">Once daily</SelectItem>
                            <SelectItem value="Twice daily">Twice daily</SelectItem>
                            <SelectItem value="Three times daily">Three times daily</SelectItem>
                            <SelectItem value="Four times daily">Four times daily</SelectItem>
                            <SelectItem value="As needed">As needed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="duration">Duration</Label>
                        <Input
                          id="duration"
                          value={newMedication.duration}
                          onChange={(e) => setNewMedication({...newMedication, duration: e.target.value})}
                          placeholder="e.g., 30 days"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="quantity">Quantity</Label>
                        <Input
                          id="quantity"
                          type="number"
                          value={newMedication.quantity}
                          onChange={(e) => setNewMedication({...newMedication, quantity: parseInt(e.target.value) || 0})}
                          placeholder="Number of pills/doses"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="instructions">Instructions</Label>
                      <Textarea
                        id="instructions"
                        value={newMedication.instructions}
                        onChange={(e) => setNewMedication({...newMedication, instructions: e.target.value})}
                        placeholder="Special instructions (e.g., take with food)"
                        rows={2}
                      />
                    </div>
                    
                    <Button onClick={addMedication} disabled={!newMedication.name || !newMedication.dosage || !newMedication.frequency}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Medication
                    </Button>
                  </CardContent>
                </Card>
                
                {newPrescription.medications.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Added Medications</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {newPrescription.medications.map((med, index) => (
                          <div key={med.id} className="flex items-center justify-between p-3 bg-muted/30 rounded">
                            <div className="flex-1">
                              <h4 className="font-medium">{med.name} - {med.dosage}</h4>
                              <p className="text-sm text-muted-foreground">
                                {med.frequency} • {med.duration} • Qty: {med.quantity}
                              </p>
                              {med.instructions && (
                                <p className="text-sm text-muted-foreground italic mt-1">
                                  {med.instructions}
                                </p>
                              )}
                            </div>
                            <Button variant="outline" size="sm" onClick={() => removeMedication(med.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
              
              <TabsContent value="review" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Prescription Review</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium">Patient Information</h4>
                        <p className="text-sm text-muted-foreground">
                          {newPrescription.patientName}, Age: {newPrescription.patientAge}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Doctor: {newPrescription.doctorName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Diagnosis: {newPrescription.diagnosis}
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Medications ({newPrescription.medications.length})</h4>
                      <div className="space-y-2">
                        {newPrescription.medications.map((med) => (
                          <div key={med.id} className="p-3 bg-muted/30 rounded">
                            <div className="flex justify-between items-start">
                              <div>
                                <h5 className="font-medium">{med.name} {med.dosage}</h5>
                                <p className="text-sm text-muted-foreground">
                                  {med.frequency} for {med.duration}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  Quantity: {med.quantity}
                                </p>
                                {med.instructions && (
                                  <p className="text-sm text-muted-foreground italic">
                                    {med.instructions}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {newPrescription.notes && (
                      <div>
                        <h4 className="font-medium">Clinical Notes</h4>
                        <p className="text-sm text-muted-foreground">{newPrescription.notes}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
            
            <div className="flex flex-col sm:flex-row gap-2 mt-6">
              <Button onClick={() => setIsNewPrescriptionOpen(false)} variant="outline" className="flex-1">
                Cancel
              </Button>
              <Button 
                onClick={handleCreatePrescription} 
                disabled={!newPrescription.patientName || !newPrescription.diagnosis || newPrescription.medications.length === 0}
                className="flex-1"
              >
                Create Prescription
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search prescriptions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="issued">Issued</SelectItem>
                <SelectItem value="dispensed">Dispensed</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Prescriptions List */}
      <div className="space-y-4">
        {filteredPrescriptions.map(prescription => (
          <Card key={prescription.id}>
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div className="flex-1 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <h3 className="text-lg font-semibold">{prescription.patientName}</h3>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge className={getStatusColor(prescription.status)}>
                        {prescription.status}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        Age: {prescription.patientAge}
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {prescription.doctorName}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {prescription.date.toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <FileText className="h-3 w-3" />
                      {prescription.diagnosis}
                    </span>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-sm mb-2 flex items-center gap-1">
                      <Pill className="h-3 w-3" />
                      Medications ({prescription.medications.length})
                    </h4>
                    <div className="space-y-1">
                      {prescription.medications.slice(0, 2).map((med) => (
                        <p key={med.id} className="text-sm text-muted-foreground">
                          • {med.name} {med.dosage} - {med.frequency}
                        </p>
                      ))}
                      {prescription.medications.length > 2 && (
                        <p className="text-sm text-muted-foreground">
                          + {prescription.medications.length - 2} more medications
                        </p>
                      )}
                    </div>
                  </div>
                  
                  {prescription.notes && (
                    <p className="text-sm text-muted-foreground bg-muted/30 p-2 rounded">
                      {prescription.notes}
                    </p>
                  )}
                </div>
                
                <div className="flex flex-row lg:flex-col gap-2 lg:min-w-[200px]">
                  <Button 
                    variant="outline" 
                    onClick={() => handleDownloadPrescription(prescription.id)}
                    className="flex-1 lg:w-full"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Download PDF</span>
                    <span className="sm:hidden">PDF</span>
                  </Button>
                  
                  {prescription.status === 'draft' && (
                    <Button 
                      onClick={() => handleIssuePrescription(prescription.id)}
                      className="flex-1 lg:w-full"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      <span className="hidden sm:inline">Issue to Patient</span>
                      <span className="sm:hidden">Issue</span>
                    </Button>
                  )}
                  
                  <Button variant="outline" className="flex-1 lg:w-full">
                    <Eye className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">View Details</span>
                    <span className="sm:hidden">View</span>
                  </Button>
                  
                  <Button variant="outline" size="sm" className="lg:w-full">
                    <Printer className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Print</span>
                    <span className="sm:hidden">Print</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {filteredPrescriptions.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No prescriptions found</h3>
              <p className="text-muted-foreground mb-4">
                {prescriptions.length === 0 
                  ? "No prescriptions created yet." 
                  : "No prescriptions match your current filters."}
              </p>
              <Button onClick={() => setIsNewPrescriptionOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create First Prescription
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};