import { useState } from "react";
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
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setForm] = useState({
    name: currentUser?.name ?? "",
    bio: currentUser?.bio ?? "",
    location: currentUser?.location ?? "Hong Kong",
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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-2xl px-4 py-8">
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
          {/* Cover / Header */}
          <div className="h-32 bg-primary/10 relative">
            <div className="absolute -bottom-12 left-8">
              <div 
                className="w-24 h-24 rounded-2xl border-4 border-card flex items-center justify-center text-white text-3xl font-bold shadow-lg"
                style={{ background: currentUser.avatarColor }}
              >
                {currentUser.avatarInitials}
              </div>
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
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Calendar size={18} className="text-primary" />
                    <span className="text-sm">Joined {new Date(currentUser.createdAt).toLocaleDateString('en-HK', { month: 'long', year: 'numeric' })}</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="pt-6 border-t border-border grid grid-cols-2 gap-4">
                  <div className="bg-background rounded-xl p-4 border border-border">
                    <div className="flex items-center gap-2 mb-1">
                      <Award size={16} className="text-primary" />
                      <span className="text-xs font-semibold text-muted-foreground uppercase">Runs Completed</span>
                    </div>
                    <p className="text-2xl font-display font-bold text-foreground">{currentUser.totalRuns}</p>
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
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
