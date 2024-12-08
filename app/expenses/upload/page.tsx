'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Upload } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/components/ui/use-toast';

export default function UploadStatementPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type === 'text/csv' || 
          selectedFile.type === 'application/vnd.ms-excel' ||
          selectedFile.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        setFile(selectedFile);
      } else {
        toast({
          title: 'Invalid file type',
          description: 'Please upload a CSV or Excel file.',
          variant: 'destructive',
        });
      }
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    try {
      // Simulate file processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: 'Statement uploaded',
        description: 'Your statement has been uploaded successfully.',
      });
      
      // Reset form
      setFile(null);
      if (document.querySelector<HTMLFormElement>('form')) {
        document.querySelector<HTMLFormElement>('form')!.reset();
      }
    } catch (error) {
      toast({
        title: 'Upload failed',
        description: 'There was an error uploading your statement.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Upload Statement</h1>
      </div>

      <Card className="p-6">
        <form className="space-y-6" onSubmit={(e) => {
          e.preventDefault();
          handleUpload();
        }}>
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Import Expenses from Statement</h2>
            <p className="text-sm text-muted-foreground">
              Upload a CSV or Excel file containing your expense data.
            </p>
          </div>

          <div className="border-2 border-dashed rounded-lg p-8 text-center space-y-4">
            <Input
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileChange}
              className="hidden"
              id="statement-upload"
            />
            <Label
              htmlFor="statement-upload"
              className="flex flex-col items-center gap-2 cursor-pointer"
            >
              <div className="p-3 bg-primary/10 rounded-full">
                <Upload className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-medium">Click to upload or drag and drop</p>
                <p className="text-sm text-muted-foreground">
                  CSV or Excel files supported
                </p>
              </div>
            </Label>
            {file && (
              <p className="text-sm font-medium">
                Selected file: {file.name}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={!file || isUploading}
            className="w-full"
          >
            {isUploading ? 'Uploading...' : 'Upload Statement'}
          </Button>
        </form>
      </Card>
    </div>
  );
}