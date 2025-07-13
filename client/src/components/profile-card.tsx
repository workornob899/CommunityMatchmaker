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
      className="card-shadow animate-fade-in cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
      onClick={handleCardClick}
    >
      <CardContent className="p-6">
        <div className="flex space-x-4">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
            {profile.profilePicture ? (
              <img
                src={profile.profilePicture}
                alt={profile.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <User className="w-8 h-8 text-gray-400" />
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold text-gray-800 mb-2 truncate">
              {profile.name}
            </h3>
            
            <div className="space-y-1 text-sm text-gray-600">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                <span>Age: {profile.age}</span>
              </div>
              
              <div className="flex items-center">
                {profile.gender === "Male" ? (
                  <UserCheck className="w-4 h-4 mr-2 flex-shrink-0 text-blue-500" />
                ) : (
                  <UserX className="w-4 h-4 mr-2 flex-shrink-0 text-pink-500" />
                )}
                <span>Gender: {profile.gender}</span>
              </div>
              
              {profile.profession && (
                <div className="flex items-center">
                  <Briefcase className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span className="truncate">Profession: {profile.profession}</span>
                </div>
              )}
              
              <div className="flex items-center">
                <Ruler className="w-4 h-4 mr-2 flex-shrink-0" />
                <span>Height: {profile.height}</span>
              </div>
            </div>
          </div>
          
          {profile.document && (
            <div className="flex-shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                className="h-8 w-8 p-0"
                title="Download Document"
              >
                <Download className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
