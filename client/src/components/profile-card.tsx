
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, User, Calendar, UserCheck, UserX, Briefcase, Ruler } from "lucide-react";
import { Profile } from "@shared/schema";

interface ProfileCardProps {
  profile: Profile;
  onDownload?: (profile: Profile) => void;
  onClick?: (profile: Profile) => void;
}

export function ProfileCard({ profile, onDownload, onClick }: ProfileCardProps) {
  const handleDownload = (e: React.MouseEvent) => {
    try {
      e.stopPropagation(); // Prevent card click when downloading
      if (profile?.document && onDownload) {
        onDownload(profile);
      }
    } catch (error) {
      console.error("Error in ProfileCard download:", error);
    }
  };

  const handleCardClick = () => {
    try {
      if (onClick && profile) {
        onClick(profile);
      }
    } catch (error) {
      console.error("Error in ProfileCard click:", error);
    }
  };

  // Safety check - don't render if profile is invalid
  if (!profile || !profile.id) {
    return null;
  }

  return (
    <Card 
      className="group relative cursor-pointer overflow-hidden bg-white border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] animate-fade-in rounded-xl"
      onClick={handleCardClick}
    >
      <CardContent className="p-0 h-full">
        <div className="flex h-full">
          {/* Left Side - Profile Picture */}
          <div className="w-36 h-36 flex-shrink-0 relative overflow-hidden">
            {profile.profilePicture ? (
              <img
                src={profile.profilePicture}
                alt={profile.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                <User className="w-14 h-14 text-gray-400" />
              </div>
            )}
          </div>
          
          {/* Right Side - Details */}
          <div className="flex-1 p-5 relative bg-gradient-to-br from-white to-gray-50">
            <h3 className="text-xl font-bold text-gray-800 mb-4 truncate group-hover:text-blue-600 transition-colors duration-300">
              {profile.name}
            </h3>
            
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-center">
                {profile.gender === "Male" ? (
                  <UserCheck className="w-4 h-4 mr-3 flex-shrink-0 text-blue-500" />
                ) : (
                  <UserX className="w-4 h-4 mr-3 flex-shrink-0 text-pink-500" />
                )}
                <span className="font-semibold text-gray-700">{profile.gender}</span>
              </div>
              
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-3 flex-shrink-0 text-gray-500" />
                <span className="font-medium">{profile.age} years old</span>
              </div>
              
              {profile.profession && (
                <div className="flex items-center">
                  <Briefcase className="w-4 h-4 mr-3 flex-shrink-0 text-gray-500" />
                  <span className="truncate font-medium">{profile.profession}</span>
                </div>
              )}
              
              <div className="flex items-center">
                <Ruler className="w-4 h-4 mr-3 flex-shrink-0 text-gray-500" />
                <span className="font-medium">{profile.height}</span>
              </div>
            </div>
            
            {/* Bottom-right Download Button */}
            {profile.document && (
              <div className="absolute bottom-4 right-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownload}
                  className="h-10 w-10 p-0 rounded-full shadow-md hover:shadow-lg bg-white/90 backdrop-blur-sm border-gray-200 hover:bg-blue-50 hover:border-blue-200 transition-all duration-300"
                  title="Download Document"
                >
                  <Download className="w-4 h-4 text-gray-600 hover:text-blue-600" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
