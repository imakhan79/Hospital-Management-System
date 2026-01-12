import { useState, useEffect, useCallback } from 'react';
import { Search, Plus, X, CheckCircle, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ICD10Service, ICD10SearchResult } from '@/services/icd10Service';
import { toast } from 'sonner';
import { debounce } from 'lodash';

interface ICD10CodeSelectorProps {
  selectedCodes: string[];
  onCodesChange: (codes: string[]) => void;
  codeType?: 'CM' | 'PCS';
  maxCodes?: number;
  placeholder?: string;
  label?: string;
  required?: boolean;
  className?: string;
}

export function ICD10CodeSelector({
  selectedCodes,
  onCodesChange,
  codeType,
  maxCodes = 10,
  placeholder = "Search ICD-10 codes...",
  label = "ICD-10 Codes",
  required = false,
  className = ""
}: ICD10CodeSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<ICD10SearchResult[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [validationResults, setValidationResults] = useState<{
    valid: any[];
    invalid: string[];
  }>({ valid: [], invalid: [] });

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (term: string) => {
      if (!term.trim()) {
        setSearchResults([]);
        return;
      }

      setLoading(true);
      try {
        const results = await ICD10Service.searchCodes(term, codeType, 20);
        setSearchResults(results);
      } catch (error) {
        console.error('Error searching ICD-10 codes:', error);
        toast.error('Failed to search codes');
      } finally {
        setLoading(false);
      }
    }, 300),
    [codeType]
  );

  // Load categories on mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const cats = await ICD10Service.getCategories(codeType);
        setCategories(cats);
      } catch (error) {
        console.error('Error loading categories:', error);
      }
    };

    loadCategories();
  }, [codeType]);

  // Search when term changes
  useEffect(() => {
    debouncedSearch(searchTerm);
  }, [searchTerm, debouncedSearch]);

  // Validate selected codes
  useEffect(() => {
    const validateCodes = async () => {
      if (selectedCodes.length === 0) {
        setValidationResults({ valid: [], invalid: [] });
        return;
      }

      try {
        const results = await ICD10Service.validateCodes(selectedCodes);
        setValidationResults(results);
      } catch (error) {
        console.error('Error validating codes:', error);
      }
    };

    validateCodes();
  }, [selectedCodes]);

  const handleAddCode = (code: ICD10SearchResult) => {
    if (selectedCodes.includes(code.code)) {
      toast.error('Code already selected');
      return;
    }

    if (selectedCodes.length >= maxCodes) {
      toast.error(`Maximum ${maxCodes} codes allowed`);
      return;
    }

    onCodesChange([...selectedCodes, code.code]);
    setSearchTerm('');
    setSearchResults([]);
    toast.success(`Added ${code.code}`);
  };

  const handleRemoveCode = (codeToRemove: string) => {
    onCodesChange(selectedCodes.filter(code => code !== codeToRemove));
    toast.success('Code removed');
  };

  const handleCategoryFilter = async (category: string) => {
    setSelectedCategory(category);
    if (!category) return;

    setLoading(true);
    try {
      const results = await ICD10Service.getCodes({
        category,
        codeType,
        pageSize: 20
      });
      setSearchResults(results.data);
    } catch (error) {
      console.error('Error filtering by category:', error);
      toast.error('Failed to filter codes');
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestCodes = async () => {
    if (!searchTerm.trim()) return;

    setLoading(true);
    try {
      const suggestions = codeType === 'PCS' 
        ? await ICD10Service.mapProcedureToICD10(searchTerm)
        : await ICD10Service.mapDiagnosisToICD10(searchTerm);
      
      setSearchResults(suggestions);
      toast.success(`Found ${suggestions.length} suggested codes`);
    } catch (error) {
      console.error('Error getting suggestions:', error);
      toast.error('Failed to get suggestions');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {label}
          {required && <span className="text-destructive">*</span>}
          <Badge variant="outline">
            {codeType === 'PCS' ? 'Procedure' : 'Diagnosis'} Codes
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search and Filter Controls */}
        <div className="space-y-2">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={placeholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              variant="outline"
              onClick={handleSuggestCodes}
              disabled={!searchTerm.trim() || loading}
            >
              <Plus className="h-4 w-4 mr-2" />
              Suggest
            </Button>
          </div>

          <Select value={selectedCategory} onValueChange={handleCategoryFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by category..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Selected Codes */}
        {selectedCodes.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Selected Codes ({selectedCodes.length}/{maxCodes})</h4>
            <div className="flex flex-wrap gap-2">
              {selectedCodes.map((code) => {
                const isValid = validationResults.valid.some(v => v.code === code);
                const isInvalid = validationResults.invalid.includes(code);
                
                return (
                  <Badge
                    key={code}
                    variant={isInvalid ? "destructive" : isValid ? "default" : "secondary"}
                    className="flex items-center gap-1"
                  >
                    {isValid && <CheckCircle className="h-3 w-3" />}
                    {isInvalid && <AlertCircle className="h-3 w-3" />}
                    {code}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 ml-1 hover:bg-destructive hover:text-destructive-foreground"
                      onClick={() => handleRemoveCode(code)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                );
              })}
            </div>
            
            {validationResults.invalid.length > 0 && (
              <p className="text-sm text-destructive">
                Invalid codes: {validationResults.invalid.join(', ')}
              </p>
            )}
          </div>
        )}

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Search Results</h4>
            <ScrollArea className="h-64 border rounded-md">
              <div className="p-2 space-y-1">
                {searchResults.map((result) => (
                  <div
                    key={result.code}
                    className="p-2 rounded-md border cursor-pointer hover:bg-accent"
                    onClick={() => handleAddCode(result)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {result.code}
                          </Badge>
                          <Badge variant={result.is_billable ? "default" : "secondary"} className="text-xs">
                            {result.is_billable ? "Billable" : "Non-billable"}
                          </Badge>
                        </div>
                        <p className="text-sm mt-1">{result.description}</p>
                        <p className="text-xs text-muted-foreground">{result.category}</p>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        disabled={selectedCodes.includes(result.code)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}

        {loading && (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
            <p className="text-sm text-muted-foreground mt-2">Searching codes...</p>
          </div>
        )}

        {searchTerm && !loading && searchResults.length === 0 && (
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground">No codes found for "{searchTerm}"</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}