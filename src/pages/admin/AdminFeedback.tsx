import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import {
    Search, Eye, Bug, Lightbulb, TrendingUp, CheckCircle,
    Clock, AlertCircle, XCircle, MessageSquare, ExternalLink, Image
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
    Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

interface FeedbackTicket {
    id: string;
    type: string;
    priority: string;
    status: string;
    title: string;
    description: string;
    submitted_from_url: string | null;
    screenshot_url: string | null;
    submitted_by: string | null;
    admin_notes: string | null;
    resolved_at: string | null;
    created_at: string;
    updated_at: string;
}

const typeConfig: Record<string, { label: string; icon: any; color: string }> = {
    bug: { label: '🐛 Bug', icon: Bug, color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
    feature: { label: '✨ Feature', icon: Lightbulb, color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
    improvement: { label: '📈 Improvement', icon: TrendingUp, color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
};

const priorityConfig: Record<string, { label: string; color: string }> = {
    critical: { label: 'Critical', color: 'bg-red-500 text-white' },
    high: { label: 'High', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400' },
    medium: { label: 'Medium', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' },
    low: { label: 'Low', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
};

const statusConfig: Record<string, { label: string; icon: any; color: string }> = {
    open: { label: 'Open', icon: AlertCircle, color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
    in_progress: { label: 'In Progress', icon: Clock, color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' },
    resolved: { label: 'Resolved', icon: CheckCircle, color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
    closed: { label: 'Closed', icon: XCircle, color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400' },
};

const statusOptions = Object.entries(statusConfig).map(([value, config]) => ({
    value,
    label: config.label,
}));

const AdminFeedback = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();
    const [search, setSearch] = useState('');
    const [typeFilter, setTypeFilter] = useState<string>('all');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [priorityFilter, setPriorityFilter] = useState<string>('all');
    const [selectedTicket, setSelectedTicket] = useState<FeedbackTicket | null>(null);
    const [notes, setNotes] = useState('');
    const [screenshotModal, setScreenshotModal] = useState<string | null>(null);

    // Fetch tickets
    const { data: tickets, isLoading } = useQuery({
        queryKey: ['admin-feedback'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('feedback_tickets')
                .select('*')
                .order('created_at', { ascending: false });
            if (error) throw error;
            return data as FeedbackTicket[];
        },
    });

    // Update mutation
    const updateMutation = useMutation({
        mutationFn: async ({ id, status, admin_notes }: { id: string; status: string; admin_notes: string }) => {
            const updateData: any = {
                status,
                admin_notes,
                updated_at: new Date().toISOString(),
            };
            if (status === 'resolved' || status === 'closed') {
                updateData.resolved_at = new Date().toISOString();
            }
            const { error } = await supabase
                .from('feedback_tickets')
                .update(updateData)
                .eq('id', id);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-feedback'] });
            queryClient.invalidateQueries({ queryKey: ['admin-feedback-count'] });
            toast({ title: 'Ticket updated successfully' });
            setSelectedTicket(null);
        },
        onError: () => {
            toast({ title: 'Update failed', variant: 'destructive' });
        },
    });

    // Delete mutation
    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase
                .from('feedback_tickets')
                .delete()
                .eq('id', id);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-feedback'] });
            queryClient.invalidateQueries({ queryKey: ['admin-feedback-count'] });
            toast({ title: 'Ticket deleted' });
            setSelectedTicket(null);
        },
    });

    // Filter tickets
    const filteredTickets = tickets?.filter((t) => {
        const matchesSearch =
            t.title.toLowerCase().includes(search.toLowerCase()) ||
            t.description.toLowerCase().includes(search.toLowerCase());
        const matchesType = typeFilter === 'all' || t.type === typeFilter;
        const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
        const matchesPriority = priorityFilter === 'all' || t.priority === priorityFilter;
        return matchesSearch && matchesType && matchesStatus && matchesPriority;
    });

    // Stats
    const stats = {
        open: tickets?.filter((t) => t.status === 'open').length || 0,
        in_progress: tickets?.filter((t) => t.status === 'in_progress').length || 0,
        resolved: tickets?.filter((t) => t.status === 'resolved').length || 0,
        total: tickets?.length || 0,
    };

    const openDetail = (ticket: FeedbackTicket) => {
        setSelectedTicket(ticket);
        setNotes(ticket.admin_notes || '');
    };

    const handleUpdate = () => {
        if (!selectedTicket) return;
        updateMutation.mutate({
            id: selectedTicket.id,
            status: selectedTicket.status,
            admin_notes: notes,
        });
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="font-serif text-3xl font-bold text-foreground">Issue Tracker</h1>
                <p className="text-muted-foreground mt-1">Track and resolve bugs, features, and improvements</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                                <AlertCircle className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{stats.open}</p>
                                <p className="text-sm text-muted-foreground">Open</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-yellow-100 dark:bg-yellow-900/30">
                                <Clock className="h-5 w-5 text-yellow-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{stats.in_progress}</p>
                                <p className="text-sm text-muted-foreground">In Progress</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                                <CheckCircle className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{stats.resolved}</p>
                                <p className="text-sm text-muted-foreground">Resolved</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                                <MessageSquare className="h-5 w-5 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{stats.total}</p>
                                <p className="text-sm text-muted-foreground">Total</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search issues..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <Select value={typeFilter} onValueChange={setTypeFilter}>
                            <SelectTrigger className="w-full sm:w-36">
                                <SelectValue placeholder="Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Types</SelectItem>
                                <SelectItem value="bug">🐛 Bug</SelectItem>
                                <SelectItem value="feature">✨ Feature</SelectItem>
                                <SelectItem value="improvement">📈 Improvement</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                            <SelectTrigger className="w-full sm:w-36">
                                <SelectValue placeholder="Priority" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Priority</SelectItem>
                                <SelectItem value="critical">Critical</SelectItem>
                                <SelectItem value="high">High</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="low">Low</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-full sm:w-36">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                {statusOptions.map((opt) => (
                                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Table */}
            <Card>
                <CardContent className="p-0">
                    {isLoading ? (
                        <div className="p-6 space-y-4">
                            {[1, 2, 3, 4].map((i) => (
                                <Skeleton key={i} className="h-16 w-full" />
                            ))}
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Priority</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Page</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredTickets?.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                                            <Bug className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                            <p>No issues found</p>
                                            <p className="text-sm mt-1">Use the "Report Issue" button to submit one</p>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredTickets?.map((ticket) => {
                                        const typeInfo = typeConfig[ticket.type];
                                        const priorityInfo = priorityConfig[ticket.priority];
                                        const statusInfo = statusConfig[ticket.status];
                                        return (
                                            <TableRow key={ticket.id} className="cursor-pointer hover:bg-muted/50" onClick={() => openDetail(ticket)}>
                                                <TableCell>
                                                    <Badge className={typeInfo?.color}>{typeInfo?.label}</Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <p className="font-medium max-w-[200px] truncate">{ticket.title}</p>
                                                        {ticket.screenshot_url && <Image className="h-3.5 w-3.5 text-muted-foreground" />}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge className={priorityInfo?.color}>{priorityInfo?.label}</Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge className={statusInfo?.color}>{statusInfo?.label}</Badge>
                                                </TableCell>
                                                <TableCell>
                                                    {ticket.submitted_from_url ? (
                                                        <code className="text-xs bg-muted px-1.5 py-0.5 rounded">
                                                            {ticket.submitted_from_url}
                                                        </code>
                                                    ) : '-'}
                                                </TableCell>
                                                <TableCell className="text-sm text-muted-foreground">
                                                    {format(new Date(ticket.created_at), 'dd/MM/yyyy')}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); openDetail(ticket); }}>
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                )}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            {/* Detail Dialog */}
            <Dialog open={!!selectedTicket} onOpenChange={() => setSelectedTicket(null)}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            {selectedTicket && (
                                <Badge className={typeConfig[selectedTicket.type]?.color}>
                                    {typeConfig[selectedTicket.type]?.label}
                                </Badge>
                            )}
                            {selectedTicket?.title}
                        </DialogTitle>
                        <DialogDescription>
                            {selectedTicket && format(new Date(selectedTicket.created_at), 'dd MMMM, yyyy hh:mm a')}
                            {selectedTicket?.submitted_from_url && (
                                <span className="ml-2">
                                    • Page: <code className="text-xs bg-muted px-1.5 py-0.5 rounded">{selectedTicket.submitted_from_url}</code>
                                </span>
                            )}
                        </DialogDescription>
                    </DialogHeader>

                    {selectedTicket && (
                        <div className="space-y-5">
                            {/* Screenshot */}
                            {selectedTicket.screenshot_url && (
                                <div className="space-y-1.5">
                                    <Label className="text-muted-foreground">📸 Screenshot</Label>
                                    <div
                                        className="border rounded-lg overflow-hidden cursor-pointer hover:ring-2 ring-primary transition-all"
                                        onClick={() => setScreenshotModal(selectedTicket.screenshot_url)}
                                    >
                                        <img
                                            src={selectedTicket.screenshot_url}
                                            alt="Issue screenshot"
                                            className="w-full h-48 object-cover object-top"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Description */}
                            <div>
                                <Label className="text-muted-foreground">Description</Label>
                                <p className="mt-1 p-3 bg-muted rounded-lg whitespace-pre-wrap">{selectedTicket.description}</p>
                            </div>

                            {/* Priority & Status */}
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label>Priority</Label>
                                    <Badge className={priorityConfig[selectedTicket.priority]?.color}>
                                        {priorityConfig[selectedTicket.priority]?.label}
                                    </Badge>
                                </div>
                                <div className="space-y-2">
                                    <Label>Status</Label>
                                    <Select
                                        value={selectedTicket.status}
                                        onValueChange={(value) => setSelectedTicket({ ...selectedTicket, status: value })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {statusOptions.map((opt) => (
                                                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Admin Notes */}
                            <div className="space-y-2">
                                <Label>Resolution Notes</Label>
                                <Textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="Write notes about the resolution..."
                                    rows={3}
                                />
                            </div>

                            {/* Actions */}
                            <div className="flex justify-between">
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => {
                                        if (confirm('Delete this ticket?')) deleteMutation.mutate(selectedTicket.id);
                                    }}
                                >
                                    Delete
                                </Button>
                                <div className="flex gap-3">
                                    <Button variant="outline" onClick={() => setSelectedTicket(null)}>Cancel</Button>
                                    <Button onClick={handleUpdate} disabled={updateMutation.isPending}>
                                        Update
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Full Screenshot Modal */}
            <Dialog open={!!screenshotModal} onOpenChange={() => setScreenshotModal(null)}>
                <DialogContent className="max-w-4xl p-2">
                    {screenshotModal && (
                        <img src={screenshotModal} alt="Full screenshot" className="w-full rounded" />
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AdminFeedback;
