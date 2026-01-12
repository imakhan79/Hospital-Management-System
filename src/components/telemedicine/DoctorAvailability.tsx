import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { 
  Calendar, 
  Clock, 
  User, 
  Plus, 
  Edit, 
  Trash2,
  CalendarDays,
  CheckCircle,
  XCircle,
  Settings,
  Users
} from "lucide-react";
import { format, addDays, startOfWeek, endOfWeek, eachDayOfInterval } from "date-fns";

interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  maxPatients: number;
  bookedPatients: number;
}

interface DoctorSchedule {
  id: string;
  doctorId: string;
  doctorName: string;
  specialty: string;
  date: Date;
  dayOfWeek: string;
  timeSlots: TimeSlot[];
  isActive: boolean;
  consultationTypes: ('video' | 'audio' | 'chat')[];
}

export const DoctorAvailability = () => {
  const { toast } = useToast();
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [selectedDoctor, setSelectedDoctor] = useState<string>('all');
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<DoctorSchedule | null>(null);

  const [schedules, setSchedules] = useState<DoctorSchedule[]>([
    {
      id: '1',
      doctorId: 'd1',
      doctorName: 'Dr. Smith',
      specialty: 'Cardiology',
      date: new Date(),
      dayOfWeek: 'Monday',
      timeSlots: [
        { id: 'ts1', startTime: '09:00', endTime: '10:00', isAvailable: true, maxPatients: 4, bookedPatients: 2 },
        { id: 'ts2', startTime: '10:00', endTime: '11:00', isAvailable: true, maxPatients: 4, bookedPatients: 4 },
        { id: 'ts3', startTime: '11:00', endTime: '12:00', isAvailable: true, maxPatients: 4, bookedPatients: 1 },
        { id: 'ts4', startTime: '14:00', endTime: '15:00', isAvailable: true, maxPatients: 4, bookedPatients: 0 },
        { id: 'ts5', startTime: '15:00', endTime: '16:00', isAvailable: false, maxPatients: 4, bookedPatients: 0 }
      ],
      isActive: true,
      consultationTypes: ['video', 'audio']
    },
    {
      id: '2',
      doctorId: 'd2',
      doctorName: 'Dr. Davis',
      specialty: 'Internal Medicine',
      date: new Date(),
      dayOfWeek: 'Monday',
      timeSlots: [
        { id: 'ts6', startTime: '08:00', endTime: '09:00', isAvailable: true, maxPatients: 6, bookedPatients: 3 },
        { id: 'ts7', startTime: '09:00', endTime: '10:00', isAvailable: true, maxPatients: 6, bookedPatients: 5 },
        { id: 'ts8', startTime: '10:00', endTime: '11:00', isAvailable: true, maxPatients: 6, bookedPatients: 2 }
      ],
      isActive: true,
      consultationTypes: ['video', 'chat']
    }
  ]);

  const [newSchedule, setNewSchedule] = useState({
    doctorName: '',
    specialty: '',
    date: new Date(),
    timeSlots: [] as TimeSlot[],
    consultationTypes: ['video'] as ('video' | 'audio' | 'chat')[]
  });

  const doctors = [
    { id: 'd1', name: 'Dr. Smith', specialty: 'Cardiology' },
    { id: 'd2', name: 'Dr. Davis', specialty: 'Internal Medicine' },
    { id: 'd3', name: 'Dr. Johnson', specialty: 'Dermatology' },
    { id: 'd4', name: 'Dr. Wilson', specialty: 'Pediatrics' }
  ];

  const weekDays = eachDayOfInterval({
    start: startOfWeek(currentWeek),
    end: endOfWeek(currentWeek)
  });

  const filteredSchedules = schedules.filter(schedule => 
    selectedDoctor === 'all' || schedule.doctorId === selectedDoctor
  );

  const getAvailabilityColor = (timeSlot: TimeSlot) => {
    if (!timeSlot.isAvailable) return 'bg-gray-100 text-gray-500';
    if (timeSlot.bookedPatients >= timeSlot.maxPatients) return 'bg-red-100 text-red-800';
    if (timeSlot.bookedPatients > timeSlot.maxPatients * 0.7) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  const getAvailabilityStatus = (timeSlot: TimeSlot) => {
    if (!timeSlot.isAvailable) return 'Unavailable';
    if (timeSlot.bookedPatients >= timeSlot.maxPatients) return 'Fully Booked';
    return `${timeSlot.bookedPatients}/${timeSlot.maxPatients} Booked`;
  };

  const addTimeSlot = () => {
    const newTimeSlot: TimeSlot = {
      id: `ts${Date.now()}`,
      startTime: '09:00',
      endTime: '10:00',
      isAvailable: true,
      maxPatients: 4,
      bookedPatients: 0
    };
    setNewSchedule({
      ...newSchedule,
      timeSlots: [...newSchedule.timeSlots, newTimeSlot]
    });
  };

  const removeTimeSlot = (timeSlotId: string) => {
    setNewSchedule({
      ...newSchedule,
      timeSlots: newSchedule.timeSlots.filter(slot => slot.id !== timeSlotId)
    });
  };

  const updateTimeSlot = (timeSlotId: string, updates: Partial<TimeSlot>) => {
    setNewSchedule({
      ...newSchedule,
      timeSlots: newSchedule.timeSlots.map(slot => 
        slot.id === timeSlotId ? { ...slot, ...updates } : slot
      )
    });
  };

  const handleCreateSchedule = async () => {
    try {
      const schedule: DoctorSchedule = {
        id: Date.now().toString(),
        doctorId: `d${Date.now()}`,
        doctorName: newSchedule.doctorName,
        specialty: newSchedule.specialty,
        date: newSchedule.date,
        dayOfWeek: format(newSchedule.date, 'EEEE'),
        timeSlots: newSchedule.timeSlots,
        isActive: true,
        consultationTypes: newSchedule.consultationTypes
      };

      setSchedules([...schedules, schedule]);
      setIsScheduleDialogOpen(false);
      setNewSchedule({
        doctorName: '',
        specialty: '',
        date: new Date(),
        timeSlots: [],
        consultationTypes: ['video']
      });

      toast({
        title: "Schedule Created",
        description: `Schedule created for ${newSchedule.doctorName}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create schedule",
        variant: "destructive"
      });
    }
  };

  const toggleScheduleActive = async (scheduleId: string) => {
    try {
      setSchedules(prev => prev.map(schedule => 
        schedule.id === scheduleId 
          ? { ...schedule, isActive: !schedule.isActive }
          : schedule
      ));

      toast({
        title: "Schedule Updated",
        description: "Schedule availability has been updated",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update schedule",
        variant: "destructive"
      });
    }
  };

  const toggleTimeSlotAvailability = async (scheduleId: string, timeSlotId: string) => {
    try {
      setSchedules(prev => prev.map(schedule => 
        schedule.id === scheduleId 
          ? {
              ...schedule,
              timeSlots: schedule.timeSlots.map(slot =>
                slot.id === timeSlotId ? { ...slot, isAvailable: !slot.isAvailable } : slot
              )
            }
          : schedule
      ));

      toast({
        title: "Time Slot Updated",
        description: "Time slot availability has been updated",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update time slot",
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
            <Calendar className="h-5 w-5 sm:h-6 sm:w-6" />
            Doctor Availability Management
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Manage doctor schedules and availability for telemedicine consultations
          </p>
        </div>
        
        <Dialog open={isScheduleDialogOpen} onOpenChange={setIsScheduleDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Add Schedule
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Doctor Schedule</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="doctorName">Doctor *</Label>
                  <Select value={newSchedule.doctorName} onValueChange={(value) => {
                    const doctor = doctors.find(d => d.name === value);
                    setNewSchedule({
                      ...newSchedule, 
                      doctorName: value,
                      specialty: doctor?.specialty || ''
                    });
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select doctor" />
                    </SelectTrigger>
                    <SelectContent>
                      {doctors.map(doctor => (
                        <SelectItem key={doctor.id} value={doctor.name}>
                          {doctor.name} - {doctor.specialty}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start">
                        <CalendarDays className="h-4 w-4 mr-2" />
                        {format(newSchedule.date, 'PPP')}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent
                        mode="single"
                        selected={newSchedule.date}
                        onSelect={(date) => date && setNewSchedule({...newSchedule, date})}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Consultation Types</Label>
                <div className="flex flex-wrap gap-2">
                  {(['video', 'audio', 'chat'] as const).map(type => (
                    <label key={type} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={newSchedule.consultationTypes.includes(type)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNewSchedule({
                              ...newSchedule,
                              consultationTypes: [...newSchedule.consultationTypes, type]
                            });
                          } else {
                            setNewSchedule({
                              ...newSchedule,
                              consultationTypes: newSchedule.consultationTypes.filter(t => t !== type)
                            });
                          }
                        }}
                        className="rounded"
                      />
                      <span className="text-sm capitalize">{type}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Time Slots</h3>
                  <Button onClick={addTimeSlot} variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Time Slot
                  </Button>
                </div>
                
                <div className="space-y-3">
                  {newSchedule.timeSlots.map((slot, index) => (
                    <Card key={slot.id}>
                      <CardContent className="p-4">
                        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 items-center">
                          <div className="space-y-2">
                            <Label>Start Time</Label>
                            <Input
                              type="time"
                              value={slot.startTime}
                              onChange={(e) => updateTimeSlot(slot.id, { startTime: e.target.value })}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label>End Time</Label>
                            <Input
                              type="time"
                              value={slot.endTime}
                              onChange={(e) => updateTimeSlot(slot.id, { endTime: e.target.value })}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label>Max Patients</Label>
                            <Input
                              type="number"
                              min="1"
                              value={slot.maxPatients}
                              onChange={(e) => updateTimeSlot(slot.id, { maxPatients: parseInt(e.target.value) || 1 })}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label>Available</Label>
                            <div className="flex items-center space-x-2">
                              <Switch
                                checked={slot.isAvailable}
                                onCheckedChange={(checked) => updateTimeSlot(slot.id, { isAvailable: checked })}
                              />
                            </div>
                          </div>
                          
                          <div className="flex justify-end">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => removeTimeSlot(slot.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                  {newSchedule.timeSlots.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Clock className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>No time slots added yet</p>
                      <Button onClick={addTimeSlot} variant="outline" className="mt-2">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Your First Time Slot
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2 mt-6">
              <Button onClick={() => setIsScheduleDialogOpen(false)} variant="outline" className="flex-1">
                Cancel
              </Button>
              <Button 
                onClick={handleCreateSchedule} 
                disabled={!newSchedule.doctorName || newSchedule.timeSlots.length === 0}
                className="flex-1"
              >
                Create Schedule
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1">
              <Label className="text-sm font-medium">Week of {format(currentWeek, 'MMM dd, yyyy')}</Label>
              <div className="flex gap-2 mt-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setCurrentWeek(prev => addDays(prev, -7))}
                >
                  Previous Week
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setCurrentWeek(new Date())}
                >
                  This Week
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setCurrentWeek(prev => addDays(prev, 7))}
                >
                  Next Week
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Filter by Doctor</Label>
              <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
                <SelectTrigger className="w-full sm:w-48">
                  <Users className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Doctors</SelectItem>
                  {doctors.map(doctor => (
                    <SelectItem key={doctor.id} value={doctor.id}>
                      {doctor.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Schedules */}
      <div className="space-y-4">
        {filteredSchedules.map(schedule => (
          <Card key={schedule.id}>
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    {schedule.doctorName}
                  </CardTitle>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <Badge variant="outline">{schedule.specialty}</Badge>
                    <Badge variant="outline">{schedule.dayOfWeek}</Badge>
                    <Badge variant="outline">{format(schedule.date, 'MMM dd, yyyy')}</Badge>
                    <Badge className={schedule.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                      {schedule.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {schedule.consultationTypes.map(type => (
                      <Badge key={type} variant="secondary" className="text-xs">
                        {type}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => toggleScheduleActive(schedule.id)}
                  >
                    {schedule.isActive ? (
                      <>
                        <XCircle className="h-4 w-4 mr-2" />
                        Deactivate
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Activate
                      </>
                    )}
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {schedule.timeSlots.map(timeSlot => (
                  <div
                    key={timeSlot.id}
                    className="p-3 border rounded-lg transition-colors hover:shadow-sm"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">
                        {timeSlot.startTime} - {timeSlot.endTime}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleTimeSlotAvailability(schedule.id, timeSlot.id)}
                        className="h-6 w-6 p-0"
                      >
                        <Settings className="h-3 w-3" />
                      </Button>
                    </div>
                    
                    <Badge className={`${getAvailabilityColor(timeSlot)} text-xs`}>
                      {getAvailabilityStatus(timeSlot)}
                    </Badge>
                    
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full transition-all"
                          style={{ 
                            width: `${timeSlot.maxPatients > 0 ? (timeSlot.bookedPatients / timeSlot.maxPatients) * 100 : 0}%` 
                          }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {timeSlot.bookedPatients}/{timeSlot.maxPatients}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              
              {schedule.timeSlots.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Clock className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No time slots configured</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
        
        {filteredSchedules.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Calendar className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No schedules found</h3>
              <p className="text-muted-foreground mb-4">
                {schedules.length === 0 
                  ? "No doctor schedules created yet." 
                  : "No schedules match your current filters."}
              </p>
              <Button onClick={() => setIsScheduleDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create First Schedule
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};