
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Timer,
  Users,
  Play,
  Pause,
  SkipForward,
  RefreshCw,
  Search,
  Filter,
  Clock,
  UserCheck,
  AlertCircle,
  CheckCircle,
  PhoneCall,
  Video
} from "lucide-react";
import { fetchOPDAppointments, fetchOPDQueues, updateAppointmentStatus, OPDAppointment, OPDQueue } from "@/services/opdService";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

export const QueueManagement = () => {
  const [appointments, setAppointments] = useState<OPDAppointment[]>([]);
  const [queues, setQueues] = useState<OPDQueue[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    loadQueueData();

    // Auto-refresh every 30 seconds if enabled
    let interval: NodeJS.Timeout;
    if (autoRefresh) {
      interval = setInterval(loadQueueData, 30000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh]);

  const loadQueueData = async () => {
    setLoading(true);
    try {
      const [appointmentsData, queuesData] = await Promise.all([
        fetchOPDAppointments(),
        fetchOPDQueues()
      ]);
      setAppointments(appointmentsData);
      setQueues(queuesData);
    } catch (error) {
      console.error('Error loading queue data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (appointmentId: string, newStatus: OPDAppointment['status']) => {
    try {
      await updateAppointmentStatus(appointmentId, newStatus);
      toast.success(`Appointment ${newStatus}`);
      loadQueueData(); // Refresh data
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update appointment status');
    }
  };

  const getTodayAppointments = () => {
    const today = new Date().toISOString().split('T')[0];
    return appointments.filter(appointment => {
      const matchesDate = appointment.appointmentDate === today;
      const matchesDepartment = selectedDepartment === 'all' || appointment.department === selectedDepartment;
      const matchesSearch = searchQuery === '' ||
        appointment.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        appointment.appointmentNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        appointment.doctor.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesDate && matchesDepartment && matchesSearch;
    });
  };

  const getQueuedAppointments = () => {
    return getTodayAppointments().filter(a => ['scheduled', 'checked-in'].includes(a.status));
  };

  const getInProgressAppointments = () => {
    return getTodayAppointments().filter(a => a.status === 'in-progress');
  };

  const getCompletedAppointments = () => {
    return getTodayAppointments().filter(a => a.status === 'completed');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'checked-in':
        return <UserCheck className="h-4 w-4 text-yellow-500" />;
      case 'in-progress':
        return <Play className="h-4 w-4 text-green-500" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-gray-500" />;
      case 'cancelled':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'checked-in':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'in-progress':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'completed':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const uniqueDepartments = [...new Set(appointments.map(a => a.department))];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading queue data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Queue Management</h2>
          <p className="text-muted-foreground">Real-time patient queue monitoring and control</p>
        </div>

        <div className="flex gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            <Input
              placeholder="Search patients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64"
            />
          </div>

          <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All Departments" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {uniqueDepartments.map((dept) => (
                <SelectItem key={dept} value={dept}>{dept}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={autoRefresh ? 'bg-green-50 border-green-200' : ''}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${autoRefresh ? 'animate-spin' : ''}`} />
            Auto Refresh
          </Button>

          <Button size="sm" onClick={loadQueueData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Queue Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Queue</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getQueuedAppointments().length}</div>
            <p className="text-xs text-muted-foreground">Waiting patients</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Play className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getInProgressAppointments().length}</div>
            <p className="text-xs text-muted-foreground">Currently being seen</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getCompletedAppointments().length}</div>
            <p className="text-xs text-muted-foreground">Finished today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Wait Time</CardTitle>
            <Timer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(queues.reduce((acc, q) => acc + q.estimatedWaitTime, 0) / queues.length) || 0}m
            </div>
            <p className="text-xs text-muted-foreground">Estimated wait</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Queue List */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Current Queue
              </CardTitle>
              <CardDescription>
                Patients waiting for consultation ({getQueuedAppointments().length} in queue)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {getQueuedAppointments().map((appointment, index) => (
                  <div
                    key={appointment.id}
                    className={`p-4 border rounded-lg ${getStatusColor(appointment.status)}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-start gap-3">
                        <div className="flex flex-col items-center">
                          <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                            {index + 1}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            Queue #
                          </div>
                        </div>

                        <div className="space-y-1">
                          <div className="font-medium">{appointment.patientName}</div>
                          <div className="text-sm text-muted-foreground">
                            {appointment.appointmentNumber} • {appointment.appointmentTime}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {appointment.doctor} • {appointment.department}
                          </div>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(appointment.status)}
                            <Badge variant="outline" className="text-xs">
                              {appointment.status}
                            </Badge>
                            {appointment.consultationType === 'video' && (
                              <Badge variant="secondary" className="text-xs">
                                <Video className="h-3 w-3 mr-1" />
                                Video
                              </Badge>
                            )}
                            <Badge variant="outline" className="text-xs">
                              {appointment.appointmentType}
                            </Badge>
                          </div>
                          {appointment.symptoms && (
                            <div className="text-xs text-muted-foreground bg-white/50 p-2 rounded">
                              <strong>Symptoms:</strong> {appointment.symptoms}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        {appointment.status === 'scheduled' && (
                          <Button
                            size="sm"
                            onClick={() => handleStatusUpdate(appointment.id, 'checked-in')}
                            className="whitespace-nowrap"
                          >
                            <UserCheck className="h-4 w-4 mr-1" />
                            Check In
                          </Button>
                        )}

                        {appointment.status === 'checked-in' && (
                          <Button
                            size="sm"
                            onClick={() => handleStatusUpdate(appointment.id, 'in-progress')}
                            className="whitespace-nowrap"
                          >
                            <Play className="h-4 w-4 mr-1" />
                            Start
                          </Button>
                        )}

                        {appointment.consultationType === 'video' && (
                          <Button size="sm" variant="outline">
                            <Video className="h-4 w-4 mr-1" />
                            Join Call
                          </Button>
                        )}

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStatusUpdate(appointment.id, 'cancelled')}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}

                {getQueuedAppointments().length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No patients in queue</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* In Progress */}
          {getInProgressAppointments().length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Play className="h-5 w-5 text-green-600" />
                  Currently in Consultation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {getInProgressAppointments().map((appointment) => (
                    <div key={appointment.id} className="p-4 border rounded-lg bg-green-50 border-green-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-start gap-3">
                          <Play className="h-5 w-5 text-green-600 mt-1" />
                          <div className="space-y-1">
                            <div className="font-medium">{appointment.patientName}</div>
                            <div className="text-sm text-muted-foreground">
                              {appointment.doctor} • {appointment.department}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Started at {appointment.appointmentTime}
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          {appointment.consultationType === 'video' && (
                            <Button size="sm" variant="outline">
                              <Video className="h-4 w-4 mr-1" />
                              Join
                            </Button>
                          )}
                          <Button
                            size="sm"
                            onClick={() => handleStatusUpdate(appointment.id, 'completed')}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Complete
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Department Status */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Timer className="h-5 w-5" />
                Department Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {queues.map((queue) => {
                const deptAppointments = getTodayAppointments().filter(a => a.department === queue.department);
                const queuedCount = deptAppointments.filter(a => ['scheduled', 'checked-in'].includes(a.status)).length;
                const completedCount = deptAppointments.filter(a => a.status === 'completed').length;
                const totalCount = deptAppointments.length;
                const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

                return (
                  <div key={queue.id} className="p-3 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-medium">{queue.department}</div>
                        <div className="text-sm text-muted-foreground">{queue.doctor}</div>
                      </div>
                      <Badge variant={queue.status === 'active' ? 'default' : 'secondary'}>
                        {queue.status}
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Queue: {queuedCount}</span>
                        <span>Done: {completedCount}</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                      <div className="text-xs text-muted-foreground">
                        Avg. {queue.averageConsultationTime}min per patient
                      </div>
                      {queue.currentPatient && (
                        <div className="text-xs text-green-600">
                          Current: {queue.currentPatient}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full" size="sm">
                <UserCheck className="h-4 w-4 mr-2" />
                Bulk Check-in
              </Button>
              <Button className="w-full" size="sm" variant="outline">
                <SkipForward className="h-4 w-4 mr-2" />
                Skip Patient
              </Button>
              <Button className="w-full" size="sm" variant="outline">
                <Pause className="h-4 w-4 mr-2" />
                Pause Queue
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
