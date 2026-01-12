
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Video, Phone, Mic, MicOff, VideoOff, Settings, Users } from "lucide-react";
import { sampleAppointments } from "@/services/opdService";

export const VideoConsultation = () => {
  const today = new Date().toISOString().split('T')[0];
  const videoConsultations = sampleAppointments.filter(a => 
    a.appointmentDate === today && 
    a.consultationType === 'video' &&
    ['checked-in', 'in-progress'].includes(a.status)
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video className="h-5 w-5" />
            Video Consultations
          </CardTitle>
          <CardDescription>
            Manage and conduct video consultations with patients
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Video Consultations List */}
            <div className="space-y-4">
              <h3 className="font-medium">Scheduled Video Calls</h3>
              {videoConsultations.map((appointment) => (
                <div key={appointment.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="font-medium">{appointment.patientName}</div>
                      <div className="text-sm text-muted-foreground">
                        {appointment.appointmentTime} • {appointment.department}
                      </div>
                    </div>
                    <Badge variant={appointment.status === 'in-progress' ? 'default' : 'secondary'}>
                      {appointment.status}
                    </Badge>
                  </div>
                  
                  <div className="text-sm text-muted-foreground mb-3">
                    Dr. {appointment.doctor}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1">
                      <Video className="h-4 w-4 mr-2" />
                      Join Call
                    </Button>
                    <Button size="sm" variant="outline">
                      <Phone className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              
              {videoConsultations.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Video className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No video consultations scheduled</p>
                </div>
              )}
            </div>

            {/* Video Call Interface */}
            <div className="space-y-4">
              <h3 className="font-medium">Video Call Interface</h3>
              <Card>
                <CardContent className="p-6">
                  <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center mb-4">
                    <div className="text-white text-center">
                      <Video className="h-12 w-12 mx-auto mb-2" />
                      <p>Video Call Placeholder</p>
                      <p className="text-sm opacity-75">Camera and video controls will appear here</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-center gap-2">
                    <Button size="sm" variant="outline">
                      <Mic className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Video className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Settings className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="destructive">
                      End Call
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
