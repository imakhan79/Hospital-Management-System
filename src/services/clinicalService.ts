
import { supabase } from "@/integrations/supabase/client";

export type ClinicalCase = {
  id: string;
  patient_id: string;
  record_date: string;
  diagnosis: string | null;
  symptoms: string | null;
  treatment: string | null;
  doctor: string;
  department: string | null;
};

export type PatientDetails = {
  id: string;
  patient_id: string;
  first_name: string;
  last_name: string;
  gender: string | null;
  date_of_birth: string | null;
  status: string;
  medical_records?: ClinicalCase[];
};

export async function fetchClinicalCases(
  page = 1,
  pageSize = 10,
  searchTerm = ""
): Promise<{ cases: ClinicalCase[]; count: number }> {
  // Calculate the range for pagination
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("medical_records")
    .select("*, patients!inner(first_name, last_name)", { count: "exact" });

  // Apply search term if provided
  if (searchTerm) {
    query = query
      .or(
        `diagnosis.ilike.%${searchTerm}%,symptoms.ilike.%${searchTerm}%,doctor.ilike.%${searchTerm}%,patients.first_name.ilike.%${searchTerm}%,patients.last_name.ilike.%${searchTerm}%`
      );
  }

  const { data, count, error } = await query.range(from, to);

  if (error) {
    console.error("Error fetching clinical cases:", error);
    throw new Error("Failed to fetch clinical cases");
  }

  // Transform the data to match our expected format
  const clinicalCases = data.map((record: any) => {
    return {
      id: record.id,
      patient_id: record.patient_id,
      record_date: record.record_date,
      diagnosis: record.diagnosis,
      symptoms: record.symptoms,
      treatment: record.treatment,
      doctor: record.doctor,
      department: record.department,
      patient_name: `${record.patients.first_name} ${record.patients.last_name}`,
    };
  });

  return { cases: clinicalCases, count: count || 0 };
}

export async function fetchDepartmentStatistics(): Promise<{ department: string; count: number }[]> {
  const { data, error } = await supabase
    .from("medical_records")
    .select("department")
    .not("department", "is", null);

  if (error) {
    console.error("Error fetching department statistics:", error);
    throw new Error("Failed to fetch department statistics");
  }

  // Calculate counts for each department
  const departmentCounts = data.reduce((acc: { [key: string]: number }, record) => {
    const dept = record.department || "Uncategorized";
    acc[dept] = (acc[dept] || 0) + 1;
    return acc;
  }, {});

  // Convert to array format
  return Object.entries(departmentCounts).map(([department, count]) => ({
    department,
    count: count as number,
  }));
}

export async function fetchRecentPatients(limit = 5): Promise<PatientDetails[]> {
  const { data, error } = await supabase
    .from("patients")
    .select("id, patient_id, first_name, last_name, gender, date_of_birth, status")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching recent patients:", error);
    throw new Error("Failed to fetch recent patients");
  }

  return data;
}

export async function fetchDiagnosisStatistics(): Promise<{ diagnosis: string; count: number }[]> {
  const { data, error } = await supabase
    .from("medical_records")
    .select("diagnosis")
    .not("diagnosis", "is", null);

  if (error) {
    console.error("Error fetching diagnosis statistics:", error);
    throw new Error("Failed to fetch diagnosis statistics");
  }

  // Calculate counts for each diagnosis
  const diagnosisCounts = data.reduce((acc: { [key: string]: number }, record) => {
    const diagnosis = record.diagnosis || "Unknown";
    acc[diagnosis] = (acc[diagnosis] || 0) + 1;
    return acc;
  }, {});

  // Convert to array format and take top 10
  return Object.entries(diagnosisCounts)
    .map(([diagnosis, count]) => ({
      diagnosis,
      count: count as number,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
}
