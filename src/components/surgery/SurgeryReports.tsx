
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart3, Download, TrendingUp, TrendingDown, Calendar, FileText, Users, Clock } from "lucide-react";

export const SurgeryReports = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [selectedReport, setSelectedReport] = useState("overview");

  const kpiData = {
    month: {
      surgeries: 247,
      surgeryChange: 12,
      successRate: 98.8,
      successChange: 0.3,
      avgDuration: "2h 45m",
      durationChange: -15,
      utilization: 87,
      utilizationChange: 5
    },
    quarter: {
      surgeries: 742,
      surgeryChange: 18,
      successRate: 98.5,
      successChange: 0.1,
      avgDuration: "2h 50m",
      durationChange: -8,
      utilization: 85,
      utilizationChange: 3
    },
    year: {
      surgeries: 2847,
      surgeryChange: 15,
      successRate: 98.2,
      successChange: 0.5,
      avgDuration: "2h 55m",
      durationChange: -12,
      utilization: 83,
      utilizationChange: 7
    }
  };

  const currentData = kpiData[selectedPeriod as keyof typeof kpiData];

  const surgeonPerformance = [
    { name: "Dr. Sarah Johnson", surgeries: 45, successRate: 99.2, avgDuration: "2h 15m" },
    { name: "Dr. Michael Chen", surgeries: 38, successRate: 98.5, avgDuration: "3h 45m" },
    { name: "Dr. Emily Wilson", surgeries: 52, successRate: 99.8, avgDuration: "1h 30m" },
    { name: "Dr. David Lee", surgeries: 41, successRate: 98.1, avgDuration: "2h 00m" },
    { name: "Dr. Robert Brown", surgeries: 35, successRate: 97.8, avgDuration: "2h 30m" }
  ];

  const procedureTypes = [
    { name: "Appendectomy", percentage: 35, count: 86 },
    { name: "Cardiac Surgery", percentage: 25, count: 62 },
    { name: "Orthopedic", percentage: 20, count: 49 },
    { name: "General Surgery", percentage: 15, count: 37 },
    { name: "Other", percentage: 5, count: 13 }
  ];

  const waitTimeMetrics = {
    avgWaitTime: "4.2 days",
    emergencyResponse: "< 2 hours",
    schedulingAccuracy: "94.3%",
    onTimeStarts: "91.7%"
  };

  const qualityMetrics = {
    infectionRate: "0.8%",
    readmissionRate: "2.1%",
    patientSatisfaction: "4.8/5",
    complicationRate: "1.2%"
  };

  const exportReport = () => {
    // Simulate report export
    console.log(`Exporting ${selectedReport} report for ${selectedPeriod}`);
  };

  return (
    <div className="space-y-4 sm:space-y-6 p-2 sm:p-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Surgery Reports & Analytics</h2>
          <p className="text-sm text-muted-foreground">
            Comprehensive surgical department performance metrics
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-full sm:w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={exportReport} className="w-full sm:w-auto">
            <Download className="mr-2 h-4 w-4" />
            Export Reports
          </Button>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Surgeries</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{currentData.surgeries}</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              +{currentData.surgeryChange}% from last {selectedPeriod}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{currentData.successRate}%</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              +{currentData.successChange}% from last {selectedPeriod}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Duration</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{currentData.avgDuration}</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingDown className="h-3 w-3 mr-1 text-green-500" />
              {currentData.durationChange}m from last {selectedPeriod}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">OT Utilization</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{currentData.utilization}%</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              +{currentData.utilizationChange}% from last {selectedPeriod}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Report Type Selection */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base sm:text-lg">Report Categories</CardTitle>
          <CardDescription className="text-sm">Select different report types to view detailed analytics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
            <Button
              variant={selectedReport === "overview" ? "default" : "outline"}
              onClick={() => setSelectedReport("overview")}
              className="text-xs sm:text-sm"
            >
              <BarChart3 className="mr-2 h-4 w-4" />
              Overview
            </Button>
            <Button
              variant={selectedReport === "surgeon" ? "default" : "outline"}
              onClick={() => setSelectedReport("surgeon")}
              className="text-xs sm:text-sm"
            >
              <Users className="mr-2 h-4 w-4" />
              Surgeon Performance
            </Button>
            <Button
              variant={selectedReport === "procedures" ? "default" : "outline"}
              onClick={() => setSelectedReport("procedures")}
              className="text-xs sm:text-sm"
            >
              <FileText className="mr-2 h-4 w-4" />
              Procedures
            </Button>
            <Button
              variant={selectedReport === "efficiency" ? "default" : "outline"}
              onClick={() => setSelectedReport("efficiency")}
              className="text-xs sm:text-sm"
            >
              <Clock className="mr-2 h-4 w-4" />
              Efficiency
            </Button>
            <Button
              variant={selectedReport === "quality" ? "default" : "outline"}
              onClick={() => setSelectedReport("quality")}
              className="text-xs sm:text-sm"
            >
              <TrendingUp className="mr-2 h-4 w-4" />
              Quality
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Charts and Analytics */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base sm:text-lg">Surgery Volume Trends</CardTitle>
            <CardDescription className="text-sm">Surgery count over time period</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] sm:h-[300px] flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg">
              <div className="text-center">
                <BarChart3 className="h-8 sm:h-12 w-8 sm:w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Surgery volume chart</p>
                <p className="text-xs text-gray-400 mt-1">
                  Showing {currentData.surgeries} surgeries for selected period
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base sm:text-lg">Procedure Types Distribution</CardTitle>
            <CardDescription className="text-sm">Breakdown of surgery types performed</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 sm:space-y-4">
              {procedureTypes.map((procedure, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm">{procedure.name}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 sm:w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          index === 0 ? 'bg-blue-600' :
                          index === 1 ? 'bg-green-600' :
                          index === 2 ? 'bg-yellow-600' :
                          index === 3 ? 'bg-purple-600' : 'bg-red-600'
                        }`}
                        style={{width: `${procedure.percentage}%`}}
                      ></div>
                    </div>
                    <span className="text-xs sm:text-sm text-muted-foreground w-8 text-right">
                      {procedure.percentage}%
                    </span>
                    <span className="text-xs text-muted-foreground w-8 text-right">
                      ({procedure.count})
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Reports based on selection */}
      {selectedReport === "surgeon" && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base sm:text-lg">Surgeon Performance Analysis</CardTitle>
            <CardDescription className="text-sm">Individual surgeon metrics and statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3">
              {surgeonPerformance.map((surgeon, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="space-y-1">
                    <div className="font-medium text-sm">{surgeon.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {surgeon.surgeries} surgeries | Avg: {surgeon.avgDuration}
                    </div>
                  </div>
                  <Badge variant={surgeon.successRate > 99 ? "default" : "secondary"}>
                    {surgeon.successRate}%
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {selectedReport === "efficiency" && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base sm:text-lg">Efficiency Metrics</CardTitle>
            <CardDescription className="text-sm">Surgery scheduling and time management analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2">
                <div className="text-sm font-medium">Average Wait Time</div>
                <div className="text-xl sm:text-2xl font-bold">{waitTimeMetrics.avgWaitTime}</div>
                <div className="text-xs text-muted-foreground">For non-emergency procedures</div>
              </div>
              <div className="space-y-2">
                <div className="text-sm font-medium">Emergency Response</div>
                <div className="text-xl sm:text-2xl font-bold">{waitTimeMetrics.emergencyResponse}</div>
                <div className="text-xs text-muted-foreground">Average response time</div>
              </div>
              <div className="space-y-2">
                <div className="text-sm font-medium">Scheduling Accuracy</div>
                <div className="text-xl sm:text-2xl font-bold">{waitTimeMetrics.schedulingAccuracy}</div>
                <div className="text-xs text-muted-foreground">Procedures on scheduled time</div>
              </div>
              <div className="space-y-2">
                <div className="text-sm font-medium">On-time Starts</div>
                <div className="text-xl sm:text-2xl font-bold">{waitTimeMetrics.onTimeStarts}</div>
                <div className="text-xs text-muted-foreground">Surgeries starting on time</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {selectedReport === "quality" && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base sm:text-lg">Quality & Safety Metrics</CardTitle>
            <CardDescription className="text-sm">Patient outcomes and safety indicators</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2">
                <div className="text-sm font-medium">Infection Rate</div>
                <div className="text-xl sm:text-2xl font-bold text-green-600">{qualityMetrics.infectionRate}</div>
                <div className="text-xs text-muted-foreground">Post-surgical infections</div>
              </div>
              <div className="space-y-2">
                <div className="text-sm font-medium">Readmission Rate</div>
                <div className="text-xl sm:text-2xl font-bold text-green-600">{qualityMetrics.readmissionRate}</div>
                <div className="text-xs text-muted-foreground">30-day readmissions</div>
              </div>
              <div className="space-y-2">
                <div className="text-sm font-medium">Patient Satisfaction</div>
                <div className="text-xl sm:text-2xl font-bold">{qualityMetrics.patientSatisfaction}</div>
                <div className="text-xs text-muted-foreground">Average patient rating</div>
              </div>
              <div className="space-y-2">
                <div className="text-sm font-medium">Complication Rate</div>
                <div className="text-xl sm:text-2xl font-bold text-green-600">{qualityMetrics.complicationRate}</div>
                <div className="text-xs text-muted-foreground">Intraoperative complications</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Export Options */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base sm:text-lg">Export Options</CardTitle>
          <CardDescription className="text-sm">Download detailed reports and analytics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 sm:gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            <Button variant="outline" className="w-full justify-start text-sm" onClick={exportReport}>
              <FileText className="mr-2 h-4 w-4" />
              Comprehensive Report
            </Button>
            <Button variant="outline" className="w-full justify-start text-sm" onClick={exportReport}>
              <BarChart3 className="mr-2 h-4 w-4" />
              Performance Analytics
            </Button>
            <Button variant="outline" className="w-full justify-start text-sm" onClick={exportReport}>
              <Calendar className="mr-2 h-4 w-4" />
              Schedule Report
            </Button>
            <Button variant="outline" className="w-full justify-start text-sm" onClick={exportReport}>
              <Users className="mr-2 h-4 w-4" />
              Staff Performance
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
