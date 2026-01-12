import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Phone, 
  PhoneOff, 
  MessageSquare, 
  FileText, 
  Share, 
  Settings,
  Users,
  Clock,
  Loader2,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react";
import { VideoConsultationRoom } from "./VideoConsultationRoom";
import { ConsultationChat } from "./ConsultationChat";
import { FileSharing } from "./FileSharing";

interface Consultation {
  id: string;
  patientName: string;
  patientAvatar?: string;
  doctorName: string;
  appointmentTime: string;
  status: 'waiting' | 'in-progress' | 'completed' | 'cancelled';
  consultationType: 'video' | 'audio' | 'chat';
  duration: number;
  sessionId?: string;
}

export const TelemedicineConsultations = () => {
  const { toast } = useToast();
  const [consultations, setConsultations] = useState<Consultation[]>([
    {
      id: '1',
      patientName: 'Sarah Johnson',
      doctorName: 'Dr. Smith',
      appointmentTime: '10:30 AM',
      status: 'in-progress',
      consultationType: 'video',
      duration: 15,
      sessionId: 'session-1'
    },
    {
      id: '2',
      patientName: 'Michael Brown',
      doctorName: 'Dr. Davis',
      appointmentTime: '11:00 AM',
      status: 'waiting',
      consultationType: 'video',
      duration: 0
    },
    {
      id: '3',
      patientName: 'Emily Wilson',
      doctorName: 'Dr. Johnson',
      appointmentTime: '11:30 AM',
      status: 'completed',
      consultationType: 'video',
      duration: 25
    }
  ]);

  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null);
  const [activeVideoRoom, setActiveVideoRoom] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'error'>('connected');

  // Real-time updates simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setConsultations(prev => prev.map(c => ({
        ...c,
        duration: c.status === 'in-progress' ? c.duration + 1 : c.duration
      })));
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in-progress': return 'bg-green-500 hover:bg-green-600';
      case 'waiting': return 'bg-yellow-500 hover:bg-yellow-600';
      case 'completed': return 'bg-blue-500 hover:bg-blue-600';
      case 'cancelled': return 'bg-red-500 hover:bg-red-600';
      default: return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  const getConsultationTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="h-4 w-4" />;
      case 'audio': return <Phone className="h-4 w-4" />;
      case 'chat': return <MessageSquare className="h-4 w-4" />;
      default: return <Video className="h-4 w-4" />;
    }
  };

  const startConsultation = async (consultation: Consultation) => {
    setIsLoading(true);
    setConnectionStatus('connecting');
    
    try {
      // Simulate connection setup
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setActiveVideoRoom(consultation.id);
      setConsultations(prev => 
        prev.map(c => 
          c.id === consultation.id 
            ? { ...c, status: 'in-progress' as const }
            : c
        )
      );
      setConnectionStatus('connected');
      
      toast({
        title: "Consultation Started",
        description: `Video consultation with ${consultation.patientName} has begun.`,
        variant: "default"
      });
    } catch (error) {
      setConnectionStatus('error');
      toast({
        title: "Connection Failed",
        description: "Unable to start video consultation. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const endConsultation = async (consultationId: string) => {
    setIsLoading(true);
    
    try {
      const consultation = consultations.find(c => c.id === consultationId);
      
      // Simulate saving consultation data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setActiveVideoRoom(null);
      setConsultations(prev => 
        prev.map(c => 
          c.id === consultationId 
            ? { ...c, status: 'completed' as const }
            : c
        )
      );
      
      toast({
        title: "Consultation Ended",
        description: `Consultation with ${consultation?.patientName} has been completed and saved to EMR.`,
        variant: "default"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to end consultation properly. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const activeConsultations = consultations.filter(c => c.status === 'in-progress');
  const waitingConsultations = consultations.filter(c => c.status === 'waiting');
  const completedConsultations = consultations.filter(c => c.status === 'completed');

  return (
    <div className="space-y-6">
      <Tabs defaultValue="active" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="active" className="flex items-center gap-2">
            <Video className="h-4 w-4" />
            Active ({activeConsultations.length})
          </TabsTrigger>
          <TabsTrigger value="waiting" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Waiting ({waitingConsultations.length})
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Completed ({completedConsultations.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          <div className="grid gap-4">
            {activeConsultations.map((consultation) => (
              <Card key={consultation.id} className="border-l-4 border-l-green-500">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarImage src={consultation.patientAvatar} />
                        <AvatarFallback>
                          {consultation.patientName.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">{consultation.patientName}</h3>
                        <p className="text-sm text-muted-foreground">
                          with {consultation.doctorName} • {consultation.appointmentTime}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="flex items-center gap-1">
                            {getConsultationTypeIcon(consultation.consultationType)}
                            {consultation.consultationType}
                          </Badge>
                          <Badge className={`text-white ${getStatusColor(consultation.status)}`}>
                            {consultation.status}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            Duration: {consultation.duration}min
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <MessageSquare className="h-4 w-4 mr-1" />
                            Chat
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Consultation Chat - {consultation.patientName}</DialogTitle>
                          </DialogHeader>
                          <ConsultationChat consultationId={consultation.id} />
                        </DialogContent>
                      </Dialog>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Share className="h-4 w-4 mr-1" />
                            Files
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl">
                          <DialogHeader>
                            <DialogTitle>File Sharing - {consultation.patientName}</DialogTitle>
                          </DialogHeader>
                          <FileSharing consultationId={consultation.id} />
                        </DialogContent>
                      </Dialog>
                      <Button 
                        className="bg-green-500 hover:bg-green-600"
                        onClick={() => startConsultation(consultation)}
                      >
                        <Video className="h-4 w-4 mr-1" />
                        Join
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => endConsultation(consultation.id)}
                      >
                        <PhoneOff className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {activeConsultations.length === 0 && (
              <Card>
                <CardContent className="text-center py-8">
                  <Video className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">No active consultations</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="waiting" className="space-y-4">
          <div className="grid gap-4">
            {waitingConsultations.map((consultation) => (
              <Card key={consultation.id} className="border-l-4 border-l-yellow-500">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarImage src={consultation.patientAvatar} />
                        <AvatarFallback>
                          {consultation.patientName.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">{consultation.patientName}</h3>
                        <p className="text-sm text-muted-foreground">
                          with {consultation.doctorName} • {consultation.appointmentTime}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="flex items-center gap-1">
                            {getConsultationTypeIcon(consultation.consultationType)}
                            {consultation.consultationType}
                          </Badge>
                          <Badge className={`text-white ${getStatusColor(consultation.status)}`}>
                            {consultation.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <Button 
                      className="bg-blue-500 hover:bg-blue-600"
                      onClick={() => startConsultation(consultation)}
                    >
                      <Video className="h-4 w-4 mr-1" />
                      Start Consultation
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            {waitingConsultations.length === 0 && (
              <Card>
                <CardContent className="text-center py-8">
                  <Clock className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">No patients waiting</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          <div className="grid gap-4">
            {completedConsultations.map((consultation) => (
              <Card key={consultation.id} className="border-l-4 border-l-blue-500">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarImage src={consultation.patientAvatar} />
                        <AvatarFallback>
                          {consultation.patientName.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">{consultation.patientName}</h3>
                        <p className="text-sm text-muted-foreground">
                          with {consultation.doctorName} • {consultation.appointmentTime}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="flex items-center gap-1">
                            {getConsultationTypeIcon(consultation.consultationType)}
                            {consultation.consultationType}
                          </Badge>
                          <Badge className={`text-white ${getStatusColor(consultation.status)}`}>
                            {consultation.status}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            Duration: {consultation.duration}min
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <FileText className="h-4 w-4 mr-1" />
                        View Summary
                      </Button>
                      <Button variant="outline" size="sm">
                        <Share className="h-4 w-4 mr-1" />
                        Export
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {completedConsultations.length === 0 && (
              <Card>
                <CardContent className="text-center py-8">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">No completed consultations</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Video Consultation Room Modal */}
      {activeVideoRoom && (
        <Dialog open={!!activeVideoRoom} onOpenChange={() => setActiveVideoRoom(null)}>
          <DialogContent className="max-w-6xl h-[80vh]">
            <DialogHeader>
              <DialogTitle>
                Video Consultation - {consultations.find(c => c.id === activeVideoRoom)?.patientName}
              </DialogTitle>
            </DialogHeader>
            <VideoConsultationRoom 
              consultationId={activeVideoRoom}
              onEndConsultation={() => endConsultation(activeVideoRoom)}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};