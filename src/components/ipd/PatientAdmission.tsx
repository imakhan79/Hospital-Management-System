
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, UserPlus, Bed, Clock, Search, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const PatientAdmission = () => {
  const [activeTab, setActiveTab] = useState("pending");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPriority, setFilterPriority] = useState("all");
  const [isNewAdmissionOpen, setIsNewAdmissionOpen] = useState(false);
  const { toast } = useToast();

  const [pendingAdmissions, setPendingAdmissions] = useState([
    {
      id: "PA-001",
      patient: "John Smith",
      age: 45,
      gender: "Male",
      admissionType: "Emergency",
      department: "Emergency Medicine",
      requestedBy: "Dr. Sarah Johnson",
      requestTime: "10:30 AM",
      bedRequirement: "ICU",
      priority: "high",
      insurance: "Blue Cross"
    },
    {
      id: "PA-002",
      patient: "Emily Davis",
      age: 32,
      gender: "Female", 
      admissionType: "Scheduled",
      department: "Gynecology",
      requestedBy: "Dr. Michael Chen",
      requestTime: "09:15 AM",
      bedRequirement: "General Ward",
      priority: "routine",
      insurance: "Aetna"
    }
  ]);

  const [recentAdmissions, setRecentAdmissions] = useState([
    {
      id: "ADM-001",
      patient: "Mary Wilson",
      age: 67,
      gender: "Female",
      admittedTime: "08:45 AM",
      ward: "ICU",
      bed: "ICU-204",
      admittingDoctor: "Dr. Robert Brown",
      diagnosis: "Cardiac Arrest",
      status: "stable"
    },
    {
      id: "ADM-002", 
      patient: "James Miller",
      age: 28,
      gender: "Male",
      admittedTime: "07:30 AM",
      ward: "General Ward",
      bed: "GW-105",
      admittingDoctor: "Dr. Lisa Garcia",
      diagnosis: "Appendicitis",
      status: "recovering"
    }
  ]);

  const [formData, setFormData] = useState({
    patientName: "",
    age: "",
    gender: "",
    admissionType: "",
    department: "",
    bedRequirement: "",
    priority: "",
    insurance: ""
  });

  const handleAssignBed = (admissionId: string, bedType: string) => {
    const admission = pendingAdmissions.find(a => a.id === admissionId);
    if (admission) {
      const newAdmission = {
        id: `ADM-${String(recentAdmissions.length + 1).padStart(3, '0')}`,
        patient: admission.patient,
        age: admission.age,
        gender: admission.gender,
        admittedTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        ward: bedType,
        bed: `${bedType === 'ICU' ? 'ICU' : 'GW'}-${Math.floor(Math.random() * 300) + 100}`,
        admittingDoctor: admission.requestedBy,
        diagnosis: "Pending evaluation",
        status: "admitted"
      };
      
      setRecentAdmissions([newAdmission, ...recentAdmissions]);
      setPendingAdmissions(pendingAdmissions.filter(a => a.id !== admissionId));
      
      toast({
        title: "Bed Assigned Successfully",
        description: `Patient ${admission.patient} has been assigned to ${newAdmission.bed}`,
      });
    }
  };

  const handleNewAdmission = (e: React.FormEvent) => {
    e.preventDefault();
    const newAdmission = {
      id: `PA-${String(pendingAdmissions.length + 1).padStart(3, '0')}`,
      patient: formData.patientName,
      age: parseInt(formData.age),
      gender: formData.gender,
      admissionType: formData.admissionType,
      department: formData.department,
      requestedBy: "Dr. System Admin",
      requestTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      bedRequirement: formData.bedRequirement,
      priority: formData.priority,
      insurance: formData.insurance
    };

    setPendingAdmissions([newAdmission, ...pendingAdmissions]);
    setFormData({
      patientName: "",
      age: "",
      gender: "",
      admissionType: "",
      department: "",
      bedRequirement: "",
      priority: "",
      insurance: ""
    });
    setIsNewAdmissionOpen(false);
    
    toast({
      title: "Admission Request Created",
      description: `New admission request for ${formData.patientName} has been created`,
    });
  };

  const filteredPendingAdmissions = pendingAdmissions.filter(admission => {
    const matchesSearch = admission.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         admission.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = filterPriority === "all" || admission.priority === filterPriority;
    return matchesSearch && matchesPriority;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "destructive";
      case "medium":
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Patient Admission</h2>
          <p className="text-sm text-muted-foreground">
            Manage patient admissions and bed allocation
          </p>
        </div>
        <Dialog open={isNewAdmissionOpen} onOpenChange={setIsNewAdmissionOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">
              <UserPlus className="mr-2 h-4 w-4" />
              New Admission
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>New Admission Request</DialogTitle>
              <DialogDescription>
                Create a new patient admission request
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleNewAdmission} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="patientName">Patient Name</Label>
                  <Input
                    id="patientName"
                    value={formData.patientName}
                    onChange={(e) => setFormData({...formData, patientName: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({...formData, age: e.target.value})}
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select value={formData.gender} onValueChange={(value) => setFormData({...formData, gender: value})}>
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
                  <Label htmlFor="admissionType">Admission Type</Label>
                  <Select value={formData.admissionType} onValueChange={(value) => setFormData({...formData, admissionType: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Emergency">Emergency</SelectItem>
                      <SelectItem value="Scheduled">Scheduled</SelectItem>
                      <SelectItem value="Walk-in">Walk-in</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Select value={formData.department} onValueChange={(value) => setFormData({...formData, department: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Emergency Medicine">Emergency Medicine</SelectItem>
                      <SelectItem value="Cardiology">Cardiology</SelectItem>
                      <SelectItem value="Gynecology">Gynecology</SelectItem>
                      <SelectItem value="Pediatrics">Pediatrics</SelectItem>
                      <SelectItem value="Surgery">Surgery</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bedRequirement">Bed Requirement</Label>
                  <Select value={formData.bedRequirement} onValueChange={(value) => setFormData({...formData, bedRequirement: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select bed type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ICU">ICU</SelectItem>
                      <SelectItem value="General Ward">General Ward</SelectItem>
                      <SelectItem value="Private Room">Private Room</SelectItem>
                      <SelectItem value="Pediatric Ward">Pediatric Ward</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select value={formData.priority} onValueChange={(value) => setFormData({...formData, priority: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="routine">Routine</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="insurance">Insurance</Label>
                  <Select value={formData.insurance} onValueChange={(value) => setFormData({...formData, insurance: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select insurance" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Blue Cross">Blue Cross</SelectItem>
                      <SelectItem value="Aetna">Aetna</SelectItem>
                      <SelectItem value="Medicare">Medicare</SelectItem>
                      <SelectItem value="Self Pay">Self Pay</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsNewAdmissionOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create Admission</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Admission Overview */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingAdmissions.length}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting bed assignment
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recentAdmissions.length}</div>
            <p className="text-xs text-muted-foreground">
              Admissions today
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available</CardTitle>
            <Bed className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">22</div>
            <p className="text-xs text-muted-foreground">
              Beds available
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Emergency</CardTitle>
            <Plus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {pendingAdmissions.filter(a => a.priority === "high").length}
            </div>
            <p className="text-xs text-muted-foreground">
              Critical cases
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search patients, departments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select value={filterPriority} onValueChange={setFilterPriority}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Filter by priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="high">High Priority</SelectItem>
            <SelectItem value="medium">Medium Priority</SelectItem>
            <SelectItem value="routine">Routine</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Admission Lists */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Pending Admissions ({filteredPendingAdmissions.length})</CardTitle>
            <CardDescription>Patients awaiting bed assignment</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {filteredPendingAdmissions.map((admission) => (
                <div key={admission.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div className="font-medium">{admission.patient}</div>
                    <Badge variant={getPriorityColor(admission.priority)}>
                      {admission.priority} priority
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-muted-foreground">
                    <div>Age: {admission.age} | {admission.gender}</div>
                    <div>Type: {admission.admissionType}</div>
                    <div>Department: {admission.department}</div>
                    <div>Requested: {admission.requestTime}</div>
                    <div>Bed Type: {admission.bedRequirement}</div>
                    <div>Insurance: {admission.insurance}</div>
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    Requested by: {admission.requestedBy}
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-2 pt-2">
                    <Button 
                      size="sm" 
                      onClick={() => handleAssignBed(admission.id, admission.bedRequirement)}
                      className="flex-1 sm:flex-none"
                    >
                      Assign Bed
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1 sm:flex-none">
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Admissions ({recentAdmissions.length})</CardTitle>
            <CardDescription>Patients admitted today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {recentAdmissions.map((admission) => (
                <div key={admission.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div className="font-medium">{admission.patient}</div>
                    <Badge>{admission.status}</Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-muted-foreground">
                    <div>Age: {admission.age} | {admission.gender}</div>
                    <div>Admitted: {admission.admittedTime}</div>
                    <div>Ward: {admission.ward}</div>
                    <div>Bed: {admission.bed}</div>
                    <div>Doctor: {admission.admittingDoctor}</div>
                    <div>Diagnosis: {admission.diagnosis}</div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-2 pt-2">
                    <Button size="sm" variant="outline" className="flex-1 sm:flex-none">
                      View Chart
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1 sm:flex-none">
                      Update Status
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bed Allocation Status */}
      <Card>
        <CardHeader>
          <CardTitle>Real-time Bed Allocation</CardTitle>
          <CardDescription>Current bed availability across all wards</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ward</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Occupied</TableHead>
                  <TableHead>Available</TableHead>
                  <TableHead>Rate</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">ICU</TableCell>
                  <TableCell>20</TableCell>
                  <TableCell>18</TableCell>
                  <TableCell>2</TableCell>
                  <TableCell>
                    <Badge variant="destructive">90%</Badge>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">General Ward</TableCell>
                  <TableCell>50</TableCell>
                  <TableCell>42</TableCell>
                  <TableCell>8</TableCell>
                  <TableCell>
                    <Badge variant="secondary">84%</Badge>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Pediatric Ward</TableCell>
                  <TableCell>30</TableCell>
                  <TableCell>22</TableCell>
                  <TableCell>8</TableCell>
                  <TableCell>
                    <Badge>73%</Badge>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Maternity Ward</TableCell>
                  <TableCell>25</TableCell>
                  <TableCell>15</TableCell>
                  <TableCell>10</TableCell>
                  <TableCell>
                    <Badge>60%</Badge>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
