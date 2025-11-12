import React, { useState, useCallback } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, FlaskConical, Search, File, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useDropzone } from 'react-dropzone';
import { useToast } from '@/components/ui/use-toast';
import { getLabReportUploadUrl } from '@/lib/api';

export function LabReportsPage() {
  const [files, setFiles] = useState<File[]>([]);
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(prev => [...prev, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/jpeg': ['.jpeg', '.jpg'],
      'image/png': ['.png'],
    },
  });

  const handleUpload = async () => {
    if (files.length === 0) {
      toast({ title: 'No files selected', description: 'Please select files to upload.', variant: 'destructive' });
      return;
    }

    for (const file of files) {
      try {
        // 1. Get signed URL from backend
        const { uploadUrl, accessUrl } = await getLabReportUploadUrl({
          filename: file.name,
          contentType: file.type,
        });

        // 2. Upload file to the signed URL
        const uploadResponse = await fetch(uploadUrl, {
          method: 'PUT',
          body: file,
          headers: { 'Content-Type': file.type },
        });

        if (!uploadResponse.ok) {
          throw new Error('File upload failed.');
        }

        // 3. (Optional) Save the accessUrl to your database against a patient/doctor record
        // This would require another backend endpoint.
        console.log('File uploaded successfully. Access URL:', accessUrl);

        toast({ title: 'Upload Successful', description: `${file.name} has been uploaded.` });
      } catch (error: any) {
        console.error('Upload error:', error);
        toast({ title: 'Upload Failed', description: `Could not upload ${file.name}. ${error.message}`, variant: 'destructive' });
      }
    }
    setFiles([]); // Clear files after upload
  };

  const removeFile = (fileName: string) => {
    setFiles(files.filter(file => file.name !== fileName));
  };

  return (
    <div className="space-y-8">
      <div
        className="flex justify-between items-center"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Lab Reports
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Manage and review patient lab reports.
          </p>
        </div>
      </div>

      <div
      >
        <Card>
          <CardHeader>
            <CardTitle>Upload New Reports</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div
              {...getRootProps()}
              className={`p-8 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors ${
                isDragActive ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-700 hover:border-blue-500'
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              {isDragActive ? (
                <p>Drop the files here ...</p>
              ) : (
                <p>Drag 'n' drop some files here, or click to select files</p>
              )}
              <p className="text-xs text-gray-500 mt-2">PDF, JPG, PNG supported</p>
            </div>
            {files.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium">Selected files:</h4>
                <ul className="space-y-1">
                  {files.map(file => (
                    <li key={file.name} className="flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-800 rounded-md text-sm">
                      <div className="flex items-center gap-2">
                        <File className="w-4 h-4" />
                        <span>{file.name}</span>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => removeFile(file.name)}>
                        <X className="w-4 h-4" />
                      </Button>
                    </li>
                  ))}
                </ul>
                <Button onClick={handleUpload} className="w-full">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload {files.length} file(s)
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div
      >
        <Card>
          <CardHeader>
            <CardTitle>Recent Lab Reports</CardTitle>
          </CardHeader>
          <CardContent className="text-center py-12">
            <FlaskConical className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Lab Reports Found</h3>
            <p className="text-gray-600 mb-4">
              Uploaded lab reports will appear here.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
