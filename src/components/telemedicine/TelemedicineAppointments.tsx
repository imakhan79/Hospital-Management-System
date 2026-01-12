import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { 
  Calendar, 
  Clock, 
  Video, 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Phone, 
  MessageSquare,
  CalendarDays,
  Filter,
  Search
} from "lucide-react";
import { format } from "date-fns";

interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  patientEmail: string;
  doctorId: string;
  doctorName: string;
  date: Date;
  time: string;
  duration: number;
  type: 'video' | 'audio' | 'chat';
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled' | 'no-show';
  notes?: string;
  priority: 'normal' | 'urgent' | 'emergency';
}

export const TelemedicineAppointments = () => {
  const { toast } = useToast();
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: '1',
      patientId: 'p1',
      patientName: 'John Doe',
      patientEmail: 'john@example.com',
      doctorId: 'd1',
      doctorName: 'Dr. Smith',
      date: new Date(),
      time: '10:00 AM',
      duration: 30,
      type: 'video',
      status: 'scheduled',
      priority: 'normal',
      notes: 'Follow-up consultation for blood pressure'
    },
    {
      id: '2',
      patientId: 'p2',
      patientName: 'Jane Smith',
      patientEmail: 'jane@example.com',
      doctorId: 'd2',
      doctorName: 'Dr. Davis',
      date: new Date(),
      time: '11:30 AM',
      duration: 45,
      type: 'video',
      status: 'in-progress',
      priority: 'urgent',
      notes: 'Chest pain evaluation'
    }
  ]);

  const [isNewAppointmentOpen, setIsNewAppointmentOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date>();

  const [newAppointment, setNewAppointment] = useState({
    patientName: '',
    patientEmail: '',
    doctorName: '',
    date: new Date(),
    time: '',
    duration: 30,
    type: 'video' as const,
    priority: 'normal' as const,
    notes: ''
  });

  const filteredAppointments = appointments.filter(apt => {
    const matchesStatus = filterStatus === 'all' || apt.status === filterStatus;
    const matchesSearch = apt.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         apt.doctorName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = !selectedDate || 
                       format(apt.date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');
    return matchesStatus && matchesSearch && matchesDate;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'no-show': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'emergency': return 'border-l-red-500';
      case 'urgent': return 'border-l-orange-500';
      case 'normal': return 'border-l-blue-500';
      default: return 'border-l-gray-500';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="h-4 w-4" />;
      case 'audio': return <Phone className="h-4 w-4" />;
      case 'chat': return <MessageSquare className="h-4 w-4" />;
      default: return <Video className="h-4 w-4" />;
    }
  };

  const handleCreateAppointment = async () => {
    try {
      const appointment: Appointment = {
        id: Date.now().toString(),
        patientId: `p${Date.now()}`,
        patientName: newAppointment.patientName,
        patientEmail: newAppointment.patientEmail,
        doctorId: `d${Date.now()}`,
        doctorName: newAppointment.doctorName,
        date: newAppointment.date,
        time: newAppointment.time,
        duration: newAppointment.duration,
        type: newAppointment.type,
        status: 'scheduled',
        priority: newAppointment.priority,
        notes: newAppointment.notes
      };

      setAppointments([...appointments, appointment]);
      setIsNewAppointmentOpen(false);
      setNewAppointment({
        patientName: '',
        patientEmail: '',
        doctorName: '',
        date: new Date(),
        time: '',
        duration: 30,
        type: 'video',
        priority: 'normal',
        notes: ''
      });

      toast({
        title: "Appointment Created",
        description: `Appointment scheduled for ${newAppointment.patientName}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create appointment",
        variant: "destructive"
      });
    }
  };

  const handleJoinConsultation = async (appointmentId: string) => {
    try {
      setAppointments(prev => prev.map(apt => 
        apt.id === appointmentId 
          ? { ...apt, status: 'in-progress' as const }
          : apt
      ));

      toast({
        title: "Joining Consultation",
        description: "Starting video consultation...",
      });
    } catch (error) {
      toast({
        title: "Connection Error",
        description: "Failed to join consultation",
        variant: "destructive"
      });
    }
  };

  const handleCancelAppointment = async (appointmentId: string) => {
    try {
      setAppointments(prev => prev.map(apt => 
        apt.id === appointmentId 
          ? { ...apt, status: 'cancelled' as const }
          : apt
      ));

      toast({
        title: "Appointment Cancelled",
        description: "Appointment has been cancelled successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to cancel appointment",
        variant: "destructive"
      });
    }
  };

  const handleReschedule = async (appointmentId: string) => {
    const appointment = appointments.find(apt => apt.id === appointmentId);
    if (appointment) {
      setEditingAppointment(appointment);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
            <Calendar className="h-5 w-5 sm:h-6 sm:w-6" />
            Telemedicine Appointments
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Manage virtual consultations and appointments
          </p>
        </div>
        
        <Dialog open={isNewAppointmentOpen} onOpenChange={setIsNewAppointmentOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Schedule Appointment
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Schedule New Appointment</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="patientName">Patient Name *</Label>
                  <Input
                    id="patientName"
                    value={newAppointment.patientName}
                    onChange={(e) => setNewAppointment({...newAppointment, patientName: e.target.value})}
                    placeholder="Enter patient name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="patientEmail">Patient Email *</Label>
                  <Input
                    id="patientEmail"
                    type="email"
                    value={newAppointment.patientEmail}
                    onChange={(e) => setNewAppointment({...newAppointment, patientEmail: e.target.value})}
                    placeholder="patient@example.com"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="doctorName">Doctor *</Label>
                <Select value={newAppointment.doctorName} onValueChange={(value) => setNewAppointment({...newAppointment, doctorName: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select doctor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Dr. Smith">Dr. Smith - Cardiology</SelectItem>
                    <SelectItem value="Dr. Davis">Dr. Davis - Internal Medicine</SelectItem>
                    <SelectItem value="Dr. Johnson">Dr. Johnson - Dermatology</SelectItem>
                    <SelectItem value="Dr. Wilson">Dr. Wilson - Pediatrics</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start">
                        <CalendarDays className="h-4 w-4 mr-2" />
                        {format(newAppointment.date, 'PPP')}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent
                        mode="single"
                        selected={newAppointment.date}
                        onSelect={(date) => date && setNewAppointment({...newAppointment, date})}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="time">Time *</Label>
                  <Select value={newAppointment.time} onValueChange={(value) => setNewAppointment({...newAppointment, time: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({length: 24}, (_, i) => {
                        const hour = i.toString().padStart(2, '0');
                        return [`${hour}:00`, `${hour}:30`];
                      }).flat().map(time => (
                        <SelectItem key={time} value={time}>{time}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (min)</Label>
                  <Select value={newAppointment.duration.toString()} onValueChange={(value) => setNewAppointment({...newAppointment, duration: parseInt(value)})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="45">45 minutes</SelectItem>
                      <SelectItem value="60">60 minutes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Consultation Type</Label>
                  <Select value={newAppointment.type} onValueChange={(value: any) => setNewAppointment({...newAppointment, type: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="video">Video Call</SelectItem>
                      <SelectItem value="audio">Audio Call</SelectItem>
                      <SelectItem value="chat">Text Chat</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select value={newAppointment.priority} onValueChange={(value: any) => setNewAppointment({...newAppointment, priority: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                      <SelectItem value="emergency">Emergency</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={newAppointment.notes}
                  onChange={(e) => setNewAppointment({...newAppointment, notes: e.target.value})}
                  placeholder="Additional notes or reason for consultation..."
                  rows={3}
                />
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <Button onClick={() => setIsNewAppointmentOpen(false)} variant="outline" className="flex-1">
                Cancel
              </Button>
              <Button 
                onClick={handleCreateAppointment} 
                disabled={!newAppointment.patientName || !newAppointment.doctorName || !newAppointment.time}
                className="flex-1"
              >
                Schedule Appointment
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
                  placeholder="Search patients or doctors..."
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
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full sm:w-auto">
                  <CalendarDays className="h-4 w-4 mr-2" />
                  {selectedDate ? format(selectedDate, 'PPP') : 'Filter by Date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <CalendarComponent
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </CardContent>
      </Card>

      {/* Appointments List */}
      <div className="space-y-4">
        {filteredAppointments.map(appointment => (
          <Card key={appointment.id} className={`border-l-4 ${getPriorityColor(appointment.priority)}`}>
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex-1 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <h3 className="text-lg font-semibold">{appointment.patientName}</h3>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge className={getStatusColor(appointment.status)}>
                        {appointment.status.replace('-', ' ')}
                      </Badge>
                      <Badge variant="outline" className="flex items-center gap-1">
                        {getTypeIcon(appointment.type)}
                        {appointment.type}
                      </Badge>
                      {appointment.priority !== 'normal' && (
                        <Badge variant={appointment.priority === 'emergency' ? 'destructive' : 'secondary'}>
                          {appointment.priority}
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {appointment.doctorName}
                    </span>
                    <span className="flex items-center gap-1">
                      <CalendarDays className="h-3 w-3" />
                      {format(appointment.date, 'MMM dd, yyyy')}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {appointment.time} ({appointment.duration} min)
                    </span>
                    <span className="flex items-center gap-1">
                      📧 {appointment.patientEmail}
                    </span>
                  </div>
                  
                  {appointment.notes && (
                    <p className="text-sm text-muted-foreground bg-muted/30 p-2 rounded">
                      {appointment.notes}
                    </p>
                  )}
                </div>
                
                <div className="flex flex-row lg:flex-col gap-2 lg:min-w-[200px]">
                  {appointment.status === 'scheduled' && (
                    <>
                      <Button 
                        onClick={() => handleJoinConsultation(appointment.id)}
                        className="flex-1 lg:w-full bg-green-600 hover:bg-green-700"
                      >
                        <Video className="h-4 w-4 mr-2" />
                        <span className="hidden sm:inline">Start Consultation</span>
                        <span className="sm:hidden">Start</span>
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => handleReschedule(appointment.id)}
                        className="flex-1 lg:w-full"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        <span className="hidden sm:inline">Reschedule</span>
                        <span className="sm:hidden">Edit</span>
                      </Button>
                    </>
                  )}
                  
                  {appointment.status === 'in-progress' && (
                    <Button 
                      onClick={() => handleJoinConsultation(appointment.id)}
                      className="flex-1 lg:w-full bg-blue-600 hover:bg-blue-700"
                    >
                      <Video className="h-4 w-4 mr-2" />
                      <span className="hidden sm:inline">Join Consultation</span>
                      <span className="sm:hidden">Join</span>
                    </Button>
                  )}
                  
                  {appointment.status === 'completed' && (
                    <Button variant="outline" className="flex-1 lg:w-full">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      <span className="hidden sm:inline">View Summary</span>
                      <span className="sm:hidden">Summary</span>
                    </Button>
                  )}
                  
                  {['scheduled', 'in-progress'].includes(appointment.status) && (
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => handleCancelAppointment(appointment.id)}
                      className="flex-1 lg:w-full"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      <span className="hidden sm:inline">Cancel</span>
                      <span className="sm:hidden">X</span>
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {filteredAppointments.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Calendar className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No appointments found</h3>
              <p className="text-muted-foreground mb-4">
                {appointments.length === 0 
                  ? "No appointments scheduled yet." 
                  : "No appointments match your current filters."}
              </p>
              <Button onClick={() => setIsNewAppointmentOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Schedule First Appointment
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};