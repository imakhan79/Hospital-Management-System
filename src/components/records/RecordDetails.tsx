
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash } from "lucide-react";
import { MedicalRecord } from "@/types";
import { toast } from "@/components/ui/sonner";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface RecordDetailsProps {
  record: MedicalRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (record: MedicalRecord) => void;
  onDelete?: (recordId: string) => void;
}

export function RecordDetails({ record, isOpen, onClose, onEdit, onDelete }: RecordDetailsProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  if (!record) {
    return null;
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (e) {
      return dateString;
    }
  };

  const handleDeleteClick = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (onDelete && record) {
      onDelete(record.id);
      toast.success("Medical record deleted successfully");
    }
    setIsDeleteDialogOpen(false);
    onClose();
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Medical Record Details</DialogTitle>
            <DialogDescription>
              Viewing medical record from {formatDate(record.record_date)}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">Record Information</h3>
                <p className="text-sm text-muted-foreground">
                  Created on {formatDate(record.created_at)}
                  {record.created_at !== record.updated_at && 
                    ` • Updated on ${formatDate(record.updated_at)}`}
                </p>
              </div>
              
              <div className="flex space-x-2">
                {onEdit && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => {
                      onEdit(record);
                      onClose();
                    }}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                )}
                {onDelete && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleDeleteClick}
                    className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
                  >
                    <Trash className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Record Date</p>
                <p className="text-sm">{formatDate(record.record_date)}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Department</p>
                {record.department ? (
                  <Badge 
                    className={
                      record.department === "Emergency" ? "bg-red-100 text-red-800" :
                      record.department === "Cardiology" ? "bg-blue-100 text-blue-800" :
                      record.department === "Neurology" ? "bg-purple-100 text-purple-800" :
                      record.department === "Pediatrics" ? "bg-green-100 text-green-800" :
                      "bg-gray-100 text-gray-800"
                    }
                    variant="outline"
                  >
                    {record.department}
                  </Badge>
                ) : (
                  <span className="text-gray-400">Not specified</span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Patient ID</p>
                <p className="text-sm">{record.patient_id}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Doctor</p>
                <p className="text-sm">{record.doctor}</p>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium">Diagnosis</p>
              <p className="text-sm">{record.diagnosis || 'No diagnosis recorded'}</p>
            </div>

            <div>
              <p className="text-sm font-medium">Symptoms</p>
              <p className="text-sm">{record.symptoms || 'No symptoms recorded'}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Treatment</p>
                <p className="text-sm">{record.treatment || 'No treatment recorded'}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Medication</p>
                <p className="text-sm">{record.medication || 'No medication recorded'}</p>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium">Notes</p>
              <p className="text-sm whitespace-pre-wrap">{record.notes || 'No notes recorded'}</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this record?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the medical record from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default RecordDetails;
