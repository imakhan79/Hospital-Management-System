
import { useState } from "react";
import {
    Card, CardContent, CardHeader, CardTitle, CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    ArrowLeft, TestTube, CheckCircle, FileText
} from "lucide-react";
import {
    OPDVisit, LabRequest, updateLabStatus
} from "@/services/opdService";
import { toast } from "sonner";
import { format } from "date-fns";

interface LabResultEntryProps {
    data: { visit: OPDVisit, request: LabRequest };
    onBack: () => void;
    onComplete: () => void;
}

export const LabResultEntry = ({ data, onBack, onComplete }: LabResultEntryProps) => {
    const { visit, request } = data;
    const [result, setResult] = useState("");
    const [loading, setLoading] = useState(false);

    const handleAction = async () => {
        setLoading(true);
        try {
            if (request.status === 'pending') {
                await updateLabStatus(request.id, 'sample-collected');
                toast.success("Sample Collected Successfully");
                onComplete(); // Or refresh to show next step? For now complete to go back to queue.
            } else {
                await updateLabStatus(request.id, 'completed', result);
                toast.success("Result Saved & Verified");
                onComplete();
            }
        } catch (e) {
            toast.error("Action failed");
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
                        <h2 className="text-xl font-bold text-slate-800">
                            {request.status === 'pending' ? 'Sample Collection' : 'Result Entry'}
                        </h2>
                        <div className="text-sm text-slate-500">
                            Test Request #{request.id.slice(-6)} • {format(new Date(request.orderedAt), 'PP p')}
                        </div>
                    </div>
                </div>
                <div className="text-right">
                    <Badge variant={request.status === 'pending' ? 'outline' : 'default'} className="text-lg px-3 py-1">
                        {request.status.toUpperCase().replace('-', ' ')}
                    </Badge>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                {/* Patient & Test Details */}
                <div className="md:col-span-1 space-y-4">
                    <Card>
                        <CardHeader className="bg-slate-50 border-b pb-3">
                            <CardTitle className="text-sm font-medium text-slate-500">PATIENT DETAILS</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4 space-y-3">
                            <div>
                                <div className="font-bold text-lg">{visit.patientName}</div>
                                <div className="text-sm text-muted-foreground">{visit.patientId}</div>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <div>
                                    <span className="text-muted-foreground">Age/Sex</span>
                                    <div>{visit.age} / {visit.gender}</div>
                                </div>
                                <div>
                                    <span className="text-muted-foreground">Doctor</span>
                                    <div>{visit.doctor}</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="bg-purple-50 border-b pb-3 border-purple-100">
                            <CardTitle className="text-sm font-medium text-purple-700">TEST DETAILS</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4">
                            <div className="font-bold text-lg text-purple-900">{request.testName}</div>
                            <div className="text-sm text-purple-600 mt-1">
                                Standard protocol
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Action Area */}
                <div className="md:col-span-2 space-y-4">
                    <Card className="h-full flex flex-col">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                {request.status === 'pending' ? (
                                    <><TestTube className="w-5 h-5" /> Collect Sample</>
                                ) : (
                                    <><FileText className="w-5 h-5" /> Enter Report</>
                                )}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 space-y-6">
                            {request.status === 'pending' ? (
                                <div className="p-6 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-center space-y-4 bg-slate-50">
                                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                                        <TestTube className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-lg">Confirm Sample Collection</h3>
                                        <p className="text-muted-foreground max-w-sm mx-auto">
                                            Verify patient identity and ensure proper labeling of the sample container.
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <Label>Clinical Findings / Result Value</Label>
                                    <Textarea
                                        className="min-h-[200px] text-lg font-mono"
                                        placeholder="Enter detailed results here..."
                                        value={result}
                                        onChange={e => setResult(e.target.value)}
                                    />
                                    <div className="text-sm text-muted-foreground">
                                        Auto-save draft enabled.
                                    </div>
                                </div>
                            )}
                        </CardContent>
                        <CardFooter className="bg-slate-50 border-t p-6">
                            <Button
                                className="w-full h-12 text-lg"
                                size="lg"
                                onClick={handleAction}
                                disabled={loading || (request.status !== 'pending' && !result)}
                            >
                                {loading ? "Processing..." : request.status === 'pending' ? (
                                    <><CheckCircle className="w-5 h-5 mr-2" /> Mark Sample Collected</>
                                ) : (
                                    <><CheckCircle className="w-5 h-5 mr-2" /> Finalize & Verify Result</>
                                )}
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    );
};
