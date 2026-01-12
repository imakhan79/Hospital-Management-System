import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { 
  Users, 
  Clock, 
  Video, 
  Phone, 
  MessageSquare,
  AlertCircle,
  CheckCircle,
  Timer,
  Bell,
  User,
  Calendar
} from "lucide-react";

interface WaitingPatient {
  id: string;
  name: string;
  appointmentTime: string;
  estimatedWait: number;
  queuePosition: number;
  status: 'waiting' | 'ready' | 'called' | 'in-consultation';
  consultationType: 'video' | 'audio' | 'chat';
  priority: 'normal' | 'urgent' | 'emergency';
  avatar?: string;
  doctor: string;
  checkedInAt: Date;
}

export const VirtualWaitingRoom = () => {
  const { toast } = useToast();
  const [waitingPatients, setWaitingPatients] = useState<WaitingPatient[]>([
    {
      id: '1',
      name: 'Sarah Johnson',
      appointmentTime: '10:30 AM',
      estimatedWait: 5,
      queuePosition: 1,
      status: 'ready',
      consultationType: 'video',
      priority: 'normal',
      doctor: 'Dr. Smith',
      checkedInAt: new Date(Date.now() - 300000)
    },
    {
      id: '2',
      name: 'Michael Brown',
      appointmentTime: '10:45 AM',
      estimatedWait: 12,
      queuePosition: 2,
      status: 'waiting',
      consultationType: 'video',
      priority: 'urgent',
      doctor: 'Dr. Davis',
      checkedInAt: new Date(Date.now() - 180000)
    },
    {
      id: '3',
      name: 'Emily Wilson',
      appointmentTime: '11:00 AM',
      estimatedWait: 18,
      queuePosition: 3,
      status: 'waiting',
      consultationType: 'audio',
      priority: 'normal',
      doctor: 'Dr. Johnson',
      checkedInAt: new Date(Date.now() - 120000)
    },
    {
      id: '4',
      name: 'Robert Davis',
      appointmentTime: '11:15 AM',
      estimatedWait: 25,
      queuePosition: 4,
      status: 'waiting',
      consultationType: 'video',
      priority: 'normal',
      doctor: 'Dr. Smith',
      checkedInAt: new Date(Date.now() - 60000)
    }
  ]);

  const [currentTime, setCurrentTime] = useState(new Date());
  const [isAutoRefresh, setIsAutoRefresh] = useState(true);

  // Real-time updates
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      
      if (isAutoRefresh) {
        // Update estimated wait times
        setWaitingPatients(prev => prev.map(patient => ({
          ...patient,
          estimatedWait: Math.max(0, patient.estimatedWait - 1)
        })));
      }
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, [isAutoRefresh]);

  const callPatient = async (patientId: string) => {
    const patient = waitingPatients.find(p => p.id === patientId);
    if (!patient) return;

    try {
      setWaitingPatients(prev => prev.map(p => 
        p.id === patientId 
          ? { ...p, status: 'called' as const }
          : p
      ));

      toast({
        title: "Patient Called",
        description: `${patient.name} has been notified to join the consultation.`,
        variant: "default"
      });

      // Simulate patient response after 3 seconds
      setTimeout(() => {
        setWaitingPatients(prev => prev.map(p => 
          p.id === patientId 
            ? { ...p, status: 'in-consultation' as const }
            : p
        ));
      }, 3000);

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to call patient. Please try again.",
        variant: "destructive"
      });
    }
  };

  const moveToTop = (patientId: string) => {
    setWaitingPatients(prev => {
      const updated = [...prev];
      const patientIndex = updated.findIndex(p => p.id === patientId);
      if (patientIndex > 0) {
        const patient = updated.splice(patientIndex, 1)[0];
        updated.unshift({ ...patient, queuePosition: 1, priority: 'urgent' });
        
        // Update positions for others
        updated.forEach((p, index) => {
          p.queuePosition = index + 1;
        });
      }
      return updated;
    });

    toast({
      title: "Queue Updated",
      description: "Patient moved to front of queue.",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return 'bg-green-500 hover:bg-green-600';
      case 'waiting': return 'bg-blue-500 hover:bg-blue-600';
      case 'called': return 'bg-yellow-500 hover:bg-yellow-600';
      case 'in-consultation': return 'bg-purple-500 hover:bg-purple-600';
      default: return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'emergency': return 'bg-red-100 text-red-800 border-red-200';
      case 'urgent': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'normal': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getConsultationIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="h-4 w-4" />;
      case 'audio': return <Phone className="h-4 w-4" />;
      case 'chat': return <MessageSquare className="h-4 w-4" />;
      default: return <Video className="h-4 w-4" />;
    }
  };

  const formatWaitTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}min`;
  };

  const readyPatients = waitingPatients.filter(p => p.status === 'ready');
  const waitingCount = waitingPatients.filter(p => p.status === 'waiting').length;
  const inConsultationCount = waitingPatients.filter(p => p.status === 'in-consultation').length;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header Stats - Responsive */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6">
        <Card className="text-center">
          <CardContent className="p-3 sm:p-6">
            <div className="text-xl sm:text-2xl font-bold text-green-600">{readyPatients.length}</div>
            <p className="text-xs sm:text-sm text-muted-foreground">Ready</p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-3 sm:p-6">
            <div className="text-xl sm:text-2xl font-bold text-blue-600">{waitingCount}</div>
            <p className="text-xs sm:text-sm text-muted-foreground">Waiting</p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-3 sm:p-6">
            <div className="text-xl sm:text-2xl font-bold text-purple-600">{inConsultationCount}</div>
            <p className="text-xs sm:text-sm text-muted-foreground">In Session</p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-3 sm:p-6">
            <div className="text-xl sm:text-2xl font-bold text-orange-600">
              {Math.round(waitingPatients.reduce((sum, p) => sum + p.estimatedWait, 0) / waitingPatients.length) || 0}
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground">Avg Wait (min)</p>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div className="flex items-center gap-2">
          <Button
            variant={isAutoRefresh ? "default" : "outline"}
            onClick={() => setIsAutoRefresh(!isAutoRefresh)}
            className="flex items-center gap-2"
          >
            <Timer className="h-4 w-4" />
            Auto Refresh {isAutoRefresh ? 'On' : 'Off'}
          </Button>
          <span className="text-sm text-muted-foreground">
            Last updated: {currentTime.toLocaleTimeString()}
          </span>
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Bell className="h-4 w-4" />
          Notify All
        </Button>
      </div>

      {/* Queue List - Responsive */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Users className="h-5 w-5" />
            Virtual Waiting Room ({waitingPatients.length} patients)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 sm:space-y-4">
          {waitingPatients.map((patient, index) => (
            <div 
              key={patient.id} 
              className={`border rounded-lg p-3 sm:p-4 transition-all duration-200 ${
                patient.status === 'ready' ? 'border-green-200 bg-green-50' :
                patient.status === 'called' ? 'border-yellow-200 bg-yellow-50' :
                patient.status === 'in-consultation' ? 'border-purple-200 bg-purple-50' :
                'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center space-x-3 sm:space-x-4">
                  {/* Queue Position */}
                  <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-sm sm:text-base">
                    {patient.queuePosition}
                  </div>
                  
                  {/* Patient Avatar */}
                  <Avatar className="h-10 w-10 sm:h-12 sm:w-12">
                    <AvatarImage src={patient.avatar} />
                    <AvatarFallback>
                      {patient.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  {/* Patient Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                      <h3 className="font-semibold text-sm sm:text-base truncate">{patient.name}</h3>
                      <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                        <Badge variant="outline" className={`text-xs ${getPriorityColor(patient.priority)}`}>
                          {patient.priority}
                        </Badge>
                        <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                          {getConsultationIcon(patient.consultationType)}
                          {patient.consultationType}
                        </Badge>
                        <Badge className={`text-white text-xs ${getStatusColor(patient.status)}`}>
                          {patient.status.replace('-', ' ')}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="mt-1 text-xs sm:text-sm text-muted-foreground">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {patient.appointmentTime} • Dr. {patient.doctor}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Est. wait: {formatWaitTime(patient.estimatedWait)}
                        </span>
                      </div>
                    </div>
                    
                    {/* Wait Progress Bar */}
                    <div className="mt-2">
                      <Progress 
                        value={Math.max(0, 100 - (patient.estimatedWait / 30 * 100))} 
                        className="h-1 sm:h-2"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Action Buttons - Responsive */}
                <div className="flex flex-row sm:flex-col lg:flex-row gap-2 sm:gap-3">
                  {patient.status === 'ready' && (
                    <Button 
                      className="bg-green-500 hover:bg-green-600 flex-1 sm:flex-none"
                      onClick={() => callPatient(patient.id)}
                    >
                      <Video className="h-4 w-4 sm:mr-2" />
                      <span className="hidden sm:inline">Call Patient</span>
                    </Button>
                  )}
                  
                  {patient.status === 'waiting' && (
                    <>
                      <Button 
                        variant="outline" 
                        onClick={() => callPatient(patient.id)}
                        className="flex-1 sm:flex-none"
                      >
                        <Phone className="h-4 w-4 sm:mr-2" />
                        <span className="hidden sm:inline">Call Now</span>
                      </Button>
                      <Button 
                        variant="secondary" 
                        onClick={() => moveToTop(patient.id)}
                        className="flex-1 sm:flex-none"
                      >
                        <AlertCircle className="h-4 w-4 sm:mr-2" />
                        <span className="hidden sm:inline">Priority</span>
                      </Button>
                    </>
                  )}
                  
                  {patient.status === 'called' && (
                    <Button variant="outline" disabled className="flex-1 sm:flex-none">
                      <Timer className="h-4 w-4 sm:mr-2 animate-pulse" />
                      <span className="hidden sm:inline">Connecting...</span>
                    </Button>
                  )}
                  
                  {patient.status === 'in-consultation' && (
                    <Button variant="outline" disabled className="flex-1 sm:flex-none">
                      <CheckCircle className="h-4 w-4 sm:mr-2 text-green-500" />
                      <span className="hidden sm:inline">In Session</span>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {waitingPatients.length === 0 && (
            <div className="text-center py-8 sm:py-12">
              <Users className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-base sm:text-lg font-semibold mb-2">No patients in queue</h3>
              <p className="text-sm text-muted-foreground">
                All patients have been served or no appointments scheduled.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};