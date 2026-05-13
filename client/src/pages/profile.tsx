import { useState, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import { useAuth } from "@/context/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  User as UserIcon, MapPin, Calendar, Mail, 
  Edit2, Save, X, Camera, Award, Star
} from "lucide-react";

export default function ProfilePage() {
  const { user: currentUser, refetch } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [formData, setForm] = useState({
    name: currentUser?.name ?? "",
    bio: currentUser?.bio ?? "",
    location: currentUser?.location ?? "Hong Kong",
    gender: currentUser?.gender ?? "",
    profilePictureUrl: currentUser?.profilePictureUrl ?? "",
    runningSince: currentUser?.runningSince?.toString() ?? "",
    preferredPace: currentUser?.preferredPace ?? "",
    personalRecords: currentUser?.personalRecords ?? [],
    preferredTypes: currentUser?.preferredTypes ?? [],
  });

  const updateMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const res = await apiRequest("PATCH", `/api/users/${currentUser?.id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      refetch();
      setIsEditing(false);
      setPreviewUrl(null);
      toast({ title: "Profile updated", description: "Your changes have been saved." });
    },
    onError: (e: any) => {
      toast({ title: "Update failed", description: e.message, variant: "destructive" });
    },
  });

  if (!currentUser) return null;

  const handleSave = () => {
    if (!formData.name.trim()) {
      toast({ title: "Error", description: "Name is required", variant: "destructive" });
      return;
    }
    updateMutation.mutate(formData);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({ title: "Error", description: "File size must be less than 5MB", variant: "destructive" });
        return;
      }
      if (!file.type.startsWith("image/")) {
        toast({ title: "Error", description: "Please upload an image file", variant: "destructive" });
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        setPreviewUrl(dataUrl);
        setForm(f => ({ ...f, profilePictureUrl: dataUrl }));
      };
      reader.readAsDataURL(file);
    }
  };

  const displayProfilePicture = previewUrl || formData.profilePictureUrl || currentUser.profilePictureUrl;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-2xl px-4 py-8">
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
          {/* Cover / Header */}
          <div className="h-32 bg-primary/10 relative">
            <div className="absolute -bottom-12 left-8">
              {isEditing ? (
                <div className="relative w-24 h-24">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 w-24 h-24 rounded-2xl border-4 border-card flex items-center justify-center text-white text-3xl font-bold shadow-lg hover:opacity-80 transition-opacity cursor-pointer group"
                    style={{ background: currentUser.avatarColor }}
                  >
                    {displayProfilePicture ? (
                      <img 
                        src={displayProfilePicture} 
                        alt="Profile" 
                        className="w-full h-full rounded-2xl object-cover"
                      />
                    ) : (
                      currentUser.avatarInitials
                    )}
                    <div className="absolute inset-0 rounded-2xl bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Camera size={16} className="text-white" />
                    </div>
                  </button>
                </div>
              ) : (
                <div 
                  className="w-24 h-24 rounded-2xl border-4 border-card flex items-center justify-center text-white text-3xl font-bold shadow-lg"
                  style={{ background: currentUser.avatarColor }}
                >
                  {displayProfilePicture ? (
                    <img 
                      src={displayProfilePicture} 
                      alt="Profile" 
                      className="w-full h-full rounded-2xl object-cover"
                    />
                  ) : (
                    currentUser.avatarInitials
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Profile Content */}
          <div className="pt-16 px-8 pb-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-2xl font-display font-bold text-foreground">
                  {currentUser.name}
                </h1>
                <p className="text-muted-foreground">@{currentUser.handle}</p>
              </div>
              {!isEditing ? (
                <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} className="gap-2">
                  <Edit2 size={14} />
                  Edit Profile
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button size="sm" onClick={handleSave} disabled={updateMutation.isPending}>
                    <Save size={14} className="mr-2" />
                    Save
                  </Button>
                </div>
              )}
            </div>

            {isEditing ? (
              <div className="space-y-4 max-w-md">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase mb-1 block">Full Name</label>
                  <Input 
                    value={formData.name} 
                    onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase mb-1 block">Location</label>
                  <Input 
                    value={formData.location} 
                    onChange={(e) => setForm(f => ({ ...f, location: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase mb-1 block">Gender</label>
                  <select 
                    value={formData.gender} 
                    onChange={(e) => setForm(f => ({ ...f, gender: e.target.value }))}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                  >
                    <option value="">Select gender (optional)</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="prefer-not-to-say">Prefer not to say</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase mb-1 block">Running Since (Year)</label>
                  <Input 
                    type="number"
                    min="1990"
                    max={new Date().getFullYear()}
                    value={formData.runningSince} 
                    onChange={(e) => setForm(f => ({ ...f, runningSince: e.target.value }))}
                    placeholder="e.g. 2020"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase mb-1 block">Preferred Pace</label>
                  <Input 
                    value={formData.preferredPace} 
                    onChange={(e) => setForm(f => ({ ...f, preferredPace: e.target.value }))}
                    placeholder="e.g. 6:30/km"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase mb-1 block">Preferred Run Types</label>
                  <div className="space-y-2">
                    {["Trail", "Road", "Track", "Fun Run", "Recovery"].map((type) => (
                      <label key={type} className="flex items-center gap-2">
                        <input 
                          type="checkbox"
                          checked={formData.preferredTypes.includes(type)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setForm(f => ({ ...f, preferredTypes: [...f.preferredTypes, type] }));
                            } else {
                              setForm(f => ({ ...f, preferredTypes: f.preferredTypes.filter(t => t !== type) }));
                            }
                          }}
                          className="w-4 h-4"
                        />
                        <span className="text-sm">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase mb-1 block">Bio</label>
                  <Textarea 
                    value={formData.bio} 
                    rows={4}
                    onChange={(e) => setForm(f => ({ ...f, bio: e.target.value }))}
                    placeholder="Tell us about your running journey..."
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {currentUser.bio && (
                  <p className="text-foreground leading-relaxed italic text-lg">
                    "{currentUser.bio}"
                  </p>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <MapPin size={18} className="text-primary" />
                    <span className="text-sm">{currentUser.location}</span>
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Mail size={18} className="text-primary" />
                    <span className="text-sm">{currentUser.email}</span>
                  </div>
                  {currentUser.gender && (
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <UserIcon size={18} className="text-primary" />
                      <span className="text-sm capitalize">
                        {currentUser.gender.replace(/-/g, ' ')}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Calendar size={18} className="text-primary" />
                    <span className="text-sm">Joined {new Date(currentUser.createdAt).toLocaleDateString('en-HK', { month: 'long', year: 'numeric' })}</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="pt-6 border-t border-border grid grid-cols-2 gap-4 md:grid-cols-4">
                  <div className="bg-background rounded-xl p-4 border border-border">
                    <div className="flex items-center gap-2 mb-1">
                      <Award size={16} className="text-primary" />
                      <span className="text-xs font-semibold text-muted-foreground uppercase">Runs Joined</span>
                    </div>
                    <p className="text-2xl font-display font-bold text-foreground">{currentUser.totalRuns}</p>
                  </div>
                  <div className="bg-background rounded-xl p-4 border border-border">
                    <div className="flex items-center gap-2 mb-1">
                      <Award size={16} className="text-primary" />
                      <span className="text-xs font-semibold text-muted-foreground uppercase">Runs Hosted</span>
                    </div>
                    <p className="text-2xl font-display font-bold text-foreground">{currentUser.totalHosted}</p>
                  </div>
                  <div className="bg-background rounded-xl p-4 border border-border">
                    <div className="flex items-center gap-2 mb-1">
                      <Award size={16} className="text-primary" />
                      <span className="text-xs font-semibold text-muted-foreground uppercase">RSVPs</span>
                    </div>
                    <p className="text-2xl font-display font-bold text-foreground">{currentUser.totalRsvps}</p>
                  </div>
                  <div className="bg-background rounded-xl p-4 border border-border">
                    <div className="flex items-center gap-2 mb-1">
                      <Star size={16} className="text-amber-400 fill-amber-400" />
                      <span className="text-xs font-semibold text-muted-foreground uppercase">Avg Rating</span>
                    </div>
                    <p className="text-2xl font-display font-bold text-foreground">
                      {currentUser.avgRating ? currentUser.avgRating.toFixed(1) : "—"}
                    </p>
                  </div>
                </div>

                {/* Running Stats */}
                <div className="pt-6 border-t border-border">
                  <h3 className="font-semibold text-foreground mb-4">Running Stats</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {currentUser.runningSince && (
                      <div className="bg-background rounded-xl p-4 border border-border">
                        <span className="text-xs font-semibold text-muted-foreground uppercase">Running Since</span>
                        <p className="text-lg font-display font-bold text-foreground mt-1">{currentUser.runningSince}</p>
                      </div>
                    )}
                    {currentUser.preferredPace && (
                      <div className="bg-background rounded-xl p-4 border border-border">
                        <span className="text-xs font-semibold text-muted-foreground uppercase">Preferred Pace</span>
                        <p className="text-lg font-display font-bold text-foreground mt-1">{currentUser.preferredPace}</p>
                      </div>
                    )}
                    {currentUser.preferredTypes && currentUser.preferredTypes.length > 0 && (
                      <div className="bg-background rounded-xl p-4 border border-border sm:col-span-2">
                        <span className="text-xs font-semibold text-muted-foreground uppercase">Preferred Run Types</span>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {currentUser.preferredTypes.map((type) => (
                            <span key={type} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                              {type}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
