
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, User, Calendar, UserCheck, UserX, Briefcase, Ruler, X } from "lucide-react";
import { Profile } from "@shared/schema";

interface ProfileDetailModalProps {
  profile: Profile | null;
  isOpen: boolean;
  onClose: () => void;
  onDownload?: (profile: Profile) => void;
}

export function ProfileDetailModal({ profile, isOpen, onClose, onDownload }: ProfileDetailModalProps) {
  if (!profile || !profile.id) return null;

  const handleDownload = () => {
    try {
      if (profile?.document && onDownload) {
        onDownload(profile);
      }
    } catch (error) {
      console.error("Error in ProfileDetailModal download:", error);
    }
  };

  const handleClose = () => {
    try {
      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error("Error closing ProfileDetailModal:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl bg-white/95 backdrop-blur-xl border-0 shadow-2xl animate-modal-in rounded-2xl overflow-hidden">
        {/* Glassmorphism background */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/40 to-blue-50/60 backdrop-blur-2xl -z-10" />
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/20 to-transparent -z-10" />
        
        <DialogHeader className="relative pb-6 border-b border-white/30">
          <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent text-center">
            Profile Details
          </DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="absolute -top-2 -right-2 h-10 w-10 p-0 hover:bg-white/80 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl backdrop-blur-sm"
          >
            <X className="w-5 h-5 text-gray-600" />
          </Button>
        </DialogHeader>
        
        <div className="space-y-8 pt-6">
          {/* Profile Picture Section */}
          <div className="flex justify-center">
            <div className="relative group">
              <div className="w-48 h-48 rounded-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 shadow-2xl ring-4 ring-white/70 transition-all duration-500 hover:ring-8 hover:ring-blue-200/50">
                {profile.profilePicture ? (
                  <img
                    src={profile.profilePicture}
                    alt={profile.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                    <User className="w-24 h-24 text-gray-400" />
                  </div>
                )}
              </div>
              <div className="absolute inset-0 rounded-full bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </div>

          {/* Profile Information */}
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-fade-in">
                {profile.name}
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Personal Information Card */}
              <div className="group relative bg-gradient-to-br from-blue-50/80 to-indigo-50/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-blue-100/50 hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-100/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="relative space-y-6">
                  <div className="flex items-center space-x-5">
                    <div className="p-4 bg-blue-100/80 rounded-full shadow-md group-hover:shadow-lg transition-shadow duration-300">
                      <Calendar className="w-7 h-7 text-blue-600" />
                    </div>
                    <div>
                      <span className="text-sm text-blue-600 font-semibold uppercase tracking-wide">Age</span>
                      <p className="text-2xl font-bold text-gray-800">{profile.age} years</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-5">
                    <div className="p-4 bg-blue-100/80 rounded-full shadow-md group-hover:shadow-lg transition-shadow duration-300">
                      {profile.gender === "Male" ? (
                        <UserCheck className="w-7 h-7 text-blue-600" />
                      ) : (
                        <UserX className="w-7 h-7 text-pink-500" />
                      )}
                    </div>
                    <div>
                      <span className="text-sm text-blue-600 font-semibold uppercase tracking-wide">Gender</span>
                      <p className="text-2xl font-bold text-gray-800">{profile.gender}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Professional Information Card */}
              <div className="group relative bg-gradient-to-br from-purple-50/80 to-pink-50/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-purple-100/50 hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-100/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="relative space-y-6">
                  {profile.profession && (
                    <div className="flex items-center space-x-5">
                      <div className="p-4 bg-purple-100/80 rounded-full shadow-md group-hover:shadow-lg transition-shadow duration-300">
                        <Briefcase className="w-7 h-7 text-purple-600" />
                      </div>
                      <div>
                        <span className="text-sm text-purple-600 font-semibold uppercase tracking-wide">Profession</span>
                        <p className="text-2xl font-bold text-gray-800">{profile.profession}</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-5">
                    <div className="p-4 bg-purple-100/80 rounded-full shadow-md group-hover:shadow-lg transition-shadow duration-300">
                      <Ruler className="w-7 h-7 text-purple-600" />
                    </div>
                    <div>
                      <span className="text-sm text-purple-600 font-semibold uppercase tracking-wide">Height</span>
                      <p className="text-2xl font-bold text-gray-800">{profile.height}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-6 pt-8 border-t border-white/30">
            {profile.document && (
              <Button
                onClick={handleDownload}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-4 text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 rounded-full"
              >
                <Download className="w-5 h-5 mr-2" />
                <span>Download Document</span>
              </Button>
            )}
            
            <Button
              variant="outline"
              onClick={handleClose}
              className="bg-white/80 backdrop-blur-sm border-2 border-gray-300 hover:bg-white hover:border-gray-400 text-gray-700 font-semibold px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 rounded-full"
            >
              <span>Close</span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
