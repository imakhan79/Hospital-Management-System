
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bed, Users, AlertTriangle, TrendingUp, Activity, Clock } from "lucide-react";

export const IPDDashboard = () => {
  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">
              +8 new admissions today
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bed Occupancy</CardTitle>
            <Bed className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89%</div>
            <p className="text-xs text-muted-foreground">
              178/200 beds occupied
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Patients</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-muted-foreground">
              Requires intensive monitoring
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Stay Duration</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.2</div>
            <p className="text-xs text-muted-foreground">
              days (this month)
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Ward Status */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Ward Occupancy</CardTitle>
            <CardDescription>Real-time bed availability</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">General Ward</span>
                <Badge variant="secondary">45/50</Badge>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{width: '90%'}}></div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">ICU</span>
                <Badge variant="destructive">18/20</Badge>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-red-600 h-2 rounded-full" style={{width: '90%'}}></div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Pediatric Ward</span>
                <Badge>22/30</Badge>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{width: '73%'}}></div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Maternity Ward</span>
                <Badge>15/25</Badge>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{width: '60%'}}></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Today's Activities</CardTitle>
            <CardDescription>Patient care activities</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium">8 New Admissions</span>
              </div>
              <div className="text-xs text-muted-foreground">Last admission: 2 hours ago</div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium">5 Discharges</span>
              </div>
              <div className="text-xs text-muted-foreground">Discharge planning: 12 patients</div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-orange-500" />
                <span className="text-sm font-medium">3 Room Transfers</span>
              </div>
              <div className="text-xs text-muted-foreground">Pending approval: 1 transfer</div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-purple-500" />
                <span className="text-sm font-medium">24 Medication Rounds</span>
              </div>
              <div className="text-xs text-muted-foreground">Next round in 45 minutes</div>
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
                  Critical Patient Alert
                </div>
                <div className="text-xs text-red-700">
                  Room 205: Patient vitals deteriorating
                </div>
                <Button size="sm" variant="destructive" className="mt-2">
                  Respond
                </Button>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
              <Clock className="h-4 w-4 text-yellow-500 mt-0.5" />
              <div className="space-y-1">
                <div className="text-sm font-medium text-yellow-900">
                  Medication Due
                </div>
                <div className="text-xs text-yellow-700">
                  5 patients have overdue medications
                </div>
                <Button size="sm" variant="outline" className="mt-2">
                  Review
                </Button>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
              <Bed className="h-4 w-4 text-blue-500 mt-0.5" />
              <div className="space-y-1">
                <div className="text-sm font-medium text-blue-900">
                  Bed Request
                </div>
                <div className="text-xs text-blue-700">
                  Emergency admission waiting for ICU bed
                </div>
                <Button size="sm" variant="outline" className="mt-2">
                  Allocate Bed
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Nursing Staff Status */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Nursing Staff Status</CardTitle>
          <CardDescription>Current shift and availability</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <div className="text-sm font-medium">General Ward</div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                <span className="text-xs">6/6 nurses on duty</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="text-sm font-medium">ICU</div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 bg-yellow-500 rounded-full"></div>
                <span className="text-xs">4/5 nurses on duty</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="text-sm font-medium">Pediatric</div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                <span className="text-xs">4/4 nurses on duty</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="text-sm font-medium">Maternity</div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                <span className="text-xs">3/3 nurses on duty</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
