import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { resumeApi, Education, Experience, Certification, CodingStat } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Plus, Trash2, Edit2, GraduationCap, Briefcase, Award, Code, ExternalLink, Download, AlertTriangle, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useNavigate, useLocation } from "react-router-dom";

const Resume = () => {
  const { profile, hasResume } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const routeAlert = (location.state as any)?.alert;

  // State
  const [education, setEducation] = useState<Education[]>([]);
  const [experience, setExperience] = useState<Experience[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [codingStats, setCodingStats] = useState<CodingStat[]>([]);
  const [loading, setLoading] = useState(true);

  // Dialogs
  const [activeDialog, setActiveDialog] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<any>(null);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [edu, exp, cert, stats] = await Promise.all([
        resumeApi.getEducation().catch(() => []),
        resumeApi.getExperience().catch(() => []),
        resumeApi.getCertifications().catch(() => []),
        resumeApi.getCodingStats().catch(() => [])
      ]);
      setEducation(edu); setExperience(exp); setCertifications(cert); setCodingStats(stats);
    } catch (e) { toast.error("Failed to load profile data"); }
    finally { setLoading(false); }
  };

  const handleSave = async (apiFunc: any, data: any, refreshSet: any, type: string) => {
    try {
      await apiFunc(data);
      toast.success(`${type} saved`);
      loadData();
      setActiveDialog(null); setEditingItem(null);
    } catch (e: any) { toast.error(e.message || "Error saving"); }
  };

  const handleDelete = async (apiDelete: any, id: number) => {
    if (!confirm("Delete this entry?")) return;
    try { await apiDelete(id); toast.success("Deleted"); loadData(); }
    catch (e: any) { toast.error("Delete failed"); }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const isProfileComplete = !!(profile?.firstName && profile?.skills && profile?.skillsToLearn);

  return (
    <MainLayout>
      {/* Onboarding Warning Banner */}
      {(!isProfileComplete || !hasResume) && (
        <div className="fixed top-16 left-0 right-0 z-50 bg-amber-50 border-b-2 border-amber-400">
          <div className="max-w-7xl mx-auto px-4 md:px-12 py-3 flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="flex items-center gap-2 text-amber-700 font-bold text-sm shrink-0">
              <AlertTriangle className="w-4 h-4" />
              {routeAlert || "Add your Experience to start swapping skills!"}
            </div>
            <div className="flex items-center gap-4 ml-auto text-xs font-semibold uppercase tracking-widest">
              <span className={`flex items-center gap-1 ${isProfileComplete ? 'text-green-600' : 'text-amber-600'}`}>
                {isProfileComplete ? '✓' : '①'} Profile
              </span>
              <ChevronRight className="w-3 h-3 text-gray-400" />
              <span className={`flex items-center gap-1 ${hasResume ? 'text-green-600' : 'text-amber-600'}`}>
                {hasResume ? '✓' : '②'} Resume
              </span>
              <ChevronRight className="w-3 h-3 text-gray-400" />
              <span className="text-gray-400">③ Start Swap</span>
            </div>
            {!isProfileComplete && (
              <button
                onClick={() => navigate('/profile')}
                className="ml-2 px-4 py-1 bg-black text-white text-xs uppercase tracking-widest hover:bg-gray-800 transition-colors shrink-0"
              >
                Go to Profile →
              </button>
            )}
          </div>
        </div>
      )}

      <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white">
        <div className="max-w-5xl mx-auto p-8 lg:p-20" style={{ paddingTop: (!isProfileComplete || !hasResume) ? '6rem' : '' }}>

          {/* Header */}
          <div className="flex justify-between items-end mb-24 border-b border-black pb-8">
            <div>
              <motion.h1
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="font-serif text-6xl md:text-8xl font-bold tracking-tight mb-4"
              >
                Resume
              </motion.h1>
              <p className="text-gray-500 uppercase tracking-widest text-xs">Curated Professional History</p>
            </div>
            <Button variant="outline" className="hidden md:flex gap-2 rounded-none border-black hover:bg-black hover:text-white transition-colors uppercase tracking-widest text-xs h-12 px-6">
              <Download className="w-4 h-4" /> Export PDF
            </Button>
          </div>

          <div className="space-y-24">

            {/* EXPERIENCE */}
            <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
              <div className="flex items-center justify-between mb-12">
                <h2 className="font-serif text-3xl font-bold flex items-center gap-4">
                  <span className="w-8 h-[1px] bg-black"></span> Experience
                </h2>
                <Button onClick={() => { setEditingItem(null); setActiveDialog('experience'); }} variant="ghost" className="hover:bg-black hover:text-white rounded-full w-10 h-10 p-0"><Plus className="w-5 h-5" /></Button>
              </div>
              <div className="space-y-0 border-l border-black/10 ml-4 pl-12 relative">
                {experience.map((item, i) => (
                  <div key={item.id} className="relative pb-16 last:pb-0 group">
                    <div className="absolute -left-[53px] top-2 w-3 h-3 bg-white border-2 border-black rounded-full group-hover:bg-black transition-colors" />
                    <div className="grid md:grid-cols-[1fr_200px] gap-8">
                      <div>
                        <h3 className="text-2xl font-bold mb-1 group-hover:text-gray-600 transition-colors">{item.jobTitle}</h3>
                        <div className="text-lg font-serif italic text-gray-500 mb-4">{item.companyName}</div>
                        <p className="text-gray-600 leading-relaxed max-w-2xl">{item.description || `Specialized in ${item.skillName}`}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold mb-2">{item.startDate} — {item.endDate || "Present"}</div>
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="sm" onClick={() => { setEditingItem(item); setActiveDialog('experience'); }}>Edit</Button>
                          <Button variant="ghost" size="sm" className="text-red-500" onClick={() => handleDelete(resumeApi.deleteExperience, item.id!)}>Delete</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {experience.length === 0 && <div className="text-gray-400 italic">No experience added yet.</div>}
              </div>
            </motion.section>

            {/* EDUCATION */}
            <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
              <div className="flex items-center justify-between mb-12">
                <h2 className="font-serif text-3xl font-bold flex items-center gap-4">
                  <span className="w-8 h-[1px] bg-black"></span> Education
                </h2>
                <Button onClick={() => { setEditingItem(null); setActiveDialog('education'); }} variant="ghost" className="hover:bg-black hover:text-white rounded-full w-10 h-10 p-0"><Plus className="w-5 h-5" /></Button>
              </div>
              <div className="grid md:grid-cols-2 gap-8">
                {education.map((item) => (
                  <div key={item.id} className="p-8 border border-gray-100 hover:border-black transition-colors duration-300 group relative">
                    <div className="text-xs uppercase tracking-widest text-gray-500 mb-2">{item.passingYear}</div>
                    <h3 className="text-xl font-bold mb-1">{item.educationLevel}</h3>
                    <div className="font-serif italic text-gray-600 mb-4">{item.institutionName}</div>
                    <div className="text-sm text-gray-500">{item.scoreDetails}</div>

                    <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => { setEditingItem(item); setActiveDialog('education'); }}><Edit2 className="w-3 h-3" /></Button>
                      <Button size="icon" variant="ghost" className="h-8 w-8 text-red-500" onClick={() => handleDelete(resumeApi.deleteEducation, item.id!)}><Trash2 className="w-3 h-3" /></Button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>

            {/* CERTIFICATIONS & STATS */}
            <div className="grid md:grid-cols-2 gap-16">
              <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
                <div className="flex items-center justify-between mb-8">
                  <h2 className="font-serif text-2xl font-bold">Certifications</h2>
                  <Button onClick={() => { setEditingItem(null); setActiveDialog('certification'); }} variant="ghost" size="sm"><Plus className="w-4 h-4" /></Button>
                </div>
                <div className="space-y-4">
                  {certifications.map((item) => (
                    <div key={item.id} className="flex justify-between items-center py-4 border-b border-gray-100 group">
                      <div>
                        <div className="font-bold">{item.certificationName}</div>
                        <div className="text-sm text-gray-500">{item.issuingOrganization}</div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Button size="icon" variant="ghost" className="opacity-0 group-hover:opacity-100 h-8 w-8" onClick={() => { setEditingItem(item); setActiveDialog('certification'); }}><Edit2 className="w-3 h-3" /></Button>
                        {item.proofUrl && <a href={item.proofUrl} target="_blank"><ExternalLink className="w-4 h-4" /></a>}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.section>

              <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
                <div className="flex items-center justify-between mb-8">
                  <h2 className="font-serif text-2xl font-bold">Coding Stats</h2>
                  <Button onClick={() => { setEditingItem(null); setActiveDialog('coding'); }} variant="ghost" size="sm"><Plus className="w-4 h-4" /></Button>
                </div>
                <div className="space-y-4">
                  {codingStats.map((item) => (
                    <div key={item.id} className="bg-black text-white p-6 relative group">
                      <div className="flex justify-between items-center mb-4">
                        <span className="font-bold">{item.platformName}</span>
                        <span className="text-xs uppercase tracking-widest bg-white/20 px-2 py-1">{item.totalProblemsSolved} Solved</span>
                      </div>
                      <div className="flex gap-1 h-1 bg-white/10">
                        <div style={{ flex: item.easySolved }} className="bg-green-500" />
                        <div style={{ flex: item.mediumSolved }} className="bg-yellow-500" />
                        <div style={{ flex: item.hardSolved }} className="bg-red-500" />
                      </div>

                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button size="icon" variant="ghost" className="h-6 w-6 text-white hover:bg-white/20" onClick={() => handleDelete(resumeApi.deleteCodingStat, item.id!)}><Trash2 className="w-3 h-3" /></Button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.section>
            </div>

          </div>
        </div>
      </div>

      {/* Dialogs - Wrapper logic to handle different forms */}
      <DataDialog
        open={!!activeDialog}
        onOpenChange={(open) => !open && setActiveDialog(null)}
        title={editingItem ? 'Edit Entry' : 'Add Entry'}
      >
        {activeDialog === 'education' && (
          <Forms.Education
            data={editingItem || {}}
            onSave={(d) => handleSave(editingItem?.id ? resumeApi.updateEducation : resumeApi.createEducation, { ...d, id: editingItem?.id }, setEducation, "Education")}
          />
        )}
        {activeDialog === 'experience' && (
          <Forms.Experience
            data={editingItem || {}}
            onSave={(d) => handleSave(editingItem?.id ? resumeApi.updateExperience : resumeApi.createExperience, { ...d, id: editingItem?.id }, setExperience, "Experience")}
          />
        )}
        {activeDialog === 'certification' && (
          <Forms.Certification
            data={editingItem || {}}
            onSave={(d) => handleSave(editingItem?.id ? resumeApi.updateCertification : resumeApi.createCertification, { ...d, id: editingItem?.id }, setCertifications, "Certification")}
          />
        )}
        {activeDialog === 'coding' && (
          <Forms.Coding
            data={editingItem || {}}
            onSave={(d) => handleSave(editingItem?.id ? resumeApi.updateCodingStat : resumeApi.createCodingStat, { ...d, id: editingItem?.id }, setCodingStats, "Coding Stat")}
          />
        )}
      </DataDialog>
    </MainLayout>
  );
};

// --- Reusable Dialog & Forms ---

const DataDialog = ({ open, onOpenChange, title, children }: any) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="sm:max-w-[500px] bg-white text-black border-black p-8 rounded-none">
      <DialogHeader>
        <DialogTitle className="font-serif text-2xl font-bold mb-4">{title}</DialogTitle>
      </DialogHeader>
      {children}
    </DialogContent>
  </Dialog>
);

const Forms = {
  Education: ({ data, onSave }: any) => {
    const [formData, setFormData] = useState(data);
    const set = (u: any) => setFormData({ ...formData, ...u });
    return (
      <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }} className="space-y-4">
        <div className="space-y-2"><Label>Level</Label><Input value={formData.educationLevel || ''} onChange={e => set({ educationLevel: e.target.value })} placeholder="B.Tech" className="rounded-none border-gray-300 focus:border-black" required /></div>
        <div className="space-y-2"><Label>Institution</Label><Input value={formData.institutionName || ''} onChange={e => set({ institutionName: e.target.value })} className="rounded-none border-gray-300 focus:border-black" required /></div>
        <div className="space-y-2"><Label>University/Board</Label><Input value={formData.boardOrUniversity || ''} onChange={e => set({ boardOrUniversity: e.target.value })} className="rounded-none border-gray-300 focus:border-black" required /></div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2"><Label>Year</Label><Input value={formData.passingYear || ''} onChange={e => set({ passingYear: e.target.value })} className="rounded-none border-gray-300 focus:border-black" required /></div>
          <div className="space-y-2"><Label>Score</Label><Input value={formData.scoreDetails || ''} onChange={e => set({ scoreDetails: e.target.value })} className="rounded-none border-gray-300 focus:border-black" required /></div>
        </div>
        <div className="space-y-2"><Label>Proof URL</Label><Input value={formData.proofUrl || ''} onChange={e => set({ proofUrl: e.target.value })} className="rounded-none border-gray-300 focus:border-black" required /></div>
        <Button type="submit" className="w-full bg-black text-white hover:bg-gray-800 rounded-none mt-4">Save</Button>
      </form>
    );
  },
  Experience: ({ data, onSave }: any) => {
    const [formData, setFormData] = useState(data);
    const set = (u: any) => setFormData({ ...formData, ...u });
    return (
      <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }} className="space-y-4">
        <div className="space-y-2"><Label>Title</Label><Input value={formData.jobTitle || ''} onChange={e => set({ jobTitle: e.target.value })} className="rounded-none border-gray-300 focus:border-black" required /></div>
        <div className="space-y-2"><Label>Company</Label><Input value={formData.companyName || ''} onChange={e => set({ companyName: e.target.value })} className="rounded-none border-gray-300 focus:border-black" required /></div>
        <div className="space-y-2"><Label>Skill Used</Label><Input value={formData.skillName || ''} onChange={e => set({ skillName: e.target.value })} className="rounded-none border-gray-300 focus:border-black" required /></div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2"><Label>Start</Label><Input type="date" value={formData.startDate || ''} onChange={e => set({ startDate: e.target.value })} className="rounded-none border-gray-300 focus:border-black" required /></div>
          <div className="space-y-2"><Label>End</Label><Input type="date" value={formData.endDate || ''} onChange={e => set({ endDate: e.target.value })} className="rounded-none border-gray-300 focus:border-black" /></div>
        </div>
        <div className="space-y-2"><Label>Proof URL</Label><Input value={formData.proofUrl || ''} onChange={e => set({ proofUrl: e.target.value })} className="rounded-none border-gray-300 focus:border-black" required /></div>
        <Button type="submit" className="w-full bg-black text-white hover:bg-gray-800 rounded-none mt-4">Save</Button>
      </form>
    );
  },
  Certification: ({ data, onSave }: any) => {
    const [formData, setFormData] = useState(data);
    const set = (u: any) => setFormData({ ...formData, ...u });
    return (
      <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }} className="space-y-4">
        <div className="space-y-2"><Label>Name</Label><Input value={formData.certificationName || ''} onChange={e => set({ certificationName: e.target.value })} className="rounded-none border-gray-300 focus:border-black" required /></div>
        <div className="space-y-2"><Label>Organization</Label><Input value={formData.issuingOrganization || ''} onChange={e => set({ issuingOrganization: e.target.value })} className="rounded-none border-gray-300 focus:border-black" required /></div>
        <div className="space-y-2"><Label>Related Skill</Label><Input value={formData.skillName || ''} onChange={e => set({ skillName: e.target.value })} className="rounded-none border-gray-300 focus:border-black" required /></div>
        <div className="space-y-2"><Label>Issue Date</Label><Input type="date" value={formData.issueDate || ''} onChange={e => set({ issueDate: e.target.value })} className="rounded-none border-gray-300 focus:border-black" required /></div>
        <div className="space-y-2"><Label>Proof URL</Label><Input value={formData.proofUrl || ''} onChange={e => set({ proofUrl: e.target.value })} className="rounded-none border-gray-300 focus:border-black" required /></div>
        <Button type="submit" className="w-full bg-black text-white hover:bg-gray-800 rounded-none mt-4">Save</Button>
      </form>
    );
  },
  Coding: ({ data, onSave }: any) => {
    const [formData, setFormData] = useState(data);
    const set = (u: any) => setFormData({ ...formData, ...u });
    return (
      <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }} className="space-y-4">
        <div className="space-y-2"><Label>Platform</Label><Input value={formData.platformName || ''} onChange={e => set({ platformName: e.target.value })} className="rounded-none border-gray-300 focus:border-black" required /></div>
        <div className="grid grid-cols-3 gap-2">
          <div className="space-y-2"><Label>Easy</Label><Input type="number" value={formData.easySolved || ''} onChange={e => set({ easySolved: parseInt(e.target.value) || 0 })} className="rounded-none border-gray-300 focus:border-black" /></div>
          <div className="space-y-2"><Label>Med</Label><Input type="number" value={formData.mediumSolved || ''} onChange={e => set({ mediumSolved: parseInt(e.target.value) || 0 })} className="rounded-none border-gray-300 focus:border-black" /></div>
          <div className="space-y-2"><Label>Hard</Label><Input type="number" value={formData.hardSolved || ''} onChange={e => set({ hardSolved: parseInt(e.target.value) || 0 })} className="rounded-none border-gray-300 focus:border-black" /></div>
        </div>
        <div className="space-y-2"><Label>Total</Label><Input type="number" value={formData.totalProblemsSolved || ''} onChange={e => set({ totalProblemsSolved: parseInt(e.target.value) || 0 })} className="rounded-none border-gray-300 focus:border-black" /></div>
        <div className="space-y-2"><Label>Profile URL</Label><Input value={formData.proofUrl || ''} onChange={e => set({ proofUrl: e.target.value })} className="rounded-none border-gray-300 focus:border-black" required /></div>
        <Button type="submit" className="w-full bg-black text-white hover:bg-gray-800 rounded-none mt-4">Save</Button>
      </form>
    );
  }
}

export default Resume;
