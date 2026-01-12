
import { useState } from "react";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Stethoscope, Clock, User } from "lucide-react";
import { OPDVisit } from "@/services/opdService";
import { formatDistanceToNow } from "date-fns";

interface DoctorQueueListProps {
    queue: OPDVisit[];
    onSelect: (visit: OPDVisit) => void;
    loading: boolean;
}

export const DoctorQueueList = ({ queue, onSelect, loading }: DoctorQueueListProps) => {
    const [search, setSearch] = useState("");

    const filteredQueue = queue.filter(p =>
        p.patientName.toLowerCase().includes(search.toLowerCase()) ||
        p.visitNumber.toLowerCase().includes(search.toLowerCase())
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
                <div className="flex gap-4 text-sm font-medium">
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                        Waiting ({queue.filter(q => q.status === 'waiting-queue').length})
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                        Active ({queue.filter(q => ['called', 'in-consultation'].includes(q.status)).length})
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="flex-1 overflow-auto">
                <Table>
                    <TableHeader className="bg-slate-50 sticky top-0 z-10">
                        <TableRow>
                            <TableHead className="w-[100px]">Token</TableHead>
                            <TableHead>Patient Details</TableHead>
                            <TableHead>Wait Time</TableHead>
                            <TableHead>Symptoms / Notes</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">Loading queue...</TableCell>
                            </TableRow>
                        ) : filteredQueue.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No patients waiting.</TableCell>
                            </TableRow>
                        ) : (
                            filteredQueue.map((patient) => (
                                <TableRow key={patient.id} className="hover:bg-slate-50/50 cursor-pointer" onClick={() => onSelect(patient)}>
                                    <TableCell className="font-medium">
                                        <div className="flex flex-col">
                                            <span className="text-lg font-bold text-blue-600">{patient.visitNumber}</span>
                                            <span className="text-xs text-muted-foreground uppercase">{patient.type}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="font-semibold text-slate-900 flex items-center gap-2">
                                            {patient.patientName}
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            {patient.age ? `${patient.age}Y` : ''} {patient.gender ? `/${patient.gender}` : ''} • {patient.patientId}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1 text-sm text-slate-600">
                                            <Clock className="w-3 h-3" />
                                            {patient.time}
                                        </div>
                                    </TableCell>
                                    <TableCell className="max-w-[200px]">
                                        <div className="truncate font-medium">{patient.reasonForVisit || "—"}</div>
                                        <div className="truncate text-xs text-muted-foreground">Priority: {patient.priority}</div>
                                    </TableCell>
                                    <TableCell>
                                        {['called', 'in-consultation'].includes(patient.status) ? (
                                            <Badge className="bg-emerald-500 hover:bg-emerald-600">Active</Badge>
                                        ) : (
                                            <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50">Waiting</Badge>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button size="sm" onClick={(e) => { e.stopPropagation(); onSelect(patient); }}>
                                            <Stethoscope className="w-4 h-4 mr-2" />
                                            {['called', 'in-consultation'].includes(patient.status) ? 'Resume' : 'Consult'}
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
