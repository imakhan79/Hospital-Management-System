
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Pill, Clock, AlertTriangle, CheckCircle, Plus, Calendar, Search, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const MedicationAdministration = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isAddMedicationOpen, setIsAddMedicationOpen] = useState(false);
  const { toast } = useToast();

  const [medications, setMedications] = useState([
    {
      id: 1,
      patient: "John Smith",
      room: "205",
      patientId: "P001",
      medication: "Metformin 500mg",
      dosage: "500mg",
      frequency: "Twice daily",
      route: "Oral",
      dueTime: "30 mins ago",
      status: "overdue",
      instructions: "Take with food. Monitor blood sugar levels.",
      prescribedBy: "Dr. Sarah Wilson",
      startDate: "2024-01-15",
      endDate: "2024-01-22"
    },
    {
      id: 2,
      patient: "Mary Johnson",
      room: "301",
      patientId: "P002",
      medication: "Lisinopril 10mg",
      dosage: "10mg",
      frequency: "Once daily",
      route: "Oral",
      dueTime: "Now",
      status: "due",
      instructions: "Blood pressure medication. Check BP before administration.",
      prescribedBy: "Dr. Michael Chen",
      startDate: "2024-01-16",
      endDate: "2024-01-30"
    },
    {
      id: 3,
      patient: "Robert Davis",
      room: "102",
      patientId: "P003",
      medication: "Amoxicillin 500mg",
      dosage: "500mg",
      frequency: "Three times daily",
      route: "Oral",
      dueTime: "15 mins",
      status: "upcoming",
      instructions: "Antibiotic course. Day 3 of 7. Take with plenty of water.",
      prescribedBy: "Dr. Emily Wilson",
      startDate: "2024-01-14",
      endDate: "2024-01-21"
    },
    {
      id: 4,
      patient: "Lisa Wilson",
      room: "208",
      patientId: "P004",
      medication: "Aspirin 75mg",
      dosage: "75mg",
      frequency: "Once daily",
      route: "Oral",
      dueTime: "10:30 AM",
      status: "completed",
      instructions: "Blood thinner. Monitor for bleeding.",
      prescribedBy: "Dr. Robert Brown",
      startDate: "2024-01-10",
      endDate: "2024-01-24"
    }
  ]);

  const [formData, setFormData] = useState({
    patientId: "",
    patientName: "",
    room: "",
    medication: "",
    dosage: "",
    frequency: "",
    route: "Oral",
    instructions: "",
    startDate: "",
    endDate: ""
  });

  const handleAddMedication = (e: React.FormEvent) => {
    e.preventDefault();
    const newMedication = {
      id: medications.length + 1,
      patient: formData.patientName,
      room: formData.room,
      patientId: formData.patientId,
      medication: formData.medication,
      dosage: formData.dosage,
      frequency: formData.frequency,
      route: formData.route,
      dueTime: "In 1 hour",
      status: "upcoming",
      instructions: formData.instructions,
      prescribedBy: "Dr. Current User",
      startDate: formData.startDate,
      endDate: formData.endDate
    };

    setMedications([newMedication, ...medications]);
    setFormData({
      patientId: "",
      patientName: "",
      room: "",
      medication: "",
      dosage: "",
      frequency: "",
      route: "Oral",
      instructions: "",
      startDate: "",
      endDate: ""
    });
    setIsAddMedicationOpen(false);

    toast({
      title: "Medication Added",
      description: `${formData.medication} scheduled for ${formData.patientName}`,
    });
  };

  const handleMedicationAdministered = (medicationId: number) => {
    setMedications(medications.map(med => 
      med.id === medicationId 
        ? { 
            ...med, 
            status: "completed",
            dueTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        : med
    ));

    const medication = medications.find(m => m.id === medicationId);
    toast({
      title: "Medication Administered",
      description: `${medication?.medication} given to ${medication?.patient}`,
    });
  };

  const filteredMedications = medications.filter(med => {
    const matchesSearch = med.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         med.medication.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         med.room.includes(searchTerm);
    const matchesFilter = filterStatus === "all" || med.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "overdue":
        return "destructive";
      case "due":
        return "secondary";
      case "upcoming":
        return "outline";
      case "completed":
        return "outline";
      default:
        return "outline";
    }
  };

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case "overdue":
        return "bg-red-50";
      case "due":
        return "bg-yellow-50";
      case "upcoming":
        return "bg-blue-50";
      case "completed":
        return "bg-green-50";
      default:
        return "";
    }
  };

  const stats = {
    due: medications.filter(m => m.status === "due").length,
    overdue: medications.filter(m => m.status === "overdue").length,
    completed: medications.filter(m => m.status === "completed").length,
    total: medications.filter(m => m.status !== "completed").length
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Medication Administration</h2>
          <p className="text-sm text-muted-foreground">
            Medication tracking and administration records
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" className="w-full sm:w-auto">
            <Calendar className="mr-2 h-4 w-4" />
            Schedule
          </Button>
          <Dialog open={isAddMedicationOpen} onOpenChange={setIsAddMedicationOpen}>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto">
                <Plus className="mr-2 h-4 w-4" />
                Add Medication
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>Add Medication</DialogTitle>
                <DialogDescription>
                  Schedule a new medication for a patient
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddMedication} className="space-y-4">
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
                    <Label htmlFor="medication">Medication</Label>
                    <Input
                      id="medication"
                      value={formData.medication}
                      onChange={(e) => setFormData({...formData, medication: e.target.value})}
                      placeholder="e.g., Metformin 500mg"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dosage">Dosage</Label>
                    <Input
                      id="dosage"
                      value={formData.dosage}
                      onChange={(e) => setFormData({...formData, dosage: e.target.value})}
                      placeholder="e.g., 500mg"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="frequency">Frequency</Label>
                    <Select value={formData.frequency} onValueChange={(value) => setFormData({...formData, frequency: value})}>
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
                    <Label htmlFor="route">Route</Label>
                    <Select value={formData.route} onValueChange={(value) => setFormData({...formData, route: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select route" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Oral">Oral</SelectItem>
                        <SelectItem value="IV">Intravenous</SelectItem>
                        <SelectItem value="IM">Intramuscular</SelectItem>
                        <SelectItem value="Topical">Topical</SelectItem>
                        <SelectItem value="Inhaled">Inhaled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="instructions">Instructions</Label>
                  <Input
                    id="instructions"
                    value={formData.instructions}
                    onChange={(e) => setFormData({...formData, instructions: e.target.value})}
                    placeholder="Special instructions or notes"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsAddMedicationOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Add Medication</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Medication Stats */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Due Now</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.due}</div>
            <p className="text-xs text-muted-foreground">
              Medications to administer
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.overdue}</div>
            <p className="text-xs text-muted-foreground">
              Require immediate attention
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Today</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completed}</div>
            <p className="text-xs text-muted-foreground">
              Medications administered
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Patients</CardTitle>
            <Pill className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              On medication regimen
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search patients, medications..."
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
            <SelectItem value="overdue">Overdue</SelectItem>
            <SelectItem value="due">Due Now</SelectItem>
            <SelectItem value="upcoming">Upcoming</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Current Medication Schedule */}
      <Card>
        <CardHeader>
          <CardTitle>Medication Schedule ({filteredMedications.length})</CardTitle>
          <CardDescription>Current medication administration status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {filteredMedications.map((medication) => (
              <div key={medication.id} className={`flex items-center gap-4 p-4 border rounded-lg ${getStatusBgColor(medication.status)}`}>
                {medication.status === "overdue" && <AlertTriangle className="h-5 w-5 text-red-500" />}
                {medication.status === "due" && <Clock className="h-5 w-5 text-yellow-500" />}
                {medication.status === "upcoming" && <Pill className="h-5 w-5 text-blue-500" />}
                {medication.status === "completed" && <CheckCircle className="h-5 w-5 text-green-500" />}
                
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                      <h4 className="font-medium">{medication.patient} - Room {medication.room}</h4>
                      <p className="text-sm text-muted-foreground">
                        {medication.medication} - Due: {medication.dueTime}
                      </p>
                    </div>
                    <Badge variant={getStatusColor(medication.status)}>
                      {medication.status}
                    </Badge>
                  </div>
                  <p className="text-sm mt-1">{medication.instructions}</p>
                  <div className="text-xs text-muted-foreground mt-1">
                    {medication.dosage} • {medication.frequency} • {medication.route} • Prescribed by {medication.prescribedBy}
                  </div>
                </div>
                
                <div className="flex flex-col gap-2">
                  {medication.status !== "completed" && (
                    <Button 
                      size="sm" 
                      variant={medication.status === "overdue" ? "destructive" : "default"}
                      onClick={() => handleMedicationAdministered(medication.id)}
                      className="whitespace-nowrap"
                    >
                      {medication.status === "overdue" ? "Administer Now" : "Administer"}
                    </Button>
                  )}
                  <Button size="sm" variant="outline" className="whitespace-nowrap">
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
