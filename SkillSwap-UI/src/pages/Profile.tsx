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
  MessageSquare, Loader2, ArrowLeft, ChevronRight, ChevronLeft, CheckCircle2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import AppNavbar from "@/components/layout/AppNavbar";

const Profile = () => {
  const { profile: authProfile, refreshProfile } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(authProfile);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;
  const navigate = useNavigate();

  // LocalStorage helpers for profile image
  const PROFILE_IMAGE_KEY = `profile_image_${authProfile?.email}`;

  const saveImageToLocalStorage = (imageData: string) => {
    try {
      localStorage.setItem(PROFILE_IMAGE_KEY, imageData);
    } catch (error) {
      console.error('Failed to save image to localStorage:', error);
      toast.error('Image too large to store');
    }
  };

  const loadImageFromLocalStorage = (): string | null => {
    try {
      return localStorage.getItem(PROFILE_IMAGE_KEY);
    } catch (error) {
      console.error('Failed to load image from localStorage:', error);
      return null;
    }
  };

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
        // Load image from localStorage if available
        const storedImage = loadImageFromLocalStorage();
        if (storedImage) {
          profileData.profileImageUrl = storedImage;
        }
        setProfile(profileData);
      }
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
      // Save image to localStorage separately
      if (profile.profileImageUrl && profile.profileImageUrl.startsWith('data:')) {
        saveImageToLocalStorage(profile.profileImageUrl);
      }

      const updateData = {
        firstName: profile.firstName,
        lastName: profile.lastName,
        bio: profile.bio,
        profileImageUrl: '', // Don't send base64 to backend
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
      setIsEditing(false);
      setCurrentStep(1);
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

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white">
      <AppNavbar />

      <main className="pt-24 pb-12 px-4 md:px-12 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-12"
        >
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start border-b border-black/10 pb-12 gap-8">
            <div className="flex gap-8 items-center">
              <div className="relative group">
                <div className="w-32 h-32 md:w-40 md:h-40 bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center">
                  {profile?.profileImageUrl ? (
                    <img src={profile.profileImageUrl} alt="Profile" className="w-full h-full object-cover grayscale contrast-125" />
                  ) : (
                    <User className="w-16 h-16 text-gray-300" />
                  )}
                </div>
              </div>
              <div>
                <h1 className="font-serif text-4xl md:text-6xl font-bold tracking-tighter loading-none">
                  {profile?.firstName} <span className="text-gray-400">{profile?.lastName}</span>
                </h1>
                <div className="flex items-center gap-4 mt-2 text-sm uppercase tracking-widest text-gray-500 font-medium">
                  <span className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {profile?.location || "Location N/A"}</span>
                  <span className="flex items-center gap-2 text-black font-bold bg-black/5 px-2 py-1"><CheckCircle2 className="w-4 h-4 text-green-600" /> VERIFIED</span>
                </div>
              </div>
            </div>

            <Button
              onClick={() => setIsEditing(true)}
              className="rounded-none bg-black text-white hover:bg-gray-800 px-8 py-6 uppercase tracking-widest text-xs h-auto"
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
                  {profile?.interests?.split(',').map((tag, i) => (
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

              <div className="border-t border-black/10 pt-8 grid md:grid-cols-2 gap-8">
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
            <div className="min-h-screen flex flex-col max-w-5xl mx-auto p-6 md:p-12">
              {/* Header */}
              <div className="flex justify-between items-center mb-16">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 border border-white/20 flex items-center justify-center font-serif text-xl">
                    {currentStep}
                  </div>
                  <div className="uppercase tracking-[0.2em] text-sm text-gray-400">
                    Editing Profile
                  </div>
                </div>
                <Button
                  variant="ghost"
                  onClick={() => setIsEditing(false)}
                  className="text-white hover:text-white/50 uppercase tracking-widest text-xs"
                >
                  Close <X className="ml-2 w-4 h-4" />
                </Button>
              </div>

              {/* Step Content */}
              <div className="flex-1 flex flex-col justify-center max-w-3xl mx-auto w-full space-y-12">
                <div className="space-y-2 text-center mb-8">
                  <h2 className="font-serif text-4xl md:text-5xl font-bold">
                    {currentStep === 1 && "Basic Information"}
                    {currentStep === 2 && "About Yourself"}
                    {currentStep === 3 && "Skills & Goals"}
                    {currentStep === 4 && "Preferences"}
                  </h2>
                  <p className="text-gray-400 text-lg font-light">
                    {currentStep === 1 && "Let's start with the essentials."}
                    {currentStep === 2 && "Tell the world who you are."}
                    {currentStep === 3 && "Where are you now, and where are you going?"}
                    {currentStep === 4 && "How do you work best?"}
                  </p>
                </div>

                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-8"
                >
                  {currentStep === 1 && (
                    <>
                      <div className="grid grid-cols-2 gap-8">
                        {renderEditField("First Name", "firstName", "Jane")}
                        {renderEditField("Last Name", "lastName", "Doe")}
                      </div>
                      {renderEditField("Location", "location", "City, Country")}
                      <EditField
                        label="Profile Image"
                        value={profile?.profileImageUrl?.startsWith('data:') ? '' : profile?.profileImageUrl}
                        onChange={(val) => setProfile(prev => prev ? ({ ...prev, profileImageUrl: val }) : null)}
                        placeholder="Image URL or Upload Below"
                      />
                      <div className="border border-white/10 p-4 text-center hover:bg-white/5 transition-colors cursor-pointer relative">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setProfile(prev => prev ? ({ ...prev, profileImageUrl: reader.result as string }) : null);
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                        <span className="text-xs uppercase tracking-widest text-gray-400">Click to Upload Photo</span>
                      </div>
                    </>
                  )}

                  {currentStep === 2 && (
                    <>
                      {renderEditField("Bio", "bio", "Tell your story...", "textarea", true)}
                      <div className="grid grid-cols-2 gap-8">
                        {renderEditField("LinkedIn", "linkedinUrl", "URL")}
                        {renderEditField("Website", "website", "URL")}
                      </div>
                      {renderEditField("Interests", "interests", "Comma separated tags", "text", true)}
                    </>
                  )}

                  {currentStep === 3 && (
                    <>
                      {renderEditField("Current Skills", "skills", "e.g. React, Java")}
                      {renderEditField("Target Skills", "skillsToLearn", "e.g. Python, AI")}
                      <div className="grid grid-cols-2 gap-8">
                        {renderEditField("Goal", "learningGoal", "Mastery")}
                        {renderEditField("Timeline", "goalTimeline", "3 Months")}
                      </div>
                    </>
                  )}

                  {currentStep === 4 && (
                    <>
                      <div className="grid grid-cols-2 gap-8">
                        {renderEditField("Weekly Hours", "hoursPerWeek", "10", "number")}
                        {renderEditField("Timezone", "timezone", "UTC")}
                      </div>
                      {renderEditField("Availability", "availabilitySchedule", "e.g. Weekends")}
                      {renderEditField("Method", "preferredLearningMethod", "Visual, Audio...")}
                    </>
                  )}

                </motion.div>
              </div>

              {/* Footer / Navigation */}
              <div className="mt-16 border-t border-white/10 pt-8 flex justify-between items-center">
                <div className="flex gap-2">
                  {[1, 2, 3, 4].map(step => (
                    <div key={step} onClick={() => setCurrentStep(step)} className={`w-3 h-3 rounded-full cursor-pointer transition-colors ${currentStep === step ? 'bg-white' : 'bg-white/20 hover:bg-white/40'}`} />
                  ))}
                </div>

                <div className="flex gap-6">
                  {currentStep > 1 && (
                    <Button
                      variant="ghost"
                      onClick={() => setCurrentStep(currentStep - 1)}
                      className="text-white uppercase tracking-widest text-xs h-12 px-6"
                    >
                      Previous
                    </Button>
                  )}

                  {currentStep < totalSteps ? (
                    <Button
                      onClick={() => setCurrentStep(currentStep + 1)}
                      className="bg-white text-black hover:bg-gray-200 rounded-none uppercase tracking-widest text-xs h-12 px-8 font-bold"
                    >
                      Next Step
                    </Button>
                  ) : (
                    <Button
                      onClick={handleSave}
                      disabled={saving}
                      className="bg-white text-black hover:bg-gray-200 rounded-none uppercase tracking-widest text-xs h-12 px-8 font-bold"
                    >
                      {saving ? <Loader2 className="animate-spin" /> : "Save Dossier"}
                    </Button>
                  )}
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
