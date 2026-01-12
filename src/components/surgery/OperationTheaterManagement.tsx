import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Clock, Users, AlertTriangle, CheckCircle, Settings, Plus, Loader2 } from "lucide-react";
import {
  getOTs, getSurgeryBookings, updateSurgeryStatus,
  OperationTheater as OTType, SurgeryBooking, mockOTs
} from "@/services/otService";
import { toast } from "sonner";
import { format } from "date-fns";

export const OperationTheaterManagement = () => {
  const [ots, setOTs] = useState<OTType[]>([]);
  const [bookings, setBookings] = useState<SurgeryBooking[]>([]);
  const [loading, setLoading] = useState(true);

  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [selectedOT, setSelectedOT] = useState<string>("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [otData, bookingData] = await Promise.all([
        getOTs(),
        getSurgeryBookings()
      ]);
      setOTs(otData);
      setBookings(bookingData);
    } catch (e) {
      toast.error("Failed to load OT management data");
    } finally {
      setLoading(false);
    }
  };

  const [assignmentData, setAssignmentData] = useState({
    procedure: "",
    surgeon: "",
    patient: "",
    startTime: "09:00",
    duration: "60",
    nurses: "2"
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "occupied": return "destructive";
      case "cleaning": return "secondary";
      case "available": return "default";
      case "maintenance": return "outline";
      default: return "outline";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "occupied": return <AlertTriangle className="h-4 w-4" />;
      case "cleaning": return <Clock className="h-4 w-4" />;
      case "available": return <CheckCircle className="h-4 w-4" />;
      case "maintenance": return <Settings className="h-4 w-4" />;
      default: return <MapPin className="h-4 w-4" />;
    }
  };

  const handleStatusUpdate = async (otId: string, status: string) => {
    // In our simple service, OT status is derived from surgery status updates
    // or manual maintenance toggles. 
    // For now, if there's a surgery in-progress, we update THAT.
    const activeSurgery = bookings.find(b => b.otId === otId && b.status === 'in-surgery');
    if (activeSurgery && status === 'cleaning') {
      await updateSurgeryStatus(activeSurgery.id, 'recovery');
      toast.success("Surgery completed, OT in cleaning");
    } else {
      // Manual OT status update (mock)
      setOTs(prev => prev.map(o => o.id === otId ? { ...o, status: status as any } : o));
      toast.success(`OT status updated to ${status}`);
    }
    loadData();
  };

  const handleAssignOT = async () => {
    if (!selectedOT) return;

    try {
      const scheduledAt = new Date();
      const [hours, minutes] = assignmentData.startTime.split(':');
      scheduledAt.setHours(parseInt(hours), parseInt(minutes));

      await bookSurgery({
        patientId: assignmentData.patient || `P-${Math.floor(Math.random() * 1000)}`,
        patientName: assignmentData.patient,
        surgeryName: assignmentData.procedure,
        surgeon: assignmentData.surgeon,
        scheduledAt: scheduledAt.toISOString(),
        durationMinutes: parseInt(assignmentData.duration),
        otId: selectedOT,
        priority: 'routine',
        notes: `Nurses: ${assignmentData.nurses}`
      });

      toast.success("OT assigned and surgery booked");
      setIsAssignDialogOpen(false);
      setAssignmentData({
        procedure: "",
        surgeon: "",
        patient: "",
        startTime: "09:00",
        duration: "60",
        nurses: "2"
      });
      loadData();
    } catch (e) {
      toast.error("Failed to assign OT");
    }
  };

  const currentOTs = ots.map(ot => {
    const activeBooking = bookings.find(b => b.otId === ot.id && (b.status === 'in-surgery' || b.status === 'pre-op'));
    return {
      ...ot,
      activeBooking
    };
  });

  const occupiedCount = currentOTs.filter(ot => ot.status === "occupied" || ot.activeBooking).length;
  const availableCount = currentOTs.filter(ot => ot.status === "available" && !ot.activeBooking).length;
  const utilizationRate = ots.length > 0 ? Math.round((occupiedCount / ots.length) * 100) : 0;

  return (
    <div className="space-y-4 sm:space-y-6 p-2 sm:p-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Operation Theater Management</h2>
          <p className="text-sm text-muted-foreground">
            Real-time OT status and resource allocation
          </p>
        </div>
        <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">
              <MapPin className="mr-2 h-4 w-4" />
              Assign OT
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Assign Operation Theater</DialogTitle>
              <DialogDescription>
                Assign a surgery to an available operation theater.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div>
                <Label htmlFor="ot-select">Operation Theater</Label>
                <Select value={selectedOT} onValueChange={setSelectedOT}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select OT" />
                  </SelectTrigger>
                  <SelectContent>
                    {ots
                      .filter(ot => ot.status === "available")
                      .map(ot => (
                        <SelectItem key={ot.id} value={ot.id}>{ot.name}</SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="procedure">Procedure</Label>
                <Input
                  id="procedure"
                  placeholder="Surgery type"
                  value={assignmentData.procedure}
                  onChange={(e) => setAssignmentData({ ...assignmentData, procedure: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="surgeon">Surgeon</Label>
                  <Input
                    placeholder="Dr. Name"
                    value={assignmentData.surgeon}
                    onChange={(e) => setAssignmentData({ ...assignmentData, surgeon: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="patient">Patient</Label>
                  <Input
                    id="patient"
                    placeholder="Patient name"
                    value={assignmentData.patient}
                    onChange={(e) => setAssignmentData({ ...assignmentData, patient: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="start-time">Start Time</Label>
                  <Input
                    id="start-time"
                    type="time"
                    value={assignmentData.startTime}
                    onChange={(e) => setAssignmentData({ ...assignmentData, startTime: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="duration">Duration (Min)</Label>
                  <Input
                    placeholder="60"
                    value={assignmentData.duration}
                    onChange={(e) => setAssignmentData({ ...assignmentData, duration: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="nurses">Number of Nurses</Label>
                <Select
                  value={assignmentData.nurses}
                  onValueChange={(value) => setAssignmentData({ ...assignmentData, nurses: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Nurse</SelectItem>
                    <SelectItem value="2">2 Nurses</SelectItem>
                    <SelectItem value="3">3 Nurses</SelectItem>
                    <SelectItem value="4">4 Nurses</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button onClick={handleAssignOT} className="w-full">
              Assign Operation Theater
            </Button>
          </DialogContent>
        </Dialog>
      </div>

      {/* OT Status Overview */}
      <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total OTs</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{ots.length}</div>
            <p className="text-xs text-muted-foreground">
              Operation theaters available
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Use</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{occupiedCount}</div>
            <p className="text-xs text-muted-foreground">
              Currently occupied
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{availableCount}</div>
            <p className="text-xs text-muted-foreground">
              Ready for use
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilization</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{utilizationRate}%</div>
            <p className="text-xs text-muted-foreground">
              Current rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Individual OT Status */}
      <div className="grid gap-4 md:grid-cols-2">
        {loading ? (
          <div className="col-span-2 flex justify-center py-12"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>
        ) : currentOTs.map((ot) => (
          <Card key={ot.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-base sm:text-lg">{ot.name}</CardTitle>
                  <div className="text-xs text-muted-foreground">{ot.type} Theater</div>
                </div>
                <Badge variant={getStatusColor(ot.status)} className="flex items-center gap-1 text-xs">
                  {getStatusIcon(ot.status)}
                  {ot.status.toUpperCase()}
                </Badge>
              </div>
              <CardDescription className="text-sm">
                {ot.status === "occupied" ? "Surgery in progress" :
                  ot.status === "cleaning" ? "Post-surgery cleaning" :
                    ot.status === "available" ? "Ready for next surgery" :
                      "Scheduled maintenance"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              {ot.activeBooking && (
                <div className="space-y-2 p-3 bg-slate-50 rounded-md border-l-4 border-primary">
                  <div className="font-medium text-sm sm:text-base">{ot.activeBooking.surgeryName}</div>
                  <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                    <div>Surgeon: {ot.activeBooking.surgeon}</div>
                    <div>Patient: {ot.activeBooking.patientName}</div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {format(new Date(ot.activeBooking.scheduledAt), 'hh:mm a')} (Duration: {ot.activeBooking.durationMinutes} min)
                  </div>
                </div>
              )}

              {!ot.activeBooking && ot.status === 'available' && (
                <div className="h-24 flex items-center justify-center border-2 border-dashed rounded-md text-muted-foreground text-sm italic">
                  No Active Surgery
                </div>
              )}

              <div className="space-y-2">
                <div className="text-sm font-medium">Equipment Status:</div>
                <div className="flex flex-wrap gap-1">
                  <Badge variant="outline" className="text-xs">Monitors: OK</Badge>
                  <Badge variant="outline" className="text-xs">Ventilator: OK</Badge>
                  <Badge variant="outline" className="text-xs">Power: Stable</Badge>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-3 w-3" />
                  <span>{ot.status === 'available' ? '0' : '3'} Staff Assigned</span>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {ot.status === "available" && (
                    <Button
                      size="sm"
                      onClick={() => {
                        setSelectedOT(ot.id);
                        setIsAssignDialogOpen(true);
                      }}
                      className="text-xs"
                    >
                      Quick Book
                    </Button>
                  )}
                  {ot.status === "occupied" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleStatusUpdate(ot.id, "cleaning")}
                      className="text-xs"
                    >
                      Complete Surgery
                    </Button>
                  )}
                  {(ot.status === "cleaning" || ot.status === "maintenance") && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleStatusUpdate(ot.id, "available")}
                      className="text-xs"
                    >
                      Mark Available
                    </Button>
                  )}
                  {ot.status === "available" && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleStatusUpdate(ot.id, "maintenance")}
                      className="text-xs"
                    >
                      Maintenance
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Resource Allocation */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base sm:text-lg">Resource Allocation</CardTitle>
          <CardDescription className="text-sm">Surgical equipment and staff assignment</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-3">
              <div className="font-medium text-sm">Surgical Equipment</div>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span>Laparoscopes</span>
                  <Badge variant="outline">2/3 Available</Badge>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span>Ventilators</span>
                  <Badge variant="outline">3/4 Available</Badge>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span>Monitors</span>
                  <Badge variant="outline">8/10 Available</Badge>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="font-medium text-sm">Surgical Staff</div>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span>Surgeons</span>
                  <Badge variant="outline">5/7 Available</Badge>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span>Anesthesiologists</span>
                  <Badge variant="outline">3/4 Available</Badge>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span>OR Nurses</span>
                  <Badge variant="outline">12/15 Available</Badge>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="font-medium text-sm">Quick Actions</div>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start text-sm h-8">
                  Request Emergency OT
                </Button>
                <Button variant="outline" className="w-full justify-start text-sm h-8">
                  Schedule Maintenance
                </Button>
                <Button variant="outline" className="w-full justify-start text-sm h-8">
                  Assign Staff
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
