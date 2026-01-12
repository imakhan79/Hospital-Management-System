
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Users, Clock, FileText, AlertTriangle, Plus, RefreshCw, Search, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const NurseShiftHandover = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPriority, setFilterPriority] = useState("all");
  const [isCreateHandoverOpen, setIsCreateHandoverOpen] = useState(false);
  const { toast } = useToast();

  const [handovers, setHandovers] = useState([
    {
      id: 1,
      type: "Critical Patient Update",
      patient: "John Smith",
      room: "205",
      fromNurse: "Sarah Johnson",
      toNurse: "Michael Brown",
      shift: "Day to Night",
      priority: "critical",
      status: "pending",
      message: "Patient showing signs of respiratory distress. O2 saturation dropped to 88% at 17:30. Dr. Wilson notified. Increased monitoring to every 15 minutes. Consider ICU transfer if condition worsens.",
      time: "30 mins ago",
      acknowledged: false
    },
    {
      id: 2,
      type: "Ward Update",
      patient: "Mary Wilson",
      room: "210",
      fromNurse: "Linda Davis",
      toNurse: "Night Shift Team",
      shift: "Day to Night",
      priority: "standard",
      status: "in_progress",
      message: "New admission - post-op cholecystectomy. Pain managed with prescribed medications. Family visiting hours extended today. Patient requesting vegetarian meal options.",
      time: "1 hour ago",
      acknowledged: false
    },
    {
      id: 3,
      type: "Medication Changes",
      patient: "Multiple Patients",
      room: "Various",
      fromNurse: "Robert Kim",
      toNurse: "Angela White",
      shift: "Day to Night",
      priority: "medication",
      status: "acknowledged",
      message: "Medication schedule updates for 3 patients: Room 301 - increased dosage, Room 104 - new antibiotic started, Room 208 - pain medication discontinued per patient request. All changes documented in MAR.",
      time: "2 hours ago",
      acknowledged: true
    }
  ]);

  const [formData, setFormData] = useState({
    type: "",
    patient: "",
    room: "",
    toNurse: "",
    priority: "standard",
    message: ""
  });

  const handleCreateHandover = (e: React.FormEvent) => {
    e.preventDefault();
    const newHandover = {
      id: handovers.length + 1,
      type: formData.type,
      patient: formData.patient,
      room: formData.room,
      fromNurse: "Current User",
      toNurse: formData.toNurse,
      shift: "Current Shift",
      priority: formData.priority,
      status: "pending",
      message: formData.message,
      time: "Just now",
      acknowledged: false
    };

    setHandovers([newHandover, ...handovers]);
    setFormData({
      type: "",
      patient: "",
      room: "",
      toNurse: "",
      priority: "standard",
      message: ""
    });
    setIsCreateHandoverOpen(false);

    toast({
      title: "Handover Created",
      description: `New handover for ${formData.patient} has been created`,
    });
  };

  const handleAcknowledge = (handoverId: number) => {
    setHandovers(handovers.map(handover => 
      handover.id === handoverId 
        ? { ...handover, status: "acknowledged", acknowledged: true }
        : handover
    ));

    toast({
      title: "Handover Acknowledged",
      description: "Handover has been acknowledged successfully",
    });
  };

  const filteredHandovers = handovers.filter(handover => {
    const matchesSearch = handover.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         handover.room.includes(searchTerm) ||
                         handover.fromNurse.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         handover.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = filterPriority === "all" || handover.priority === filterPriority;
    return matchesSearch && matchesPriority;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "destructive";
      case "medication":
        return "secondary";
      case "standard":
        return "outline";
      default:
        return "outline";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "secondary";
      case "in_progress":
        return "outline";
      case "acknowledged":
        return "outline";
      default:
        return "outline";
    }
  };

  const getHandoverBgColor = (priority: string, acknowledged: boolean) => {
    if (acknowledged) return "bg-green-50";
    switch (priority) {
      case "critical":
        return "bg-red-50";
      case "medication":
        return "bg-blue-50";
      default:
        return "";
    }
  };

  const stats = {
    currentShift: "Day Shift",
    onDuty: 17,
    pending: handovers.filter(h => h.status === "pending").length,
    critical: handovers.filter(h => h.priority === "critical").length
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Nurse Shift Handover</h2>
          <p className="text-sm text-muted-foreground">
            Shift communication and patient care continuity
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" className="w-full sm:w-auto">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Dialog open={isCreateHandoverOpen} onOpenChange={setIsCreateHandoverOpen}>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto">
                <Plus className="mr-2 h-4 w-4" />
                Create Handover
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>Create Shift Handover</DialogTitle>
                <DialogDescription>
                  Create a handover note for the next shift
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateHandover} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Handover Type</Label>
                    <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Critical Patient Update">Critical Patient Update</SelectItem>
                        <SelectItem value="Ward Update">Ward Update</SelectItem>
                        <SelectItem value="Medication Changes">Medication Changes</SelectItem>
                        <SelectItem value="General Information">General Information</SelectItem>
                        <SelectItem value="Equipment Issues">Equipment Issues</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select value={formData.priority} onValueChange={(value) => setFormData({...formData, priority: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="critical">Critical</SelectItem>
                        <SelectItem value="medication">Medication</SelectItem>
                        <SelectItem value="standard">Standard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="patient">Patient Name</Label>
                    <Input
                      id="patient"
                      value={formData.patient}
                      onChange={(e) => setFormData({...formData, patient: e.target.value})}
                      placeholder="John Smith or Multiple Patients"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="room">Room Number</Label>
                    <Input
                      id="room"
                      value={formData.room}
                      onChange={(e) => setFormData({...formData, room: e.target.value})}
                      placeholder="205 or Various"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="toNurse">Handover To</Label>
                  <Select value={formData.toNurse} onValueChange={(value) => setFormData({...formData, toNurse: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select recipient" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Night Shift Team">Night Shift Team</SelectItem>
                      <SelectItem value="Day Shift Team">Day Shift Team</SelectItem>
                      <SelectItem value="Michael Brown">Michael Brown</SelectItem>
                      <SelectItem value="Angela White">Angela White</SelectItem>
                      <SelectItem value="Lisa Garcia">Lisa Garcia</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Handover Message</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    placeholder="Detailed handover information..."
                    rows={4}
                    required
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsCreateHandoverOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Create Handover</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Shift Status */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Shift</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.currentShift}</div>
            <p className="text-xs text-muted-foreground">
              06:00 - 18:00
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">On Duty</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.onDuty}</div>
            <p className="text-xs text-muted-foreground">
              Nurses currently working
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting acknowledgment
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Notes</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.critical}</div>
            <p className="text-xs text-muted-foreground">
              Require immediate attention
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search handovers, patients, nurses..."
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
            <SelectItem value="critical">Critical</SelectItem>
            <SelectItem value="medication">Medication</SelectItem>
            <SelectItem value="standard">Standard</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Active Handovers */}
      <Card>
        <CardHeader>
          <CardTitle>Active Shift Handovers ({filteredHandovers.length})</CardTitle>
          <CardDescription>Current shift transition communications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {filteredHandovers.map((handover) => (
              <div key={handover.id} className={`p-4 border rounded-lg ${getHandoverBgColor(handover.priority, handover.acknowledged)}`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="mt-1">
                      {handover.priority === "critical" && <AlertTriangle className="h-5 w-5 text-red-500" />}
                      {handover.priority === "medication" && <FileText className="h-5 w-5 text-blue-500" />}
                      {handover.priority === "standard" && <Users className="h-5 w-5 text-green-500" />}
                    </div>
                    <div className="space-y-2 flex-1">
                      <div>
                        <h4 className="font-medium">{handover.type} - {handover.patient}</h4>
                        <p className="text-sm text-muted-foreground">
                          From: {handover.fromNurse} • To: {handover.toNurse} • Room: {handover.room}
                        </p>
                      </div>
                      <p className="text-sm leading-relaxed">
                        {handover.message}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-3">
                        <Badge variant={getPriorityColor(handover.priority)}>
                          {handover.priority}
                        </Badge>
                        <Badge variant={getStatusColor(handover.status)}>
                          {handover.status.replace('_', ' ')}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{handover.time}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 ml-4">
                    {!handover.acknowledged && (
                      <Button 
                        size="sm" 
                        onClick={() => handleAcknowledge(handover.id)}
                        className="whitespace-nowrap"
                      >
                        Acknowledge
                      </Button>
                    )}
                    <Button size="sm" variant="outline" className="whitespace-nowrap">
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Shift Summary */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Shift Summary</CardTitle>
            <CardDescription>Key metrics for current shift</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">Total Patients</span>
                <span className="text-sm font-medium">45</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">New Admissions</span>
                <span className="text-sm font-medium">3</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Discharges</span>
                <span className="text-sm font-medium">2</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Medications Administered</span>
                <span className="text-sm font-medium">127</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Incident Reports</span>
                <span className="text-sm font-medium">0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Handovers Created</span>
                <span className="text-sm font-medium">{handovers.length}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Tasks</CardTitle>
            <CardDescription>Priority items for next shift</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                <span className="text-sm">Monitor Room 205 - Respiratory distress</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-yellow-500" />
                <span className="text-sm">Medication round at 21:00</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-blue-500" />
                <span className="text-sm">Discharge planning - Room 104</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-green-500" />
                <span className="text-sm">Family conference - Room 301</span>
              </div>
              <div className="flex items-center gap-2">
                <Plus className="h-4 w-4 text-purple-500" />
                <span className="text-sm">New admission expected - Room 150</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
