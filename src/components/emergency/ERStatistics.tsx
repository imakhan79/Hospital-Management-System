import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Users, Clock, TrendingUp, AlertTriangle, Bed, ArrowUpRight, ArrowDownRight } from "lucide-react";

export function ERStatistics() {
  // Mock statistical data
  const todayStats = {
    totalPatients: 47,
    averageWaitTime: 42, // minutes
    averageLengthOfStay: 185, // minutes
    bedOccupancyRate: 75, // percentage
    leftWithoutBeingSeen: 3,
    admissions: 12,
    transfers: 2,
    discharges: 30,
    mortalityCount: 0
  };

  const triageDistribution = [
    { name: "Level 1 (Critical)", value: 3, color: "#ef4444" },
    { name: "Level 2 (Urgent)", value: 8, color: "#f97316" },
    { name: "Level 3 (Less Urgent)", value: 18, color: "#eab308" },
    { name: "Level 4 (Non-urgent)", value: 18, color: "#22c55e" }
  ];

  const hourlyPatientFlow = [
    { hour: "00:00", arrivals: 2, discharges: 1 },
    { hour: "02:00", arrivals: 1, discharges: 0 },
    { hour: "04:00", arrivals: 2, discharges: 1 },
    { hour: "06:00", arrivals: 4, discharges: 2 },
    { hour: "08:00", arrivals: 6, discharges: 3 },
    { hour: "10:00", arrivals: 5, discharges: 4 },
    { hour: "12:00", arrivals: 7, discharges: 5 },
    { hour: "14:00", arrivals: 8, discharges: 6 },
    { hour: "16:00", arrivals: 6, discharges: 4 },
    { hour: "18:00", arrivals: 4, discharges: 3 },
    { hour: "20:00", arrivals: 3, discharges: 2 },
    { hour: "22:00", arrivals: 2, discharges: 1 }
  ];

  const commonComplaints = [
    { complaint: "Chest Pain", count: 8, percentage: 17.0 },
    { complaint: "Abdominal Pain", count: 6, percentage: 12.8 },
    { complaint: "Shortness of Breath", count: 5, percentage: 10.6 },
    { complaint: "Headache", count: 4, percentage: 8.5 },
    { complaint: "Fever", count: 4, percentage: 8.5 },
    { complaint: "Trauma/Injury", count: 3, percentage: 6.4 },
    { complaint: "Nausea/Vomiting", count: 3, percentage: 6.4 },
    { complaint: "Other", count: 14, percentage: 29.8 }
  ];

  const weeklyTrends = [
    { day: "Mon", patients: 52, avgWait: 38 },
    { day: "Tue", patients: 48, avgWait: 42 },
    { day: "Wed", patients: 55, avgWait: 45 },
    { day: "Thu", patients: 49, avgWait: 40 },
    { day: "Fri", patients: 58, avgWait: 48 },
    { day: "Sat", patients: 47, avgWait: 42 },
    { day: "Sun", patients: 44, avgWait: 35 }
  ];

  const getPerformanceIndicator = (current: number, target: number) => {
    const percentage = ((current - target) / target) * 100;
    return {
      percentage: Math.abs(percentage),
      trend: current <= target ? "down" : "up",
      status: current <= target ? "good" : "poor"
    };
  };

  const waitTimeIndicator = getPerformanceIndicator(todayStats.averageWaitTime, 30); // Target: 30 minutes
  const lengthOfStayIndicator = getPerformanceIndicator(todayStats.averageLengthOfStay, 150); // Target: 2.5 hours

  return (
    <div className="space-y-6">
      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <Users className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Patients Today</p>
                  <p className="text-2xl font-bold">{todayStats.totalPatients}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-green-600">
                <ArrowUpRight className="h-4 w-4" />
                <span className="text-sm">+12%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-500/10 rounded-lg">
                  <Clock className="h-5 w-5 text-orange-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Avg Wait Time</p>
                  <p className="text-2xl font-bold">{todayStats.averageWaitTime}m</p>
                </div>
              </div>
              <div className={`flex items-center gap-1 ${waitTimeIndicator.status === "good" ? "text-green-600" : "text-red-600"}`}>
                {waitTimeIndicator.trend === "up" ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                <span className="text-sm">{waitTimeIndicator.percentage.toFixed(0)}%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <Bed className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Bed Occupancy</p>
                  <p className="text-2xl font-bold">{todayStats.bedOccupancyRate}%</p>
                </div>
              </div>
              <Badge variant={todayStats.bedOccupancyRate > 80 ? "destructive" : "default"}>
                {todayStats.bedOccupancyRate > 80 ? "High" : "Normal"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-500/10 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-yellow-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">LWBS Rate</p>
                  <p className="text-2xl font-bold">{((todayStats.leftWithoutBeingSeen / todayStats.totalPatients) * 100).toFixed(1)}%</p>
                </div>
              </div>
              <Badge variant={todayStats.leftWithoutBeingSeen > 5 ? "destructive" : "default"}>
                {todayStats.leftWithoutBeingSeen} patients
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Triage Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Triage Level Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={triageDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {triageDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Patient Outcomes */}
        <Card>
          <CardHeader>
            <CardTitle>Patient Outcomes Today</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 border rounded-lg text-center">
                <p className="text-sm text-muted-foreground">Discharges</p>
                <p className="text-2xl font-bold text-green-600">{todayStats.discharges}</p>
                <p className="text-xs text-muted-foreground">{((todayStats.discharges / todayStats.totalPatients) * 100).toFixed(1)}%</p>
              </div>
              <div className="p-3 border rounded-lg text-center">
                <p className="text-sm text-muted-foreground">Admissions</p>
                <p className="text-2xl font-bold text-blue-600">{todayStats.admissions}</p>
                <p className="text-xs text-muted-foreground">{((todayStats.admissions / todayStats.totalPatients) * 100).toFixed(1)}%</p>
              </div>
              <div className="p-3 border rounded-lg text-center">
                <p className="text-sm text-muted-foreground">Transfers</p>
                <p className="text-2xl font-bold text-orange-600">{todayStats.transfers}</p>
                <p className="text-xs text-muted-foreground">{((todayStats.transfers / todayStats.totalPatients) * 100).toFixed(1)}%</p>
              </div>
              <div className="p-3 border rounded-lg text-center">
                <p className="text-sm text-muted-foreground">LWBS</p>
                <p className="text-2xl font-bold text-red-600">{todayStats.leftWithoutBeingSeen}</p>
                <p className="text-xs text-muted-foreground">{((todayStats.leftWithoutBeingSeen / todayStats.totalPatients) * 100).toFixed(1)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Hourly Patient Flow */}
      <Card>
        <CardHeader>
          <CardTitle>24-Hour Patient Flow</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourlyPatientFlow}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="arrivals" fill="#3b82f6" name="Arrivals" />
                <Bar dataKey="discharges" fill="#10b981" name="Discharges" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Common Chief Complaints */}
        <Card>
          <CardHeader>
            <CardTitle>Common Chief Complaints</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {commonComplaints.map((complaint, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">{complaint.complaint}</span>
                      <span className="text-sm text-muted-foreground">{complaint.count} ({complaint.percentage}%)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${complaint.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Weekly Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Patient Volume & Wait Times</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="patients" fill="#3b82f6" name="Patients" />
                  <Bar yAxisId="right" dataKey="avgWait" fill="#f59e0b" name="Avg Wait (min)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quality Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Quality & Performance Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Door-to-Provider Time</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Level 1 (Critical)</span>
                  <span className="font-medium">5 min</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: "100%" }}></div>
                </div>
                <p className="text-xs text-green-600">✓ Target: &lt;10 min</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Level 2 (Urgent)</span>
                  <span className="font-medium">18 min</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: "90%" }}></div>
                </div>
                <p className="text-xs text-green-600">✓ Target: &lt;20 min</p>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Length of Stay</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Discharged Patients</span>
                  <span className="font-medium">2.8 hours</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-yellow-500 h-2 rounded-full" style={{ width: "75%" }}></div>
                </div>
                <p className="text-xs text-yellow-600">⚠ Target: &lt;2.5 hours</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Admitted Patients</span>
                  <span className="font-medium">4.2 hours</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: "85%" }}></div>
                </div>
                <p className="text-xs text-green-600">✓ Target: &lt;5 hours</p>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Patient Satisfaction</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Overall Rating</span>
                  <span className="font-medium">4.3/5.0</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: "86%" }}></div>
                </div>
                <p className="text-xs text-green-600">✓ Target: &gt;4.0</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Would Recommend</span>
                  <span className="font-medium">87%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: "87%" }}></div>
                </div>
                <p className="text-xs text-green-600">✓ Target: &gt;80%</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}