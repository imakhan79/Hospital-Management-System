
import { useState } from "react";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, CreditCard, User } from "lucide-react";
import { OPDVisit, Invoice } from "@/services/opdService";
import { formatDistanceToNow } from "date-fns";

interface BillingQueueProps {
    queue: { visit: OPDVisit, invoice: Invoice }[];
    onSelect: (data: { visit: OPDVisit, invoice: Invoice }) => void;
    loading: boolean;
}

export const BillingQueue = ({ queue, onSelect, loading }: BillingQueueProps) => {
    const [search, setSearch] = useState("");

    const filtered = queue.filter(item =>
        item.visit.patientName.toLowerCase().includes(search.toLowerCase()) ||
        item.visit.visitNumber.toLowerCase().includes(search.toLowerCase()) ||
        item.invoice.id.includes(search)
    );

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'Registration': return 'bg-purple-100 text-purple-700 hover:bg-purple-100';
            case 'Pharmacy': return 'bg-green-100 text-green-700 hover:bg-green-100';
            case 'Consultation': return 'bg-blue-100 text-blue-700 hover:bg-blue-100';
            case 'Lab': return 'bg-orange-100 text-orange-700 hover:bg-orange-100';
            default: return 'bg-slate-100 text-slate-700';
        }
    };

    return (
        <div className="h-full flex flex-col">
            {/* Toolbar */}
            <div className="p-4 border-b flex justify-between items-center bg-slate-50/50">
                <div className="relative w-64">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search patient or invoice..."
                        className="pl-8"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
                <div>
                    <Badge variant="outline">
                        {queue.length} Pending Payments
                    </Badge>
                </div>
            </div>

            {/* Table */}
            <div className="flex-1 overflow-auto">
                <Table>
                    <TableHeader className="bg-slate-50 sticky top-0 z-10">
                        <TableRow>
                            <TableHead className="w-[100px]">Invoice ID</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Patient</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                            <TableHead>Created</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">Loading queue...</TableCell>
                            </TableRow>
                        ) : filtered.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No pending bills.</TableCell>
                            </TableRow>
                        ) : (
                            filtered.map((item) => (
                                <TableRow key={item.invoice.id} className="hover:bg-slate-50/50 cursor-pointer" onClick={() => onSelect(item)}>
                                    <TableCell className="font-mono text-xs text-muted-foreground">
                                        {item.invoice.id}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="secondary" className={getTypeColor(item.invoice.billType)}>
                                            {item.invoice.billType}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                                                <User className="w-4 h-4 text-slate-500" />
                                            </div>
                                            <div>
                                                <div className="font-semibold text-slate-900">{item.visit.patientName}</div>
                                                <div className="text-xs text-muted-foreground">{item.visit.visitNumber}</div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right font-bold font-mono">
                                        ${item.invoice.amount.toFixed(2)}
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground">
                                        {formatDistanceToNow(new Date(item.invoice.generatedAt), { addSuffix: true })}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700" onClick={(e) => { e.stopPropagation(); onSelect(item); }}>
                                            <CreditCard className="w-4 h-4 mr-2" />
                                            Collect
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};
