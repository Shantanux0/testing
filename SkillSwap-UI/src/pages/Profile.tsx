import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { useAuth } from "@/contexts/AuthContext";
import { profileApi, skillsApi, UserProfile, SkillLevel } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Plus, Trash2, Edit2, Save, X, User, Mail, MapPin, Calendar, Globe, Linkedin, Github } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Profile = () => {
  const { profile: authProfile, refreshProfile } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(authProfile);
  const [skills, setSkills] = useState<SkillLevel[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [skillDialogOpen, setSkillDialogOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<SkillLevel | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [profileData, skillsData] = await Promise.all([
        profileApi.getProfile().catch(() => null),
        skillsApi.getSkills().catch(() => []),
      ]);
      if (profileData) setProfile(profileData);
      setSkills(skillsData);
    } catch (error) {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);
    try {
      const updateData = {
        firstName: profile.firstName,
        lastName: profile.lastName,
        bio: profile.bio,
        profileImageUrl: profile.profileImageUrl,
        dateOfBirth: profile.dateOfBirth,
        phoneNumber: profile.phoneNumber,
        location: profile.location,
        website: profile.website,
        linkedinUrl: profile.linkedinUrl,
        githubUrl: profile.githubUrl,
        skills: profile.skills,
        interests: profile.interests,
        skillsToLearn: profile.skillsToLearn,
        timezone: profile.timezone,
        hoursPerWeek: profile.hoursPerWeek,
        availabilitySchedule: profile.availabilitySchedule,
        learningGoal: profile.learningGoal,
        goalTimeline: profile.goalTimeline,
        teachingMotivation: profile.teachingMotivation,
        teachingApproach: profile.teachingApproach,
        preferredLearningMethod: profile.preferredLearningMethod,
        communicationPace: profile.communicationPace,
        preferredLanguage: profile.preferredLanguage,
        domainFocus: profile.domainFocus,
      };

      if (profile.id) {
        await profileApi.updateProfile(updateData);
      } else {
        await profileApi.createProfile(updateData);
      }
      await refreshProfile();
      await loadData();
      setEditing(false);
      toast.success("Profile updated successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  const handleAddSkill = async (skill: SkillLevel) => {
    try {
      await skillsApi.addOrUpdateSkill(skill);
      await loadData();
      setSkillDialogOpen(false);
      setEditingSkill(null);
      toast.success("Skill added successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to add skill");
    }
  };

  const handleDeleteSkill = async (skillName: string) => {
    try {
      await skillsApi.deleteSkill(skillName);
      await loadData();
      toast.success("Skill deleted successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete skill");
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="p-6 lg:p-8 max-w-7xl mx-auto">
          <div className="text-center">Loading profile...</div>
        </div>
      </MainLayout>
    );
  }

  if (!profile) {
    return (
      <MainLayout>
        <div className="p-6 lg:p-8 max-w-7xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Create Your Profile</CardTitle>
              <CardDescription>Get started by creating your profile</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => {
                setProfile({
                  email: authProfile?.email || "",
                  firstName: "",
                  lastName: "",
                  bio: "",
                } as UserProfile);
                setEditing(true);
              }}>Create Profile</Button>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  // 3-Step Wizard Logic

  const handleNext = async () => {
    // Validate current step here if needed
    if (currentStep < totalSteps) {
      setCurrentStep(c => c + 1);
    } else {
      handleSave(); // Final save
    }
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(c => c - 1);
  };

  // Render specific step content
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-purple-200 rounded-2xl bg-purple-50/50">
              <div className="w-24 h-24 rounded-full bg-purple-100 flex items-center justify-center mb-4 text-4xl">
                👤
              </div>
              <Button variant="outline" className="border-purple-200 text-purple-700 bg-white">
                Upload Photo
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>First Name</Label>
                <Input
                  value={profile?.firstName || ""}
                  onChange={(e) => setProfile(p => p ? { ...p, firstName: e.target.value } : null)}
                  placeholder="e.g. Alex"
                />
              </div>
              <div className="space-y-2">
                <Label>Last Name</Label>
                <Input
                  value={profile?.lastName || ""}
                  onChange={(e) => setProfile(p => p ? { ...p, lastName: e.target.value } : null)}
                  placeholder="e.g. Chen"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Professional Headline</Label>
              <Input
                value={profile?.teachingApproach || ""} // Using flexible field
                onChange={(e) => setProfile(p => p ? { ...p, teachingApproach: e.target.value } : null)}
                placeholder="e.g. Python Enthusiast | Aspiring Designer"
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Bio</Label>
              <Textarea
                rows={6}
                value={profile?.bio || ""}
                onChange={(e) => setProfile(p => p ? { ...p, bio: e.target.value } : null)}
                placeholder="Tell the community about your journey..."
                className="rounded-xl resize-none"
              />
              <p className="text-xs text-muted-foreground text-right">{profile?.bio?.length || 0}/300</p>
            </div>
            <div className="space-y-2">
              <Label>Communication Pace</Label>
              <Select
                value={profile?.communicationPace || "Moderate"}
                onValueChange={(value) => setProfile(p => p ? { ...p, communicationPace: value } : null)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select pace" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Slow">Relaxed / Slow</SelectItem>
                  <SelectItem value="Moderate">Moderate / Steady</SelectItem>
                  <SelectItem value="Fast">Fast-paced / Intense</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6 text-center">
            <div className="py-8">
              <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-4xl">🚀</span>
              </div>
              <h3 className="text-xl font-bold">Ready to Launch!</h3>
              <p className="text-muted-foreground max-w-sm mx-auto mt-2">
                Your profile looks great. Click finish to save your details and start swapping.
              </p>
              <div className="mt-8 p-4 bg-muted/30 rounded-xl max-w-sm mx-auto">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-green-500">✓</span> <span>Basic Info</span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-green-500">✓</span> <span>Bio & Intro</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> <span>Skills Setup</span>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  }

  return (
    <MainLayout>
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl shadow-xl border-t-4 border-t-purple-600">
          <CardHeader className="text-center pb-2">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm font-medium text-muted-foreground">step {currentStep} of {totalSteps}</div>
              <div className="text-sm font-bold text-purple-600">{Math.round((currentStep / totalSteps) * 100)}% Complete</div>
            </div>
            {/* Progress Bar */}
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mb-6">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-green-400 transition-all duration-500 ease-out"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              />
            </div>

            <CardTitle className="text-2xl font-bold">
              {currentStep === 1 && "Start with the Basics"}
              {currentStep === 2 && "Tell Us Your Story"}
              {currentStep === 3 && "Review & Finish"}
            </CardTitle>
            <CardDescription>
              {currentStep === 1 && "Let's put a face to the name."}
              {currentStep === 2 && "Help others get to know you better."}
              {currentStep === 3 && "You're all set to go!"}
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-6">
            {renderStep()}

            <div className="flex items-center justify-between mt-8 pt-6 border-t">
              <Button
                variant="ghost"
                onClick={handleBack}
                disabled={currentStep === 1 || saving}
              >
                Back
              </Button>
              <Button
                onClick={handleNext}
                disabled={saving}
                className="bg-purple-600 hover:bg-purple-700 text-white min-w-[120px]"
              >
                {saving ? "Saving..." : (currentStep === totalSteps ? "Finish Profile" : "Next Step")}
                {currentStep !== totalSteps && !saving && <span className="ml-2">→</span>}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

interface SkillFormProps {
  skill: SkillLevel | null;
  onSubmit: (skill: SkillLevel) => void;
  onCancel: () => void;
}

const SkillForm = ({ skill, onSubmit, onCancel }: SkillFormProps) => {
  const [skillName, setSkillName] = useState(skill?.skillName || "");
  const [proficiencyLevel, setProficiencyLevel] = useState(
    skill?.proficiencyLevel || "BEGINNER"
  );
  const [yearsOfExperience, setYearsOfExperience] = useState(
    skill?.yearsOfExperience?.toString() || ""
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      skillName,
      proficiencyLevel: proficiencyLevel as any,
      yearsOfExperience: yearsOfExperience ? parseInt(yearsOfExperience) : undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="skillName">Skill Name</Label>
        <Input
          id="skillName"
          value={skillName}
          onChange={(e) => setSkillName(e.target.value)}
          required
          placeholder="e.g., React, Python, Java"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="proficiencyLevel">Proficiency Level</Label>
        <Select value={proficiencyLevel} onValueChange={setProficiencyLevel}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="BEGINNER">Beginner</SelectItem>
            <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
            <SelectItem value="ADVANCED">Advanced</SelectItem>
            <SelectItem value="EXPERT">Expert</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="yearsOfExperience">Years of Experience (Optional)</Label>
        <Input
          id="yearsOfExperience"
          type="number"
          min="0"
          value={yearsOfExperience}
          onChange={(e) => setYearsOfExperience(e.target.value)}
          placeholder="e.g., 3"
        />
      </div>
      <div className="flex gap-2">
        <Button type="submit">Save</Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default Profile;

