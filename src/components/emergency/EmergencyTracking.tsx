import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Clock, Search, User, AlertTriangle, Bed, Activity } from "lucide-react";

interface ERPatientTracking {
  id: string;
  erNumber: string;
  patientName: string;
  age: number;
  chiefComplaint: string;
  triageLevel: number;
  arrivalTime: string;
  currentStatus: string;
  bedNumber?: string;
  assignedDoctor?: string;
  assignedNurse?: string;
  estimatedWaitTime: number;
  actualWaitTime: number;
  statusHistory: {
    status: string;
    timestamp: string;
    notes?: string;
  }[];
  vitals?: {
    temperature: string;
    bloodPressure: string;
    heartRate: string;
    oxygenSaturation: string;
    lastChecked: string;
  };
}

export function EmergencyTracking() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedPatient, setSelectedPatient] = useState<ERPatientTracking | null>(null);

  // Mock tracking data
  const trackingData: ERPatientTracking[] = [
    {
      id: "1",
      erNumber: "ER-001",
      patientName: "Ahmad Hassan",
      age: 45,
      chiefComplaint: "Chest pain",
      triageLevel: 1,
      arrivalTime: "2024-01-04 14:30",
      currentStatus: "in_treatment",
      bedNumber: "ER-T1",
      assignedDoctor: "Dr. Sarah Ahmed",
      assignedNurse: "Nurse Fatima",
      estimatedWaitTime: 0,
      actualWaitTime: 15,
      statusHistory: [
        { status: "arrived", timestamp: "2024-01-04 14:30", notes: "Walk-in patient" },
        { status: "triaged", timestamp: "2024-01-04 14:35", notes: "Level 1 - Critical chest pain" },
        { status: "bed_assigned", timestamp: "2024-01-04 14:40", notes: "Assigned to ER-T1" },
        { status: "in_treatment", timestamp: "2024-01-04 14:45", notes: "Treatment started by Dr. Sarah Ahmed" }
      ],
      vitals: {
        temperature: "36.8°C",
        bloodPressure: "150/90",
        heartRate: "95 bpm",
        oxygenSaturation: "98%",
        lastChecked: "2024-01-04 15:00"
      }
    },
    {
      id: "2",
      erNumber: "ER-002",
      patientName: "Fatima Ali",
      age: 32,
      chiefComplaint: "Severe abdominal pain",
      triageLevel: 2,
      arrivalTime: "2024-01-04 14:45",
      currentStatus: "waiting",
      assignedNurse: "Nurse Ahmed",
      estimatedWaitTime: 15,
      actualWaitTime: 35,
      statusHistory: [
        { status: "arrived", timestamp: "2024-01-04 14:45", notes: "Ambulance arrival" },
        { status: "triaged", timestamp: "2024-01-04 14:50", notes: "Level 2 - Urgent abdominal pain" },
        { status: "waiting", timestamp: "2024-01-04 14:55", notes: "Waiting for bed assignment" }
      ],
      vitals: {
        temperature: "37.2°C",
        bloodPressure: "140/85",
        heartRate: "88 bpm",
        oxygenSaturation: "99%",
        lastChecked: "2024-01-04 15:10"
      }
    },
    {
      id: "3",
      erNumber: "ER-003",
      patientName: "Hassan Ali",
      age: 28,
      chiefComplaint: "Severe headache",
      triageLevel: 3,
      arrivalTime: "2024-01-04 15:00",
      currentStatus: "in_treatment",
      bedNumber: "ER-G1",
      assignedDoctor: "Dr. Ahmed Khan",
      estimatedWaitTime: 30,
      actualWaitTime: 25,
      statusHistory: [
        { status: "arrived", timestamp: "2024-01-04 15:00", notes: "Walk-in patient" },
        { status: "triaged", timestamp: "2024-01-04 15:05", notes: "Level 3 - Severe headache" },
        { status: "bed_assigned", timestamp: "2024-01-04 15:20", notes: "Assigned to ER-G1" },
        { status: "in_treatment", timestamp: "2024-01-04 15:25", notes: "Treatment started" }
      ]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "waiting": return "secondary";
      case "triaged": return "outline";
      case "in_treatment": return "default";
      case "discharged": return "default";
      case "admitted": return "outline";
      default: return "outline";
    }
  };

  const getTriageColor = (level: number) => {
    switch (level) {
      case 1: return "destructive";
      case 2: return "secondary"; 
      case 3: return "outline";
      case 4: return "outline";
      default: return "outline";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "waiting": return <Clock className="h-4 w-4" />;
      case "in_treatment": return <Activity className="h-4 w-4" />;
      case "bed_assigned": return <Bed className="h-4 w-4" />;
      default: return <User className="h-4 w-4" />;
    }
  };

  const filteredData = trackingData.filter(patient => {
    const matchesSearch = patient.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.erNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || patient.currentStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Emergency Patient Tracking</h2>
        <div className="text-sm text-muted-foreground">
          Real-time patient status • Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or ER number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={statusFilter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("all")}
          >
            All ({trackingData.length})
          </Button>
          <Button
            variant={statusFilter === "waiting" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("waiting")}
          >
            Waiting ({trackingData.filter(p => p.currentStatus === "waiting").length})
          </Button>
          <Button
            variant={statusFilter === "in_treatment" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("in_treatment")}
          >
            In Treatment ({trackingData.filter(p => p.currentStatus === "in_treatment").length})
          </Button>
        </div>
      </div>

      {/* Quick Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-500/10 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Critical (Level 1)</p>
                <p className="text-2xl font-bold text-red-500">
                  {trackingData.filter(p => p.triageLevel === 1).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500/10 rounded-lg">
                <Clock className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Urgent (Level 2)</p>
                <p className="text-2xl font-bold text-orange-500">
                  {trackingData.filter(p => p.triageLevel === 2).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Activity className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">In Treatment</p>
                <p className="text-2xl font-bold text-blue-500">
                  {trackingData.filter(p => p.currentStatus === "in_treatment").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-500/10 rounded-lg">
                <Clock className="h-5 w-5 text-yellow-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg Wait Time</p>
                <p className="text-2xl font-bold">
                  {Math.round(trackingData.reduce((acc, p) => acc + p.actualWaitTime, 0) / trackingData.length)}m
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Patient Tracking Table */}
      <Card>
        <CardHeader>
          <CardTitle>Patient Status Tracking</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ER Number</TableHead>
                <TableHead>Patient</TableHead>
                <TableHead>Triage</TableHead>
                <TableHead>Current Status</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Assigned Staff</TableHead>
                <TableHead>Wait Time</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell className="font-medium">{patient.erNumber}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{patient.patientName}</p>
                      <p className="text-sm text-muted-foreground">Age: {patient.age} • {patient.chiefComplaint}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getTriageColor(patient.triageLevel)}>
                      Level {patient.triageLevel}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(patient.currentStatus)}
                      <Badge variant={getStatusColor(patient.currentStatus)}>
                        {patient.currentStatus.replace("_", " ")}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    {patient.bedNumber ? (
                      <Badge variant="outline">{patient.bedNumber}</Badge>
                    ) : (
                      <span className="text-muted-foreground">No bed assigned</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {patient.assignedDoctor && <p>Dr: {patient.assignedDoctor}</p>}
                      {patient.assignedNurse && <p>Nurse: {patient.assignedNurse}</p>}
                      {!patient.assignedDoctor && !patient.assignedNurse && (
                        <span className="text-muted-foreground">Not assigned</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span className={patient.actualWaitTime > patient.estimatedWaitTime + 10 ? "text-red-500" : ""}>
                        {patient.actualWaitTime}m
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setSelectedPatient(patient)}
                        >
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Patient Tracking Details - {patient.patientName}</DialogTitle>
                        </DialogHeader>
                        
                        {selectedPatient && (
                          <div className="space-y-6">
                            {/* Patient Overview */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <Card>
                                <CardHeader className="pb-3">
                                  <CardTitle className="text-lg">Patient Information</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">ER Number:</span>
                                    <span className="font-medium">{selectedPatient.erNumber}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Name:</span>
                                    <span className="font-medium">{selectedPatient.patientName}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Age:</span>
                                    <span>{selectedPatient.age} years</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Chief Complaint:</span>
                                    <span>{selectedPatient.chiefComplaint}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Triage Level:</span>
                                    <Badge variant={getTriageColor(selectedPatient.triageLevel)}>
                                      Level {selectedPatient.triageLevel}
                                    </Badge>
                                  </div>
                                </CardContent>
                              </Card>

                              {/* Current Status */}
                              <Card>
                                <CardHeader className="pb-3">
                                  <CardTitle className="text-lg">Current Status</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Status:</span>
                                    <Badge variant={getStatusColor(selectedPatient.currentStatus)}>
                                      {selectedPatient.currentStatus.replace("_", " ")}
                                    </Badge>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Bed:</span>
                                    <span>{selectedPatient.bedNumber || "Not assigned"}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Doctor:</span>
                                    <span>{selectedPatient.assignedDoctor || "Not assigned"}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Nurse:</span>
                                    <span>{selectedPatient.assignedNurse || "Not assigned"}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Wait Time:</span>
                                    <span className={selectedPatient.actualWaitTime > selectedPatient.estimatedWaitTime + 10 ? "text-red-500 font-medium" : ""}>
                                      {selectedPatient.actualWaitTime} minutes
                                    </span>
                                  </div>
                                </CardContent>
                              </Card>
                            </div>

                            {/* Vital Signs */}
                            {selectedPatient.vitals && (
                              <Card>
                                <CardHeader className="pb-3">
                                  <CardTitle className="text-lg">Latest Vital Signs</CardTitle>
                                  <p className="text-sm text-muted-foreground">
                                    Last checked: {selectedPatient.vitals.lastChecked}
                                  </p>
                                </CardHeader>
                                <CardContent>
                                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="text-center p-3 border rounded-lg">
                                      <p className="text-sm text-muted-foreground">Temperature</p>
                                      <p className="text-lg font-semibold">{selectedPatient.vitals.temperature}</p>
                                    </div>
                                    <div className="text-center p-3 border rounded-lg">
                                      <p className="text-sm text-muted-foreground">Blood Pressure</p>
                                      <p className="text-lg font-semibold">{selectedPatient.vitals.bloodPressure}</p>
                                    </div>
                                    <div className="text-center p-3 border rounded-lg">
                                      <p className="text-sm text-muted-foreground">Heart Rate</p>
                                      <p className="text-lg font-semibold">{selectedPatient.vitals.heartRate}</p>
                                    </div>
                                    <div className="text-center p-3 border rounded-lg">
                                      <p className="text-sm text-muted-foreground">O2 Saturation</p>
                                      <p className="text-lg font-semibold">{selectedPatient.vitals.oxygenSaturation}</p>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            )}

                            {/* Status History */}
                            <Card>
                              <CardHeader className="pb-3">
                                <CardTitle className="text-lg">Status History</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="space-y-3">
                                  {selectedPatient.statusHistory.map((status, index) => (
                                    <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                                      <div className="mt-1">
                                        {getStatusIcon(status.status)}
                                      </div>
                                      <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                          <div>
                                            <p className="font-medium capitalize">
                                              {status.status.replace("_", " ")}
                                            </p>
                                            {status.notes && (
                                              <p className="text-sm text-muted-foreground mt-1">
                                                {status.notes}
                                              </p>
                                            )}
                                          </div>
                                          <span className="text-sm text-muted-foreground">
                                            {status.timestamp}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}