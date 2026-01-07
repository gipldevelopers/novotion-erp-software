// Updated: 2025-12-27
'use client';

import React, { useRef, useState } from 'react';
import { hrmsService } from '@/services/hrmsService';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download, Eye, Upload, Trash2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

export default function EmployeeDocuments({ employeeId, documents, onChange }) {
    const fileInputRef = useRef(null);
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [docType, setDocType] = useState('KYC');
    const [uploading, setUploading] = useState(false);

    const refresh = async () => {
        if (typeof onChange === 'function') await onChange();
    };

    const handleOpenUpload = () => {
        setSelectedFile(null);
        setDocType('KYC');
        setIsUploadOpen(true);
    };

    const handlePickFile = () => fileInputRef.current?.click();

    const handleUpload = async () => {
        if (!selectedFile) return;
        setUploading(true);
        try {
            const uploaded = await hrmsService.uploadDocument({ employeeId, file: selectedFile, type: docType });
            if (!uploaded) throw new Error('Upload failed');
            toast.success('Document uploaded');
            setIsUploadOpen(false);
            await refresh();
        } catch (e) {
            toast.error('Failed to upload document');
        } finally {
            setUploading(false);
        }
    };

    const handleView = (doc) => {
        if (!doc?.dataUrl) {
            toast.error('File preview not available');
            return;
        }
        window.open(doc.dataUrl, '_blank', 'noopener,noreferrer');
    };

    const handleDownload = (doc) => {
        if (!doc?.dataUrl) {
            toast.error('Download not available');
            return;
        }
        const a = document.createElement('a');
        a.href = doc.dataUrl;
        a.download = doc.name || 'document';
        document.body.appendChild(a);
        a.click();
        a.remove();
    };

    const handleDelete = async (docId) => {
        try {
            const ok = await hrmsService.deleteDocument(docId);
            if (!ok) throw new Error('Delete failed');
            toast.success('Document deleted');
            await refresh();
        } catch {
            toast.error('Failed to delete document');
        }
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Documents</CardTitle>
                    <CardDescription>Official employee records and contracts.</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={handleOpenUpload}>
                    <Upload className="mr-2 h-4 w-4" /> Upload
                </Button>
            </CardHeader>
            <CardContent>
                <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                />
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Document Name</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Upload Date</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {documents.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center text-muted-foreground">No documents found.</TableCell>
                            </TableRow>
                        ) : (
                            documents.map((doc) => (
                                <TableRow key={doc.id}>
                                    <TableCell className="font-medium flex items-center gap-2">
                                        <FileText className="h-4 w-4 text-blue-500" />
                                        {doc.name}
                                    </TableCell>
                                    <TableCell>{doc.type}</TableCell>
                                    <TableCell>{doc.uploadDate}</TableCell>
                                    <TableCell className="text-right space-x-1">
                                        <Button variant="ghost" size="icon" onClick={() => handleView(doc)}>
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={() => handleDownload(doc)}>
                                            <Download className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={() => handleDelete(doc.id)}>
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </CardContent>

            <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
                <DialogContent className="sm:max-w-[520px]">
                    <DialogHeader>
                        <DialogTitle>Upload document</DialogTitle>
                        <DialogDescription>Attach KYC, contract, NDA, or other official file.</DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-2">
                        <div className="grid gap-2">
                            <Label>Document type</Label>
                            <Select value={docType} onValueChange={setDocType}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="KYC">KYC</SelectItem>
                                    <SelectItem value="ID">ID</SelectItem>
                                    <SelectItem value="Contract">Contract</SelectItem>
                                    <SelectItem value="NDA">NDA</SelectItem>
                                    <SelectItem value="Other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid gap-2">
                            <Label>File</Label>
                            <div className="flex items-center gap-3">
                                <Button type="button" variant="outline" onClick={handlePickFile}>
                                    Choose file
                                </Button>
                                <div className="text-sm text-muted-foreground truncate">
                                    {selectedFile ? selectedFile.name : 'No file selected'}
                                </div>
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" type="button" onClick={() => setIsUploadOpen(false)}>Cancel</Button>
                        <Button type="button" disabled={!selectedFile || uploading} onClick={handleUpload}>
                            {uploading ? 'Uploading...' : 'Upload'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Card>
    );
}
