
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
    e.stopPropagation(); // Prevent card click when downloading
    if (profile.document && onDownload) {
      onDownload(profile);
    }
  };

  const handleCardClick = () => {
    if (onClick) {
      onClick(profile);
    }
  };

  return (
    <Card 
      className="card-shadow animate-fade-in cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-[1.02] bg-white border-0 shadow-md hover:shadow-lg"
      onClick={handleCardClick}
    >
      <CardContent className="p-0">
        <div className="flex">
          {/* Left Side - Profile Picture */}
          <div className="w-32 h-32 flex-shrink-0">
            {profile.profilePicture ? (
              <img
                src={profile.profilePicture}
                alt={profile.name}
                className="w-full h-full object-cover rounded-l-lg"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-l-lg">
                <User className="w-12 h-12 text-gray-400" />
              </div>
            )}
          </div>
          
          {/* Right Side - Details */}
          <div className="flex-1 p-4 relative">
            <h3 className="text-xl font-bold text-gray-800 mb-3 truncate">
              {profile.name}
            </h3>
            
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center">
                {profile.gender === "Male" ? (
                  <UserCheck className="w-4 h-4 mr-2 flex-shrink-0 text-blue-500" />
                ) : (
                  <UserX className="w-4 h-4 mr-2 flex-shrink-0 text-pink-500" />
                )}
                <span className="font-medium">{profile.gender}</span>
              </div>
              
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2 flex-shrink-0 text-gray-500" />
                <span>{profile.age} years old</span>
              </div>
              
              {profile.profession && (
                <div className="flex items-center">
                  <Briefcase className="w-4 h-4 mr-2 flex-shrink-0 text-gray-500" />
                  <span className="truncate">{profile.profession}</span>
                </div>
              )}
              
              <div className="flex items-center">
                <Ruler className="w-4 h-4 mr-2 flex-shrink-0 text-gray-500" />
                <span>{profile.height}</span>
              </div>
            </div>
            
            {/* Bottom-right Download Button */}
            {profile.document && (
              <div className="absolute bottom-3 right-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownload}
                  className="h-8 w-8 p-0 rounded-full shadow-sm hover:shadow-md"
                  title="Download Document"
                >
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
