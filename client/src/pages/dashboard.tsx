import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sidebar } from "@/components/sidebar";
import { ProfileCard } from "@/components/profile-card";
import { MatchingModal } from "@/components/matching-modal";
import { ProfileDetailModal } from "@/components/profile-detail-modal";
import { FileUpload } from "@/components/ui/file-upload";
import { 
  Menu, Plus, Users, UserCheck, UserX, TrendingUp, Activity, 
  Search, Save, Calendar, Briefcase, Ruler, 
  UserPlus, Heart, Settings as SettingsIcon 
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { LOGO_URL, PROFESSION_OPTIONS, HEIGHT_OPTIONS, GENDERS } from "@/lib/constants";
import { Profile } from "@shared/schema";

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [showAddProfile, setShowAddProfile] = useState(false);
  const [showMatching, setShowMatching] = useState(false);
  const [matchingType, setMatchingType] = useState<"bride" | "groom">("bride");
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [searchFilters, setSearchFilters] = useState({
    gender: "",
    profession: "",
    birthYear: "",
    height: "",
    age: "",
    date: "",
  });
  const [newProfile, setNewProfile] = useState({
    name: "",
    age: "",
    gender: "",
    profession: "",
    height: "",
    birthYear: "",
  });
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [document, setDocument] = useState<File | null>(null);
  const [settings, setSettings] = useState({
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const { user, updateEmail, updatePassword, logout } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Queries
  const { data: profiles = [], isLoading: profilesLoading } = useQuery({
    queryKey: ["/api/profiles"],
  });

  const { data: stats } = useQuery({
    queryKey: ["/api/profiles/stats"],
  });

  const { data: searchResults = [], isLoading: searchLoading } = useQuery({
    queryKey: ["/api/profiles/search", searchFilters],
    enabled: Object.values(searchFilters).some(Boolean),
  });

  // Mutations
  const addProfileMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await fetch("/api/profiles", {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Failed to create profile");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/profiles"] });
      queryClient.invalidateQueries({ queryKey: ["/api/profiles/stats"] });
      setShowAddProfile(false);
      setNewProfile({
        name: "",
        age: "",
        gender: "",
        profession: "",
        height: "",
        birthYear: "",
      });
      setProfilePicture(null);
      setDocument(null);
      toast({
        title: "Success",
        description: "Profile added successfully!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateEmailMutation = useMutation({
    mutationFn: updateEmail,
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Email updated successfully!",
      });
      setSettings({ ...settings, email: "" });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update email.",
        variant: "destructive",
      });
    },
  });

  const updatePasswordMutation = useMutation({
    mutationFn: ({ currentPassword, newPassword }: { currentPassword: string; newPassword: string }) =>
      updatePassword(currentPassword, newPassword),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Password updated successfully!",
      });
      setSettings({
        ...settings,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update password.",
        variant: "destructive",
      });
    },
  });

  const handleAddProfile = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newProfile.name || !newProfile.age || !newProfile.gender || !newProfile.height) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData();
    formData.append("name", newProfile.name);
    formData.append("age", newProfile.age);
    formData.append("gender", newProfile.gender);
    formData.append("profession", newProfile.profession || "");
    formData.append("height", newProfile.height);
    formData.append("birthYear", (new Date().getFullYear() - parseInt(newProfile.age)).toString());

    if (profilePicture) {
      formData.append("profilePicture", profilePicture);
    }
    if (document) {
      formData.append("document", document);
    }

    addProfileMutation.mutate(formData);
  };

  const handleSearch = () => {
    queryClient.invalidateQueries({ queryKey: ["/api/profiles/search", searchFilters] });
  };

  const handleDownload = (profile: Profile) => {
    if (profile.document) {
      window.open(profile.document, "_blank");
    }
  };

  const handleProfileClick = (profile: Profile) => {
    setSelectedProfile(profile);
    setIsProfileModalOpen(true);
  };

  const handleEmailUpdate = () => {
    if (!settings.email) {
      toast({
        title: "Missing Information",
        description: "Please enter a new email address.",
        variant: "destructive",
      });
      return;
    }
    updateEmailMutation.mutate(settings.email);
  };

  const handlePasswordUpdate = () => {
    if (!settings.currentPassword || !settings.newPassword || !settings.confirmPassword) {
      toast({
        title: "Missing Information",
        description: "Please fill in all password fields.",
        variant: "destructive",
      });
      return;
    }

    if (settings.newPassword !== settings.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "New password and confirmation do not match.",
        variant: "destructive",
      });
      return;
    }

    updatePasswordMutation.mutate({
      currentPassword: settings.currentPassword,
      newPassword: settings.newPassword,
    });
  };

  const showMatchingModal = (type: "bride" | "groom") => {
    setMatchingType(type);
    setShowMatching(true);
  };

  const displayedProfiles = Object.values(searchFilters).some(Boolean) ? searchResults : profiles;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden"
            >
              <Menu className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-[hsl(225,73%,57%)]">
                Auto Matching System
              </h1>
              <p className="text-sm text-gray-600">Only use company staff</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => setShowAddProfile(true)}
              className="btn-primary"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Profile
            </Button>
            <img src={LOGO_URL} alt="Logo" className="h-10" />
          </div>
        </div>
      </header>

      <div className="flex">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Dashboard Section */}
          {activeSection === "dashboard" && (
            <div className="space-y-8">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="card-shadow animate-fade-in">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-700">Total Profiles</h3>
                        <p className="text-3xl font-bold text-[hsl(225,73%,57%)] animate-counter">
                          {stats?.totalProfiles?.toLocaleString() || "0"}
                        </p>
                      </div>
                      <div className="p-3 bg-[hsl(225,73%,97%)] rounded-full">
                        <Users className="w-6 h-6 text-[hsl(225,73%,57%)]" />
                      </div>
                    </div>
                    <div className="mt-4 flex items-center text-green-600">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      <span className="text-sm">+12% from last month</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="card-shadow animate-fade-in">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-700">Bride Profiles</h3>
                        <p className="text-3xl font-bold text-[hsl(330,100%,71%)] animate-counter">
                          {stats?.brideProfiles?.toLocaleString() || "0"}
                        </p>
                      </div>
                      <div className="p-3 bg-pink-100 rounded-full">
                        <UserX className="w-6 h-6 text-[hsl(330,100%,71%)]" />
                      </div>
                    </div>
                    <div className="mt-4 flex items-center text-green-600">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      <span className="text-sm">+8% from last month</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="card-shadow animate-fade-in">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-700">Groom Profiles</h3>
                        <p className="text-3xl font-bold text-blue-600 animate-counter">
                          {stats?.groomProfiles?.toLocaleString() || "0"}
                        </p>
                      </div>
                      <div className="p-3 bg-blue-100 rounded-full">
                        <UserCheck className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                    <div className="mt-4 flex items-center text-green-600">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      <span className="text-sm">+15% from last month</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Matching System */}
              <Card className="card-shadow">
                <CardHeader>
                  <CardTitle className="text-2xl text-gray-800">
                    Intelligent Matching System
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button
                      onClick={() => showMatchingModal("bride")}
                      className="btn-pink py-6 text-lg"
                    >
                      <UserX className="w-5 h-5 mr-2" />
                      Find Match for Bride
                    </Button>
                    <Button
                      onClick={() => showMatchingModal("groom")}
                      className="btn-primary py-6 text-lg"
                    >
                      <UserCheck className="w-5 h-5 mr-2" />
                      Find Match for Groom
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="card-shadow">
                <CardHeader>
                  <CardTitle className="text-xl text-gray-800">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                      <div className="p-2 bg-green-100 rounded-full mr-4">
                        <UserPlus className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">New profiles being added</p>
                        <p className="text-sm text-gray-600">System active</p>
                      </div>
                    </div>
                    <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                      <div className="p-2 bg-blue-100 rounded-full mr-4">
                        <Heart className="w-5 h-5 text-[hsl(225,73%,57%)]" />
                      </div>
                      <div>
                        <p className="font-medium">Matching system ready</p>
                        <p className="text-sm text-gray-600">Ready to find matches</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Profile Section */}
          {activeSection === "profiles" && (
            <div className="space-y-8">
              {/* Filter Panel */}
              <Card className="card-shadow">
                <CardHeader>
                  <CardTitle className="text-2xl text-gray-800">Filter Profiles</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    <div className="space-y-2">
                      <Label>Date</Label>
                      <Input
                        type="date"
                        value={searchFilters.date}
                        onChange={(e) =>
                          setSearchFilters({ ...searchFilters, date: e.target.value })
                        }
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Gender</Label>
                      <Select
                        value={searchFilters.gender}
                        onValueChange={(value) =>
                          setSearchFilters({ ...searchFilters, gender: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="All" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">All</SelectItem>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Profession</Label>
                      <Input
                        placeholder="Enter profession"
                        value={searchFilters.profession}
                        onChange={(e) =>
                          setSearchFilters({ ...searchFilters, profession: e.target.value })
                        }
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Birth Year</Label>
                      <Input
                        type="number"
                        placeholder="YYYY"
                        value={searchFilters.birthYear}
                        onChange={(e) =>
                          setSearchFilters({ ...searchFilters, birthYear: e.target.value })
                        }
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Height</Label>
                      <Input
                        placeholder="5'6&quot;"
                        value={searchFilters.height}
                        onChange={(e) =>
                          setSearchFilters({ ...searchFilters, height: e.target.value })
                        }
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Age</Label>
                      <Input
                        type="number"
                        placeholder="25"
                        value={searchFilters.age}
                        onChange={(e) =>
                          setSearchFilters({ ...searchFilters, age: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <Button onClick={handleSearch} className="btn-primary" disabled={searchLoading}>
                      <Search className="w-4 h-4 mr-2" />
                      {searchLoading ? "Searching..." : "Search Profiles"}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Profile Grid */}
              {profilesLoading ? (
                <div className="text-center py-8">
                  <Activity className="w-8 h-8 mx-auto mb-4 animate-spin" />
                  <p>Loading profiles...</p>
                </div>
              ) : displayedProfiles.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {displayedProfiles.map((profile: Profile) => (
                    <ProfileCard
                      key={profile.id}
                      profile={profile}
                      onDownload={handleDownload}
                      onClick={handleProfileClick}
                    />
                  ))}
                </div>
              ) : (
                <Card className="text-center py-8">
                  <CardContent>
                    <Users className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">
                      No profiles found
                    </h3>
                    <p className="text-gray-500">
                      {Object.values(searchFilters).some(Boolean)
                        ? "Try adjusting your search filters"
                        : "Add some profiles to get started"}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Settings Section */}
          {activeSection === "settings" && (
            <div className="max-w-2xl">
              <h2 className="text-2xl font-bold text-gray-800 mb-8">Account Settings</h2>
              
              <Card className="card-shadow">
                <CardContent className="p-8">
                  <Tabs defaultValue="email" className="space-y-8">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="email">Email Settings</TabsTrigger>
                      <TabsTrigger value="password">Password Settings</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="email" className="space-y-4">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Current Email</Label>
                          <Input
                            type="email"
                            value={user?.email || ""}
                            disabled
                            className="bg-gray-50"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label>New Email</Label>
                          <Input
                            type="email"
                            placeholder="Enter new email"
                            value={settings.email}
                            onChange={(e) =>
                              setSettings({ ...settings, email: e.target.value })
                            }
                          />
                        </div>
                        
                        <Button
                          onClick={handleEmailUpdate}
                          className="btn-primary"
                          disabled={updateEmailMutation.isPending}
                        >
                          <Save className="w-4 h-4 mr-2" />
                          {updateEmailMutation.isPending ? "Updating..." : "Update Email"}
                        </Button>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="password" className="space-y-4">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Current Password</Label>
                          <Input
                            type="password"
                            placeholder="Enter current password"
                            value={settings.currentPassword}
                            onChange={(e) =>
                              setSettings({ ...settings, currentPassword: e.target.value })
                            }
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label>New Password</Label>
                          <Input
                            type="password"
                            placeholder="Enter new password"
                            value={settings.newPassword}
                            onChange={(e) =>
                              setSettings({ ...settings, newPassword: e.target.value })
                            }
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Confirm New Password</Label>
                          <Input
                            type="password"
                            placeholder="Confirm new password"
                            value={settings.confirmPassword}
                            onChange={(e) =>
                              setSettings({ ...settings, confirmPassword: e.target.value })
                            }
                          />
                        </div>
                        
                        <Button
                          onClick={handlePasswordUpdate}
                          className="btn-primary"
                          disabled={updatePasswordMutation.isPending}
                        >
                          <Save className="w-4 h-4 mr-2" />
                          {updatePasswordMutation.isPending ? "Updating..." : "Update Password"}
                        </Button>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>

      {/* Add Profile Modal */}
      <Dialog open={showAddProfile} onOpenChange={setShowAddProfile}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-800">
              Add New Profile
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleAddProfile} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Name *</Label>
                <Input
                  placeholder="Full name"
                  value={newProfile.name}
                  onChange={(e) =>
                    setNewProfile({ ...newProfile, name: e.target.value })
                  }
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label>Age *</Label>
                <Input
                  type="number"
                  placeholder="Age"
                  min="18"
                  max="80"
                  value={newProfile.age}
                  onChange={(e) =>
                    setNewProfile({ ...newProfile, age: e.target.value })
                  }
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label>Gender *</Label>
                <Select
                  value={newProfile.gender}
                  onValueChange={(value) =>
                    setNewProfile({ ...newProfile, gender: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={GENDERS.MALE}>Male</SelectItem>
                    <SelectItem value={GENDERS.FEMALE}>Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Profession</Label>
                <Select
                  value={newProfile.profession}
                  onValueChange={(value) =>
                    setNewProfile({ ...newProfile, profession: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Profession" />
                  </SelectTrigger>
                  <SelectContent>
                    {PROFESSION_OPTIONS.map((profession) => (
                      <SelectItem key={profession} value={profession}>
                        {profession}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="md:col-span-2 space-y-2">
                <Label>Height *</Label>
                <Select
                  value={newProfile.height}
                  onValueChange={(value) =>
                    setNewProfile({ ...newProfile, height: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Height" />
                  </SelectTrigger>
                  <SelectContent>
                    {HEIGHT_OPTIONS.map((height) => (
                      <SelectItem key={height} value={height}>
                        {height}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Profile Picture</Label>
              <FileUpload
                accept="image/*"
                onFileSelect={setProfilePicture}
                preview
              />
            </div>

            <div className="space-y-2">
              <Label>Document</Label>
              <FileUpload
                accept=".pdf,.doc,.docx"
                onFileSelect={setDocument}
              >
                <div className="p-8">
                  <SettingsIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Upload supporting document (PDF, DOC)</p>
                </div>
              </FileUpload>
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowAddProfile(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="btn-primary"
                disabled={addProfileMutation.isPending}
              >
                <Plus className="w-4 h-4 mr-2" />
                {addProfileMutation.isPending ? "Adding..." : "Add Profile"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Matching Modal */}
      <MatchingModal
        isOpen={showMatching}
        onClose={() => setShowMatching(false)}
        type={matchingType}
      />

      {/* Profile Detail Modal */}
      <ProfileDetailModal
        profile={selectedProfile}
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onDownload={handleDownload}
      />
    </div>
  );
}
