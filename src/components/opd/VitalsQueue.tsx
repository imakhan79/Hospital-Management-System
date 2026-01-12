
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
    Users,
    Play,
    RefreshCw,
    Search,
    Activity,
    Stethoscope,
    Clock,
    AlertCircle
} from "lucide-react";
import { fetchOPDAppointments, updateAppointmentStatus, OPDAppointment } from "@/services/opdService";
import { toast } from "sonner";

interface VitalsQueueProps {
    onPatientSelect: (patientId: string, appointmentId: string) => void;
}

export const VitalsQueue = ({ onPatientSelect }: VitalsQueueProps) => {
    const [appointments, setAppointments] = useState<OPDAppointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDepartment, setSelectedDepartment] = useState<string>('all');

    useEffect(() => {
        loadQueueData();
        const interval = setInterval(loadQueueData, 30000);
        return () => clearInterval(interval);
    }, []);

    const loadQueueData = async () => {
        setLoading(true);
        try {
            const data = await fetchOPDAppointments();
            // Filter for patients ready for vitals or currently in vitals
            const vitalsQueue = data.filter(a =>
                ['waiting-vitals', 'in-vitals'].includes(a.status) &&
                (a.appointmentDate === new Date().toISOString().split('T')[0])
            );
            setAppointments(vitalsQueue);
        } catch (error) {
            console.error('Error loading vitals queue:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStartVitals = async (appointmentId: string, patientId: string) => {
        try {
            await updateAppointmentStatus(appointmentId, 'in-vitals');
            onPatientSelect(patientId, appointmentId);
            toast.success("Patient ready for Vitals capture");
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    const getFilteredAppointments = () => {
        return appointments.filter(a => {
            const matchesSearch = searchQuery === '' ||
                a.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                a.appointmentNumber.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesDept = selectedDepartment === 'all' || a.department === selectedDepartment;
            return matchesSearch && matchesDept;
        });
    };

    const uniqueDepartments = [...new Set(appointments.map(a => a.department))];

    if (loading && appointments.length === 0) {
        return <div className="p-8 text-center text-muted-foreground">Loading Vitals Queue...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <Activity className="h-6 w-6 text-red-500" />
                        Vitals Station Queue
                    </h2>
                    <p className="text-muted-foreground">Manage patients waiting for vital signs check</p>
                </div>
                <div className="flex gap-2">
                    <Input
                        placeholder="Search Name/MRN..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="w-64"
                    />
                    <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                        <SelectTrigger className="w-48">
                            <SelectValue placeholder="All Departments" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Departments</SelectItem>
                            {uniqueDepartments.map((dept) => (
                                <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Button variant="outline" size="icon" onClick={loadQueueData}>
                        <RefreshCw className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex justify-between">
                            <span>Waiting List</span>
                            <Badge variant="secondary">{getFilteredAppointments().length} Patients</Badge>
                        </CardTitle>
                        <CardDescription>Patients queued for Vitals Check-up</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {getFilteredAppointments().length === 0 ? (
                            <div className="text-center py-12 text-muted-foreground bg-slate-50 rounded-lg border border-dashed">
                                <Users className="h-10 w-10 mx-auto mb-2 opacity-20" />
                                No patients waiting for vitals
                            </div>
                        ) : (
                            getFilteredAppointments().map(appointment => (
                                <div key={appointment.id} className="flex justify-between items-center p-4 border rounded-lg hover:bg-slate-50 transition-colors">
                                    <div className="flex gap-4 items-center">
                                        <div className="bg-blue-100 text-blue-700 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm">
                                            {appointment.queueNumber || '#'}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-lg">{appointment.patientName}</h4>
                                            <div className="flex gap-3 text-sm text-muted-foreground">
                                                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {appointment.appointmentTime}</span>
                                                <span className="flex items-center gap-1"><Stethoscope className="w-3 h-3" /> {appointment.doctor}</span>
                                            </div>
                                            <Badge variant={appointment.status === 'in-vitals' ? 'default' : 'outline'} className="mt-1">
                                                {appointment.status === 'in-vitals' ? 'In Progress' : 'Waiting'}
                                            </Badge>
                                        </div>
                                    </div>
                                    <Button onClick={() => handleStartVitals(appointment.id, appointment.patientId)}>
                                        {appointment.status === 'in-vitals' ? 'Continue' : 'Start Vitals'} <Play className="ml-2 w-4 h-4" />
                                    </Button>
                                </div>
                            ))
                        )}
                    </CardContent>
                </Card>

                {/* Stats / Quick View */}
                <div className="space-y-4">
                    <Card className="bg-blue-50 border-blue-200">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm text-blue-800">Average Wait Time</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-blue-900">12 min</div>
                        </CardContent>
                    </Card>

                    <Card className="bg-green-50 border-green-200">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm text-green-800">Completed Today</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-green-900">24</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm">Priority Alerts</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <div className="flex gap-2 items-start text-sm p-2 bg-yellow-50 text-yellow-800 rounded">
                                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                                    <span>2 patients marked as Urgent based on Triage.</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};
