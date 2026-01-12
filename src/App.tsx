
import { Fragment } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/use-auth";
import Index from "@/pages/Index";
import Dashboard from "@/pages/Dashboard";
import WorkflowDashboard from "@/pages/WorkflowDashboard";
import LoginPage from "@/pages/LoginPage";
import FindDoctorModule from "@/pages/doctors/FindDoctorModule";
import PatientsList from "@/pages/patients/PatientsList";
import PatientDetails from "@/pages/patients/PatientDetails";
import PatientRegistration from "@/pages/patients/PatientRegistration";
import MedicalRecords from "@/pages/records/MedicalRecords";
import LaboratoryModule from "@/pages/laboratory/LaboratoryModule";
import PharmacyModule from "@/pages/pharmacy/PharmacyModule";
import OrderManagementModule from "@/pages/orders/OrderManagementModule";
import IPDModule from "@/pages/ipd/IPDModule";
import OPDModule from "@/pages/opd/OPDModule";
import SurgeryModule from "@/pages/surgery/SurgeryModule";
import InventoryModule from "@/pages/inventory/InventoryModule";
import SupplyChainModule from "@/pages/supply-chain/SupplyChainModule";
import StaffList from "@/pages/staff/StaffList";
import BillingModule from "@/pages/billing/BillingModule";
import ReportsModule from "@/pages/reports/ReportsModule";
import ClinicalModule from "@/pages/clinical/ClinicalModule";
import NurseCallSystem from "@/pages/nurse-call/NurseCallSystem";
import EmergencyModule from "@/pages/emergency/EmergencyModule";
import TelemedicineModule from "@/pages/telemedicine/TelemedicineModule";
import SettingsPage from "@/pages/settings/SettingsPage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Fragment>
            <Toaster />
            <Sonner />
          </Fragment>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/workflow" element={<WorkflowDashboard />} />
              <Route path="/find-doctor" element={<FindDoctorModule />} />
              <Route path="/patients" element={<PatientsList />} />
              <Route path="/patients/:id" element={<PatientDetails />} />
              <Route path="/patients/register" element={<PatientRegistration />} />
              <Route path="/records" element={<MedicalRecords />} />
              <Route path="/laboratory" element={<LaboratoryModule />} />
              <Route path="/pharmacy" element={<PharmacyModule />} />
              <Route path="/orders" element={<OrderManagementModule />} />
              <Route path="/ipd" element={<IPDModule />} />
              <Route path="/opd" element={<OPDModule />} />
              <Route path="/surgery" element={<SurgeryModule />} />
              <Route path="/inventory" element={<InventoryModule />} />
              <Route path="/supply-chain" element={<SupplyChainModule />} />
              <Route path="/staff" element={<StaffList />} />
              <Route path="/billing" element={<BillingModule />} />
              <Route path="/reports" element={<ReportsModule />} />
              <Route path="/clinical" element={<ClinicalModule />} />
              <Route path="/telemedicine" element={<TelemedicineModule />} />
              <Route path="/nurse-call" element={<NurseCallSystem />} />
              <Route path="/emergency" element={<EmergencyModule />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
