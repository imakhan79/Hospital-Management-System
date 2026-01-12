import { useState, useEffect } from 'react';
import { Search, Shield, Eye, EyeOff, Lock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { useHIPAAAuth } from '@/hooks/useHIPAAAuth';
import { HIPAAService } from '@/services/hipaaService';
import { fetchPatients, Patient } from '@/services/patientService';
import { toast } from 'sonner';

interface HIPAACompliantPatientSearchProps {
  onPatientSelect: (patient: Patient) => void;
  selectedPatientId?: string;
  requiredPermission?: string;
  accessReason?: string;
  showSensitiveData?: boolean;
  className?: string;
}

export function HIPAACompliantPatientSearch({
  onPatientSelect,
  selectedPatientId,
  requiredPermission = 'read_own_patients',
  accessReason = '',
  showSensitiveData = false,
  className = ""
}: HIPAACompliantPatientSearchProps) {
  const { hasPermission, profile } = useHIPAAAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [patients, setPatients] = useState<Patient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(false);
  const [consentDialog, setConsentDialog] = useState<{
    open: boolean;
    patient: Patient | null;
  }>({ open: false, patient: null });
  const [accessConsent, setAccessConsent] = useState(false);
  const [auditReason, setAuditReason] = useState(accessReason);

  // Check if user has required permission
  const hasRequiredPermission = hasPermission(requiredPermission as any);

  useEffect(() => {
    if (hasRequiredPermission) {
      loadPatients();
    }
  }, [hasRequiredPermission]);

  useEffect(() => {
    // Filter patients based on search term
    if (!searchTerm.trim()) {
      setFilteredPatients(patients);
      return;
    }

    const filtered = patients.filter(patient => {
      const fullName = `${patient.first_name} ${patient.last_name}`.toLowerCase();
      const patientId = patient.patient_id.toLowerCase();
      const email = (patient.email || '').toLowerCase();
      const search = searchTerm.toLowerCase();

      return fullName.includes(search) || 
             patientId.includes(search) || 
             email.includes(search);
    });

    setFilteredPatients(filtered);
  }, [searchTerm, patients]);

  const loadPatients = async () => {
    setLoading(true);
    try {
      const patientsData = await fetchPatients();
      setPatients(patientsData);
      setFilteredPatients(patientsData);
    } catch (error) {
      console.error('Error loading patients:', error);
      toast.error('Failed to load patients');
    } finally {
      setLoading(false);
    }
  };

  const handlePatientSelect = async (patient: Patient) => {
    // Always require explicit consent for PHI access
    if (showSensitiveData || profile?.role !== 'patient') {
      setConsentDialog({ open: true, patient });
    } else {
      // For basic access, proceed directly
      await logPatientAccess(patient, 'basic_access');
      onPatientSelect(patient);
    }
  };

  const handleConsentSubmit = async () => {
    if (!consentDialog.patient || !accessConsent || !auditReason.trim()) {
      toast.error('Please provide consent and access reason');
      return;
    }

    try {
      await logPatientAccess(consentDialog.patient, 'phi_access');
      onPatientSelect(consentDialog.patient);
      setConsentDialog({ open: false, patient: null });
      setAccessConsent(false);
      setAuditReason('');
      toast.success('Patient access granted');
    } catch (error) {
      console.error('Error logging patient access:', error);
      toast.error('Failed to log patient access');
    }
  };

  const logPatientAccess = async (patient: Patient, accessType: string) => {
    try {
      await HIPAAService.logAudit({
        action: 'PATIENT_ACCESS',
        resource_type: 'patients',
        resource_id: patient.id,
        patient_id: patient.id,
        phi_accessed: accessType === 'phi_access',
        details: {
          access_type: accessType,
          reason: auditReason,
          patient_identifier: patient.patient_id,
          sensitive_data_requested: showSensitiveData
        }
      });
    } catch (error) {
      console.error('Error logging patient access:', error);
      throw error;
    }
  };

  const maskSensitiveData = (data: string, visible: boolean = false) => {
    if (visible || !showSensitiveData) return data;
    return '*'.repeat(data.length);
  };

  if (!hasRequiredPermission) {
    return (
      <Alert className={className}>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          You do not have permission to access patient data. Required permission: {requiredPermission}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            HIPAA-Compliant Patient Search
            {showSensitiveData && (
              <Badge variant="destructive" className="text-xs">
                PHI Access
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search patients by name, ID, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Patient List */}
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {loading ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                <p className="text-sm text-muted-foreground mt-2">Loading patients...</p>
              </div>
            ) : filteredPatients.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">
                {searchTerm ? `No patients found for "${searchTerm}"` : 'No patients available'}
              </p>
            ) : (
              filteredPatients.map((patient) => (
                <Card
                  key={patient.id}
                  className={`cursor-pointer transition-colors hover:bg-accent ${
                    selectedPatientId === patient.id ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => handlePatientSelect(patient)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">
                            {maskSensitiveData(`${patient.first_name} ${patient.last_name}`)}
                          </h4>
                          <Badge variant="outline" className="text-xs">
                            {patient.patient_id}
                          </Badge>
                          {showSensitiveData && (
                            <Badge variant="secondary" className="text-xs">
                              <Lock className="h-3 w-3 mr-1" />
                              PHI
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <p>{maskSensitiveData(patient.email || 'No email')}</p>
                          <p>{maskSensitiveData(patient.contact_number || 'No phone')}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant={patient.status === 'active' ? 'default' : 'secondary'}>
                          {patient.status}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Consent Dialog */}
      <Dialog open={consentDialog.open} onOpenChange={(open) => setConsentDialog({ open, patient: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              PHI Access Consent Required
            </DialogTitle>
            <DialogDescription>
              You are requesting access to Protected Health Information (PHI) for:
              <strong className="block mt-1">
                {consentDialog.patient && 
                  `${consentDialog.patient.first_name} ${consentDialog.patient.last_name} (${consentDialog.patient.patient_id})`
                }
              </strong>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label htmlFor="audit-reason" className="block text-sm font-medium mb-1">
                Reason for Access <span className="text-destructive">*</span>
              </label>
              <Input
                id="audit-reason"
                placeholder="Enter medical or administrative reason for accessing this patient's PHI..."
                value={auditReason}
                onChange={(e) => setAuditReason(e.target.value)}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="consent"
                checked={accessConsent}
                onCheckedChange={(checked) => setAccessConsent(checked === true)}
              />
              <label
                htmlFor="consent"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I acknowledge that I am accessing PHI for legitimate medical/administrative purposes
                and will maintain confidentiality in accordance with HIPAA regulations.
              </label>
            </div>

            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                This access will be logged and audited. Unauthorized access to PHI is a violation
                of HIPAA and may result in civil and criminal penalties.
              </AlertDescription>
            </Alert>

            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => setConsentDialog({ open: false, patient: null })}
              >
                Cancel
              </Button>
              <Button
                onClick={handleConsentSubmit}
                disabled={!accessConsent || !auditReason.trim()}
              >
                Grant Access
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}