
import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Ambulance, Bed, Users, ClipboardList, Activity, ChevronRight, TrendingUp, Clock } from "lucide-react";
import { ERDashboard } from "@/components/emergency/ERDashboard";
import { PatientIntake } from "@/components/emergency/PatientIntake";
import { TriageManagement } from "@/components/emergency/TriageManagement";
import { BedManagement } from "@/components/emergency/BedManagement";
import { EmergencyTracking } from "@/components/emergency/EmergencyTracking";
import { AmbulanceTracking } from "@/components/emergency/AmbulanceTracking";
import { VitalSigns } from "@/components/emergency/VitalSigns";
import { EmergencyOrders } from "@/components/emergency/EmergencyOrders";
import { ERStatistics } from "@/components/emergency/ERStatistics";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function EmergencyModule() {
  const [activeTab, setActiveTab] = useState("dashboard");

  const menuItems = [
    { value: "dashboard", label: "ER Dashboard", icon: <Activity className="w-4 h-4" /> },
    { value: "intake", label: "Patient Intake", icon: <Users className="w-4 h-4" /> },
    { value: "triage", label: "Triage (MTS)", icon: <AlertTriangle className="w-4 h-4" /> },
    { value: "tracking", label: "Tracking Board", icon: <ClipboardList className="w-4 h-4" /> },
    { value: "beds", label: "Bed Management", icon: <Bed className="w-4 h-4" /> },
    { value: "vitals", label: "ER Vital Signs", icon: <Activity className="w-4 h-4" /> },
    { value: "orders", label: "ER Orders", icon: <ClipboardList className="w-4 h-4" /> },
    { value: "ambulance", label: "Ambulance", icon: <Ambulance className="w-4 h-4" /> },
  ];

  return (
    <MainLayout noPadding>
      <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-slate-50/50">
        {/* Column 2: Emergency Submenu panel */}
        <aside className="w-72 flex-shrink-0 bg-white border-r shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-10 hidden md:flex flex-col">
          <div className="p-6">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight mb-6">Emergency Dept</h2>
            <div className="space-y-1">
              {menuItems.map((item) => (
                <button
                  key={item.value}
                  onClick={() => setActiveTab(item.value)}
                  className={cn(
                    "w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium transition-all group",
                    activeTab === item.value
                      ? "bg-red-50 text-red-700 border-l-4 border-red-600 rounded-l-none"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span className={cn(
                      "p-1.5 rounded-lg transition-colors",
                      activeTab === item.value ? "bg-red-100" : "bg-slate-100/50 group-hover:bg-slate-100"
                    )}>
                      {item.icon}
                    </span>
                    {item.label}
                  </div>
                  {activeTab === item.value && <ChevronRight className="w-4 h-4" />}
                </button>
              ))}
            </div>

            <div className="mt-8 space-y-2">
              <Button variant="destructive" size="sm" className="w-full justify-start gap-2 shadow-lg font-bold rounded-xl h-10">
                <AlertTriangle className="h-4 w-4" />
                EMERGENCY ALERT
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start gap-2 bg-white border-red-100 text-red-700 hover:bg-red-50 rounded-xl h-10 font-bold">
                <Ambulance className="h-4 w-4" />
                Call Ambulance
              </Button>
            </div>
          </div>

          <div className="mt-auto p-4 m-4 rounded-2xl bg-gradient-to-br from-red-600 to-red-700 text-white shadow-lg overflow-hidden relative">
            <div className="relative z-10">
              <p className="text-[10px] uppercase tracking-wider font-bold opacity-80">ER Status Update</p>
              <h3 className="text-lg font-bold mt-1">High Volume</h3>
              <div className="mt-2 text-xs opacity-90 leading-relaxed font-medium">
                Wait time: ~14 mins <br />
                Staff on duty: 12
              </div>
            </div>
            <Activity className="absolute -right-4 -bottom-4 w-24 h-24 opacity-10 rotate-12" />
          </div>
        </aside>

        {/* Column 3: Main Content area */}
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
          <ScrollArea className="flex-1">
            <div className="p-6">
              <div className="mb-6">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                  {activeTab === 'dashboard' ? 'Operations Center' :
                    activeTab === 'triage' ? 'Manchester Triage' :
                      activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                  {activeTab === 'dashboard' && <Badge className="bg-red-100 text-red-700 border-red-200">Live Board</Badge>}
                </h1>
                <p className="text-slate-500 font-medium">
                  Real-time emergency patient tracking and department logistics.
                </p>
              </div>

              {/* Quick Stats - MTS Overview */}
              {activeTab === 'dashboard' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                  <Card className="bg-white border-white shadow-[0_4px_20px_rgba(0,0,0,0.03)] group transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-red-100 rounded-2xl group-hover:scale-110 transition-transform">
                          <AlertTriangle className="h-5 w-5 text-red-600" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Immediate</p>
                          <p className="text-2xl font-black text-red-700">2</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white border-white shadow-[0_4px_20px_rgba(0,0,0,0.03)] group transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-orange-100 rounded-2xl group-hover:scale-110 transition-transform">
                          <Activity className="h-5 w-5 text-orange-600" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Very Urgent</p>
                          <p className="text-2xl font-black text-orange-700">5</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white border-white shadow-[0_4px_20px_rgba(0,0,0,0.03)] group transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-yellow-100 rounded-2xl group-hover:scale-110 transition-transform">
                          <ClipboardList className="h-5 w-5 text-yellow-600" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Urgent</p>
                          <p className="text-2xl font-black text-yellow-700">8</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white border-white shadow-[0_4px_20px_rgba(0,0,0,0.03)] group transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-green-100 rounded-2xl group-hover:scale-110 transition-transform">
                          <Users className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Standard</p>
                          <p className="text-2xl font-black text-green-700">14</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white border-white shadow-[0_4px_20px_rgba(0,0,0,0.03)] group transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-blue-100 rounded-2xl group-hover:scale-110 transition-transform">
                          <Bed className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Occupancy</p>
                          <p className="text-2xl font-black text-blue-700">82%</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              <div className="mt-0">
                {activeTab === 'dashboard' && (
                  <div className="space-y-6">
                    <ERDashboard />
                    <Card className="bg-white border-white shadow-sm overflow-hidden rounded-2xl">
                      <CardHeader className="bg-slate-50/50 border-b">
                        <CardTitle className="text-lg font-black text-slate-900 uppercase tracking-tight">ER Statistics</CardTitle>
                      </CardHeader>
                      <CardContent className="p-6">
                        <ERStatistics />
                      </CardContent>
                    </Card>
                  </div>
                )}
                {activeTab === 'intake' && <PatientIntake />}
                {activeTab === 'triage' && <TriageManagement />}
                {activeTab === 'beds' && <BedManagement />}
                {activeTab === 'tracking' && <EmergencyTracking />}
                {activeTab === 'ambulance' && <AmbulanceTracking />}
                {activeTab === 'vitals' && <VitalSigns />}
                {activeTab === 'orders' && <EmergencyOrders />}
              </div>
            </div>
          </ScrollArea>
        </main>
      </div>
    </MainLayout>
  );
}