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
      <DialogContent className="max-w-2xl bg-white/95 backdrop-blur-md border-0 shadow-2xl animate-in fade-in-50 zoom-in-95 duration-300">
        <DialogHeader className="relative">
          <DialogTitle className="text-2xl font-bold text-gray-800 text-center">
            Profile Details
          </DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute -top-2 -right-2 h-8 w-8 p-0 hover:bg-gray-100 rounded-full"
          >
            <X className="w-4 h-4" />
          </Button>
        </DialogHeader>
        
        <div className="space-y-6 pt-4">
          {/* Profile Picture Section */}
          <div className="flex justify-center">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 shadow-lg">
              {profile.profilePicture ? (
                <img
                  src={profile.profilePicture}
                  alt={profile.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <User className="w-16 h-16 text-gray-400" />
                </div>
              )}
            </div>
          </div>

          {/* Profile Information */}
          <div className="space-y-4">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                {profile.name}
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 mr-3 text-gray-600" />
                  <div>
                    <span className="text-sm text-gray-600">Age</span>
                    <p className="font-semibold text-gray-800">{profile.age} years</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  {profile.gender === "Male" ? (
                    <UserCheck className="w-5 h-5 mr-3 text-blue-500" />
                  ) : (
                    <UserX className="w-5 h-5 mr-3 text-pink-500" />
                  )}
                  <div>
                    <span className="text-sm text-gray-600">Gender</span>
                    <p className="font-semibold text-gray-800">{profile.gender}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                {profile.profession && (
                  <div className="flex items-center">
                    <Briefcase className="w-5 h-5 mr-3 text-gray-600" />
                    <div>
                      <span className="text-sm text-gray-600">Profession</span>
                      <p className="font-semibold text-gray-800">{profile.profession}</p>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center">
                  <Ruler className="w-5 h-5 mr-3 text-gray-600" />
                  <div>
                    <span className="text-sm text-gray-600">Height</span>
                    <p className="font-semibold text-gray-800">{profile.height}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4 pt-4 border-t">
            {profile.document && (
              <Button
                onClick={handleDownload}
                className="btn-primary flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Download Document</span>
              </Button>
            )}
            
            <Button
              variant="outline"
              onClick={onClose}
              className="flex items-center space-x-2"
            >
              <span>Close</span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}