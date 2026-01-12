
import { supabase } from "@/integrations/supabase/client";
import { Staff } from "@/types";

export async function fetchStaff(
  page = 1, 
  pageSize = 10, 
  searchQuery = ""
): Promise<{ staff: Staff[], count: number }> {
  try {
    // We'll skip trying to query Supabase tables and just use mock data
    console.info("Falling back to mock staff data");
    const mockStaff = generateMockStaff(1000);
    
    // Apply filtering based on search query
    const filteredStaff = searchQuery 
      ? mockStaff.filter(s => 
          `${s.first_name} ${s.last_name} ${s.staff_id} ${s.department} ${s.role}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        )
      : mockStaff;
    
    // Apply pagination
    const paginatedStaff = filteredStaff.slice((page - 1) * pageSize, page * pageSize);
    
    return {
      staff: paginatedStaff,
      count: filteredStaff.length
    };
  } catch (error) {
    console.error("Error fetching staff:", error);
    
    // Return mock data if there's an error
    const mockStaff = generateMockStaff(1000);
    
    // Apply filtering based on search query
    const filteredStaff = searchQuery 
      ? mockStaff.filter(s => 
          `${s.first_name} ${s.last_name} ${s.staff_id} ${s.department} ${s.role}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        )
      : mockStaff;
    
    // Apply pagination
    const paginatedStaff = filteredStaff.slice((page - 1) * pageSize, page * pageSize);
    
    return {
      staff: paginatedStaff,
      count: filteredStaff.length
    };
  }
}

export async function fetchStaffById(id: string): Promise<Staff | null> {
  try {
    // Generate mock staff and find the requested one
    const mockStaff = generateMockStaff(1000);
    return mockStaff.find(s => s.id === id) || null;
  } catch (error) {
    console.error('Error fetching staff details:', error);
    // Try to find in mock data
    const mockStaff = generateMockStaff(1000);
    return mockStaff.find(s => s.id === id) || null;
  }
}

// Function to generate sample staff data
function generateMockStaff(count: number): Staff[] {
  const roles = ['Doctor', 'Nurse', 'Surgeon', 'Specialist', 'Resident', 'Administrative', 'Lab Technician', 'Pharmacist'];
  const departments = ['Cardiology', 'Neurology', 'Pediatrics', 'Oncology', 'Emergency', 'Surgery', 'Radiology', 'Pathology', 'Administration', 'Pharmacy'];
  const specializations = ['General', 'Cardiovascular', 'Neurological', 'Pediatric', 'Oncological', 'Trauma', 'Surgical', 'Diagnostic', 'Pharmaceutical'];
  const statuses = ['Active', 'On Leave', 'Part-time', 'Visiting'];
  const qualifications = ['MD', 'Ph.D', 'RN', 'PA', 'MS', 'BS', 'PharmD', 'MBA'];

  const firstNames = ['James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda', 'William', 'Elizabeth', 
                    'David', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica', 'Thomas', 'Sarah', 'Charles', 'Karen',
                    'Emma', 'Noah', 'Olivia', 'Liam', 'Ava', 'Ethan', 'Sophia', 'Mason', 'Isabella', 'Lucas'];
  
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 
                   'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin',
                   'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson'];

  return Array.from({ length: count }, (_, i) => {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const role = roles[Math.floor(Math.random() * roles.length)];
    const department = departments[Math.floor(Math.random() * departments.length)];
    const specialization = role === 'Doctor' || role === 'Surgeon' || role === 'Specialist' 
        ? specializations[Math.floor(Math.random() * specializations.length)]
        : null;
    const qualification = qualifications[Math.floor(Math.random() * qualifications.length)];
    
    // Generate a date for hiring between 1 and 15 years ago
    const hireDate = new Date();
    const yearsAgo = Math.floor(Math.random() * 15) + 1;
    hireDate.setFullYear(hireDate.getFullYear() - yearsAgo);
    
    // Generate a random birth date for someone between 25 and 65 years old
    const birthDate = new Date();
    const age = Math.floor(Math.random() * 40) + 25;
    birthDate.setFullYear(birthDate.getFullYear() - age);
    
    return {
      id: `staff-${i + 1}`,
      staff_id: `S${10000 + i}`,
      first_name: firstName,
      last_name: lastName,
      role: role,
      department: department,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@hospital.com`,
      contact_number: `(${Math.floor(Math.random() * 900) + 100}) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
      date_of_birth: birthDate.toISOString().split('T')[0],
      hire_date: hireDate.toISOString().split('T')[0],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      specialization: specialization,
      qualification: qualification,
      address: `${Math.floor(Math.random() * 9000) + 1000} Medical Center Drive, Suite ${Math.floor(Math.random() * 900) + 100}`,
      emergency_contact: Math.random() > 0.3 ? `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}` : null,
      emergency_contact_number: Math.random() > 0.3 ? `(${Math.floor(Math.random() * 900) + 100}) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}` : null
    };
  });
}
