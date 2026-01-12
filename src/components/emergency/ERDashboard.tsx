import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Clock, User, Bed } from "lucide-react";

interface ERPatient {
  id: string;
  erNumber: string;
  patientName: string;
  triageLevel: number;
  chiefComplaint: string;
  arrivalTime: string;
  waitTime: number;
  bedNumber?: string;
  status: string;
}

export function ERDashboard() {
  // Mock data - replace with actual API calls
  const criticalPatients: ERPatient[] = [
    {
      id: "1",
      erNumber: "ER-001",
      patientName: "Ahmad Hassan",
      triageLevel: 1,
      chiefComplaint: "Chest pain",
      arrivalTime: "2024-01-04 14:30",
      waitTime: 15,
      bedNumber: "ER-T1",
      status: "in_treatment"
    },
    {
      id: "2",
      erNumber: "ER-002",
      patientName: "Fatima Ali",
      triageLevel: 2,
      chiefComplaint: "Severe abdominal pain",
      arrivalTime: "2024-01-04 14:45",
      waitTime: 30,
      status: "waiting"
    }
  ];

  const getTriageColor = (level: number) => {
    switch (level) {
      case 1: return "destructive";
      case 2: return "secondary";
      case 3: return "outline";
      case 4: return "outline";
      default: return "outline";
    }
  };

  const getTriageLabel = (level: number) => {
    switch (level) {
      case 1: return "Critical";
      case 2: return "Urgent";
      case 3: return "Less Urgent";
      case 4: return "Non-urgent";
      default: return "Unassigned";
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Critical Patients */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Critical Patients
            </CardTitle>
            <Badge variant="destructive">{criticalPatients.length}</Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            {criticalPatients.map((patient) => (
              <div key={patient.id} className="p-4 border rounded-lg space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold">{patient.patientName}</h4>
                    <p className="text-sm text-muted-foreground">{patient.erNumber}</p>
                  </div>
                  <Badge variant={getTriageColor(patient.triageLevel)}>
                    {getTriageLabel(patient.triageLevel)}
                  </Badge>
                </div>
                <p className="text-sm">{patient.chiefComplaint}</p>
                <div className="flex justify-between items-center text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {patient.waitTime}m wait
                  </span>
                  {patient.bedNumber && (
                    <span className="flex items-center gap-1">
                      <Bed className="h-3 w-3" />
                      {patient.bedNumber}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Real-time Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Real-time Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-950/30 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Patient discharged</p>
                  <p className="text-xs text-muted-foreground">ER-G3 - Zainab Ahmed - 2 minutes ago</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">New patient arrival</p>
                  <p className="text-xs text-muted-foreground">Walk-in - Usman Khan - 5 minutes ago</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-orange-50 dark:bg-orange-950/30 rounded-lg">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Bed assignment</p>
                  <p className="text-xs text-muted-foreground">ER-G2 assigned - 8 minutes ago</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-red-50 dark:bg-red-950/30 rounded-lg">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Emergency alert</p>
                  <p className="text-xs text-muted-foreground">Code Blue - ER-T2 - 12 minutes ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bed Status Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Bed Status Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium text-sm text-muted-foreground">RED ZONE (Critical)</h4>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2 border rounded bg-red-50 dark:bg-red-950/30 text-center">
                  <div className="text-xs">ER-T1</div>
                  <div className="text-xs text-muted-foreground">Occupied</div>
                </div>
                <div className="p-2 border rounded bg-red-50 dark:bg-red-950/30 text-center">
                  <div className="text-xs">ER-T2</div>
                  <div className="text-xs text-muted-foreground">Occupied</div>
                </div>
                <div className="p-2 border rounded text-center">
                  <div className="text-xs">ER-ISO1</div>
                  <div className="text-xs text-green-600">Available</div>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-sm text-muted-foreground">YELLOW ZONE (Urgent)</h4>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2 border rounded bg-yellow-50 dark:bg-yellow-950/30 text-center">
                  <div className="text-xs">ER-G1</div>
                  <div className="text-xs text-muted-foreground">Occupied</div>
                </div>
                <div className="p-2 border rounded text-center">
                  <div className="text-xs">ER-G2</div>
                  <div className="text-xs text-green-600">Available</div>
                </div>
                <div className="p-2 border rounded bg-yellow-50 dark:bg-yellow-950/30 text-center">
                  <div className="text-xs">ER-G3</div>
                  <div className="text-xs text-muted-foreground">Occupied</div>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-sm text-muted-foreground">GREEN ZONE (Non-urgent)</h4>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2 border rounded text-center">
                  <div className="text-xs">ER-G4</div>
                  <div className="text-xs text-green-600">Available</div>
                </div>
                <div className="p-2 border rounded text-center">
                  <div className="text-xs">ER-G5</div>
                  <div className="text-xs text-green-600">Available</div>
                </div>
                <div className="p-2 border rounded text-center">
                  <div className="text-xs">ER-PED1</div>
                  <div className="text-xs text-green-600">Available</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}