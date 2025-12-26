"use client";

import { useState, useRef, useEffect } from "react";
import {
  TrendingUp,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Mail,
  Phone,
  Calendar,
  DollarSign,
  Target,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  GripVertical
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import { Progress } from "../../components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import { Label } from "../../components/ui/label";
import { motion, AnimatePresence } from "framer-motion";

// --- Types & Config ---

type LeadStatus = "New" | "Contacted" | "Qualified" | "Proposal" | "Negotiation" | "Won" | "Lost";

interface Lead {
  id: number;
  name: string;
  company: string;
  email: string;
  phone: string;
  status: LeadStatus;
  value: number;
  probability: number;
  source: string;
  assignedTo: string;
  lastActivity: string;
  nextFollowUp: string;
}

const statusConfig: Record<LeadStatus, { color: string; textColor: string; bgColor: string; borderColor: string }> = {
  New: {
    color: "bg-blue-500",
    textColor: "text-blue-600",
    bgColor: "bg-blue-50 dark:bg-blue-950/50",
    borderColor: "border-blue-200 dark:border-blue-800",
  },
  Contacted: {
    color: "bg-purple-500",
    textColor: "text-purple-600",
    bgColor: "bg-purple-50 dark:bg-purple-950/50",
    borderColor: "border-purple-200 dark:border-purple-800",
  },
  Qualified: {
    color: "bg-indigo-500",
    textColor: "text-indigo-600",
    bgColor: "bg-indigo-50 dark:bg-indigo-950/50",
    borderColor: "border-indigo-200 dark:border-indigo-800",
  },
  Proposal: {
    color: "bg-orange-500",
    textColor: "text-orange-600",
    bgColor: "bg-orange-50 dark:bg-orange-950/50",
    borderColor: "border-orange-200 dark:border-orange-800",
  },
  Negotiation: {
    color: "bg-cyan-500",
    textColor: "text-cyan-600",
    bgColor: "bg-cyan-50 dark:bg-cyan-950/50",
    borderColor: "border-cyan-200 dark:border-cyan-800",
  },
  Won: {
    color: "bg-emerald-500",
    textColor: "text-emerald-600",
    bgColor: "bg-emerald-50 dark:bg-emerald-950/50",
    borderColor: "border-emerald-200 dark:border-emerald-800",
  },
  Lost: {
    color: "bg-red-500",
    textColor: "text-red-600",
    bgColor: "bg-red-50 dark:bg-red-950/50",
    borderColor: "border-red-200 dark:border-red-800",
  },
};

const initialLeads: Lead[] = [
  {
    id: 1,
    name: "Sarah Miller",
    company: "Tech Innovations",
    email: "sarah@techinnovations.com",
    phone: "+1 (555) 111-2222",
    status: "New",
    value: 25000,
    probability: 30,
    source: "Website",
    assignedTo: "John Doe",
    lastActivity: "2024-01-23",
    nextFollowUp: "2024-01-25",
  },
  {
    id: 2,
    name: "Robert Chen",
    company: "Digital Solutions",
    email: "robert@digital.com",
    phone: "+1 (555) 222-3333",
    status: "Contacted",
    value: 45000,
    probability: 50,
    source: "Referral",
    assignedTo: "Jane Smith",
    lastActivity: "2024-01-22",
    nextFollowUp: "2024-01-26",
  },
  {
    id: 3,
    name: "Emily Brown",
    company: "Future Corp",
    email: "emily@future.com",
    phone: "+1 (555) 333-4444",
    status: "Qualified",
    value: 60000,
    probability: 70,
    source: "LinkedIn",
    assignedTo: "Mike Johnson",
    lastActivity: "2024-01-21",
    nextFollowUp: "2024-01-24",
  },
  {
    id: 4,
    name: "David Wilson",
    company: "Smart Systems",
    email: "david@smart.com",
    phone: "+1 (555) 444-5555",
    status: "Negotiation",
    value: 80000,
    probability: 85,
    source: "Trade Show",
    assignedTo: "Sarah Davis",
    lastActivity: "2024-01-23",
    nextFollowUp: "2024-01-25",
  },
  {
    id: 5,
    name: "Lisa Anderson",
    company: "Innovation Hub",
    email: "lisa@innovation.com",
    phone: "+1 (555) 555-6666",
    status: "Proposal",
    value: 35000,
    probability: 60,
    source: "Cold Call",
    assignedTo: "Tom Wilson",
    lastActivity: "2024-01-20",
    nextFollowUp: "2024-01-27",
  },
];

const columns: LeadStatus[] = ["New", "Contacted", "Qualified", "Proposal", "Negotiation", "Won", "Lost"];

// --- Components ---

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterAssignee, setFilterAssignee] = useState("all");
  const [isAddLeadOpen, setIsAddLeadOpen] = useState(false);
  const [draggedLead, setDraggedLead] = useState<Lead | null>(null);

  // New Lead Form State
  const [newLead, setNewLead] = useState<Partial<Lead>>({
    name: "",
    company: "",
    value: 0,
    status: "New",
  });

  const handleDragStart = (e: React.DragEvent, lead: Lead) => {
    setDraggedLead(lead);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetStatus: LeadStatus) => {
    e.preventDefault();
    if (!draggedLead) return;

    if (draggedLead.status !== targetStatus) {
      const updatedLeads = leads.map((l) =>
        l.id === draggedLead.id ? { ...l, status: targetStatus } : l
      );
      setLeads(updatedLeads);
    }
    setDraggedLead(null);
  };

  const handleAddLead = () => {
    const lead: Lead = {
      id: Math.max(...leads.map((l) => l.id)) + 1,
      name: newLead.name || "New Lead",
      company: newLead.company || "New Company",
      email: "new@example.com",
      phone: "",
      status: "New",
      value: newLead.value || 0,
      probability: 10,
      source: "Manual",
      assignedTo: "Unassigned",
      lastActivity: new Date().toISOString().split('T')[0],
      nextFollowUp: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      ...newLead as Partial<Lead>,
    };
    setLeads([...leads, lead]);
    setIsAddLeadOpen(false);
    setNewLead({ name: "", company: "", value: 0, status: "New" });
  };

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAssignee = filterAssignee === "all" || lead.assignedTo === filterAssignee;
    return matchesSearch && matchesAssignee;
  });

  const totalValue = leads.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="space-y-6 h-[calc(100vh-8rem)] flex flex-col animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
            Lead Management
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Drag and drop leads to update their status
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search leads..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white dark:bg-slate-900"
            />
          </div>

          <Dialog open={isAddLeadOpen} onOpenChange={setIsAddLeadOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/20">
                <Plus className="w-4 h-4 mr-2" />
                Add Lead
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Lead</DialogTitle>
                <DialogDescription>
                  Create a new lead to track in your pipeline.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">Name</Label>
                  <Input
                    id="name"
                    value={newLead.name}
                    onChange={(e) => setNewLead({ ...newLead, name: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="company" className="text-right">Company</Label>
                  <Input
                    id="company"
                    value={newLead.company}
                    onChange={(e) => setNewLead({ ...newLead, company: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="value" className="text-right">Value ($)</Label>
                  <Input
                    id="value"
                    type="number"
                    value={newLead.value}
                    onChange={(e) => setNewLead({ ...newLead, value: Number(e.target.value) })}
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={handleAddLead}>Create Lead</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 shrink-0">
        <Card className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border border-slate-200 dark:border-slate-800 shadow-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Leads</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{leads.length}</h3>
            </div>
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
              <Users className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border border-slate-200 dark:border-slate-800 shadow-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Pipeline Value</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">${(totalValue / 1000).toFixed(1)}k</h3>
            </div>
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg text-green-600 dark:text-green-400">
              <DollarSign className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
      </div>


      {/* Kanban Board Area */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden pb-4">
        <div className="flex gap-4 min-w-[max-content] h-full px-1">
          {columns.map((columnId) => {
            const columnLeads = filteredLeads.filter((l) => l.status === columnId);
            const config = statusConfig[columnId];

            return (
              <div
                key={columnId}
                className="w-80 flex-shrink-0 flex flex-col h-full rounded-xl bg-slate-100/50 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-800 backdrop-blur-sm"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, columnId)}
              >
                {/* Column Header */}
                <div className={`p-3 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between sticky top-0 bg-inherit rounded-t-xl z-10`}>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${config.color.replace('bg-', 'bg-')}`} />
                    <h3 className="font-semibold text-slate-900 dark:text-white text-sm">{columnId}</h3>
                    <Badge variant="secondary" className="text-xs bg-white dark:bg-slate-800 ml-1">
                      {columnLeads.length}
                    </Badge>
                  </div>
                  <MoreVertical className="w-4 h-4 text-slate-400" />
                </div>

                {/* Column Content */}
                <div className="flex-1 overflow-y-auto p-2 space-y-3 custom-scrollbar">
                  <AnimatePresence>
                    {columnLeads.map((lead) => (
                      <motion.div
                        layout
                        layoutId={String(lead.id)}
                        key={lead.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        draggable
                        onDragStart={(e) => handleDragStart(e as unknown as React.DragEvent, lead)}
                        className="cursor-grab active:cursor-grabbing"
                      >
                        <Card className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm hover:shadow-md transition-shadow group">
                          <CardContent className="p-3 space-y-3">
                            {/* Card Header & Gripper */}
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-semibold text-slate-900 dark:text-white text-sm line-clamp-1">{lead.name}</h4>
                                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">{lead.company}</p>
                              </div>
                              <div className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-300">
                                <GripVertical className="w-4 h-4" />
                              </div>
                            </div>

                            {/* Key Metrics */}
                            <div className="flex items-center justify-between text-xs">
                              <div className="flex items-center text-slate-600 dark:text-slate-400">
                                <DollarSign className="w-3 h-3 mr-0.5" />
                                <span className="font-medium">{lead.value.toLocaleString()}</span>
                              </div>
                              <div className="flex items-center text-slate-600 dark:text-slate-400">
                                <Target className="w-3 h-3 mr-0.5" />
                                <span>{lead.probability}%</span>
                              </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="w-full bg-slate-100 dark:bg-slate-900 rounded-full h-1.5 overflow-hidden">
                              <div
                                className={`h-full rounded-full ${lead.probability > 75 ? 'bg-emerald-500' :
                                    lead.probability > 40 ? 'bg-blue-500' : 'bg-orange-500'
                                  }`}
                                style={{ width: `${lead.probability}%` }}
                              />
                            </div>

                            {/* Footer: Assignee & Date */}
                            <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-700/50">
                              <div className="flex items-center gap-1.5">
                                <Avatar className="w-5 h-5">
                                  <AvatarFallback className="text-[9px] bg-gradient-to-br from-indigo-500 to-purple-500 text-white">
                                    {lead.assignedTo.split(' ').map(n => n[0]).join('').substring(0, 2)}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate max-w-[80px]">
                                  {lead.assignedTo}
                                </span>
                              </div>
                              <div className="flex items-center text-[10px] text-slate-400">
                                <Clock className="w-3 h-3 mr-1" />
                                {new Date(lead.nextFollowUp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                              </div>
                            </div>

                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {/* Create Placeholder for empty columns */}
                  {columnLeads.length === 0 && (
                    <div className="h-24 flex items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-700/50 rounded-lg">
                      <span className="text-xs text-slate-400">Drop leads here</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
