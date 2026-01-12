import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Heart, Thermometer, Gauge, Activity, Clock, Plus, TrendingUp, TrendingDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface VitalSignsRecord {
  id: string;
  erPatientId: string;
  patientName: string;
  erNumber: string;
  bedNumber?: string;
  recordedBy: string;
  recordedTime: string;
  temperature: number;
  bloodPressureSystolic: number;
  bloodPressureDiastolic: number;
  heartRate: number;
  respiratoryRate: number;
  oxygenSaturation: number;
  painScale: number;
  consciousnessLevel: string;
  notes?: string;
}

export function VitalSigns() {
  const { toast } = useToast();
  const [showVitalsForm, setShowVitalsForm] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState("");
  const [newVitals, setNewVitals] = useState({
    temperature: "",
    bloodPressureSystolic: "",
    bloodPressureDiastolic: "",
    heartRate: "",
    respiratoryRate: "",
    oxygenSaturation: "",
    painScale: "",
    consciousnessLevel: "alert",
    notes: ""
  });

  // Mock patients in ER
  const erPatients = [
    { id: "1", erNumber: "ER-001", name: "Ahmad Hassan", bedNumber: "ER-T1" },
    { id: "2", erNumber: "ER-002", name: "Fatima Ali", bedNumber: "ER-T2" },
    { id: "3", erNumber: "ER-003", name: "Hassan Ali", bedNumber: "ER-G1" }
  ];

  // Mock vital signs data
  const vitalsHistory: VitalSignsRecord[] = [
    {
      id: "1",
      erPatientId: "1",
      patientName: "Ahmad Hassan",
      erNumber: "ER-001",
      bedNumber: "ER-T1",
      recordedBy: "Nurse Sarah",
      recordedTime: "2024-01-04 15:30",
      temperature: 36.8,
      bloodPressureSystolic: 150,
      bloodPressureDiastolic: 90,
      heartRate: 95,
      respiratoryRate: 18,
      oxygenSaturation: 98,
      painScale: 7,
      consciousnessLevel: "alert",
      notes: "Patient complaining of chest discomfort"
    },
    {
      id: "2",
      erPatientId: "1",
      patientName: "Ahmad Hassan",
      erNumber: "ER-001",
      bedNumber: "ER-T1",
      recordedBy: "Nurse Ahmed",
      recordedTime: "2024-01-04 14:45",
      temperature: 37.0,
      bloodPressureSystolic: 160,
      bloodPressureDiastolic: 95,
      heartRate: 102,
      respiratoryRate: 20,
      oxygenSaturation: 97,
      painScale: 8,
      consciousnessLevel: "alert",
      notes: "Initial assessment - elevated BP and HR"
    },
    {
      id: "3",
      erPatientId: "2",
      patientName: "Fatima Ali",
      erNumber: "ER-002",
      bedNumber: "ER-T2",
      recordedBy: "Nurse Fatima",
      recordedTime: "2024-01-04 15:20",
      temperature: 37.2,
      bloodPressureSystolic: 140,
      bloodPressureDiastolic: 85,
      heartRate: 88,
      respiratoryRate: 16,
      oxygenSaturation: 99,
      painScale: 6,
      consciousnessLevel: "alert",
      notes: "Abdominal pain assessment"
    }
  ];

  const getVitalStatus = (vital: string, value: number) => {
    switch (vital) {
      case "temperature":
        if (value < 36.0 || value > 38.0) return "abnormal";
        return "normal";
      case "heartRate":
        if (value < 60 || value > 100) return "abnormal";
        return "normal";
      case "bloodPressure":
        if (value > 140) return "abnormal"; // systolic
        return "normal";
      case "respiratoryRate":
        if (value < 12 || value > 20) return "abnormal";
        return "normal";
      case "oxygenSaturation":
        if (value < 95) return "abnormal";
        return "normal";
      default:
        return "normal";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "abnormal": return "text-red-500";
      case "normal": return "text-green-500";
      default: return "";
    }
  };

  const getTrend = (currentValue: number, previousValue: number) => {
    if (currentValue > previousValue) return "up";
    if (currentValue < previousValue) return "down";
    return "stable";
  };

  const handleVitalsSubmit = () => {
    const selectedPatientData = erPatients.find(p => p.id === selectedPatient);
    
    toast({
      title: "Vital Signs Recorded",
      description: `Vital signs recorded for ${selectedPatientData?.name} (${selectedPatientData?.erNumber})`,
    });

    // Reset form
    setNewVitals({
      temperature: "",
      bloodPressureSystolic: "",
      bloodPressureDiastolic: "",
      heartRate: "",
      respiratoryRate: "",
      oxygenSaturation: "",
      painScale: "",
      consciousnessLevel: "alert",
      notes: ""
    });
    setSelectedPatient("");
    setShowVitalsForm(false);
  };

  // Get current vital signs for each patient (most recent record)
  const getCurrentVitals = () => {
    return erPatients.map(patient => {
      const patientVitals = vitalsHistory
        .filter(v => v.erPatientId === patient.id)
        .sort((a, b) => new Date(b.recordedTime).getTime() - new Date(a.recordedTime).getTime());
      
      return {
        ...patient,
        latestVitals: patientVitals[0] || null,
        previousVitals: patientVitals[1] || null
      };
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Vital Signs Monitoring</h2>
        <Button onClick={() => setShowVitalsForm(!showVitalsForm)} className="gap-2">
          <Plus className="h-4 w-4" />
          Record Vitals
        </Button>
      </div>

      {/* Vital Signs Recording Form */}
      {showVitalsForm && (
        <Card>
          <CardHeader>
            <CardTitle>Record Vital Signs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Select Patient</Label>
              <Select value={selectedPatient} onValueChange={setSelectedPatient}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose patient to record vitals for" />
                </SelectTrigger>
                <SelectContent>
                  {erPatients.map((patient) => (
                    <SelectItem key={patient.id} value={patient.id}>
                      {patient.name} ({patient.erNumber}) - {patient.bedNumber}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="temperature">Temperature (°C)</Label>
                <div className="relative">
                  <Thermometer className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="temperature"
                    value={newVitals.temperature}
                    onChange={(e) => setNewVitals({ ...newVitals, temperature: e.target.value })}
                    placeholder="36.5"
                    className="pl-9"
                    type="number"
                    step="0.1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="heartRate">Heart Rate (BPM)</Label>
                <div className="relative">
                  <Heart className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="heartRate"
                    value={newVitals.heartRate}
                    onChange={(e) => setNewVitals({ ...newVitals, heartRate: e.target.value })}
                    placeholder="80"
                    className="pl-9"
                    type="number"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="respiratoryRate">Respiratory Rate</Label>
                <div className="relative">
                  <Activity className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="respiratoryRate"
                    value={newVitals.respiratoryRate}
                    onChange={(e) => setNewVitals({ ...newVitals, respiratoryRate: e.target.value })}
                    placeholder="16"
                    className="pl-9"
                    type="number"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bloodPressureSystolic">Systolic BP</Label>
                <div className="relative">
                  <Gauge className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="bloodPressureSystolic"
                    value={newVitals.bloodPressureSystolic}
                    onChange={(e) => setNewVitals({ ...newVitals, bloodPressureSystolic: e.target.value })}
                    placeholder="120"
                    className="pl-9"
                    type="number"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bloodPressureDiastolic">Diastolic BP</Label>
                <div className="relative">
                  <Gauge className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="bloodPressureDiastolic"
                    value={newVitals.bloodPressureDiastolic}
                    onChange={(e) => setNewVitals({ ...newVitals, bloodPressureDiastolic: e.target.value })}
                    placeholder="80"
                    className="pl-9"
                    type="number"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="oxygenSaturation">O2 Saturation (%)</Label>
                <Input
                  id="oxygenSaturation"
                  value={newVitals.oxygenSaturation}
                  onChange={(e) => setNewVitals({ ...newVitals, oxygenSaturation: e.target.value })}
                  placeholder="98"
                  type="number"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="painScale">Pain Scale (0-10)</Label>
                <Input
                  id="painScale"
                  value={newVitals.painScale}
                  onChange={(e) => setNewVitals({ ...newVitals, painScale: e.target.value })}
                  placeholder="5"
                  type="number"
                  min="0"
                  max="10"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="consciousnessLevel">Consciousness Level</Label>
                <Select value={newVitals.consciousnessLevel} onValueChange={(value) => setNewVitals({ ...newVitals, consciousnessLevel: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="alert">Alert</SelectItem>
                    <SelectItem value="verbal">Responds to Verbal</SelectItem>
                    <SelectItem value="pain">Responds to Pain</SelectItem>
                    <SelectItem value="unconscious">Unconscious</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Clinical Notes</Label>
              <Textarea
                id="notes"
                value={newVitals.notes}
                onChange={(e) => setNewVitals({ ...newVitals, notes: e.target.value })}
                placeholder="Additional observations, patient condition, etc..."
                rows={3}
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button onClick={handleVitalsSubmit} disabled={!selectedPatient} className="flex-1">
                Record Vital Signs
              </Button>
              <Button variant="outline" onClick={() => setShowVitalsForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Current Patient Vitals Dashboard */}
      <Card>
        <CardHeader>
          <CardTitle>Current Patient Vital Signs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {getCurrentVitals().map((patient) => (
              <Card key={patient.id} className="border-2">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{patient.name}</h3>
                      <p className="text-sm text-muted-foreground">{patient.erNumber} • {patient.bedNumber}</p>
                    </div>
                    {patient.latestVitals && (
                      <Badge variant="outline" className="text-xs">
                        {patient.latestVitals.recordedTime.split(" ")[1]}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {patient.latestVitals ? (
                    <>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-2 border rounded text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Thermometer className="h-3 w-3" />
                            {patient.previousVitals && getTrend(patient.latestVitals.temperature, patient.previousVitals.temperature) === "up" && <TrendingUp className="h-3 w-3 text-red-500" />}
                            {patient.previousVitals && getTrend(patient.latestVitals.temperature, patient.previousVitals.temperature) === "down" && <TrendingDown className="h-3 w-3 text-blue-500" />}
                          </div>
                          <p className="text-xs text-muted-foreground">Temperature</p>
                          <p className={`text-sm font-semibold ${getStatusColor(getVitalStatus("temperature", patient.latestVitals.temperature))}`}>
                            {patient.latestVitals.temperature}°C
                          </p>
                        </div>
                        
                        <div className="p-2 border rounded text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Heart className="h-3 w-3" />
                            {patient.previousVitals && getTrend(patient.latestVitals.heartRate, patient.previousVitals.heartRate) === "up" && <TrendingUp className="h-3 w-3 text-red-500" />}
                            {patient.previousVitals && getTrend(patient.latestVitals.heartRate, patient.previousVitals.heartRate) === "down" && <TrendingDown className="h-3 w-3 text-blue-500" />}
                          </div>
                          <p className="text-xs text-muted-foreground">Heart Rate</p>
                          <p className={`text-sm font-semibold ${getStatusColor(getVitalStatus("heartRate", patient.latestVitals.heartRate))}`}>
                            {patient.latestVitals.heartRate} BPM
                          </p>
                        </div>
                        
                        <div className="p-2 border rounded text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Gauge className="h-3 w-3" />
                            {patient.previousVitals && getTrend(patient.latestVitals.bloodPressureSystolic, patient.previousVitals.bloodPressureSystolic) === "up" && <TrendingUp className="h-3 w-3 text-red-500" />}
                            {patient.previousVitals && getTrend(patient.latestVitals.bloodPressureSystolic, patient.previousVitals.bloodPressureSystolic) === "down" && <TrendingDown className="h-3 w-3 text-blue-500" />}
                          </div>
                          <p className="text-xs text-muted-foreground">Blood Pressure</p>
                          <p className={`text-sm font-semibold ${getStatusColor(getVitalStatus("bloodPressure", patient.latestVitals.bloodPressureSystolic))}`}>
                            {patient.latestVitals.bloodPressureSystolic}/{patient.latestVitals.bloodPressureDiastolic}
                          </p>
                        </div>
                        
                        <div className="p-2 border rounded text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Activity className="h-3 w-3" />
                            {patient.previousVitals && getTrend(patient.latestVitals.oxygenSaturation, patient.previousVitals.oxygenSaturation) === "down" && <TrendingDown className="h-3 w-3 text-red-500" />}
                            {patient.previousVitals && getTrend(patient.latestVitals.oxygenSaturation, patient.previousVitals.oxygenSaturation) === "up" && <TrendingUp className="h-3 w-3 text-green-500" />}
                          </div>
                          <p className="text-xs text-muted-foreground">O2 Saturation</p>
                          <p className={`text-sm font-semibold ${getStatusColor(getVitalStatus("oxygenSaturation", patient.latestVitals.oxygenSaturation))}`}>
                            {patient.latestVitals.oxygenSaturation}%
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center text-xs">
                        <span>Pain: {patient.latestVitals.painScale}/10</span>
                        <span>Consciousness: {patient.latestVitals.consciousnessLevel}</span>
                      </div>
                      
                      <div className="flex gap-1">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" className="flex-1">
                              View History
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Vital Signs History - {patient.name}</DialogTitle>
                            </DialogHeader>
                            
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Time</TableHead>
                                  <TableHead>Temp</TableHead>
                                  <TableHead>BP</TableHead>
                                  <TableHead>HR</TableHead>
                                  <TableHead>RR</TableHead>
                                  <TableHead>O2 Sat</TableHead>
                                  <TableHead>Pain</TableHead>
                                  <TableHead>Recorded By</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {vitalsHistory
                                  .filter(v => v.erPatientId === patient.id)
                                  .sort((a, b) => new Date(b.recordedTime).getTime() - new Date(a.recordedTime).getTime())
                                  .map((vital) => (
                                    <TableRow key={vital.id}>
                                      <TableCell className="text-sm">{vital.recordedTime}</TableCell>
                                      <TableCell className={getStatusColor(getVitalStatus("temperature", vital.temperature))}>
                                        {vital.temperature}°C
                                      </TableCell>
                                      <TableCell className={getStatusColor(getVitalStatus("bloodPressure", vital.bloodPressureSystolic))}>
                                        {vital.bloodPressureSystolic}/{vital.bloodPressureDiastolic}
                                      </TableCell>
                                      <TableCell className={getStatusColor(getVitalStatus("heartRate", vital.heartRate))}>
                                        {vital.heartRate}
                                      </TableCell>
                                      <TableCell className={getStatusColor(getVitalStatus("respiratoryRate", vital.respiratoryRate))}>
                                        {vital.respiratoryRate}
                                      </TableCell>
                                      <TableCell className={getStatusColor(getVitalStatus("oxygenSaturation", vital.oxygenSaturation))}>
                                        {vital.oxygenSaturation}%
                                      </TableCell>
                                      <TableCell>{vital.painScale}/10</TableCell>
                                      <TableCell className="text-sm">{vital.recordedBy}</TableCell>
                                    </TableRow>
                                  ))}
                              </TableBody>
                            </Table>
                          </DialogContent>
                        </Dialog>
                        <Button variant="outline" size="sm">
                          Record New
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-sm text-muted-foreground">No vital signs recorded yet</p>
                      <Button variant="outline" size="sm" className="mt-2">
                        Record First Vitals
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Vital Signs History */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Vital Signs History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Temperature</TableHead>
                <TableHead>Blood Pressure</TableHead>
                <TableHead>Heart Rate</TableHead>
                <TableHead>Respiratory Rate</TableHead>
                <TableHead>O2 Saturation</TableHead>
                <TableHead>Pain Scale</TableHead>
                <TableHead>Recorded By</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vitalsHistory
                .sort((a, b) => new Date(b.recordedTime).getTime() - new Date(a.recordedTime).getTime())
                .slice(0, 10)
                .map((vital) => (
                  <TableRow key={vital.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-sm">{vital.patientName}</p>
                        <p className="text-xs text-muted-foreground">{vital.erNumber} • {vital.bedNumber}</p>
                      </div>
                    </TableCell>
                    <TableCell className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {vital.recordedTime}
                    </TableCell>
                    <TableCell className={getStatusColor(getVitalStatus("temperature", vital.temperature))}>
                      {vital.temperature}°C
                    </TableCell>
                    <TableCell className={getStatusColor(getVitalStatus("bloodPressure", vital.bloodPressureSystolic))}>
                      {vital.bloodPressureSystolic}/{vital.bloodPressureDiastolic}
                    </TableCell>
                    <TableCell className={getStatusColor(getVitalStatus("heartRate", vital.heartRate))}>
                      {vital.heartRate} BPM
                    </TableCell>
                    <TableCell className={getStatusColor(getVitalStatus("respiratoryRate", vital.respiratoryRate))}>
                      {vital.respiratoryRate}
                    </TableCell>
                    <TableCell className={getStatusColor(getVitalStatus("oxygenSaturation", vital.oxygenSaturation))}>
                      {vital.oxygenSaturation}%
                    </TableCell>
                    <TableCell>
                      <Badge variant={vital.painScale >= 7 ? "destructive" : vital.painScale >= 4 ? "secondary" : "outline"}>
                        {vital.painScale}/10
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">{vital.recordedBy}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}