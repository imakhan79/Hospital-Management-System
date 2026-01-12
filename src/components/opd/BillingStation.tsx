
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, Receipt } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BillingQueue } from "./BillingQueue";
import { InvoiceGeneration } from "./InvoiceGeneration";
import {
    OPDVisit, Invoice, getBillingQueue
} from "@/services/opdService";
import { useOPD } from "@/contexts/OPDContext";

export const BillingStation = () => {
    const { activeVisit, setActiveVisit } = useOPD();
    const [activeTab, setActiveTab] = useState("pending");
    const [queue, setQueue] = useState<{ visit: OPDVisit, invoice: Invoice }[]>([]);
    const [selectedData, setSelectedData] = useState<{ visit: OPDVisit, invoice: Invoice } | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchData();
        // If we have an active visit, check if it's in the billing queue
        if (activeVisit) {
            checkActiveVisitInQueue();
        }
    }, [activeTab, activeVisit]);

    const checkActiveVisitInQueue = async () => {
        const q = await getBillingQueue();
        // Find if any invoice in the queue belongs to our active visit
        const found = q.find(item => item.visit.id === activeVisit?.id);
        if (found) {
            setSelectedData(found);
        }
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            if (activeTab === 'pending') {
                const q = await getBillingQueue();
                setQueue(q as any);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    if (selectedData) {
        return (
            <InvoiceGeneration
                data={selectedData}
                onBack={() => setSelectedData(null)}
                onComplete={() => {
                    setSelectedData(null);
                    fetchData();
                }}
            />
        );
    }

    return (
        <div className="h-full flex flex-col space-y-4 p-4">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Billing & Cashier</h1>
                    <p className="text-muted-foreground">Manage invoices, payments, and receipts.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={fetchData} disabled={loading}>
                        <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button>
                </div>
            </div>

            <div className="flex-1 bg-white rounded-xl border shadow-sm overflow-hidden">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
                    <div className="px-4 pt-4 border-b">
                        <TabsList>
                            <TabsTrigger value="pending">Pending Invoices</TabsTrigger>
                            <TabsTrigger value="history">Payment History</TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="pending" className="flex-1 overflow-hidden p-0 m-0">
                        <BillingQueue
                            queue={queue}
                            onSelect={setSelectedData}
                            loading={loading}
                        />
                    </TabsContent>

                    <TabsContent value="history" className="flex-1 p-8 text-center text-muted-foreground">
                        <div className="flex flex-col items-center justify-center h-full gap-4">
                            <Receipt className="w-12 h-12 text-slate-200" />
                            <p>Payment History module coming soon.</p>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};
