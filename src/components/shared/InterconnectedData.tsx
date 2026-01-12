
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Eye, Calendar, FileText, Pill, Receipt } from "lucide-react";

export interface PatientDataFlow {
  patientId: string;
  name: string;
  status: 'registered' | 'checked-in' | 'consulting' | 'tests-ordered' | 'results-ready' | 'discharged';
  currentLocation: string;
  appointments: AppointmentData[];
  labTests: LabTestData[];
  prescriptions: PrescriptionData[];
  billing: BillingData[];
  alerts: AlertData[];
}

export interface AppointmentData {
  id: string;
  department: string;
  doctor: string;
  time: string;
  status: 'scheduled' | 'in-progress' | 'completed';
}

export interface LabTestData {
  id: string;
  testName: string;
  status: 'ordered' | 'in-progress' | 'completed' | 'critical';
  results?: string;
  orderedBy: string;
}

export interface PrescriptionData {
  id: string;
  medication: string;
  dosage: string;
  status: 'prescribed' | 'dispensed';
  prescribedBy: string;
}

export interface BillingData {
  id: string;
  service: string;
  amount: number;
  status: 'pending' | 'paid' | 'insurance-processing';
}

export interface AlertData {
  id: string;
  type: 'critical' | 'warning' | 'info';
  message: string;
  timestamp: string;
  department: string;
}

interface InterconnectedDataProps {
  patientId?: string;
  showAll?: boolean;
}

export const InterconnectedData = ({ patientId, showAll = false }: InterconnectedDataProps) => {
  const [patientData, setPatientData] = useState<PatientDataFlow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate real-time data fetching
    const fetchData = () => {
      const mockData: PatientDataFlow[] = [
        {
          patientId: 'P2045',
          name: 'Ahmed Hassan',
          status: 'tests-ordered',
          currentLocation: 'Cardiology - Room 305',
          appointments: [
            {
              id: 'A1',
              department: 'Cardiology',
              doctor: 'Dr. Omar Sheikh',
              time: '14:30',
              status: 'in-progress'
            }
          ],
          labTests: [
            {
              id: 'L1',
              testName: 'ECG',
              status: 'completed',
              results: 'Abnormal - Arrhythmia detected',
              orderedBy: 'Dr. Omar Sheikh'
            },
            {
              id: 'L2',
              testName: 'Cardiac Enzymes',
              status: 'critical',
              results: 'Elevated Troponin levels',
              orderedBy: 'Dr. Omar Sheikh'
            }
          ],
          prescriptions: [
            {
              id: 'P1',
              medication: 'Aspirin 75mg',
              dosage: '1 tablet daily',
              status: 'prescribed',
              prescribedBy: 'Dr. Omar Sheikh'
            }
          ],
          billing: [
            {
              id: 'B1',
              service: 'Cardiology Consultation',
              amount: 2500,
              status: 'pending'
            },
            {
              id: 'B2',
              service: 'ECG Test',
              amount: 800,
              status: 'paid'
            }
          ],
          alerts: [
            {
              id: 'AL1',
              type: 'critical',
              message: 'Cardiac Emergency - Immediate attention required',
              timestamp: '2 min ago',
              department: 'Cardiology'
            }
          ]
        },
        {
          patientId: 'P1823',
          name: 'Fatima Khan',
          status: 'results-ready',
          currentLocation: 'Laboratory',
          appointments: [
            {
              id: 'A2',
              department: 'Neurology',
              doctor: 'Dr. Sarah Ahmed',
              time: '16:00',
              status: 'scheduled'
            }
          ],
          labTests: [
            {
              id: 'L3',
              testName: 'MRI Brain',
              status: 'completed',
              results: 'No abnormalities detected',
              orderedBy: 'Dr. Sarah Ahmed'
            }
          ],
          prescriptions: [],
          billing: [
            {
              id: 'B3',
              service: 'MRI Scan',
              amount: 8500,
              status: 'insurance-processing'
            }
          ],
          alerts: [
            {
              id: 'AL2',
              type: 'info',
              message: 'MRI results ready for review',
              timestamp: '5 min ago',
              department: 'Laboratory'
            }
          ]
        }
      ];

      if (patientId) {
        setPatientData(mockData.filter(p => p.patientId === patientId));
      } else {
        setPatientData(showAll ? mockData : mockData.slice(0, 1));
      }
      setLoading(false);
    };

    fetchData();
    const interval = setInterval(fetchData, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [patientId, showAll]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'destructive';
      case 'completed': return 'default';
      case 'in-progress': return 'secondary';
      case 'pending': return 'outline';
      default: return 'secondary';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'critical': return <AlertTriangle className="h-4 w-4" />;
      case 'completed': return <Eye className="h-4 w-4" />;
      case 'in-progress': return <Calendar className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  if (loading) {
    return <div className="p-4">Loading patient data...</div>;
  }

  return (
    <div className="space-y-6">
      {patientData.map((patient) => (
        <Card key={patient.patientId} className="overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  {patient.name}
                  <Badge variant="outline">{patient.patientId}</Badge>
                </CardTitle>
                <CardDescription className="flex items-center gap-2 mt-1">
                  <Badge variant={getStatusColor(patient.status)}>
                    {getStatusIcon(patient.status)}
                    {patient.status.replace('-', ' ').toUpperCase()}
                  </Badge>
                  <span className="text-sm">Currently at: {patient.currentLocation}</span>
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline">
                  <Eye className="h-4 w-4 mr-1" />
                  View Details
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
              {/* Appointments */}
              <div className="space-y-3">
                <h4 className="font-semibold flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  Appointments
                </h4>
                {patient.appointments.length > 0 ? (
                  patient.appointments.map((apt) => (
                    <div key={apt.id} className="p-3 bg-blue-50 rounded-lg">
                      <div className="font-medium text-sm">{apt.department}</div>
                      <div className="text-xs text-gray-600">{apt.doctor}</div>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs">{apt.time}</span>
                        <Badge variant={getStatusColor(apt.status)}>
                          {apt.status}
                        </Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-gray-500">No appointments</div>
                )}
              </div>

              {/* Lab Tests */}
              <div className="space-y-3">
                <h4 className="font-semibold flex items-center gap-2">
                  <FileText className="h-4 w-4 text-orange-600" />
                  Lab Tests
                </h4>
                {patient.labTests.length > 0 ? (
                  patient.labTests.map((test) => (
                    <div key={test.id} className="p-3 bg-orange-50 rounded-lg">
                      <div className="font-medium text-sm">{test.testName}</div>
                      <div className="text-xs text-gray-600">by {test.orderedBy}</div>
                      <div className="flex items-center justify-between mt-1">
                        <Badge variant={getStatusColor(test.status)}>
                          {test.status}
                        </Badge>
                      </div>
                      {test.results && (
                        <div className="text-xs mt-1 p-1 bg-white rounded">
                          {test.results}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-gray-500">No lab tests</div>
                )}
              </div>

              {/* Prescriptions */}
              <div className="space-y-3">
                <h4 className="font-semibold flex items-center gap-2">
                  <Pill className="h-4 w-4 text-green-600" />
                  Prescriptions
                </h4>
                {patient.prescriptions.length > 0 ? (
                  patient.prescriptions.map((rx) => (
                    <div key={rx.id} className="p-3 bg-green-50 rounded-lg">
                      <div className="font-medium text-sm">{rx.medication}</div>
                      <div className="text-xs text-gray-600">{rx.dosage}</div>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs">by {rx.prescribedBy}</span>
                        <Badge variant={getStatusColor(rx.status)}>
                          {rx.status}
                        </Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-gray-500">No prescriptions</div>
                )}
              </div>

              {/* Billing */}
              <div className="space-y-3">
                <h4 className="font-semibold flex items-center gap-2">
                  <Receipt className="h-4 w-4 text-purple-600" />
                  Billing
                </h4>
                {patient.billing.length > 0 ? (
                  patient.billing.map((bill) => (
                    <div key={bill.id} className="p-3 bg-purple-50 rounded-lg">
                      <div className="font-medium text-sm">{bill.service}</div>
                      <div className="text-xs text-gray-600">₹{bill.amount}</div>
                      <div className="flex items-center justify-between mt-1">
                        <Badge variant={getStatusColor(bill.status)}>
                          {bill.status}
                        </Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-gray-500">No billing items</div>
                )}
              </div>
            </div>

            {/* Alerts */}
            {patient.alerts.length > 0 && (
              <div className="mt-6 p-4 bg-red-50 rounded-lg border border-red-200">
                <h4 className="font-semibold text-red-800 mb-3">Active Alerts</h4>
                <div className="space-y-2">
                  {patient.alerts.map((alert) => (
                    <div key={alert.id} className="flex items-center justify-between p-2 bg-white rounded border-l-4 border-red-500">
                      <div>
                        <p className="font-medium text-gray-900">{alert.message}</p>
                        <p className="text-sm text-gray-500">{alert.department} • {alert.timestamp}</p>
                      </div>
                      <Badge variant={alert.type === 'critical' ? 'destructive' : 'default'}>
                        {alert.type}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
