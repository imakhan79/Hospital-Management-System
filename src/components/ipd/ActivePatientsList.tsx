
import { useState, useEffect } from "react";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
    Search, FileText, User, MoreHorizontal
} from "lucide-react";
import { getActivePatients, getBeds, IPDAdmission, Bed } from "@/services/ipdService";
import { IPDPatientChart } from "./IPDPatientChart";

export const ActivePatientsList = () => {
    const [patients, setPatients] = useState<IPDAdmission[]>([]);
    const [beds, setBeds] = useState<Bed[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [selectedAdmissionId, setSelectedAdmissionId] = useState<string | null>(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        const [p, b] = await Promise.all([
            getActivePatients(),
            getBeds('all')
        ]);
        setPatients(p);
        setBeds(b);
        setLoading(false);
    };

    const getBedNumber = (bedId: string) => {
        return beds.find(b => b.id === bedId)?.bedNumber || 'Unknown';
    };

    const filteredPatients = patients.filter(p =>
        p.patientName.toLowerCase().includes(search.toLowerCase()) ||
        p.diagnosis.toLowerCase().includes(search.toLowerCase())
    );

    if (selectedAdmissionId) {
        return (
            <IPDPatientChart
                admissionId={selectedAdmissionId}
                onClose={() => {
                    setSelectedAdmissionId(null);
                    loadData(); // Refresh list on close (in case of discharge)
                }}
            />
        );
    }

    return (
        <div className="space-y-4 h-full flex flex-col">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold">Active Patients</h2>
                    <p className="text-muted-foreground">Currently admitted patients management</p>
                </div>
                <div className="w-[300px] relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search patient name or diagnosis..."
                        className="pl-8"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="rounded-md border flex-1 overflow-auto bg-white">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Patient</TableHead>
                            <TableHead>Bed</TableHead>
                            <TableHead>Doctor</TableHead>
                            <TableHead>Diagnosis</TableHead>
                            <TableHead>Admitted At</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-10">Loading patients...</TableCell>
                            </TableRow>
                        ) : filteredPatients.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">No active patients found.</TableCell>
                            </TableRow>
                        ) : (
                            filteredPatients.map(patient => (
                                <TableRow key={patient.id}>
                                    <TableCell className="font-medium">
                                        <div className="flex flex-col">
                                            <span>{patient.patientName}</span>
                                            <span className="text-xs text-muted-foreground">ID: {patient.patientId}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{getBedNumber(patient.bedId)}</Badge>
                                    </TableCell>
                                    <TableCell>{patient.doctor}</TableCell>
                                    <TableCell className="max-w-[200px] truncate" title={patient.diagnosis}>
                                        {patient.diagnosis}
                                    </TableCell>
                                    <TableCell>
                                        {new Date(patient.admittedAt).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button size="sm" onClick={() => setSelectedAdmissionId(patient.id)}>
                                            <FileText className="w-4 h-4 mr-2" /> Chart
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
