
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle, AlertTriangle, FileText, User, Save } from "lucide-react";

interface ChecklistItem {
  id: string;
  text: string;
  checked: boolean;
}

interface ChecklistCategory {
  category: string;
  items: ChecklistItem[];
}

interface Patient {
  id: string;
  name: string;
  procedure: string;
  time: string;
  status: "pending" | "in-progress" | "completed";
}

export const PreOpChecklist = () => {
  const [selectedPatientId, setSelectedPatientId] = useState("1");
  const [specialNotes, setSpecialNotes] = useState("");
  
  const [patients] = useState<Patient[]>([
    { id: "1", name: "John Doe", procedure: "Appendectomy", time: "08:00 AM", status: "in-progress" },
    { id: "2", name: "Mary Smith", procedure: "Gallbladder Surgery", time: "10:30 AM", status: "pending" },
    { id: "3", name: "Robert Johnson", procedure: "Hernia Repair", time: "02:00 PM", status: "completed" }
  ]);

  const [checklistData, setChecklistData] = useState<Record<string, ChecklistCategory[]>>({
    "1": [
      {
        category: "Patient Identification",
        items: [
          { id: "patient-id", text: "Patient identity verified", checked: true },
          { id: "allergy-check", text: "Allergies documented and verified", checked: true },
          { id: "medical-history", text: "Medical history reviewed", checked: true },
          { id: "consent-signed", text: "Informed consent signed", checked: false }
        ]
      },
      {
        category: "Pre-operative Assessment",
        items: [
          { id: "vitals-checked", text: "Vital signs recorded", checked: true },
          { id: "lab-results", text: "Lab results reviewed", checked: true },
          { id: "imaging-reviewed", text: "Imaging studies reviewed", checked: false },
          { id: "anesthesia-eval", text: "Anesthesia evaluation completed", checked: false }
        ]
      },
      {
        category: "Surgical Preparation",
        items: [
          { id: "surgical-site", text: "Surgical site marked", checked: false },
          { id: "prep-completed", text: "Skin preparation completed", checked: false },
          { id: "positioning", text: "Patient positioning verified", checked: false },
          { id: "equipment-check", text: "Surgical equipment checked", checked: false }
        ]
      },
      {
        category: "Documentation",
        items: [
          { id: "surgical-plan", text: "Surgical plan documented", checked: true },
          { id: "team-briefing", text: "Surgical team briefing completed", checked: false },
          { id: "timeout", text: "Surgical timeout performed", checked: false },
          { id: "final-verification", text: "Final verification completed", checked: false }
        ]
      }
    ],
    "2": [
      {
        category: "Patient Identification",
        items: [
          { id: "patient-id-2", text: "Patient identity verified", checked: false },
          { id: "allergy-check-2", text: "Allergies documented and verified", checked: false },
          { id: "medical-history-2", text: "Medical history reviewed", checked: false },
          { id: "consent-signed-2", text: "Informed consent signed", checked: false }
        ]
      },
      {
        category: "Pre-operative Assessment",
        items: [
          { id: "vitals-checked-2", text: "Vital signs recorded", checked: false },
          { id: "lab-results-2", text: "Lab results reviewed", checked: false },
          { id: "imaging-reviewed-2", text: "Imaging studies reviewed", checked: false },
          { id: "anesthesia-eval-2", text: "Anesthesia evaluation completed", checked: false }
        ]
      },
      {
        category: "Surgical Preparation",
        items: [
          { id: "surgical-site-2", text: "Surgical site marked", checked: false },
          { id: "prep-completed-2", text: "Skin preparation completed", checked: false },
          { id: "positioning-2", text: "Patient positioning verified", checked: false },
          { id: "equipment-check-2", text: "Surgical equipment checked", checked: false }
        ]
      },
      {
        category: "Documentation",
        items: [
          { id: "surgical-plan-2", text: "Surgical plan documented", checked: false },
          { id: "team-briefing-2", text: "Surgical team briefing completed", checked: false },
          { id: "timeout-2", text: "Surgical timeout performed", checked: false },
          { id: "final-verification-2", text: "Final verification completed", checked: false }
        ]
      }
    ],
    "3": [
      {
        category: "Patient Identification",
        items: [
          { id: "patient-id-3", text: "Patient identity verified", checked: true },
          { id: "allergy-check-3", text: "Allergies documented and verified", checked: true },
          { id: "medical-history-3", text: "Medical history reviewed", checked: true },
          { id: "consent-signed-3", text: "Informed consent signed", checked: true }
        ]
      },
      {
        category: "Pre-operative Assessment",
        items: [
          { id: "vitals-checked-3", text: "Vital signs recorded", checked: true },
          { id: "lab-results-3", text: "Lab results reviewed", checked: true },
          { id: "imaging-reviewed-3", text: "Imaging studies reviewed", checked: true },
          { id: "anesthesia-eval-3", text: "Anesthesia evaluation completed", checked: true }
        ]
      },
      {
        category: "Surgical Preparation",
        items: [
          { id: "surgical-site-3", text: "Surgical site marked", checked: true },
          { id: "prep-completed-3", text: "Skin preparation completed", checked: true },
          { id: "positioning-3", text: "Patient positioning verified", checked: true },
          { id: "equipment-check-3", text: "Surgical equipment checked", checked: true }
        ]
      },
      {
        category: "Documentation",
        items: [
          { id: "surgical-plan-3", text: "Surgical plan documented", checked: true },
          { id: "team-briefing-3", text: "Surgical team briefing completed", checked: true },
          { id: "timeout-3", text: "Surgical timeout performed", checked: true },
          { id: "final-verification-3", text: "Final verification completed", checked: true }
        ]
      }
    ]
  });

  const selectedPatient = patients.find(p => p.id === selectedPatientId);
  const checklistItems = checklistData[selectedPatientId] || [];

  const completionPercentage = () => {
    const totalItems = checklistItems.reduce((acc, category) => acc + category.items.length, 0);
    const checkedItems = checklistItems.reduce((acc, category) => 
      acc + category.items.filter(item => item.checked).length, 0);
    return totalItems > 0 ? Math.round((checkedItems / totalItems) * 100) : 0;
  };

  const handleCheckboxChange = (categoryIndex: number, itemIndex: number, checked: boolean) => {
    setChecklistData(prev => ({
      ...prev,
      [selectedPatientId]: prev[selectedPatientId].map((category, catIdx) =>
        catIdx === categoryIndex
          ? {
              ...category,
              items: category.items.map((item, itemIdx) =>
                itemIdx === itemIndex ? { ...item, checked } : item
              )
            }
          : category
      )
    }));
  };

  return (
    <div className="space-y-4 sm:space-y-6 p-2 sm:p-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Pre-Operative Checklist</h2>
          <p className="text-sm text-muted-foreground">
            Ensure all pre-operative requirements are completed
          </p>
        </div>
        <Button className="w-full sm:w-auto">
          <FileText className="mr-2 h-4 w-4" />
          Generate Report
        </Button>
      </div>

      {/* Patient Selection and Progress */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base sm:text-lg">Selected Patient</CardTitle>
            <CardDescription className="text-sm">Current patient for checklist</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Select value={selectedPatientId} onValueChange={setSelectedPatientId}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {patients.map((patient) => (
                    <SelectItem key={patient.id} value={patient.id}>
                      {patient.name} - {patient.procedure}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {selectedPatient && (
                <>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium text-sm">{selectedPatient.name}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {selectedPatient.procedure} - {selectedPatient.time}
                  </div>
                </>
              )}
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span className="font-medium">{completionPercentage()}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                    style={{width: `${completionPercentage()}%`}}
                  ></div>
                </div>
              </div>
              
              {completionPercentage() === 100 ? (
                <Badge className="w-full justify-center">
                  <CheckCircle className="mr-1 h-3 w-3" />
                  Ready for Surgery
                </Badge>
              ) : (
                <Badge variant="secondary" className="w-full justify-center">
                  <AlertTriangle className="mr-1 h-3 w-3" />
                  Checklist Incomplete
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-base sm:text-lg">All Patients</CardTitle>
            <CardDescription className="text-sm">Patients requiring pre-op checklist</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {patients.map((patient) => (
                <div 
                  key={patient.id} 
                  className={`flex flex-col sm:flex-row sm:items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedPatientId === patient.id ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedPatientId(patient.id)}
                >
                  <div className="space-y-1">
                    <div className="font-medium text-sm">{patient.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {patient.procedure} - {patient.time}
                    </div>
                  </div>
                  <Badge 
                    variant={
                      patient.status === "completed" ? "default" :
                      patient.status === "in-progress" ? "secondary" : "outline"
                    }
                    className="mt-2 sm:mt-0 w-fit"
                  >
                    {patient.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Checklist Categories */}
      <div className="grid gap-4 md:grid-cols-2">
        {checklistItems.map((category, categoryIndex) => (
          <Card key={categoryIndex}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base sm:text-lg">{category.category}</CardTitle>
              <CardDescription className="text-sm">
                {category.items.filter(item => item.checked).length}/{category.items.length} completed
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {category.items.map((item, itemIndex) => (
                  <div key={item.id} className="flex items-center space-x-2">
                    <Checkbox 
                      id={item.id}
                      checked={item.checked}
                      onCheckedChange={(checked) => 
                        handleCheckboxChange(categoryIndex, itemIndex, checked as boolean)
                      }
                      className="data-[state=checked]:bg-blue-600"
                    />
                    <label 
                      htmlFor={item.id}
                      className={`text-sm cursor-pointer ${item.checked ? 'line-through text-muted-foreground' : ''}`}
                    >
                      {item.text}
                    </label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Consent Forms and Notes */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base sm:text-lg">Consent Forms</CardTitle>
            <CardDescription className="text-sm">Digital consent management</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border rounded-lg gap-2">
                <div className="flex-1">
                  <div className="font-medium text-sm">Surgical Consent</div>
                  <div className="text-sm text-muted-foreground">General surgical procedure consent</div>
                </div>
                <Badge className="w-fit">Signed</Badge>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border rounded-lg gap-2">
                <div className="flex-1">
                  <div className="font-medium text-sm">Anesthesia Consent</div>
                  <div className="text-sm text-muted-foreground">Anesthesia administration consent</div>
                </div>
                <Badge variant="outline" className="w-fit">Pending</Badge>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border rounded-lg gap-2">
                <div className="flex-1">
                  <div className="font-medium text-sm">Blood Transfusion</div>
                  <div className="text-sm text-muted-foreground">Blood product consent (if needed)</div>
                </div>
                <Badge variant="secondary" className="w-fit">N/A</Badge>
              </div>
            </div>
            
            <Button className="w-full">
              <FileText className="mr-2 h-4 w-4" />
              View All Consent Forms
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base sm:text-lg">Special Notes</CardTitle>
            <CardDescription className="text-sm">Additional pre-operative considerations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea 
              placeholder="Enter any special instructions, allergies, or considerations for this patient..."
              rows={6}
              value={specialNotes}
              onChange={(e) => setSpecialNotes(e.target.value)}
            />
            <Button className="w-full">
              <Save className="mr-2 h-4 w-4" />
              Save Notes
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
