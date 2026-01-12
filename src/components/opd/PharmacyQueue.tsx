
import { useState } from "react";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Package, Clock } from "lucide-react";
import { OPDVisit, ConsultationRecord } from "@/services/opdService";
import { formatDistanceToNow } from "date-fns";

interface PharmacyQueueProps {
    queue: { visit: OPDVisit, consultation: ConsultationRecord }[];
    onSelect: (data: { visit: OPDVisit, consultation: ConsultationRecord }) => void;
    loading: boolean;
}

export const PharmacyQueue = ({ queue, onSelect, loading }: PharmacyQueueProps) => {
    const [search, setSearch] = useState("");

    const filtered = queue.filter(item =>
        item.visit.patientName.toLowerCase().includes(search.toLowerCase()) ||
        item.visit.visitNumber.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="h-full flex flex-col">
            {/* Toolbar */}
            <div className="p-4 border-b flex justify-between items-center bg-slate-50/50">
                <div className="relative w-64">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search patient..."
                        className="pl-8"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
                <div>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        {queue.length} Pending Prescriptions
                    </Badge>
                </div>
            </div>

            {/* Table */}
            <div className="flex-1 overflow-auto">
                <Table>
                    <TableHeader className="bg-slate-50 sticky top-0 z-10">
                        <TableRow>
                            <TableHead className="w-[100px]">Token</TableHead>
                            <TableHead>Patient</TableHead>
                            <TableHead>Doctor</TableHead>
                            <TableHead>Prescribed</TableHead>
                            <TableHead className="text-center">Items</TableHead>
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
                                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No pending prescriptions.</TableCell>
                            </TableRow>
                        ) : (
                            filtered.map((item) => (
                                <TableRow key={item.consultation.id} className="hover:bg-slate-50/50 cursor-pointer" onClick={() => onSelect(item)}>
                                    <TableCell className="font-medium">
                                        <div className="flex flex-col">
                                            <span className="text-lg font-bold text-green-600">{item.visit.visitNumber}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="font-semibold text-slate-900">{item.visit.patientName}</div>
                                        <div className="text-xs text-muted-foreground">{item.visit.patientId}</div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-sm">{item.visit.doctor}</div>
                                        <div className="text-xs text-muted-foreground">{item.visit.department}</div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1 text-sm text-slate-600">
                                            <Clock className="w-3 h-3" />
                                            {formatDistanceToNow(new Date(item.consultation.completedAt), { addSuffix: true })}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Badge variant="secondary">{item.consultation.prescriptions.length}</Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={(e) => { e.stopPropagation(); onSelect(item); }}>
                                            <Package className="w-4 h-4 mr-2" />
                                            Dispense
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
