import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { Switch } from '../components/ui/switch';
import { 
  User, Settings, CreditCard, Shield, Bell, ArrowLeft, 
  Edit3, Save, Crown, Calendar, MessageSquare, ChevronRight 
} from 'lucide-react';
import { motion } from 'motion/react';

interface AccountPageProps {
  onNavigate: (mode: string) => void;
}

interface UserProfile {
  fullName: string;
  email: string;
  username: string;
  joinedDate: string;
  plan: 'free' | 'pro' | 'enterprise';
  avatar?: string;
}

interface UsageStats {
  totalSessions: number;
  voiceMinutes: number;
  textMessages: number;
  chessGames: number;
  schedulerEvents: number;
}

export const AccountPage: React.FC<AccountPageProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    fullName: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    username: 'alexj',
    joinedDate: 'March 2024',
    plan: 'pro'
  });

  const [notifications, setNotifications] = useState({
    emailUpdates: true,
    sessionReminders: false,
    weeklyReports: true,
    securityAlerts: true,
  });

  const usageStats: UsageStats = {
    totalSessions: 147,
    voiceMinutes: 2840,
    textMessages: 1256,
    chessGames: 43,
    schedulerEvents: 89,
  };

  const handleProfileUpdate = () => {
    setIsEditing(false);
    // Here you would typically save to backend
    console.log('Profile updated:', profile);
  };

  const handleNotificationChange = (key: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const getPlanBadgeVariant = (plan: string) => {
    switch (plan) {
      case 'free': return 'secondary';
      case 'pro': return 'default';
      case 'enterprise': return 'destructive';
      default: return 'secondary';
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'free': return 'text-muted-foreground';
      case 'pro': return 'text-foreground';
      case 'enterprise': return 'text-primary';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between"
        >
          <div>
            <Button
              variant="ghost"
              onClick={() => onNavigate('home')}
              className="mb-4 border border-border hover:border-foreground"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
            <h1 className="text-2xl font-semibold">Account Dashboard</h1>
            <p className="text-muted-foreground">Manage your PlayPad AI account and preferences</p>
          </div>
          <div className="flex items-center space-x-3">
            <Badge variant={getPlanBadgeVariant(profile.plan)} className="capitalize">
              {profile.plan} Plan
            </Badge>
            {profile.plan === 'pro' && <Crown className="h-5 w-5 text-yellow-500" />}
          </div>
        </motion.div>

        {/* Account Overview Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <Card className="border-border">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Sessions</p>
                  <p className="text-2xl font-semibold">{usageStats.totalSessions}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <MessageSquare className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Messages Sent</p>
                  <p className="text-2xl font-semibold">{usageStats.textMessages}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Events Created</p>
                  <p className="text-2xl font-semibold">{usageStats.schedulerEvents}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 bg-muted/50">
              <TabsTrigger value="profile" className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Profile</span>
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center space-x-2">
                <Shield className="h-4 w-4" />
                <span className="hidden sm:inline">Security</span>
              </TabsTrigger>
              <TabsTrigger value="subscription" className="flex items-center space-x-2">
                <CreditCard className="h-4 w-4" />
                <span className="hidden sm:inline">Subscription</span>
              </TabsTrigger>
              <TabsTrigger value="preferences" className="flex items-center space-x-2">
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">Preferences</span>
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-6">
              <Card className="border-border">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center">
                      <User className="h-5 w-5 mr-2" />
                      Profile Information
                    </CardTitle>
                    <Button
                      variant={isEditing ? "default" : "outline"}
                      onClick={isEditing ? handleProfileUpdate : () => setIsEditing(true)}
                      className="border-border hover:border-foreground"
                    >
                      {isEditing ? (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </>
                      ) : (
                        <>
                          <Edit3 className="h-4 w-4 mr-2" />
                          Edit Profile
                        </>
                      )}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        value={profile.fullName}
                        onChange={(e) => setProfile(prev => ({ ...prev, fullName: e.target.value }))}
                        disabled={!isEditing}
                        className="bg-input-background border-border focus:border-foreground"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        value={profile.username}
                        onChange={(e) => setProfile(prev => ({ ...prev, username: e.target.value }))}
                        disabled={!isEditing}
                        className="bg-input-background border-border focus:border-foreground"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                        disabled={!isEditing}
                        className="bg-input-background border-border focus:border-foreground"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Account Created</Label>
                      <div className="p-3 bg-muted/50 rounded-md text-sm text-muted-foreground">
                        {profile.joinedDate}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Usage Statistics */}
              <Card className="border-border">
                <CardHeader>
                  <CardTitle>Usage Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 bg-muted/50 rounded-lg text-center">
                      <p className="text-sm text-muted-foreground">Voice Minutes</p>
                      <p className="text-xl font-semibold">{usageStats.voiceMinutes}</p>
                    </div>
                    <div className="p-4 bg-muted/50 rounded-lg text-center">
                      <p className="text-sm text-muted-foreground">Text Messages</p>
                      <p className="text-xl font-semibold">{usageStats.textMessages}</p>
                    </div>
                    <div className="p-4 bg-muted/50 rounded-lg text-center">
                      <p className="text-sm text-muted-foreground">Chess Games</p>
                      <p className="text-xl font-semibold">{usageStats.chessGames}</p>
                    </div>
                    <div className="p-4 bg-muted/50 rounded-lg text-center">
                      <p className="text-sm text-muted-foreground">Events</p>
                      <p className="text-xl font-semibold">{usageStats.schedulerEvents}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security" className="space-y-6">
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="h-5 w-5 mr-2" />
                    Security Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div>
                        <h4 className="font-medium">Change Password</h4>
                        <p className="text-sm text-muted-foreground">Update your account password</p>
                      </div>
                      <Button variant="outline" className="border-border hover:border-foreground">
                        Change
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div>
                        <h4 className="font-medium">Two-Factor Authentication</h4>
                        <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                      </div>
                      <Button variant="outline" className="border-border hover:border-foreground">
                        Enable
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div>
                        <h4 className="font-medium">Login History</h4>
                        <p className="text-sm text-muted-foreground">View recent account activity</p>
                      </div>
                      <Button variant="outline" className="border-border hover:border-foreground">
                        <span>View</span>
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div>
                        <h4 className="font-medium">Download Data</h4>
                        <p className="text-sm text-muted-foreground">Export your account data</p>
                      </div>
                      <Button variant="outline" className="border-border hover:border-foreground">
                        Export
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Subscription Tab */}
            <TabsContent value="subscription" className="space-y-6">
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="h-5 w-5 mr-2" />
                    Subscription & Billing
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="p-6 border border-border rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold">Current Plan</h3>
                      <Badge variant={getPlanBadgeVariant(profile.plan)} className="capitalize">
                        {profile.plan}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground mb-4">
                      {profile.plan === 'free' && 'Enjoy basic features with limited usage.'}
                      {profile.plan === 'pro' && 'Unlock advanced features and increased limits.'}
                      {profile.plan === 'enterprise' && 'Full access to all features and priority support.'}
                    </p>
                    <div className="flex space-x-2">
                      {profile.plan === 'free' && (
                        <Button className="bg-foreground text-background hover:bg-foreground/90">
                          Upgrade to Pro
                        </Button>
                      )}
                      {profile.plan === 'pro' && (
                        <>
                          <Button variant="outline" className="border-border hover:border-foreground">
                            Upgrade to Enterprise
                          </Button>
                          <Button variant="outline" className="border-border hover:border-foreground">
                            Manage Billing
                          </Button>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Billing History</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                        <span className="text-sm">Pro Plan - March 2024</span>
                        <span className="text-sm font-medium">$19.99</span>
                      </div>
                      <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                        <span className="text-sm">Pro Plan - February 2024</span>
                        <span className="text-sm font-medium">$19.99</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Preferences Tab */}
            <TabsContent value="preferences" className="space-y-6">
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Bell className="h-5 w-5 mr-2" />
                    Notification Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Email Updates</h4>
                        <p className="text-sm text-muted-foreground">Receive product updates and news</p>
                      </div>
                      <Switch
                        checked={notifications.emailUpdates}
                        onCheckedChange={() => handleNotificationChange('emailUpdates')}
                      />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Session Reminders</h4>
                        <p className="text-sm text-muted-foreground">Get notified about scheduled sessions</p>
                      </div>
                      <Switch
                        checked={notifications.sessionReminders}
                        onCheckedChange={() => handleNotificationChange('sessionReminders')}
                      />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Weekly Reports</h4>
                        <p className="text-sm text-muted-foreground">Summary of your weekly activity</p>
                      </div>
                      <Switch
                        checked={notifications.weeklyReports}
                        onCheckedChange={() => handleNotificationChange('weeklyReports')}
                      />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Security Alerts</h4>
                        <p className="text-sm text-muted-foreground">Important security notifications</p>
                      </div>
                      <Switch
                        checked={notifications.securityAlerts}
                        onCheckedChange={() => handleNotificationChange('securityAlerts')}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Settings className="h-5 w-5 mr-2" />
                    App Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div>
                      <h4 className="font-medium">Default Theme</h4>
                      <p className="text-sm text-muted-foreground">Choose your preferred theme</p>
                    </div>
                    <Button variant="outline" className="border-border hover:border-foreground">
                      System
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div>
                      <h4 className="font-medium">Language</h4>
                      <p className="text-sm text-muted-foreground">Choose your language preference</p>
                    </div>
                    <Button variant="outline" className="border-border hover:border-foreground">
                      English
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};