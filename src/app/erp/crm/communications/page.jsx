'use client';

import React, { useEffect, useState } from 'react';
import { crmService } from '@/services/crmService';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
    Mail, Phone, Send, Inbox, Archive, Trash2, Search,
    Plus, User, Paperclip, MoreVertical, Reply, Forward
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function CommunicationsPage() {
    const [comms, setComms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedComm, setSelectedComm] = useState(null);
    const [activeTab, setActiveTab] = useState('inbox'); // 'inbox' | 'sent'
    const [isComposeOpen, setIsComposeOpen] = useState(false);

    // Compose State
    const [composeData, setComposeData] = useState({
        to: '',
        subject: '',
        content: ''
    });

    const fetchComms = async () => {
        setLoading(true);
        try {
            const data = await crmService.getCommunications();
            // Sort by date descending
            const sortedData = [...data].sort((a, b) => new Date(b.date) - new Date(a.date));
            setComms(sortedData);
            if (!selectedComm && sortedData.length > 0) {
                setSelectedComm(sortedData[0]);
            }
        } catch (error) {
            console.error('Failed to fetch communications', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComms();
    }, []);

    const handleSendEmail = async () => {
        if (!composeData.to || !composeData.subject) {
            toast.error("Please fill in recipient and subject");
            return;
        }

        try {
            await crmService.sendEmail({
                to: composeData.to,
                subject: composeData.subject,
                content: composeData.content,
                type: 'Email' // Explicitly marking as email
            });
            toast.success("Email sent successfully");
            setIsComposeOpen(false);
            setComposeData({ to: '', subject: '', content: '' });
            fetchComms(); // Refresh to see new sent item if we supported a sent folder view fully
        } catch (error) {
            toast.error("Failed to send email");
        }
    };

    const filteredComms = comms.filter(c => {
        if (activeTab === 'inbox') return c.to === 'me@company.com' || c.type === 'Call Log';
        if (activeTab === 'sent') return c.from === 'me@company.com';
        return true;
    });

    return (
        <div className="flex h-[calc(100vh-4rem)]">
            {/* Sidebar */}
            <div className="w-64 border-r bg-muted/40 dark:bg-zinc-900/50 flex flex-col">
                <div className="p-4">
                    <Button className="w-full justify-start gap-2 shadow-sm dark:text-white" onClick={() => setIsComposeOpen(true)}>
                        <Plus className="h-4 w-4" /> Compose
                    </Button>
                </div>
                <div className="px-3 space-y-1">
                    <Button
                        variant={activeTab === 'inbox' ? 'secondary' : 'ghost'}
                        className={cn(
                            "w-full justify-start gap-2",
                            activeTab === 'inbox' && "bg-white dark:bg-zinc-800 shadow-sm font-medium"
                        )}
                        onClick={() => setActiveTab('inbox')}
                    >
                        <Inbox className="h-4 w-4" /> Inbox
                        <span className="ml-auto text-xs font-medium text-muted-foreground">{comms.filter(c => c.to === 'me@company.com').length}</span>
                    </Button>
                    <Button
                        variant={activeTab === 'sent' ? 'secondary' : 'ghost'}
                        className={cn(
                            "w-full justify-start gap-2",
                            activeTab === 'sent' && "bg-white dark:bg-zinc-800 shadow-sm font-medium"
                        )}
                        onClick={() => setActiveTab('sent')}
                    >
                        <Send className="h-4 w-4" /> Sent
                    </Button>
                    <Button variant="ghost" className="w-full justify-start gap-2 text-muted-foreground">
                        <Archive className="h-4 w-4" /> Archive
                    </Button>
                    <Button variant="ghost" className="w-full justify-start gap-2 text-muted-foreground">
                        <Trash2 className="h-4 w-4" /> Trash
                    </Button>
                </div>
            </div>

            {/* List View */}
            <div className="w-80 border-r flex flex-col bg-background dark:bg-zinc-950/50">
                <div className="p-4 border-b">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search messages..." className="pl-9 bg-muted/30" />
                    </div>
                </div>
                <ScrollArea className="flex-1">
                    <div className="flex flex-col">
                        {filteredComms.map((comm) => (
                            <button
                                key={comm.id}
                                onClick={() => setSelectedComm(comm)}
                                className={cn(
                                    "flex flex-col items-start gap-2 p-4 text-left border-b transition-all hover:bg-muted/50",
                                    selectedComm?.id === comm.id && "bg-blue-50 dark:bg-blue-900/20 border-l-2 border-l-blue-500"
                                )}
                            >
                                <div className="flex w-full flex-col gap-1">
                                    <div className="flex items-center gap-2">
                                        <div className={cn("font-semibold text-sm", !comm.read && "text-blue-600 dark:text-blue-400")}>
                                            {activeTab === 'sent' ? `To: ${comm.to}` : comm.from}
                                        </div>
                                        {comm.type !== 'Email' && <Badge variant="outline" className="text-[10px] h-4 px-1">{comm.type}</Badge>}
                                        {!comm.read && <span className="flex h-2 w-2 rounded-full bg-blue-600 ml-auto" />}
                                    </div>
                                    <div className="text-xs text-muted-foreground ml-auto absolute right-4 top-4">
                                        {new Date(comm.date).toLocaleDateString()}
                                    </div>
                                </div>
                                <div className={cn("text-sm leading-none w-full truncate", !comm.read ? "font-semibold" : "font-medium")}>
                                    {comm.subject}
                                </div>
                                <div className="line-clamp-2 text-xs text-muted-foreground w-full">
                                    {comm.content.substring(0, 300)}
                                </div>
                            </button>
                        ))}
                    </div>
                </ScrollArea>
            </div>

            {/* Detail View */}
            <div className="flex-1 flex flex-col bg-background/50 dark:bg-zinc-900/20">
                {selectedComm ? (
                    <>
                        <div className="flex items-center justify-between px-6 py-4 border-b">
                            <div className="flex gap-2">
                                <Button variant="ghost" size="icon" title="Reply">
                                    <Reply className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" title="Forward">
                                    <Forward className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" title="Archive">
                                    <Archive className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" title="Delete">
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                            <div className="text-xs text-muted-foreground">
                                {new Date(selectedComm.date).toLocaleString()}
                            </div>
                        </div>
                        <div className="flex-1 flex flex-col p-6 overflow-auto">
                            <div className="flex items-start gap-4 mb-6">
                                <Avatar className="h-10 w-10">
                                    <AvatarFallback>{(selectedComm.from || 'U').charAt(0).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <div className="grid gap-1">
                                    <div className="font-semibold text-lg">{selectedComm.subject}</div>
                                    <div className="text-sm text-muted-foreground">
                                        <span className="font-medium text-foreground">{selectedComm.from}</span> to <span className="font-medium text-foreground">{selectedComm.to}</span>
                                    </div>
                                </div>
                            </div>
                            <Separator className="my-4" />
                            <div className="text-sm leading-relaxed whitespace-pre-wrap">
                                {selectedComm.content}
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-muted-foreground">
                        Select a message to read
                    </div>
                )}
            </div>

            {/* Compose Modal */}
            <Dialog open={isComposeOpen} onOpenChange={setIsComposeOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>New Message</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <div className="text-right text-sm font-medium">To</div>
                            <Input
                                id="to"
                                value={composeData.to}
                                onChange={(e) => setComposeData({ ...composeData, to: e.target.value })}
                                className="col-span-3"
                                placeholder="recipient@example.com"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <div className="text-right text-sm font-medium">Subject</div>
                            <Input
                                id="subject"
                                value={composeData.subject}
                                onChange={(e) => setComposeData({ ...composeData, subject: e.target.value })}
                                className="col-span-3"
                                placeholder="Meeting regarding..."
                            />
                        </div>
                        <div className="grid gap-2">
                            <Textarea
                                placeholder="Write your message here..."
                                className="min-h-[200px]"
                                value={composeData.content}
                                onChange={(e) => setComposeData({ ...composeData, content: e.target.value })}
                            />
                        </div>
                    </div>
                    <DialogFooter className="flex justify-between items-center sm:justify-between">
                        <Button variant="ghost" size="icon">
                            <Paperclip className="h-4 w-4" />
                        </Button>
                        <Button onClick={handleSendEmail} className="gap-2">
                            <Send className="h-4 w-4" /> Send Message
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
