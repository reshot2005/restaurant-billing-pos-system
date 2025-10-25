import React, { useState } from 'react';
import { useAuth } from '../Auth/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { User, Mail, Shield, Edit, Save, X } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export function MyAccount() {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(user?.display_name || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar || '');
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await updateProfile(displayName, avatarUrl);
      toast.success('Profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setDisplayName(user?.display_name || '');
    setAvatarUrl(user?.avatar || '');
    setIsEditing(false);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'owner':
        return 'bg-gradient-to-r from-purple-500 to-pink-500';
      case 'manager':
        return 'bg-gradient-to-r from-blue-500 to-cyan-500';
      case 'cashier':
        return 'bg-gradient-to-r from-green-500 to-emerald-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getRoleIcon = (role: string) => {
    return <Shield className="w-3 h-3" />;
  };

  if (!user) {
    return null;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-2">My Account</h1>
          <p className="text-gray-600">Manage your profile and account settings</p>
        </div>
      </div>

      <Card className="backdrop-blur-xl bg-white/80 border-white/40 shadow-xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal details</CardDescription>
            </div>
            {!isEditing && (
              <Button
                onClick={() => setIsEditing(true)}
                variant="outline"
                className="backdrop-blur-sm bg-white/50"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-6">
            <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
              <AvatarImage src={avatarUrl} alt={displayName} />
              <AvatarFallback className="bg-gradient-to-br from-sky-400 to-blue-500 text-white text-2xl">
                {displayName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-2xl">{user.display_name}</h3>
                <Badge className={`${getRoleColor(user.role)} text-white border-0`}>
                  {getRoleIcon(user.role)}
                  <span className="ml-1 capitalize">{user.role}</span>
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <User className="w-4 h-4" />
                <span>@{user.username}</span>
              </div>
            </div>
          </div>

          {isEditing ? (
            <div className="space-y-4 pt-4 border-t">
              <div className="space-y-2">
                <Label htmlFor="displayName">Display Name</Label>
                <Input
                  id="displayName"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Enter your display name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="avatar">Avatar URL</Label>
                <Input
                  id="avatar"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="Enter avatar image URL"
                />
                <p className="text-sm text-gray-500">
                  Paste a URL to your avatar image or leave empty for default
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleSave}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button
                  onClick={handleCancel}
                  variant="outline"
                  disabled={isLoading}
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
              <div className="space-y-1">
                <Label className="text-gray-500">Username</Label>
                <p className="text-lg">@{user.username}</p>
              </div>
              <div className="space-y-1">
                <Label className="text-gray-500">Role</Label>
                <p className="text-lg capitalize">{user.role}</p>
              </div>
              <div className="space-y-1">
                <Label className="text-gray-500">Display Name</Label>
                <p className="text-lg">{user.display_name}</p>
              </div>
              <div className="space-y-1">
                <Label className="text-gray-500">User ID</Label>
                <p className="text-sm font-mono text-gray-600">{user.id}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="backdrop-blur-xl bg-white/80 border-white/40 shadow-xl">
        <CardHeader>
          <CardTitle>Permissions</CardTitle>
          <CardDescription>Your role-based access permissions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {user.role === 'owner' && (
              <>
                <PermissionItem enabled text="Full system access" />
                <PermissionItem enabled text="Inventory management (Create, Edit, Delete)" />
                <PermissionItem enabled text="User & role management" />
                <PermissionItem enabled text="Settings configuration" />
                <PermissionItem enabled text="All billing operations" />
                <PermissionItem enabled text="Analytics & reports" />
              </>
            )}
            {user.role === 'manager' && (
              <>
                <PermissionItem enabled text="Inventory management (Create, Edit)" />
                <PermissionItem enabled text="View parked orders" />
                <PermissionItem enabled text="Process payments" />
                <PermissionItem enabled text="All billing operations" />
                <PermissionItem enabled text="Analytics & reports" />
                <PermissionItem enabled={false} text="User management" />
                <PermissionItem enabled={false} text="Settings configuration" />
              </>
            )}
            {user.role === 'cashier' && (
              <>
                <PermissionItem enabled text="Create orders" />
                <PermissionItem enabled text="Apply discounts" />
                <PermissionItem enabled text="Split bills" />
                <PermissionItem enabled text="Process payments" />
                <PermissionItem enabled text="Park/resume orders" />
                <PermissionItem enabled={false} text="Inventory management" />
                <PermissionItem enabled={false} text="User management" />
                <PermissionItem enabled={false} text="Settings configuration" />
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function PermissionItem({ enabled, text }: { enabled: boolean; text: string }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-white/50">
      <div className={`w-2 h-2 rounded-full ${enabled ? 'bg-green-500' : 'bg-gray-300'}`} />
      <span className={enabled ? 'text-gray-900' : 'text-gray-400'}>{text}</span>
    </div>
  );
}
