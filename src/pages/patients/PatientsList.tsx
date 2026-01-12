
import { useState } from "react";
import { Link } from "react-router-dom";
import { User, Search, Filter, PlusCircle } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock patient data
const patients = [
  {
    id: "P1042",
    name: "Robert Garcia",
    age: 45,
    gender: "Male",
    contact: "(555) 123-4567",
    lastVisit: "2023-05-15",
    status: "Inpatient",
    diagnosis: "Hypertension, Diabetes",
    assignedDoctor: "Dr. Sarah Johnson",
    department: "Cardiology",
    roomNumber: "305",
  },
  {
    id: "P2105",
    name: "Emily Chen",
    age: 32,
    gender: "Female",
    contact: "(555) 987-6543",
    lastVisit: "2023-05-18",
    status: "Outpatient",
    diagnosis: "Migraine",
    assignedDoctor: "Dr. John Smith",
    department: "Neurology",
  },
  {
    id: "P1893",
    name: "Michael Brown",
    age: 58,
    gender: "Male",
    contact: "(555) 456-7890",
    lastVisit: "2023-05-10",
    status: "Discharged",
    diagnosis: "Pneumonia",
    assignedDoctor: "Dr. Lisa Wong",
    department: "Pulmonology",
  },
  {
    id: "P2371",
    name: "Jennifer Martinez",
    age: 41,
    gender: "Female",
    contact: "(555) 222-3333",
    lastVisit: "2023-05-12",
    status: "Outpatient",
    diagnosis: "Breast Cancer Stage 2",
    assignedDoctor: "Dr. David Kim",
    department: "Oncology",
  },
  {
    id: "P1576",
    name: "William Johnson",
    age: 7,
    gender: "Male",
    contact: "(555) 444-5555",
    lastVisit: "2023-05-17",
    status: "Outpatient",
    diagnosis: "Seasonal Allergies",
    assignedDoctor: "Dr. Sarah Johnson",
    department: "Pediatrics",
  },
  {
    id: "P1980",
    name: "Thomas Wilson",
    age: 62,
    gender: "Male",
    contact: "(555) 666-7777",
    lastVisit: "2023-05-11",
    status: "Critical",
    diagnosis: "Cardiac Arrhythmia",
    assignedDoctor: "Dr. Sarah Johnson",
    department: "Cardiology",
    roomNumber: "ICU-4",
  },
  {
    id: "P2234",
    name: "Lisa Peterson",
    age: 29,
    gender: "Female",
    contact: "(555) 888-9999",
    lastVisit: "2023-05-16",
    status: "Critical",
    diagnosis: "Respiratory Distress",
    assignedDoctor: "Dr. Lisa Wong",
    department: "Pulmonology",
    roomNumber: "210",
  },
];

const PatientsList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  
  // Filter patients based on search term and active tab
  const filteredPatients = patients.filter((patient) => {
    const matchesSearch = 
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.diagnosis.toLowerCase().includes(searchTerm.toLowerCase());
      
    if (activeTab === "all") return matchesSearch;
    return matchesSearch && patient.status.toLowerCase() === activeTab.toLowerCase();
  });
  
  return (
    <MainLayout>
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col justify-between space-y-2 sm:flex-row sm:items-center sm:space-y-0">
          <h2 className="text-2xl font-bold">Patient Management</h2>
          <div className="flex space-x-2">
            <Button asChild>
              <Link to="/patients/register">
                <PlusCircle className="mr-2 h-4 w-4" />
                New Patient
              </Link>
            </Button>
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Patients Directory</CardTitle>
            <CardDescription>
              Manage patient records, view medical history, and schedule appointments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col gap-4 sm:flex-row">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, ID, or diagnosis..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex gap-2">
                      <Filter className="h-4 w-4" />
                      Filter
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setActiveTab("all")}>
                      All Patients
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setActiveTab("inpatient")}>
                      Inpatients Only
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setActiveTab("outpatient")}>
                      Outpatients Only
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setActiveTab("critical")}>
                      Critical Patients
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setActiveTab("discharged")}>
                      Discharged Patients
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="inpatient">Inpatient</TabsTrigger>
                  <TabsTrigger value="outpatient">Outpatient</TabsTrigger>
                  <TabsTrigger value="critical">Critical</TabsTrigger>
                  <TabsTrigger value="discharged">Discharged</TabsTrigger>
                </TabsList>
                
                <TabsContent value={activeTab}>
                  <div className="mt-4">
                    <div className="rounded-md border">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                              Patient ID
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                              Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                              Age/Gender
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                              Diagnosis
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                              Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                              Doctor
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                              Last Visit
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                          {filteredPatients.length > 0 ? (
                            filteredPatients.map((patient) => (
                              <tr key={patient.id}>
                                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                                  {patient.id}
                                </td>
                                <td className="whitespace-nowrap px-6 py-4">
                                  <div className="flex items-center">
                                    <div className="h-8 w-8 flex-shrink-0 rounded-full bg-gray-100 flex items-center justify-center">
                                      <User className="h-4 w-4 text-gray-500" />
                                    </div>
                                    <div className="ml-3">
                                      <div className="text-sm font-medium text-gray-900">
                                        {patient.name}
                                      </div>
                                      <div className="text-sm text-gray-500">
                                        {patient.contact}
                                      </div>
                                    </div>
                                  </div>
                                </td>
                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                  {patient.age} / {patient.gender}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                  {patient.diagnosis}
                                </td>
                                <td className="whitespace-nowrap px-6 py-4 text-sm">
                                  <Badge
                                    className={
                                      patient.status === "Critical"
                                        ? "bg-red-100 text-red-800 hover:bg-red-200"
                                        : patient.status === "Inpatient"
                                        ? "bg-blue-100 text-blue-800 hover:bg-blue-200"
                                        : patient.status === "Outpatient"
                                        ? "bg-green-100 text-green-800 hover:bg-green-200"
                                        : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                                    }
                                    variant="outline"
                                  >
                                    {patient.status}
                                  </Badge>
                                  {patient.roomNumber && (
                                    <div className="mt-1 text-xs text-gray-500">
                                      Room {patient.roomNumber}
                                    </div>
                                  )}
                                </td>
                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                  <div>
                                    {patient.assignedDoctor}
                                    <div className="text-xs text-gray-400">
                                      {patient.department}
                                    </div>
                                  </div>
                                </td>
                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                  {new Date(patient.lastVisit).toLocaleDateString()}
                                </td>
                                <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                                  <Button variant="ghost" size="sm" asChild>
                                    <Link to={`/patients/${patient.id}`}>
                                      View
                                    </Link>
                                  </Button>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td
                                colSpan={8}
                                className="px-6 py-8 text-center text-sm text-gray-500"
                              >
                                No patients found matching your search criteria
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                    
                    <div className="mt-4 flex items-center justify-between">
                      <div className="text-sm text-gray-500">
                        Showing <span className="font-medium">{filteredPatients.length}</span> of{" "}
                        <span className="font-medium">{patients.length}</span> patients
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" disabled>
                          Previous
                        </Button>
                        <Button variant="outline" size="sm" disabled>
                          Next
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default PatientsList;
