
import { useState } from "react";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, TestTube, FlaskConical } from "lucide-react";
import { OPDVisit, LabRequest } from "@/services/opdService";
import { formatDistanceToNow } from "date-fns";

interface LabQueueProps {
    queue: { visit: OPDVisit, request: LabRequest }[];
    onSelect: (data: { visit: OPDVisit, request: LabRequest }) => void;
    loading: boolean;
}

export const LabQueue = ({ queue, onSelect, loading }: LabQueueProps) => {
    const [search, setSearch] = useState("");

    const filtered = queue.filter(item =>
        item.visit.patientName.toLowerCase().includes(search.toLowerCase()) ||
        item.visit.visitNumber.toLowerCase().includes(search.toLowerCase()) ||
        item.request.testName.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="h-full flex flex-col">
            {/* Toolbar */}
            <div className="p-4 border-b flex justify-between items-center bg-slate-50/50">
                <div className="relative w-64">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search patient or test..."
                        className="pl-8"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
                <div>
                    <Badge variant="outline">
                        {queue.length} Pending Tests
                    </Badge>
                </div>
            </div>

            {/* Table */}
            <div className="flex-1 overflow-auto">
                <Table>
                    <TableHeader className="bg-slate-50 sticky top-0 z-10">
                        <TableRow>
                            <TableHead className="w-[100px]">ID</TableHead>
                            <TableHead>Test Name</TableHead>
                            <TableHead>Patient</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Ordered</TableHead>
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
                                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No pending lab orders.</TableCell>
                            </TableRow>
                        ) : (
                            filtered.map((item) => (
                                <TableRow key={item.request.id} className="hover:bg-slate-50/50 cursor-pointer" onClick={() => onSelect(item)}>
                                    <TableCell className="font-mono text-xs text-muted-foreground">
                                        {item.request.id.slice(-6)}
                                    </TableCell>
                                    <TableCell>
                                        <div className="font-medium text-slate-900">{item.request.testName}</div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                                                <FlaskConical className="w-4 h-4 text-purple-500" />
                                            </div>
                                            <div>
                                                <div className="font-semibold text-slate-900">{item.visit.patientName}</div>
                                                <div className="text-xs text-muted-foreground">{item.visit.visitNumber}</div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={item.request.status === 'sample-collected' ? 'default' : 'secondary'}>
                                            {item.request.status.replace('-', ' ')}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground">
                                        {formatDistanceToNow(new Date(item.request.orderedAt), { addSuffix: true })}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button size="sm" className="bg-purple-600 hover:bg-purple-700" onClick={(e) => { e.stopPropagation(); onSelect(item); }}>
                                            <TestTube className="w-4 h-4 mr-2" />
                                            {item.request.status === 'pending' ? 'Collect Sample' : 'Enter Result'}
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
