import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar as CalendarIcon, Clock, User, CheckCircle2, AlertCircle, Plus, Loader2, Trash2 } from "lucide-react";
import {
  getSurgeryBookings, bookSurgery, updateSurgeryStatus, deleteSurgery,
  SurgeryBooking, mockOTs, mockSurgeons
} from "@/services/otService";
import { toast } from "sonner";
import { format, startOfWeek, endOfWeek, addDays, isSameDay } from "date-fns";

export const SurgeryScheduling = () => {
  const [surgeries, setSurgeries] = useState<SurgeryBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  useEffect(() => {
    loadSurgeries();
  }, []);

  const loadSurgeries = async () => {
    setLoading(true);
    try {
      const data = await getSurgeryBookings();
      setSurgeries(data);
    } catch (e) {
      toast.error("Failed to load surgeries");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSurgery = async (id: string) => {
    if (!confirm("Are you sure you want to delete this surgery booking?")) return;
    try {
      await deleteSurgery(id);
      toast.success("Surgery booking deleted");
      loadSurgeries();
    } catch (e) {
      toast.error("Failed to delete surgery");
    }
  };

  const [newSurgery, setNewSurgery] = useState({
    patientId: "",
    patientName: "",
    surgeryName: "",
    surgeon: "",
    scheduledAt: "",
    durationMinutes: 60,
    otId: "ot-1",
    priority: "routine" as const,
    notes: ""
  });

  const handleAddSurgery = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await bookSurgery({
        ...newSurgery,
        scheduledAt: new Date(newSurgery.scheduledAt).toISOString()
      });
      toast.success("Surgery booked successfully");
      setIsAddDialogOpen(false);
      setNewSurgery({
        patientId: "",
        patientName: "",
        surgeryName: "",
        surgeon: "",
        scheduledAt: "",
        durationMinutes: 60,
        otId: "ot-1",
        priority: "routine",
        notes: ""
      });
      loadSurgeries();
    } catch (e) {
      toast.error("Failed to book surgery");
    }
  };

  const handleStatusUpdate = async (id: string, status: SurgeryBooking['status']) => {
    try {
      await updateSurgeryStatus(id, status);
      toast.success(`Surgery status updated to ${status}`);
      loadSurgeries();
    } catch (e) {
      toast.error("Failed to update status");
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "emergency": return "destructive";
      case "urgent": return "default";
      default: return "secondary";
    }
  };

  // Calculate Weekly Overview Data
  const startDate = startOfWeek(new Date(), { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(startDate, i));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Surgery Scheduling</h2>
          <p className="text-muted-foreground">Manage and track surgical procedures</p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(!isAddDialogOpen)}>
          <Plus className="mr-2 h-4 w-4" />
          {isAddDialogOpen ? "View Schedule" : "New Booking"}
        </Button>
      </div>

      {isAddDialogOpen ? (
        <Card>
          <CardHeader>
            <CardTitle>Schedule New Surgery</CardTitle>
            <CardDescription>Fill in the details to reserve an operating theater</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddSurgery} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="patientId">Patient ID</Label>
                  <Input
                    id="patientId"
                    placeholder="P-123"
                    value={newSurgery.patientId}
                    onChange={e => setNewSurgery({ ...newSurgery, patientId: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="patientName">Patient Name</Label>
                  <Input
                    id="patientName"
                    placeholder="John Doe"
                    value={newSurgery.patientName}
                    onChange={e => setNewSurgery({ ...newSurgery, patientName: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="surgeryName">Procedure</Label>
                  <Input
                    id="surgeryName"
                    placeholder="Surgery type"
                    value={newSurgery.surgeryName}
                    onChange={e => setNewSurgery({ ...newSurgery, surgeryName: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="surgeon">Surgeon</Label>
                  <Select
                    value={newSurgery.surgeon}
                    onValueChange={v => setNewSurgery({ ...newSurgery, surgeon: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Surgeon" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockSurgeons.map(s => (
                        <SelectItem key={s.id} value={s.name}>{s.name} ({s.specialty})</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="scheduledAt">Date & Time</Label>
                  <Input
                    id="scheduledAt"
                    type="datetime-local"
                    value={newSurgery.scheduledAt}
                    onChange={e => setNewSurgery({ ...newSurgery, scheduledAt: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (Minutes)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={newSurgery.durationMinutes}
                    onChange={e => setNewSurgery({ ...newSurgery, durationMinutes: parseInt(e.target.value) })}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="otId">Operating Theater</Label>
                  <Select
                    value={newSurgery.otId}
                    onValueChange={v => setNewSurgery({ ...newSurgery, otId: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select OT" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockOTs.map(ot => (
                        <SelectItem key={ot.id} value={ot.id}>{ot.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={newSurgery.priority}
                    onValueChange={(v: any) => setNewSurgery({ ...newSurgery, priority: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="routine">Routine</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                      <SelectItem value="emergency">Emergency</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button type="submit" className="w-full">Schedule Surgery</Button>
            </form>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="daily" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="daily">Daily Schedule</TabsTrigger>
            <TabsTrigger value="weekly">Weekly Overview</TabsTrigger>
          </TabsList>

          <TabsContent value="daily">
            <div className="grid gap-4">
              {loading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : surgeries.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed rounded-lg text-muted-foreground">
                  No surgeries scheduled for today
                </div>
              ) : surgeries.map((surgery) => (
                <Card key={surgery.id} className="relative overflow-hidden">
                  <div className={`absolute left-0 top-0 bottom-0 w-1 ${surgery.priority === 'emergency' ? 'bg-red-500' :
                    surgery.priority === 'urgent' ? 'bg-orange-500' : 'bg-blue-500'
                    }`} />
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-lg font-bold">{surgery.surgeryName}</h3>
                          <Badge variant={getPriorityColor(surgery.priority)}>
                            {surgery.priority.toUpperCase()}
                          </Badge>
                          <Badge variant="outline" className="capitalize">
                            {surgery.status.replace('-', ' ')}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-1 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            {format(new Date(surgery.scheduledAt), 'hh:mm a')} ({surgery.durationMinutes} min)
                          </div>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            Surgeon: {surgery.surgeon}
                          </div>
                          <div className="flex items-center gap-2">
                            <CalendarIcon className="h-4 w-4" />
                            Patient: {surgery.patientName} ({surgery.patientId})
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4" />
                            {mockOTs.find(o => o.id === surgery.otId)?.name || surgery.otId}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <Select
                          value={surgery.status}
                          onValueChange={(value: any) => handleStatusUpdate(surgery.id, value)}
                        >
                          <SelectTrigger className="w-[140px] h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="scheduled">Scheduled</SelectItem>
                            <SelectItem value="pre-op">Pre-Op</SelectItem>
                            <SelectItem value="in-surgery">In Surgery</SelectItem>
                            <SelectItem value="recovery">Recovery</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button size="icon" variant="ghost" onClick={() => handleDeleteSurgery(surgery.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="weekly">
            <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
              <div className="grid grid-cols-7 border-b bg-slate-50">
                {weekDays.map((day) => (
                  <div key={day.toString()} className="p-2 sm:p-4 text-center border-r last:border-r-0">
                    <div className="text-xs sm:text-sm font-medium text-muted-foreground">
                      {format(day, 'EEE')}
                    </div>
                    <div className={`mt-1 text-sm sm:text-lg font-bold ${isSameDay(day, new Date()) ? 'text-primary' : ''}`}>
                      {format(day, 'd')}
                    </div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 h-[400px]">
                {weekDays.map((day) => {
                  const daySurgeries = surgeries.filter(s => isSameDay(new Date(s.scheduledAt), day));
                  return (
                    <div key={day.toString()} className="border-r last:border-r-0 p-2 overflow-y-auto space-y-2">
                      {daySurgeries.map(s => (
                        <div key={s.id} className={`p-1 text-[10px] rounded border-l-2 ${s.priority === 'emergency' ? 'border-red-500 bg-red-50' :
                          s.priority === 'urgent' ? 'border-orange-500 bg-orange-50' : 'border-blue-500 bg-blue-50'
                          }`}>
                          <div className="font-bold truncate">{s.surgeryName}</div>
                          <div className="text-muted-foreground">{format(new Date(s.scheduledAt), 'HH:mm')}</div>
                        </div>
                      ))}
                      {daySurgeries.length === 0 && (
                        <div className="text-center text-[10px] text-muted-foreground mt-4 opacity-50">
                          No surgeries
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};
