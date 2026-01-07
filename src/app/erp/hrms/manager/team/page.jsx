'use client';

import React, { useEffect, useState } from 'react';
import { hrmsService } from '@/services/hrmsService';
import { useHRMSRole } from '@/hooks/useHRMSRole';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, Users, Mail, Phone, Briefcase, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ManagerTeamPage() {
    const router = useRouter();
    const { employeeId, isManager } = useHRMSRole();
    const [teamMembers, setTeamMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (!isManager) {
            router.push('/erp/hrms/me/dashboard');
            return;
        }
        loadTeam();
    }, [employeeId, isManager]);

    const loadTeam = async () => {
        try {
            const members = await hrmsService.getTeamMembers(employeeId);
            setTeamMembers(members);
        } catch (error) {
            console.error('Failed to load team:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredMembers = teamMembers.filter((member) =>
        `${member.firstName} ${member.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.designation.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="p-8">
                <div className="flex items-center justify-center h-64">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">My Team</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage and view your team members
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-lg px-4 py-2">
                        <Users className="h-4 w-4 mr-2" />
                        {teamMembers.length} Members
                    </Badge>
                </div>
            </div>

            {/* Search */}
            <Card>
                <CardContent className="pt-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search team members by name, email, or designation..."
                            className="pl-10"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Team Members Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredMembers.length === 0 ? (
                    <div className="col-span-full text-center py-12 text-muted-foreground">
                        <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No team members found</p>
                    </div>
                ) : (
                    filteredMembers.map((member) => (
                        <Card key={member.id} className="hover:shadow-lg transition-shadow">
                            <CardHeader className="pb-3">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-12 w-12">
                                            <AvatarImage src={member.avatar} />
                                            <AvatarFallback>
                                                {member.firstName[0]}{member.lastName[0]}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <CardTitle className="text-lg">
                                                {member.firstName} {member.lastName}
                                            </CardTitle>
                                            <p className="text-sm text-muted-foreground">
                                                {member.designation}
                                            </p>
                                        </div>
                                    </div>
                                    <Badge variant={member.status === 'Active' ? 'default' : 'secondary'}>
                                        {member.status}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex items-center gap-2 text-sm">
                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                    <span className="truncate">{member.email}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <Phone className="h-4 w-4 text-muted-foreground" />
                                    <span>{member.phone}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                                    <Badge variant="outline">{member.department}</Badge>
                                </div>
                                <div className="pt-3 border-t">
                                    <Link href={`/erp/hrms/employees/${member.id}`}>
                                        <Button variant="outline" className="w-full" size="sm">
                                            View Profile
                                            <ArrowRight className="h-4 w-4 ml-2" />
                                        </Button>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
