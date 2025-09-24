import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';

export interface Task {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  category: string;
  date: string;
  color: string;
  completed?: boolean;
  aiGenerated?: boolean;
}

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Omit<Task, 'id'>) => void;
  editTask?: Task;
  selectedDate?: string;
}

const categories = [
  { value: 'work', label: 'Work', color: 'bg-blue-500' },
  { value: 'personal', label: 'Personal', color: 'bg-green-500' },
  { value: 'health', label: 'Health', color: 'bg-red-500' },
  { value: 'education', label: 'Education', color: 'bg-purple-500' },
  { value: 'social', label: 'Social', color: 'bg-yellow-500' },
  { value: 'other', label: 'Other', color: 'bg-gray-500' },
];

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editTask,
  selectedDate,
}) => {
  const [title, setTitle] = useState(editTask?.title || '');
  const [startTime, setStartTime] = useState(editTask?.startTime || '09:00');
  const [endTime, setEndTime] = useState(editTask?.endTime || '10:00');
  const [category, setCategory] = useState(editTask?.category || 'work');
  const [date, setDate] = useState(editTask?.date || selectedDate || new Date().toISOString().split('T')[0]);

  const handleSave = () => {
    if (!title.trim()) return;

    const selectedCategory = categories.find(cat => cat.value === category);
    
    onSave({
      title: title.trim(),
      startTime,
      endTime,
      category,
      date,
      color: selectedCategory?.color || 'bg-gray-500',
    });

    // Reset form
    setTitle('');
    setStartTime('09:00');
    setEndTime('10:00');
    setCategory('work');
    setDate(new Date().toISOString().split('T')[0]);
    onClose();
  };

  const handleClose = () => {
    // Reset form on close
    setTitle(editTask?.title || '');
    setStartTime(editTask?.startTime || '09:00');
    setEndTime(editTask?.endTime || '10:00');
    setCategory(editTask?.category || 'work');
    setDate(editTask?.date || selectedDate || new Date().toISOString().split('T')[0]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px] rounded-xl">
        <DialogHeader>
          <DialogTitle>{editTask ? 'Edit Task' : 'Add New Task'}</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Task Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title..."
              className="rounded-xl"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="rounded-xl"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="startTime">Start Time</Label>
              <Input
                id="startTime"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="rounded-xl"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="endTime">End Time</Label>
              <Input
                id="endTime"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="rounded-xl"
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${cat.color}`} />
                      <span>{cat.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Preview */}
          <div className="grid gap-2">
            <Label>Preview</Label>
            <div className="p-3 border border-border rounded-xl bg-muted/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">{title || 'Task Title'}</span>
                <Badge variant="secondary" className={`${categories.find(cat => cat.value === category)?.color} text-white`}>
                  {categories.find(cat => cat.value === category)?.label}
                </Badge>
              </div>
              <div className="text-xs text-muted-foreground">
                {startTime} - {endTime}
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} className="rounded-xl">
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={!title.trim()}
            className="rounded-xl"
          >
            {editTask ? 'Update' : 'Add'} Task
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};