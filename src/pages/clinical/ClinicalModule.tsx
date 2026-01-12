
import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClinicalStats } from "@/components/clinical/ClinicalStats";
import { PatientsTable } from "@/components/clinical/PatientsTable";
import { AddClinicalCaseForm } from "@/components/clinical/AddClinicalCaseForm";
import { Button } from "@/components/ui/button";
import { FileText, Plus } from "lucide-react";

const ClinicalModule = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isAddCaseOpen, setIsAddCaseOpen] = useState(false);
  const [clinicalCases, setClinicalCases] = useState([]);

  const handleAddCase = (newCase: any) => {
    setClinicalCases(prev => [newCase, ...prev]);
  };

  return (
    <MainLayout>
      <div className="flex flex-col space-y-4 sm:space-y-6 p-2 sm:p-0">
        <div className="flex flex-col justify-between space-y-2 sm:flex-row sm:items-center sm:space-y-0">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Clinical Management</h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              Manage patient clinical records and medical cases
            </p>
          </div>
          <Button onClick={() => setIsAddCaseOpen(true)} className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            New Clinical Case
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="patients">Patient Cases</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Records</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">2,{500 + clinicalCases.length}+</div>
                  <p className="text-xs text-muted-foreground">
                    Medical records in the database
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Patients</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{900 + clinicalCases.length}+</div>
                  <p className="text-xs text-muted-foreground">
                    Currently active patients
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Departments</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">13</div>
                  <p className="text-xs text-muted-foreground">
                    Specialized clinical departments
                  </p>
                </CardContent>
              </Card>
            </div>

            <ClinicalStats />

            <Card>
              <CardHeader>
                <CardTitle>Recent Clinical Activity</CardTitle>
                <CardDescription>
                  Latest patient cases and clinical entries
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PatientsTable additionalCases={clinicalCases} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="patients">
            <Card>
              <CardHeader>
                <CardTitle>Clinical Cases</CardTitle>
                <CardDescription>
                  View and manage patient clinical records
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PatientsTable additionalCases={clinicalCases} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <AddClinicalCaseForm
          open={isAddCaseOpen}
          onOpenChange={setIsAddCaseOpen}
          onAddCase={handleAddCase}
        />
      </div>
    </MainLayout>
  );
};

export default ClinicalModule;
