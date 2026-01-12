
import { useState, useEffect } from "react";
import {
    Card, CardContent, CardHeader, CardTitle, CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    ArrowLeft, CheckCircle, Package, AlertTriangle, Pill, Printer
} from "lucide-react";
import {
    OPDVisit, ConsultationRecord, InventoryItem,
    getInventory, dispenseMedicines
} from "@/services/opdService";
import { toast } from "sonner";

interface DispenseScreenProps {
    data: { visit: OPDVisit, consultation: ConsultationRecord };
    onBack: () => void;
    onComplete: () => void;
}

export const DispenseScreen = ({ data, onBack, onComplete }: DispenseScreenProps) => {
    const { visit, consultation } = data;
    const [inventory, setInventory] = useState<InventoryItem[]>([]);
    const [mappedItems, setMappedItems] = useState<any[]>([]);
    const [totalCost, setTotalCost] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const stock = await getInventory();
        setInventory(stock);
        mapPrescriptionToStock(consultation.prescriptions, stock);
    };

    const mapPrescriptionToStock = (prescriptions: any[], stock: InventoryItem[]) => {
        let total = 0;
        const items = prescriptions.map(rx => {
            // Simple fuzzy match or exact match
            const stockItem = stock.find(s => s.drugName.toLowerCase().includes(rx.drugName.toLowerCase()));

            // Estimate Qty based on duration/freq (Mock logic)
            // e.g. "1-0-1" = 2 per day. "5 days" = 10 tablets.
            // For now, let's just assume a fixed quantity or parse simplified string
            const qty = 10; // Mock fixed quantity per Rx line

            // Cost
            const cost = stockItem ? stockItem.unitPrice * qty : 0;
            if (stockItem) total += cost;

            return {
                drugName: rx.drugName,
                dosage: rx.dosage,
                qty,
                stockItem,
                cost,
                available: stockItem ? stockItem.stock >= qty : false
            };
        });
        setMappedItems(items);
        setTotalCost(total);
    };

    const handleDispense = async () => {
        // Validate stock
        if (mappedItems.some(i => !i.available && i.stockItem)) {
            return toast.error("Some items are out of stock");
        }

        setLoading(true);
        try {
            await dispenseMedicines({
                visitId: visit.id,
                patientId: visit.patientId,
                items: mappedItems.map(i => ({
                    drugName: i.stockItem?.drugName || i.drugName,
                    quantity: i.qty,
                    cost: i.cost
                })),
                totalCost,
                paymentStatus: 'pending'
            });
            toast.success("Medicines Dispensed Successfully");
            onComplete();
        } catch (e) {
            toast.error("Dispensing failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-full flex flex-col gap-4">
            {/* Header */}
            <div className="bg-white p-4 border-b flex justify-between items-center shadow-sm">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={onBack}>
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">Pharmacy Dispensing</h2>
                        <div className="text-sm text-slate-500">
                            Rx for <span className="font-semibold text-slate-900">{visit.patientName}</span> ({visit.visitNumber})
                        </div>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-sm font-medium">Dr. {visit.doctor}</div>
                    <div className="text-xs text-muted-foreground">{visit.department}</div>
                </div>
            </div>

            <div className="flex-1 overflow-auto grid lg:grid-cols-3 gap-6 p-4">
                {/* Left: Rx List */}
                <div className="lg:col-span-2 space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Pill className="w-5 h-5 text-blue-600" /> Prescription Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {mappedItems.map((item, idx) => (
                                    <div key={idx} className="flex justify-between items-start p-3 bg-slate-50 rounded border">
                                        <div>
                                            <div className="font-semibold text-lg">{item.drugName}</div>
                                            <div className="text-sm text-muted-foreground">{item.dosage} • {item.qty} units needed</div>
                                            {item.stockItem ? (
                                                <div className="text-xs text-green-600 flex items-center gap-1 mt-1">
                                                    <CheckCircle className="w-3 h-3" /> In Stock ({item.stockItem.stock} available)
                                                    <span className="text-slate-400">|</span>
                                                    <span>${item.stockItem.unitPrice}/unit</span>
                                                </div>
                                            ) : (
                                                <div className="text-xs text-red-500 flex items-center gap-1 mt-1">
                                                    <AlertTriangle className="w-3 h-3" /> Not in Inventory
                                                </div>
                                            )}
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold text-lg">${item.cost.toFixed(2)}</div>
                                            {!item.available && item.stockItem && (
                                                <Badge variant="destructive">Out of Stock</Badge>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right: Summary & Action */}
                <div className="space-y-4">
                    <Card className="bg-slate-900 text-white border-slate-800">
                        <CardHeader>
                            <CardTitle>Bill Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-400">Total Items</span>
                                <span>{mappedItems.length}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-400">Service Fee</span>
                                <span>$0.00</span>
                            </div>
                            <div className="border-t border-slate-700 pt-4 flex justify-between text-xl font-bold">
                                <span>Total to Pay</span>
                                <span>${totalCost.toFixed(2)}</span>
                            </div>
                        </CardContent>
                        <CardFooter className="flex-col gap-3">
                            <Button
                                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold h-12"
                                onClick={handleDispense}
                                disabled={loading || totalCost === 0}
                            >
                                {loading ? "Processing..." : "Confirm & Dispense"}
                            </Button>
                            <Button variant="outline" className="w-full text-slate-900 bg-white hover:bg-slate-100">
                                <Printer className="w-4 h-4 mr-2" /> Print Invoice
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    );
};
