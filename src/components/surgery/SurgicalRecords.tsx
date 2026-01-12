
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Download, Eye, Plus, Search, Filter } from "lucide-react";

interface SurgicalRecord {
  id: string;
  date: string;
  patient: string;
  procedure: string;
  surgeon: string;
  duration: string;
  outcome: string;
  complications: string;
  status: "completed" | "in-progress" | "cancelled";
}

export const SurgicalRecords = () => {
  const [isNewRecordDialogOpen, setIsNewRecordDialogOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<SurgicalRecord | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  
  const [surgicalRecords, setSurgicalRecords] = useState<SurgicalRecord[]>([
    {
      id: "SR-001",
      date: "2024-01-15",
      patient: "John Doe",
      procedure: "Appendectomy",
      surgeon: "Dr. Sarah Johnson",
      duration: "2h 15m",
      outcome: "Successful",
      complications: "None",
      status: "completed"
    },
    {
      id: "SR-002", 
      date: "2024-01-14",
      patient: "Mary Smith",
      procedure: "Cardiac Bypass",
      surgeon: "Dr. Michael Chen",
      duration: "4h 30m",
      outcome: "Successful",
      complications: "Minor bleeding controlled",
      status: "completed"
    },
    {
      id: "SR-003",
      date: "2024-01-14",
      patient: "Robert Brown",
      procedure: "Knee Replacement",
      surgeon: "Dr. Emily Wilson",
      duration: "1h 45m",
      outcome: "Successful",
      complications: "None",
      status: "completed"
    },
    {
      id: "SR-004",
      date: "2024-01-15",
      patient: "Lisa Johnson",
      procedure: "Gallbladder Surgery",
      surgeon: "Dr. David Lee",
      duration: "In Progress",
      outcome: "Pending",
      complications: "None",
      status: "in-progress"
    }
  ]);

  const [newRecord, setNewRecord] = useState({
    patient: "",
    procedure: "",
    surgeon: "",
    duration: "",
    outcome: "",
    complications: "",
    preOpNotes: "",
    procedureDescription: "",
    postOpNotes: ""
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "default";
      case "in-progress": return "secondary";
      case "cancelled": return "destructive";
      default: return "outline";
    }
  };

  const handleCreateRecord = () => {
    const record: SurgicalRecord = {
      id: `SR-${String(surgicalRecords.length + 1).padStart(3, '0')}`,
      date: new Date().toISOString().split('T')[0],
      ...newRecord,
      status: "completed" as const
    };
    setSurgicalRecords([record, ...surgicalRecords]);
    setIsNewRecordDialogOpen(false);
    setNewRecord({
      patient: "",
      procedure: "",
      surgeon: "",
      duration: "",
      outcome: "",
      complications: "",
      preOpNotes: "",
      procedureDescription: "",
      postOpNotes: ""
    });
  };

  const filteredRecords = surgicalRecords.filter(record => {
    const matchesSearch = record.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.procedure.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.surgeon.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || record.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    totalSurgeries: surgicalRecords.length,
    successRate: Math.round((surgicalRecords.filter(r => r.outcome === "Successful").length / surgicalRecords.length) * 100),
    avgDuration: "2h 45m",
    complications: Math.round((surgicalRecords.filter(r => r.complications !== "None").length / surgicalRecords.length) * 100)
  };

  return (
    <div className="space-y-4 sm:space-y-6 p-2 sm:p-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Surgical Records</h2>
          <p className="text-sm text-muted-foreground">
            Comprehensive surgical procedure documentation
          </p>
        </div>
        <Dialog open={isNewRecordDialogOpen} onOpenChange={setIsNewRecordDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              New Record
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Surgical Record</DialogTitle>
              <DialogDescription>
                Document a completed surgical procedure.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="patient">Patient Name</Label>
                  <Input
                    id="patient"
                    placeholder="Patient name"
                    value={newRecord.patient}
                    onChange={(e) => setNewRecord({...newRecord, patient: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="procedure">Procedure</Label>
                  <Input
                    id="procedure"
                    placeholder="Surgery type"
                    value={newRecord.procedure}
                    onChange={(e) => setNewRecord({...newRecord, procedure: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="surgeon">Surgeon</Label>
                  <Select value={newRecord.surgeon} onValueChange={(value) => setNewRecord({...newRecord, surgeon: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select surgeon" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Dr. Sarah Johnson">Dr. Sarah Johnson</SelectItem>
                      <SelectItem value="Dr. Michael Chen">Dr. Michael Chen</SelectItem>
                      <SelectItem value="Dr. Emily Wilson">Dr. Emily Wilson</SelectItem>
                      <SelectItem value="Dr. David Lee">Dr. David Lee</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="duration">Duration</Label>
                  <Input
                    id="duration"
                    placeholder="e.g., 2h 30m"
                    value={newRecord.duration}
                    onChange={(e) => setNewRecord({...newRecord, duration: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="outcome">Outcome</Label>
                  <Select value={newRecord.outcome} onValueChange={(value) => setNewRecord({...newRecord, outcome: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select outcome" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Successful">Successful</SelectItem>
                      <SelectItem value="Partially Successful">Partially Successful</SelectItem>
                      <SelectItem value="Complications">Complications</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="complications">Complications</Label>
                  <Input
                    id="complications"
                    placeholder="None or describe complications"
                    value={newRecord.complications}
                    onChange={(e) => setNewRecord({...newRecord, complications: e.target.value})}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="preOpNotes">Pre-operative Notes</Label>
                <Textarea
                  id="preOpNotes"
                  placeholder="Pre-operative assessment and notes..."
                  value={newRecord.preOpNotes}
                  onChange={(e) => setNewRecord({...newRecord, preOpNotes: e.target.value})}
                />
              </div>
              
              <div>
                <Label htmlFor="procedureDescription">Procedure Description</Label>
                <Textarea
                  id="procedureDescription"
                  placeholder="Detailed description of the surgical procedure..."
                  value={newRecord.procedureDescription}
                  onChange={(e) => setNewRecord({...newRecord, procedureDescription: e.target.value})}
                />
              </div>
              
              <div>
                <Label htmlFor="postOpNotes">Post-operative Notes</Label>
                <Textarea
                  id="postOpNotes"
                  placeholder="Post-operative care and instructions..."
                  value={newRecord.postOpNotes}
                  onChange={(e) => setNewRecord({...newRecord, postOpNotes: e.target.value})}
                />
              </div>
            </div>
            <Button onClick={handleCreateRecord} className="w-full">
              Create Surgical Record
            </Button>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Surgeries</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{stats.totalSurgeries}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <Badge className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{stats.successRate}%</div>
            <p className="text-xs text-muted-foreground">+0.2% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Duration</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{stats.avgDuration}</div>
            <p className="text-xs text-muted-foreground">-15m from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Complications</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{stats.complications}%</div>
            <p className="text-xs text-muted-foreground">-0.3% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div>
              <CardTitle className="text-base sm:text-lg">Search & Filter Records</CardTitle>
              <CardDescription className="text-sm">Find specific surgical records</CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search records..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-full sm:w-64"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-32">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Records Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base sm:text-lg">Surgical Records</CardTitle>
          <CardDescription className="text-sm">
            Detailed records of surgical procedures ({filteredRecords.length} records)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-20">Record ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Procedure</TableHead>
                  <TableHead className="hidden sm:table-cell">Surgeon</TableHead>
                  <TableHead className="hidden md:table-cell">Duration</TableHead>
                  <TableHead className="hidden lg:table-cell">Outcome</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">{record.id}</TableCell>
                    <TableCell>{record.date}</TableCell>
                    <TableCell>{record.patient}</TableCell>
                    <TableCell>{record.procedure}</TableCell>
                    <TableCell className="hidden sm:table-cell">{record.surgeon}</TableCell>
                    <TableCell className="hidden md:table-cell">{record.duration}</TableCell>
                    <TableCell className="hidden lg:table-cell">{record.outcome}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(record.status)}>
                        {record.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setSelectedRecord(record)}
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Record View Dialog */}
      <Dialog open={!!selectedRecord} onOpenChange={() => setSelectedRecord(null)}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Procedure Details - {selectedRecord?.id}</DialogTitle>
            <DialogDescription>Detailed surgical record</DialogDescription>
          </DialogHeader>
          {selectedRecord && (
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Pre-operative Notes</h4>
                  <p className="text-sm text-muted-foreground">
                    Patient presented with acute {selectedRecord.procedure.toLowerCase()}. Pre-operative vitals stable. 
                    No known allergies. Consented for procedure.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Procedure Description</h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedRecord.procedure} performed successfully. Standard technique used. 
                    Procedure completed without complications.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Surgical Team</h4>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <div>Primary Surgeon: {selectedRecord.surgeon}</div>
                    <div>Anesthesiologist: Dr. Mark Wilson</div>
                    <div>Scrub Nurse: RN Jennifer Smith</div>
                    <div>Circulating Nurse: RN Michael Brown</div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Post-operative Notes</h4>
                  <p className="text-sm text-muted-foreground">
                    Patient recovered well from anesthesia. Stable vitals post-operatively. 
                    Minimal pain reported. Started on clear liquids.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Complications</h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedRecord.complications || "None reported. Procedure completed without any complications."}
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Follow-up Instructions</h4>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <div>• Return to clinic in 1 week for wound check</div>
                    <div>• No heavy lifting for 2 weeks</div>
                    <div>• Resume normal diet as tolerated</div>
                    <div>• Call if fever, severe pain, or drainage</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
