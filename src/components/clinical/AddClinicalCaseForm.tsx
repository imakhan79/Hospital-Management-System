
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, User, FileText, Stethoscope } from "lucide-react";

interface AddClinicalCaseFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddCase: (caseData: any) => void;
}

export const AddClinicalCaseForm = ({ open, onOpenChange, onAddCase }: AddClinicalCaseFormProps) => {
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    patientId: "",
    patientName: "",
    age: "",
    gender: "",
    contactNumber: "",
    diagnosis: "",
    symptoms: "",
    treatment: "",
    medication: "",
    doctor: "",
    department: "",
    priority: "Medium",
    notes: "",
    admissionDate: new Date().toISOString().split('T')[0]
  });

  // Demo data for dropdowns
  const demoPatients = [
    { id: "P001", name: "Ahmed Hassan", age: 45, gender: "Male", contact: "+92-300-1234567" },
    { id: "P002", name: "Fatima Sheikh", age: 32, gender: "Female", contact: "+92-301-2345678" },
    { id: "P003", name: "Muhammad Ali", age: 67, gender: "Male", contact: "+92-302-3456789" },
    { id: "P004", name: "Aisha Khan", age: 28, gender: "Female", contact: "+92-303-4567890" },
    { id: "P005", name: "Hassan Malik", age: 55, gender: "Male", contact: "+92-304-5678901" }
  ];

  const departments = [
    "Cardiology", "Neurology", "Pediatrics", "Orthopedics", 
    "Dermatology", "Oncology", "Emergency", "General Medicine"
  ];

  const doctors = [
    "Dr. Muhammad Iqbal", "Dr. Fatima Shah", "Dr. Ahmed Ali", 
    "Dr. Ayesha Khan", "Dr. Hassan Malik", "Dr. Zainab Ahmed",
    "Dr. Usman Tariq", "Dr. Sana Hussain"
  ];

  const handlePatientSelect = (patientId: string) => {
    const patient = demoPatients.find(p => p.id === patientId);
    if (patient) {
      setFormData(prev => ({
        ...prev,
        patientId: patient.id,
        patientName: patient.name,
        age: patient.age.toString(),
        gender: patient.gender,
        contactNumber: patient.contact
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.patientId || !formData.diagnosis || !formData.doctor || !formData.department) {
      toast({
        variant: "destructive",
        title: "Missing Required Fields",
        description: "Please fill in all required fields: Patient, Diagnosis, Doctor, and Department."
      });
      return;
    }

    const newCase = {
      id: Math.random().toString(36).substr(2, 9),
      patient_id: formData.patientId,
      patient_name: formData.patientName,
      age: parseInt(formData.age),
      gender: formData.gender,
      contact_number: formData.contactNumber,
      diagnosis: formData.diagnosis,
      symptoms: formData.symptoms,
      treatment: formData.treatment,
      medication: formData.medication,
      doctor: formData.doctor,
      department: formData.department,
      priority: formData.priority,
      status: "Active",
      admission_date: formData.admissionDate,
      last_visit: formData.admissionDate,
      notes: formData.notes,
      created_at: new Date().toISOString()
    };

    onAddCase(newCase);
    
    toast({
      title: "Clinical Case Added",
      description: `New case for ${formData.patientName} has been created successfully.`
    });

    // Reset form
    setFormData({
      patientId: "",
      patientName: "",
      age: "",
      gender: "",
      contactNumber: "",
      diagnosis: "",
      symptoms: "",
      treatment: "",
      medication: "",
      doctor: "",
      department: "",
      priority: "Medium",
      notes: "",
      admissionDate: new Date().toISOString().split('T')[0]
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Add New Clinical Case
          </DialogTitle>
          <DialogDescription>
            Create a new clinical case record for patient management
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Patient Information Section */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-4">
                <User className="h-4 w-4" />
                <h3 className="font-semibold">Patient Information</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="patient">Select Patient *</Label>
                  <Select value={formData.patientId} onValueChange={handlePatientSelect}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose existing patient" />
                    </SelectTrigger>
                    <SelectContent>
                      {demoPatients.map(patient => (
                        <SelectItem key={patient.id} value={patient.id}>
                          {patient.id} - {patient.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="patientName">Patient Name</Label>
                  <Input
                    id="patientName"
                    value={formData.patientName}
                    onChange={(e) => setFormData({...formData, patientName: e.target.value})}
                    placeholder="Patient full name"
                    readOnly={!!formData.patientId}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({...formData, age: e.target.value})}
                    placeholder="Patient age"
                    readOnly={!!formData.patientId}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select 
                    value={formData.gender} 
                    onValueChange={(value) => setFormData({...formData, gender: value})}
                    disabled={!!formData.patientId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact">Contact Number</Label>
                  <Input
                    id="contact"
                    value={formData.contactNumber}
                    onChange={(e) => setFormData({...formData, contactNumber: e.target.value})}
                    placeholder="+92-300-1234567"
                    readOnly={!!formData.patientId}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="admissionDate">Admission Date</Label>
                  <Input
                    id="admissionDate"
                    type="date"
                    value={formData.admissionDate}
                    onChange={(e) => setFormData({...formData, admissionDate: e.target.value})}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Clinical Information Section */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-4">
                <Stethoscope className="h-4 w-4" />
                <h3 className="font-semibold">Clinical Information</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="doctor">Attending Doctor *</Label>
                  <Select value={formData.doctor} onValueChange={(value) => setFormData({...formData, doctor: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select doctor" />
                    </SelectTrigger>
                    <SelectContent>
                      {doctors.map(doctor => (
                        <SelectItem key={doctor} value={doctor}>{doctor}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="department">Department *</Label>
                  <Select value={formData.department} onValueChange={(value) => setFormData({...formData, department: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map(dept => (
                        <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="diagnosis">Primary Diagnosis *</Label>
                  <Input
                    id="diagnosis"
                    value={formData.diagnosis}
                    onChange={(e) => setFormData({...formData, diagnosis: e.target.value})}
                    placeholder="Enter primary diagnosis"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority">Priority Level</Label>
                  <Select value={formData.priority} onValueChange={(value) => setFormData({...formData, priority: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="symptoms">Symptoms</Label>
                  <Textarea
                    id="symptoms"
                    value={formData.symptoms}
                    onChange={(e) => setFormData({...formData, symptoms: e.target.value})}
                    placeholder="Describe patient symptoms..."
                    rows={3}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="treatment">Treatment Plan</Label>
                  <Textarea
                    id="treatment"
                    value={formData.treatment}
                    onChange={(e) => setFormData({...formData, treatment: e.target.value})}
                    placeholder="Outline treatment plan..."
                    rows={3}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="medication">Prescribed Medication</Label>
                  <Textarea
                    id="medication"
                    value={formData.medication}
                    onChange={(e) => setFormData({...formData, medication: e.target.value})}
                    placeholder="List prescribed medications..."
                    rows={2}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="notes">Additional Notes</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    placeholder="Any additional clinical notes..."
                    rows={2}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="w-full sm:w-auto"
            >
              <FileText className="mr-2 h-4 w-4" />
              Create Clinical Case
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
