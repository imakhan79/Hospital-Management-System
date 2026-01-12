export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      ambulance_dispatch: {
        Row: {
          ambulance_id: string
          arrival_time: string | null
          chief_complaint: string | null
          created_at: string
          crew_members: string[] | null
          dispatch_number: string
          dispatch_time: string
          equipment_used: string[] | null
          eta: string | null
          id: string
          notes: string | null
          patient_age: number | null
          patient_name: string | null
          pickup_location: string
          priority_level: number | null
          status: string
          updated_at: string
        }
        Insert: {
          ambulance_id: string
          arrival_time?: string | null
          chief_complaint?: string | null
          created_at?: string
          crew_members?: string[] | null
          dispatch_number: string
          dispatch_time?: string
          equipment_used?: string[] | null
          eta?: string | null
          id?: string
          notes?: string | null
          patient_age?: number | null
          patient_name?: string | null
          pickup_location: string
          priority_level?: number | null
          status?: string
          updated_at?: string
        }
        Update: {
          ambulance_id?: string
          arrival_time?: string | null
          chief_complaint?: string | null
          created_at?: string
          crew_members?: string[] | null
          dispatch_number?: string
          dispatch_time?: string
          equipment_used?: string[] | null
          eta?: string | null
          id?: string
          notes?: string | null
          patient_age?: number | null
          patient_name?: string | null
          pickup_location?: string
          priority_level?: number | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      data_access_requests: {
        Row: {
          fulfillment_method: string | null
          id: string
          notes: string | null
          patient_id: string
          processed_at: string | null
          processed_by: string | null
          request_type: string
          requested_at: string
          response_due_date: string
          status: string
        }
        Insert: {
          fulfillment_method?: string | null
          id?: string
          notes?: string | null
          patient_id: string
          processed_at?: string | null
          processed_by?: string | null
          request_type: string
          requested_at?: string
          response_due_date?: string
          status?: string
        }
        Update: {
          fulfillment_method?: string | null
          id?: string
          notes?: string | null
          patient_id?: string
          processed_at?: string | null
          processed_by?: string | null
          request_type?: string
          requested_at?: string
          response_due_date?: string
          status?: string
        }
        Relationships: []
      }
      er_alerts: {
        Row: {
          alert_type: string
          created_at: string
          description: string
          er_patient_id: string | null
          id: string
          location: string | null
          resolution_notes: string | null
          resolved_time: string | null
          severity: string
          status: string
          team_members_notified: string[] | null
          triggered_by: string
          triggered_time: string
          updated_at: string
        }
        Insert: {
          alert_type: string
          created_at?: string
          description: string
          er_patient_id?: string | null
          id?: string
          location?: string | null
          resolution_notes?: string | null
          resolved_time?: string | null
          severity: string
          status?: string
          team_members_notified?: string[] | null
          triggered_by: string
          triggered_time?: string
          updated_at?: string
        }
        Update: {
          alert_type?: string
          created_at?: string
          description?: string
          er_patient_id?: string | null
          id?: string
          location?: string | null
          resolution_notes?: string | null
          resolved_time?: string | null
          severity?: string
          status?: string
          team_members_notified?: string[] | null
          triggered_by?: string
          triggered_time?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "er_alerts_er_patient_id_fkey"
            columns: ["er_patient_id"]
            isOneToOne: false
            referencedRelation: "er_patients"
            referencedColumns: ["id"]
          },
        ]
      }
      er_beds: {
        Row: {
          bed_number: string
          bed_type: string
          created_at: string
          current_patient_id: string | null
          equipment: string[] | null
          id: string
          location_description: string | null
          status: string
          updated_at: string
          zone: string
        }
        Insert: {
          bed_number: string
          bed_type: string
          created_at?: string
          current_patient_id?: string | null
          equipment?: string[] | null
          id?: string
          location_description?: string | null
          status?: string
          updated_at?: string
          zone: string
        }
        Update: {
          bed_number?: string
          bed_type?: string
          created_at?: string
          current_patient_id?: string | null
          equipment?: string[] | null
          id?: string
          location_description?: string | null
          status?: string
          updated_at?: string
          zone?: string
        }
        Relationships: [
          {
            foreignKeyName: "er_beds_current_patient_id_fkey"
            columns: ["current_patient_id"]
            isOneToOne: false
            referencedRelation: "er_patients"
            referencedColumns: ["id"]
          },
        ]
      }
      er_orders: {
        Row: {
          completed_time: string | null
          created_at: string
          er_patient_id: string
          id: string
          notes: string | null
          order_category: string | null
          order_details: string
          order_type: string
          ordered_by: string
          ordered_time: string
          results: string | null
          status: string
          updated_at: string
          urgency: string
        }
        Insert: {
          completed_time?: string | null
          created_at?: string
          er_patient_id: string
          id?: string
          notes?: string | null
          order_category?: string | null
          order_details: string
          order_type: string
          ordered_by: string
          ordered_time?: string
          results?: string | null
          status?: string
          updated_at?: string
          urgency?: string
        }
        Update: {
          completed_time?: string | null
          created_at?: string
          er_patient_id?: string
          id?: string
          notes?: string | null
          order_category?: string | null
          order_details?: string
          order_type?: string
          ordered_by?: string
          ordered_time?: string
          results?: string | null
          status?: string
          updated_at?: string
          urgency?: string
        }
        Relationships: [
          {
            foreignKeyName: "er_orders_er_patient_id_fkey"
            columns: ["er_patient_id"]
            isOneToOne: false
            referencedRelation: "er_patients"
            referencedColumns: ["id"]
          },
        ]
      }
      er_patients: {
        Row: {
          arrival_method: string
          arrival_time: string
          assigned_doctor_id: string | null
          assigned_nurse_id: string | null
          bed_number: string | null
          chief_complaint: string
          created_at: string
          discharge_time: string | null
          disposition: string | null
          er_number: string
          estimated_wait_time: number | null
          id: string
          patient_id: string
          priority_score: number | null
          status: string
          treatment_start_time: string | null
          triage_level: number
          triage_notes: string | null
          updated_at: string
        }
        Insert: {
          arrival_method?: string
          arrival_time?: string
          assigned_doctor_id?: string | null
          assigned_nurse_id?: string | null
          bed_number?: string | null
          chief_complaint: string
          created_at?: string
          discharge_time?: string | null
          disposition?: string | null
          er_number: string
          estimated_wait_time?: number | null
          id?: string
          patient_id: string
          priority_score?: number | null
          status?: string
          treatment_start_time?: string | null
          triage_level?: number
          triage_notes?: string | null
          updated_at?: string
        }
        Update: {
          arrival_method?: string
          arrival_time?: string
          assigned_doctor_id?: string | null
          assigned_nurse_id?: string | null
          bed_number?: string | null
          chief_complaint?: string
          created_at?: string
          discharge_time?: string | null
          disposition?: string | null
          er_number?: string
          estimated_wait_time?: number | null
          id?: string
          patient_id?: string
          priority_score?: number | null
          status?: string
          treatment_start_time?: string | null
          triage_level?: number
          triage_notes?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "er_patients_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      er_statistics: {
        Row: {
          admissions: number | null
          average_length_of_stay: number | null
          average_wait_time: number | null
          bed_occupancy_rate: number | null
          common_complaints: Json | null
          created_at: string
          discharges: number | null
          id: string
          left_without_being_seen: number | null
          mortality_count: number | null
          patients_by_triage: Json | null
          report_date: string
          total_patients: number | null
          transfers: number | null
          updated_at: string
        }
        Insert: {
          admissions?: number | null
          average_length_of_stay?: number | null
          average_wait_time?: number | null
          bed_occupancy_rate?: number | null
          common_complaints?: Json | null
          created_at?: string
          discharges?: number | null
          id?: string
          left_without_being_seen?: number | null
          mortality_count?: number | null
          patients_by_triage?: Json | null
          report_date?: string
          total_patients?: number | null
          transfers?: number | null
          updated_at?: string
        }
        Update: {
          admissions?: number | null
          average_length_of_stay?: number | null
          average_wait_time?: number | null
          bed_occupancy_rate?: number | null
          common_complaints?: Json | null
          created_at?: string
          discharges?: number | null
          id?: string
          left_without_being_seen?: number | null
          mortality_count?: number | null
          patients_by_triage?: Json | null
          report_date?: string
          total_patients?: number | null
          transfers?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      er_triage: {
        Row: {
          chief_complaint: string
          created_at: string
          er_patient_id: string
          id: string
          initial_assessment: string | null
          priority_modifiers: string[] | null
          recommended_actions: string[] | null
          triage_level: number
          triage_time: string
          triaged_by: string
          vital_signs: Json | null
        }
        Insert: {
          chief_complaint: string
          created_at?: string
          er_patient_id: string
          id?: string
          initial_assessment?: string | null
          priority_modifiers?: string[] | null
          recommended_actions?: string[] | null
          triage_level: number
          triage_time?: string
          triaged_by: string
          vital_signs?: Json | null
        }
        Update: {
          chief_complaint?: string
          created_at?: string
          er_patient_id?: string
          id?: string
          initial_assessment?: string | null
          priority_modifiers?: string[] | null
          recommended_actions?: string[] | null
          triage_level?: number
          triage_time?: string
          triaged_by?: string
          vital_signs?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "er_triage_er_patient_id_fkey"
            columns: ["er_patient_id"]
            isOneToOne: false
            referencedRelation: "er_patients"
            referencedColumns: ["id"]
          },
        ]
      }
      er_vital_signs: {
        Row: {
          blood_pressure_diastolic: number | null
          blood_pressure_systolic: number | null
          consciousness_level: string | null
          created_at: string
          er_patient_id: string
          heart_rate: number | null
          id: string
          notes: string | null
          oxygen_saturation: number | null
          pain_scale: number | null
          recorded_by: string
          recorded_time: string
          respiratory_rate: number | null
          temperature: number | null
        }
        Insert: {
          blood_pressure_diastolic?: number | null
          blood_pressure_systolic?: number | null
          consciousness_level?: string | null
          created_at?: string
          er_patient_id: string
          heart_rate?: number | null
          id?: string
          notes?: string | null
          oxygen_saturation?: number | null
          pain_scale?: number | null
          recorded_by: string
          recorded_time?: string
          respiratory_rate?: number | null
          temperature?: number | null
        }
        Update: {
          blood_pressure_diastolic?: number | null
          blood_pressure_systolic?: number | null
          consciousness_level?: string | null
          created_at?: string
          er_patient_id?: string
          heart_rate?: number | null
          id?: string
          notes?: string | null
          oxygen_saturation?: number | null
          pain_scale?: number | null
          recorded_by?: string
          recorded_time?: string
          respiratory_rate?: number | null
          temperature?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "er_vital_signs_er_patient_id_fkey"
            columns: ["er_patient_id"]
            isOneToOne: false
            referencedRelation: "er_patients"
            referencedColumns: ["id"]
          },
        ]
      }
      hipaa_audit_log: {
        Row: {
          action: string
          details: Json | null
          id: string
          ip_address: unknown | null
          patient_id: string | null
          phi_accessed: boolean
          resource_id: string | null
          resource_type: string
          risk_level: string | null
          session_id: string | null
          timestamp: string
          user_agent: string | null
          user_email: string | null
          user_id: string | null
          user_role: Database["public"]["Enums"]["user_role"] | null
        }
        Insert: {
          action: string
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          patient_id?: string | null
          phi_accessed?: boolean
          resource_id?: string | null
          resource_type: string
          risk_level?: string | null
          session_id?: string | null
          timestamp?: string
          user_agent?: string | null
          user_email?: string | null
          user_id?: string | null
          user_role?: Database["public"]["Enums"]["user_role"] | null
        }
        Update: {
          action?: string
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          patient_id?: string | null
          phi_accessed?: boolean
          resource_id?: string | null
          resource_type?: string
          risk_level?: string | null
          session_id?: string | null
          timestamp?: string
          user_agent?: string | null
          user_email?: string | null
          user_id?: string | null
          user_role?: Database["public"]["Enums"]["user_role"] | null
        }
        Relationships: []
      }
      icd10_codes: {
        Row: {
          category: string
          code: string
          code_type: string
          created_at: string
          description: string
          effective_date: string | null
          id: string
          is_active: boolean
          is_billable: boolean
          revision_date: string | null
          subcategory: string | null
          updated_at: string
        }
        Insert: {
          category: string
          code: string
          code_type: string
          created_at?: string
          description: string
          effective_date?: string | null
          id?: string
          is_active?: boolean
          is_billable?: boolean
          revision_date?: string | null
          subcategory?: string | null
          updated_at?: string
        }
        Update: {
          category?: string
          code?: string
          code_type?: string
          created_at?: string
          description?: string
          effective_date?: string | null
          id?: string
          is_active?: boolean
          is_billable?: boolean
          revision_date?: string | null
          subcategory?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      medical_records: {
        Row: {
          access_level: string | null
          created_at: string
          created_by: string | null
          department: string | null
          diagnosis: string | null
          doctor: string
          icd10_diagnosis_codes: string[] | null
          icd10_procedure_codes: string[] | null
          id: string
          last_modified_by: string | null
          medication: string | null
          notes: string | null
          patient_id: string
          record_date: string
          symptoms: string | null
          treatment: string | null
          updated_at: string
        }
        Insert: {
          access_level?: string | null
          created_at?: string
          created_by?: string | null
          department?: string | null
          diagnosis?: string | null
          doctor: string
          icd10_diagnosis_codes?: string[] | null
          icd10_procedure_codes?: string[] | null
          id?: string
          last_modified_by?: string | null
          medication?: string | null
          notes?: string | null
          patient_id: string
          record_date?: string
          symptoms?: string | null
          treatment?: string | null
          updated_at?: string
        }
        Update: {
          access_level?: string | null
          created_at?: string
          created_by?: string | null
          department?: string | null
          diagnosis?: string | null
          doctor?: string
          icd10_diagnosis_codes?: string[] | null
          icd10_procedure_codes?: string[] | null
          id?: string
          last_modified_by?: string | null
          medication?: string | null
          notes?: string | null
          patient_id?: string
          record_date?: string
          symptoms?: string | null
          treatment?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "medical_records_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      patient_consent: {
        Row: {
          consent_type: string
          created_at: string
          digital_signature: string | null
          expires_at: string | null
          granted: boolean
          granted_at: string | null
          granted_by: string | null
          id: string
          patient_id: string
          updated_at: string
          witness: string | null
        }
        Insert: {
          consent_type: string
          created_at?: string
          digital_signature?: string | null
          expires_at?: string | null
          granted?: boolean
          granted_at?: string | null
          granted_by?: string | null
          id?: string
          patient_id: string
          updated_at?: string
          witness?: string | null
        }
        Update: {
          consent_type?: string
          created_at?: string
          digital_signature?: string | null
          expires_at?: string | null
          granted?: boolean
          granted_at?: string | null
          granted_by?: string | null
          id?: string
          patient_id?: string
          updated_at?: string
          witness?: string | null
        }
        Relationships: []
      }
      patient_encryption_keys: {
        Row: {
          created_at: string
          encryption_key: string
          id: string
          patient_id: string
          rotated_at: string | null
        }
        Insert: {
          created_at?: string
          encryption_key: string
          id?: string
          patient_id: string
          rotated_at?: string | null
        }
        Update: {
          created_at?: string
          encryption_key?: string
          id?: string
          patient_id?: string
          rotated_at?: string | null
        }
        Relationships: []
      }
      patients: {
        Row: {
          access_count: number | null
          address: string | null
          blood_type: string | null
          contact_number: string | null
          created_at: string
          data_sharing_consent: boolean | null
          date_of_birth: string | null
          email: string | null
          emergency_contact: string | null
          emergency_contact_number: string | null
          first_name: string
          gender: string | null
          id: string
          insurance_policy_number: string | null
          insurance_provider: string | null
          last_accessed: string | null
          last_name: string
          patient_id: string
          registration_date: string
          status: string
          updated_at: string
        }
        Insert: {
          access_count?: number | null
          address?: string | null
          blood_type?: string | null
          contact_number?: string | null
          created_at?: string
          data_sharing_consent?: boolean | null
          date_of_birth?: string | null
          email?: string | null
          emergency_contact?: string | null
          emergency_contact_number?: string | null
          first_name: string
          gender?: string | null
          id?: string
          insurance_policy_number?: string | null
          insurance_provider?: string | null
          last_accessed?: string | null
          last_name: string
          patient_id: string
          registration_date?: string
          status?: string
          updated_at?: string
        }
        Update: {
          access_count?: number | null
          address?: string | null
          blood_type?: string | null
          contact_number?: string | null
          created_at?: string
          data_sharing_consent?: boolean | null
          date_of_birth?: string | null
          email?: string | null
          emergency_contact?: string | null
          emergency_contact_number?: string | null
          first_name?: string
          gender?: string | null
          id?: string
          insurance_policy_number?: string | null
          insurance_provider?: string | null
          last_accessed?: string | null
          last_name?: string
          patient_id?: string
          registration_date?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      role_permissions: {
        Row: {
          id: string
          permission: Database["public"]["Enums"]["permission"]
          role: Database["public"]["Enums"]["user_role"]
        }
        Insert: {
          id?: string
          permission: Database["public"]["Enums"]["permission"]
          role: Database["public"]["Enums"]["user_role"]
        }
        Update: {
          id?: string
          permission?: Database["public"]["Enums"]["permission"]
          role?: Database["public"]["Enums"]["user_role"]
        }
        Relationships: []
      }
      telemedicine_appointments: {
        Row: {
          appointment_date: string
          appointment_type: string
          consultation_notes: string | null
          created_at: string
          doctor_id: string
          duration_minutes: number
          id: string
          patient_id: string
          payment_amount: number | null
          payment_method: string | null
          payment_status: string
          prescription: string | null
          session_recording_url: string | null
          status: string
          updated_at: string
        }
        Insert: {
          appointment_date: string
          appointment_type?: string
          consultation_notes?: string | null
          created_at?: string
          doctor_id: string
          duration_minutes?: number
          id?: string
          patient_id: string
          payment_amount?: number | null
          payment_method?: string | null
          payment_status?: string
          prescription?: string | null
          session_recording_url?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          appointment_date?: string
          appointment_type?: string
          consultation_notes?: string | null
          created_at?: string
          doctor_id?: string
          duration_minutes?: number
          id?: string
          patient_id?: string
          payment_amount?: number | null
          payment_method?: string | null
          payment_status?: string
          prescription?: string | null
          session_recording_url?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "telemedicine_appointments_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      telemedicine_audit_trail: {
        Row: {
          action: string
          appointment_id: string | null
          description: string | null
          id: string
          ip_address: string | null
          metadata: Json | null
          session_id: string | null
          timestamp: string
          user_agent: string | null
          user_id: string
          user_type: string
        }
        Insert: {
          action: string
          appointment_id?: string | null
          description?: string | null
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          session_id?: string | null
          timestamp?: string
          user_agent?: string | null
          user_id: string
          user_type: string
        }
        Update: {
          action?: string
          appointment_id?: string | null
          description?: string | null
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          session_id?: string | null
          timestamp?: string
          user_agent?: string | null
          user_id?: string
          user_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "telemedicine_audit_trail_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "telemedicine_appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "telemedicine_audit_trail_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "telemedicine_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      telemedicine_chat: {
        Row: {
          content: string
          file_name: string | null
          file_size: number | null
          file_url: string | null
          id: string
          message_type: string
          read_at: string | null
          sender_id: string
          sender_type: string
          sent_at: string
          session_id: string
        }
        Insert: {
          content: string
          file_name?: string | null
          file_size?: number | null
          file_url?: string | null
          id?: string
          message_type?: string
          read_at?: string | null
          sender_id: string
          sender_type: string
          sent_at?: string
          session_id: string
        }
        Update: {
          content?: string
          file_name?: string | null
          file_size?: number | null
          file_url?: string | null
          id?: string
          message_type?: string
          read_at?: string | null
          sender_id?: string
          sender_type?: string
          sent_at?: string
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "telemedicine_chat_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "telemedicine_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      telemedicine_consent: {
        Row: {
          appointment_id: string
          consent_given: boolean
          consent_text: string
          consent_type: string
          digital_signature: string | null
          given_at: string
          id: string
          ip_address: string | null
          patient_id: string
          user_agent: string | null
        }
        Insert: {
          appointment_id: string
          consent_given?: boolean
          consent_text: string
          consent_type: string
          digital_signature?: string | null
          given_at?: string
          id?: string
          ip_address?: string | null
          patient_id: string
          user_agent?: string | null
        }
        Update: {
          appointment_id?: string
          consent_given?: boolean
          consent_text?: string
          consent_type?: string
          digital_signature?: string | null
          given_at?: string
          id?: string
          ip_address?: string | null
          patient_id?: string
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "telemedicine_consent_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "telemedicine_appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "telemedicine_consent_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      telemedicine_prescriptions: {
        Row: {
          appointment_id: string
          digital_signature: string | null
          doctor_id: string
          dosage: string
          duration_days: number
          frequency: string
          id: string
          instructions: string | null
          issued_at: string
          medication_name: string
          patient_id: string
          quantity: number | null
          refills_allowed: number | null
          status: string
        }
        Insert: {
          appointment_id: string
          digital_signature?: string | null
          doctor_id: string
          dosage: string
          duration_days: number
          frequency: string
          id?: string
          instructions?: string | null
          issued_at?: string
          medication_name: string
          patient_id: string
          quantity?: number | null
          refills_allowed?: number | null
          status?: string
        }
        Update: {
          appointment_id?: string
          digital_signature?: string | null
          doctor_id?: string
          dosage?: string
          duration_days?: number
          frequency?: string
          id?: string
          instructions?: string | null
          issued_at?: string
          medication_name?: string
          patient_id?: string
          quantity?: number | null
          refills_allowed?: number | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "telemedicine_prescriptions_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "telemedicine_appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "telemedicine_prescriptions_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      telemedicine_sessions: {
        Row: {
          appointment_id: string
          chat_transcript: Json | null
          created_at: string
          duration_seconds: number | null
          ended_at: string | null
          id: string
          recording_url: string | null
          room_id: string
          session_token: string | null
          started_at: string | null
          technical_issues: string | null
        }
        Insert: {
          appointment_id: string
          chat_transcript?: Json | null
          created_at?: string
          duration_seconds?: number | null
          ended_at?: string | null
          id?: string
          recording_url?: string | null
          room_id: string
          session_token?: string | null
          started_at?: string | null
          technical_issues?: string | null
        }
        Update: {
          appointment_id?: string
          chat_transcript?: Json | null
          created_at?: string
          duration_seconds?: number | null
          ended_at?: string | null
          id?: string
          recording_url?: string | null
          room_id?: string
          session_token?: string | null
          started_at?: string | null
          technical_issues?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "telemedicine_sessions_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "telemedicine_appointments"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          allowed_ip_ranges: string[] | null
          created_at: string
          department: string | null
          email: string
          first_name: string
          id: string
          is_active: boolean
          last_login: string | null
          last_name: string
          license_number: string | null
          mfa_enabled: boolean
          mfa_secret: string | null
          password_last_changed: string | null
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          session_timeout_minutes: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          allowed_ip_ranges?: string[] | null
          created_at?: string
          department?: string | null
          email: string
          first_name: string
          id?: string
          is_active?: boolean
          last_login?: string | null
          last_name: string
          license_number?: string | null
          mfa_enabled?: boolean
          mfa_secret?: string | null
          password_last_changed?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          session_timeout_minutes?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          allowed_ip_ranges?: string[] | null
          created_at?: string
          department?: string | null
          email?: string
          first_name?: string
          id?: string
          is_active?: boolean
          last_login?: string | null
          last_name?: string
          license_number?: string | null
          mfa_enabled?: boolean
          mfa_secret?: string | null
          password_last_changed?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          session_timeout_minutes?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      virtual_waiting_room: {
        Row: {
          appointment_id: string
          called_at: string | null
          checked_in_at: string
          estimated_wait_minutes: number | null
          id: string
          patient_id: string
          queue_position: number
          status: string
        }
        Insert: {
          appointment_id: string
          called_at?: string | null
          checked_in_at?: string
          estimated_wait_minutes?: number | null
          id?: string
          patient_id: string
          queue_position: number
          status?: string
        }
        Update: {
          appointment_id?: string
          called_at?: string | null
          checked_in_at?: string
          estimated_wait_minutes?: number | null
          id?: string
          patient_id?: string
          queue_position?: number
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "virtual_waiting_room_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "telemedicine_appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "virtual_waiting_room_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      log_hipaa_audit: {
        Args: {
          p_action: string
          p_resource_type: string
          p_resource_id?: string
          p_patient_id?: string
          p_phi_accessed?: boolean
          p_details?: Json
        }
        Returns: string
      }
      search_icd10_codes: {
        Args: { p_search_term: string; p_code_type?: string; p_limit?: number }
        Returns: {
          code: string
          description: string
          category: string
          code_type: string
          is_billable: boolean
        }[]
      }
      user_has_permission: {
        Args: { p_permission: Database["public"]["Enums"]["permission"] }
        Returns: boolean
      }
    }
    Enums: {
      permission:
        | "read_all_patients"
        | "write_all_patients"
        | "read_own_patients"
        | "write_own_patients"
        | "manage_appointments"
        | "manage_billing"
        | "manage_pharmacy"
        | "manage_lab_results"
        | "manage_radiology"
        | "view_reports"
        | "manage_users"
        | "audit_access"
      user_role:
        | "super_admin"
        | "admin"
        | "doctor"
        | "nurse"
        | "pharmacist"
        | "lab_technician"
        | "radiologist"
        | "billing_staff"
        | "patient"
        | "receptionist"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      permission: [
        "read_all_patients",
        "write_all_patients",
        "read_own_patients",
        "write_own_patients",
        "manage_appointments",
        "manage_billing",
        "manage_pharmacy",
        "manage_lab_results",
        "manage_radiology",
        "view_reports",
        "manage_users",
        "audit_access",
      ],
      user_role: [
        "super_admin",
        "admin",
        "doctor",
        "nurse",
        "pharmacist",
        "lab_technician",
        "radiologist",
        "billing_staff",
        "patient",
        "receptionist",
      ],
    },
  },
} as const
