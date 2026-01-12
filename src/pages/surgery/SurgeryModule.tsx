
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MainLayout from "@/components/layout/MainLayout";
import { SurgeryDashboard } from "@/components/surgery/SurgeryDashboard";
import { SurgeryScheduling } from "@/components/surgery/SurgeryScheduling";
import { OperationTheaterManagement } from "@/components/surgery/OperationTheaterManagement";
import { PreOpChecklist } from "@/components/surgery/PreOpChecklist";
import { SurgicalRecords } from "@/components/surgery/SurgicalRecords";
import { SurgicalInventory } from "@/components/surgery/SurgicalInventory";
import { SurgeryReports } from "@/components/surgery/SurgeryReports";

const SurgeryModule = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Surgery Department</h1>
            <p className="text-muted-foreground">
              Comprehensive surgical care management system
            </p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="scheduling">Surgery Schedule</TabsTrigger>
            <TabsTrigger value="ot-management">OT Management</TabsTrigger>
            <TabsTrigger value="preop">Pre-Op Checklist</TabsTrigger>
            <TabsTrigger value="records">Surgical Records</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-4">
            <SurgeryDashboard />
          </TabsContent>

          <TabsContent value="scheduling" className="space-y-4">
            <SurgeryScheduling />
          </TabsContent>

          <TabsContent value="ot-management" className="space-y-4">
            <OperationTheaterManagement />
          </TabsContent>

          <TabsContent value="preop" className="space-y-4">
            <PreOpChecklist />
          </TabsContent>

          <TabsContent value="records" className="space-y-4">
            <SurgicalRecords />
          </TabsContent>

          <TabsContent value="inventory" className="space-y-4">
            <SurgicalInventory />
          </TabsContent>

          <TabsContent value="reports" className="space-y-4">
            <SurgeryReports />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default SurgeryModule;
