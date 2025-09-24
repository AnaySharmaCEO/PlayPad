import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';
import { ChevronLeft, ChevronRight, Plus, Download, Trash2, Sparkles } from 'lucide-react';
import { Task } from './TaskModal';
import { motion } from 'motion/react';

interface WeeklyCalendarProps {
  tasks: Task[];
  onAddTask: (date: string) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onToggleTaskComplete: (taskId: string) => void;
  onExportSchedule: () => void;
}

export const WeeklyCalendar: React.FC<WeeklyCalendarProps> = ({
  tasks,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onToggleTaskComplete,
  onExportSchedule,
}) => {
  const [currentWeek, setCurrentWeek] = useState(new Date());

  const getWeekDates = (date: Date) => {
    const week = [];
    const startDate = new Date(date);
    const day = startDate.getDay();
    const diff = startDate.getDate() - day;
    startDate.setDate(diff);

    for (let i = 0; i < 7; i++) {
      const day = new Date(startDate);
      day.setDate(startDate.getDate() + i);
      week.push(day);
    }
    return week;
  };

  const weekDates = getWeekDates(currentWeek);
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const timeSlots = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentWeek);
    newDate.setDate(currentWeek.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentWeek(newDate);
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const getTasksForDateAndHour = (date: Date, hour: number) => {
    const dateString = formatDate(date);
    return tasks.filter(task => {
      if (task.date !== dateString) return false;
      const taskStartHour = parseInt(task.startTime.split(':')[0]);
      const taskEndHour = parseInt(task.endTime.split(':')[0]);
      return hour >= taskStartHour && hour < taskEndHour;
    });
  };

  const getTaskPosition = (task: Task) => {
    const startHour = parseInt(task.startTime.split(':')[0]);
    const startMinute = parseInt(task.startTime.split(':')[1]);
    const endHour = parseInt(task.endTime.split(':')[0]);
    const endMinute = parseInt(task.endTime.split(':')[1]);
    
    const top = (startHour + startMinute / 60) * 60; // 60px per hour
    const height = ((endHour + endMinute / 60) - (startHour + startMinute / 60)) * 60;
    
    return { top: `${top}px`, height: `${Math.max(height, 30)}px` };
  };

  const getCurrentWeekString = () => {
    const firstDay = weekDates[0];
    const lastDay = weekDates[6];
    
    if (firstDay.getMonth() === lastDay.getMonth()) {
      return `${firstDay.toLocaleDateString('en-US', { month: 'long' })} ${firstDay.getDate()}-${lastDay.getDate()}, ${firstDay.getFullYear()}`;
    } else {
      return `${firstDay.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${lastDay.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, ${firstDay.getFullYear()}`;
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <Card className="rounded-xl border-border/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateWeek('prev')}
                className="rounded-xl"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <CardTitle className="text-lg">
                {getCurrentWeekString()}
              </CardTitle>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateWeek('next')}
                className="rounded-xl"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onExportSchedule}
                className="rounded-xl"
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              
              <Button
                size="sm"
                onClick={() => onAddTask(formatDate(new Date()))}
                className="rounded-xl"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Task
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Calendar Grid */}
      <Card className="rounded-xl border-border/50">
        <CardContent className="p-0">
          <div className="grid grid-cols-8 border-b border-border">
            {/* Time column header */}
            <div className="p-4 border-r border-border bg-muted/30">
              <span className="text-sm">Time</span>
            </div>
            
            {/* Day headers */}
            {weekDates.map((date, index) => {
              const isToday = date.toDateString() === new Date().toDateString();
              return (
                <div
                  key={index}
                  className={`p-4 border-r border-border last:border-r-0 text-center ${
                    isToday ? 'bg-primary/10' : 'bg-muted/30'
                  }`}
                >
                  <div className="text-sm">{weekDays[index]}</div>
                  <div className={`text-lg ${isToday ? 'text-primary' : ''}`}>
                    {date.getDate()}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Calendar Body */}
          <div className="relative">
            <div className="grid grid-cols-8">
              {/* Time slots */}
              <div className="border-r border-border">
                {timeSlots.map((time, index) => (
                  <div
                    key={time}
                    className="h-15 p-2 border-b border-border/50 text-xs text-muted-foreground"
                    style={{ height: '60px' }}
                  >
                    {index % 2 === 0 ? time : ''}
                  </div>
                ))}
              </div>

              {/* Day columns */}
              {weekDates.map((date, dayIndex) => (
                <div key={dayIndex} className="relative border-r border-border last:border-r-0">
                  {/* Time slot backgrounds */}
                  {timeSlots.map((_, hourIndex) => (
                    <div
                      key={hourIndex}
                      className="h-15 border-b border-border/50 hover:bg-muted/30 cursor-pointer transition-colors"
                      style={{ height: '60px' }}
                      onClick={() => onAddTask(formatDate(date))}
                    />
                  ))}

                  {/* Tasks */}
                  <div className="absolute inset-0 pointer-events-none">
                    {tasks
                      .filter(task => task.date === formatDate(date))
                      .map((task) => {
                        const position = getTaskPosition(task);
                        return (
                          <motion.div
                            key={task.id}
                            className={`absolute left-1 right-1 pointer-events-auto cursor-pointer rounded-lg p-2 text-white text-xs group transition-all duration-200 ${
                              task.completed 
                                ? `${task.color} opacity-60 ring-2 ring-green-400` 
                                : task.color
                            }`}
                            style={{
                              ...position,
                            }}
                            onClick={() => onEditTask(task)}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            whileHover={{ scale: 1.02 }}
                            transition={{ duration: 0.2 }}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-start gap-2 flex-1 min-w-0">
                                <Checkbox
                                  checked={task.completed || false}
                                  onCheckedChange={(checked) => {
                                    onToggleTaskComplete(task.id);
                                  }}
                                  className="h-3 w-3 mt-0.5 bg-white/20 border-white/50 data-[state=checked]:bg-white data-[state=checked]:text-black"
                                  onClick={(e) => e.stopPropagation()}
                                />
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-1 mb-1">
                                    <span className={`truncate ${task.completed ? 'line-through opacity-75' : ''}`}>
                                      {task.title}
                                    </span>
                                    {task.aiGenerated && (
                                      <Sparkles className="h-3 w-3 text-yellow-300 flex-shrink-0" />
                                    )}
                                  </div>
                                  <div className="text-xs opacity-80">
                                    {task.startTime} - {task.endTime}
                                  </div>
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-4 w-4 p-0 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onDeleteTask(task.id);
                                }}
                              >
                                <Trash2 className="h-3 w-3 text-white" />
                              </Button>
                            </div>
                          </motion.div>
                        );
                      })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};