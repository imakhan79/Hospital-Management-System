import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Bed, AlertTriangle, Clock, User, Settings, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ERBed {
  id: string;
  bedNumber: string;
  bedType: string;
  zone: string;
  status: string;
  currentPatient?: {
    id: string;
    name: string;
    erNumber: string;
    triageLevel: number;
    admissionTime: string;
  };
  locationDescription: string;
  equipment: string[];
}

export function BedManagement() {
  const { toast } = useToast();
  const [selectedBed, setSelectedBed] = useState<string | null>(null);
  const [assignmentPatient, setAssignmentPatient] = useState<string>("");

  // Mock bed data
  const beds: ERBed[] = [
    {
      id: "1",
      bedNumber: "ER-T1",
      bedType: "trauma",
      zone: "red_zone",
      status: "occupied",
      currentPatient: {
        id: "p1",
        name: "Ahmad Hassan",
        erNumber: "ER-001",
        triageLevel: 1,
        admissionTime: "2024-01-04 14:30"
      },
      locationDescription: "Trauma Bay 1",
      equipment: ["ventilator", "defibrillator", "ultrasound"]
    },
    {
      id: "2",
      bedNumber: "ER-T2",
      bedType: "trauma",
      zone: "red_zone",
      status: "occupied",
      currentPatient: {
        id: "p2",
        name: "Fatima Ali",
        erNumber: "ER-002",
        triageLevel: 2,
        admissionTime: "2024-01-04 14:45"
      },
      locationDescription: "Trauma Bay 2",
      equipment: ["ventilator", "defibrillator", "ultrasound"]
    },
    {
      id: "3",
      bedNumber: "ER-G1",
      bedType: "general",
      zone: "yellow_zone",
      status: "occupied",
      currentPatient: {
        id: "p3",
        name: "Hassan Ali",
        erNumber: "ER-003",
        triageLevel: 3,
        admissionTime: "2024-01-04 15:00"
      },
      locationDescription: "General Bed 1",
      equipment: ["monitor", "oxygen"]
    },
    {
      id: "4",
      bedNumber: "ER-G2",
      bedType: "general",
      zone: "yellow_zone",
      status: "available",
      locationDescription: "General Bed 2",
      equipment: ["monitor", "oxygen"]
    },
    {
      id: "5",
      bedNumber: "ER-G3",
      bedType: "general",
      zone: "yellow_zone",
      status: "cleaning",
      locationDescription: "General Bed 3",
      equipment: ["monitor", "oxygen"]
    },
    {
      id: "6",
      bedNumber: "ER-G4",
      bedType: "general",
      zone: "green_zone",
      status: "available",
      locationDescription: "General Bed 4",
      equipment: ["monitor"]
    },
    {
      id: "7",
      bedNumber: "ER-G5",
      bedType: "general",
      zone: "green_zone",
      status: "available",
      locationDescription: "General Bed 5",
      equipment: ["monitor"]
    },
    {
      id: "8",
      bedNumber: "ER-ISO1",
      bedType: "isolation",
      zone: "red_zone",
      status: "available",
      locationDescription: "Isolation Room 1",
      equipment: ["ventilator", "monitor", "oxygen"]
    },
    {
      id: "9",
      bedNumber: "ER-PED1",
      bedType: "pediatric",
      zone: "pediatric",
      status: "available",
      locationDescription: "Pediatric Bed 1",
      equipment: ["pediatric_monitor", "oxygen"]
    }
  ];

  // Mock waiting patients needing bed assignment
  const waitingPatients = [
    { id: "w1", name: "Mariam Shah", erNumber: "ER-004", triageLevel: 2, chiefComplaint: "Chest pain" },
    { id: "w2", name: "Usman Khan", erNumber: "ER-005", triageLevel: 3, chiefComplaint: "Abdominal pain" }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available": return "default";
      case "occupied": return "destructive";
      case "cleaning": return "secondary";
      case "maintenance": return "outline";
      default: return "outline";
    }
  };

  const getZoneColor = (zone: string) => {
    switch (zone) {
      case "red_zone": return "bg-red-50 dark:bg-red-950/30 border-red-200";
      case "yellow_zone": return "bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200";
      case "green_zone": return "bg-green-50 dark:bg-green-950/30 border-green-200";
      case "pediatric": return "bg-blue-50 dark:bg-blue-950/30 border-blue-200";
      default: return "";
    }
  };

  const getTriageColor = (level: number) => {
    switch (level) {
      case 1: return "destructive";
      case 2: return "secondary";
      case 3: return "outline";
      default: return "outline";
    }
  };

  const handleBedAssignment = (bedId: string, patientId: string) => {
    toast({
      title: "Bed Assignment Successful",
      description: `Patient assigned to bed ${beds.find(b => b.id === bedId)?.bedNumber}`,
    });
    setAssignmentPatient("");
  };

  const handleDischarge = (bedId: string) => {
    toast({
      title: "Patient Discharged",
      description: `Bed ${beds.find(b => b.id === bedId)?.bedNumber} is now available`,
    });
  };

  const availableBeds = beds.filter(bed => bed.status === "available").length;
  const occupiedBeds = beds.filter(bed => bed.status === "occupied").length;
  const occupancyRate = Math.round((occupiedBeds / beds.length) * 100);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Emergency Bed Management</h2>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Available: {availableBeds}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>Occupied: {occupiedBeds}</span>
          </div>
          <div className="font-medium">
            Occupancy: {occupancyRate}%
          </div>
        </div>
      </div>

      {/* Bed Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Red Zone - Critical */}
        <Card className="border-red-200">
          <CardHeader className="bg-red-50 dark:bg-red-950/30">
            <CardTitle className="text-lg text-red-700 dark:text-red-400 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Red Zone (Critical)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-3">
            {beds.filter(bed => bed.zone === "red_zone").map((bed) => (
              <div key={bed.id} className={`p-3 rounded-lg border ${getZoneColor(bed.zone)}`}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold">{bed.bedNumber}</h4>
                    <p className="text-xs text-muted-foreground">{bed.bedType} • {bed.locationDescription}</p>
                  </div>
                  <Badge variant={getStatusColor(bed.status)}>
                    {bed.status}
                  </Badge>
                </div>
                
                {bed.currentPatient && (
                  <div className="mt-2 p-2 bg-white dark:bg-gray-800 rounded border">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium">{bed.currentPatient.name}</p>
                        <p className="text-xs text-muted-foreground">{bed.currentPatient.erNumber}</p>
                      </div>
                      <Badge variant={getTriageColor(bed.currentPatient.triageLevel)} className="text-xs">
                        L{bed.currentPatient.triageLevel}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Since: {bed.currentPatient.admissionTime}
                    </p>
                  </div>
                )}
                
                <div className="flex gap-1 mt-2">
                  {bed.status === "available" && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline" className="text-xs">
                          Assign Patient
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Assign Patient to {bed.bedNumber}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <Select value={assignmentPatient} onValueChange={setAssignmentPatient}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select patient to assign" />
                            </SelectTrigger>
                            <SelectContent>
                              {waitingPatients.map((patient) => (
                                <SelectItem key={patient.id} value={patient.id}>
                                  {patient.name} ({patient.erNumber}) - Level {patient.triageLevel}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <div className="flex gap-2">
                            <Button
                              onClick={() => handleBedAssignment(bed.id, assignmentPatient)}
                              disabled={!assignmentPatient}
                            >
                              Assign Bed
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                  
                  {bed.status === "occupied" && (
                    <Button size="sm" variant="outline" className="text-xs" onClick={() => handleDischarge(bed.id)}>
                      Discharge
                    </Button>
                  )}
                  
                  <Button size="sm" variant="outline" className="text-xs">
                    <Settings className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Yellow Zone - Urgent */}
        <Card className="border-yellow-200">
          <CardHeader className="bg-yellow-50 dark:bg-yellow-950/30">
            <CardTitle className="text-lg text-yellow-700 dark:text-yellow-400 flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Yellow Zone (Urgent)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-3">
            {beds.filter(bed => bed.zone === "yellow_zone").map((bed) => (
              <div key={bed.id} className={`p-3 rounded-lg border ${getZoneColor(bed.zone)}`}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold">{bed.bedNumber}</h4>
                    <p className="text-xs text-muted-foreground">{bed.bedType} • {bed.locationDescription}</p>
                  </div>
                  <Badge variant={getStatusColor(bed.status)}>
                    {bed.status}
                  </Badge>
                </div>
                
                {bed.currentPatient && (
                  <div className="mt-2 p-2 bg-white dark:bg-gray-800 rounded border">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium">{bed.currentPatient.name}</p>
                        <p className="text-xs text-muted-foreground">{bed.currentPatient.erNumber}</p>
                      </div>
                      <Badge variant={getTriageColor(bed.currentPatient.triageLevel)} className="text-xs">
                        L{bed.currentPatient.triageLevel}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Since: {bed.currentPatient.admissionTime}
                    </p>
                  </div>
                )}
                
                <div className="flex gap-1 mt-2">
                  {bed.status === "available" && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline" className="text-xs">
                          Assign Patient
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Assign Patient to {bed.bedNumber}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <Select value={assignmentPatient} onValueChange={setAssignmentPatient}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select patient to assign" />
                            </SelectTrigger>
                            <SelectContent>
                              {waitingPatients.map((patient) => (
                                <SelectItem key={patient.id} value={patient.id}>
                                  {patient.name} ({patient.erNumber}) - Level {patient.triageLevel}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <div className="flex gap-2">
                            <Button
                              onClick={() => handleBedAssignment(bed.id, assignmentPatient)}
                              disabled={!assignmentPatient}
                            >
                              Assign Bed
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                  
                  {bed.status === "occupied" && (
                    <Button size="sm" variant="outline" className="text-xs" onClick={() => handleDischarge(bed.id)}>
                      Discharge
                    </Button>
                  )}
                  
                  {bed.status === "cleaning" && (
                    <Button size="sm" variant="outline" className="text-xs">
                      <CheckCircle className="h-3 w-3" />
                      Ready
                    </Button>
                  )}
                  
                  <Button size="sm" variant="outline" className="text-xs">
                    <Settings className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Green Zone & Pediatric */}
        <Card className="border-green-200">
          <CardHeader className="bg-green-50 dark:bg-green-950/30">
            <CardTitle className="text-lg text-green-700 dark:text-green-400 flex items-center gap-2">
              <User className="h-5 w-5" />
              Green Zone & Pediatric
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-3">
            {beds.filter(bed => bed.zone === "green_zone" || bed.zone === "pediatric").map((bed) => (
              <div key={bed.id} className={`p-3 rounded-lg border ${getZoneColor(bed.zone)}`}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold">{bed.bedNumber}</h4>
                    <p className="text-xs text-muted-foreground">{bed.bedType} • {bed.locationDescription}</p>
                  </div>
                  <Badge variant={getStatusColor(bed.status)}>
                    {bed.status}
                  </Badge>
                </div>
                
                {bed.currentPatient && (
                  <div className="mt-2 p-2 bg-white dark:bg-gray-800 rounded border">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium">{bed.currentPatient.name}</p>
                        <p className="text-xs text-muted-foreground">{bed.currentPatient.erNumber}</p>
                      </div>
                      <Badge variant={getTriageColor(bed.currentPatient.triageLevel)} className="text-xs">
                        L{bed.currentPatient.triageLevel}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Since: {bed.currentPatient.admissionTime}
                    </p>
                  </div>
                )}
                
                <div className="flex gap-1 mt-2">
                  {bed.status === "available" && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline" className="text-xs">
                          Assign Patient
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Assign Patient to {bed.bedNumber}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <Select value={assignmentPatient} onValueChange={setAssignmentPatient}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select patient to assign" />
                            </SelectTrigger>
                            <SelectContent>
                              {waitingPatients.map((patient) => (
                                <SelectItem key={patient.id} value={patient.id}>
                                  {patient.name} ({patient.erNumber}) - Level {patient.triageLevel}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <div className="flex gap-2">
                            <Button
                              onClick={() => handleBedAssignment(bed.id, assignmentPatient)}
                              disabled={!assignmentPatient}
                            >
                              Assign Bed
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                  
                  {bed.status === "occupied" && (
                    <Button size="sm" variant="outline" className="text-xs" onClick={() => handleDischarge(bed.id)}>
                      Discharge
                    </Button>
                  )}
                  
                  <Button size="sm" variant="outline" className="text-xs">
                    <Settings className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Patients Waiting for Bed Assignment */}
      <Card>
        <CardHeader>
          <CardTitle>Patients Waiting for Bed Assignment</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ER Number</TableHead>
                <TableHead>Patient Name</TableHead>
                <TableHead>Triage Level</TableHead>
                <TableHead>Chief Complaint</TableHead>
                <TableHead>Wait Time</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {waitingPatients.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell className="font-medium">{patient.erNumber}</TableCell>
                  <TableCell>{patient.name}</TableCell>
                  <TableCell>
                    <Badge variant={getTriageColor(patient.triageLevel)}>
                      Level {patient.triageLevel}
                    </Badge>
                  </TableCell>
                  <TableCell>{patient.chiefComplaint}</TableCell>
                  <TableCell className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    25 min
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">
                      Assign Bed
                    </Button>
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