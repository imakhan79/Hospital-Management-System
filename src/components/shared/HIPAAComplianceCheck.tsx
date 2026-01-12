import { useState, useEffect } from 'react';
import { Shield, CheckCircle, XCircle, AlertTriangle, Eye, Download, Settings } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useHIPAAAuth } from '@/hooks/useHIPAAAuth';
import { HIPAAService, HIPAAAuditLog } from '@/services/hipaaService';
import { toast } from 'sonner';

interface ComplianceMetrics {
  auditLogsCount: number;
  recentAccessCount: number;
  failedAccessAttempts: number;
  phiAccessCount: number;
  complianceScore: number;
  recommendations: string[];
}

export function HIPAAComplianceCheck() {
  const { hasPermission, profile } = useHIPAAAuth();
  const [metrics, setMetrics] = useState<ComplianceMetrics>({
    auditLogsCount: 0,
    recentAccessCount: 0,
    failedAccessAttempts: 0,
    phiAccessCount: 0,
    complianceScore: 0,
    recommendations: []
  });
  const [auditLogs, setAuditLogs] = useState<HIPAAAuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  const canViewAudit = hasPermission('audit_access');

  useEffect(() => {
    if (canViewAudit) {
      loadComplianceData();
    }
  }, [canViewAudit]);

  const loadComplianceData = async () => {
    setLoading(true);
    try {
      // Get audit logs for the past 30 days
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 30);

      const logs = await HIPAAService.getAuditLogs({
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString()
      });

      setAuditLogs(logs);

      // Calculate compliance metrics
      const recentAccessCount = logs.filter(log => 
        log.action.includes('ACCESS') || log.action.includes('SELECT')
      ).length;

      const failedAccessAttempts = logs.filter(log => 
        log.action.includes('FAILED') || log.risk_level === 'high'
      ).length;

      const phiAccessCount = logs.filter(log => log.phi_accessed).length;

      // Calculate compliance score
      let score = 100;
      
      // Deduct points for issues
      if (failedAccessAttempts > 5) score -= 20;
      if (phiAccessCount > 50) score -= 10;
      if (logs.length === 0) score -= 30; // No audit trail is a major issue

      // Add recommendations
      const recommendations: string[] = [];
      
      if (failedAccessAttempts > 5) {
        recommendations.push('High number of failed access attempts detected - review access controls');
      }
      
      if (phiAccessCount > 100) {
        recommendations.push('High PHI access volume - ensure all access is legitimate');
      }
      
      if (logs.length === 0) {
        recommendations.push('No audit logs found - ensure audit logging is functioning properly');
      }
      
      if (score === 100) {
        recommendations.push('Excellent compliance! Continue monitoring access patterns');
      }

      setMetrics({
        auditLogsCount: logs.length,
        recentAccessCount,
        failedAccessAttempts,
        phiAccessCount,
        complianceScore: Math.max(0, score),
        recommendations
      });

    } catch (error) {
      console.error('Error loading compliance data:', error);
      toast.error('Failed to load compliance data');
    } finally {
      setLoading(false);
    }
  };

  const exportAuditReport = async () => {
    try {
      // In a real implementation, this would generate a comprehensive report
      const reportData = {
        generated_at: new Date().toISOString(),
        generated_by: profile?.email,
        period: '30 days',
        metrics,
        audit_logs: auditLogs.map(log => ({
          ...log,
          // Remove sensitive details for export
          details: log.phi_accessed ? '[PHI ACCESS LOGGED]' : log.details
        }))
      };

      const blob = new Blob([JSON.stringify(reportData, null, 2)], {
        type: 'application/json'
      });

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `hipaa-compliance-report-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success('Compliance report exported');
    } catch (error) {
      console.error('Error exporting report:', error);
      toast.error('Failed to export report');
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 90) return 'default';
    if (score >= 70) return 'secondary';
    return 'destructive';
  };

  if (!canViewAudit) {
    return (
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertTitle>Access Denied</AlertTitle>
        <AlertDescription>
          You do not have permission to view HIPAA compliance data.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Compliance Score Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            HIPAA Compliance Dashboard
          </CardTitle>
          <CardDescription>
            30-day compliance overview and audit summary
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className={`text-3xl font-bold ${getScoreColor(metrics.complianceScore)}`}>
                {metrics.complianceScore}%
              </div>
              <p className="text-sm text-muted-foreground">Compliance Score</p>
              <Badge variant={getScoreBadgeVariant(metrics.complianceScore)} className="mt-1">
                {metrics.complianceScore >= 90 ? 'Excellent' : 
                 metrics.complianceScore >= 70 ? 'Good' : 'Needs Attention'}
              </Badge>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{metrics.auditLogsCount}</div>
              <p className="text-sm text-muted-foreground">Audit Entries</p>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{metrics.recentAccessCount}</div>
              <p className="text-sm text-muted-foreground">Data Access Events</p>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">{metrics.phiAccessCount}</div>
              <p className="text-sm text-muted-foreground">PHI Access Events</p>
            </div>
          </div>

          <Progress value={metrics.complianceScore} className="mb-4" />

          <div className="flex gap-2">
            <Button onClick={loadComplianceData} disabled={loading}>
              <Settings className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" onClick={exportAuditReport}>
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations and Issues */}
      {metrics.recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Compliance Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {metrics.recommendations.map((recommendation, index) => (
                <Alert key={index}>
                  <AlertDescription>{recommendation}</AlertDescription>
                </Alert>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Detailed Audit Logs */}
      <Tabs defaultValue="recent" className="space-y-4">
        <TabsList>
          <TabsTrigger value="recent">Recent Activity</TabsTrigger>
          <TabsTrigger value="phi">PHI Access</TabsTrigger>
          <TabsTrigger value="failed">Failed Attempts</TabsTrigger>
        </TabsList>

        <TabsContent value="recent">
          <Card>
            <CardHeader>
              <CardTitle>Recent Audit Activity</CardTitle>
              <CardDescription>
                Latest system access and data operations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {auditLogs.slice(0, 20).map((log) => (
                  <div key={log.id} className="flex items-center justify-between p-3 border rounded">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{log.action}</Badge>
                        <Badge variant={log.phi_accessed ? "destructive" : "secondary"}>
                          {log.phi_accessed ? "PHI" : "General"}
                        </Badge>
                        <span className="text-sm font-medium">{log.user_email}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {log.resource_type} - {new Date(log.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <Badge variant={
                      log.risk_level === 'critical' ? 'destructive' :
                      log.risk_level === 'high' ? 'destructive' :
                      log.risk_level === 'medium' ? 'secondary' : 'default'
                    }>
                      {log.risk_level}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="phi">
          <Card>
            <CardHeader>
              <CardTitle>PHI Access Events</CardTitle>
              <CardDescription>
                Protected Health Information access logs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {auditLogs.filter(log => log.phi_accessed).map((log) => (
                  <div key={log.id} className="flex items-center justify-between p-3 border rounded bg-red-50">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-red-600" />
                        <Badge variant="destructive">{log.action}</Badge>
                        <span className="text-sm font-medium">{log.user_email}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Patient ID: {log.patient_id} - {new Date(log.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="failed">
          <Card>
            <CardHeader>
              <CardTitle>Failed Access Attempts</CardTitle>
              <CardDescription>
                Security incidents and failed authentication attempts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {auditLogs.filter(log => 
                  log.action.includes('FAILED') || log.risk_level === 'high'
                ).map((log) => (
                  <div key={log.id} className="flex items-center justify-between p-3 border rounded bg-yellow-50">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <XCircle className="h-4 w-4 text-red-600" />
                        <Badge variant="destructive">{log.action}</Badge>
                        <span className="text-sm font-medium">{log.user_email || 'Unknown'}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        IP: {log.ip_address} - {new Date(log.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <Badge variant="destructive">{log.risk_level}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}