import { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ArrowLeft, Upload, X, Loader2, Save, Plus, Trash2,
  Package, Ruler, Scale, Layers, Tag, Sparkles, Globe,
  ImagePlus, Check, AlertCircle, Info, ChevronDown,
  MapPin, Leaf, Shield, Award, Target
} from 'lucide-react';
import TranslatableField from '@/components/admin/TranslatableField';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useToast } from '@/hooks/use-toast';
import { useCategories, CompositionItem, OriginSupplierData, ESGMetric, SDGGoal, ESGImpactData, CertificationItem, GovernanceData, SectionVisibility } from '@/hooks/useProducts';

const productSchema = z.object({
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/),
  category_id: z.string().min(1, 'Select a category'),
  name_en: z.string().min(2), name_da: z.string().min(2),
  description_en: z.string().min(10), description_da: z.string().min(10),
  spec_size: z.string().optional(), spec_weight: z.string().optional(), spec_material: z.string().optional(),
  featured: z.boolean().default(false), is_active: z.boolean().default(true), sort_order: z.number().default(0),
});
type ProductForm = z.infer<typeof productSchema>;

// Default data templates for quick-fill
const DEFAULT_ORIGIN: OriginSupplierData = {
  supplier_name: 'EcoFy Bangladesh', location: 'Dhaka, Bangladesh', country_code: 'BD',
  established: '2018', artisans: '150+', certifications: ['Fair Trade', 'SA8000', 'SEDEX'],
  story_en: 'Our products are handcrafted by skilled artisans in Bangladesh who have inherited traditional jute-making techniques through generations. We ensure fair wages and safe working conditions.',
  story_da: 'Vores produkter er håndlavet af dygtige håndværkere i Bangladesh, der har arvet traditionelle jutefremstillingsteknikker gennem generationer. Vi sikrer fair løn og sikre arbejdsforhold.',
  transparency_en: 'We believe in full transparency in our supply chain and are proud to partner with certified suppliers.',
  transparency_da: 'Vi tror på fuld gennemsigtighed i vores forsyningskæde og er stolte af at samarbejde med certificerede leverandører.',
};

const DEFAULT_ESG: ESGImpactData = {
  metrics: [
    { label_en: 'Carbon Footprint', label_da: 'CO₂ Aftryk', value: '-75%', description_en: 'vs. plastic alternatives', description_da: 'vs. plastik alternativer' },
    { label_en: 'Water Usage', label_da: 'Vandforbrug', value: '-60%', description_en: 'vs. cotton production', description_da: 'vs. bomuldsproduktion' },
    { label_en: 'Recyclability', label_da: 'Genanvendelighed', value: '100%', description_en: 'biodegradable', description_da: 'biologisk nedbrydeligt' },
    { label_en: 'Trees Planted', label_da: 'Træer Plantet', value: '1', description_en: 'per 10 products sold', description_da: 'per 10 solgte produkter' },
  ],
  sdg_goals: [
    { number: 8, title_en: 'Decent Work', title_da: 'Anstændigt Arbejde' },
    { number: 12, title_en: 'Responsible Consumption', title_da: 'Ansvarligt Forbrug' },
    { number: 13, title_en: 'Climate Action', title_da: 'Klimaindsats' },
    { number: 15, title_en: 'Life on Land', title_da: 'Livet på Land' },
  ],
  climate_badge_en: 'Certified Climate Neutral Production',
  climate_badge_da: 'Certificeret Klimaneutral Produktion',
};

const DEFAULT_GOVERNANCE: GovernanceData = {
  certifications: [
    { name: 'OEKO-TEX® Standard 100', description_en: 'Tested for harmful substances', description_da: 'Testet for skadelige stoffer' },
    { name: 'GOTS Certified', description_en: 'Global Organic Textile Standard', description_da: 'Global organisk tekstil standard' },
    { name: 'Fair Trade', description_en: 'Ethical trade certified', description_da: 'Etisk handel certificeret' },
    { name: 'ISO 9001:2015', description_en: 'Quality Management System', description_da: 'Kvalitetsstyringssystem' },
  ],
  compliance_en: ['No Child Labor Policy', 'Fair Wage Standard', 'Safe Working Conditions', 'Environmental Protection', 'Anti-Corruption Policy', 'Supply Chain Transparency'],
  compliance_da: ['Ingen børnearbejde politik', 'Fair lønstandard', 'Sikre arbejdsforhold', 'Miljøbeskyttelse', 'Anti-korruptionspolitik', 'Forsyningskæde gennemsigtighed'],
  qa_statement_en: 'Every product undergoes rigorous quality control before shipping. We offer a full satisfaction guarantee.',
  qa_statement_da: 'Hvert produkt gennemgår streng kvalitetskontrol før afsendelse. Vi tilbyder fuld tilfredshedsgaranti.',
};

// Collapsible section wrapper with optional visibility toggle
const Section = ({ icon: Icon, title, subtitle, color, children, defaultOpen = true, enabled, onToggle }: {
  icon: any; title: string; subtitle: string; color: string; children: React.ReactNode; defaultOpen?: boolean;
  enabled?: boolean; onToggle?: (val: boolean) => void;
}) => (
  <Collapsible defaultOpen={defaultOpen}>
    <Card className={`shadow-sm border-border/60 transition-opacity ${enabled === false ? 'opacity-50' : ''}`}>
      <CollapsibleTrigger asChild>
        <CardHeader className="pb-4 cursor-pointer hover:bg-muted/20 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl bg-gradient-to-br ${color}`}><Icon className="h-5 w-5" /></div>
              <div><CardTitle className="text-lg">{title}</CardTitle><CardDescription>{subtitle}</CardDescription></div>
            </div>
            <div className="flex items-center gap-3">
              {onToggle !== undefined && (
                <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                  <span className={`text-[11px] font-medium ${enabled !== false ? 'text-green-600' : 'text-muted-foreground'}`}>
                    {enabled !== false ? 'Visible' : 'Hidden'}
                  </span>
                  <Switch checked={enabled !== false} onCheckedChange={onToggle} />
                </div>
              )}
              <ChevronDown className="h-5 w-5 text-muted-foreground transition-transform [[data-state=open]_&]:rotate-180" />
            </div>
          </div>
        </CardHeader>
      </CollapsibleTrigger>
      <CollapsibleContent><CardContent className="space-y-5 pt-0">{children}</CardContent></CollapsibleContent>
    </Card>
  </Collapsible>
);

const ProductEditor = () => {
  const { id } = useParams<{ id: string }>();
  const isEditing = id && id !== 'new';
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const [imageUrl, setImageUrl] = useState('');
  const [gallery, setGallery] = useState<string[]>([]);
  const [useCasesEn, setUseCasesEn] = useState<string[]>([]);
  const [useCasesDa, setUseCasesDa] = useState<string[]>([]);
  const [newUseCaseEn, setNewUseCaseEn] = useState('');
  const [newUseCaseDa, setNewUseCaseDa] = useState('');
  const [uploading, setUploading] = useState(false);
  const [slugManual, setSlugManual] = useState(false);

  // Extended fields
  const [composition, setComposition] = useState<CompositionItem[]>([]);
  const [originSupplier, setOriginSupplier] = useState<OriginSupplierData>({});
  const [esgImpact, setEsgImpact] = useState<ESGImpactData>({});
  const [governance, setGovernance] = useState<GovernanceData>({});
  const [sectionVisibility, setSectionVisibility] = useState<SectionVisibility>({ specs: true, use_cases: true, origin: true, esg: true, governance: true });
  const toggleSection = (key: keyof SectionVisibility) => setSectionVisibility(prev => ({ ...prev, [key]: !prev[key] }));

  const { data: categories = [] } = useCategories();
  const form = useForm<ProductForm>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      slug: '', category_id: '', name_en: '', name_da: '', description_en: '', description_da: '',
      spec_size: '', spec_weight: '', spec_material: '', featured: false, is_active: true, sort_order: 0
    },
  });

  // Auto-slug
  const nameEn = form.watch('name_en');
  useEffect(() => {
    if (!slugManual && !isEditing && nameEn) {
      form.setValue('slug', nameEn.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim());
    }
  }, [nameEn, slugManual, isEditing, form]);

  // Load existing product
  const { isLoading: fetchLoading } = useQuery({
    queryKey: ['admin-product', id],
    queryFn: async () => {
      if (!isEditing) return null;
      const { data: rawData, error } = await supabase.from('products').select('*').eq('id', id).single();
      if (error) throw error;
      const data = rawData as any;
      form.reset({
        slug: data.slug, category_id: data.category_id, name_en: data.name_en, name_da: data.name_da,
        description_en: data.description_en, description_da: data.description_da,
        spec_size: data.spec_size || '', spec_weight: data.spec_weight || '', spec_material: data.spec_material || '',
        featured: data.featured ?? false, is_active: data.is_active ?? true, sort_order: data.sort_order ?? 0
      });
      setImageUrl(data.image_url); setSlugManual(true);
      setGallery(Array.isArray(data.gallery) ? data.gallery as string[] : []);
      setUseCasesEn(Array.isArray(data.use_cases_en) ? data.use_cases_en as string[] : []);
      setUseCasesDa(Array.isArray(data.use_cases_da) ? data.use_cases_da as string[] : []);
      setComposition(Array.isArray(data.composition) ? data.composition as CompositionItem[] : []);
      setOriginSupplier(typeof data.origin_supplier === 'object' && data.origin_supplier ? data.origin_supplier as OriginSupplierData : {});
      setEsgImpact(typeof data.esg_impact === 'object' && data.esg_impact ? data.esg_impact as ESGImpactData : {});
      setGovernance(typeof data.governance === 'object' && data.governance ? data.governance as GovernanceData : {});
      setSectionVisibility(typeof data.section_visibility === 'object' && data.section_visibility ? data.section_visibility as SectionVisibility : { specs: true, use_cases: true, origin: true, esg: true, governance: true });
      return data;
    },
    enabled: !!isEditing,
  });

  // Save
  const saveMutation = useMutation({
    mutationFn: async (data: ProductForm) => {
      if (!imageUrl) throw new Error('Please upload main image');
      const productData = {
        ...data, spec_size: data.spec_size || null, spec_weight: data.spec_weight || null, spec_material: data.spec_material || null,
        image_url: imageUrl, gallery: gallery as unknown as null,
        use_cases_en: useCasesEn as unknown as null, use_cases_da: useCasesDa as unknown as null,
        composition: composition as unknown as null, origin_supplier: originSupplier as unknown as null,
        esg_impact: esgImpact as unknown as null, governance: governance as unknown as null,
        section_visibility: sectionVisibility as unknown as null,
      };
      if (isEditing) { const { error } = await supabase.from('products').update(productData as any).eq('id', id); if (error) throw error; }
      else { const { error } = await supabase.from('products').insert(productData as any); if (error) throw error; }
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-products'] }); toast({ title: `✅ Product ${isEditing ? 'updated' : 'created'}!` }); navigate('/admin/products'); },
    onError: (e: Error) => { toast({ title: e.message, variant: 'destructive' }); },
  });

  // Image upload
  const uploadImage = async (file: File) => {
    const ext = file.name.split('.').pop();
    const name = `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;
    const { error } = await supabase.storage.from('product-images').upload(name, file);
    if (error) throw error;
    return supabase.storage.from('product-images').getPublicUrl(name).data.publicUrl;
  };
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    setUploading(true);
    try { setImageUrl(await uploadImage(file)); toast({ title: '✅ Image uploaded' }); } catch { toast({ title: 'Upload failed', variant: 'destructive' }); } finally { setUploading(false); }
  };
  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files; if (!files) return;
    setUploading(true);
    try { const urls = await Promise.all(Array.from(files).map(f => uploadImage(f))); setGallery([...gallery, ...urls]); toast({ title: '✅ Gallery updated' }); } catch { toast({ title: 'Upload failed', variant: 'destructive' }); } finally { setUploading(false); }
  };

  // Helpers
  const addUseCase = (lang: 'en' | 'da') => {
    if (lang === 'en' && newUseCaseEn.trim()) { setUseCasesEn([...useCasesEn, newUseCaseEn.trim()]); setNewUseCaseEn(''); }
    if (lang === 'da' && newUseCaseDa.trim()) { setUseCasesDa([...useCasesDa, newUseCaseDa.trim()]); setNewUseCaseDa(''); }
  };
  const addCompositionItem = () => setComposition([...composition, { name_en: '', name_da: '', percentage: 0 }]);
  const updateComposition = (i: number, field: keyof CompositionItem, val: string | number) => {
    const c = [...composition]; (c[i] as any)[field] = val; setComposition(c);
  };
  const updateOrigin = (field: keyof OriginSupplierData, val: any) => setOriginSupplier({ ...originSupplier, [field]: val });
  const addOriginCert = () => updateOrigin('certifications', [...(originSupplier.certifications || []), '']);
  const updateOriginCert = (i: number, val: string) => { const c = [...(originSupplier.certifications || [])]; c[i] = val; updateOrigin('certifications', c); };

  // ESG helpers
  const addEsgMetric = () => setEsgImpact({ ...esgImpact, metrics: [...(esgImpact.metrics || []), { label_en: '', label_da: '', value: '', description_en: '', description_da: '' }] });
  const updateEsgMetric = (i: number, field: keyof ESGMetric, val: string) => { const m = [...(esgImpact.metrics || [])]; (m[i] as any)[field] = val; setEsgImpact({ ...esgImpact, metrics: m }); };
  const addSdgGoal = () => setEsgImpact({ ...esgImpact, sdg_goals: [...(esgImpact.sdg_goals || []), { number: 0, title_en: '', title_da: '' }] });
  const updateSdgGoal = (i: number, field: keyof SDGGoal, val: any) => { const g = [...(esgImpact.sdg_goals || [])]; (g[i] as any)[field] = val; setEsgImpact({ ...esgImpact, sdg_goals: g }); };

  // Governance helpers
  const addGovCert = () => setGovernance({ ...governance, certifications: [...(governance.certifications || []), { name: '', description_en: '', description_da: '' }] });
  const updateGovCert = (i: number, field: keyof CertificationItem, val: string) => { const c = [...(governance.certifications || [])]; (c[i] as any)[field] = val; setGovernance({ ...governance, certifications: c }); };
  const addCompliance = (lang: 'en' | 'da') => {
    if (lang === 'en') setGovernance({ ...governance, compliance_en: [...(governance.compliance_en || []), ''] });
    else setGovernance({ ...governance, compliance_da: [...(governance.compliance_da || []), ''] });
  };

  // Completion
  const completionFields = [
    { l: 'Name EN', f: !!form.watch('name_en')?.trim() }, { l: 'Name DA', f: !!form.watch('name_da')?.trim() },
    { l: 'Desc EN', f: !!form.watch('description_en')?.trim() }, { l: 'Desc DA', f: !!form.watch('description_da')?.trim() },
    { l: 'Image', f: !!imageUrl }, { l: 'Category', f: !!form.watch('category_id') },
    { l: 'Use Cases', f: useCasesEn.length > 0 }, { l: 'Origin', f: !!originSupplier.supplier_name },
  ];
  const pct = Math.round((completionFields.filter(f => f.f).length / completionFields.length) * 100);

  if (fetchLoading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center space-y-3"><Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" /><p className="text-sm text-muted-foreground">Loading...</p></div>
    </div>
  );

  return (
    <div className="space-y-0 max-w-7xl">
      {/* Sticky Header */}
      <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-lg border-b border-border/50 -mx-4 lg:-mx-8 px-4 lg:px-8 py-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate('/admin/products')}><ArrowLeft className="h-5 w-5" /></Button>
            <div>
              <h1 className="font-serif text-2xl font-bold">{isEditing ? 'Edit Product' : 'New Product'}</h1>
              <p className="text-sm text-muted-foreground mt-0.5">{isEditing ? 'Update product information' : 'Add a new product to your catalog'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 border">
              <div className={`h-2 w-2 rounded-full ${pct === 100 ? 'bg-green-500' : pct >= 50 ? 'bg-amber-500' : 'bg-red-400'}`} />
              <span className="text-xs font-medium text-muted-foreground">{pct}%</span>
            </div>
            <Button variant="outline" onClick={() => navigate('/admin/products')}>Cancel</Button>
            <Button disabled={saveMutation.isPending} onClick={form.handleSubmit(d => saveMutation.mutate(d))} className="gap-2 bg-primary shadow-lg shadow-primary/25">
              {saveMutation.isPending ? <><Loader2 className="h-4 w-4 animate-spin" />Saving...</> : <><Save className="h-4 w-4" />{isEditing ? 'Update' : 'Publish'}</>}
            </Button>
          </div>
        </div>
      </div>

      <form onSubmit={form.handleSubmit(d => saveMutation.mutate(d))} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* ══ MAIN CONTENT (2/3) ══ */}
          <div className="lg:col-span-2 space-y-6">

            {/* ① Basic Information */}
            <Section icon={Package} title="① Basic Information" subtitle="Core product details" color="from-primary/15 to-emerald-500/10">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-sm font-medium flex items-center gap-2"><Tag className="h-3.5 w-3.5 text-muted-foreground" />URL Slug</Label>
                  <Input {...form.register('slug')} placeholder="auto-generated" onChange={e => { form.setValue('slug', e.target.value); setSlugManual(true); }} />
                  {form.formState.errors.slug && <p className="text-xs text-destructive">{form.formState.errors.slug.message}</p>}
                  <p className="text-[11px] text-muted-foreground">ecofy.dk/products/<span className="font-mono text-foreground">{form.watch('slug') || '...'}</span></p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium flex items-center gap-2"><Layers className="h-3.5 w-3.5 text-muted-foreground" />Category</Label>
                  <Select value={form.watch('category_id')} onValueChange={v => form.setValue('category_id', v)}>
                    <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                    <SelectContent>
                      {categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name_en}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  {form.formState.errors.category_id && <p className="text-xs text-destructive">{form.formState.errors.category_id.message}</p>}
                </div>
              </div>
              <Separator />
              <TranslatableField label="Product Name" enValue={form.watch('name_en')} daValue={form.watch('name_da')} onEnChange={v => form.setValue('name_en', v)} onDaChange={v => form.setValue('name_da', v)} enPlaceholder="e.g. Premium Jute Tote Bag" daPlaceholder="f.eks. Premium Jute Taske" />
              <Separator />
              <TranslatableField label="Description" enValue={form.watch('description_en')} daValue={form.watch('description_da')} onEnChange={v => form.setValue('description_en', v)} onDaChange={v => form.setValue('description_da', v)} multiline rows={4} enPlaceholder="Product features and value..." daPlaceholder="Produktfunktioner og værdi..." />
            </Section>

            {/* ② Specifications & Composition */}
            <Section icon={Ruler} title="② Specifications & Composition" subtitle="Physical attributes — shown on detail page" color="from-blue-500/15 to-cyan-500/10" enabled={sectionVisibility.specs} onToggle={() => toggleSection('specs')}>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2"><Label className="flex items-center gap-2 text-sm"><Ruler className="h-3.5 w-3.5 text-blue-500" />Size</Label><Input {...form.register('spec_size')} placeholder="e.g. 40 x 35 cm" /></div>
                <div className="space-y-2"><Label className="flex items-center gap-2 text-sm"><Scale className="h-3.5 w-3.5 text-amber-500" />Weight</Label><Input {...form.register('spec_weight')} placeholder="e.g. 250g" /></div>
                <div className="space-y-2"><Label className="flex items-center gap-2 text-sm"><Layers className="h-3.5 w-3.5 text-emerald-500" />Material</Label><Input {...form.register('spec_material')} placeholder="e.g. 100% Jute" /></div>
              </div>
              <Separator />
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-semibold">Material Composition Breakdown</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addCompositionItem} className="gap-1"><Plus className="h-3 w-3" />Add</Button>
                </div>
                {composition.map((item, i) => (
                  <div key={i} className="grid grid-cols-[1fr_1fr_80px_32px] gap-2 items-end">
                    <div><Label className="text-xs">🇬🇧 Name</Label><Input value={item.name_en} onChange={e => updateComposition(i, 'name_en', e.target.value)} placeholder="Natural Jute" className="h-9" /></div>
                    <div><Label className="text-xs">🇩🇰 Name</Label><Input value={item.name_da} onChange={e => updateComposition(i, 'name_da', e.target.value)} placeholder="Naturlig Jute" className="h-9" /></div>
                    <div><Label className="text-xs">%</Label><Input type="number" value={item.percentage} onChange={e => updateComposition(i, 'percentage', Number(e.target.value))} className="h-9" /></div>
                    <Button type="button" variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-destructive" onClick={() => setComposition(composition.filter((_, j) => j !== i))}><X className="h-3.5 w-3.5" /></Button>
                  </div>
                ))}
              </div>
            </Section>

            {/* ③ Use Cases */}
            <Section icon={Check} title="③ Use Cases — Perfect For" subtitle="Checklist on the detail page" color="from-violet-500/15 to-purple-500/10" enabled={sectionVisibility.use_cases} onToggle={() => toggleSection('use_cases')}>
              <div className="space-y-3">
                <div className="flex items-center gap-2"><span>🇬🇧</span><Label className="text-sm font-medium">English</Label><Badge variant="secondary" className="text-[10px]">{useCasesEn.length}</Badge></div>
                <div className="flex flex-wrap gap-2">{useCasesEn.map((uc, i) => (
                  <Badge key={i} variant="secondary" className="gap-1 px-3 py-1.5 bg-primary/10 text-primary"><Check className="h-3 w-3" />{uc}<button type="button" onClick={() => setUseCasesEn(useCasesEn.filter((_, j) => j !== i))} className="ml-1 hover:text-destructive"><X className="h-3 w-3" /></button></Badge>
                ))}</div>
                <div className="flex gap-2"><Input value={newUseCaseEn} onChange={e => setNewUseCaseEn(e.target.value)} placeholder="e.g. Grocery shopping" onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addUseCase('en'); } }} /><Button type="button" variant="outline" size="icon" onClick={() => addUseCase('en')}><Plus className="h-4 w-4" /></Button></div>
              </div>
              <Separator />
              <div className="space-y-3">
                <div className="flex items-center gap-2"><span>🇩🇰</span><Label className="text-sm font-medium">Dansk</Label><Badge variant="secondary" className="text-[10px]">{useCasesDa.length}</Badge></div>
                <div className="flex flex-wrap gap-2">{useCasesDa.map((uc, i) => (
                  <Badge key={i} variant="secondary" className="gap-1 px-3 py-1.5 bg-blue-500/10 text-blue-700"><Check className="h-3 w-3" />{uc}<button type="button" onClick={() => setUseCasesDa(useCasesDa.filter((_, j) => j !== i))} className="ml-1 hover:text-destructive"><X className="h-3 w-3" /></button></Badge>
                ))}</div>
                <div className="flex gap-2"><Input value={newUseCaseDa} onChange={e => setNewUseCaseDa(e.target.value)} placeholder="f.eks. Dagligvareindkøb" onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addUseCase('da'); } }} /><Button type="button" variant="outline" size="icon" onClick={() => addUseCase('da')}><Plus className="h-4 w-4" /></Button></div>
              </div>
            </Section>

            {/* ④ Origin & Supplier */}
            <Section icon={MapPin} title="④ Origin & Supplier" subtitle="Supplier info shown on detail page" color="from-emerald-500/15 to-green-500/10" defaultOpen={false} enabled={sectionVisibility.origin} onToggle={() => toggleSection('origin')}>
              <div className="flex justify-end"><Button type="button" variant="outline" size="sm" onClick={() => setOriginSupplier(DEFAULT_ORIGIN)} className="gap-1 text-xs"><Sparkles className="h-3 w-3" />Fill defaults</Button></div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2"><Label className="text-sm">Supplier Name</Label><Input value={originSupplier.supplier_name || ''} onChange={e => updateOrigin('supplier_name', e.target.value)} placeholder="EcoFy Bangladesh" /></div>
                <div className="space-y-2"><Label className="text-sm">Location</Label><Input value={originSupplier.location || ''} onChange={e => updateOrigin('location', e.target.value)} placeholder="Dhaka, Bangladesh" /></div>
                <div className="space-y-2"><Label className="text-sm">Country Code</Label><Input value={originSupplier.country_code || ''} onChange={e => updateOrigin('country_code', e.target.value)} placeholder="BD" /></div>
                <div className="space-y-2"><Label className="text-sm">Established</Label><Input value={originSupplier.established || ''} onChange={e => updateOrigin('established', e.target.value)} placeholder="2018" /></div>
                <div className="space-y-2"><Label className="text-sm">Artisans</Label><Input value={originSupplier.artisans || ''} onChange={e => updateOrigin('artisans', e.target.value)} placeholder="150+" /></div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between"><Label className="text-sm font-semibold">Supplier Certifications</Label><Button type="button" variant="outline" size="sm" onClick={addOriginCert}><Plus className="h-3 w-3 mr-1" />Add</Button></div>
                {(originSupplier.certifications || []).map((c, i) => (
                  <div key={i} className="flex gap-2"><Input value={c} onChange={e => updateOriginCert(i, e.target.value)} placeholder="e.g. Fair Trade" className="h-9" /><Button type="button" variant="ghost" size="icon" className="h-9" onClick={() => updateOrigin('certifications', (originSupplier.certifications || []).filter((_, j) => j !== i))}><X className="h-3.5 w-3.5" /></Button></div>
                ))}
              </div>
              <Separator />
              <TranslatableField label="Artisan Story" enValue={originSupplier.story_en || ''} daValue={originSupplier.story_da || ''} onEnChange={v => updateOrigin('story_en', v)} onDaChange={v => updateOrigin('story_da', v)} multiline rows={3} />
              <TranslatableField label="Transparency Statement" enValue={originSupplier.transparency_en || ''} daValue={originSupplier.transparency_da || ''} onEnChange={v => updateOrigin('transparency_en', v)} onDaChange={v => updateOrigin('transparency_da', v)} multiline rows={2} />
            </Section>

            {/* ⑤ Sustainability & ESG */}
            <Section icon={Leaf} title="⑤ Sustainability & ESG Impact" subtitle="ESG metrics and SDG goals" color="from-green-500/15 to-emerald-500/10" defaultOpen={false} enabled={sectionVisibility.esg} onToggle={() => toggleSection('esg')}>
              <div className="flex justify-end"><Button type="button" variant="outline" size="sm" onClick={() => setEsgImpact(DEFAULT_ESG)} className="gap-1 text-xs"><Sparkles className="h-3 w-3" />Fill defaults</Button></div>
              <div className="space-y-3">
                <div className="flex items-center justify-between"><Label className="text-sm font-semibold">ESG Metrics</Label><Button type="button" variant="outline" size="sm" onClick={addEsgMetric}><Plus className="h-3 w-3 mr-1" />Add</Button></div>
                {(esgImpact.metrics || []).map((m, i) => (
                  <div key={i} className="p-3 rounded-lg border bg-muted/20 space-y-2">
                    <div className="flex justify-between items-center"><span className="text-xs font-medium text-muted-foreground">Metric {i + 1}</span><Button type="button" variant="ghost" size="icon" className="h-6 w-6" onClick={() => setEsgImpact({ ...esgImpact, metrics: (esgImpact.metrics || []).filter((_, j) => j !== i) })}><X className="h-3 w-3" /></Button></div>
                    <div className="grid grid-cols-3 gap-2">
                      <Input value={m.label_en} onChange={e => updateEsgMetric(i, 'label_en', e.target.value)} placeholder="Label EN" className="h-8 text-xs" />
                      <Input value={m.label_da} onChange={e => updateEsgMetric(i, 'label_da', e.target.value)} placeholder="Label DA" className="h-8 text-xs" />
                      <Input value={m.value} onChange={e => updateEsgMetric(i, 'value', e.target.value)} placeholder="Value e.g. -75%" className="h-8 text-xs" />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Input value={m.description_en} onChange={e => updateEsgMetric(i, 'description_en', e.target.value)} placeholder="Desc EN" className="h-8 text-xs" />
                      <Input value={m.description_da} onChange={e => updateEsgMetric(i, 'description_da', e.target.value)} placeholder="Desc DA" className="h-8 text-xs" />
                    </div>
                  </div>
                ))}
              </div>
              <Separator />
              <div className="space-y-3">
                <div className="flex items-center justify-between"><Label className="text-sm font-semibold">SDG Goals</Label><Button type="button" variant="outline" size="sm" onClick={addSdgGoal}><Plus className="h-3 w-3 mr-1" />Add</Button></div>
                {(esgImpact.sdg_goals || []).map((g, i) => (
                  <div key={i} className="grid grid-cols-[60px_1fr_1fr_32px] gap-2 items-end">
                    <div><Label className="text-xs">#</Label><Input type="number" value={g.number} onChange={e => updateSdgGoal(i, 'number', Number(e.target.value))} className="h-9" /></div>
                    <div><Label className="text-xs">🇬🇧 Title</Label><Input value={g.title_en} onChange={e => updateSdgGoal(i, 'title_en', e.target.value)} className="h-9" /></div>
                    <div><Label className="text-xs">🇩🇰 Title</Label><Input value={g.title_da} onChange={e => updateSdgGoal(i, 'title_da', e.target.value)} className="h-9" /></div>
                    <Button type="button" variant="ghost" size="icon" className="h-9" onClick={() => setEsgImpact({ ...esgImpact, sdg_goals: (esgImpact.sdg_goals || []).filter((_, j) => j !== i) })}><X className="h-3.5 w-3.5" /></Button>
                  </div>
                ))}
              </div>
              <Separator />
              <TranslatableField label="Climate Badge Text" enValue={esgImpact.climate_badge_en || ''} daValue={esgImpact.climate_badge_da || ''} onEnChange={v => setEsgImpact({ ...esgImpact, climate_badge_en: v })} onDaChange={v => setEsgImpact({ ...esgImpact, climate_badge_da: v })} />
            </Section>

            {/* ⑥ Governance & Compliance */}
            <Section icon={Shield} title="⑥ Governance & Compliance" subtitle="Certifications and compliance checks" color="from-purple-500/15 to-violet-500/10" defaultOpen={false} enabled={sectionVisibility.governance} onToggle={() => toggleSection('governance')}>
              <div className="flex justify-end"><Button type="button" variant="outline" size="sm" onClick={() => setGovernance(DEFAULT_GOVERNANCE)} className="gap-1 text-xs"><Sparkles className="h-3 w-3" />Fill defaults</Button></div>
              <div className="space-y-3">
                <div className="flex items-center justify-between"><Label className="text-sm font-semibold">Certifications</Label><Button type="button" variant="outline" size="sm" onClick={addGovCert}><Plus className="h-3 w-3 mr-1" />Add</Button></div>
                {(governance.certifications || []).map((c, i) => (
                  <div key={i} className="grid grid-cols-[1fr_1fr_1fr_32px] gap-2 items-end">
                    <div><Label className="text-xs">Name</Label><Input value={c.name} onChange={e => updateGovCert(i, 'name', e.target.value)} className="h-9" /></div>
                    <div><Label className="text-xs">🇬🇧 Desc</Label><Input value={c.description_en} onChange={e => updateGovCert(i, 'description_en', e.target.value)} className="h-9" /></div>
                    <div><Label className="text-xs">🇩🇰 Desc</Label><Input value={c.description_da} onChange={e => updateGovCert(i, 'description_da', e.target.value)} className="h-9" /></div>
                    <Button type="button" variant="ghost" size="icon" className="h-9" onClick={() => setGovernance({ ...governance, certifications: (governance.certifications || []).filter((_, j) => j !== i) })}><X className="h-3.5 w-3.5" /></Button>
                  </div>
                ))}
              </div>
              <Separator />
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-3">
                  <div className="flex items-center justify-between"><Label className="text-sm">🇬🇧 Compliance Checks</Label><Button type="button" variant="outline" size="sm" onClick={() => addCompliance('en')}><Plus className="h-3 w-3" /></Button></div>
                  {(governance.compliance_en || []).map((c, i) => (
                    <div key={i} className="flex gap-2"><Input value={c} onChange={e => { const a = [...(governance.compliance_en || [])]; a[i] = e.target.value; setGovernance({ ...governance, compliance_en: a }); }} className="h-9" /><Button type="button" variant="ghost" size="icon" className="h-9" onClick={() => setGovernance({ ...governance, compliance_en: (governance.compliance_en || []).filter((_, j) => j !== i) })}><X className="h-3 w-3" /></Button></div>
                  ))}
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between"><Label className="text-sm">🇩🇰 Compliance Checks</Label><Button type="button" variant="outline" size="sm" onClick={() => addCompliance('da')}><Plus className="h-3 w-3" /></Button></div>
                  {(governance.compliance_da || []).map((c, i) => (
                    <div key={i} className="flex gap-2"><Input value={c} onChange={e => { const a = [...(governance.compliance_da || [])]; a[i] = e.target.value; setGovernance({ ...governance, compliance_da: a }); }} className="h-9" /><Button type="button" variant="ghost" size="icon" className="h-9" onClick={() => setGovernance({ ...governance, compliance_da: (governance.compliance_da || []).filter((_, j) => j !== i) })}><X className="h-3 w-3" /></Button></div>
                  ))}
                </div>
              </div>
              <Separator />
              <TranslatableField label="Quality Assurance Statement" enValue={governance.qa_statement_en || ''} daValue={governance.qa_statement_da || ''} onEnChange={v => setGovernance({ ...governance, qa_statement_en: v })} onDaChange={v => setGovernance({ ...governance, qa_statement_da: v })} multiline rows={2} />
            </Section>
          </div>

          {/* ══ RIGHT SIDEBAR (1/3) ══ */}
          <div className="space-y-6">
            {/* Publish Settings */}
            <Card className="shadow-sm"><CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><Sparkles className="h-4 w-4 text-amber-500" />Publish Settings</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border"><div><Label className="text-sm font-medium">Active</Label><p className="text-[11px] text-muted-foreground">Visible on website</p></div><Switch checked={form.watch('is_active')} onCheckedChange={c => form.setValue('is_active', c)} /></div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border"><div><Label className="text-sm font-medium">Featured</Label><p className="text-[11px] text-muted-foreground">Show on homepage</p></div><Switch checked={form.watch('featured')} onCheckedChange={c => form.setValue('featured', c)} /></div>
                <div className="space-y-2"><Label className="text-sm">Sort Order</Label><Input type="number" {...form.register('sort_order', { valueAsNumber: true })} className="h-9" /></div>
              </CardContent>
            </Card>

            {/* Main Image */}
            <Card className="shadow-sm"><CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><ImagePlus className="h-4 w-4 text-primary" />Main Image{!imageUrl && <Badge variant="destructive" className="text-[10px] ml-auto">Required</Badge>}</CardTitle></CardHeader>
              <CardContent>
                {imageUrl ? (
                  <div className="relative group">
                    <img src={imageUrl} alt="Product" className="w-full aspect-[4/3] object-cover rounded-xl border" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors rounded-xl flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                        <Button type="button" variant="secondary" size="sm" onClick={() => fileInputRef.current?.click()}><Upload className="h-3 w-3 mr-1" />Replace</Button>
                        <Button type="button" variant="destructive" size="sm" onClick={() => setImageUrl('')}><Trash2 className="h-3 w-3 mr-1" />Remove</Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div onClick={() => fileInputRef.current?.click()} className="aspect-[4/3] border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all">
                    {uploading ? <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /> : <><Upload className="h-6 w-6 text-muted-foreground mb-2" /><p className="text-sm text-muted-foreground">Click to upload</p></>}
                  </div>
                )}
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              </CardContent>
            </Card>

            {/* Gallery */}
            <Card className="shadow-sm"><CardHeader className="pb-3"><div className="flex items-center justify-between"><CardTitle className="text-base flex items-center gap-2"><Layers className="h-4 w-4 text-violet-500" />Gallery</CardTitle><Badge variant="secondary" className="text-[10px]">{gallery.length}</Badge></div></CardHeader>
              <CardContent>
                {gallery.length > 0 && <div className="grid grid-cols-3 gap-2 mb-3">{gallery.map((url, i) => (
                  <div key={i} className="relative group"><img src={url} alt="" className="w-full aspect-square object-cover rounded-lg border" /><button type="button" className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-destructive text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => setGallery(gallery.filter((_, j) => j !== i))}><X className="h-3 w-3" /></button></div>
                ))}</div>}
                <label className="flex items-center justify-center gap-2 p-4 border-2 border-dashed rounded-xl cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all">
                  {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><ImagePlus className="h-4 w-4 text-muted-foreground" /><span className="text-sm text-muted-foreground">Add images</span></>}
                  <input ref={galleryInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleGalleryUpload} />
                </label>
              </CardContent>
            </Card>

            {/* Readiness */}
            <Card className="shadow-sm"><CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><Globe className="h-4 w-4 text-blue-500" />Content Readiness</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs"><span className="text-muted-foreground">Completion</span><span className={`font-bold ${pct === 100 ? 'text-green-600' : 'text-amber-600'}`}>{pct}%</span></div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden"><div className={`h-full rounded-full transition-all ${pct === 100 ? 'bg-green-500' : 'bg-amber-500'}`} style={{ width: `${pct}%` }} /></div>
                </div>
                <div className="space-y-1">{completionFields.map(f => (
                  <div key={f.l} className="flex items-center gap-2 text-xs">
                    <div className={`h-4 w-4 rounded-full flex items-center justify-center ${f.f ? 'bg-green-100' : 'bg-muted'}`}>{f.f ? <Check className="h-2.5 w-2.5 text-green-600" /> : <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground/30" />}</div>
                    <span className={f.f ? 'text-foreground' : 'text-muted-foreground'}>{f.l}</span>
                  </div>
                ))}</div>
                <Separator />
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">🔍 Google Preview</p>
                  <div className="rounded-lg border bg-white dark:bg-gray-950 p-3 space-y-0.5">
                    <p className="text-[13px] text-blue-700 font-medium line-clamp-1">{form.watch('name_en') || 'Product Name'} — Ecofy</p>
                    <p className="text-[11px] text-green-700">ecofy.dk/products/{form.watch('slug') || '...'}</p>
                    <p className="text-[11px] text-muted-foreground line-clamp-2">{form.watch('description_en')?.slice(0, 160) || 'Description...'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProductEditor;
