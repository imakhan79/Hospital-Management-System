
import { useState, useEffect } from "react";
import {
    Card, CardContent, CardHeader, CardTitle, CardDescription
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import {
    Calendar, Clock, User, Scissors, CheckCircle, AlertCircle, Play, MoreHorizontal
} from "lucide-react";
import {
    getOTs, getSurgeryBookings, updateSurgeryStatus,
    OperationTheater, SurgeryBooking
} from "@/services/otService";
import { format } from "date-fns";
import { toast } from "sonner";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { SurgeryBookingDialog } from "./SurgeryBookingDialog";
import { SurgeryReportModal } from "./SurgeryReportModal";
import { FileText } from "lucide-react";

export const OTStation = () => {
    const [ots, setOTs] = useState<OperationTheater[]>([]);
    const [bookings, setBookings] = useState<SurgeryBooking[]>([]);
    const [loading, setLoading] = useState(true);
    const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
    const [reportModalOpen, setReportModalOpen] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState<SurgeryBooking | null>(null);

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
            toast.error("Failed to load OT data");
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (id: string, status: SurgeryBooking['status']) => {
        try {
            await updateSurgeryStatus(id, status);
            toast.success(`Surgery status updated to ${status}`);
            loadData();
        } catch (e) {
            toast.error("Failed to update status");
        }
    };

    const getStatusBadge = (status: SurgeryBooking['status']) => {
        switch (status) {
            case 'scheduled': return <Badge variant="outline">Scheduled</Badge>;
            case 'pre-op': return <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-100">Pre-Op</Badge>;
            case 'in-surgery': return <Badge variant="default" className="bg-red-500 hover:bg-red-500">In Surgery</Badge>;
            case 'recovery': return <Badge variant="secondary" className="bg-orange-100 text-orange-700 hover:bg-orange-100">Recovery</Badge>;
            case 'completed': return <Badge variant="default" className="bg-green-500 hover:bg-green-500">Completed</Badge>;
            default: return <Badge variant="outline">{status}</Badge>;
        }
    };

    return (
        <div className="h-full flex flex-col space-y-6 p-4">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">OT Station</h1>
                    <p className="text-muted-foreground">Manage operation theaters and surgical schedules.</p>
                </div>
                <Button onClick={() => setBookingDialogOpen(true)}>
                    <Calendar className="w-4 h-4 mr-2" />
                    New Booking
                </Button>
            </div>

            {/* OT Status Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {ots.map(ot => (
                    <Card key={ot.id} className="border-l-4" style={{
                        borderLeftColor: ot.status === 'available' ? '#22c55e' :
                            ot.status === 'occupied' ? '#ef4444' : '#94a3b8'
                    }}>
                        <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle className="text-sm font-medium">{ot.name}</CardTitle>
                                    <CardDescription>{ot.type} OT</CardDescription>
                                </div>
                                <Badge variant={ot.status === 'available' ? 'outline' : 'default'} className={
                                    ot.status === 'available' ? 'text-green-600 border-green-200 bg-green-50' : ''
                                }>
                                    {ot.status.toUpperCase()}
                                </Badge>
                            </div>
                        </CardHeader>
                    </Card>
                ))}
            </div>

            {/* Surgery Schedule */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-slate-500" />
                        Today's Surgery Schedule
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Time</TableHead>
                                <TableHead>Patient</TableHead>
                                <TableHead>Procedure</TableHead>
                                <TableHead>Surgeon</TableHead>
                                <TableHead>OT</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow><TableCell colSpan={7} className="text-center py-8">Loading schedule...</TableCell></TableRow>
                            ) : bookings.length === 0 ? (
                                <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No surgeries scheduled for today.</TableCell></TableRow>
                            ) : (
                                bookings.map(booking => (
                                    <TableRow key={booking.id}>
                                        <TableCell className="font-medium">
                                            {format(new Date(booking.scheduledAt), 'HH:mm')}
                                            <div className="text-xs text-muted-foreground font-normal">{booking.durationMinutes} min</div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-medium">{booking.patientName}</div>
                                            <div className="text-xs text-muted-foreground">ID: {booking.patientId}</div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Scissors className="w-4 h-4 text-slate-400" />
                                                {booking.surgeryName}
                                            </div>
                                        </TableCell>
                                        <TableCell>{booking.surgeon}</TableCell>
                                        <TableCell>{ots.find(o => o.id === booking.otId)?.name || booking.otId}</TableCell>
                                        <TableCell>{getStatusBadge(booking.status)}</TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    {booking.status === 'scheduled' && (
                                                        <DropdownMenuItem onClick={() => handleStatusChange(booking.id, 'pre-op')}>
                                                            <CheckCircle className="w-4 h-4 mr-2" /> Start Pre-Op
                                                        </DropdownMenuItem>
                                                    )}
                                                    {booking.status === 'pre-op' && (
                                                        <DropdownMenuItem onClick={() => handleStatusChange(booking.id, 'in-surgery')}>
                                                            <Play className="w-4 h-4 mr-2" /> Start Surgery
                                                        </DropdownMenuItem>
                                                    )}
                                                    {booking.status === 'in-surgery' && (
                                                        <DropdownMenuItem onClick={() => handleStatusChange(booking.id, 'recovery')}>
                                                            <CheckCircle className="w-4 h-4 mr-2" /> Finish Surgery
                                                        </DropdownMenuItem>
                                                    )}
                                                    {booking.status === 'recovery' && (
                                                        <DropdownMenuItem onClick={() => handleStatusChange(booking.id, 'completed')}>
                                                            <CheckCircle className="w-4 h-4 mr-2" /> Complete Discharge
                                                        </DropdownMenuItem>
                                                    )}
                                                    <DropdownMenuItem onClick={() => {
                                                        setSelectedBooking(booking);
                                                        setReportModalOpen(true);
                                                    }}>
                                                        <FileText className="w-4 h-4 mr-2" /> Post-Op Note
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="text-red-600">
                                                        <AlertCircle className="w-4 h-4 mr-2" /> Cancel Surgery
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <SurgeryBookingDialog
                open={bookingDialogOpen}
                onOpenChange={setBookingDialogOpen}
                onSuccess={loadData}
            />

            <SurgeryReportModal
                open={reportModalOpen}
                onOpenChange={setReportModalOpen}
                booking={selectedBooking}
                onSuccess={loadData}
            />
        </div>
    );
};
