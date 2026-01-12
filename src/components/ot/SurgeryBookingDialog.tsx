import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
    OperationTheater, SurgeryBooking,
    getOTs, bookSurgery, mockSurgeons
} from "@/services/otService";
import { toast } from "sonner";
import { Calendar as CalendarIcon, Clock, Scissors, User } from "lucide-react";

interface SurgeryBookingDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    patientDetails?: {
        id: string;
        name: string;
    };
    onSuccess?: () => void;
}

export const SurgeryBookingDialog = ({
    open,
    onOpenChange,
    patientDetails,
    onSuccess
}: SurgeryBookingDialogProps) => {
    const [ots, setOTs] = useState<OperationTheater[]>([]);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        patientId: patientDetails?.id || "",
        patientName: patientDetails?.name || "",
        surgeryName: "",
        surgeon: "",
        anaesthetist: "",
        otId: "",
        scheduledAtDate: new Date().toISOString().split('T')[0],
        scheduledAtTime: "09:00",
        durationMinutes: 60,
        priority: 'routine' as SurgeryBooking['priority'],
        notes: ""
    });

    useEffect(() => {
        if (open) {
            loadOTs();
            if (patientDetails) {
                setFormData(prev => ({
                    ...prev,
                    patientId: patientDetails.id,
                    patientName: patientDetails.name
                }));
            }
        }
    }, [open, patientDetails]);

    const loadOTs = async () => {
        try {
            const data = await getOTs();
            setOTs(data);
        } catch (e) {
            toast.error("Failed to load OTs");
        }
    };

    const handleSubmit = async () => {
        if (!formData.patientName || !formData.surgeryName || !formData.surgeon || !formData.otId) {
            toast.error("Please fill all required fields");
            return;
        }

        setLoading(true);
        try {
            const scheduledAt = new Date(`${formData.scheduledAtDate}T${formData.scheduledAtTime}`).toISOString();

            await bookSurgery({
                patientId: formData.patientId,
                patientName: formData.patientName,
                surgeryName: formData.surgeryName,
                surgeon: formData.surgeon,
                anaesthetist: formData.anaesthetist,
                otId: formData.otId,
                scheduledAt,
                durationMinutes: Number(formData.durationMinutes),
                priority: formData.priority,
                notes: formData.notes
            });

            toast.success("Surgery scheduled successfully");
            onOpenChange(false);
            if (onSuccess) onSuccess();
        } catch (e) {
            toast.error("Failed to book surgery");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Scissors className="w-5 h-5 text-blue-600" />
                        Schedule New Surgery
                    </DialogTitle>
                    <DialogDescription>
                        Fill in the details to book an operation theater and surgical team.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="patientName">Patient Name</Label>
                            <Input
                                id="patientName"
                                value={formData.patientName}
                                onChange={e => setFormData({ ...formData, patientName: e.target.value })}
                                placeholder="Full Name"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="patientId">Patient ID / MRN</Label>
                            <Input
                                id="patientId"
                                value={formData.patientId}
                                onChange={e => setFormData({ ...formData, patientId: e.target.value })}
                                placeholder="MR-2024-XXX"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="surgeryName">Surgery / Procedure Name</Label>
                        <Input
                            id="surgeryName"
                            value={formData.surgeryName}
                            onChange={e => setFormData({ ...formData, surgeryName: e.target.value })}
                            placeholder="e.g. Laparoscopic Appendectomy"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="surgeon">Primary Surgeon</Label>
                            <Select
                                value={formData.surgeon}
                                onValueChange={val => setFormData({ ...formData, surgeon: val })}
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
                        <div className="space-y-2">
                            <Label htmlFor="otId">Operation Theater</Label>
                            <Select
                                value={formData.otId}
                                onValueChange={val => setFormData({ ...formData, otId: val })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select OT" />
                                </SelectTrigger>
                                <SelectContent>
                                    {ots.map(ot => (
                                        <SelectItem key={ot.id} value={ot.id}>{ot.name} ({ot.type})</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="date">Scheduled Date</Label>
                            <Input
                                id="date"
                                type="date"
                                value={formData.scheduledAtDate}
                                onChange={e => setFormData({ ...formData, scheduledAtDate: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="time">Time</Label>
                            <Input
                                id="time"
                                type="time"
                                value={formData.scheduledAtTime}
                                onChange={e => setFormData({ ...formData, scheduledAtTime: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="duration">Est. Duration (min)</Label>
                            <Input
                                id="duration"
                                type="number"
                                value={formData.durationMinutes}
                                onChange={e => setFormData({ ...formData, durationMinutes: Number(e.target.value) })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="notes">Pre-operative Notes / Instructions</Label>
                        <Textarea
                            id="notes"
                            placeholder="Add any specific instructions or requirements..."
                            value={formData.notes}
                            onChange={e => setFormData({ ...formData, notes: e.target.value })}
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={handleSubmit} disabled={loading}>
                        {loading ? "Booking..." : "Confirm Booking"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
