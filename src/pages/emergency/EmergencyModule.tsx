import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Ambulance, Bed, Users, ClipboardList, Activity } from "lucide-react";
import { ERDashboard } from "@/components/emergency/ERDashboard";
import { PatientIntake } from "@/components/emergency/PatientIntake";
import { TriageManagement } from "@/components/emergency/TriageManagement";
import { BedManagement } from "@/components/emergency/BedManagement";
import { EmergencyTracking } from "@/components/emergency/EmergencyTracking";
import { AmbulanceTracking } from "@/components/emergency/AmbulanceTracking";
import { VitalSigns } from "@/components/emergency/VitalSigns";
import { EmergencyOrders } from "@/components/emergency/EmergencyOrders";
import { ERStatistics } from "@/components/emergency/ERStatistics";

export default function EmergencyModule() {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <MainLayout>
      <div className="flex h-[calc(100vh-64px)] flex-col lg:flex-row gap-0 overflow-hidden">
        {/* Left Sidebar Menu */}
        <aside className="w-full lg:w-64 flex-shrink-0 border-r bg-slate-50/50 overflow-y-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} orientation="vertical" className="h-full flex flex-col">
            <div className="p-4">
              <div className="flex items-center gap-2 px-2 mb-4">
                <div className="p-1.5 bg-red-100 rounded-lg">
                  <Activity className="h-5 w-5 text-red-600" />
                </div>
                <h2 className="font-semibold text-lg">Emergency Dept</h2>
              </div>

              <TabsList className="flex flex-col h-auto bg-transparent space-y-1 w-full p-0">
                <TabsTrigger value="dashboard" className="w-full justify-start px-3 py-2 h-9 text-left font-medium rounded-md hover:bg-slate-100 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  <Activity className="w-4 h-4 mr-2" /> Dashboard
                </TabsTrigger>
                <TabsTrigger value="intake" className="w-full justify-start px-3 py-2 h-9 text-left font-medium rounded-md hover:bg-slate-100 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  <Users className="w-4 h-4 mr-2" /> Patient Intake
                </TabsTrigger>
                <TabsTrigger value="triage" className="w-full justify-start px-3 py-2 h-9 text-left font-medium rounded-md hover:bg-slate-100 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  <AlertTriangle className="w-4 h-4 mr-2" /> Triage (MTS)
                </TabsTrigger>
                <TabsTrigger value="tracking" className="w-full justify-start px-3 py-2 h-9 text-left font-medium rounded-md hover:bg-slate-100 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  <ClipboardList className="w-4 h-4 mr-2" /> Tracking
                </TabsTrigger>
                <TabsTrigger value="beds" className="w-full justify-start px-3 py-2 h-9 text-left font-medium rounded-md hover:bg-slate-100 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  <Bed className="w-4 h-4 mr-2" /> Bed Mgmt
                </TabsTrigger>
                <TabsTrigger value="vitals" className="w-full justify-start px-3 py-2 h-9 text-left font-medium rounded-md hover:bg-slate-100 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  <Activity className="w-4 h-4 mr-2" /> Vital Signs
                </TabsTrigger>
                <TabsTrigger value="orders" className="w-full justify-start px-3 py-2 h-9 text-left font-medium rounded-md hover:bg-slate-100 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  <ClipboardList className="w-4 h-4 mr-2" /> Orders
                </TabsTrigger>
                <TabsTrigger value="ambulance" className="w-full justify-start px-3 py-2 h-9 text-left font-medium rounded-md hover:bg-slate-100 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  <Ambulance className="w-4 h-4 mr-2" /> Ambulance
                </TabsTrigger>
              </TabsList>

              <div className="mt-8 px-2 space-y-2">
                <Button variant="destructive" size="sm" className="w-full justify-start gap-2 shadow-sm">
                  <AlertTriangle className="h-4 w-4" />
                  EMERGENCY ALERT
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start gap-2 bg-white">
                  <Ambulance className="h-4 w-4 text-blue-600" />
                  Call Ambulance
                </Button>
              </div>
            </div>
          </Tabs>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto bg-slate-50/30 p-4 lg:p-6 h-full">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  {activeTab === 'dashboard' ? 'ER Operations Center' :
                    activeTab === 'triage' ? 'Manchester Triage System' :
                      activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                </h1>
                <p className="text-sm text-muted-foreground mt-0.5">
                  ER Patient management and real-time tracking
                </p>
              </div>
            </div>

            {/* Quick Stats - MTS Overview (Always visible on Dashboard, optional on others) */}
            {activeTab === 'dashboard' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <Card className="bg-red-50 border-red-200">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-red-500/10 rounded-lg">
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                      </div>
                      <div>
                        <p className="text-sm text-red-700 font-medium">Immediate (Red)</p>
                        <p className="text-2xl font-bold text-red-700">2</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-orange-50 border-orange-200">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-orange-500/10 rounded-lg">
                        <Activity className="h-5 w-5 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-sm text-orange-700 font-medium">Very Urgent</p>
                        <p className="text-2xl font-bold text-orange-700">5</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-yellow-50 border-yellow-200">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-yellow-500/10 rounded-lg">
                        <ClipboardList className="h-5 w-5 text-yellow-600" />
                      </div>
                      <div>
                        <p className="text-sm text-yellow-700 font-medium">Urgent</p>
                        <p className="text-2xl font-bold text-yellow-700">8</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-green-50 border-green-200">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-500/10 rounded-lg">
                        <Users className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-green-700 font-medium">Standard</p>
                        <p className="text-2xl font-bold text-green-700">14</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white border-slate-200">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-500/10 rounded-lg">
                        <Bed className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground font-medium">Total Waiting</p>
                        <p className="text-2xl font-bold">29</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            <Tabs value={activeTab} className="mt-0">
              <TabsContent value="dashboard" className="mt-0 space-y-6">
                <ERDashboard />
                <Card>
                  <CardHeader>
                    <CardTitle>Emergency Department Statistics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ERStatistics />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="intake" className="mt-0">
                <PatientIntake />
              </TabsContent>

              <TabsContent value="triage" className="mt-0">
                <TriageManagement />
              </TabsContent>

              <TabsContent value="beds" className="mt-0">
                <BedManagement />
              </TabsContent>

              <TabsContent value="tracking" className="mt-0">
                <EmergencyTracking />
              </TabsContent>

              <TabsContent value="ambulance" className="mt-0">
                <AmbulanceTracking />
              </TabsContent>

              <TabsContent value="vitals" className="mt-0">
                <VitalSigns />
              </TabsContent>

              <TabsContent value="orders" className="mt-0">
                <EmergencyOrders />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </MainLayout>
  );
}