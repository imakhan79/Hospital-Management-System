
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, Pill } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PharmacyQueue } from "./PharmacyQueue";
import { DispenseScreen } from "./DispenseScreen";
import {
    OPDVisit, ConsultationRecord, getPharmacyQueue, getInventory, InventoryItem
} from "@/services/opdService";
import { useOPD } from "@/contexts/OPDContext";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { format } from "date-fns";

export const PharmacyStation = () => {
    const { activeVisit, setActiveVisit } = useOPD();
    const [activeTab, setActiveTab] = useState("queue");
    const [queue, setQueue] = useState<{ visit: OPDVisit, consultation: ConsultationRecord }[]>([]);
    const [inventory, setInventory] = useState<InventoryItem[]>([]);
    const [selectedData, setSelectedData] = useState<{ visit: OPDVisit, consultation: ConsultationRecord } | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchData();
        // If we have an active visit, check if it's in the pharmacy queue
        if (activeVisit) {
            checkActiveVisitInQueue();
        }
    }, [activeTab, activeVisit]);

    const checkActiveVisitInQueue = async () => {
        const q = await getPharmacyQueue();
        const found = q.find(item => item.visit.id === activeVisit?.id);
        if (found) {
            setSelectedData(found);
        }
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            if (activeTab === 'queue') {
                const q = await getPharmacyQueue();
                setQueue(q);
            } else if (activeTab === 'inventory') {
                const inv = await getInventory();
                setInventory(inv);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    if (selectedData) {
        return (
            <DispenseScreen
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
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Pharmacy</h1>
                    <p className="text-muted-foreground">Manage prescriptions and inventory.</p>
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
                            <TabsTrigger value="queue">Dispensing Queue</TabsTrigger>
                            <TabsTrigger value="inventory">Inventory</TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="queue" className="flex-1 overflow-hidden p-0 m-0">
                        <PharmacyQueue
                            queue={queue}
                            onSelect={setSelectedData}
                            loading={loading}
                        />
                    </TabsContent>

                    <TabsContent value="inventory" className="flex-1 overflow-auto p-4 m-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Drug Name</TableHead>
                                    <TableHead>Batch No</TableHead>
                                    <TableHead>Expiry</TableHead>
                                    <TableHead className="text-right">Unit Price</TableHead>
                                    <TableHead className="text-right">Stock Level</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {inventory.map(item => (
                                    <TableRow key={item.id}>
                                        <TableCell className="font-medium flex items-center gap-2">
                                            <Pill className="w-4 h-4 text-slate-400" /> {item.drugName}
                                        </TableCell>
                                        <TableCell>{item.batchNo}</TableCell>
                                        <TableCell>{format(new Date(item.expiryDate), 'MMM yyyy')}</TableCell>
                                        <TableCell className="text-right">${item.unitPrice.toFixed(2)}</TableCell>
                                        <TableCell className="text-right">
                                            <span className={`font-bold ${item.stock < 100 ? 'text-red-500' : 'text-slate-900'}`}>
                                                {item.stock}
                                            </span>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};
