
import React, { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
    Users, Clock, AlertTriangle, TrendingUp, Search, Filter,
    Calendar, Phone, MoreVertical, CheckCircle2, FlaskConical,
    Pill, CreditCard, Stethoscope, Activity, Settings, RefreshCw,
    ArrowRight, UserPlus, Mail, MapPin
} from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

import { fetchOPDVisits, updateVisitStatus, OPDVisit, VisitStatus } from "@/services/opdService";

// --- Types ---
type Stage =
    | "Appointment"
    | "Check-In"
    | "Vitals"
    | "Queue"
    | "Doctor"
    | "Lab/Rad"
    | "Pharmacy"
    | "Billing"
    | "Completed";

const STAGES: Stage[] = [
    "Appointment", "Check-In", "Vitals", "Queue", "Doctor", "Lab/Rad", "Pharmacy", "Billing", "Completed"
];

// Status to Stage Mapping
const getStageFromStatus = (status: VisitStatus): Stage => {
    switch (status) {
        case 'booked': return "Appointment";
        case 'checked-in':
        case 'vitals-pending': return "Check-In";
        case 'vitals-completed': return "Vitals";
        case 'waiting-queue':
        case 'called': return "Queue";
        case 'in-consultation':
        case 'consultation-completed': return "Doctor";
        case 'orders-pending': return "Lab/Rad";
        case 'pharmacy-pending': return "Pharmacy";
        case 'billing-pending': return "Billing";
        case 'paid':
        case 'closed': return "Completed";
        default: return "Appointment";
    }
};

// Stage to Status Mapping (for manual moves)
const getStatusFromStage = (stage: Stage): VisitStatus => {
    switch (stage) {
        case "Appointment": return "booked";
        case "Check-In": return "checked-in";
        case "Vitals": return "vitals-completed";
        case "Queue": return "waiting-queue";
        case "Doctor": return "in-consultation";
        case "Lab/Rad": return "orders-pending";
        case "Pharmacy": return "pharmacy-pending";
        case "Billing": return "billing-pending";
        case "Completed": return "paid";
        default: return "booked";
    }
};

const WorkflowDashboard = () => {
    const [visits, setVisits] = useState<OPDVisit[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterDept, setFilterDept] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [isRefreshing, setIsRefreshing] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const data = await fetchOPDVisits();
            setVisits(data);
        } catch (e) {
            toast.error("Failed to fetch visits");
        } finally {
            setLoading(false);
        }
    };

    // Stats calculation
    const totalPatients = visits.length;
    // Mock wait time relative to updated_at
    const getWaitTime = (v: OPDVisit) => {
        const updated = new Date(v.updatedAt).getTime();
        const now = Date.now();
        return Math.floor((now - updated) / 60000);
    };

    const avgWaitTime = Math.round(visits.reduce((acc, v) => acc + getWaitTime(v), 0) / (totalPatients || 1));
    const slaBreaches = visits.filter(v => getWaitTime(v) > 30).length;
    const emergencyCount = visits.filter(v => v.priority === "emergency").length;

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await loadData();
        setIsRefreshing(false);
        toast.success("Dashboard data synced with medical records");
    };

    const getPriorityColor = (priority: string) => {
        switch (priority.toLowerCase()) {
            case "emergency": return "bg-red-500 text-white border-red-600";
            case "urgent": return "bg-orange-500 text-white border-orange-600";
            default: return "bg-blue-500 text-white border-blue-600";
        }
    };

    const getWaitTimeColor = (time: number) => {
        if (time > 40) return "text-red-600 font-bold animate-pulse";
        if (time > 20) return "text-orange-600 font-medium";
        return "text-green-600";
    };

    const movePatient = async (id: string, nextStage: Stage) => {
        const status = getStatusFromStage(nextStage);
        try {
            await updateVisitStatus(id, status);
            setVisits(prev => prev.map(v => v.id === id ? { ...v, status, updatedAt: new Date().toISOString() } : v));
            toast.info(`Patient moved to ${nextStage}`);
        } catch (e) {
            toast.error("Update failed");
        }
    };

    const filteredVisits = visits.filter(v => {
        const matchesDept = filterDept === "All" || v.department === filterDept;
        const matchesSearch = v.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            v.visitNumber.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesDept && matchesSearch;
    });

    return (
        <MainLayout>
            <div className="flex flex-col h-full bg-slate-50/50">
                {/* Header Section */}
                <div className="p-6 bg-white border-b sticky top-0 z-10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Workflow Dashboard</h1>
                            <p className="text-slate-500 flex items-center gap-2">
                                <Activity className="h-4 w-4 text-primary" />
                                Real-time Patient Journey Monitoring System
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button
                                variant="outline"
                                size="sm"
                                className="bg-white"
                                onClick={handleRefresh}
                                disabled={isRefreshing}
                            >
                                <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                                Sync Data
                            </Button>
                            <Button size="sm" className="bg-primary hover:bg-primary/90 shadow-sm">
                                <Settings className="h-4 w-4 mr-2" />
                                Config Stages
                            </Button>
                        </div>
                    </div>

                    {/* KPI Row */}
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        <KPIItem title="Total Patients" value={totalPatients} icon={<Users />} color="blue" />
                        <KPIItem title="Avg. Wait Time" value={`${avgWaitTime}m`} icon={<Clock />} color="orange" trend="-2m today" />
                        <KPIItem title="SLA Breaches" value={slaBreaches} icon={<AlertTriangle />} color="red" subtext="Current delays" />
                        <KPIItem title="Emergency" value={emergencyCount} icon={<Activity />} color="rose" />
                        <KPIItem title="Revenue" value="₹42.5k" icon={<TrendingUp />} color="emerald" subtext="+12% vs last week" className="hidden lg:flex" />
                    </div>

                    {/* Filters Bar */}
                    <div className="flex flex-wrap items-center gap-3 mt-6">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input
                                placeholder="Search Patient Name or Token..."
                                className="pl-9 h-9 border-slate-200"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <Select value={filterDept} onValueChange={setFilterDept}>
                            <SelectTrigger className="w-[180px] h-9">
                                <SelectValue placeholder="All Departments" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="All">All Departments</SelectItem>
                                <SelectItem value="OPD">OPD Clinic</SelectItem>
                                <SelectItem value="Cardiology">Cardiology</SelectItem>
                                <SelectItem value="Emergency">ER Department</SelectItem>
                                <SelectItem value="Gastro">Gastroenterology</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button variant="ghost" size="sm" className="text-slate-500 h-9">
                            <Filter className="h-4 w-4 mr-2" />
                            Advanced
                        </Button>
                    </div>
                </div>

                {/* Kanban Board Container */}
                <ScrollArea className="flex-1 w-full overflow-x-auto whitespace-nowrap bg-slate-50/50">
                    <div className="flex p-6 gap-6 h-full min-h-[600px]">
                        {STAGES.map((stage) => (
                            <KanbanColumn
                                key={stage}
                                stage={stage}
                                patients={filteredVisits.filter(v => getStageFromStatus(v.status) === stage)}
                                onMove={movePatient}
                                getPriorityColor={getPriorityColor}
                                getWaitTimeColor={getWaitTimeColor}
                                getWaitTime={getWaitTime}
                            />
                        ))}
                    </div>
                    <ScrollBar orientation="horizontal" />
                </ScrollArea>
            </div>
        </MainLayout>
    );
};

// --- Sub-components ---

const KPIItem = ({ title, value, icon, color, subtext, trend, className }: any) => {
    const colors: any = {
        blue: "bg-blue-50 text-blue-600 border-blue-100",
        orange: "bg-orange-50 text-orange-600 border-orange-100",
        red: "bg-red-50 text-red-600 border-red-100",
        rose: "bg-rose-50 text-rose-600 border-rose-100",
        emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
    };

    return (
        <Card className={`overflow-hidden shadow-sm border-slate-200 ${className}`}>
            <CardContent className="p-4 flex items-center justify-between">
                <div>
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">{title}</p>
                    <div className="flex items-baseline gap-2">
                        <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
                        {trend && <span className="text-[10px] text-green-500 font-medium">{trend}</span>}
                    </div>
                    {subtext && <p className="text-[10px] text-slate-400 mt-1">{subtext}</p>}
                </div>
                <div className={`p-2 rounded-xl border ${colors[color]}`}>
                    {React.cloneElement(icon, { className: "h-5 w-5" })}
                </div>
            </CardContent>
        </Card>
    );
};

const KanbanColumn = ({ stage, patients, onMove, getPriorityColor, getWaitTimeColor, getWaitTime }: any) => {
    const getIcon = () => {
        switch (stage) {
            case "Appointment": return <Calendar className="h-4 w-4" />;
            case "Check-In": return <UserPlus className="h-4 w-4" />;
            case "Vitals": return <Activity className="h-4 w-4" />;
            case "Queue": return <Users className="h-4 w-4" />;
            case "Doctor": return <Stethoscope className="h-4 w-4" />;
            case "Lab/Rad": return <FlaskConical className="h-4 w-4" />;
            case "Pharmacy": return <Pill className="h-4 w-4" />;
            case "Billing": return <CreditCard className="h-4 w-4" />;
            case "Completed": return <CheckCircle2 className="h-4 w-4" />;
            default: return null;
        }
    };

    const getNextStage = (curr: Stage): Stage => {
        const idx = STAGES.indexOf(curr);
        return STAGES[idx + 1] || "Completed";
    };

    return (
        <div className="w-80 flex-shrink-0 flex flex-col h-full rounded-2xl border bg-white/50 backdrop-blur-sm border-slate-200">
            <div className="p-4 flex items-center justify-between border-b bg-white rounded-t-2xl">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-slate-100 text-slate-600">
                        {getIcon()}
                    </div>
                    <h3 className="font-semibold text-slate-800 text-sm tracking-tight">{stage}</h3>
                </div>
                <Badge variant="secondary" className="bg-slate-100 text-slate-600 text-[10px] px-2 py-0 border-none font-bold">
                    {patients.length}
                </Badge>
            </div>

            <ScrollArea className="flex-1 p-3">
                <div className="flex flex-col gap-3">
                    {patients.map((p: OPDVisit) => (
                        <Card key={p.id} className="group relative border-slate-200 shadow-sm hover:shadow-md transition-all hover:border-primary/30 overflow-hidden text-wrap">
                            <div className={`absolute left-0 top-0 bottom-0 w-1 ${getPriorityColor(p.priority).split(' ')[0]}`} />
                            <CardHeader className="p-3 pb-2 flex flex-row items-center justify-between space-y-0">
                                <div className="flex items-center gap-2">
                                    <Badge className={`text-[9px] uppercase font-bold py-0.5 px-1.5 border-none ${getPriorityColor(p.priority)}`}>
                                        {p.priority}
                                    </Badge>
                                    <span className="text-[10px] text-slate-400 font-bold">{p.visitNumber}</span>
                                </div>
                                <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <MoreVertical className="h-3.3 w-3.5" />
                                </Button>
                            </CardHeader>
                            <CardContent className="p-3 pt-0">
                                <div className="mb-2">
                                    <h4 className="font-bold text-slate-900 text-sm leading-none">{p.patientName}</h4>
                                    <p className="text-[11px] text-slate-500 mt-1">{p.age || 'N/A'}y, {p.gender || 'N/A'} • {p.department}</p>
                                </div>

                                <div className="flex items-center justify-between mt-4 mb-2">
                                    <div className="flex flex-col">
                                        <span className="text-[9px] text-slate-400 uppercase font-bold">Waiting</span>
                                        <span className={`text-xs font-bold ${getWaitTimeColor(getWaitTime(p))}`}>{getWaitTime(p)} mins</span>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="text-[9px] text-slate-400 uppercase font-bold">Doctor</span>
                                        <span className="text-xs font-medium text-slate-700 truncate max-w-[120px]">{p.doctor}</span>
                                    </div>
                                </div>

                                <Separator className="my-2 bg-slate-100" />

                                <div className="flex items-center gap-1.5 mt-1">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="flex-1 h-7 text-[10px] font-bold border-slate-200 text-slate-600 hover:bg-slate-50"
                                        onClick={() => toast.info(`Contacting ${p.patientName}...`)}
                                    >
                                        <Phone className="h-3 w-3 mr-1" />
                                        Call
                                    </Button>
                                    {stage !== "Completed" && (
                                        <Button
                                            size="sm"
                                            className="flex-1 h-7 text-[10px] font-bold bg-primary/10 text-primary hover:bg-primary/20 border-none"
                                            onClick={() => onMove(p.id, getNextStage(stage))}
                                        >
                                            <ArrowRight className="h-3 w-3 mr-1" />
                                            Next
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    {patients.length === 0 && (
                        <div className="py-20 flex flex-col items-center justify-center opacity-20 invisible group-hover:visible transition-all">
                            <div className="p-3 rounded-full bg-slate-100 mb-2">
                                {getIcon()}
                            </div>
                            <p className="text-xs font-medium">Empty Stage</p>
                        </div>
                    )}
                </div>
            </ScrollArea>

            <div className="p-3 bg-white border-t rounded-b-2xl">
                <Button variant="ghost" size="sm" className="w-full h-8 text-xs text-slate-500 hover:text-primary">
                    View Detail Log
                </Button>
            </div>
        </div>
    );
};

export default WorkflowDashboard;

