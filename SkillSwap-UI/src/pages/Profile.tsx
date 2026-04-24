import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { profileApi, UserProfile } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Edit2, X, User, Mail, MapPin, Calendar, Globe, Linkedin, Github,
  Clock, Award, Zap, BookOpen, Target, Hash, Phone, Briefcase,
  MessageSquare, Loader2, ArrowLeft, ChevronRight, ChevronLeft, CheckCircle2, AlertTriangle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import AppNavbar from "@/components/layout/AppNavbar";

const Profile = () => {
  const { profile: authProfile, refreshProfile, hasResume } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(authProfile);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const routeAlert = (location.state as any)?.alert;

  // Calculate profile completion percentage
  const calculateCompletion = () => {
    if (!profile) return 0;
    const fields = [
      profile.firstName, profile.lastName, profile.bio, profile.location,
      profile.skills, profile.skillsToLearn, profile.learningGoal,
      profile.timezone, profile.hoursPerWeek
    ];
    const filledFields = fields.filter(f => f && String(f).trim() !== '').length;
    return Math.round((filledFields / fields.length) * 100);
  };

  useEffect(() => {
    loadData();
  }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const profileData = await profileApi.getProfile();
            if (profileData) {
                setProfile(profileData);
            }
        } catch (error: any) {
            // If it's a 404, it just means the profile hasn't been created yet
            if (error?.response?.status !== 404) {
                toast.error("Failed to load profile");
            }
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
        await profileApi.updateProfile(updateData);
      }
      await refreshProfile();
      await loadData();
      setIsEditing(false);
      toast.success("Profile updated successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-10 h-10 animate-spin text-black" />
      </div>
    );
  }

  const renderEditField = (label: string, field: keyof UserProfile, placeholder: string, type = "text", fullWidth = false) => (
    <EditField
      key={field}
      label={label}
      value={profile?.[field] as string}
      onChange={(val) => setProfile(prev => prev ? ({ ...prev, [field]: val }) : null)}
      placeholder={placeholder}
      type={type}
      fullWidth={fullWidth}
    />
  );

  // Compute profile completion
  const isProfileComplete = !!(profile?.firstName && profile?.skills && profile?.skillsToLearn);

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white">
      <AppNavbar />

      {/* Onboarding Warning Banner */}
      {(!isProfileComplete || !hasResume) && (
        <div className="fixed top-14 md:top-16 left-0 right-0 z-[55] bg-amber-50 border-b-2 border-amber-400">
          <div className="max-w-7xl mx-auto px-4 md:px-12 py-3 flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="flex items-center gap-2 text-amber-700 font-bold text-xs md:text-sm shrink-0">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span className="truncate">{routeAlert || "Complete your profile!"}</span>
            </div>
            <div className="flex items-center gap-3 md:gap-4 ml-0 sm:ml-auto text-[9px] md:text-xs font-semibold uppercase tracking-widest overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
              <span className={`flex items-center gap-1 shrink-0 ${isProfileComplete ? 'text-green-600' : 'text-amber-600'}`}>
                {isProfileComplete ? '✓' : '1'} Profile
              </span>
              <ChevronRight className="w-3 h-3 text-gray-400 shrink-0" />
              <span className={`flex items-center gap-1 shrink-0 ${hasResume ? 'text-green-600' : 'text-amber-600'}`}>
                {hasResume ? '✓' : '2'} Resume
              </span>
              <ChevronRight className="w-3 h-3 text-gray-400 shrink-0" />
              <span className="text-gray-400 shrink-0">3 Start</span>
            </div>
            {!hasResume && isProfileComplete && (
              <button
                onClick={() => navigate('/resume')}
                className="w-full sm:w-auto sm:ml-2 px-4 py-2 bg-black text-white text-[10px] uppercase tracking-widest hover:bg-gray-800 transition-colors shrink-0"
              >
                Go to Resume →
              </button>
            )}
          </div>
        </div>
      )}

      <main className="pt-24 pb-12 px-4 md:px-12 max-w-7xl mx-auto" style={{ paddingTop: (!isProfileComplete || !hasResume) ? '7rem' : '' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-12"
        >
          {/* Header Section */}
          <div className="flex flex-col lg:flex-row justify-between items-center lg:items-start border-b border-black/10 pb-12 gap-8 text-center lg:text-left">
            <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center lg:items-start w-full md:w-auto">
              <div className="relative group shrink-0">
                <div className="w-40 h-40 md:w-48 md:h-48 bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center">
                  {profile?.profileImageUrl ? (
                    <img src={profile.profileImageUrl} alt="Profile" className="w-full h-full object-cover grayscale contrast-125" />
                  ) : (
                    <User className="w-20 h-20 text-gray-300" />
                  )}
                </div>
              </div>
              <div className="space-y-4">
                <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter leading-[0.9]">
                  {profile?.firstName} <br className="hidden md:block" />
                  <span className="text-gray-400">{profile?.lastName}</span>
                </h1>
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-[10px] md:text-sm uppercase tracking-widest text-gray-500 font-medium">
                  <span className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {profile?.location || "Location Unknown"}</span>
                  <span className="flex items-center gap-2 text-black font-bold bg-black/5 px-2 py-1"><CheckCircle2 className="w-4 h-4 text-green-600" /> VERIFIED</span>
                </div>
              </div>
            </div>

            <Button
              onClick={() => setIsEditing(true)}
              className="w-full lg:w-auto rounded-none bg-black text-white hover:bg-gray-800 px-10 py-6 uppercase tracking-widest text-xs h-auto shadow-xl"
            >
              <Edit2 className="w-4 h-4 mr-2" /> Edit Dossier
            </Button>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left Column: Stats & Contact */}
            <div className="space-y-12 lg:border-r lg:border-gray-100 lg:pr-12">
              <Section title="Expertise">
                <p className="font-serif text-2xl italic leading-relaxed">
                  {profile?.domainFocus || "No specific domain focus."}
                </p>
              </Section>

              <Section title="Coordinates">
                <div className="space-y-4 font-mono text-sm text-gray-600">
                  <ContactItem icon={Mail} value={profile?.email} href={`mailto:${profile?.email}`} />
                  <ContactItem icon={Globe} value={profile?.website} href={profile?.website} />
                  <ContactItem icon={Linkedin} value="LinkedIn Profile" href={profile?.linkedinUrl} />
                  <ContactItem icon={Github} value="GitHub Profile" href={profile?.githubUrl} />
                </div>
              </Section>

              <Section title="Availability">
                <div className="p-6 bg-gray-50 border border-gray-100 text-center">
                  <div className="text-4xl font-serif font-bold mb-1">{profile?.hoursPerWeek || 0}</div>
                  <div className="text-xs uppercase tracking-widest text-gray-400">Hours / Week</div>
                </div>
              </Section>
            </div>

            {/* Right Column: In-depth */}
            <div className="lg:col-span-2 space-y-12">
              <Section title="Biography">
                <p className="text-lg font-light leading-relaxed text-gray-800">
                  {profile?.bio || "No biography provided yet."}
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {(profile?.interests || "").split(',').filter(tag => tag.trim() !== '').map((tag, i) => (
                    <span key={i} className="px-3 py-1 border border-black/10 text-xs uppercase tracking-widest font-bold hover:bg-black hover:text-white transition-colors cursor-default">
                      {tag.trim()}
                    </span>
                  ))}
                </div>
              </Section>

              <div className="grid md:grid-cols-2 gap-8">
                <Section title="Skills (Current)">
                  <div className="font-serif text-xl">{profile?.skills || "N/A"}</div>
                </Section>
                <Section title="Target Skills">
                  <div className="font-serif text-xl text-gray-600">{profile?.skillsToLearn || "N/A"}</div>
                </Section>
              </div>

              <div className="border-t border-black/10 pt-8 grid lg:grid-cols-2 gap-8 text-center md:text-left">
                <DossierItem label="Learning Style" value={profile?.preferredLearningMethod} />
                <DossierItem label="Communication" value={profile?.communicationPace} />
              </div>
            </div>
          </div>

        </motion.div>
      </main>

      {/* Full Screen Edit Overlay */}
      <AnimatePresence>
        {isEditing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/95 text-white overflow-y-auto"
          >
            <div className="min-h-screen flex flex-col max-w-4xl mx-auto p-6 md:p-12 relative">
              {/* Sticky Header */}
              <div className="sticky top-0 bg-black/95 py-6 z-10 flex flex-col md:flex-row justify-between items-center border-b border-white/10 mb-8 md:mb-12 gap-4">
                <div className="uppercase tracking-[0.2em] text-xs md:text-sm text-gray-400 font-bold">
                  Update Dossier
                </div>
                <div className="flex items-center gap-2 md:gap-4 w-full md:w-auto">
                  <Button
                    variant="ghost"
                    onClick={() => setIsEditing(false)}
                    className="flex-1 md:flex-none text-white hover:text-white/50 uppercase tracking-widest text-[10px] md:text-xs"
                  >
                    Discard <X className="ml-2 w-3 h-3 md:w-4 md:h-4" />
                  </Button>
                  <Button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex-1 md:flex-none bg-white text-black hover:bg-gray-200 rounded-none uppercase tracking-widest text-[10px] md:text-xs h-10 md:h-12 px-6 md:px-8 font-bold"
                  >
                    {saving ? <Loader2 className="animate-spin" /> : "Save Dossier"}
                  </Button>
                </div>
              </div>

              {/* Scrollable Form */}
              <div className="flex-1 flex flex-col w-full space-y-16 pb-20">

                {/* Section 1 */}
                <div className="space-y-8">
                  <h3 className="font-serif text-3xl font-bold border-b border-white/20 pb-4">Basic Information</h3>
                  <div className="grid md:grid-cols-2 gap-8">
                    {renderEditField("First Name", "firstName", "Jane")}
                    {renderEditField("Last Name", "lastName", "Doe")}
                  </div>
                  {renderEditField("Location", "location", "City, Country")}
                  <EditField
                    label="Profile Image URL"
                    value={profile?.profileImageUrl}
                    onChange={(val) => setProfile(prev => prev ? ({ ...prev, profileImageUrl: val }) : null)}
                    placeholder="https://example.com/avatar.jpg"
                  />
                </div>

                {/* Section 2 */}
                <div className="space-y-8">
                  <h3 className="font-serif text-3xl font-bold border-b border-white/20 pb-4">Professional Details</h3>
                  {renderEditField("Bio", "bio", "Tell your story...", "textarea", true)}
                  <div className="grid md:grid-cols-2 gap-8">
                    {renderEditField("LinkedIn", "linkedinUrl", "https://linkedin.com/in/...")}
                    {renderEditField("GitHub", "githubUrl", "https://github.com/...")}
                  </div>
                  {renderEditField("Website", "website", "https://...", "text", true)}
                  {renderEditField("Interests / Domain", "interests", "React, AI, Design...", "text", true)}
                </div>

                {/* Section 3 */}
                <div className="space-y-8">
                  <h3 className="font-serif text-3xl font-bold border-b border-white/20 pb-4">Skills & Goals</h3>
                  {renderEditField("Current Skills", "skills", "What do you teach?")}
                  {renderEditField("Target Skills", "skillsToLearn", "What do you want to learn?")}
                  <div className="grid md:grid-cols-2 gap-8">
                    {renderEditField("Goal Focus", "learningGoal", "e.g. Mastery or Casual")}
                    {renderEditField("Timeline", "goalTimeline", "e.g. 3 Months")}
                  </div>
                </div>

                {/* Section 4 */}
                <div className="space-y-8">
                  <h3 className="font-serif text-3xl font-bold border-b border-white/20 pb-4">Availability</h3>
                  <div className="grid md:grid-cols-2 gap-8">
                    {renderEditField("Weekly Hours", "hoursPerWeek", "10", "number")}
                    {renderEditField("Timezone", "timezone", "UTC")}
                  </div>
                  {renderEditField("Availability Schedule", "availabilitySchedule", "e.g. Weekends")}
                  {renderEditField("Learning Method", "preferredLearningMethod", "e.g. Visual, Audio, Pair Programming")}
                </div>

              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Profile;

// --- Subcomponents ---

const Section = ({ title, children }: { title: string, children: React.ReactNode }) => (
  <div className="space-y-6">
    <h3 className="text-xs uppercase tracking-[0.2em] text-gray-400 font-bold border-b border-gray-100 pb-2 mb-4">{title}</h3>
    {children}
  </div>
);

const ContactItem = ({ icon: Icon, value, href }: { icon: any, value?: string, href?: string }) => {
  if (!value) return null;
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-black transition-colors group">
      <Icon className="w-4 h-4 text-gray-400 group-hover:text-black transition-colors" />
      <span className="truncate">{value}</span>
    </a>
  );
};

const DossierItem = ({ label, value }: { label: string, value?: string }) => (
  <div>
    <div className="text-xs uppercase tracking-widest text-gray-400 mb-1">{label}</div>
    <div className="font-serif text-lg">{value || "N/A"}</div>
  </div>
);

const DossierField = ({ label, value, icon: Icon, fullWidth = false }: { label: string, value?: string | number | null, icon?: any, fullWidth?: boolean }) => (
  <div className={`p-4 border-l-2 border-gray-100 hover:border-black transition-colors duration-300 ${fullWidth ? 'col-span-full' : ''}`}>
    <div className="flex items-center gap-2 mb-2 text-gray-400 uppercase tracking-widest text-xs font-bold">
      {Icon && <Icon className="w-3 h-3" />}
      {label}
    </div>
    <div className="font-serif text-lg leading-relaxed text-black">
      {value || <span className="text-gray-300 italic">Not specified</span>}
    </div>
  </div>
);

const EditField = ({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  fullWidth = false
}: {
  label: string,
  value: string | undefined | null,
  onChange: (val: string) => void,
  placeholder: string,
  type?: string,
  fullWidth?: boolean
}) => (
  <div className={`space-y-2 ${fullWidth ? 'col-span-full' : ''}`}>
    <Label className="text-xs uppercase tracking-widest text-white/50 pl-1">{label}</Label>
    {type === "textarea" ? (
      <Textarea
        value={value || ""}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="bg-transparent border-0 border-b border-white/20 text-white placeholder:text-white/20 focus:border-white focus:ring-0 rounded-none resize-none min-h-[100px] text-xl font-serif px-0"
      />
    ) : (
      <Input
        value={value || ""}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        type={type}
        className="bg-transparent border-0 border-b border-white/20 text-white placeholder:text-white/20 focus:border-white focus:ring-0 rounded-none text-xl font-serif px-0 h-14"
      />
    )}
  </div>
);
