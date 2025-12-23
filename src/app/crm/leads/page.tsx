"use client";

import { useState } from "react";
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

const leads = [
  {
    id: 1,
    name: "Sarah Miller",
    company: "Tech Innovations",
    email: "sarah@techinnovations.com",
    phone: "+1 (555) 111-2222",
    status: "New",
    value: "$25,000",
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
    value: "$45,000",
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
    value: "$60,000",
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
    value: "$80,000",
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
    value: "$35,000",
    probability: 60,
    source: "Cold Call",
    assignedTo: "Tom Wilson",
    lastActivity: "2024-01-20",
    nextFollowUp: "2024-01-27",
  },
];

const stats = [
  {
    label: "Total Leads",
    value: "847",
    change: "+12.5%",
    icon: Target,
    color: "from-blue-500 to-cyan-500",
  },
  {
    label: "Conversion Rate",
    value: "68.4%",
    change: "+5.2%",
    icon: TrendingUp,
    color: "from-green-500 to-emerald-500",
  },
  {
    label: "Pipeline Value",
    value: "$2.4M",
    change: "+18.3%",
    icon: DollarSign,
    color: "from-purple-500 to-pink-500",
  },
  {
    label: "Avg Response Time",
    value: "2.4h",
    change: "-15%",
    icon: Clock,
    color: "from-orange-500 to-red-500",
  },
];

const statusConfig = {
  New: {
    color: "bg-blue-500",
    textColor: "text-blue-600",
    bgColor: "bg-blue-50   :bg-blue-950",
    borderColor: "border-blue-200   :border-blue-800",
  },
  Contacted: {
    color: "bg-purple-500",
    textColor: "text-purple-600",
    bgColor: "bg-purple-50   :bg-purple-950",
    borderColor: "border-purple-200   :border-purple-800",
  },
  Qualified: {
    color: "bg-green-500",
    textColor: "text-green-600",
    bgColor: "bg-green-50   :bg-green-950",
    borderColor: "border-green-200   :border-green-800",
  },
  Negotiation: {
    color: "bg-orange-500",
    textColor: "text-orange-600",
    bgColor: "bg-orange-50   :bg-orange-950",
    borderColor: "border-orange-200   :border-orange-800",
  },
  Proposal: {
    color: "bg-cyan-500",
    textColor: "text-cyan-600",
    bgColor: "bg-cyan-50   :bg-cyan-950",
    borderColor: "border-cyan-200   :border-cyan-800",
  },
};

export default function LeadsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      selectedStatus === "all" || lead.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900   :text-white mb-2">
            Lead Management
          </h1>
          <p className="text-slate-600   :text-slate-400">
            Track and manage your sales pipeline
          </p>
        </div>
        <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg shadow-blue-500/30">
          <Plus className="w-4 h-4 mr-2" />
          Add Lead
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card
            key={stat.label}
            className="border-0 shadow-lg bg-white   :bg-slate-800 hover:shadow-xl transition-all duration-300 group"
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                >
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <Badge
                  variant="outline"
                  className="bg-green-50   :bg-green-950 text-green-600   :text-green-400 border-green-200   :border-green-800"
                >
                  {stat.change}
                </Badge>
              </div>
              <p className="text-sm text-slate-600   :text-slate-400 mb-1">
                {stat.label}
              </p>
              <p className="text-2xl font-bold text-slate-900   :text-white">
                {stat.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Lead Pipeline */}
      <Card className="border-0 shadow-lg bg-white   :bg-slate-800">
        <CardHeader>
          <CardTitle className="text-slate-900   :text-white">
            Sales Pipeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {Object.entries(statusConfig).map(([status, config]) => {
              const count = leads.filter((l) => l.status === status).length;
              const value = leads
                .filter((l) => l.status === status)
                .reduce(
                  (sum, l) =>
                    sum + parseFloat(l.value.replace("$", "").replace(",", "")),
                  0
                );
              return (
                <div
                  key={status}
                  className={`p-4 rounded-lg border-2 ${config.borderColor} ${config.bgColor} hover:shadow-md transition-all duration-200`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className={`font-semibold ${config.textColor}`}>
                      {status}
                    </h3>
                    <Badge className={`${config.color} text-white`}>
                      {count}
                    </Badge>
                  </div>
                  <p className="text-2xl font-bold text-slate-900   :text-white mb-1">
                    ${(value / 1000).toFixed(0)}K
                  </p>
                  <p className="text-xs text-slate-600   :text-slate-400">
                    Pipeline value
                  </p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Leads List */}
      <Card className="border-0 shadow-lg bg-white   :bg-slate-800">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <CardTitle className="text-slate-900   :text-white">
              All Leads
            </CardTitle>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Search leads..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-full sm:w-40">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="New">New</SelectItem>
                  <SelectItem value="Contacted">Contacted</SelectItem>
                  <SelectItem value="Qualified">Qualified</SelectItem>
                  <SelectItem value="Negotiation">Negotiation</SelectItem>
                  <SelectItem value="Proposal">Proposal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredLeads.map((lead) => (
              <Card
                key={lead.id}
                className="border border-slate-200   :border-slate-700 hover:shadow-md transition-all duration-200"
              >
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                    <div className="flex items-start space-x-4 flex-1">
                      <Avatar className="w-12 h-12">
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
                          {lead.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold text-slate-900   :text-white">
                            {lead.name}
                          </h3>
                          <Badge
                            variant="outline"
                            className={`${
                              statusConfig[
                                lead.status as keyof typeof statusConfig
                              ].bgColor
                            } ${
                              statusConfig[
                                lead.status as keyof typeof statusConfig
                              ].textColor
                            } ${
                              statusConfig[
                                lead.status as keyof typeof statusConfig
                              ].borderColor
                            }`}
                          >
                            {lead.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-600   :text-slate-400 mb-2">
                          {lead.company}
                        </p>
                        <div className="flex flex-wrap gap-3 text-xs text-slate-500   :text-slate-400">
                          <div className="flex items-center">
                            <Mail className="w-3 h-3 mr-1" />
                            {lead.email}
                          </div>
                          <div className="flex items-center">
                            <Phone className="w-3 h-3 mr-1" />
                            {lead.phone}
                          </div>
                          <div className="flex items-center">
                            <Users className="w-3 h-3 mr-1" />
                            {lead.assignedTo}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6 lg:pl-6">
                      <div className="w-full sm:w-auto">
                        <p className="text-xs text-slate-500   :text-slate-400 mb-1">
                          Deal Value
                        </p>
                        <p className="text-xl font-bold text-slate-900   :text-white">
                          {lead.value}
                        </p>
                      </div>

                      <div className="w-full sm:w-48">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-xs text-slate-500   :text-slate-400">
                            Probability
                          </p>
                          <p className="text-xs font-semibold text-slate-700   :text-slate-300">
                            {lead.probability}%
                          </p>
                        </div>
                        <Progress value={lead.probability} className="h-2" />
                      </div>

                      <div>
                        <p className="text-xs text-slate-500   :text-slate-400 mb-1">
                          Next Follow-up
                        </p>
                        <div className="flex items-center text-sm font-medium text-slate-900   :text-white">
                          <Calendar className="w-4 h-4 mr-1" />
                          {new Date(lead.nextFollowUp).toLocaleDateString()}
                        </div>
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Mark as Won
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <ArrowRight className="w-4 h-4 mr-2" />
                            Move Stage
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Calendar className="w-4 h-4 mr-2" />
                            Schedule Follow-up
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <AlertCircle className="w-4 h-4 mr-2" />
                            Mark as Lost
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
