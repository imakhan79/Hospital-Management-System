
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Activity, Heart, Thermometer, Droplets, Plus, TrendingUp, TrendingDown, Search, Filter, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const VitalsMonitoring = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isRecordVitalsOpen, setIsRecordVitalsOpen] = useState(false);
  const { toast } = useToast();

  const [vitalsData, setVitalsData] = useState([
    {
      id: 1,
      patient: "John Smith",
      room: "205",
      patientId: "P001",
      heartRate: 95,
      bloodPressure: "180/110",
      temperature: 99.2,
      oxygenSaturation: 96,
      respiratoryRate: 18,
      status: "critical",
      lastReading: "5 minutes ago",
      trend: "up",
      alerts: ["High BP", "Elevated HR"]
    },
    {
      id: 2,
      patient: "Mary Johnson",
      room: "301",
      patientId: "P002",
      heartRate: 45,
      bloodPressure: "110/70",
      temperature: 98.6,
      oxygenSaturation: 98,
      respiratoryRate: 16,
      status: "abnormal",
      lastReading: "12 minutes ago",
      trend: "down",
      alerts: ["Low HR"]
    },
    {
      id: 3,
      patient: "Robert Davis",
      room: "102",
      patientId: "P003",
      heartRate: 72,
      bloodPressure: "120/80",
      temperature: 98.6,
      oxygenSaturation: 99,
      respiratoryRate: 14,
      status: "normal",
      lastReading: "15 minutes ago",
      trend: "stable",
      alerts: []
    },
    {
      id: 4,
      patient: "Lisa Wilson",
      room: "208",
      patientId: "P004",
      heartRate: 88,
      bloodPressure: "135/85",
      temperature: 99.1,
      oxygenSaturation: 97,
      respiratoryRate: 17,
      status: "monitoring",
      lastReading: "8 minutes ago",
      trend: "up",
      alerts: ["Slight fever"]
    },
    {
      id: 5,
      patient: "David Brown",
      room: "305",
      patientId: "P005",
      heartRate: 68,
      bloodPressure: "118/75",
      temperature: 98.4,
      oxygenSaturation: 100,
      respiratoryRate: 12,
      status: "stable",
      lastReading: "20 minutes ago",
      trend: "down",
      alerts: []
    }
  ]);

  const [formData, setFormData] = useState({
    patientId: "",
    patientName: "",
    room: "",
    heartRate: "",
    systolicBP: "",
    diastolicBP: "",
    temperature: "",
    oxygenSaturation: "",
    respiratoryRate: "",
    notes: ""
  });

  const handleRecordVitals = (e: React.FormEvent) => {
    e.preventDefault();
    const newVitals = {
      id: vitalsData.length + 1,
      patient: formData.patientName,
      room: formData.room,
      patientId: formData.patientId,
      heartRate: parseInt(formData.heartRate),
      bloodPressure: `${formData.systolicBP}/${formData.diastolicBP}`,
      temperature: parseFloat(formData.temperature),
      oxygenSaturation: parseInt(formData.oxygenSaturation),
      respiratoryRate: parseInt(formData.respiratoryRate),
      status: determineStatus(formData),
      lastReading: "Just now",
      trend: "stable",
      alerts: []
    };

    setVitalsData([newVitals, ...vitalsData]);
    setFormData({
      patientId: "",
      patientName: "",
      room: "",
      heartRate: "",
      systolicBP: "",
      diastolicBP: "",
      temperature: "",
      oxygenSaturation: "",
      respiratoryRate: "",
      notes: ""
    });
    setIsRecordVitalsOpen(false);

    toast({
      title: "Vitals Recorded",
      description: `Vital signs for ${formData.patientName} have been recorded`,
    });
  };

  const determineStatus = (data: any) => {
    const hr = parseInt(data.heartRate);
    const systolic = parseInt(data.systolicBP);
    const temp = parseFloat(data.temperature);
    const oxygen = parseInt(data.oxygenSaturation);

    if (systolic > 160 || hr > 120 || hr < 50 || temp > 101 || oxygen < 92) {
      return "critical";
    } else if (systolic > 140 || hr > 100 || hr < 55 || temp > 99.5 || oxygen < 95) {
      return "abnormal";
    } else {
      return "normal";
    }
  };

  const handleAlertDoctor = (patientId: string) => {
    toast({
      title: "Doctor Alerted",
      description: `Emergency notification sent to doctor for patient ${patientId}`,
      variant: "destructive"
    });
  };

  const filteredVitals = vitalsData.filter(vitals => {
    const matchesSearch = vitals.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vitals.room.includes(searchTerm) ||
                         vitals.patientId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || vitals.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "critical":
        return "destructive";
      case "abnormal":
        return "secondary";
      case "monitoring":
        return "secondary";
      default:
        return "outline";
    }
  };

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case "critical":
        return "bg-red-50";
      case "abnormal":
      case "monitoring":
        return "bg-yellow-50";
      default:
        return "";
    }
  };

  const stats = {
    critical: vitalsData.filter(v => v.status === "critical").length,
    abnormal: vitalsData.filter(v => v.status === "abnormal" || v.status === "monitoring").length,
    monitoring: vitalsData.length,
    readings: vitalsData.length * 5
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Vitals Monitoring</h2>
          <p className="text-sm text-muted-foreground">
            Real-time patient vital signs monitoring and tracking
          </p>
        </div>
        <Dialog open={isRecordVitalsOpen} onOpenChange={setIsRecordVitalsOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              Record Vitals
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Record Vital Signs</DialogTitle>
              <DialogDescription>
                Enter vital signs measurements for a patient
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleRecordVitals} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="patientId">Patient ID</Label>
                  <Input
                    id="patientId"
                    value={formData.patientId}
                    onChange={(e) => setFormData({...formData, patientId: e.target.value})}
                    placeholder="P001"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="patientName">Patient Name</Label>
                  <Input
                    id="patientName"
                    value={formData.patientName}
                    onChange={(e) => setFormData({...formData, patientName: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="room">Room</Label>
                  <Input
                    id="room"
                    value={formData.room}
                    onChange={(e) => setFormData({...formData, room: e.target.value})}
                    placeholder="205"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="heartRate">Heart Rate (BPM)</Label>
                  <Input
                    id="heartRate"
                    type="number"
                    value={formData.heartRate}
                    onChange={(e) => setFormData({...formData, heartRate: e.target.value})}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label htmlFor="systolicBP">Systolic BP</Label>
                    <Input
                      id="systolicBP"
                      type="number"
                      value={formData.systolicBP}
                      onChange={(e) => setFormData({...formData, systolicBP: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="diastolicBP">Diastolic BP</Label>
                    <Input
                      id="diastolicBP"
                      type="number"
                      value={formData.diastolicBP}
                      onChange={(e) => setFormData({...formData, diastolicBP: e.target.value})}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="temperature">Temperature (°F)</Label>
                  <Input
                    id="temperature"
                    type="number"
                    step="0.1"
                    value={formData.temperature}
                    onChange={(e) => setFormData({...formData, temperature: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="oxygenSaturation">O₂ Saturation (%)</Label>
                  <Input
                    id="oxygenSaturation"
                    type="number"
                    value={formData.oxygenSaturation}
                    onChange={(e) => setFormData({...formData, oxygenSaturation: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="respiratoryRate">Respiratory Rate</Label>
                  <Input
                    id="respiratoryRate"
                    type="number"
                    value={formData.respiratoryRate}
                    onChange={(e) => setFormData({...formData, respiratoryRate: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Input
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  placeholder="Any observations or notes"
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsRecordVitalsOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Record Vitals</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Alert Summary */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Alerts</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.critical}</div>
            <p className="text-xs text-muted-foreground">
              Require immediate attention
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Abnormal Readings</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.abnormal}</div>
            <p className="text-xs text-muted-foreground">
              Outside normal range
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monitoring</CardTitle>
            <Thermometer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.monitoring}</div>
            <p className="text-xs text-muted-foreground">
              Patients under monitoring
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Readings Today</CardTitle>
            <Droplets className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.readings}</div>
            <p className="text-xs text-muted-foreground">
              Vital signs recorded
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search patients, rooms..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
            <SelectItem value="abnormal">Abnormal</SelectItem>
            <SelectItem value="monitoring">Monitoring</SelectItem>
            <SelectItem value="normal">Normal</SelectItem>
            <SelectItem value="stable">Stable</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Critical Alerts */}
      {(stats.critical > 0 || stats.abnormal > 0) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-red-500" />
              Critical Vital Signs Alerts
            </CardTitle>
            <CardDescription>Patients requiring immediate attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {vitalsData
                .filter(v => v.status === "critical" || v.status === "abnormal")
                .map((vitals) => (
                <div key={vitals.id} className={`p-4 border rounded-lg ${getStatusBgColor(vitals.status)}`}>
                  <div className="flex items-start justify-between flex-col sm:flex-row gap-4">
                    <div className="space-y-2 flex-1">
                      <div>
                        <h4 className={`font-medium ${vitals.status === "critical" ? "text-red-900" : "text-yellow-900"}`}>
                          {vitals.patient} - Room {vitals.room}
                        </h4>
                        <p className={`text-sm ${vitals.status === "critical" ? "text-red-700" : "text-yellow-700"}`}>
                          {vitals.status === "critical" && "Blood Pressure: " + vitals.bloodPressure + " mmHg (Critical)"}
                          {vitals.status === "abnormal" && "Heart Rate: " + vitals.heartRate + " BPM (Abnormal)"}
                        </p>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm">
                        <span>Heart Rate: {vitals.heartRate} BPM</span>
                        <span>BP: {vitals.bloodPressure} mmHg</span>
                        <span>Temp: {vitals.temperature}°F</span>
                        <span>O₂ Sat: {vitals.oxygenSaturation}%</span>
                        <span>Resp: {vitals.respiratoryRate}</span>
                      </div>
                      <p className={`text-xs ${vitals.status === "critical" ? "text-red-600" : "text-yellow-600"}`}>
                        Last reading: {vitals.lastReading}
                      </p>
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                      <Button 
                        size="sm" 
                        variant={vitals.status === "critical" ? "destructive" : "default"}
                        onClick={() => handleAlertDoctor(vitals.patientId)}
                        className="flex-1 sm:flex-none"
                      >
                        Alert Doctor
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="flex-1 sm:flex-none"
                      >
                        Update Vitals
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Vital Signs */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Vital Signs</CardTitle>
          <CardDescription>Latest readings from all monitored patients</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {filteredVitals.map((vitals) => (
                <div key={vitals.id} className={`p-4 border rounded-lg ${getStatusBgColor(vitals.status)}`}>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-medium">{vitals.patient}</h4>
                      <p className="text-sm text-muted-foreground">Room {vitals.room}</p>
                    </div>
                    <Badge variant={getStatusColor(vitals.status)}>
                      {vitals.status}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-1">
                        <Heart className="h-3 w-3" />
                        Heart Rate
                      </span>
                      <span className="font-medium flex items-center gap-1">
                        {vitals.heartRate} BPM 
                        {vitals.trend === "up" && <TrendingUp className="h-3 w-3 text-red-500" />}
                        {vitals.trend === "down" && <TrendingDown className="h-3 w-3 text-green-500" />}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-1">
                        <Activity className="h-3 w-3" />
                        Blood Pressure
                      </span>
                      <span className="font-medium">{vitals.bloodPressure} mmHg</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-1">
                        <Thermometer className="h-3 w-3" />
                        Temperature
                      </span>
                      <span className="font-medium">{vitals.temperature}°F</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-1">
                        <Droplets className="h-3 w-3" />
                        O₂ Saturation
                      </span>
                      <span className="font-medium">{vitals.oxygenSaturation}%</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-1">
                        <Activity className="h-3 w-3" />
                        Respiratory Rate
                      </span>
                      <span className="font-medium">{vitals.respiratoryRate}</span>
                    </div>
                  </div>
                  {vitals.alerts.length > 0 && (
                    <div className="mt-2">
                      {vitals.alerts.map((alert, i) => (
                        <div key={i} className="text-xs flex items-center gap-1 text-red-600">
                          <AlertTriangle className="h-3 w-3" /> {alert}
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center justify-between mt-3">
                    <p className="text-xs text-muted-foreground">
                      {vitals.lastReading}
                    </p>
                    <Button size="sm" variant="outline" className="text-xs h-7">
                      History
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
