
import { supabase } from "@/integrations/supabase/client";
import { LabTest } from "@/types";

export async function fetchLabTests(): Promise<LabTest[]> {
  try {
    // We'll skip trying to query Supabase tables that don't exist and just use mock data
    console.info("Falling back to mock lab test data");
    return generateMockLabTests();
  } catch (error) {
    console.error("Error fetching lab tests:", error);
    return generateMockLabTests();
  }
}

// Function to generate mock lab test data
function generateMockLabTests(): LabTest[] {
  const testTypes = ['Blood Test', 'Urinalysis', 'X-Ray', 'MRI', 'CT Scan', 'Ultrasound'];
  const statuses = ['Pending', 'In Progress', 'Completed', 'Cancelled'];
  const priorities = ['Normal', 'Urgent', 'Critical'];
  const doctors = ['Dr. John Smith', 'Dr. Sarah Johnson', 'Dr. Michael Lee', 'Dr. Emily Chen'];
  
  return Array.from({ length: 50 }, (_, i) => {
    const today = new Date();
    const pastDate = new Date();
    pastDate.setDate(today.getDate() - Math.floor(Math.random() * 14));
    
    const completed = Math.random() > 0.3;
    const completedDate = completed ? new Date(pastDate.getTime() + (1000 * 60 * 60 * 24 * Math.floor(Math.random() * 5))) : null;
    
    return {
      id: `test-${i + 1}`,
      patient_id: `patient-${Math.floor(Math.random() * 100) + 1}`,
      patient_name: `Patient ${Math.floor(Math.random() * 100) + 1}`,
      test_type: testTypes[i % testTypes.length],
      requested_date: pastDate.toISOString(),
      requested_by: doctors[Math.floor(Math.random() * doctors.length)],
      result: completed ? `Result for test ${i + 1}` : null,
      status: completed ? 'Completed' : statuses[Math.floor(Math.random() * (statuses.length - 1))],
      priority: priorities[Math.floor(Math.random() * priorities.length)],
      completed_date: completedDate ? completedDate.toISOString() : null,
      comments: Math.random() > 0.7 ? `Comments for test ${i + 1}` : null
    };
  });
}
