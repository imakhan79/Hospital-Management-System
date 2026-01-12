
import { useState } from "react";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Stethoscope, Clock, AlertCircle } from "lucide-react";
import { OPDVisit } from "@/services/opdService";
import { formatDistanceToNow } from "date-fns";

interface VitalsQueueListProps {
    queue: OPDVisit[];
    onSelect: (visit: OPDVisit) => void;
    loading: boolean;
}

export const VitalsQueueList = ({ queue, onSelect, loading }: VitalsQueueListProps) => {
    const [search, setSearch] = useState("");
    const [deptFilter, setDeptFilter] = useState("All");

    const filteredQueue = queue.filter(p => {
        const matchesSearch =
            p.patientName.toLowerCase().includes(search.toLowerCase()) ||
            p.visitNumber.toLowerCase().includes(search.toLowerCase());
        const matchesDept = deptFilter === "All" || p.department === deptFilter;
        return matchesSearch && matchesDept;
    });

    const uniqueDepts = Array.from(new Set(queue.map(p => p.department)));

    return (
        <div className="h-full flex flex-col">
            {/* Toolbar */}
            <div className="p-4 border-b flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50/50">
                <div className="flex gap-2 w-full sm:w-auto">
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search Token, Name, MRN..."
                            className="pl-8"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                    <Select value={deptFilter} onValueChange={setDeptFilter}>
                        <SelectTrigger className="w-[180px]">
                            <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
                            <SelectValue placeholder="Department" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="All">All Departments</SelectItem>
                            {uniqueDepts.map(d => (
                                <SelectItem key={d} value={d}>{d}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="text-sm text-muted-foreground font-medium">
                    Total Waiting: <span className="text-blue-600">{queue.length}</span>
                </div>
            </div>

            {/* Table */}
            <div className="flex-1 overflow-auto">
                <Table>
                    <TableHeader className="bg-slate-50 sticky top-0 z-10">
                        <TableRow>
                            <TableHead className="w-[100px]">Token</TableHead>
                            <TableHead>Patient Info</TableHead>
                            <TableHead>Department / Doctor</TableHead>
                            <TableHead>Wait Time</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">Loading...</TableCell>
                            </TableRow>
                        ) : filteredQueue.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No patients in queue</TableCell>
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
                                        <div className="font-semibold text-slate-900">{patient.patientName}</div>
                                        <div className="text-xs text-muted-foreground">{patient.patientId} | {patient.patientPhone}</div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-sm">{patient.department}</div>
                                        <div className="text-xs text-blue-600 font-medium font-bold">Dr. {patient.doctor}</div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1 text-sm text-slate-600">
                                            <Clock className="w-3 h-3" />
                                            {patient.time}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {patient.status === 'vitals-pending' ? (
                                            <Badge variant="default" className="bg-amber-500 hover:bg-amber-600">In Progress</Badge>
                                        ) : (
                                            <Badge variant="secondary">Waiting</Badge>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button size="sm" onClick={(e) => { e.stopPropagation(); onSelect(patient); }}>
                                            <Stethoscope className="w-4 h-4 mr-2" />
                                            {patient.status === 'vitals-pending' ? 'Resume' : 'Start'}
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
