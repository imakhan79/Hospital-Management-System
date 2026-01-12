
import { useState, useEffect } from "react";
import {
    Tabs, TabsContent, TabsList, TabsTrigger
} from "@/components/ui/tabs";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
    Activity, TestTube, CheckCircle, Search, FileText
} from "lucide-react";
import {
    getLabQueue, updateLabStatus, LabRequest, OPDVisit
} from "@/services/opdService";
import { useOPD } from "@/contexts/OPDContext";
import { toast } from "sonner";
import { format } from "date-fns";

export const LabStation = () => {
    const { activeVisit, setActiveVisit } = useOPD();
    const [requests, setRequests] = useState<LabRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    // Result Entry State
    const [selectedRequest, setSelectedRequest] = useState<LabRequest | null>(null);
    const [resultText, setResultText] = useState("");
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        loadData();
    }, [activeVisit]);

    const loadData = async () => {
        setLoading(true);
        try {
            const data = await getLabQueue();
            setRequests(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleCollectSample = async (id: string) => {
        try {
            await updateLabStatus(id, 'sample-collected');
            toast.success("Sample Marked as Collected");
            loadData();
        } catch (e) {
            toast.error("Action failed");
        }
    };

    const handleOpenResult = (req: LabRequest) => {
        setSelectedRequest(req);
        setResultText(req.result || "");
    };

    const handleSubmitResult = async () => {
        if (!selectedRequest) return;
        setProcessing(true);
        try {
            await updateLabStatus(selectedRequest.id, 'completed', resultText);
            toast.success("Result Finalized & Published");
            setSelectedRequest(null);
            loadData();
        } catch (e) {
            toast.error("Failed to submit result");
        } finally {
            setProcessing(false);
        }
    };

    const filteredRequests = requests.filter(r =>
        r.testName.toLowerCase().includes(search.toLowerCase()) ||
        r.patientId.includes(search) ||
        r.visitId?.includes(search)
    );

    const pendingRequests = filteredRequests.filter(r => ['pending', 'sample-collected'].includes(r.status));
    const completedRequests = filteredRequests.filter(r => r.status === 'completed');

    return (
        <div className="h-full flex flex-col space-y-4 p-4">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Lab & Diagnostics</h1>
                    <p className="text-muted-foreground">Manage test orders, sample collection, and reporting.</p>
                </div>
                <div className="w-[300px] relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search test or patient..."
                        className="pl-8"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="flex-1 bg-white rounded-xl border shadow-sm overflow-hidden">
                <Tabs defaultValue="pending" className="h-full flex flex-col">
                    <div className="px-4 pt-4 border-b">
                        <TabsList>
                            <TabsTrigger value="pending">Pending Orders ({pendingRequests.length})</TabsTrigger>
                            <TabsTrigger value="completed">Completed ({completedRequests.length})</TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="pending" className="flex-1 overflow-auto p-0 m-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Test Name</TableHead>
                                    <TableHead>Patient ID</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Ordered At</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow><TableCell colSpan={5} className="text-center py-10">Loading...</TableCell></TableRow>
                                ) : pendingRequests.length === 0 ? (
                                    <TableRow><TableCell colSpan={5} className="text-center py-10 text-muted-foreground">No pending requests</TableCell></TableRow>
                                ) : (
                                    pendingRequests.map(req => (
                                        <TableRow key={req.id}>
                                            <TableCell className="font-medium flex items-center gap-2">
                                                <Activity className="w-4 h-4 text-blue-500" />
                                                {req.testName}
                                            </TableCell>
                                            <TableCell>{req.patientId}</TableCell>
                                            <TableCell>
                                                <Badge variant={req.status === 'pending' ? 'secondary' : 'default'}>
                                                    {req.status === 'pending' ? 'Sample Pending' : 'Processing'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>{format(new Date(req.orderedAt), 'PP p')}</TableCell>
                                            <TableCell className="text-right">
                                                {req.status === 'pending' ? (
                                                    <Button size="sm" variant="outline" onClick={() => handleCollectSample(req.id)}>
                                                        <TestTube className="w-4 h-4 mr-2" /> Collect Sample
                                                    </Button>
                                                ) : (
                                                    <Button size="sm" onClick={() => handleOpenResult(req)}>
                                                        <FileText className="w-4 h-4 mr-2" /> Enter Result
                                                    </Button>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TabsContent>

                    <TabsContent value="completed" className="flex-1 overflow-auto p-0 m-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Test Name</TableHead>
                                    <TableHead>Patient ID</TableHead>
                                    <TableHead>Result Summary</TableHead>
                                    <TableHead>Reported At</TableHead>
                                    <TableHead className="text-right">View</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {completedRequests.map(req => (
                                    <TableRow key={req.id}>
                                        <TableCell className="font-medium">{req.testName}</TableCell>
                                        <TableCell>{req.patientId}</TableCell>
                                        <TableCell className="max-w-[200px] truncate text-muted-foreground">{req.result}</TableCell>
                                        <TableCell>{req.reportedAt ? format(new Date(req.reportedAt), 'PP p') : '-'}</TableCell>
                                        <TableCell className="text-right">
                                            <Button size="sm" variant="ghost">View Report</Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TabsContent>
                </Tabs>
            </div>

            {/* Result Entry Dialog */}
            <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Enter Lab Results</DialogTitle>
                        <DialogDescription>
                            {selectedRequest?.testName} for Patient {selectedRequest?.patientId}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Result / Findings</label>
                            <Textarea
                                placeholder="Enter test parameters and values..."
                                className="min-h-[150px]"
                                value={resultText}
                                onChange={e => setResultText(e.target.value)}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setSelectedRequest(null)}>Cancel</Button>
                        <Button onClick={handleSubmitResult} disabled={processing}>
                            {processing ? "Saving..." : "Finalize & Publish"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};
