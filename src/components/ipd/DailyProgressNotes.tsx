
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FileText, Plus, User, Clock, Filter, Search, Edit, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const DailyProgressNotes = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isAddNoteOpen, setIsAddNoteOpen] = useState(false);
  const { toast } = useToast();

  const [progressNotes, setProgressNotes] = useState([
    {
      id: 1,
      patient: "John Smith",
      room: "205",
      patientId: "P001",
      note: "Patient showing good response to treatment. Vital signs stable. Continue current medication regimen. Monitor for any adverse reactions.",
      author: "Dr. Sarah Wilson",
      authorType: "Doctor",
      time: "2 hours ago",
      status: "pending",
      priority: "normal",
      department: "Cardiology"
    },
    {
      id: 2,
      patient: "Mary Johnson",
      room: "301",
      patientId: "P002",
      note: "Patient ambulated without assistance. Pain level reported as 3/10. Appetite improving. Family visited during afternoon hours.",
      author: "Nurse Linda Brown",
      authorType: "Nurse",
      time: "4 hours ago",
      status: "completed",
      priority: "normal",
      department: "General Medicine"
    },
    {
      id: 3,
      patient: "Robert Davis",
      room: "102",
      patientId: "P003",
      note: "Patient experiencing elevated temperature (101.5°F). Blood pressure slightly elevated. Increased monitoring frequency. Consider antibiotic adjustment.",
      author: "Dr. Michael Chen",
      authorType: "Doctor",
      time: "6 hours ago",
      status: "critical",
      priority: "high",
      department: "Internal Medicine"
    }
  ]);

  const [formData, setFormData] = useState({
    patientId: "",
    patientName: "",
    room: "",
    note: "",
    priority: "normal",
    department: ""
  });

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    const newNote = {
      id: progressNotes.length + 1,
      patient: formData.patientName,
      room: formData.room,
      patientId: formData.patientId,
      note: formData.note,
      author: "Dr. Current User",
      authorType: "Doctor",
      time: "Just now",
      status: "pending",
      priority: formData.priority,
      department: formData.department
    };

    setProgressNotes([newNote, ...progressNotes]);
    setFormData({
      patientId: "",
      patientName: "",
      room: "",
      note: "",
      priority: "normal",
      department: ""
    });
    setIsAddNoteOpen(false);

    toast({
      title: "Progress Note Added",
      description: `New progress note for ${formData.patientName} has been created`,
    });
  };

  const handleStatusChange = (noteId: number, newStatus: string) => {
    setProgressNotes(progressNotes.map(note => 
      note.id === noteId 
        ? { ...note, status: newStatus }
        : note
    ));

    toast({
      title: "Note Status Updated",
      description: `Progress note has been marked as ${newStatus}`,
    });
  };

  const filteredNotes = progressNotes.filter(note => {
    const matchesSearch = note.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.room.includes(searchTerm) ||
                         note.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || note.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "critical":
        return "destructive";
      case "pending":
        return "secondary";
      case "completed":
        return "outline";
      default:
        return "outline";
    }
  };

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

  const getAuthorIcon = (authorType: string) => {
    return authorType === "Doctor" ? "👨‍⚕️" : "👩‍⚕️";
  };

  const stats = {
    total: progressNotes.length,
    pending: progressNotes.filter(n => n.status === "pending").length,
    critical: progressNotes.filter(n => n.status === "critical").length,
    completed: progressNotes.filter(n => n.status === "completed").length
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Daily Progress Notes</h2>
          <p className="text-sm text-muted-foreground">
            Patient progress documentation and care notes
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" className="w-full sm:w-auto">
            <Filter className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Dialog open={isAddNoteOpen} onOpenChange={setIsAddNoteOpen}>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto">
                <Plus className="mr-2 h-4 w-4" />
                Add Note
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>Add Progress Note</DialogTitle>
                <DialogDescription>
                  Document patient progress and care observations
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddNote} className="space-y-4">
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
                    <Label htmlFor="priority">Priority</Label>
                    <Select value={formData.priority} onValueChange={(value) => setFormData({...formData, priority: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Select value={formData.department} onValueChange={(value) => setFormData({...formData, department: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Cardiology">Cardiology</SelectItem>
                        <SelectItem value="General Medicine">General Medicine</SelectItem>
                        <SelectItem value="Internal Medicine">Internal Medicine</SelectItem>
                        <SelectItem value="Surgery">Surgery</SelectItem>
                        <SelectItem value="Pediatrics">Pediatrics</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="note">Progress Note</Label>
                  <Textarea
                    id="note"
                    value={formData.note}
                    onChange={(e) => setFormData({...formData, note: e.target.value})}
                    placeholder="Enter detailed progress note..."
                    rows={4}
                    required
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsAddNoteOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Add Note</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Notes</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              Progress notes recorded
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting doctor review
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Notes</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.critical}</div>
            <p className="text-xs text-muted-foreground">
              Require immediate attention
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completed}</div>
            <p className="text-xs text-muted-foreground">
              Reviewed and signed
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search notes, patients, authors..."
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
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Progress Notes List */}
      <Card>
        <CardHeader>
          <CardTitle>Progress Notes ({filteredNotes.length})</CardTitle>
          <CardDescription>Patient care documentation and observations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {filteredNotes.map((note) => (
              <div key={note.id} className="flex items-start gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-lg">
                  {getAuthorIcon(note.authorType)}
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                      <h4 className="font-medium">
                        {note.patient} (Room {note.room})
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {note.author} • {note.time} • {note.department}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant={getStatusColor(note.status)}>
                        {note.status}
                      </Badge>
                      {note.priority !== "normal" && (
                        <Badge variant={getPriorityColor(note.priority)}>
                          {note.priority}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed">
                    {note.note}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2 pt-2">
                    {note.status === "pending" && (
                      <>
                        <Button 
                          size="sm" 
                          onClick={() => handleStatusChange(note.id, "completed")}
                          className="flex-1 sm:flex-none"
                        >
                          Approve
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => handleStatusChange(note.id, "critical")}
                          className="flex-1 sm:flex-none"
                        >
                          Mark Critical
                        </Button>
                      </>
                    )}
                    <Button size="sm" variant="outline" className="flex-1 sm:flex-none">
                      <Eye className="mr-1 h-3 w-3" />
                      View Full
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1 sm:flex-none">
                      <Edit className="mr-1 h-3 w-3" />
                      Edit
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
