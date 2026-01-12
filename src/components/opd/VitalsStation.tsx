
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, Users, ClipboardList, RefreshCw } from "lucide-react";
import { VitalsQueueList } from "./VitalsQueueList";
import { VitalsCaptureForm } from "./VitalsCaptureForm";
import { OPDVisit, getVitalsQueue, updateVisitStatus } from "@/services/opdService";
import { useOPD } from "@/contexts/OPDContext";
import { toast } from "sonner";

export const VitalsStation = () => {
    const { activeVisit, setActiveVisit } = useOPD();
    const [activeTab, setActiveTab] = useState<"queue" | "capture">("queue");
    const [queue, setQueue] = useState<OPDVisit[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (activeVisit && activeVisit.status === 'vitals-pending') {
            setActiveTab("capture");
        }
    }, [activeVisit]);

    // Auto-refresh queue every 30s
    useEffect(() => {
        fetchQueue();
        const interval = setInterval(fetchQueue, 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchQueue = async () => {
        setLoading(true);
        try {
            const data = await getVitalsQueue();
            setQueue(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectPatient = async (visit: OPDVisit) => {
        if (visit.status === 'checked-in') {
            try {
                await updateVisitStatus(visit.id, 'vitals-pending');
                visit.status = 'vitals-pending';
            } catch (e) {
                toast.error("Failed to update status");
                return;
            }
        }

        setActiveVisit(visit);
        setActiveTab("capture");
    };

    const handleBackToQueue = () => {
        // We don't necessarily clear activeVisit here if we want the workflow bar to stay
        setActiveTab("queue");
        fetchQueue();
    };

    return (
        <div className="h-full flex flex-col space-y-4 p-4">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">OPD Vitals Station</h1>
                    <p className="text-muted-foreground">Manage patient vitals queue and capture vital signs.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={fetchQueue} disabled={loading}>
                        <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button>
                </div>
            </div>

            <div className="flex-1 bg-white rounded-xl border shadow-sm overflow-hidden">
                {activeTab === 'queue' && (
                    <VitalsQueueList
                        queue={queue}
                        onSelect={handleSelectPatient}
                        loading={loading}
                    />
                )}

                {activeTab === 'capture' && activeVisit && (
                    <VitalsCaptureForm
                        patient={activeVisit}
                        onBack={handleBackToQueue}
                        onComplete={() => {
                            toast.success("Vitals captured successfully");
                            handleBackToQueue();
                        }}
                    />
                )}
            </div>
        </div>
    );
};
