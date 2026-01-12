
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { UserCheck, FileText, Calendar, Clock, Plus, Download, Search, Filter, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const PatientDischarge = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isPlanDischargeOpen, setIsPlanDischargeOpen] = useState(false);
  const { toast } = useToast();

  const [plannedDischarges, setPlannedDischarges] = useState([
    {
      id: 1,
      patient: "John Smith",
      room: "205",
      patientId: "P001",
      condition: "Appendectomy recovery",
      admissionDuration: "3 days",
      doctor: "Dr. Sarah Wilson",
      plannedTime: "Today 2:00 PM",
      status: "ready",
      notes: "All post-op checks completed. Patient stable and ready for home care."
    },
    {
      id: 2,
      patient: "Mary Johnson",
      room: "301",
      patientId: "P002",
      condition: "Cardiac monitoring",
      admissionDuration: "5 days",
      doctor: "Dr. Michael Chen",
      plannedTime: "Tomorrow 10:00 AM",
      status: "pending",
      notes: "Awaiting final cardiology clearance. Home monitoring equipment arranged."
    },
    {
      id: 3,
      patient: "Robert Davis",
      room: "102",
      patientId: "P003",
      condition: "Pneumonia treatment",
      admissionDuration: "7 days",
      doctor: "Dr. Emily Wilson",
      plannedTime: "In 2-3 days",
      status: "planning",
      notes: "Responding well to treatment. Discharge planning meeting scheduled for tomorrow."
    }
  ]);

  const [recentDischarges, setRecentDischarges] = useState([
    {
      id: 1,
      patient: "Lisa Wilson",
      patientId: "P004",
      condition: "Gallbladder surgery",
      duration: "2 days",
      dischargedTime: "11:30 AM",
      doctor: "Dr. Robert Brown",
      status: "completed"
    },
    {
      id: 2,
      patient: "David Brown",
      patientId: "P005",
      condition: "Knee replacement",
      duration: "6 days",
      dischargedTime: "9:15 AM",
      doctor: "Dr. Lisa Garcia",
      status: "completed"
    },
    {
      id: 3,
      patient: "Sarah Miller",
      patientId: "P006",
      condition: "Maternity care",
      duration: "3 days",
      dischargedTime: "Yesterday 3:45 PM",
      doctor: "Dr. Emily Wilson",
      status: "completed"
    }
  ]);

  const [formData, setFormData] = useState({
    patientId: "",
    patientName: "",
    room: "",
    condition: "",
    admissionDuration: "",
    doctor: "",
    plannedTime: "",
    notes: ""
  });

  const handlePlanDischarge = (e: React.FormEvent) => {
    e.preventDefault();
    const newDischarge = {
      id: plannedDischarges.length + 1,
      patient: formData.patientName,
      room: formData.room,
      patientId: formData.patientId,
      condition: formData.condition,
      admissionDuration: formData.admissionDuration,
      doctor: formData.doctor,
      plannedTime: formData.plannedTime,
      status: "planning",
      notes: formData.notes
    };

    setPlannedDischarges([newDischarge, ...plannedDischarges]);
    setFormData({
      patientId: "",
      patientName: "",
      room: "",
      condition: "",
      admissionDuration: "",
      doctor: "",
      plannedTime: "",
      notes: ""
    });
    setIsPlanDischargeOpen(false);

    toast({
      title: "Discharge Plan Created",
      description: `Discharge planned for ${formData.patientName}`,
    });
  };

  const handleProcessDischarge = (dischargeId: number) => {
    const discharge = plannedDischarges.find(d => d.id === dischargeId);
    if (discharge) {
      const newRecentDischarge = {
        id: recentDischarges.length + 1,
        patient: discharge.patient,
        patientId: discharge.patientId,
        condition: discharge.condition,
        duration: discharge.admissionDuration,
        dischargedTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        doctor: discharge.doctor,
        status: "completed"
      };
      
      setRecentDischarges([newRecentDischarge, ...recentDischarges]);
      setPlannedDischarges(plannedDischarges.filter(d => d.id !== dischargeId));
      
      toast({
        title: "Patient Discharged",
        description: `${discharge.patient} has been successfully discharged`,
      });
    }
  };

  const filteredPlannedDischarges = plannedDischarges.filter(discharge => {
    const matchesSearch = discharge.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         discharge.room.includes(searchTerm) ||
                         discharge.patientId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || discharge.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ready":
        return "default";
      case "pending":
        return "secondary";
      default:
        return "outline";
    }
  };

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case "ready":
        return "bg-green-50";
      case "pending":
        return "bg-yellow-50";
      default:
        return "";
    }
  };

  const stats = {
    todayDischarges: recentDischarges.length,
    plannedDischarges: plannedDischarges.length,
    pendingApprovals: plannedDischarges.filter(d => d.status === "pending").length,
    avgLOS: 4.2
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Patient Discharge</h2>
          <p className="text-sm text-muted-foreground">
            Discharge planning and patient exit process management
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" className="w-full sm:w-auto">
            <Download className="mr-2 h-4 w-4" />
            Export Reports
          </Button>
          <Dialog open={isPlanDischargeOpen} onOpenChange={setIsPlanDischargeOpen}>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto">
                <Plus className="mr-2 h-4 w-4" />
                Plan Discharge
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>Plan Patient Discharge</DialogTitle>
                <DialogDescription>
                  Create a discharge plan for a patient
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handlePlanDischarge} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="patientId">Patient ID</Label>
                    <Input
                      id="patientId"
                      value={formData.patientId}
                      onChange={(e) => setFormData({...formData, patientId: e.target.value})}
                      placeholder="P001"
                      required
                    />
                  </div>
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
                    <Label htmlFor="room">Room</Label>
                    <Input
                      id="room"
                      value={formData.room}
                      onChange={(e) => setFormData({...formData, room: e.target.value})}
                      placeholder="205"
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="condition">Condition/Treatment</Label>
                    <Input
                      id="condition"
                      value={formData.condition}
                      onChange={(e) => setFormData({...formData, condition: e.target.value})}
                      placeholder="e.g., Post-op recovery"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="admissionDuration">Admission Duration</Label>
                    <Input
                      id="admissionDuration"
                      value={formData.admissionDuration}
                      onChange={(e) => setFormData({...formData, admissionDuration: e.target.value})}
                      placeholder="e.g., 5 days"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="doctor">Attending Physician</Label>
                    <Input
                      id="doctor"
                      value={formData.doctor}
                      onChange={(e) => setFormData({...formData, doctor: e.target.value})}
                      placeholder="Dr. Name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="plannedTime">Planned Discharge</Label>
                    <Input
                      id="plannedTime"
                      value={formData.plannedTime}
                      onChange={(e) => setFormData({...formData, plannedTime: e.target.value})}
                      placeholder="e.g., Tomorrow 10:00 AM"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    placeholder="Discharge notes and instructions"
                    rows={3}
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsPlanDischargeOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Create Plan</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Discharge Statistics */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Discharges</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.todayDischarges}</div>
            <p className="text-xs text-muted-foreground">
              Patients discharged
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Planned Discharges</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.plannedDischarges}</div>
            <p className="text-xs text-muted-foreground">
              Upcoming discharges
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingApprovals}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting doctor approval
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Length of Stay</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgLOS}</div>
            <p className="text-xs text-muted-foreground">
              Days (this month)
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search patients, rooms..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="ready">Ready for Discharge</SelectItem>
            <SelectItem value="pending">Pending Approval</SelectItem>
            <SelectItem value="planning">Planning</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Planned Discharges */}
      <Card>
        <CardHeader>
          <CardTitle>Planned Discharges ({filteredPlannedDischarges.length})</CardTitle>
          <CardDescription>Patients scheduled for discharge</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {filteredPlannedDischarges.map((discharge) => (
              <div key={discharge.id} className={`flex items-center gap-4 p-4 border rounded-lg ${getStatusBgColor(discharge.status)}`}>
                <div className="hidden sm:block">
                  {discharge.status === "ready" && <UserCheck className="h-5 w-5 text-green-500" />}
                  {discharge.status === "pending" && <Calendar className="h-5 w-5 text-yellow-500" />}
                  {discharge.status === "planning" && <Clock className="h-5 w-5 text-blue-500" />}
                </div>
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                      <h4 className="font-medium">{discharge.patient} - Room {discharge.room}</h4>
                      <p className="text-sm text-muted-foreground">
                        {discharge.condition} • Admitted: {discharge.admissionDuration} ago
                      </p>
                    </div>
                    <Badge variant={getStatusColor(discharge.status)}>
                      {discharge.status === "ready" ? "Ready for Discharge" : 
                       discharge.status === "pending" ? "Pending Approval" : 
                       "Planning in Progress"}
                    </Badge>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2 text-sm">
                    <span>{discharge.doctor}</span>
                    <span className="hidden sm:inline">•</span>
                    <span>Discharge planned: {discharge.plannedTime}</span>
                  </div>
                  <p className="text-sm mt-1">
                    {discharge.notes}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2 mt-3">
                    {discharge.status === "ready" && (
                      <Button 
                        size="sm"
                        onClick={() => handleProcessDischarge(discharge.id)}
                        className="flex-1 sm:flex-none"
                      >
                        Process Discharge
                      </Button>
                    )}
                    <Button size="sm" variant="outline" className="flex-1 sm:flex-none">
                      View Summary
                    </Button>
                    {discharge.status === "pending" && (
                      <Button size="sm" variant="outline" className="flex-1 sm:flex-none">
                        Contact Doctor
                      </Button>
                    )}
                    {discharge.status === "planning" && (
                      <Button size="sm" variant="outline" className="flex-1 sm:flex-none">
                        Update Plan
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Discharges */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Discharges</CardTitle>
          <CardDescription>Patients discharged in the last 24 hours</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-72 overflow-y-auto">
            {recentDischarges.map((discharge) => (
              <div key={discharge.id} className="flex items-center justify-between p-3 border rounded hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <div>
                    <div className="font-medium">{discharge.patient}</div>
                    <div className="text-sm text-muted-foreground">
                      {discharge.condition} • Length of stay: {discharge.duration}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">Discharged: {discharge.dischargedTime}</div>
                  <div className="flex justify-end">
                    <Badge variant="outline" className="mt-1">Completed</Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Discharge Checklist */}
      <Card>
        <CardHeader>
          <CardTitle>Discharge Checklist Template</CardTitle>
          <CardDescription>Standard items to verify before patient discharge</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2 p-4 border rounded-lg">
              <h4 className="font-medium">Medical Clearance</h4>
              <div className="space-y-1 text-sm">
                <div className="flex items-center">
                  <input type="checkbox" id="doctor-exam" className="mr-2" />
                  <label htmlFor="doctor-exam">Final doctor examination</label>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" id="specialist" className="mr-2" />
                  <label htmlFor="specialist">Specialist clearance (if required)</label>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" id="lab-results" className="mr-2" />
                  <label htmlFor="lab-results">Lab results reviewed</label>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" id="medication-review" className="mr-2" />
                  <label htmlFor="medication-review">Medication reconciliation</label>
                </div>
              </div>
            </div>
            
            <div className="space-y-2 p-4 border rounded-lg">
              <h4 className="font-medium">Administrative</h4>
              <div className="space-y-1 text-sm">
                <div className="flex items-center">
                  <input type="checkbox" id="discharge-summary" className="mr-2" />
                  <label htmlFor="discharge-summary">Discharge summary completed</label>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" id="insurance" className="mr-2" />
                  <label htmlFor="insurance">Insurance/billing cleared</label>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" id="appointments" className="mr-2" />
                  <label htmlFor="appointments">Follow-up appointments scheduled</label>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" id="transportation" className="mr-2" />
                  <label htmlFor="transportation">Transportation arranged</label>
                </div>
              </div>
            </div>
            
            <div className="space-y-2 p-4 border rounded-lg">
              <h4 className="font-medium">Patient Education</h4>
              <div className="space-y-1 text-sm">
                <div className="flex items-center">
                  <input type="checkbox" id="home-care" className="mr-2" />
                  <label htmlFor="home-care">Home care instructions provided</label>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" id="medication-instructions" className="mr-2" />
                  <label htmlFor="medication-instructions">Medication instructions given</label>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" id="warning-signs" className="mr-2" />
                  <label htmlFor="warning-signs">Warning signs explained</label>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" id="emergency-contact" className="mr-2" />
                  <label htmlFor="emergency-contact">Emergency contact information</label>
                </div>
              </div>
            </div>
            
            <div className="space-y-2 p-4 border rounded-lg">
              <h4 className="font-medium">Final Steps</h4>
              <div className="space-y-1 text-sm">
                <div className="flex items-center">
                  <input type="checkbox" id="patient-acknowledgment" className="mr-2" />
                  <label htmlFor="patient-acknowledgment">Patient/family acknowledgment</label>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" id="belongings" className="mr-2" />
                  <label htmlFor="belongings">Belongings returned</label>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" id="room-cleaning" className="mr-2" />
                  <label htmlFor="room-cleaning">Room prepared for cleaning</label>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" id="bed-available" className="mr-2" />
                  <label htmlFor="bed-available">Bed available for new admission</label>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <Button>
              Download Checklist Template
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
