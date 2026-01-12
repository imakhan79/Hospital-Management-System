
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Clock, Bell, CheckCircle } from 'lucide-react';
import { CallRequest } from "@/types/nurseCall";
import { fetchPatientCallHistory, getPatientsList } from "@/services/nurseCallService";

const PatientCallHistory = () => {
  const [callHistory, setCallHistory] = useState<CallRequest[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadPatients();
  }, []);

  useEffect(() => {
    if (selectedPatient) {
      loadCallHistory(selectedPatient);
    }
  }, [selectedPatient]);

  const loadPatients = async () => {
    try {
      const patientsData = await getPatientsList();
      setPatients(patientsData);
    } catch (error) {
      console.error('Error loading patients:', error);
    }
  };

  const loadCallHistory = async (patientId: string) => {
    setLoading(true);
    try {
      const history = await fetchPatientCallHistory(patientId);
      setCallHistory(history);
    } catch (error) {
      console.error('Error loading call history:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Patient Call History
        </CardTitle>
        <CardDescription>
          View detailed call history for patients
        </CardDescription>
        <div className="mt-4">
          <Select value={selectedPatient} onValueChange={setSelectedPatient}>
            <SelectTrigger className="w-full md:w-80">
              <SelectValue placeholder="Select a patient to view call history" />
            </SelectTrigger>
            <SelectContent>
              {patients.map(patient => (
                <SelectItem key={patient.id} value={patient.id}>
                  {patient.name} - Room {patient.room_number}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8">Loading call history...</div>
        ) : !selectedPatient ? (
          <div className="text-center py-8 text-muted-foreground">
            <Bell className="w-12 h-12 mx-auto mb-4" />
            <p>Select a patient to view their call history</p>
          </div>
        ) : callHistory.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-500" />
            <p>No call history found for this patient</p>
          </div>
        ) : (
          <div className="space-y-4">
            {callHistory.map((call) => (
              <div key={call.id} className="border rounded-lg p-4 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium capitalize">{call.call_type.replace('_', ' ')} Request</h4>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(call.timestamp)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-green-600">
                      Resolved
                    </Badge>
                    {call.response_time && (
                      <Badge variant="secondary">
                        {formatDuration(call.response_time)}
                      </Badge>
                    )}
                  </div>
                </div>
                
                {call.notes && (
                  <div className="mt-2">
                    <p className="text-sm text-muted-foreground">
                      <strong>Notes:</strong> {call.notes}
                    </p>
                  </div>
                )}
                
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>Resolved: {call.resolved_at ? formatDate(call.resolved_at) : 'N/A'}</span>
                  <span>Room: {call.room_number}</span>
                  <span>Department: {call.department}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PatientCallHistory;
