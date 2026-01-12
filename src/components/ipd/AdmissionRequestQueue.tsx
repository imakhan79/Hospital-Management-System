
import { useState, useEffect } from "react";
import {
    Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle
} from "@/components/ui/dialog";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { UserPlus, Clock, AlertCircle } from "lucide-react";
import {
    getAdmissionRequests, getBeds, getWards, assignBedToRequest,
    AdmissionRequest, Bed, Ward
} from "@/services/ipdService";
import { toast } from "sonner";

export const AdmissionRequestQueue = () => {
    const [requests, setRequests] = useState<AdmissionRequest[]>([]);
    const [loading, setLoading] = useState(true);

    // Assignment Dialog State
    const [selectedRequest, setSelectedRequest] = useState<AdmissionRequest | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [wards, setWards] = useState<Ward[]>([]);
    const [availableBeds, setAvailableBeds] = useState<Bed[]>([]);
    const [selectedWard, setSelectedWard] = useState<string>("");
    const [selectedBed, setSelectedBed] = useState<string>("");
    const [assigning, setAssigning] = useState(false);

    useEffect(() => {
        loadRequests();
        loadWards();
    }, []);

    useEffect(() => {
        if (selectedWard) {
            loadAvailableBeds(selectedWard);
        } else {
            setAvailableBeds([]);
        }
    }, [selectedWard]);

    const loadRequests = async () => {
        setLoading(true);
        const data = await getAdmissionRequests();
        setRequests(data);
        setLoading(false);
    };

    const loadWards = async () => {
        const w = await getWards();
        setWards(w);
    };

    const loadAvailableBeds = async (wardId: string) => {
        const beds = await getBeds(wardId);
        setAvailableBeds(beds.filter(b => b.status === 'available'));
    };

    const handleOpenAssign = (req: AdmissionRequest) => {
        setSelectedRequest(req);
        setSelectedWard(""); // Reset selection
        setSelectedBed("");
        setIsDialogOpen(true);
    };

    const handleAssign = async () => {
        if (!selectedRequest || !selectedBed) return;

        setAssigning(true);
        try {
            await assignBedToRequest(selectedRequest.id, selectedBed);
            toast.success(`Patient ${selectedRequest.patientName} assigned to bed.`);
            setIsDialogOpen(false);
            loadRequests(); // Refresh queue
        } catch (e) {
            toast.error("Failed to assign bed");
            console.error(e);
        } finally {
            setAssigning(false);
        }
    };

    const getPriorityColor = (p: string) => {
        switch (p) {
            case 'emergency': return 'bg-red-100 text-red-800 hover:bg-red-100';
            case 'urgent': return 'bg-orange-100 text-orange-800 hover:bg-orange-100';
            default: return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
        }
    };

    if (loading) return <div>Loading requests...</div>;

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold">Admission Requests</h2>
                <p className="text-muted-foreground">Patients waiting for bed assignment</p>
            </div>

            {requests.length === 0 ? (
                <div className="text-center py-12 border rounded-lg bg-slate-50">
                    <UserPlus className="h-12 w-12 mx-auto text-slate-300 mb-4" />
                    <h3 className="text-lg font-medium text-slate-900">No Pending Requests</h3>
                    <p className="text-slate-500">All patients have been assigned beds.</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {requests.map(req => (
                        <Card key={req.id}>
                            <CardHeader className="pb-2">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle>{req.patientName}</CardTitle>
                                        <CardDescription>{req.age} / {req.gender}</CardDescription>
                                    </div>
                                    <Badge className={getPriorityColor(req.priority)}>
                                        {req.priority.toUpperCase()}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-2 pb-2">
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div className="flex items-center text-muted-foreground">
                                        <span className="font-medium mr-2 text-foreground">Department:</span> {req.department}
                                    </div>
                                    <div className="flex items-center text-muted-foreground">
                                        <span className="font-medium mr-2 text-foreground">Doctor:</span> {req.doctor}
                                    </div>
                                    <div className="col-span-2 flex items-center text-muted-foreground">
                                        <span className="font-medium mr-2 text-foreground">Diagnosis:</span> {req.diagnosis}
                                    </div>
                                    <div className="col-span-2 flex items-center text-orange-600 text-xs">
                                        <Clock className="w-3 h-3 mr-1" /> Requested: {new Date(req.requestedAt).toLocaleString()}
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button className="w-full" onClick={() => handleOpenAssign(req)}>
                                    <UserPlus className="w-4 h-4 mr-2" /> Assign Bed
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}

            {/* Bed Assignment Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Assign Bed for {selectedRequest?.patientName}</DialogTitle>
                        <DialogDescription>
                            Select a ward to check availability.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Select Ward</label>
                            <Select value={selectedWard} onValueChange={setSelectedWard}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Choose a ward" />
                                </SelectTrigger>
                                <SelectContent>
                                    {wards.map(w => (
                                        <SelectItem key={w.id} value={w.id}>{w.name} ({w.type})</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {selectedWard && (
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Available Beds</label>
                                <Select value={selectedBed} onValueChange={setSelectedBed}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a bed" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {availableBeds.length === 0 ? (
                                            <div className="p-2 text-sm text-center text-muted-foreground">No available beds in this ward</div>
                                        ) : (
                                            availableBeds.map(b => (
                                                <SelectItem key={b.id} value={b.id}>
                                                    {b.bedNumber} ({b.type}) - ₹{b.pricePerDay}/day
                                                </SelectItem>
                                            ))
                                        )}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        {availableBeds.length === 0 && selectedWard && (
                            <div className="flex items-center p-3 text-sm text-amber-800 bg-amber-50 rounded-md">
                                <AlertCircle className="w-4 h-4 mr-2" />
                                No beds available in this ward. Please select another ward or discharge a patient.
                            </div>
                        )}
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleAssign} disabled={!selectedBed || assigning}>
                            {assigning ? 'Assigning...' : 'Confirm Assignment'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};
