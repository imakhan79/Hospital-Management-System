import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Video, Calendar, Users, FileText, CreditCard, BarChart3 } from "lucide-react";
import { TelemedicineConsultations } from "@/components/telemedicine/TelemedicineConsultations";
import { TelemedicineAppointments } from "@/components/telemedicine/TelemedicineAppointments";
import { TelemedicinePrescriptions } from "@/components/telemedicine/TelemedicinePrescriptions";
import { DoctorAvailability } from "@/components/telemedicine/DoctorAvailability";
import { TelemedicinePayments } from "@/components/telemedicine/TelemedicinePayments";
import { TelemedicineReports } from "@/components/telemedicine/TelemedicineReports";
import { VirtualWaitingRoom } from "@/components/telemedicine/VirtualWaitingRoom";

const TelemedicineModule = () => {
  const [activeTab, setActiveTab] = useState("consultations");
  
  const stats = [
    {
      title: "Active Consultations",
      value: "12",
      description: "Currently in progress",
      icon: Video,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Today's Appointments",
      value: "45",
      description: "Scheduled for today",
      icon: Calendar,
      color: "text-green-600", 
      bgColor: "bg-green-50"
    },
    {
      title: "Waiting Room",
      value: "8",
      description: "Patients waiting",
      icon: Users,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    },
    {
      title: "Prescriptions Issued",
      value: "23",
      description: "Today",
      icon: FileText,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    }
  ];

  return (
    <MainLayout>
      <div className="space-y-8 p-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold gradient-text">Telemedicine</h1>
            <p className="text-muted-foreground">
              Secure virtual consultations and remote patient care
            </p>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="border-0 shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="consultations">Consultations</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="waiting-room">Waiting Room</TabsTrigger>
            <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
            <TabsTrigger value="availability">Availability</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="consultations" className="space-y-6">
            <TelemedicineConsultations />
          </TabsContent>

          <TabsContent value="appointments" className="space-y-6">
            <TelemedicineAppointments />
          </TabsContent>

          <TabsContent value="waiting-room" className="space-y-6">
            <VirtualWaitingRoom />
          </TabsContent>

          <TabsContent value="prescriptions" className="space-y-6">
            <TelemedicinePrescriptions />
          </TabsContent>

          <TabsContent value="availability" className="space-y-6">
            <DoctorAvailability />
          </TabsContent>

          <TabsContent value="payments" className="space-y-6">
            <TelemedicinePayments />
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <TelemedicineReports />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default TelemedicineModule;