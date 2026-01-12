import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileText, 
  Image, 
  Video, 
  Download, 
  Upload, 
  Eye, 
  Share, 
  Trash2,
  File
} from "lucide-react";

interface SharedFile {
  id: string;
  name: string;
  type: 'document' | 'image' | 'video' | 'other';
  size: number;
  uploadedBy: 'doctor' | 'patient';
  uploadedAt: Date;
  url: string;
  category: 'lab-report' | 'prescription' | 'image' | 'document' | 'other';
}

interface FileSharingProps {
  consultationId: string;
}

export const FileSharing = ({ consultationId }: FileSharingProps) => {
  const [files, setFiles] = useState<SharedFile[]>([
    {
      id: '1',
      name: 'Blood_Test_Results.pdf',
      type: 'document',
      size: 245760,
      uploadedBy: 'patient',
      uploadedAt: new Date(Date.now() - 3600000),
      url: '#',
      category: 'lab-report'
    },
    {
      id: '2',
      name: 'Chest_X_Ray.jpg',
      type: 'image',
      size: 1048576,
      uploadedBy: 'patient',
      uploadedAt: new Date(Date.now() - 1800000),
      url: '#',
      category: 'image'
    },
    {
      id: '3',
      name: 'Prescription_Template.pdf',
      type: 'document',
      size: 123456,
      uploadedBy: 'doctor',
      uploadedAt: new Date(Date.now() - 900000),
      url: '#',
      category: 'prescription'
    }
  ]);

  const [dragOver, setDragOver] = useState(false);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'document': return <FileText className="h-8 w-8 text-blue-500" />;
      case 'image': return <Image className="h-8 w-8 text-green-500" />;
      case 'video': return <Video className="h-8 w-8 text-purple-500" />;
      default: return <File className="h-8 w-8 text-gray-500" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'lab-report': return 'bg-blue-100 text-blue-800';
      case 'prescription': return 'bg-green-100 text-green-800';
      case 'image': return 'bg-purple-100 text-purple-800';
      case 'document': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    // Handle file upload logic here
    console.log('Files dropped:', e.dataTransfer.files);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      // Handle file upload logic here
      console.log('Files selected:', files);
    }
  };

  const labReports = files.filter(f => f.category === 'lab-report');
  const prescriptions = files.filter(f => f.category === 'prescription');
  const images = files.filter(f => f.category === 'image');
  const documents = files.filter(f => f.category === 'document');

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <Card className={`border-2 border-dashed transition-colors ${
        dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
      }`}>
        <CardContent 
          className="p-8 text-center"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold mb-2">Upload Files</h3>
          <p className="text-muted-foreground mb-4">
            Drag and drop files here, or click to browse
          </p>
          <input
            type="file"
            multiple
            onChange={handleFileUpload}
            className="hidden"
            id="file-upload"
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
          />
          <label htmlFor="file-upload">
            <Button variant="outline" className="cursor-pointer">
              <Upload className="h-4 w-4 mr-2" />
              Choose Files
            </Button>
          </label>
          <p className="text-xs text-muted-foreground mt-2">
            Supported formats: PDF, JPG, PNG, DOC, DOCX (Max 10MB each)
          </p>
        </CardContent>
      </Card>

      {/* Files by Category */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All Files ({files.length})</TabsTrigger>
          <TabsTrigger value="lab-reports">Lab Reports ({labReports.length})</TabsTrigger>
          <TabsTrigger value="prescriptions">Prescriptions ({prescriptions.length})</TabsTrigger>
          <TabsTrigger value="images">Images ({images.length})</TabsTrigger>
          <TabsTrigger value="documents">Documents ({documents.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid gap-4">
            {files.map((file) => (
              <Card key={file.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {getFileIcon(file.type)}
                      <div>
                        <h4 className="font-medium">{file.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={getCategoryColor(file.category)}>
                            {file.category.replace('-', ' ')}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {formatFileSize(file.size)}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            • Uploaded by {file.uploadedBy}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            • {file.uploadedAt.toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                      <Button variant="outline" size="sm">
                        <Share className="h-4 w-4 mr-1" />
                        Share
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {files.length === 0 && (
              <Card>
                <CardContent className="text-center py-8">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">No files shared yet</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="lab-reports" className="space-y-4">
          <div className="grid gap-4">
            {labReports.map((file) => (
              <Card key={file.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {getFileIcon(file.type)}
                      <div>
                        <h4 className="font-medium">{file.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {formatFileSize(file.size)} • {file.uploadedAt.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="prescriptions" className="space-y-4">
          <div className="grid gap-4">
            {prescriptions.map((file) => (
              <Card key={file.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {getFileIcon(file.type)}
                      <div>
                        <h4 className="font-medium">{file.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {formatFileSize(file.size)} • {file.uploadedAt.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="images" className="space-y-4">
          <div className="grid gap-4">
            {images.map((file) => (
              <Card key={file.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {getFileIcon(file.type)}
                      <div>
                        <h4 className="font-medium">{file.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {formatFileSize(file.size)} • {file.uploadedAt.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          <div className="grid gap-4">
            {documents.map((file) => (
              <Card key={file.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {getFileIcon(file.type)}
                      <div>
                        <h4 className="font-medium">{file.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {formatFileSize(file.size)} • {file.uploadedAt.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};