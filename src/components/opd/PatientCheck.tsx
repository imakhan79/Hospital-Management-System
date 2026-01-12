
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, UserCheck, Clock, Phone, Mail, MapPin, User, CheckCircle, MoreVertical } from "lucide-react";
import { sampleAppointments, updateAppointmentStatus } from "@/services/opdService";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

export const PatientCheck = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCheckIn = async (appointmentId: string) => {
    setLoading(true);
    try {
      await updateAppointmentStatus(appointmentId, 'checked-in');
      toast.success('Patient checked in successfully');
    } catch (error) {
      toast.error('Failed to check in patient');
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];
  const todayAppointments = sampleAppointments.filter(a =>
    a.date === today &&
    (searchQuery === '' ||
      a.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.visitNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.patientPhone.includes(searchQuery))
  );

  return (
    <div className="space-y-6">
      <Card className="border-none shadow-sm rounded-2xl bg-white overflow-hidden">
        <CardHeader className="pb-6">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                <div className="p-2 bg-primary/10 rounded-xl text-primary">
                  <UserCheck className="h-6 w-6" />
                </div>
                Patient Check-in
              </CardTitle>
              <CardDescription className="mt-1">
                Verify appointment number and check in patients for their scheduled slot.
              </CardDescription>
            </div>
            <div className="hidden sm:block">
              <Badge className="bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border-none px-4 py-1.5 uppercase font-bold tracking-wider">{today}</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative mb-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <Input
              placeholder="Enter Appointment Number (e.g. APP-1234), Name, or Phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-14 bg-slate-50 border-slate-100 rounded-2xl focus:ring-primary/20 text-lg transition-all"
            />
          </div>

          <div className="grid gap-4">
            {todayAppointments.map((appointment) => (
              <div key={appointment.id} className="group flex flex-col md:flex-row items-center justify-between p-6 rounded-2xl border border-slate-100 bg-white hover:border-primary/20 hover:shadow-lg transition-all duration-300">
                <div className="flex items-start gap-5 w-full md:w-auto">
                  <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center font-bold text-slate-400 group-hover:bg-primary/5 group-hover:text-primary transition-colors">
                    {appointment.patientName[0]}
                  </div>

                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-xl text-slate-900 leading-tight">{appointment.patientName}</h4>
                      <Badge variant="outline" className="bg-blue-50/50 border-blue-100 text-blue-600 text-[10px] uppercase font-bold px-2 py-0">
                        {appointment.visitNumber}
                      </Badge>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500 font-medium">
                      <div className="flex items-center gap-1.5">
                        <Phone className="h-3.5 w-3.5 text-slate-400" />
                        {appointment.patientPhone}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-slate-400" />
                        {appointment.time}
                      </div>
                      <div className="flex items-center gap-1.5 font-bold text-slate-700">
                        <MapPin className="h-3.5 w-3.5 text-primary" />
                        {appointment.department}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mt-3">
                      <div className="flex items-center gap-1 text-[11px] font-bold text-slate-400 uppercase">
                        <User className="h-3 w-3" />
                        {appointment.doctor}
                      </div>
                      <Separator orientation="vertical" className="h-3" />
                      <Badge
                        className={cn(
                          "text-[10px] uppercase font-bold border-none",
                          appointment.status === 'booked' ? 'bg-blue-500 text-white' :
                            appointment.status === 'checked-in' ? 'bg-emerald-500 text-white' :
                              'bg-slate-100 text-slate-500'
                        )}
                      >
                        {appointment.status.replace('-', ' ')}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 mt-6 md:mt-0 w-full md:w-auto">
                  {appointment.status === 'booked' && (
                    <Button
                      onClick={() => handleCheckIn(appointment.id)}
                      disabled={loading}
                      className="w-full md:w-auto rounded-xl h-11 px-6 bg-primary hover:bg-primary/90 font-bold shadow-md transform active:scale-95 transition-all"
                    >
                      <UserCheck className="h-4 w-4 mr-2" />
                      Complete Check-in
                    </Button>
                  )}

                  {appointment.status === 'checked-in' && (
                    <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-4 py-2 rounded-xl font-bold text-sm">
                      <CheckCircle className="h-4 w-4" />
                      Checked In
                    </div>
                  )}

                  <Button variant="ghost" size="icon" className="h-11 w-11 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-50">
                    <MoreVertical className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            ))}

            {todayAppointments.length === 0 && (
              <div className="py-20 flex flex-col items-center justify-center border-2 border-dashed border-slate-100 rounded-3xl bg-slate-50/30">
                <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                  <Search className="h-10 w-10 text-slate-300" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-1">No appointments found</h3>
                <p className="text-slate-500">Try searching with a different appointment number or name.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
