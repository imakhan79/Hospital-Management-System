
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { DoctorQueueList } from "./DoctorQueueList";
import { DoctorConsultation } from "./DoctorConsultation";
import { OPDVisit, getDoctorQueue, updateVisitStatus } from "@/services/opdService";
import { useOPD } from "@/contexts/OPDContext";
import { toast } from "sonner";

export const DoctorStation = () => {
    const { activeVisit, setActiveVisit } = useOPD();
    const [activeTab, setActiveTab] = useState<"queue" | "consultation">("queue");
    const [queue, setQueue] = useState<OPDVisit[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (activeVisit && (activeVisit.status === 'called' || activeVisit.status === 'in-consultation')) {
            setActiveTab("consultation");
        }
    }, [activeVisit]);

    // Auto-refresh 
    useEffect(() => {
        fetchQueue();
        const interval = setInterval(fetchQueue, 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchQueue = async () => {
        setLoading(true);
        try {
            // In real app, pass current doctor ID here
            const data = await getDoctorQueue();
            setQueue(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleStartConsultation = async (visit: OPDVisit) => {
        try {
            if (visit.status === 'waiting-queue') {
                await updateVisitStatus(visit.id, 'called');
                visit.status = 'called';
            }
            setActiveVisit(visit);
            setActiveTab("consultation");
        } catch (e) {
            toast.error("Failed to start consultation");
        }
    };

    return (
        <div className="h-full flex flex-col space-y-4 p-4">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Doctor's Desk</h1>
                    <p className="text-muted-foreground">Manage appointments and patient consultations.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={fetchQueue} disabled={loading}>
                        <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                        Refresh Queue
                    </Button>
                </div>
            </div>

            <div className="flex-1 bg-white rounded-xl border shadow-sm overflow-hidden">
                {activeTab === 'queue' && (
                    <DoctorQueueList
                        queue={queue}
                        onSelect={handleStartConsultation}
                        loading={loading}
                    />
                )}

                {activeTab === 'consultation' && activeVisit && (
                    <DoctorConsultation
                        patient={activeVisit}
                        onBack={() => { setActiveTab('queue'); fetchQueue(); }}
                        onComplete={() => {
                            toast.success("Consultation Completed");
                            setActiveTab('queue');
                            // We keep activeVisit for a moment so the bar shows next step (billing/pharmacy)
                            fetchQueue();
                        }}
                    />
                )}
            </div>
        </div>
    );
};
