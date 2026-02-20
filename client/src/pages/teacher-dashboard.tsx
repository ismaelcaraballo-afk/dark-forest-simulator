import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { 
  Users, 
  BookOpen, 
  BarChart3, 
  Plus, 
  Settings, 
  UserCheck,
  TrendingUp,
  Calendar,
  Copy,
  ExternalLink
} from 'lucide-react';

// Form schemas
const createClassSchema = z.object({
  name: z.string().min(1, 'Class name is required'),
  description: z.string().optional(),
});

const addStudentSchema = z.object({
  sessionCode: z.string().min(6, 'Session code must be at least 6 characters'),
});

type CreateClassData = z.infer<typeof createClassSchema>;
type AddStudentData = z.infer<typeof addStudentSchema>;

const TeacherDashboard = ({ params }: { params: { teacherId: string } }) => {
  const teacherId = params.teacherId;
  const { toast } = useToast();
  const [selectedClass, setSelectedClass] = useState<string | null>(null);

  // Fetch teacher data
  const { data: teacher, isLoading: teacherLoading } = useQuery({
    queryKey: [`/api/teachers/${teacherId}`],
  });

  // Fetch teacher classes
  const { data: classes = [], isLoading: classesLoading } = useQuery({
    queryKey: ['/api/teachers', teacherId, 'classes'],
    queryFn: () => fetch(`/api/teachers/${teacherId}/classes`).then(res => res.json()),
  });

  // Fetch teacher analytics
  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ['/api/teachers', teacherId, 'analytics'],
    queryFn: () => fetch(`/api/teachers/${teacherId}/analytics`).then(res => res.json()),
  });

  // Fetch class students when a class is selected
  const { data: classStudents = [], isLoading: studentsLoading } = useQuery({
    queryKey: ['/api/classes', selectedClass, 'students'],
    queryFn: () => selectedClass ? fetch(`/api/classes/${selectedClass}/students`).then(res => res.json()) : [],
    enabled: !!selectedClass,
  });

  // Create class mutation
  const createClassMutation = useMutation({
    mutationFn: async (data: CreateClassData) => {
      const response = await fetch('/api/classes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          teacherId,
          sessionCode: generateSessionCode(),
        }),
      });
      if (!response.ok) throw new Error('Failed to create class');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/teachers', teacherId, 'classes'] });
      queryClient.invalidateQueries({ queryKey: ['/api/teachers', teacherId, 'analytics'] });
      toast({ title: 'Success', description: 'Class created successfully!' });
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  // Remove student mutation
  const removeStudentMutation = useMutation({
    mutationFn: async ({ classId, userId }: { classId: string; userId: string }) => {
      const response = await fetch(`/api/classes/${classId}/students/${userId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to remove student');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/classes', selectedClass, 'students'] });
      queryClient.invalidateQueries({ queryKey: ['/api/teachers', teacherId, 'analytics'] });
      toast({ title: 'Success', description: 'Student removed from class!' });
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  // Forms
  const createClassForm = useForm<CreateClassData>({
    resolver: zodResolver(createClassSchema),
    defaultValues: { name: '', description: '' },
  });

  const generateSessionCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const copySessionCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({ title: 'Copied!', description: 'Session code copied to clipboard' });
  };

  const onCreateClass = (data: CreateClassData) => {
    createClassMutation.mutate(data);
    createClassForm.reset();
  };

  if (teacherLoading || classesLoading || analyticsLoading) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading teacher dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4" data-testid="teacher-dashboard">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold" data-testid="title-teacher-dashboard">Teacher Dashboard</h1>
            <p className="text-muted-foreground" data-testid="text-teacher-info">
              {(teacher as any)?.institutionName && `${(teacher as any).institutionName} • `}
              {(teacher as any)?.department && `${(teacher as any).department} • `}
              Managing {analytics?.totalClasses || 0} classes
            </p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button data-testid="button-create-class">
                <Plus className="w-4 h-4 mr-2" />
                Create Class
              </Button>
            </DialogTrigger>
            <DialogContent data-testid="dialog-create-class">
              <DialogHeader>
                <DialogTitle>Create New Class</DialogTitle>
              </DialogHeader>
              <Form {...createClassForm}>
                <form onSubmit={createClassForm.handleSubmit(onCreateClass)} className="space-y-4">
                  <FormField
                    control={createClassForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Class Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Game Theory 101" {...field} data-testid="input-class-name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={createClassForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Brief description of the class" {...field} data-testid="input-class-description" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={createClassMutation.isPending} data-testid="button-submit-class">
                    {createClassMutation.isPending ? 'Creating...' : 'Create Class'}
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card data-testid="card-total-classes">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Classes</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="text-total-classes">{analytics?.totalClasses || 0}</div>
            </CardContent>
          </Card>

          <Card data-testid="card-total-students">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="text-total-students">{analytics?.totalStudents || 0}</div>
            </CardContent>
          </Card>

          <Card data-testid="card-active-sessions">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="text-active-sessions">{analytics?.activeSessions || 0}</div>
            </CardContent>
          </Card>

          <Card data-testid="card-completed-sessions">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Sessions</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="text-completed-sessions">{analytics?.completedSessions || 0}</div>
            </CardContent>
          </Card>
        </div>

        {/* Average Scores */}
        {analytics?.averageScores && (
          <Card data-testid="card-average-scores">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Class Average Scores
              </CardTitle>
              <CardDescription>Average decision-making scores across all completed sessions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600" data-testid="text-avg-cooperation">
                    {analytics.averageScores.cooperation.toFixed(1)}
                  </div>
                  <div className="text-sm text-muted-foreground">Cooperation</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600" data-testid="text-avg-caution">
                    {analytics.averageScores.caution.toFixed(1)}
                  </div>
                  <div className="text-sm text-muted-foreground">Caution</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600" data-testid="text-avg-aggression">
                    {analytics.averageScores.aggression.toFixed(1)}
                  </div>
                  <div className="text-sm text-muted-foreground">Aggression</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Classes and Students */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Classes List */}
          <Card data-testid="card-classes-list">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Your Classes
              </CardTitle>
              <CardDescription>Manage your classes and view session codes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {classes.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground" data-testid="text-no-classes">
                  No classes created yet. Create your first class to get started!
                </div>
              ) : (
                classes.map((cls: any) => (
                  <div
                    key={cls.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      selectedClass === cls.id ? 'border-primary bg-primary/5' : 'border-border hover:border-muted-foreground'
                    }`}
                    onClick={() => setSelectedClass(cls.id)}
                    data-testid={`class-card-${cls.id}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold" data-testid={`text-class-name-${cls.id}`}>{cls.name}</h3>
                      <Badge variant={cls.isActive ? 'default' : 'secondary'} data-testid={`badge-class-status-${cls.id}`}>
                        {cls.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    {cls.description && (
                      <p className="text-sm text-muted-foreground mb-2" data-testid={`text-class-description-${cls.id}`}>
                        {cls.description}
                      </p>
                    )}
                    <div className="flex items-center gap-2">
                      <Label className="text-xs">Session Code:</Label>
                      <code className="bg-muted px-2 py-1 rounded text-sm" data-testid={`text-session-code-${cls.id}`}>
                        {cls.sessionCode}
                      </code>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          copySessionCode(cls.sessionCode);
                        }}
                        data-testid={`button-copy-code-${cls.id}`}
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Class Students */}
          <Card data-testid="card-class-students">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                {selectedClass ? 'Class Students' : 'Select a Class'}
              </CardTitle>
              <CardDescription>
                {selectedClass ? 'Students enrolled in the selected class' : 'Choose a class to view its students'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!selectedClass ? (
                <div className="text-center py-8 text-muted-foreground" data-testid="text-select-class">
                  Select a class from the left to view its students
                </div>
              ) : studentsLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-2 text-muted-foreground">Loading students...</p>
                </div>
              ) : classStudents.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground" data-testid="text-no-students">
                  No students have joined this class yet. Share the session code with your students!
                </div>
              ) : (
                <div className="space-y-3">
                  {classStudents.map((student: any) => (
                    <div
                      key={student.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                      data-testid={`student-item-${student.userId}`}
                    >
                      <div>
                        <p className="font-medium" data-testid={`text-student-name-${student.userId}`}>
                          {student.user.username}
                        </p>
                        <p className="text-sm text-muted-foreground" data-testid={`text-student-joined-${student.userId}`}>
                          Joined {new Date(student.joinedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => removeStudentMutation.mutate({
                          classId: selectedClass,
                          userId: student.userId
                        })}
                        disabled={removeStudentMutation.isPending}
                        data-testid={`button-remove-student-${student.userId}`}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;