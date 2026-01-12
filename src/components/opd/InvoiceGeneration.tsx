
import { useState } from "react";
import {
    Card, CardContent, CardHeader, CardTitle, CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
    ArrowLeft, CreditCard, Banknote, Printer, CheckCircle
} from "lucide-react";
import {
    OPDVisit, Invoice, processPayment
} from "@/services/opdService";
import { toast } from "sonner";
import { format } from "date-fns";

interface InvoiceGenerationProps {
    data: { visit: OPDVisit, invoice: Invoice };
    onBack: () => void;
    onComplete: () => void;
}

export const InvoiceGeneration = ({ data, onBack, onComplete }: InvoiceGenerationProps) => {
    const { visit, invoice } = data;
    const [method, setMethod] = useState<'Cash' | 'Card'>('Cash');
    const [loading, setLoading] = useState(false);

    const handlePayment = async () => {
        setLoading(true);
        try {
            await processPayment(invoice.id, method);
            toast.success("Payment Processed Successfully");
            onComplete();
        } catch (e) {
            toast.error("Payment failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-full flex flex-col gap-4 max-w-4xl mx-auto w-full p-4">
            {/* Header */}
            <div className="bg-white p-4 border rounded-lg flex justify-between items-center shadow-sm">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={onBack}>
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">Generate Invoice</h2>
                        <div className="text-sm text-slate-500">
                            Invoice #{invoice.id} • {format(new Date(invoice.generatedAt), 'PP p')}
                        </div>
                    </div>
                </div>
                <div className="text-right">
                    <Badge variant="outline" className="text-lg px-3 py-1 border-blue-200 bg-blue-50 text-blue-700">
                        {invoice.status.toUpperCase()}
                    </Badge>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                {/* Invoice details */}
                <div className="md:col-span-2 space-y-4">
                    <Card>
                        <CardHeader className="bg-slate-50 border-b">
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle>Global Healthcare Center</CardTitle>
                                    <div className="text-sm text-muted-foreground mt-1">
                                        123 Health Layout, City, Country
                                    </div>
                                </div>
                                <div className="text-right text-sm">
                                    <div className="font-bold">{visit.patientName}</div>
                                    <div>ID: {visit.patientId}</div>
                                    <div>Visit: {visit.visitNumber}</div>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <table className="w-full text-sm">
                                <thead className="bg-slate-50 border-b">
                                    <tr>
                                        <th className="p-4 text-left font-semibold">Description</th>
                                        <th className="p-4 text-right font-semibold">Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-b last:border-0">
                                        <td className="p-4">
                                            <div className="font-medium">{invoice.billType} Charges</div>
                                            <div className="text-muted-foreground text-xs mt-1">
                                                {invoice.billType === 'Registration' ? 'OPD Registration Fee' : 'Pharmacy Bill'}
                                            </div>
                                        </td>
                                        <td className="p-4 text-right font-mono text-base">
                                            ${invoice.amount.toFixed(2)}
                                        </td>
                                    </tr>
                                    <tr className="bg-slate-50/50">
                                        <td className="p-4 font-bold text-lg text-right">Total</td>
                                        <td className="p-4 text-right font-bold text-xl text-blue-600">
                                            ${invoice.amount.toFixed(2)}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </CardContent>
                    </Card>
                </div>

                {/* Payment Action */}
                <div className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Payment Method</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <RadioGroup defaultValue="Cash" onValueChange={(v) => setMethod(v as any)}>
                                <div className={`flex items-center space-x-2 border p-3 rounded-lg cursor-pointer ${method === 'Cash' ? 'border-green-500 bg-green-50' : ''}`}>
                                    <RadioGroupItem value="Cash" id="cash" />
                                    <Label htmlFor="cash" className="flex items-center gap-2 cursor-pointer flex-1">
                                        <Banknote className="w-4 h-4 text-green-600" /> Cash
                                    </Label>
                                </div>
                                <div className={`flex items-center space-x-2 border p-3 rounded-lg cursor-pointer ${method === 'Card' ? 'border-blue-500 bg-blue-50' : ''}`}>
                                    <RadioGroupItem value="Card" id="card" />
                                    <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer flex-1">
                                        <CreditCard className="w-4 h-4 text-blue-600" /> Card / Digital
                                    </Label>
                                </div>
                            </RadioGroup>

                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span>Amount Due</span>
                                    <span className="font-bold">${invoice.amount.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm text-muted-foreground">
                                    <span>Items</span>
                                    <span>1</span>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex-col gap-3">
                            <Button
                                className="w-full bg-slate-900 hover:bg-slate-800 h-12 text-lg"
                                onClick={handlePayment}
                                disabled={loading}
                            >
                                {loading ? "Processing..." : `Pay $${invoice.amount.toFixed(2)}`}
                            </Button>
                            <Button variant="outline" className="w-full">
                                <Printer className="w-4 h-4 mr-2" /> Print Bill Only
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    );
};
