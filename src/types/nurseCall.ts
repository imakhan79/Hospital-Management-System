
export interface CallRequest {
  id: string;
  patient_id: string;
  patient_name: string;
  room_number: string;
  department: string;
  call_type: 'general' | 'emergency' | 'assistance' | 'bathroom' | 'pain' | 'medication';
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'acknowledged' | 'in_progress' | 'resolved' | 'cancelled';
  timestamp: string;
  acknowledged_at?: string;
  responded_at?: string;
  resolved_at?: string;
  assigned_nurse_id?: string;
  assigned_nurse_name?: string;
  notes?: string;
  response_time?: number; // in seconds
  voice_call_enabled?: boolean;
}

export interface NurseStation {
  id: string;
  name: string;
  department: string;
  active_calls: number;
  staff_on_duty: number;
  last_updated: string;
}

export interface CallStats {
  total_calls_today: number;
  pending_calls: number;
  average_response_time: number;
  critical_alerts: number;
  resolved_calls: number;
}
