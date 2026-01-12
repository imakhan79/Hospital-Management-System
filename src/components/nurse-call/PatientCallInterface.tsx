
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  Bell, 
  AlertTriangle, 
  Users, 
  Heart, 
  Pill, 
  Toilet,
  Phone,
  Mic,
  MicOff
} from 'lucide-react';
import { createCall } from "@/services/nurseCallService";
import { useToast } from "@/hooks/use-toast";

interface PatientCallInterfaceProps {
  patientId: string;
  patientName: string;
  roomNumber: string;
  department: string;
}

const PatientCallInterface: React.FC<PatientCallInterfaceProps> = ({
  patientId,
  patientName,
  roomNumber,
  department
}) => {
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [callNotes, setCallNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const callTypes = [
    {
      type: 'emergency',
      label: 'Emergency',
      icon: <AlertTriangle className="w-6 h-6" />,
      priority: 'critical' as const,
      color: 'bg-red-500 hover:bg-red-600 text-white',
      description: 'Immediate medical attention needed'
    },
    {
      type: 'assistance',
      label: 'General Assistance',
      icon: <Users className="w-6 h-6" />,
      priority: 'medium' as const,
      color: 'bg-blue-500 hover:bg-blue-600 text-white',
      description: 'Need help with daily activities'
    },
    {
      type: 'pain',
      label: 'Pain Management',
      icon: <Heart className="w-6 h-6" />,
      priority: 'high' as const,
      color: 'bg-orange-500 hover:bg-orange-600 text-white',
      description: 'Experiencing pain or discomfort'
    },
    {
      type: 'medication',
      label: 'Medication',
      icon: <Pill className="w-6 h-6" />,
      priority: 'medium' as const,
      color: 'bg-purple-500 hover:bg-purple-600 text-white',
      description: 'Questions about medication'
    },
    {
      type: 'bathroom',
      label: 'Bathroom Assistance',
      icon: <Toilet className="w-6 h-6" />,
      priority: 'medium' as const,
      color: 'bg-green-500 hover:bg-green-600 text-white',
      description: 'Need help with bathroom'
    },
    {
      type: 'general',
      label: 'Other',
      icon: <Bell className="w-6 h-6" />,
      priority: 'low' as const,
      color: 'bg-gray-500 hover:bg-gray-600 text-white',
      description: 'Other requests or questions'
    }
  ];

  const handleCallRequest = async (callType: typeof callTypes[0]) => {
    setIsSubmitting(true);
    
    try {
      const result = await createCall({
        patient_id: patientId,
        patient_name: patientName,
        room_number: roomNumber,
        department: department,
        call_type: callType.type as any,
        priority: callType.priority,
        status: 'pending',
        notes: callNotes || undefined,
        voice_call_enabled: isVoiceEnabled
      });

      if (result.success) {
        toast({
          title: "Call Sent",
          description: `Your ${callType.label.toLowerCase()} request has been sent to the nursing station.`,
        });
        setCallNotes('');
      } else {
        throw new Error('Failed to send call');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send call request. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Nurse Call System</CardTitle>
          <CardDescription>
            Patient: {patientName} • Room: {roomNumber} • {department}
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Voice Call Option */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Phone className="w-5 h-5" />
            Communication Options
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              {isVoiceEnabled ? <Mic className="w-5 h-5 text-green-500" /> : <MicOff className="w-5 h-5 text-gray-400" />}
              <div>
                <p className="font-medium">Voice Call</p>
                <p className="text-sm text-muted-foreground">
                  Enable voice communication with nurse
                </p>
              </div>
            </div>
            <Button
              variant={isVoiceEnabled ? "default" : "outline"}
              onClick={() => setIsVoiceEnabled(!isVoiceEnabled)}
            >
              {isVoiceEnabled ? "Enabled" : "Enable"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Call Type Buttons */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">How can we help you?</CardTitle>
          <CardDescription>
            Select the type of assistance you need
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {callTypes.map((callType) => (
              <Button
                key={callType.type}
                className={`h-auto p-6 flex flex-col items-center gap-3 ${callType.color}`}
                onClick={() => handleCallRequest(callType)}
                disabled={isSubmitting}
              >
                {callType.icon}
                <div className="text-center">
                  <div className="font-semibold">{callType.label}</div>
                  <div className="text-xs opacity-90 mt-1">
                    {callType.description}
                  </div>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {callType.priority.toUpperCase()}
                </Badge>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Additional Notes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Additional Information</CardTitle>
          <CardDescription>
            Optional: Provide more details about your request
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Describe your situation or any additional details..."
            value={callNotes}
            onChange={(e) => setCallNotes(e.target.value)}
            rows={3}
          />
        </CardContent>
      </Card>

      {/* Emergency Call Button */}
      <Card className="border-red-200 bg-red-50">
        <CardContent className="pt-6">
          <Button
            className="w-full h-16 bg-red-600 hover:bg-red-700 text-white text-xl font-bold"
            onClick={() => handleCallRequest(callTypes[0])} // Emergency call
            disabled={isSubmitting}
          >
            <AlertTriangle className="w-8 h-8 mr-3" />
            EMERGENCY CALL
          </Button>
          <p className="text-center text-sm text-red-600 mt-2">
            Press for immediate medical attention
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientCallInterface;
