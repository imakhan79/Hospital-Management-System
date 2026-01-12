
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MainLayout from "@/components/layout/MainLayout";
import { BedManagement } from "@/components/ipd/BedManagement";
import { AdmissionRequestQueue } from "@/components/ipd/AdmissionRequestQueue";
import { ActivePatientsList } from "@/components/ipd/ActivePatientsList";
import { Bed, ClipboardList, UserPlus, Users } from "lucide-react";

const IPDModule = () => {
  const [activeTab, setActiveTab] = useState("beds");

  return (
    <MainLayout>
      <div className="flex h-[calc(100vh-64px)] flex-col lg:flex-row gap-0 overflow-hidden">
        {/* Left Sidebar Menu */}
        <aside className="w-full lg:w-64 flex-shrink-0 border-r bg-slate-50/50 overflow-y-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} orientation="vertical" className="h-full flex flex-col">
            <div className="p-4">
              <h2 className="font-semibold text-lg px-2 mb-2">In-Patient Dept</h2>
              <TabsList className="flex flex-col h-auto bg-transparent space-y-1 w-full p-0">
                <TabsTrigger value="dashboard" className="w-full justify-start px-3 py-2 h-9 text-left font-medium rounded-md hover:bg-slate-100 data-[state=active]:bg-white data-[state=active]:shadow-sm" disabled>
                  <ClipboardList className="w-4 h-4 mr-2" /> Dashboard
                </TabsTrigger>
                <TabsTrigger value="beds" className="w-full justify-start px-3 py-2 h-9 text-left font-medium rounded-md hover:bg-slate-100 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  <Bed className="w-4 h-4 mr-2" /> Bed Management
                </TabsTrigger>
                <TabsTrigger value="admissions" className="w-full justify-start px-3 py-2 h-9 text-left font-medium rounded-md hover:bg-slate-100 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  <UserPlus className="w-4 h-4 mr-2" /> Admission Requests
                </TabsTrigger>
                <TabsTrigger value="patients" className="w-full justify-start px-3 py-2 h-9 text-left font-medium rounded-md hover:bg-slate-100 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  <Users className="w-4 h-4 mr-2" /> Active Patients
                </TabsTrigger>
              </TabsList>
            </div>
          </Tabs>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto bg-white p-6 h-full">
          <Tabs value={activeTab} className="h-full">
            <TabsContent value="beds" className="h-full mt-0 space-y-4">
              <BedManagement />
            </TabsContent>

            <TabsContent value="admissions" className="h-full mt-0 p-6">
              <AdmissionRequestQueue />
            </TabsContent>

            <TabsContent value="patients" className="h-full mt-0 p-6">
              <ActivePatientsList />
            </TabsContent>

            <TabsContent value="dashboard" className="h-full mt-0 space-y-4">
              <div>IPD Dashboard</div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </MainLayout>
  );
};

export default IPDModule;
