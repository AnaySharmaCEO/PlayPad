import React, { useState, useEffect, useCallback } from 'react';
import type { Task } from '../components/TaskModal';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Calendar, Clock, Download, FileText } from 'lucide-react';
import { Button } from '../components/ui/button';
import { WeeklyCalendar } from '../components/WeeklyCalendar';
import { TaskModal } from '../components/TaskModal';
import { AIPromptBox } from '../components/AIPromptBox';
import { SchedulerToolbar } from '../components/SchedulerToolbar';
import { Badge } from '../components/ui/badge';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export const SchedulerPage: React.FC = (): JSX.Element => {
  // State declarations
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [isGeneratingSchedule, setIsGeneratingSchedule] = useState(false);
  const [categoryStats, setCategoryStats] = useState<Record<string, number>>({});

  // Memoized export handlers
  const exportToCSV = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:5000/api/tasks/export/csv');
      if (!response.ok) throw new Error('Failed to export CSV');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `schedule-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success('Schedule exported as CSV');
    } catch (error) {
      console.error('Error exporting CSV:', error);
      toast.error('Failed to export CSV');
    }
  }, []);

  const exportToPDF = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:5000/api/tasks/export/pdf');
      if (!response.ok) throw new Error('Failed to export PDF');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `schedule-${new Date().toISOString().split('T')[0]}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success('Schedule exported as PDF');
    } catch (error) {
      console.error('Error exporting PDF:', error);
      toast.error('Failed to export PDF');
    }
  }, []);

  const exportToICS = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:5000/api/tasks/export/ics', {
        method: 'GET',
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `schedule-${new Date().toISOString().split('T')[0]}.ics`;
        a.click();
        window.URL.revokeObjectURL(url);
        toast.success('Schedule exported as ICS');
      } else {
        throw new Error('Failed to export ICS');
      }
    } catch (error) {
      console.error('Error exporting ICS:', error);
      toast.error('Failed to export ICS');
    }
  }, []);

  const handleExportSchedule = useCallback(async () => {
    await exportToCSV();
    await exportToPDF();
    await exportToICS();
  }, [exportToCSV, exportToPDF, exportToICS]);


  // Task management handlers
  const handleAddTask = useCallback((date: string) => {
    setSelectedDate(date);
    setEditingTask(undefined);
    setIsModalOpen(true);
  }, []);

  const handleEditTask = useCallback((task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  }, []);

  const handleDeleteTask = useCallback(async (taskId: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setTasks(prev => prev.filter(task => task.id !== taskId));
        toast.success('Task deleted successfully');
      } else {
        throw new Error('Failed to delete task');
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete task');
    }
  }, []);

  const handleToggleTaskComplete = useCallback(async (taskId: string) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      if (task) {
        const response = await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...task,
            completed: !task.completed,
          }),
        });
        
        if (response.ok) {
          const updatedTask = await response.json();
          setTasks(prev => prev.map(t => 
            t.id === taskId ? updatedTask : t
          ));
          toast.success(updatedTask.completed ? 'Task completed!' : 'Task marked as incomplete');
        } else {
          throw new Error('Failed to update task');
        }
      }
    } catch (error) {
      console.error('Error toggling task completion:', error);
      toast.error('Failed to update task');
    }
  }, [tasks]);

  const handleSaveTask = useCallback(async (taskData: Omit<Task, 'id'>) => {
    try {
      if (editingTask) {
        const response = await fetch(`http://localhost:5000/api/tasks/${editingTask.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...taskData,
            id: editingTask.id,
            completed: editingTask.completed,
            aiGenerated: editingTask.aiGenerated
          }),
        });
        
        if (response.ok) {
          const updatedTask = await response.json();
          setTasks(prev => prev.map(task => 
            task.id === editingTask.id ? updatedTask : task
          ));
          toast.success('Task updated successfully');
        } else {
          throw new Error('Failed to update task');
        }
      } else {
        const response = await fetch('http://localhost:5000/api/tasks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...taskData,
            completed: false,
          }),
        });
        
        if (response.ok) {
          const newTask = await response.json();
          setTasks(prev => [...prev, newTask]);
          toast.success('Task added successfully');
        } else {
          throw new Error('Failed to add task');
        }
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving task:', error);
      toast.error('Failed to save task');
    }
  }, [editingTask]);

  const handleGenerateSchedule = async (prompt: string) => {
    setIsGeneratingSchedule(true);
    try {
      const response = await fetch('http://localhost:5000/api/ai/generate-tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      
      if (response.ok) {
        const generatedTasks = await response.json();
        setTasks(prev => [...prev, ...generatedTasks]);
        toast.success(`Generated ${generatedTasks.length} tasks from your prompt!`, {
          description: 'You can edit, move, or delete AI-generated tasks as needed.'
        });
      } else {
        throw new Error('Failed to generate tasks');
      }
    } catch (error) {
      console.error('Error generating schedule:', error);
      toast.error('Failed to generate schedule');
    } finally {
      setIsGeneratingSchedule(false);
    }
  };

  
  // Fetch tasks from backend when component mounts
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/tasks');
        if (!response.ok) throw new Error('Failed to fetch tasks');
        const data = await response.json();
        if (Array.isArray(data)) {
          setTasks(data);
        } else {
          throw new Error('Invalid data format');
        }
      } catch (error) {
        console.error('Error fetching tasks:', error);
        toast.error('Failed to load tasks');
        setTasks([]);
      }
    };
    
    fetchTasks();
  }, []);

  useEffect(() => {
    const stats = tasks.reduce((acc, task) => {
      acc[task.category] = (acc[task.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    setCategoryStats(stats);
  }, [tasks]);
  
  const getUpcomingTasks = (): Task[] => {
    const today = new Date().toISOString().split('T')[0];
    const currentTime = new Date().toTimeString().slice(0, 5);
    
    return tasks
      .filter((task: Task) => task.date >= today)
      .filter((task: Task) => {
        if (task.date === today) {
          return task.startTime >= currentTime;
        }
        return true;
      })
      .sort((a: Task, b: Task) => {
        if (a.date === b.date) {
          return a.startTime.localeCompare(b.startTime);
        }
        return a.date.localeCompare(b.date);
      })
      .slice(0, 5);
  };

  const tasksExist = Array.isArray(tasks) && tasks.length > 0;
  const upcomingTasks = tasksExist ? getUpcomingTasks() : [];
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-7xl mx-auto px-4 py-8"
    >
      <div className="text-center mb-8">
        <motion.div 
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
          className="flex items-center justify-center mb-4"
        >
          <Calendar className="h-8 w-8 text-primary mr-2" />
          <h1 className="text-3xl">AI Scheduler</h1>
        </motion.div>
        <p className="text-lg text-muted-foreground">
          Intelligent scheduling assistant with drag-and-drop calendar
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Calendar Area */}
        <div className="lg:col-span-3 space-y-6">
          {/* AI Prompt Box */}
          <AIPromptBox 
            onGenerateSchedule={handleGenerateSchedule}
            isGenerating={isGeneratingSchedule}
          />

          {/* Scheduler Toolbar */}
          <SchedulerToolbar 
            tasks={tasks}
            onExportCSV={exportToCSV}
            onExportICS={exportToICS}
            onExportPDF={exportToPDF}
          />

          {/* Weekly Calendar */}
          <WeeklyCalendar
            tasks={tasks}
            onAddTask={handleAddTask}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
            onToggleTaskComplete={handleToggleTaskComplete}
            onExportSchedule={handleExportSchedule}
          />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Upcoming Tasks */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="rounded-xl border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Upcoming
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {!tasksExist ? (
                  <div className="text-center text-muted-foreground py-4">
                    <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No upcoming tasks</p>
                  </div>
                ) : (
                  upcomingTasks.map((task, index) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="p-3 bg-muted/50 rounded-xl cursor-pointer hover:bg-muted transition-colors"
                      onClick={() => handleEditTask(task)}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm truncate">{task.title}</span>
                        <Badge 
                          variant="secondary" 
                          className={`${task.color} text-white text-xs`}
                        >
                          {task.category}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(task.date).toLocaleDateString()} • {task.startTime}
                      </div>
                    </motion.div>
                  ))
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Category Statistics */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="rounded-xl border-border/50">
              <CardHeader>
                <CardTitle>Categories</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {!tasksExist ? (
                  <div className="text-center text-muted-foreground py-4">
                    <p className="text-sm">No tasks yet</p>
                  </div>
                ) : (
                  Object.entries(categoryStats).map(([category, count]) => (
                    <div key={category} className="flex items-center justify-between">
                      <span className="text-sm capitalize">{category}</span>
                      <Badge variant="outline">{count}</Badge>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Export Options */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="rounded-xl border-border/50">
              <CardHeader>
                <CardTitle>Export Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full rounded-xl justify-start"
                  onClick={exportToCSV}
                  disabled={!tasksExist}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Export as CSV
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full rounded-xl justify-start"
                  onClick={exportToICS}
                  disabled={!tasksExist}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Export as ICS
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full rounded-xl justify-start"
                  onClick={handleExportSchedule}
                  disabled={!tasksExist}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export All
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Task Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTask}
        editTask={editingTask}
        selectedDate={selectedDate}
      />
    </motion.div>
  );
};
