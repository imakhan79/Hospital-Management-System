
import { useState, useEffect } from "react";
import {
    Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import {
    calculateDischargeSummary, finalizeDischarge, DischargeSummary
} from "@/services/ipdService";
import { toast } from "sonner";
import { Loader2, FileCheck, Banknote } from "lucide-react";

interface Props {
    admissionId: string;
    isOpen: boolean;
    onClose: () => void;
    onDischargeComplete: () => void;
}

export const DischargeModal = ({ admissionId, isOpen, onClose, onDischargeComplete }: Props) => {
    const [summary, setSummary] = useState<DischargeSummary | null>(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        if (isOpen && admissionId) {
            loadSummary();
        }
    }, [isOpen, admissionId]);

    const loadSummary = async () => {
        setLoading(true);
        try {
            const data = await calculateDischargeSummary(admissionId);
            setSummary(data);
        } catch (e) {
            toast.error("Failed to calculate discharge summary");
            onClose();
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmDischarge = async () => {
        setProcessing(true);
        try {
            await finalizeDischarge(admissionId);
            toast.success("Patient Discharged & Final Bill Generated");
            onDischargeComplete();
        } catch (e) {
            toast.error("Discharge failed");
        } finally {
            setProcessing(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Discharge Summary</DialogTitle>
                    <DialogDescription>
                        Review final charges before discharging the patient.
                    </DialogDescription>
                </DialogHeader>

                {loading ? (
                    <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>
                ) : summary ? (
                    <div className="space-y-4">
                        <div className="bg-slate-50 p-3 rounded-md border text-sm space-y-1">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Patient:</span>
                                <span className="font-medium">{summary.patientName}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Admitted:</span>
                                <span>{new Date(summary.admissionDate).toLocaleDateString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Discharge:</span>
                                <span>{new Date(summary.dischargeDate).toLocaleDateString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Total Stay:</span>
                                <span className="font-bold">{summary.totalDays} Days</span>
                            </div>
                        </div>

                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Description</TableHead>
                                    <TableHead className="text-right">Amount</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow>
                                    <TableCell>
                                        Bed Charges ({summary.totalDays} days @ {summary.bedChargePerDay}/day)
                                    </TableCell>
                                    <TableCell className="text-right">{summary.totalBedCharges}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Nursing & Service Charges</TableCell>
                                    <TableCell className="text-right">{summary.otherCharges}</TableCell>
                                </TableRow>
                                <TableRow className="font-bold bg-slate-50">
                                    <TableCell>Total Payable</TableCell>
                                    <TableCell className="text-right text-lg">₹{summary.totalAmount}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>
                ) : (
                    <div className="text-red-500 text-center">Error loading summary</div>
                )}

                <DialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={processing}>Cancel</Button>
                    <Button onClick={handleConfirmDischarge} disabled={processing || !summary}>
                        {processing ? (
                            <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processing...</>
                        ) : (
                            <><Banknote className="w-4 h-4 mr-2" /> Confirm & Discharge</>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
