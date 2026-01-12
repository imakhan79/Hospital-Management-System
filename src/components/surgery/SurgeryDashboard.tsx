
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Users, AlertTriangle, TrendingUp, Activity } from "lucide-react";

export const SurgeryDashboard = () => {
  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Surgeries</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              +2 from yesterday
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">OT Utilization</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87%</div>
            <p className="text-xs text-muted-foreground">
              +5% from last week
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Emergency Cases</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              Requires immediate attention
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98.2%</div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Current OT Status */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">OT Status</CardTitle>
            <CardDescription>Real-time operation theater status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">OT-1</span>
              <Badge variant="destructive">In Progress</Badge>
            </div>
            <div className="text-sm text-muted-foreground">
              Appendectomy - Dr. Smith
            </div>
            <div className="text-xs text-muted-foreground">
              Started: 09:30 AM | Est. End: 11:00 AM
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">OT-2</span>
              <Badge variant="secondary">Scheduled</Badge>
            </div>
            <div className="text-sm text-muted-foreground">
              Cardiac Surgery - Dr. Johnson
            </div>
            <div className="text-xs text-muted-foreground">
              Scheduled: 12:00 PM
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">OT-3</span>
              <Badge>Available</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Today's Schedule</CardTitle>
            <CardDescription>Upcoming surgeries</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">10:30 AM</span>
              </div>
              <div className="text-sm">Knee Replacement - Room 2</div>
              <div className="text-xs text-muted-foreground">Dr. Wilson | Patient: John Doe</div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">2:00 PM</span>
                <Badge variant="outline" className="text-xs">Emergency</Badge>
              </div>
              <div className="text-sm">Emergency Trauma - Room 1</div>
              <div className="text-xs text-muted-foreground">Dr. Brown | Patient: Jane Smith</div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">4:30 PM</span>
              </div>
              <div className="text-sm">Gallbladder Surgery - Room 3</div>
              <div className="text-xs text-muted-foreground">Dr. Davis | Patient: Mike Johnson</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Critical Alerts</CardTitle>
            <CardDescription>Immediate attention required</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
              <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5" />
              <div className="space-y-1">
                <div className="text-sm font-medium text-red-900">
                  Emergency Surgery Required
                </div>
                <div className="text-xs text-red-700">
                  Patient ID: #2847 - Severe abdominal pain
                </div>
                <Button size="sm" variant="destructive" className="mt-2">
                  Schedule Emergency OT
                </Button>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
              <Clock className="h-4 w-4 text-yellow-500 mt-0.5" />
              <div className="space-y-1">
                <div className="text-sm font-medium text-yellow-900">
                  Surgery Delayed
                </div>
                <div className="text-xs text-yellow-700">
                  OT-2 running 30 mins behind schedule
                </div>
                <Button size="sm" variant="outline" className="mt-2">
                  Reschedule
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Surgeon Availability */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Surgeon Availability</CardTitle>
          <CardDescription>Current status of surgical team</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <div className="h-2 w-2 bg-green-500 rounded-full"></div>
              <div>
                <div className="text-sm font-medium">Dr. Smith</div>
                <div className="text-xs text-muted-foreground">Available</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <div className="h-2 w-2 bg-red-500 rounded-full"></div>
              <div>
                <div className="text-sm font-medium">Dr. Johnson</div>
                <div className="text-xs text-muted-foreground">In Surgery</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <div className="h-2 w-2 bg-yellow-500 rounded-full"></div>
              <div>
                <div className="text-sm font-medium">Dr. Wilson</div>
                <div className="text-xs text-muted-foreground">On Break</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <div className="h-2 w-2 bg-green-500 rounded-full"></div>
              <div>
                <div className="text-sm font-medium">Dr. Brown</div>
                <div className="text-xs text-muted-foreground">Available</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <div className="h-2 w-2 bg-gray-500 rounded-full"></div>
              <div>
                <div className="text-sm font-medium">Dr. Davis</div>
                <div className="text-xs text-muted-foreground">Off Duty</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
