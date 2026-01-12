
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MainLayout from "@/components/layout/MainLayout";
import { OPDDashboard } from "@/components/opd/OPDDashboard";
import { AppointmentBooking } from "@/components/opd/AppointmentBooking";
import { QueueManagement } from "@/components/opd/QueueManagement";
import { PatientCheck } from "@/components/opd/PatientCheck";
import { VideoConsultation } from "@/components/opd/VideoConsultation";
import { OPDReports } from "@/components/opd/OPDReports";

import { VitalsStation } from "@/components/opd/VitalsStation";
import { DoctorStation } from "@/components/opd/DoctorStation";
import { PharmacyStation } from "@/components/opd/PharmacyStation";
import { BillingStation } from "@/components/opd/BillingStation";
import { LabStation } from "@/components/opd/LabStation";
import { OPDProvider, useOPD } from "@/contexts/OPDContext";
import { Badge } from "@/components/ui/badge";
import {
  MoveRight,
  User,
  LayoutDashboard,
  Calendar,
  UserPlus,
  Activity,
  Users,
  Stethoscope,
  Pill,
  FlaskConical,
  Receipt,
  Video,
  FileText,
  ChevronRight,
  LogOut,
  Settings
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const OPDModuleContent = () => {
  const { activeVisit, nextAction, setActiveVisit } = useOPD();
  const [activeTab, setActiveTab] = useState("dashboard");

  const handleContinueWorkflow = () => {
    if (nextAction) {
      setActiveTab(nextAction.tab);
    }
  };

  const menuItems = [
    { value: "dashboard", label: "Dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
    { value: "booking", label: "Book Appointment", icon: <Calendar className="w-4 h-4" /> },
    { value: "checkin", label: "Patient Check-in", icon: <UserPlus className="w-4 h-4" /> },
    { value: "vitals", label: "Vitals Station", icon: <Activity className="w-4 h-4" /> },
    { value: "queue", label: "Queue Management", icon: <Users className="w-4 h-4" /> },
    { value: "doctor", label: "Doctor's Desk", icon: <Stethoscope className="w-4 h-4" /> },
    { value: "pharmacy", label: "Pharmacy", icon: <Pill className="w-4 h-4" /> },
    { value: "lab", label: "Lab & Radiology", icon: <FlaskConical className="w-4 h-4" /> },
    { value: "billing", label: "Billing", icon: <Receipt className="w-4 h-4" /> },
    { value: "video", label: "Video Consultation", icon: <Video className="w-4 h-4" /> },
    { value: "reports", label: "Reports", icon: <FileText className="w-4 h-4" /> },
  ];

  return (
    <MainLayout noPadding>
      <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-slate-50/50">
        {/* Column 2: OPD Submenu panel (white) */}
        <aside className="w-72 flex-shrink-0 bg-white border-r shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-10 hidden md:flex flex-col">
          <div className="p-6">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight mb-6">OPD Menu</h2>
            <div className="space-y-1">
              {menuItems.map((item) => (
                <button
                  key={item.value}
                  onClick={() => setActiveTab(item.value)}
                  className={cn(
                    "w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium transition-all group",
                    activeTab === item.value
                      ? "bg-primary/5 text-primary border-l-4 border-primary rounded-l-none"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span className={cn(
                      "p-1.5 rounded-lg transition-colors",
                      activeTab === item.value ? "bg-primary/10" : "bg-slate-100/50 group-hover:bg-slate-100"
                    )}>
                      {item.icon}
                    </span>
                    {item.label}
                  </div>
                  {activeTab === item.value && <ChevronRight className="w-4 h-4" />}
                </button>
              ))}
            </div>
          </div>

          {/* Active Visit Context at bottom of Submenu */}
          {activeVisit && (
            <div className="mt-auto p-4 m-4 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-lg">
              <div className="flex items-center gap-3 mb-3">
                <Avatar className="h-10 w-10 border-2 border-white/20">
                  <AvatarFallback className="bg-white/10 text-white font-bold text-xs">
                    {activeVisit.patientName.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm truncate">{activeVisit.patientName}</p>
                  <p className="text-[10px] opacity-80 font-medium uppercase tracking-wider">{activeVisit.visitNumber}</p>
                </div>
              </div>
              <div className="space-y-2">
                <Badge className="w-full justify-center bg-white/20 hover:bg-white/30 text-white border-0 text-[10px] uppercase py-1">
                  {activeVisit.status.replace('-', ' ')}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-[10px] font-bold text-white hover:bg-white/10 hover:text-white"
                  onClick={() => setActiveVisit(null)}
                >
                  Clear Session
                </Button>
              </div>
            </div>
          )}
        </aside>

        {/* Column 3: Main Content area */}
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
          {/* Workflow Continuity Bar */}
          {activeVisit && nextAction && nextAction.tab !== activeTab && (
            <div className="bg-white/80 backdrop-blur-md border-b p-3 flex items-center justify-between px-6 sticky top-0 z-20 shadow-sm animate-in slide-in-from-top duration-300">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-xl text-primary">
                    <Activity className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400">Next Step Suggested</span>
                    <p className="text-sm font-bold text-slate-900 leading-none">{nextAction.label}</p>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleContinueWorkflow}
                className="bg-primary hover:bg-primary/90 text-white font-bold rounded-xl shadow-md group h-9"
              >
                Go to {nextAction.label}
                <MoveRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          )}

          <ScrollArea className="flex-1">
            <div className="p-6">
              <Tabs value={activeTab} className="h-full">
                <TabsContent value="dashboard" className="h-full mt-0 focus-visible:ring-0">
                  <OPDDashboard />
                </TabsContent>

                <TabsContent value="booking" className="h-full mt-0 focus-visible:ring-0">
                  <AppointmentBooking />
                </TabsContent>

                <TabsContent value="vitals" className="h-full mt-0 focus-visible:ring-0">
                  <VitalsStation />
                </TabsContent>

                <TabsContent value="doctor" className="h-full mt-0 focus-visible:ring-0">
                  <DoctorStation />
                </TabsContent>

                <TabsContent value="pharmacy" className="h-full mt-0 focus-visible:ring-0">
                  <PharmacyStation />
                </TabsContent>

                <TabsContent value="billing" className="h-full mt-0 focus-visible:ring-0">
                  <BillingStation />
                </TabsContent>

                <TabsContent value="lab" className="h-full mt-0 focus-visible:ring-0">
                  <LabStation />
                </TabsContent>

                <TabsContent value="queue" className="h-full mt-0 focus-visible:ring-0">
                  <QueueManagement />
                </TabsContent>

                <TabsContent value="checkin" className="h-full mt-0 focus-visible:ring-0">
                  <PatientCheck />
                </TabsContent>

                <TabsContent value="video" className="h-full mt-0 focus-visible:ring-0">
                  <VideoConsultation />
                </TabsContent>

                <TabsContent value="reports" className="h-full mt-0 focus-visible:ring-0">
                  <OPDReports />
                </TabsContent>
              </Tabs>
            </div>
          </ScrollArea>
        </main>
      </div>
    </MainLayout>
  );
};

const OPDModule = () => (
  <OPDProvider>
    <OPDModuleContent />
  </OPDProvider>
);

export default OPDModule;
