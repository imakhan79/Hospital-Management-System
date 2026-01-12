import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Plus, Clock, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface NewIntake {
  patientId: string;
  chiefComplaint: string;
  arrivalMethod: string;
  symptoms: string;
  allergies: string;
  currentMedications: string;
  emergencyContact: string;
  emergencyContactPhone: string;
  insuranceInfo: string;
}

export function PatientIntake() {
  const { toast } = useToast();
  const [showIntakeForm, setShowIntakeForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [newIntake, setNewIntake] = useState<NewIntake>({
    patientId: "",
    chiefComplaint: "",
    arrivalMethod: "walk_in",
    symptoms: "",
    allergies: "",
    currentMedications: "",
    emergencyContact: "",
    emergencyContactPhone: "",
    insuranceInfo: ""
  });

  // Mock recent intakes
  const recentIntakes = [
    {
      id: "1",
      erNumber: "ER-003",
      patientName: "Hassan Ali",
      chiefComplaint: "Severe headache",
      arrivalTime: "2024-01-04 15:30",
      arrivalMethod: "walk_in",
      status: "waiting"
    },
    {
      id: "2",
      erNumber: "ER-004",
      patientName: "Mariam Shah",
      chiefComplaint: "Abdominal pain",
      arrivalTime: "2024-01-04 15:15",
      arrivalMethod: "ambulance",
      status: "triaged"
    }
  ];

  // Mock patient search results
  const searchResults = [
    { id: "patient-1", name: "Ahmad Hassan", patientId: "P-001", dateOfBirth: "1985-03-15" },
    { id: "patient-2", name: "Fatima Ali", patientId: "P-002", dateOfBirth: "1990-07-22" }
  ];

  const handleIntakeSubmit = () => {
    // Generate ER number
    const erNumber = `ER-${String(Date.now()).slice(-3)}`;
    
    toast({
      title: "Patient Intake Complete",
      description: `Patient registered with ER number: ${erNumber}`,
    });

    // Reset form
    setNewIntake({
      patientId: "",
      chiefComplaint: "",
      arrivalMethod: "walk_in",
      symptoms: "",
      allergies: "",
      currentMedications: "",
      emergencyContact: "",
      emergencyContactPhone: "",
      insuranceInfo: ""
    });
    setShowIntakeForm(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "waiting": return "secondary";
      case "triaged": return "outline";
      case "in_treatment": return "default";
      default: return "outline";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Patient Intake</h2>
        <Button onClick={() => setShowIntakeForm(!showIntakeForm)} className="gap-2">
          <Plus className="h-4 w-4" />
          New Intake
        </Button>
      </div>

      {showIntakeForm && (
        <Card>
          <CardHeader>
            <CardTitle>Emergency Room Intake Form</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Patient Search */}
            <div className="space-y-4">
              <Label>Search Existing Patient</Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, ID, or phone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Button variant="outline">Search</Button>
              </div>
              
              {searchTerm && (
                <div className="border rounded-lg p-2 space-y-2 max-h-40 overflow-y-auto">
                  {searchResults.map((patient) => (
                    <div
                      key={patient.id}
                      className="flex justify-between items-center p-2 hover:bg-muted rounded cursor-pointer"
                      onClick={() => {
                        setNewIntake({ ...newIntake, patientId: patient.id });
                        setSearchTerm(patient.name);
                      }}
                    >
                      <div>
                        <p className="font-medium">{patient.name}</p>
                        <p className="text-sm text-muted-foreground">{patient.patientId} • DOB: {patient.dateOfBirth}</p>
                      </div>
                      <Button variant="outline" size="sm">Select</Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Intake Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="arrivalMethod">Arrival Method</Label>
                <Select value={newIntake.arrivalMethod} onValueChange={(value) => setNewIntake({ ...newIntake, arrivalMethod: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="walk_in">Walk-in</SelectItem>
                    <SelectItem value="ambulance">Ambulance</SelectItem>
                    <SelectItem value="transfer">Transfer</SelectItem>
                    <SelectItem value="police">Police</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="chiefComplaint">Chief Complaint *</Label>
                <Input
                  id="chiefComplaint"
                  value={newIntake.chiefComplaint}
                  onChange={(e) => setNewIntake({ ...newIntake, chiefComplaint: e.target.value })}
                  placeholder="Primary reason for visit"
                  required
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="symptoms">Symptoms & History</Label>
                <Textarea
                  id="symptoms"
                  value={newIntake.symptoms}
                  onChange={(e) => setNewIntake({ ...newIntake, symptoms: e.target.value })}
                  placeholder="Detailed symptoms, onset, duration..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="allergies">Known Allergies</Label>
                <Input
                  id="allergies"
                  value={newIntake.allergies}
                  onChange={(e) => setNewIntake({ ...newIntake, allergies: e.target.value })}
                  placeholder="Drug allergies, food allergies, etc."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="medications">Current Medications</Label>
                <Input
                  id="medications"
                  value={newIntake.currentMedications}
                  onChange={(e) => setNewIntake({ ...newIntake, currentMedications: e.target.value })}
                  placeholder="Current medications and dosages"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="emergencyContact">Emergency Contact</Label>
                <Input
                  id="emergencyContact"
                  value={newIntake.emergencyContact}
                  onChange={(e) => setNewIntake({ ...newIntake, emergencyContact: e.target.value })}
                  placeholder="Emergency contact name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="emergencyContactPhone">Emergency Contact Phone</Label>
                <Input
                  id="emergencyContactPhone"
                  value={newIntake.emergencyContactPhone}
                  onChange={(e) => setNewIntake({ ...newIntake, emergencyContactPhone: e.target.value })}
                  placeholder="Emergency contact phone number"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="insurance">Insurance Information</Label>
                <Input
                  id="insurance"
                  value={newIntake.insuranceInfo}
                  onChange={(e) => setNewIntake({ ...newIntake, insuranceInfo: e.target.value })}
                  placeholder="Insurance provider and policy number"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button onClick={handleIntakeSubmit} className="flex-1">
                Complete Intake & Send to Triage
              </Button>
              <Button variant="outline" onClick={() => setShowIntakeForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Intakes */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Intakes</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ER Number</TableHead>
                <TableHead>Patient Name</TableHead>
                <TableHead>Chief Complaint</TableHead>
                <TableHead>Arrival Time</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentIntakes.map((intake) => (
                <TableRow key={intake.id}>
                  <TableCell className="font-medium">{intake.erNumber}</TableCell>
                  <TableCell>{intake.patientName}</TableCell>
                  <TableCell>{intake.chiefComplaint}</TableCell>
                  <TableCell className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {intake.arrivalTime}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{intake.arrivalMethod}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(intake.status)}>
                      {intake.status.replace("_", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">
                      View Details
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