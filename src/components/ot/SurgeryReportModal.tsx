import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
    SurgeryBooking, SurgeryNote,
    addSurgeryNote, updateSurgeryStatus
} from "@/services/otService";
import { toast } from "sonner";
import { FileText, ClipboardList, CheckCircle } from "lucide-react";

interface SurgeryReportModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    booking: SurgeryBooking | null;
    onSuccess?: () => void;
}

export const SurgeryReportModal = ({
    open,
    onOpenChange,
    booking,
    onSuccess
}: SurgeryReportModalProps) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        procedurePerformed: "",
        findings: "",
        outcome: "",
        postOpOrders: ""
    });

    useEffect(() => {
        if (booking) {
            setFormData({
                procedurePerformed: booking.surgeryName,
                findings: "",
                outcome: "Successful",
                postOpOrders: ""
            });
        }
    }, [booking]);

    const handleSubmit = async () => {
        if (!booking) return;
        if (!formData.procedurePerformed || !formData.findings) {
            toast.error("Please fill in the procedure and findings");
            return;
        }

        setLoading(true);
        try {
            await addSurgeryNote({
                bookingId: booking.id,
                surgeon: booking.surgeon,
                procedurePerformed: formData.procedurePerformed,
                findings: formData.findings,
                outcome: formData.outcome,
                postOpOrders: formData.postOpOrders
            });

            // Automatically transition status to completed if it's currently in recovery
            if (booking.status === 'recovery' || booking.status === 'in-surgery') {
                await updateSurgeryStatus(booking.id, 'completed');
            }

            toast.success("Surgery report finalized");
            onOpenChange(false);
            if (onSuccess) onSuccess();
        } catch (e) {
            toast.error("Failed to save surgery report");
        } finally {
            setLoading(false);
        }
    };

    if (!booking) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[700px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <ClipboardList className="w-5 h-5 text-emerald-600" />
                        Surgery Report & Post-Op Notes
                    </DialogTitle>
                    <DialogDescription>
                        Documentation for {booking.patientName} - {booking.surgeryName}
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-6 py-4">
                    <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3 rounded-lg border border-slate-200 text-sm">
                        <div>
                            <span className="text-muted-foreground">Patient:</span>
                            <div className="font-semibold">{booking.patientName} ({booking.patientId})</div>
                        </div>
                        <div>
                            <span className="text-muted-foreground">Surgeon:</span>
                            <div className="font-semibold">{booking.surgeon}</div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="procedure">Procedure Performed</Label>
                        <Input
                            id="procedure"
                            value={formData.procedurePerformed}
                            onChange={e => setFormData({ ...formData, procedurePerformed: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="findings">Intra-operative Findings</Label>
                            <Textarea
                                id="findings"
                                className="min-h-[120px]"
                                placeholder="Describe findings during the procedure..."
                                value={formData.findings}
                                onChange={e => setFormData({ ...formData, findings: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="outcome">Surgical Outcome</Label>
                            <SelectInput
                                value={formData.outcome}
                                onChange={(val: string) => setFormData({ ...formData, outcome: val })}
                                options={[
                                    "Successful",
                                    "Complicated",
                                    "Partially Successful",
                                    "Unsuccessful"
                                ]}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="orders">Post-operative Orders / Instructions</Label>
                        <Textarea
                            id="orders"
                            className="min-h-[100px]"
                            placeholder="Immediate post-op care, medications, and monitoring instructions..."
                            value={formData.postOpOrders}
                            onChange={e => setFormData({ ...formData, postOpOrders: e.target.value })}
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
                    <Button onClick={handleSubmit} disabled={loading} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        {loading ? "Finalizing..." : "Finalize Report"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

// Simple helper for selection without complex logic here
const SelectInput = ({ value, onChange, options }: { value: string, onChange: any, options: string[] }) => (
    <div className="flex flex-col gap-2">
        <select
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={value}
            onChange={(e) => onChange(e.target.value)}
        >
            {options.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
            ))}
        </select>
    </div>
);
