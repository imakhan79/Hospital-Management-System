import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Search, Plus, Edit, Eye, Filter, FileText, Clock, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PatientsTableProps {
  additionalCases?: any[];
}

export const PatientsTable = ({ additionalCases = [] }: PatientsTableProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const { toast } = useToast();

  const [newRecord, setNewRecord] = useState({
    patientId: "",
    diagnosis: "",
    symptoms: "",
    treatment: "",
    medication: "",
    notes: "",
    doctor: "",
    department: ""
  });

  const handleAddRecord = () => {
    toast({
      title: "Medical Record Added",
      description: `New record for patient ${newRecord.patientId} has been created.`,
    });
    setIsAddDialogOpen(false);
    setNewRecord({
      patientId: "",
      diagnosis: "",
      symptoms: "",
      treatment: "",
      medication: "",
      notes: "",
      doctor: "",
      department: ""
    });
  };

  // Mock data for demonstration - combined with new cases
  const mockPatients = [
    {
      id: "1",
      patient_id: "P001",
      patient_name: "John Doe",
      age: 45,
      gender: "Male",
      department: "Cardiology",
      doctor: "Dr. Sarah Johnson",
      admission_date: "2024-01-15",
      status: "Active",
      last_visit: "2024-01-20",
      diagnosis: "Hypertension",
      priority: "Medium"
    },
    {
      id: "2",
      patient_id: "P002",
      patient_name: "Mary Smith",
      age: 32,
      gender: "Female",
      department: "Neurology",
      doctor: "Dr. Michael Chen",
      admission_date: "2024-01-18",
      status: "Under Treatment",
      last_visit: "2024-01-21",
      diagnosis: "Migraine",
      priority: "Low"
    },
    {
      id: "3",
      patient_id: "P003",
      patient_name: "Robert Johnson",
      age: 67,
      gender: "Male",
      department: "Emergency",
      doctor: "Dr. Emily Wilson",
      admission_date: "2024-01-22",
      status: "Critical",
      last_visit: "2024-01-22",
      diagnosis: "Chest Pain",
      priority: "High"
    },
    ...additionalCases
  ];

  const filteredPatients = mockPatients.filter(patient => {
    const matchesSearch = 
      patient.patient_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.patient_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.diagnosis.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filterStatus === "all" || patient.status.toLowerCase() === filterStatus.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });

  const handleViewPatient = (patient) => {
    setSelectedPatient(patient);
    toast({
      title: "Patient Details",
      description: `Viewing details for ${patient.patient_name}`,
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "active": return "default";
      case "under treatment": return "secondary";
      case "critical": return "destructive";
      case "discharged": return "outline";
      default: return "secondary";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case "high": return "destructive";
      case "medium": return "secondary";
      case "low": return "outline";
      default: return "outline";
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header with Add Button - Only show if no additional cases prop */}
      {additionalCases.length === 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold">Patient Records</h3>
            <p className="text-sm text-muted-foreground">
              Manage clinical patient records and medical history
            </p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto">
                <Plus className="mr-2 h-4 w-4" />
                Add Medical Record
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Medical Record</DialogTitle>
                <DialogDescription>
                  Create a new medical record for a patient.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="patientId">Patient ID</Label>
                    <Input
                      id="patientId"
                      value={newRecord.patientId}
                      onChange={(e) => setNewRecord({...newRecord, patientId: e.target.value})}
                      placeholder="P001"
                    />
                  </div>
                  <div>
                    <Label htmlFor="doctor">Doctor</Label>
                    <Select value={newRecord.doctor} onValueChange={(value) => setNewRecord({...newRecord, doctor: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select doctor" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Dr. Sarah Johnson">Dr. Sarah Johnson</SelectItem>
                        <SelectItem value="Dr. Michael Chen">Dr. Michael Chen</SelectItem>
                        <SelectItem value="Dr. Emily Wilson">Dr. Emily Wilson</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="department">Department</Label>
                  <Select value={newRecord.department} onValueChange={(value) => setNewRecord({...newRecord, department: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Cardiology">Cardiology</SelectItem>
                      <SelectItem value="Neurology">Neurology</SelectItem>
                      <SelectItem value="Emergency">Emergency</SelectItem>
                      <SelectItem value="Pediatrics">Pediatrics</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="diagnosis">Diagnosis</Label>
                  <Input
                    id="diagnosis"
                    value={newRecord.diagnosis}
                    onChange={(e) => setNewRecord({...newRecord, diagnosis: e.target.value})}
                    placeholder="Primary diagnosis"
                  />
                </div>
                
                <div>
                  <Label htmlFor="symptoms">Symptoms</Label>
                  <Textarea
                    id="symptoms"
                    value={newRecord.symptoms}
                    onChange={(e) => setNewRecord({...newRecord, symptoms: e.target.value})}
                    placeholder="Patient symptoms..."
                  />
                </div>
                
                <div>
                  <Label htmlFor="treatment">Treatment</Label>
                  <Textarea
                    id="treatment"
                    value={newRecord.treatment}
                    onChange={(e) => setNewRecord({...newRecord, treatment: e.target.value})}
                    placeholder="Treatment plan..."
                  />
                </div>
                
                <div>
                  <Label htmlFor="medication">Medication</Label>
                  <Textarea
                    id="medication"
                    value={newRecord.medication}
                    onChange={(e) => setNewRecord({...newRecord, medication: e.target.value})}
                    placeholder="Prescribed medications..."
                  />
                </div>
                
                <div>
                  <Label htmlFor="notes">Additional Notes</Label>
                  <Textarea
                    id="notes"
                    value={newRecord.notes}
                    onChange={(e) => setNewRecord({...newRecord, notes: e.target.value})}
                    placeholder="Additional clinical notes..."
                  />
                </div>
              </div>
              <Button onClick={handleAddRecord} className="w-full">
                Create Medical Record
              </Button>
            </DialogContent>
          </Dialog>
        </div>
      )}

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search patients, IDs, or diagnosis..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="under treatment">Under Treatment</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="discharged">Discharged</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="w-full sm:w-auto">
              <Filter className="mr-2 h-4 w-4" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Patients Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Clinical Cases</CardTitle>
          <CardDescription>
            {mockPatients.length} patient records found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient ID</TableHead>
                  <TableHead>Patient Name</TableHead>
                  <TableHead className="hidden sm:table-cell">Age/Gender</TableHead>
                  <TableHead className="hidden md:table-cell">Department</TableHead>
                  <TableHead className="hidden lg:table-cell">Doctor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden lg:table-cell">Priority</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockPatients.map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell className="font-medium">{patient.patient_id}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{patient.patient_name}</div>
                        <div className="text-sm text-muted-foreground sm:hidden">
                          {patient.age}y, {patient.gender} • {patient.diagnosis}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {patient.age}y, {patient.gender}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{patient.department}</TableCell>
                    <TableCell className="hidden lg:table-cell">{patient.doctor}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(patient.status)}>
                        {patient.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <Badge variant={getPriorityColor(patient.priority)}>
                        {patient.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewPatient(patient)}
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <FileText className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cases</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockPatients.length}</div>
            <p className="text-xs text-muted-foreground">
              Active clinical cases
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Cases</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockPatients.filter(p => p.status === "Critical").length}
            </div>
            <p className="text-xs text-muted-foreground">
              Require immediate attention
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Visits</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockPatients.filter(p => p.last_visit === "2024-01-22").length}
            </div>
            <p className="text-xs text-muted-foreground">
              Patients seen today
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
