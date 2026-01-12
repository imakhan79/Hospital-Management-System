
import { useState, useEffect } from "react";
import {
    Card, CardContent, CardHeader, CardTitle, CardDescription
} from "@/components/ui/card";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Bed, User, UserPlus, Sparkles, AlertTriangle, MonitorPlay
} from "lucide-react";
import {
    getWards, getBeds, markBedClean, Ward, Bed as BedType
} from "@/services/ipdService";
import { IPDPatientChart } from "./IPDPatientChart";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const BedManagement = () => {
    const [wards, setWards] = useState<Ward[]>([]);
    const [beds, setBeds] = useState<BedType[]>([]);
    const [selectedWard, setSelectedWard] = useState<string>("all");
    const [selectedAdmissionId, setSelectedAdmissionId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        loadBeds();
    }, [selectedWard]);

    const loadData = async () => {
        const w = await getWards();
        setWards(w);
    };

    const loadBeds = async () => {
        setLoading(true);
        try {
            const b = await getBeds(selectedWard);
            setBeds(b);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleCleanBed = async (bedId: string) => {
        await markBedClean(bedId);
        toast.success("Bed marked as Clean & Available");
        loadBeds();
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'available': return 'bg-green-100 border-green-200 text-green-700 hover:bg-green-200';
            case 'occupied': return 'bg-red-50 border-red-200 text-red-700'; // No hover
            case 'cleaning': return 'bg-amber-100 border-amber-200 text-amber-700 hover:bg-amber-200';
            case 'maintenance': return 'bg-slate-100 border-slate-200 text-slate-500';
            default: return 'bg-slate-50 border-slate-200';
        }
    };

    if (selectedAdmissionId) {
        return (
            <IPDPatientChart
                admissionId={selectedAdmissionId}
                onClose={() => {
                    setSelectedAdmissionId(null);
                    loadBeds(); // Refresh bed status
                }}
            />
        );
    }

    return (
        <div className="space-y-6 h-full flex flex-col">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold">Bed Management</h2>
                    <p className="text-muted-foreground">Real-time bed availability and status tracking</p>
                </div>
                <div className="w-[250px]">
                    <Select value={selectedWard} onValueChange={setSelectedWard}>
                        <SelectTrigger>
                            <SelectValue placeholder="Filter by Ward" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Wards</SelectItem>
                            {wards.map(w => (
                                <SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-4 gap-4">
                <Card className="bg-green-50 border-green-100">
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <div className="text-2xl font-bold text-green-700">{beds.filter(b => b.status === 'available').length}</div>
                            <div className="text-sm font-medium text-green-600">Available</div>
                        </div>
                        <Bed className="w-8 h-8 text-green-300" />
                    </CardContent>
                </Card>
                <Card className="bg-red-50 border-red-100">
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <div className="text-2xl font-bold text-red-700">{beds.filter(b => b.status === 'occupied').length}</div>
                            <div className="text-sm font-medium text-red-600">Occupied</div>
                        </div>
                        <User className="w-8 h-8 text-red-300" />
                    </CardContent>
                </Card>
                <Card className="bg-amber-50 border-amber-100">
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <div className="text-2xl font-bold text-amber-700">{beds.filter(b => b.status === 'cleaning').length}</div>
                            <div className="text-sm font-medium text-amber-600">Cleaning</div>
                        </div>
                        <Sparkles className="w-8 h-8 text-amber-300" />
                    </CardContent>
                </Card>
                <Card className="bg-slate-50 border-slate-100">
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <div className="text-2xl font-bold text-slate-700">{beds.filter(b => b.status === 'maintenance').length}</div>
                            <div className="text-sm font-medium text-slate-600">Maintenance</div>
                        </div>
                        <AlertTriangle className="w-8 h-8 text-slate-300" />
                    </CardContent>
                </Card>
            </div>

            {/* Grid */}
            <div className="flex-1 overflow-auto bg-white p-4 rounded-lg border">
                {loading ? (
                    <div className="text-center py-20 text-muted-foreground">Loading beds configuration...</div>
                ) : beds.length === 0 ? (
                    <div className="text-center py-20 text-muted-foreground">No beds found in selected ward.</div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                        {beds.map(bed => (
                            <div
                                key={bed.id}
                                className={cn(
                                    "relative aspect-square rounded-xl border-2 flex flex-col items-center justify-center p-4 transition-all hover:shadow-md group",
                                    getStatusColor(bed.status)
                                )}
                            >
                                {/* Bed Icon */}
                                {bed.type === 'icu' && <MonitorPlay className="w-4 h-4 absolute top-2 right-2 opacity-50" />}
                                <Bed className={cn(
                                    "w-10 h-10 mb-2",
                                    bed.status === 'cleaning' && "animate-pulse"
                                )} />

                                <div className="font-bold text-lg">{bed.bedNumber}</div>
                                <div className="text-xs uppercase font-medium tracking-wide opacity-75">{bed.type}</div>

                                {bed.status === 'occupied' && (
                                    <div className="mt-2 text-xs font-medium bg-white/50 px-2 py-1 rounded inline-block text-center">
                                        Patient Admitted
                                    </div>
                                )}

                                {/* Hover Action Overlay */}
                                <div className="absolute inset-0 bg-black/5 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl">
                                    {bed.status === 'cleaning' && (
                                        <Button size="sm" variant="secondary" className="bg-white hover:bg-white text-amber-700 shadow-sm" onClick={() => handleCleanBed(bed.id)}>
                                            <Sparkles className="w-4 h-4 mr-2" /> Mark Clean
                                        </Button>
                                    )}
                                    {bed.status === 'available' && (
                                        <Button size="sm" variant="secondary" className="bg-white hover:bg-white text-green-700 shadow-sm" disabled>
                                            <UserPlus className="w-4 h-4 mr-2" /> Admit
                                        </Button>
                                    )}
                                    {bed.status === 'occupied' && (
                                        <Button size="sm" variant="secondary" className="bg-white hover:bg-white text-red-700 shadow-sm" onClick={() => bed.admissionId && setSelectedAdmissionId(bed.admissionId)}>
                                            View Chart
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
