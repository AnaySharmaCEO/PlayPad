import React, { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { 
  Download, 
  FileText, 
  Calendar, 
  FileOutput,
  TrendingUp,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from './ui/dropdown-menu';
import { Task } from './TaskModal';

interface SchedulerToolbarProps {
  tasks: Task[];
  onExportCSV: () => void;
  onExportICS: () => void;
  onExportPDF: () => void;
}

export const SchedulerToolbar: React.FC<SchedulerToolbarProps> = ({
  tasks,
  onExportCSV,
  onExportICS,
  onExportPDF,
}) => {
  const [showExportSuccess, setShowExportSuccess] = useState(false);

  // Calculate today's progress
  const today = new Date().toISOString().split('T')[0];
  const todaysTasks = tasks.filter(task => task.date === today);
  const completedTasks = todaysTasks.filter(task => (task as any).completed);
  const progressPercentage = todaysTasks.length > 0 
    ? Math.round((completedTasks.length / todaysTasks.length) * 100) 
    : 0;

  // Get upcoming tasks count
  const now = new Date();
  const currentTime = now.toTimeString().slice(0, 5);
  const upcomingToday = todaysTasks.filter(task => task.startTime >= currentTime).length;

  const handleExport = (exportFunction: () => void, type: string) => {
    exportFunction();
    setShowExportSuccess(true);
    setTimeout(() => setShowExportSuccess(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="rounded-xl border-border/50 bg-gradient-to-r from-background to-card/30 shadow-lg">
        <CardContent className="p-4">
          <div className="flex items-center justify-between gap-4">
            {/* Progress Section */}
            <div className="flex items-center gap-4 flex-1">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">Today's Progress</span>
              </div>
              
              <div className="flex items-center gap-3 flex-1 max-w-md">
                <Progress 
                  value={progressPercentage} 
                  className="flex-1 h-2"
                />
                <Badge 
                  variant={progressPercentage >= 75 ? "default" : progressPercentage >= 50 ? "secondary" : "outline"}
                  className={`${
                    progressPercentage >= 75 
                      ? 'bg-green-500 text-white' 
                      : progressPercentage >= 50 
                        ? 'bg-yellow-500 text-white'
                        : 'bg-red-500/10 text-red-600 border-red-200'
                  }`}
                >
                  {progressPercentage}%
                </Badge>
              </div>

              {/* Today's Stats */}
              <div className="hidden md:flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span>{completedTasks.length} completed</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4 text-blue-500" />
                  <span>{upcomingToday} upcoming</span>
                </div>
              </div>
            </div>

            {/* Export Dropdown */}
            <div className="flex items-center gap-2">
              <AnimatePresence>
                {showExportSuccess && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="text-sm text-green-600 flex items-center gap-1"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Exported!
                  </motion.div>
                )}
              </AnimatePresence>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="rounded-xl border-border/50 hover:bg-primary/5 hover:border-primary/30 transition-all duration-200"
                    disabled={tasks.length === 0}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </DropdownMenuTrigger>
                
                <DropdownMenuContent align="end" className="w-56 rounded-xl">
                  <DropdownMenuLabel className="flex items-center">
                    <FileOutput className="h-4 w-4 mr-2" />
                    Export Schedule
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuItem
                    onClick={() => handleExport(onExportCSV, 'CSV')}
                    className="rounded-lg cursor-pointer"
                  >
                    <FileText className="h-4 w-4 mr-2 text-green-600" />
                    <div>
                      <div className="font-medium">Export as CSV</div>
                      <div className="text-xs text-muted-foreground">
                        Spreadsheet format for Excel/Sheets
                      </div>
                    </div>
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem
                    onClick={() => handleExport(onExportICS, 'ICS')}
                    className="rounded-lg cursor-pointer"
                  >
                    <Calendar className="h-4 w-4 mr-2 text-blue-600" />
                    <div>
                      <div className="font-medium">Export as ICS</div>
                      <div className="text-xs text-muted-foreground">
                        Calendar format for Outlook/Google Calendar
                      </div>
                    </div>
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem
                    onClick={() => handleExport(onExportPDF, 'PDF')}
                    className="rounded-lg cursor-pointer"
                  >
                    <FileOutput className="h-4 w-4 mr-2 text-red-600" />
                    <div>
                      <div className="font-medium">Export as PDF</div>
                      <div className="text-xs text-muted-foreground">
                        Printable document format
                      </div>
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};