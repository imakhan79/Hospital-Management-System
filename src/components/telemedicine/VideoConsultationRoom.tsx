import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Phone, 
  PhoneOff, 
  Settings, 
  Monitor, 
  MessageSquare,
  FileText,
  Users,
  Loader2,
  Wifi,
  WifiOff,
  Volume2,
  VolumeX,
  Clock
} from "lucide-react";

interface VideoConsultationRoomProps {
  consultationId: string;
  onEndConsultation: () => void;
}

export const VideoConsultationRoom = ({ consultationId, onEndConsultation }: VideoConsultationRoomProps) => {
  const { toast } = useToast();
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connected');
  const [connectionQuality, setConnectionQuality] = useState<'excellent' | 'good' | 'poor'>('excellent');
  const [consultationTime, setConsultationTime] = useState(0);
  const [patientConnected, setPatientConnected] = useState(true);
  const [audioLevel, setAudioLevel] = useState(0);
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setConsultationTime(prev => prev + 1);
      // Simulate audio level changes
      setAudioLevel(Math.random() * 100);
    }, 1000);

    // Simulate connection quality changes
    const qualityTimer = setInterval(() => {
      const qualities: ('excellent' | 'good' | 'poor')[] = ['excellent', 'good', 'poor'];
      setConnectionQuality(qualities[Math.floor(Math.random() * 3)]);
    }, 10000);

    return () => {
      clearInterval(timer);
      clearInterval(qualityTimer);
    };
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleVideo = async () => {
    try {
      setIsVideoEnabled(!isVideoEnabled);
      toast({
        title: isVideoEnabled ? "Camera Disabled" : "Camera Enabled",
        description: isVideoEnabled ? "Your camera has been turned off" : "Your camera has been turned on",
      });
    } catch (error) {
      toast({
        title: "Camera Error",
        description: "Failed to toggle camera. Please check permissions.",
        variant: "destructive"
      });
    }
  };

  const toggleAudio = async () => {
    try {
      setIsAudioEnabled(!isAudioEnabled);
      toast({
        title: isAudioEnabled ? "Microphone Muted" : "Microphone Unmuted",
        description: isAudioEnabled ? "Your microphone has been muted" : "Your microphone is now active",
      });
    } catch (error) {
      toast({
        title: "Microphone Error",
        description: "Failed to toggle microphone. Please check permissions.",
        variant: "destructive"
      });
    }
  };

  const toggleScreenShare = async () => {
    try {
      setIsScreenSharing(!isScreenSharing);
      toast({
        title: isScreenSharing ? "Screen Sharing Stopped" : "Screen Sharing Started",
        description: isScreenSharing ? "You are no longer sharing your screen" : "You are now sharing your screen",
      });
    } catch (error) {
      toast({
        title: "Screen Share Error",
        description: "Failed to toggle screen sharing. Please try again.",
        variant: "destructive"
      });
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    toast({
      title: isRecording ? "Recording Stopped" : "Recording Started",
      description: isRecording 
        ? "Session recording has been stopped and saved securely" 
        : "Session recording has started with patient consent",
    });
  };

  const getConnectionIcon = () => {
    switch (connectionQuality) {
      case 'excellent': return <Wifi className="h-4 w-4 text-green-500" />;
      case 'good': return <Wifi className="h-4 w-4 text-yellow-500" />;
      case 'poor': return <WifiOff className="h-4 w-4 text-red-500" />;
    }
  };

  const handleEndConsultation = () => {
    if (isRecording) {
      toggleRecording();
    }
    onEndConsultation();
  };

  return (
    <div className="h-full flex flex-col space-y-2 sm:space-y-4">
      {/* Header - Responsive */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
        <div className="flex flex-wrap items-center gap-2 sm:gap-4">
          <Badge variant={connectionStatus === 'connected' ? 'default' : 'destructive'} className="flex items-center gap-1">
            {getConnectionIcon()}
            {connectionStatus === 'connected' ? 'Connected' : 'Connecting...'}
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {formatTime(consultationTime)}
          </Badge>
          <Badge variant={patientConnected ? 'default' : 'secondary'}>
            {patientConnected ? 'Patient Online' : 'Patient Offline'}
          </Badge>
          {isRecording && (
            <Badge variant="destructive" className="animate-pulse">
              Recording
            </Badge>
          )}
        </div>
        <Button variant="destructive" onClick={handleEndConsultation} className="w-full sm:w-auto">
          <PhoneOff className="h-4 w-4 mr-2" />
          End Consultation
        </Button>
      </div>

      {/* Video Area - Responsive Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-2 sm:gap-4 min-h-0">
        {/* Main Video */}
        <div className="lg:col-span-2 min-h-[300px] sm:min-h-[400px] lg:min-h-0">
          <Card className="h-full">
            <CardContent className="p-0 h-full">
              <div className="relative aspect-video bg-gray-900 rounded-lg flex items-center justify-center h-full overflow-hidden">
                {isVideoEnabled ? (
                  <div className="text-white text-center animate-fade-in">
                    <Video className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-4" />
                    <p className="text-base sm:text-lg font-medium">Patient Video Feed</p>
                    <p className="text-xs sm:text-sm opacity-75">HD Quality • {connectionQuality}</p>
                    {isScreenSharing && (
                      <Badge className="mt-2 bg-blue-500">Screen Sharing Active</Badge>
                    )}
                  </div>
                ) : (
                  <div className="text-white text-center animate-fade-in">
                    <VideoOff className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-4" />
                    <p className="text-base sm:text-lg font-medium">Video is disabled</p>
                    <p className="text-xs sm:text-sm opacity-75">Click to enable camera</p>
                  </div>
                )}
                
                {/* Picture-in-Picture for Doctor - Responsive */}
                <div className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 w-32 h-24 sm:w-48 sm:h-36 bg-gray-800 rounded-lg border-2 border-white shadow-lg">
                  <div className="h-full flex items-center justify-center text-white">
                    <div className="text-center">
                      <Users className="h-4 w-4 sm:h-8 sm:w-8 mx-auto mb-1 sm:mb-2" />
                      <p className="text-xs sm:text-sm">Doctor View</p>
                    </div>
                  </div>
                </div>

                {/* Audio Level Indicator */}
                {isAudioEnabled && (
                  <div className="absolute top-2 left-2 sm:top-4 sm:left-4">
                    <div className="flex items-center gap-1 bg-black/50 rounded-full px-2 py-1">
                      <Volume2 className="h-3 w-3 text-white" />
                      <Progress value={audioLevel} className="w-8 sm:w-12 h-1" />
                    </div>
                  </div>
                )}

                {/* Connection Quality Indicator */}
                <div className="absolute top-2 right-2 sm:top-4 sm:right-4">
                  <div className="bg-black/50 rounded-full p-1 sm:p-2">
                    {getConnectionIcon()}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Side Panel - Responsive */}
        <div className="space-y-2 sm:space-y-4 lg:max-h-full lg:overflow-y-auto">
          {/* Quick Stats */}
          <Card className="lg:hidden">
            <CardContent className="p-3">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-xs text-muted-foreground">Duration</p>
                  <p className="font-semibold text-sm">{formatTime(consultationTime)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Quality</p>
                  <p className="font-semibold text-sm capitalize">{connectionQuality}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Status</p>
                  <p className="font-semibold text-sm">{patientConnected ? 'Online' : 'Offline'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Chat Panel */}
          <Card>
            <CardContent className="p-3 sm:p-4">
              <h3 className="font-semibold mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base">
                <MessageSquare className="h-4 w-4" />
                Live Chat
              </h3>
              <div className="space-y-2 h-32 sm:h-40 overflow-y-auto scrollbar-thin">
                <div className="text-sm animate-fade-in">
                  <span className="font-medium text-blue-600">Doctor:</span>
                  <p className="text-muted-foreground text-xs sm:text-sm">How are you feeling today?</p>
                </div>
                <div className="text-sm animate-fade-in">
                  <span className="font-medium text-green-600">Patient:</span>
                  <p className="text-muted-foreground text-xs sm:text-sm">I've been experiencing some chest pain since yesterday.</p>
                </div>
                <div className="text-sm animate-fade-in">
                  <span className="font-medium text-blue-600">Doctor:</span>
                  <p className="text-muted-foreground text-xs sm:text-sm">Can you describe the pain in more detail?</p>
                </div>
              </div>
              <div className="mt-2 pt-2 border-t">
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Type a message..." 
                    className="flex-1 px-2 py-1 text-xs sm:text-sm border rounded focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <Button size="sm" className="px-2 sm:px-4">Send</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Patient Info */}
          <Card>
            <CardContent className="p-3 sm:p-4">
              <h3 className="font-semibold mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base">
                <FileText className="h-4 w-4" />
                Patient Details
              </h3>
              <div className="space-y-2 text-xs sm:text-sm">
                <div className="flex justify-between">
                  <span className="font-medium">Name:</span>
                  <span className="text-muted-foreground">Sarah Johnson</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Age:</span>
                  <span className="text-muted-foreground">34 years</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Type:</span>
                  <span className="text-muted-foreground">Follow-up</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Last Visit:</span>
                  <span className="text-muted-foreground">2 weeks ago</span>
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full mt-3 text-xs">
                View Full EMR
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Controls - Responsive */}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 p-3 sm:p-4 bg-muted/50 rounded-lg">
        <div className="flex gap-2 sm:gap-3">
          <Button
            variant={isAudioEnabled ? "default" : "destructive"}
            size="icon"
            onClick={toggleAudio}
            className="relative"
          >
            {isAudioEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
          </Button>
          
          <Button
            variant={isVideoEnabled ? "default" : "destructive"}
            size="icon"
            onClick={toggleVideo}
          >
            {isVideoEnabled ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
          </Button>
          
          <Button
            variant={isScreenSharing ? "secondary" : "outline"}
            onClick={toggleScreenShare}
            className="hidden sm:flex"
          >
            <Monitor className="h-4 w-4 mr-2" />
            {isScreenSharing ? 'Stop Share' : 'Share Screen'}
          </Button>

          <Button
            variant={isRecording ? "secondary" : "outline"}
            onClick={toggleRecording}
            className="hidden sm:flex"
          >
            {isRecording ? (
              <>
                <div className="h-2 w-2 bg-red-500 rounded-full animate-pulse mr-2" />
                Stop Recording
              </>
            ) : (
              <>
                <div className="h-2 w-2 bg-gray-400 rounded-full mr-2" />
                Start Recording
              </>
            )}
          </Button>
        </div>
        
        <Separator orientation="vertical" className="h-8 hidden sm:block" />
        
        <div className="flex gap-2">
          <Button variant="outline" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
          
          <Button variant="destructive" onClick={handleEndConsultation} className="flex items-center gap-2">
            <PhoneOff className="h-4 w-4" />
            <span className="hidden sm:inline">End Call</span>
          </Button>
        </div>
      </div>
    </div>
  );
};