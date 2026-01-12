import { supabase } from "@/integrations/supabase/client";

export interface ICD10Code {
  id: string;
  code: string;
  description: string;
  category: string;
  subcategory?: string;
  code_type: 'CM' | 'PCS'; // CM = Clinical Modification, PCS = Procedure Coding System
  is_billable: boolean;
  is_active: boolean;
  effective_date?: string;
  revision_date?: string;
  created_at: string;
  updated_at: string;
}

export interface ICD10SearchResult {
  code: string;
  description: string;
  category: string;
  code_type: string;
  is_billable: boolean;
}

export class ICD10Service {
  // Search ICD-10 codes
  static async searchCodes(
    searchTerm: string, 
    codeType?: 'CM' | 'PCS', 
    limit: number = 50
  ): Promise<ICD10SearchResult[]> {
    try {
      const { data, error } = await supabase.rpc('search_icd10_codes', {
        p_search_term: searchTerm,
        p_code_type: codeType || null,
        p_limit: limit
      });

      if (error) throw error;
      return data as ICD10SearchResult[];
    } catch (error) {
      console.error('Error searching ICD-10 codes:', error);
      throw error;
    }
  }

  // Get all ICD-10 codes with pagination
  static async getCodes(params?: {
    category?: string;
    codeType?: 'CM' | 'PCS';
    billableOnly?: boolean;
    page?: number;
    pageSize?: number;
  }) {
    try {
      let query = supabase
        .from('icd10_codes')
        .select('*', { count: 'exact' })
        .eq('is_active', true)
        .order('code');

      if (params?.category) {
        query = query.eq('category', params.category);
      }
      if (params?.codeType) {
        query = query.eq('code_type', params.codeType);
      }
      if (params?.billableOnly) {
        query = query.eq('is_billable', true);
      }

      const page = params?.page || 1;
      const pageSize = params?.pageSize || 50;
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      query = query.range(from, to);

      const { data, error, count } = await query;
      if (error) throw error;

      return {
        data: data as ICD10Code[],
        count: count || 0,
        page,
        pageSize,
        totalPages: Math.ceil((count || 0) / pageSize)
      };
    } catch (error) {
      console.error('Error fetching ICD-10 codes:', error);
      throw error;
    }
  }

  // Get ICD-10 code by code
  static async getCodeByCode(code: string) {
    try {
      const { data, error } = await supabase
        .from('icd10_codes')
        .select('*')
        .eq('code', code)
        .eq('is_active', true)
        .single();

      if (error) throw error;
      return data as ICD10Code;
    } catch (error) {
      console.error('Error fetching ICD-10 code:', error);
      throw error;
    }
  }

  // Get categories
  static async getCategories(codeType?: 'CM' | 'PCS') {
    try {
      let query = supabase
        .from('icd10_codes')
        .select('category')
        .eq('is_active', true);

      if (codeType) {
        query = query.eq('code_type', codeType);
      }

      const { data, error } = await query;
      if (error) throw error;

      // Get unique categories
      const categories = [...new Set(data.map(item => item.category))].sort();
      return categories;
    } catch (error) {
      console.error('Error fetching ICD-10 categories:', error);
      throw error;
    }
  }

  // Validate ICD-10 codes
  static async validateCodes(codes: string[]): Promise<{
    valid: ICD10Code[];
    invalid: string[];
  }> {
    try {
      const { data, error } = await supabase
        .from('icd10_codes')
        .select('*')
        .in('code', codes)
        .eq('is_active', true);

      if (error) throw error;

      const validCodes = data as ICD10Code[];
      const validCodeStrings = validCodes.map(c => c.code);
      const invalidCodes = codes.filter(code => !validCodeStrings.includes(code));

      return {
        valid: validCodes,
        invalid: invalidCodes
      };
    } catch (error) {
      console.error('Error validating ICD-10 codes:', error);
      throw error;
    }
  }

  // Get suggested codes based on keywords
  static async getSuggestedCodes(keywords: string[], codeType?: 'CM' | 'PCS') {
    try {
      const suggestions: ICD10SearchResult[] = [];
      
      for (const keyword of keywords) {
        const results = await this.searchCodes(keyword, codeType, 10);
        suggestions.push(...results);
      }

      // Remove duplicates and sort by relevance
      const uniqueSuggestions = suggestions.filter((suggestion, index, self) => 
        index === self.findIndex(s => s.code === suggestion.code)
      );

      return uniqueSuggestions.slice(0, 20); // Return top 20 suggestions
    } catch (error) {
      console.error('Error getting suggested ICD-10 codes:', error);
      throw error;
    }
  }

  // Add or update ICD-10 code (admin only)
  static async upsertCode(code: Omit<ICD10Code, 'id' | 'created_at' | 'updated_at'>) {
    try {
      const { data, error } = await supabase
        .from('icd10_codes')
        .upsert(code, {
          onConflict: 'code',
          ignoreDuplicates: false
        })
        .select()
        .single();

      if (error) throw error;
      return data as ICD10Code;
    } catch (error) {
      console.error('Error upserting ICD-10 code:', error);
      throw error;
    }
  }

  // Bulk import ICD-10 codes (admin only)
  static async bulkImportCodes(codes: Omit<ICD10Code, 'id' | 'created_at' | 'updated_at'>[]) {
    try {
      const { data, error } = await supabase
        .from('icd10_codes')
        .upsert(codes, {
          onConflict: 'code',
          ignoreDuplicates: false
        })
        .select();

      if (error) throw error;
      return data as ICD10Code[];
    } catch (error) {
      console.error('Error bulk importing ICD-10 codes:', error);
      throw error;
    }
  }

  // Get ICD-10 usage statistics
  static async getUsageStatistics(dateFrom?: string, dateTo?: string) {
    try {
      // This would typically join with medical records or other tables
      // For now, we'll return a mock structure
      const mockStats = {
        totalCodes: 0,
        mostUsedCodes: [] as { code: string; description: string; usage_count: number }[],
        categoryUsage: [] as { category: string; usage_count: number }[],
        recentlyUsed: [] as ICD10Code[]
      };

      // Get total codes count
      const { count } = await supabase
        .from('icd10_codes')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

      mockStats.totalCodes = count || 0;

      return mockStats;
    } catch (error) {
      console.error('Error fetching ICD-10 usage statistics:', error);
      throw error;
    }
  }

  // Map diagnosis text to suggested ICD-10 codes
  static async mapDiagnosisToICD10(diagnosisText: string): Promise<ICD10SearchResult[]> {
    try {
      // Split diagnosis text into keywords
      const keywords = diagnosisText
        .toLowerCase()
        .split(' ')
        .filter(word => word.length > 2) // Filter out small words
        .map(word => word.replace(/[^a-zA-Z0-9]/g, '')); // Remove special characters

      // Search for each keyword
      const suggestions = await this.getSuggestedCodes(keywords, 'CM');
      
      return suggestions;
    } catch (error) {
      console.error('Error mapping diagnosis to ICD-10:', error);
      throw error;
    }
  }

  // Map procedure text to suggested ICD-10 PCS codes
  static async mapProcedureToICD10(procedureText: string): Promise<ICD10SearchResult[]> {
    try {
      // Split procedure text into keywords
      const keywords = procedureText
        .toLowerCase()
        .split(' ')
        .filter(word => word.length > 2)
        .map(word => word.replace(/[^a-zA-Z0-9]/g, ''));

      // Search for procedure codes
      const suggestions = await this.getSuggestedCodes(keywords, 'PCS');
      
      return suggestions;
    } catch (error) {
      console.error('Error mapping procedure to ICD-10:', error);
      throw error;
    }
  }
}