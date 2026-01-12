import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, FileText, Calendar, Heart, Activity, Receipt, Pill, AlertCircle, Edit, Trash } from "lucide-react";

// Mock patient data
const patients = [
  {
    id: "P1042",
    name: "Robert Garcia",
    age: 45,
    gender: "Male",
    dob: "1978-03-20",
    bloodType: "O+",
    contact: "(555) 123-4567",
    email: "robert.garcia@example.com",
    address: "123 Main St, Anytown, CA 12345",
    emergencyContact: "Maria Garcia (Wife), (555) 123-4568",
    lastVisit: "2023-05-15",
    registrationDate: "2020-07-10",
    status: "Inpatient",
    diagnosis: "Hypertension, Diabetes",
    assignedDoctor: "Dr. Sarah Johnson",
    department: "Cardiology",
    roomNumber: "305",
    allergies: ["Penicillin", "Sulfa drugs"],
    insuranceProvider: "Blue Cross",
    insuranceNumber: "BC123456789",
    medicalHistory: [
      {
        id: "1",
        date: "2022-11-05",
        diagnosis: "Type 2 Diabetes",
        doctor: "Dr. Sarah Johnson",
        department: "Endocrinology",
        notes: "Initial diagnosis of Type 2 Diabetes. Started on metformin 500mg twice daily.",
      },
      {
        id: "2",
        date: "2022-12-18",
        diagnosis: "Hypertension",
        doctor: "Dr. Sarah Johnson",
        department: "Cardiology",
        notes: "Diagnosed with hypertension. Started on lisinopril 10mg daily.",
      },
      {
        id: "3",
        date: "2023-03-10",
        diagnosis: "Diabetic Foot Ulcer",
        doctor: "Dr. Lisa Wong",
        department: "Dermatology",
        notes: "Small ulcer on right foot. Cleaned and dressed. Prescribed antibiotics.",
      },
    ],
    medications: [
      {
        id: "1",
        name: "Metformin",
        dosage: "500mg",
        frequency: "Twice daily",
        startDate: "2022-11-05",
        endDate: null,
        prescribedBy: "Dr. Sarah Johnson",
      },
      {
        id: "2",
        name: "Lisinopril",
        dosage: "10mg",
        frequency: "Once daily",
        startDate: "2022-12-18",
        endDate: null,
        prescribedBy: "Dr. Sarah Johnson",
      },
      {
        id: "3",
        name: "Amoxicillin",
        dosage: "500mg",
        frequency: "Three times daily",
        startDate: "2023-03-10",
        endDate: "2023-03-24",
        prescribedBy: "Dr. Lisa Wong",
      },
    ],
    labResults: [
      {
        id: "1",
        date: "2023-05-10",
        test: "Complete Blood Count (CBC)",
        result: "WBC: 7.2, RBC: 4.8, HGB: 14.1, HCT: 42%, PLT: 250",
        status: "Normal",
        orderedBy: "Dr. Sarah Johnson",
      },
      {
        id: "2",
        date: "2023-05-10",
        test: "HbA1c",
        result: "7.8%",
        status: "Elevated",
        orderedBy: "Dr. Sarah Johnson",
      },
      {
        id: "3",
        date: "2023-05-10",
        test: "Lipid Panel",
        result: "Total Cholesterol: 220, LDL: 130, HDL: 45, Triglycerides: 180",
        status: "Elevated",
        orderedBy: "Dr. Sarah Johnson",
      },
    ],
    appointments: [
      {
        id: "1",
        date: "2023-04-15",
        time: "09:30 AM",
        doctor: "Dr. Sarah Johnson",
        department: "Cardiology",
        purpose: "Regular Check-up",
        status: "Completed",
        notes: "Blood pressure still elevated. Increased lisinopril dosage.",
      },
      {
        id: "2",
        date: "2023-05-15",
        time: "10:00 AM",
        doctor: "Dr. Sarah Johnson",
        department: "Cardiology",
        purpose: "Follow-up",
        status: "Completed",
        notes: "Patient admitted due to chest pain and elevated blood pressure.",
      },
      {
        id: "3",
        date: "2023-06-20",
        time: "11:15 AM",
        doctor: "Dr. Sarah Johnson",
        department: "Cardiology",
        purpose: "Post-discharge Follow-up",
        status: "Scheduled",
      },
    ],
    billingHistory: [
      {
        id: "1",
        date: "2023-04-15",
        description: "Cardiology Consultation",
        amount: 180.00,
        insurance: 144.00,
        patient: 36.00,
        status: "Paid",
      },
      {
        id: "2",
        date: "2023-05-10",
        description: "Lab Tests - CBC, HbA1c, Lipid Panel",
        amount: 320.00,
        insurance: 256.00,
        patient: 64.00,
        status: "Paid",
      },
      {
        id: "3",
        date: "2023-05-15",
        description: "Hospital Admission - Initial",
        amount: 2500.00,
        insurance: 2000.00,
        patient: 500.00,
        status: "Pending",
      },
    ],
    vitals: [
      {
        id: "1",
        date: "2023-05-15",
        time: "08:00 AM",
        temperature: "98.6°F",
        heartRate: 88,
        respiratoryRate: 18,
        bloodPressure: "150/95",
        oxygenSaturation: "97%",
        recordedBy: "Nurse Emma Wilson",
      },
      {
        id: "2",
        date: "2023-05-15",
        time: "02:00 PM",
        temperature: "98.8°F",
        heartRate: 82,
        respiratoryRate: 16,
        bloodPressure: "145/90",
        oxygenSaturation: "98%",
        recordedBy: "Nurse Emma Wilson",
      },
      {
        id: "3",
        date: "2023-05-16",
        time: "08:00 AM",
        temperature: "98.6°F",
        heartRate: 78,
        respiratoryRate: 16,
        bloodPressure: "140/90",
        oxygenSaturation: "98%",
        recordedBy: "Nurse Emma Wilson",
      },
    ],
  },
  // Add other patients similar to P1042
];

const PatientDetails = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("overview");
  
  const patient = patients.find((p) => p.id === id);
  
  if (!patient) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center space-y-4 py-12">
          <AlertCircle className="h-12 w-12 text-red-500" />
          <h2 className="text-2xl font-bold">Patient Not Found</h2>
          <p className="text-gray-500">The patient record you're looking for doesn't exist.</p>
          <Button asChild>
            <Link to="/patients">Back to Patients List</Link>
          </Button>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon" asChild>
              <Link to="/patients">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h1 className="text-2xl font-bold">Patient Details</h1>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline">
              <Edit className="mr-2 h-4 w-4" />
              Edit Patient
            </Button>
          </div>
        </div>
        
        <div className="grid gap-6 md:grid-cols-3">
          {/* Patient Info Card */}
          <Card className="md:col-span-1">
            <CardHeader>
              <div className="flex justify-between">
                <div>
                  <CardTitle>{patient.name}</CardTitle>
                  <CardDescription>{patient.id}</CardDescription>
                </div>
                <Badge 
                  className={
                    patient.status === "Critical"
                      ? "bg-red-100 text-red-800"
                      : patient.status === "Inpatient"
                      ? "bg-blue-100 text-blue-800"
                      : patient.status === "Outpatient"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }
                  variant="outline"
                >
                  {patient.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <p className="text-sm font-medium">Current Diagnosis</p>
                <p className="text-sm text-gray-500">{patient.diagnosis}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Age</p>
                  <p className="text-sm text-gray-500">{patient.age}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Gender</p>
                  <p className="text-sm text-gray-500">{patient.gender}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Blood Type</p>
                  <p className="text-sm text-gray-500">{patient.bloodType}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Date of Birth</p>
                  <p className="text-sm text-gray-500">{patient.dob}</p>
                </div>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm font-medium">Contact Information</p>
                <p className="text-sm text-gray-500">{patient.contact}</p>
                <p className="text-sm text-gray-500">{patient.email}</p>
                <p className="text-sm text-gray-500">{patient.address}</p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm font-medium">Emergency Contact</p>
                <p className="text-sm text-gray-500">{patient.emergencyContact}</p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm font-medium">Assigned Doctor</p>
                <p className="text-sm text-gray-500">{patient.assignedDoctor}</p>
                <p className="text-sm text-gray-500">{patient.department}</p>
              </div>
              
              {patient.roomNumber && (
                <div className="space-y-1">
                  <p className="text-sm font-medium">Room</p>
                  <p className="text-sm text-gray-500">{patient.roomNumber}</p>
                </div>
              )}
              
              <div className="space-y-1">
                <p className="text-sm font-medium">Allergies</p>
                <div className="flex flex-wrap gap-1">
                  {patient.allergies.map((allergy, index) => (
                    <Badge key={index} variant="outline" className="bg-red-50 text-red-700">
                      {allergy}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm font-medium">Insurance</p>
                <p className="text-sm text-gray-500">{patient.insuranceProvider}</p>
                <p className="text-sm text-gray-500">Policy: {patient.insuranceNumber}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Registered</p>
                  <p className="text-sm text-gray-500">{patient.registrationDate}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Last Visit</p>
                  <p className="text-sm text-gray-500">{patient.lastVisit}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Patient Details Tabs */}
          <Card className="md:col-span-2">
            <CardContent className="pt-6">
              <Tabs defaultValue="overview" onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-7 lg:grid-cols-7">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="records">Records</TabsTrigger>
                  <TabsTrigger value="medications">Medications</TabsTrigger>
                  <TabsTrigger value="lab">Lab Results</TabsTrigger>
                  <TabsTrigger value="appointments">Appointments</TabsTrigger>
                  <TabsTrigger value="billing">Billing</TabsTrigger>
                  <TabsTrigger value="vitals">Vitals</TabsTrigger>
                </TabsList>
                
                <div className="mt-6">
                  {/* Overview Tab */}
                  <TabsContent value="overview" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="flex items-center gap-2 text-base font-medium">
                            <Heart className="h-4 w-4 text-red-500" />
                            Latest Vitals
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          {patient.vitals.length > 0 ? (
                            <div className="space-y-2">
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <p className="text-muted-foreground">Blood Pressure</p>
                                  <p className="font-medium">{patient.vitals[0].bloodPressure}</p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">Heart Rate</p>
                                  <p className="font-medium">{patient.vitals[0].heartRate} bpm</p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">Temperature</p>
                                  <p className="font-medium">{patient.vitals[0].temperature}</p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">Oxygen Saturation</p>
                                  <p className="font-medium">{patient.vitals[0].oxygenSaturation}</p>
                                </div>
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Recorded on {patient.vitals[0].date} at {patient.vitals[0].time} by {patient.vitals[0].recordedBy}
                              </div>
                            </div>
                          ) : (
                            <p className="text-sm text-muted-foreground">No vitals recorded</p>
                          )}
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="flex items-center gap-2 text-base font-medium">
                            <Calendar className="h-4 w-4 text-blue-500" />
                            Next Appointment
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          {patient.appointments.find(a => a.status === "Scheduled") ? (
                            <div className="space-y-2">
                              <p className="font-medium">
                                {patient.appointments.find(a => a.status === "Scheduled")?.purpose}
                              </p>
                              <div className="grid grid-cols-2 gap-2 text-sm">
                                <div>
                                  <p className="text-muted-foreground">Date</p>
                                  <p>{patient.appointments.find(a => a.status === "Scheduled")?.date}</p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">Time</p>
                                  <p>{patient.appointments.find(a => a.status === "Scheduled")?.time}</p>
                                </div>
                                <div className="col-span-2">
                                  <p className="text-muted-foreground">Doctor</p>
                                  <p>{patient.appointments.find(a => a.status === "Scheduled")?.doctor}</p>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <p className="text-sm text-muted-foreground">No upcoming appointments</p>
                          )}
                        </CardContent>
                      </Card>
                      
                      <Card className="md:col-span-2">
                        <CardHeader className="pb-2">
                          <CardTitle className="flex items-center gap-2 text-base font-medium">
                            <FileText className="h-4 w-4 text-green-500" />
                            Recent Medical History
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {patient.medicalHistory.slice(0, 2).map((history) => (
                              <div key={history.id} className="rounded-md border p-3">
                                <div className="flex flex-wrap items-start justify-between gap-2">
                                  <div>
                                    <p className="font-medium">{history.diagnosis}</p>
                                    <p className="text-xs text-muted-foreground">
                                      {history.date} • {history.doctor} ({history.department})
                                    </p>
                                  </div>
                                </div>
                                <p className="mt-2 text-sm">{history.notes}</p>
                              </div>
                            ))}
                            <Button variant="link" className="pl-0" asChild>
                              <Link to="#" onClick={() => setActiveTab("records")}>
                                View full medical history
                              </Link>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="flex items-center gap-2 text-base font-medium">
                            <Pill className="h-4 w-4 text-purple-500" />
                            Current Medications
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            {patient.medications
                              .filter(med => !med.endDate)
                              .map((medication) => (
                                <div key={medication.id} className="rounded-md border p-3">
                                  <p className="font-medium">{medication.name} {medication.dosage}</p>
                                  <p className="text-sm">{medication.frequency}</p>
                                  <p className="text-xs text-muted-foreground">
                                    Since {medication.startDate} • Prescribed by {medication.prescribedBy}
                                  </p>
                                </div>
                              ))}
                            <Button variant="link" className="pl-0" asChild>
                              <Link to="#" onClick={() => setActiveTab("medications")}>
                                View all medications
                              </Link>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="flex items-center gap-2 text-base font-medium">
                            <Activity className="h-4 w-4 text-yellow-500" />
                            Recent Lab Results
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            {patient.labResults.slice(0, 2).map((lab) => (
                              <div key={lab.id} className="rounded-md border p-3">
                                <div className="flex justify-between">
                                  <p className="font-medium">{lab.test}</p>
                                  <Badge 
                                    className={
                                      lab.status === "Normal"
                                        ? "bg-green-100 text-green-800"
                                        : "bg-yellow-100 text-yellow-800"
                                    }
                                    variant="outline"
                                  >
                                    {lab.status}
                                  </Badge>
                                </div>
                                <p className="mt-1 text-sm">{lab.result}</p>
                                <p className="text-xs text-muted-foreground">
                                  {lab.date} • Ordered by {lab.orderedBy}
                                </p>
                              </div>
                            ))}
                            <Button variant="link" className="pl-0" asChild>
                              <Link to="#" onClick={() => setActiveTab("lab")}>
                                View all lab results
                              </Link>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="flex items-center gap-2 text-base font-medium">
                            <Receipt className="h-4 w-4 text-indigo-500" />
                            Billing Summary
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <p className="text-sm">Total Charges (30 days)</p>
                              <p className="font-medium">
                                ${patient.billingHistory
                                  .reduce((sum, item) => sum + item.amount, 0)
                                  .toFixed(2)}
                              </p>
                            </div>
                            <div className="flex justify-between">
                              <p className="text-sm">Insurance Covered</p>
                              <p className="font-medium">
                                ${patient.billingHistory
                                  .reduce((sum, item) => sum + item.insurance, 0)
                                  .toFixed(2)}
                              </p>
                            </div>
                            <div className="flex justify-between">
                              <p className="text-sm">Patient Responsibility</p>
                              <p className="font-medium">
                                ${patient.billingHistory
                                  .reduce((sum, item) => sum + item.patient, 0)
                                  .toFixed(2)}
                              </p>
                            </div>
                            <div className="flex justify-between pt-2 border-t">
                              <p className="text-sm font-medium">Outstanding Balance</p>
                              <p className="font-medium text-red-600">
                                ${patient.billingHistory
                                  .filter(item => item.status === "Pending")
                                  .reduce((sum, item) => sum + item.patient, 0)
                                  .toFixed(2)}
                              </p>
                            </div>
                            
                            <Button variant="link" className="pl-0" asChild>
                              <Link to="#" onClick={() => setActiveTab("billing")}>
                                View billing details
                              </Link>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <div className="flex justify-center space-x-3">
                      <Button>
                        Schedule Appointment
                      </Button>
                      <Button variant="outline">
                        Order Lab Tests
                      </Button>
                      <Button variant="outline">
                        Add Medical Note
                      </Button>
                    </div>
                  </TabsContent>
                  
                  {/* Other tabs would be implemented similarly */}
                  <TabsContent value="records">
                    <Card>
                      <CardHeader>
                        <CardTitle>Medical Records</CardTitle>
                        <CardDescription>Complete medical history of the patient</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {patient.medicalHistory.map((history) => (
                            <div key={history.id} className="rounded-md border p-4">
                              <div className="flex flex-wrap items-start justify-between gap-2">
                                <div>
                                  <p className="font-medium text-lg">{history.diagnosis}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {new Date(history.date).toLocaleDateString()} • {history.doctor} ({history.department})
                                  </p>
                                </div>
                              </div>
                              <p className="mt-3">{history.notes}</p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  {/* Other tabs content would go here... */}
                  <TabsContent value="medications">
                    <Card>
                      <CardHeader>
                        <CardTitle>Medications</CardTitle>
                        <CardDescription>Current and past medications</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground mb-4">Showing medications for {patient.name}</p>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="lab">
                    <Card>
                      <CardHeader>
                        <CardTitle>Lab Results</CardTitle>
                        <CardDescription>Laboratory test results</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground mb-4">Showing lab results for {patient.name}</p>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="appointments">
                    <Card>
                      <CardHeader>
                        <CardTitle>Appointments</CardTitle>
                        <CardDescription>Past and upcoming appointments</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground mb-4">Showing appointments for {patient.name}</p>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="billing">
                    <Card>
                      <CardHeader>
                        <CardTitle>Billing Information</CardTitle>
                        <CardDescription>Invoices and payment history</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground mb-4">Showing billing history for {patient.name}</p>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="vitals">
                    <Card>
                      <CardHeader>
                        <CardTitle>Vital Signs</CardTitle>
                        <CardDescription>Patient vital sign history</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground mb-4">Showing vital signs for {patient.name}</p>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </div>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default PatientDetails;
