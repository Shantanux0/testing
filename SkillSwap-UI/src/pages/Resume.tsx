import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { resumeApi, Education, Experience, Certification, CodingStat } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Plus, Trash2, Edit2, GraduationCap, Briefcase, Award, Code, Trophy, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const Resume = () => {
  // State Managment (Kept same as original)
  const [education, setEducation] = useState<Education[]>([]);
  const [experience, setExperience] = useState<Experience[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [codingStats, setCodingStats] = useState<CodingStat[]>([]);
  const [loading, setLoading] = useState(true);

  // Dialog States
  const [eduOpen, setEduOpen] = useState(false);
  const [expOpen, setExpOpen] = useState(false);
  const [certOpen, setCertOpen] = useState(false);
  const [codeOpen, setCodeOpen] = useState(false);

  // Edit States
  const [editEdu, setEditEdu] = useState<Education | null>(null);
  const [editExp, setEditExp] = useState<Experience | null>(null);
  const [editCert, setEditCert] = useState<Certification | null>(null);
  const [editCode, setEditCode] = useState<CodingStat | null>(null);

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

  // Generic Handlers (Simplified for brevity in this rewrite, logic remains same)
  const handleSave = async (apiFunc: any, data: any, refreshSet: any, setOpen: any, setEdit: any, type: string) => {
    try {
      await apiFunc(data);
      toast.success(`${type} saved!`);
      loadData();
      setOpen(false); setEdit(null);
    } catch (e: any) { toast.error(e.message || "Error saving"); }
  };

  const handleDelete = async (apiDelete: any, id: number) => {
    if (!confirm("Delete this entry?")) return;
    try { await apiDelete(id); toast.success("Deleted"); loadData(); }
    catch (e: any) { toast.error("Delete failed"); }
  };

  // --- Cinematic UI Components ---

  const GlassCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white/80 backdrop-blur-xl border border-white/40 shadow-xl rounded-2xl p-6 relative overflow-hidden group hover:shadow-2xl hover:bg-white/90 transition-all duration-300 ${className}`}
    >
      <div className="absolute top-0 right-0 p-12 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-indigo-500/10 transition-colors" />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );

  const SectionHeader = ({ title, desc, icon: Icon, onAdd }: any) => (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-lg">
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
          <p className="text-slate-500">{desc}</p>
        </div>
      </div>
      <Button onClick={onAdd} className="rounded-xl shadow-lg shadow-indigo-500/20 bg-indigo-600 hover:bg-indigo-700 text-white px-6">
        <Plus className="w-5 h-5 mr-2" /> Add New
      </Button>
    </div>
  );

  return (
    <MainLayout>
      <div className="min-h-screen bg-slate-50/50">
        <div className="max-w-6xl mx-auto p-8 lg:p-12 space-y-12">

          {/* Header */}
          <div className="text-center space-y-4 mb-16">
            <h1 className="text-5xl font-display font-bold text-slate-900 tracking-tight">
              Build Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Pro Profile</span>
            </h1>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto">
              Your digital resume is your key to unlocking better swaps and teaching opportunities. Make it shine.
            </p>
          </div>

          <Tabs defaultValue="education" className="space-y-12">
            <div className="flex justify-center">
              <TabsList className="bg-white/80 backdrop-blur-md border border-slate-200 p-1 rounded-full shadow-lg">
                {[
                  { id: "education", icon: GraduationCap, label: "Education" },
                  { id: "experience", icon: Briefcase, label: "Experience" },
                  { id: "certifications", icon: Award, label: "Certifications" },
                  { id: "coding", icon: Code, label: "Coding Stats" },
                ].map((tab) => (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                    className="rounded-full px-6 py-3 data-[state=active]:bg-slate-900 data-[state=active]:text-white transition-all"
                  >
                    <tab.icon className="w-4 h-4 mr-2" />
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {/* Content Area */}
            <div className="min-h-[400px]">

              {/* EDUCATION TAB */}
              <TabsContent value="education" className="space-y-6">
                <SectionHeader
                  title="Education"
                  desc="Your academic journey"
                  icon={GraduationCap}
                  onAdd={() => { setEditEdu(null); setEduOpen(true); }}
                />
                <div className="grid md:grid-cols-2 gap-6">
                  {education.map((item) => (
                    <GlassCard key={item.id}>
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-bold text-slate-900">{item.educationLevel}</h3>
                          <p className="text-indigo-600 font-medium">{item.institutionName}</p>
                          <p className="text-sm text-slate-500 mt-1">{item.passingYear} • {item.scoreDetails}</p>
                        </div>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button size="icon" variant="ghost" onClick={() => { setEditEdu(item); setEduOpen(true); }}><Edit2 className="w-4 h-4" /></Button>
                          <Button size="icon" variant="ghost" className="text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => handleDelete(resumeApi.deleteEducation, item.id!)}><Trash2 className="w-4 h-4" /></Button>
                        </div>
                      </div>
                      {item.proofUrl && (
                        <a href={item.proofUrl} target="_blank" className="inline-flex items-center text-xs font-medium text-slate-400 hover:text-indigo-500 mt-4 transition-colors">
                          <ExternalLink className="w-3 h-3 mr-1" /> View Credential
                        </a>
                      )}
                    </GlassCard>
                  ))}
                  {education.length === 0 && <EmptyState icon={GraduationCap} text="Add your first degree" />}
                </div>
              </TabsContent>

              {/* EXPERIENCE TAB */}
              <TabsContent value="experience" className="space-y-6">
                <SectionHeader
                  title="Experience"
                  desc="Your professional career"
                  icon={Briefcase}
                  onAdd={() => { setEditExp(null); setExpOpen(true); }}
                />
                <div className="space-y-4">
                  {/* List View for Experience usually better */}
                  {experience.map((item) => (
                    <GlassCard key={item.id} className="flex items-center gap-6">
                      <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-xl flex-shrink-0">
                        {item.companyName.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-slate-900">{item.jobTitle}</h3>
                        <p className="text-slate-600">{item.companyName}</p>
                        <div className="flex gap-4 mt-2 text-sm text-slate-500">
                          <span>{item.startDate} — {item.endDate || "Present"}</span>
                          <span className="bg-slate-100 px-2 rounded text-slate-600">{item.skillName}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="icon" variant="ghost" onClick={() => { setEditExp(item); setExpOpen(true); }}><Edit2 className="w-4 h-4" /></Button>
                        <Button size="icon" variant="ghost" className="text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => handleDelete(resumeApi.deleteExperience, item.id!)}><Trash2 className="w-4 h-4" /></Button>
                      </div>
                    </GlassCard>
                  ))}
                  {experience.length === 0 && <EmptyState icon={Briefcase} text="Add work experience" />}
                </div>
              </TabsContent>

              {/* CERTIFICATIONS TAB */}
              <TabsContent value="certifications" className="space-y-6">
                <SectionHeader
                  title="Certifications"
                  desc="Verified achievements"
                  icon={Award}
                  onAdd={() => { setEditCert(null); setCertOpen(true); }}
                />
                <div className="grid md:grid-cols-2 gap-6">
                  {certifications.map((item) => (
                    <GlassCard key={item.id} className="border-l-4 border-l-emerald-500">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-bold text-slate-900">{item.certificationName}</h3>
                          <p className="text-emerald-600 font-medium text-sm">{item.issuingOrganization}</p>
                          <p className="text-xs text-slate-400 mt-2">Issued: {item.issueDate}</p>
                        </div>
                        <Award className="w-8 h-8 text-emerald-100" />
                      </div>
                      <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => { setEditCert(item); setCertOpen(true); }}><Edit2 className="w-3 h-3" /></Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-red-500 hover:bg-red-50" onClick={() => handleDelete(resumeApi.deleteCertification, item.id!)}><Trash2 className="w-3 h-3" /></Button>
                      </div>
                    </GlassCard>
                  ))}
                  {certifications.length === 0 && <EmptyState icon={Award} text="Add certifications" />}
                </div>
              </TabsContent>

              {/* CODING STATS TAB */}
              <TabsContent value="coding" className="space-y-6">
                <SectionHeader
                  title="Coding Stats"
                  desc="Problem solving metrics"
                  icon={Code}
                  onAdd={() => { setEditCode(null); setCodeOpen(true); }}
                />
                <div className="grid md:grid-cols-3 gap-6">
                  {codingStats.map((item) => (
                    <GlassCard key={item.id} className="text-center">
                      <div className="mx-auto w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                        <Code className="w-6 h-6 text-slate-600" />
                      </div>
                      <h3 className="font-bold text-lg">{item.platformName}</h3>
                      <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
                        <div className="bg-green-50 p-2 rounded text-green-700">
                          <div className="font-bold">{item.easySolved}</div>
                          <div>Easy</div>
                        </div>
                        <div className="bg-yellow-50 p-2 rounded text-yellow-700">
                          <div className="font-bold">{item.mediumSolved}</div>
                          <div>Med</div>
                        </div>
                        <div className="bg-red-50 p-2 rounded text-red-700">
                          <div className="font-bold">{item.hardSolved}</div>
                          <div>Hard</div>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-slate-100 flex justify-center gap-2">
                        <Button size="sm" variant="ghost" onClick={() => { setEditCode(item); setCodeOpen(true); }}>Edit</Button>
                        <Button size="sm" variant="ghost" className="text-red-500 hover:bg-red-50" onClick={() => handleDelete(resumeApi.deleteCodingStat, item.id!)}>Delete</Button>
                      </div>
                    </GlassCard>
                  ))}
                  {codingStats.length === 0 && <EmptyState icon={Code} text="Link coding profiles" />}
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>

      {/* Dialogs - Keeping strict logic but minimal UI for brevity */}
      <DataDialog title="Education" open={eduOpen} setOpen={setEduOpen} data={editEdu} onSave={(d) => handleSave(editEdu?.id ? resumeApi.updateEducation : resumeApi.createEducation, { ...d, id: editEdu?.id }, setEducation, setEduOpen, setEditEdu, "Education")}>
        {(data, set) => <EducationFields data={data} set={set} />}
      </DataDialog>
      <DataDialog title="Experience" open={expOpen} setOpen={setExpOpen} data={editExp} onSave={(d) => handleSave(editExp?.id ? resumeApi.updateExperience : resumeApi.createExperience, { ...d, id: editExp?.id }, setExperience, setExpOpen, setEditExp, "Experience")}>
        {(data, set) => <ExperienceFields data={data} set={set} />}
      </DataDialog>
      <DataDialog title="Certification" open={certOpen} setOpen={setCertOpen} data={editCert} onSave={(d) => handleSave(editCert?.id ? resumeApi.updateCertification : resumeApi.createCertification, { ...d, id: editCert?.id }, setCertifications, setCertOpen, setEditCert, "Certification")}>
        {(data, set) => <CertificationFields data={data} set={set} />}
      </DataDialog>
      <DataDialog title="Coding Stat" open={codeOpen} setOpen={setCodeOpen} data={editCode} onSave={(d) => handleSave(editCode?.id ? resumeApi.updateCodingStat : resumeApi.createCodingStat, { ...d, id: editCode?.id }, setCodingStats, setCodeOpen, setEditCode, "Coding Stat")}>
        {(data, set) => <CodingFields data={data} set={set} />}
      </DataDialog>

    </MainLayout>
  );
};

// --- Helpers ---

const EmptyState = ({ icon: Icon, text }: any) => (
  <div className="col-span-full py-12 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-white/50">
    <Icon className="w-12 h-12 text-slate-300 mx-auto mb-4" />
    <p className="text-slate-500 font-medium">{text}</p>
  </div>
);

const DataDialog = ({ title, open, setOpen, data, onSave, children }: any) => {
  const [formData, setFormData] = useState<any>({});
  useEffect(() => { setFormData(data || {}) }, [data, open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-h-[85vh] overflow-y-auto w-full max-w-lg">
        <DialogHeader>
          <DialogTitle>{data ? 'Edit' : 'Add'} {title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }} className="space-y-4 pt-4">
          {children(formData, (update: any) => setFormData({ ...formData, ...update }))}
          <div className="flex gap-2 justify-end pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" className="bg-indigo-600 text-white">Save Changes</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// --- Fields ---

const EducationFields = ({ data, set }: any) => (
  <>
    <div className="space-y-2"><Label>Level</Label><Input value={data.educationLevel || ''} onChange={e => set({ educationLevel: e.target.value })} placeholder="B.Tech" required /></div>
    <div className="space-y-2"><Label>Institution</Label><Input value={data.institutionName || ''} onChange={e => set({ institutionName: e.target.value })} required /></div>
    <div className="space-y-2"><Label>University/Board</Label><Input value={data.boardOrUniversity || ''} onChange={e => set({ boardOrUniversity: e.target.value })} required /></div>
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2"><Label>Year</Label><Input value={data.passingYear || ''} onChange={e => set({ passingYear: e.target.value })} required /></div>
      <div className="space-y-2"><Label>Score</Label><Input value={data.scoreDetails || ''} onChange={e => set({ scoreDetails: e.target.value })} required /></div>
    </div>
    <div className="space-y-2"><Label>Proof URL</Label><Input value={data.proofUrl || ''} onChange={e => set({ proofUrl: e.target.value })} placeholder="https://" required /></div>
  </>
);

const ExperienceFields = ({ data, set }: any) => (
  <>
    <div className="space-y-2"><Label>Title</Label><Input value={data.jobTitle || ''} onChange={e => set({ jobTitle: e.target.value })} required /></div>
    <div className="space-y-2"><Label>Company</Label><Input value={data.companyName || ''} onChange={e => set({ companyName: e.target.value })} required /></div>
    <div className="space-y-2"><Label>Skill Used</Label><Input value={data.skillName || ''} onChange={e => set({ skillName: e.target.value })} required /></div>
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2"><Label>Start</Label><Input type="date" value={data.startDate || ''} onChange={e => set({ startDate: e.target.value })} required /></div>
      <div className="space-y-2"><Label>End</Label><Input type="date" value={data.endDate || ''} onChange={e => set({ endDate: e.target.value })} /></div>
    </div>
    <div className="space-y-2"><Label>Proof URL</Label><Input value={data.proofUrl || ''} onChange={e => set({ proofUrl: e.target.value })} required /></div>
  </>
);

const CertificationFields = ({ data, set }: any) => (
  <>
    <div className="space-y-2"><Label>Name</Label><Input value={data.certificationName || ''} onChange={e => set({ certificationName: e.target.value })} required /></div>
    <div className="space-y-2"><Label>Organization</Label><Input value={data.issuingOrganization || ''} onChange={e => set({ issuingOrganization: e.target.value })} required /></div>
    <div className="space-y-2"><Label>Related Skill</Label><Input value={data.skillName || ''} onChange={e => set({ skillName: e.target.value })} required /></div>
    <div className="space-y-2"><Label>Issue Date</Label><Input type="date" value={data.issueDate || ''} onChange={e => set({ issueDate: e.target.value })} required /></div>
    <div className="space-y-2"><Label>Proof URL</Label><Input value={data.proofUrl || ''} onChange={e => set({ proofUrl: e.target.value })} required /></div>
  </>
);

const CodingFields = ({ data, set }: any) => (
  <>
    <div className="space-y-2"><Label>Platform</Label><Input value={data.platformName || ''} onChange={e => set({ platformName: e.target.value })} placeholder="LeetCode" required /></div>
    <div className="grid grid-cols-3 gap-2">
      <div className="space-y-2"><Label>Easy</Label><Input type="number" value={data.easySolved || ''} onChange={e => set({ easySolved: parseInt(e.target.value) || 0 })} /></div>
      <div className="space-y-2"><Label>Med</Label><Input type="number" value={data.mediumSolved || ''} onChange={e => set({ mediumSolved: parseInt(e.target.value) || 0 })} /></div>
      <div className="space-y-2"><Label>Hard</Label><Input type="number" value={data.hardSolved || ''} onChange={e => set({ hardSolved: parseInt(e.target.value) || 0 })} /></div>
    </div>
    <div className="space-y-2"><Label>Total</Label><Input type="number" value={data.totalProblemsSolved || ''} onChange={e => set({ totalProblemsSolved: parseInt(e.target.value) || 0 })} /></div>
    <div className="space-y-2"><Label>Profile URL</Label><Input value={data.proofUrl || ''} onChange={e => set({ proofUrl: e.target.value })} required /></div>
  </>
);

export default Resume;
