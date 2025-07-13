
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
  if (!profile) return null;

  const handleDownload = () => {
    if (profile.document && onDownload) {
      onDownload(profile);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-white/98 backdrop-blur-xl border-0 shadow-2xl animate-in fade-in-0 zoom-in-95 duration-500 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95">
        <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-gray-50/50 rounded-lg -z-10" />
        
        <DialogHeader className="relative pb-4">
          <DialogTitle className="text-3xl font-bold text-gray-800 text-center">
            Profile Details
          </DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute -top-2 -right-2 h-8 w-8 p-0 hover:bg-gray-100/80 rounded-full transition-all duration-200"
          >
            <X className="w-4 h-4" />
          </Button>
        </DialogHeader>
        
        <div className="space-y-8 pt-4">
          {/* Profile Picture Section */}
          <div className="flex justify-center">
            <div className="w-40 h-40 rounded-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 shadow-xl ring-4 ring-white/50">
              {profile.profilePicture ? (
                <img
                  src={profile.profilePicture}
                  alt={profile.name}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                  <User className="w-20 h-20 text-gray-400" />
                </div>
              )}
            </div>
          </div>

          {/* Profile Information */}
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-gray-800 mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {profile.name}
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 space-y-4 shadow-sm border border-blue-100/50">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Calendar className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <span className="text-sm text-blue-600 font-medium">Age</span>
                    <p className="text-xl font-bold text-gray-800">{profile.age} years</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-blue-100 rounded-full">
                    {profile.gender === "Male" ? (
                      <UserCheck className="w-6 h-6 text-blue-600" />
                    ) : (
                      <UserX className="w-6 h-6 text-pink-500" />
                    )}
                  </div>
                  <div>
                    <span className="text-sm text-blue-600 font-medium">Gender</span>
                    <p className="text-xl font-bold text-gray-800">{profile.gender}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 space-y-4 shadow-sm border border-purple-100/50">
                {profile.profession && (
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-purple-100 rounded-full">
                      <Briefcase className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <span className="text-sm text-purple-600 font-medium">Profession</span>
                      <p className="text-xl font-bold text-gray-800">{profile.profession}</p>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-purple-100 rounded-full">
                    <Ruler className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <span className="text-sm text-purple-600 font-medium">Height</span>
                    <p className="text-xl font-bold text-gray-800">{profile.height}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4 pt-6 border-t border-gray-200/50">
            {profile.document && (
              <Button
                onClick={handleDownload}
                className="btn-primary flex items-center space-x-2 px-6 py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Download className="w-5 h-5" />
                <span>Download Document</span>
              </Button>
            )}
            
            <Button
              variant="outline"
              onClick={onClose}
              className="flex items-center space-x-2 px-6 py-3 text-lg border-2 hover:bg-gray-50 transition-all duration-300"
            >
              <span>Close</span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
