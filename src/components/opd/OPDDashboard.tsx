
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  Users,
  Activity,
  TrendingUp,
  Phone,
  Video,
  MapPin,
  Filter,
  RefreshCw,
  CheckCircle2,
  Timer,
  UserCheck,
  Zap,
  MoreVertical,
  Search,
  ChevronRight,
  Stethoscope,
  FlaskConical,
  Baby,
  Brain
} from "lucide-react";
import { fetchOPDVisits, fetchOPDQueues, OPDVisit, OPDQueue } from "@/services/opdService";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export const OPDDashboard = () => {
  const [visits, setVisits] = useState<OPDVisit[]>([]);
  const [queues, setQueues] = useState<OPDQueue[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterDept, setFilterDept] = useState("all");

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [visitsData, queuesData] = await Promise.all([
        fetchOPDVisits(),
        fetchOPDQueues()
      ]);
      setVisits(visitsData);
      setQueues(queuesData);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast.error("Failed to sync dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];
  const todayVisits = visits.filter(v => v.date === today);

  const stats = {
    completed: todayVisits.filter(v => ['closed', 'paid', 'consultation-completed'].includes(v.status)).length,
    inQueue: todayVisits.filter(v => ['waiting-queue', 'called'].includes(v.status)).length,
    appointments: todayVisits.filter(v => v.type === 'online').length,
    walkIns: todayVisits.filter(v => v.type === 'walk-in').length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <div className="flex flex-col items-center gap-2">
          <RefreshCw className="h-8 w-8 text-primary animate-spin" />
          <p className="text-muted-foreground font-medium">Loading OPD Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Search and Filters Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">OPD Dashboard</h2>
          <p className="text-sm text-slate-500">Welcome to real-time clinical operations hub.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input placeholder="Search patient..." className="pl-9 h-10 w-64 bg-white border-slate-200 rounded-xl" />
          </div>
          <Select value={filterDept} onValueChange={setFilterDept}>
            <SelectTrigger className="w-[160px] h-10 rounded-xl border-slate-200 bg-white">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {Array.from(new Set(queues.map(q => q.department))).map(dept => (
                <SelectItem key={dept} value={dept.toLowerCase()}>{dept}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" onClick={loadDashboardData} className="rounded-xl h-10 w-10 border-slate-200 bg-white">
            <RefreshCw className="h-4 w-4 text-slate-600" />
          </Button>
        </div>
      </div>

      {/* KPI Row (Pastel backgrounds) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Completed"
          value={stats.completed}
          icon={<CheckCircle2 className="h-5 w-5" />}
          bgColor="bg-emerald-50 text-emerald-600"
          iconBg="bg-emerald-100"
        />
        <KPICard
          title="In Queue"
          value={stats.inQueue}
          icon={<Users className="h-5 w-5" />}
          bgColor="bg-blue-50 text-blue-600"
          iconBg="bg-blue-100"
        />
        <KPICard
          title="Appointments"
          value={stats.appointments}
          icon={<Calendar className="h-5 w-5" />}
          bgColor="bg-purple-50 text-purple-600"
          iconBg="bg-purple-100"
        />
        <KPICard
          title="Walk-ins"
          value={stats.walkIns}
          icon={<UserCheck className="h-5 w-5" />}
          bgColor="bg-orange-50 text-orange-600"
          iconBg="bg-orange-100"
        />
      </div>

      {/* Main Content: Live Queue Status */}
      <Card className="border-none shadow-sm rounded-2xl overflow-hidden bg-white">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="space-y-1">
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              Live Queue Status
            </CardTitle>
            <CardDescription>Real-time departmental queue management</CardDescription>
          </div>
          <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-tight">Live</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pt-2">
            {queues.length > 0 ? queues.map((queue) => (
              <DepartmentQueueCard key={queue.id} queue={queue} />
            )) : (
              <div className="col-span-full py-20 flex flex-col items-center justify-center border-2 border-dashed border-slate-100 rounded-2xl bg-slate-50/50">
                <Users className="h-10 w-10 text-slate-300 mb-2" />
                <p className="text-sm font-medium text-slate-500">No active queues found at the moment.</p>
                <Button variant="ghost" className="mt-2 text-xs text-primary" onClick={loadDashboardData}>
                  <RefreshCw className="h-3 w-3 mr-2" /> Retry Sync
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity / Next Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-none shadow-sm rounded-2xl bg-white">
          <CardHeader>
            <CardTitle className="text-lg">Recent Check-ins</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {todayVisits.slice(0, 4).map(visit => (
              <div key={visit.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-50 hover:bg-slate-50/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600">
                    {visit.patientName[0]}
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{visit.patientName}</div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase">{visit.visitNumber}</div>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant="outline" className="text-[10px] bg-white">{visit.status}</Badge>
                  <div className="text-[10px] text-slate-400 mt-1">{visit.time}</div>
                </div>
              </div>
            ))}
            <Button variant="ghost" className="w-full text-xs text-slate-500">View All Records</Button>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm rounded-2xl bg-white">
          <CardHeader>
            <CardTitle className="text-lg">Staff Availability</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-xl bg-blue-50/30 border border-blue-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                  <Stethoscope className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-semibold text-sm">Dr. Sarah Ahmed</div>
                  <div className="text-[10px] text-blue-500 font-bold">CARDIOLOGY • ACTIVE</div>
                </div>
              </div>
              <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white border-0 text-[10px]">ON-DUTY</Badge>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50/30 border border-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                  <Brain className="h-5 w-5 text-slate-400" />
                </div>
                <div>
                  <div className="font-semibold text-sm">Dr. Mohammad Ali</div>
                  <div className="text-[10px] text-slate-400 font-bold">NEUROLOGY • BREAK</div>
                </div>
              </div>
              <Badge variant="secondary" className="text-[10px]">BREAK</Badge>
            </div>
            <Button variant="ghost" className="w-full text-xs text-slate-500">Manage Roster</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// --- Helper Components ---

const KPICard = ({ title, value, icon, bgColor, iconBg }: any) => (
  <Card className={`border-none shadow-sm rounded-2xl ${bgColor}`}>
    <CardContent className="p-5 flex items-center justify-between">
      <div>
        <p className="text-[11px] font-bold uppercase tracking-wider opacity-70">{title}</p>
        <h3 className="text-2xl font-bold mt-1">{value}</h3>
      </div>
      <div className={`p-2.5 rounded-xl ${iconBg}`}>
        {icon}
      </div>
    </CardContent>
  </Card>
);

const DepartmentQueueCard = ({ queue }: { queue: OPDQueue }) => {
  const getDeptIcon = (dept: string) => {
    switch (dept.toLowerCase()) {
      case 'gastroenterology': return <Activity className="h-6 w-6 text-orange-600" />;
      case 'gynecology': return <Activity className="h-6 w-6 text-purple-600" />;
      case 'pediatrics': return <Baby className="h-6 w-6 text-blue-600" />;
      case 'cardiology': return <Heart className="h-6 w-6 text-red-600" />;
      default: return <Stethoscope className="h-6 w-6 text-blue-600" />;
    }
  };

  const getDeptBg = (dept: string) => {
    switch (dept.toLowerCase()) {
      case 'gastroenterology': return 'bg-orange-100';
      case 'gynecology': return 'bg-purple-100';
      case 'pediatrics': return 'bg-blue-100';
      case 'cardiology': return 'bg-red-100';
      default: return 'bg-blue-100';
    }
  };

  return (
    <div className="group p-5 rounded-2xl border border-slate-100 bg-slate-50/30 hover:bg-white hover:border-primary/20 hover:shadow-lg transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 ${getDeptBg(queue.department)} rounded-xl flex items-center justify-center transition-transform group-hover:scale-110`}>
            {getDeptIcon(queue.department)}
          </div>
          <div>
            <h4 className="font-bold text-slate-900 leading-tight">{queue.department}</h4>
            <p className="text-xs text-slate-500 font-medium">{queue.doctorName}</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 group-hover:text-primary">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-end justify-between">
        <div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black text-slate-900">{queue.queueCount}</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase">in queue</span>
          </div>
          <div className="flex items-center gap-1.5 mt-1">
            <Timer className="h-3 w-3 text-slate-400" />
            <span className="text-xs text-slate-500 font-medium">~{queue.estimatedWaitTime} min wait</span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <Badge className="bg-blue-50 text-blue-600 hover:bg-blue-100 border-none px-3 py-1 text-[10px] font-bold uppercase tracking-tight">Active</Badge>
          <Button variant="ghost" size="sm" className="h-7 text-[10px] font-bold text-primary px-0 hover:bg-transparent">
            Call Next <ChevronRight className="h-3 w-3 ml-0.5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

const Heart = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z" />
  </svg>
);
