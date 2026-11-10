import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Shield,
  ArrowLeft,
  Save,
  Plus,
  ArrowUp,
  ArrowDown,
  Trash2,
  ExternalLink,
  Eye,
  CheckCircle2,
  Clock,
  Layers,
  Archive,
  AlertCircle,
  Edit2,
  BookOpen,
  Code2,
  Star,
  Zap,
} from 'lucide-react';
import { api } from '../services/api';
import PageContainer from '../components/layout/PageContainer';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import ErrorAlert from '../components/ui/ErrorAlert';
import { Skeleton } from '../components/ui/Skeleton';

export default function AdminRoadmapEditor() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [roadmap, setRoadmap] = useState(null);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingMeta, setSavingMeta] = useState(false);
  const [error, setError] = useState(null);
  const [statusMessage, setStatusMessage] = useState(null);

  // Metadata form
  const [formData, setFormData] = useState({
    title: '',
    outcome: '',
    level: 'Beginner',
    estimatedHours: 30,
    weeklyPaceHours: 5,
    status: 'draft',
    curator: '',
    intendedAudience: '',
    prerequisitesText: '',
    whatIsOutOfScopeText: '',
  });

  // Modal: Add / Edit Module
  const [moduleModalOpen, setModuleModalOpen] = useState(false);
  const [editingModule, setEditingModule] = useState(null);
  const [moduleTitle, setModuleTitle] = useState('');
  const [modulePhase, setModulePhase] = useState('Phase 1: Foundations');
  const [moduleDesc, setModuleDesc] = useState('');
  const [submittingModule, setSubmittingModule] = useState(false);

  // Modal: Add / Edit Topic
  const [topicModalOpen, setTopicModalOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState(null);
  const [topicTargetModuleId, setTopicTargetModuleId] = useState('');
  const [topicTitle, setTopicTitle] = useState('');
  const [topicKey, setTopicKey] = useState('');
  const [topicType, setTopicType] = useState('core');
  const [topicMinutes, setTopicMinutes] = useState(45);
  const [topicBuildsOn, setTopicBuildsOn] = useState('');
  const [topicObjectivesText, setTopicObjectivesText] = useState('');
  const [topicResources, setTopicResources] = useState([]);
  const [topicPractice, setTopicPractice] = useState([]);
  const [submittingTopic, setSubmittingTopic] = useState(false);

  // Archive Confirm Modal
  const [archiveTargetTopic, setArchiveTargetTopic] = useState(null);
  const [archiving, setArchiving] = useState(false);

  const fetchRoadmap = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.admin.getRoadmap(slug);
      const rm = res.data?.roadmap;
      const mods = res.data?.modules || [];

      setRoadmap(rm);
      setModules(mods);

      if (rm) {
        setFormData({
          title: rm.title || '',
          outcome: rm.outcome || '',
          level: rm.level || 'Beginner',
          estimatedHours: rm.estimatedHours || 30,
          weeklyPaceHours: rm.weeklyPaceHours || 5,
          status: rm.status || 'draft',
          curator: rm.curator || '',
          intendedAudience: rm.intendedAudience || '',
          prerequisitesText: (rm.prerequisites || []).join('\n'),
          whatIsOutOfScopeText: (rm.whatIsOutOfScope || []).join('\n'),
        });
      }
    } catch (err) {
      setError(err.message || 'Failed to load roadmap.');
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchRoadmap();
  }, [fetchRoadmap]);

  const handleSaveMetadata = async (e) => {
    e.preventDefault();
    setSavingMeta(true);
    setError(null);
    try {
      const prerequisites = formData.prerequisitesText
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);

      const whatIsOutOfScope = formData.whatIsOutOfScopeText
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);

      await api.admin.updateRoadmap(roadmap.id, {
        title: formData.title.trim(),
        outcome: formData.outcome.trim(),
        level: formData.level,
        estimatedHours: Number(formData.estimatedHours) || 30,
        weeklyPaceHours: Number(formData.weeklyPaceHours) || 5,
        status: formData.status,
        curator: formData.curator.trim(),
        intendedAudience: formData.intendedAudience.trim(),
        prerequisites,
        whatIsOutOfScope,
      });

      setStatusMessage('Roadmap settings saved successfully.');
      setTimeout(() => setStatusMessage(null), 4000);
      await fetchRoadmap();
    } catch (err) {
      setError(err.message || 'Failed to save roadmap settings.');
    } finally {
      setSavingMeta(false);
    }
  };

  // Reorder Modules
  const handleMoveModule = async (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= modules.length) return;

    const reordered = [...modules];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIndex, 0, moved);

    setModules(reordered); // optimistic
    try {
      await api.admin.reorderModules(
        roadmap.id,
        reordered.map((m) => m.id)
      );
    } catch (err) {
      setError(err.message || 'Failed to reorder modules.');
      await fetchRoadmap(); // rollback
    }
  };

  // Reorder Topics within Module
  const handleMoveTopic = async (moduleId, topicIndex, direction) => {
    const mod = modules.find((m) => m.id === moduleId);
    if (!mod) return;

    const targetIndex = topicIndex + direction;
    if (targetIndex < 0 || targetIndex >= mod.topics.length) return;

    const reorderedTopics = [...mod.topics];
    const [moved] = reorderedTopics.splice(topicIndex, 1);
    reorderedTopics.splice(targetIndex, 0, moved);

    // Optimistic local update
    setModules((prev) =>
      prev.map((m) => (m.id === moduleId ? { ...m, topics: reorderedTopics } : m))
    );

    try {
      await api.admin.reorderTopics(
        moduleId,
        reorderedTopics.map((t) => t.id)
      );
    } catch (err) {
      setError(err.message || 'Failed to reorder topics.');
      await fetchRoadmap();
    }
  };

  // Module Modal Helpers
  const openCreateModule = () => {
    setEditingModule(null);
    setModuleTitle('');
    setModulePhase(`Phase ${modules.length + 1}: Implementation`);
    setModuleDesc('');
    setModuleModalOpen(true);
  };

  const openEditModule = (mod) => {
    setEditingModule(mod);
    setModuleTitle(mod.title);
    setModulePhase(mod.phaseLabel);
    setModuleDesc(mod.description || '');
    setModuleModalOpen(true);
  };

  const handleSaveModule = async (e) => {
    e.preventDefault();
    setSubmittingModule(true);
    try {
      if (editingModule) {
        await api.admin.updateModule(editingModule.id, {
          title: moduleTitle.trim(),
          phaseLabel: modulePhase.trim(),
          description: moduleDesc.trim(),
        });
      } else {
        await api.admin.createModule(roadmap.id, {
          title: moduleTitle.trim(),
          phaseLabel: modulePhase.trim(),
          description: moduleDesc.trim(),
        });
      }
      setModuleModalOpen(false);
      await fetchRoadmap();
    } catch (err) {
      setError(err.message || 'Failed to save module.');
    } finally {
      setSubmittingModule(false);
    }
  };

  // Topic Modal Helpers
  const openCreateTopic = (moduleId) => {
    setEditingTopic(null);
    setTopicTargetModuleId(moduleId);
    setTopicTitle('');
    setTopicKey('');
    setTopicType('core');
    setTopicMinutes(45);
    setTopicBuildsOn('');
    setTopicObjectivesText('');
    setTopicResources([]);
    setTopicPractice([]);
    setTopicModalOpen(true);
  };

  const openEditTopic = (moduleId, topic) => {
    setEditingTopic(topic);
    setTopicTargetModuleId(moduleId);
    setTopicTitle(topic.title);
    setTopicKey(topic.key);
    setTopicType(topic.type || 'core');
    setTopicMinutes(topic.estimatedMinutes || 45);
    setTopicBuildsOn(topic.buildsOnNote || '');
    setTopicObjectivesText((topic.objectives || []).join('\n'));
    setTopicResources(topic.resources || []);
    setTopicPractice(topic.practiceItems || []);
    setTopicModalOpen(true);
  };

  const handleTopicTitleChange = (val) => {
    setTopicTitle(val);
    if (!editingTopic) {
      const autoKey = val
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setTopicKey(autoKey);
    }
  };

  const handleAddResource = () => {
    setTopicResources((prev) => [
      ...prev,
      {
        title: '',
        url: '',
        type: 'Documentation',
        role: 'primary',
        duration: '20 mins',
      },
    ]);
  };

  const handleUpdateResource = (idx, field, value) => {
    setTopicResources((prev) => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [field]: value };
      return copy;
    });
  };

  const handleRemoveResource = (idx) => {
    setTopicResources((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleAddPractice = () => {
    setTopicPractice((prev) => [
      ...prev,
      {
        title: '',
        url: '',
        difficulty: 'Easy',
        description: '',
      },
    ]);
  };

  const handleUpdatePractice = (idx, field, value) => {
    setTopicPractice((prev) => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [field]: value };
      return copy;
    });
  };

  const handleRemovePractice = (idx) => {
    setTopicPractice((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSaveTopic = async (e) => {
    e.preventDefault();
    setSubmittingTopic(true);
    try {
      const objectives = topicObjectivesText
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);

      const topicPayload = {
        title: topicTitle.trim(),
        key: topicKey.trim(),
        type: topicType,
        estimatedMinutes: Number(topicMinutes) || 45,
        buildsOnNote: topicBuildsOn.trim(),
        objectives,
        resources: topicResources.filter((r) => r.title && r.url),
        practiceItems: topicPractice.filter((p) => p.title && p.url),
      };

      if (editingTopic) {
        await api.admin.updateTopic(editingTopic.id, topicPayload);
      } else {
        await api.admin.createTopic(topicTargetModuleId, topicPayload);
      }
      setTopicModalOpen(false);
      await fetchRoadmap();
    } catch (err) {
      setError(err.message || 'Failed to save topic.');
    } finally {
      setSubmittingTopic(false);
    }
  };

  const handleArchiveTopic = async () => {
    if (!archiveTargetTopic) return;
    setArchiving(true);
    try {
      await api.admin.archiveTopic(archiveTargetTopic.id);
      setArchiveTargetTopic(null);
      await fetchRoadmap();
    } catch (err) {
      setError(err.message || 'Failed to archive topic.');
    } finally {
      setArchiving(false);
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <div className="space-y-6 animate-pulse">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-10 w-2/3" />
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </PageContainer>
    );
  }

  if (!roadmap) {
    return (
      <PageContainer>
        <ErrorAlert
          title="Roadmap not found"
          message={`Could not find roadmap with slug "${slug}".`}
          onRetry={() => navigate('/admin')}
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      {/* Back button and quick actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <Link
          to="/admin"
          className="inline-flex items-center text-xs font-semibold text-ink-muted hover:text-ink transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Curator Dashboard
        </Link>

        <div className="flex items-center gap-2">
          {roadmap.status === 'published' && (
            <Link to={`/roadmaps/${roadmap.slug}`} target="_blank" rel="noopener noreferrer">
              <Button variant="secondary" size="sm" className="text-xs">
                <Eye className="w-3.5 h-3.5 mr-1" />
                Preview Live Page
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Title & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge
              variant={
                roadmap.status === 'published'
                  ? 'brand'
                  : roadmap.status === 'draft'
                  ? 'accent'
                  : 'neutral'
              }
              size="sm"
            >
              {roadmap.status}
            </Badge>
            <span className="text-xs font-mono text-ink-muted">/{roadmap.slug}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
            {roadmap.title}
          </h1>
        </div>
      </div>

      {/* Global Alerts */}
      {statusMessage && (
        <div className="mb-6 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {error && (
        <ErrorAlert
          title="Editor Notice"
          message={error}
          onRetry={fetchRoadmap}
          className="mb-6"
        />
      )}

      {/* Layout: Left/Main is Curriculum Tree, Right is Metadata Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Modules & Topics Tree (2 cols wide) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-ink flex items-center gap-2">
              <Layers className="w-5 h-5 text-brand" />
              Curriculum Structure ({modules.length} modules)
            </h2>
            <Button size="sm" onClick={openCreateModule}>
              <Plus className="w-4 h-4 mr-1" />
              Add Module
            </Button>
          </div>

          {modules.length === 0 ? (
            <Card className="p-8 text-center bg-surface">
              <Layers className="w-10 h-10 mx-auto text-ink-muted mb-2" />
              <h3 className="text-sm font-semibold text-ink">No modules created yet</h3>
              <p className="text-xs text-ink-muted mt-1 max-w-sm mx-auto">
                Begin structuring this roadmap by adding the first learning phase or core module.
              </p>
              <Button size="sm" className="mt-4" onClick={openCreateModule}>
                <Plus className="w-4 h-4 mr-1" />
                Create First Module
              </Button>
            </Card>
          ) : (
            <div className="space-y-4">
              {modules.map((mod, modIdx) => (
                <Card key={mod.id} className="p-5 bg-surface border border-border space-y-4">
                  {/* Module Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-brand">
                        {mod.phaseLabel}
                      </span>
                      <h3 className="text-base font-bold text-ink">{mod.title}</h3>
                      {mod.description && (
                        <p className="text-xs text-ink-muted mt-0.5">{mod.description}</p>
                      )}
                    </div>

                    {/* Module Controls */}
                    <div className="flex items-center gap-1 self-start sm:self-auto shrink-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={modIdx === 0}
                        onClick={() => handleMoveModule(modIdx, -1)}
                        className="p-1 h-7 w-7 text-ink-muted"
                        title="Move module up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={modIdx === modules.length - 1}
                        onClick={() => handleMoveModule(modIdx, 1)}
                        className="p-1 h-7 w-7 text-ink-muted"
                        title="Move module down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditModule(mod)}
                        className="text-xs px-2 h-7 text-ink-muted hover:text-ink"
                      >
                        <Edit2 className="w-3 h-3 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => openCreateTopic(mod.id)}
                        className="text-xs px-2.5 h-7"
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        Add Topic
                      </Button>
                    </div>
                  </div>

                  {/* Topics List within Module */}
                  <div className="space-y-2">
                    {mod.topics.length === 0 ? (
                      <p className="text-xs text-ink-subtle italic py-2">
                        No topics in this module. Add a topic above to begin curriculum sequencing.
                      </p>
                    ) : (
                      mod.topics.map((t, tIdx) => {
                        const typeConfig = {
                          core: { variant: 'brand', label: 'Core', icon: Layers },
                          optional: { variant: 'info', label: 'Optional', icon: Star },
                          stretch: { variant: 'accent', label: 'Stretch', icon: Zap },
                        };
                        const config = typeConfig[t.type] || typeConfig.core;

                        return (
                          <div
                            key={t.id}
                            className="p-3 rounded-lg border border-border bg-canvas hover:border-brand/30 flex items-center justify-between gap-3 transition-colors"
                          >
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap mb-0.5">
                                <Badge variant={config.variant} size="xs">
                                  {config.label}
                                </Badge>
                                <span className="text-xs font-semibold text-ink truncate">
                                  {t.title}
                                </span>
                              </div>
                              <div className="flex items-center gap-3 text-[11px] text-ink-muted">
                                <span className="font-mono text-ink-subtle">{t.key}</span>
                                <span>·</span>
                                <span>~{t.estimatedMinutes}m</span>
                                <span>·</span>
                                <span>{(t.resources || []).length} resources</span>
                                <span>·</span>
                                <span>{(t.practiceItems || []).length} practice</span>
                              </div>
                            </div>

                            {/* Topic Ordering and Actions */}
                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                disabled={tIdx === 0}
                                onClick={() => handleMoveTopic(mod.id, tIdx, -1)}
                                className="p-1 text-ink-muted hover:text-ink disabled:opacity-30 disabled:hover:text-ink-muted"
                                title="Move topic up"
                              >
                                <ArrowUp className="w-3.5 h-3.5" />
                              </button>
                              <button
                                disabled={tIdx === mod.topics.length - 1}
                                onClick={() => handleMoveTopic(mod.id, tIdx, 1)}
                                className="p-1 text-ink-muted hover:text-ink disabled:opacity-30 disabled:hover:text-ink-muted"
                                title="Move topic down"
                              >
                                <ArrowDown className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => openEditTopic(mod.id, t)}
                                className="p-1 text-ink-muted hover:text-brand"
                                title="Edit topic details"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => setArchiveTargetTopic(t)}
                                className="p-1 text-ink-muted hover:text-red-500"
                                title="Archive topic"
                              >
                                <Archive className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </Card>
              ))}

              <div className="pt-2 text-center">
                <Button variant="secondary" onClick={openCreateModule} className="w-full sm:w-auto">
                  <Plus className="w-4 h-4 mr-1.5" />
                  Add Another Module
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Roadmap Metadata Form */}
        <div>
          <Card className="p-5 bg-surface sticky top-20 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <h3 className="text-sm font-bold text-ink flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-brand" />
                Roadmap Metadata
              </h3>
              <Badge
                variant={
                  roadmap.status === 'published'
                    ? 'brand'
                    : roadmap.status === 'draft'
                    ? 'accent'
                    : 'neutral'
                }
                size="xs"
              >
                {roadmap.status}
              </Badge>
            </div>

            <form onSubmit={handleSaveMetadata} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-ink-muted uppercase tracking-wider">
                  Roadmap Title
                </label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-ink-muted uppercase tracking-wider">
                  Target Outcome
                </label>
                <textarea
                  value={formData.outcome}
                  onChange={(e) => setFormData({ ...formData, outcome: e.target.value })}
                  rows={2}
                  required
                  className="w-full px-3 py-2 rounded-lg border border-border bg-canvas text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-ink-muted uppercase tracking-wider">
                    Level
                  </label>
                  <select
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-canvas text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="All Levels">All Levels</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-ink-muted uppercase tracking-wider">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-canvas text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-ink-muted uppercase tracking-wider">
                    Est. Hours
                  </label>
                  <Input
                    type="number"
                    min="1"
                    value={formData.estimatedHours}
                    onChange={(e) => setFormData({ ...formData, estimatedHours: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-ink-muted uppercase tracking-wider">
                    Weekly Pace
                  </label>
                  <Input
                    type="number"
                    min="1"
                    value={formData.weeklyPaceHours}
                    onChange={(e) => setFormData({ ...formData, weeklyPaceHours: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-ink-muted uppercase tracking-wider">
                  Curator
                </label>
                <Input
                  value={formData.curator}
                  onChange={(e) => setFormData({ ...formData, curator: e.target.value })}
                  placeholder="e.g. Core Engineering Team"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-ink-muted uppercase tracking-wider">
                  Prerequisites (one per line)
                </label>
                <textarea
                  value={formData.prerequisitesText}
                  onChange={(e) =>
                    setFormData({ ...formData, prerequisitesText: e.target.value })
                  }
                  rows={2}
                  placeholder="Basic Python syntax&#10;Discrete mathematics"
                  className="w-full px-3 py-2 rounded-lg border border-border bg-canvas text-xs text-ink focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-ink-muted uppercase tracking-wider">
                  Out of Scope (one per line)
                </label>
                <textarea
                  value={formData.whatIsOutOfScopeText}
                  onChange={(e) =>
                    setFormData({ ...formData, whatIsOutOfScopeText: e.target.value })
                  }
                  rows={2}
                  placeholder="Competitive programming tricks&#10;Framework specific syntax"
                  className="w-full px-3 py-2 rounded-lg border border-border bg-canvas text-xs text-ink focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand font-mono"
                />
              </div>

              <Button type="submit" loading={savingMeta} className="w-full">
                <Save className="w-4 h-4 mr-1.5" />
                Save Roadmap Settings
              </Button>
            </form>
          </Card>
        </div>
      </div>

      {/* Module Create/Edit Modal */}
      <Modal
        isOpen={moduleModalOpen}
        onClose={() => setModuleModalOpen(false)}
        title={editingModule ? 'Edit Module' : 'Create Module'}
        description="Organize topics into clear learning phases and progressive modules."
      >
        <form onSubmit={handleSaveModule} className="space-y-4">
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-ink-muted uppercase tracking-wider">
              Phase Label <span className="text-red-500">*</span>
            </label>
            <Input
              value={modulePhase}
              onChange={(e) => setModulePhase(e.target.value)}
              placeholder="e.g. Phase 1: Core Fundamentals"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-ink-muted uppercase tracking-wider">
              Module Title <span className="text-red-500">*</span>
            </label>
            <Input
              value={moduleTitle}
              onChange={(e) => setModuleTitle(e.target.value)}
              placeholder="e.g. Asymptotic Complexity & Arrays"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-ink-muted uppercase tracking-wider">
              Description (optional)
            </label>
            <textarea
              value={moduleDesc}
              onChange={(e) => setModuleDesc(e.target.value)}
              rows={2}
              placeholder="Brief summary of what this module covers..."
              className="w-full px-3 py-2 rounded-lg border border-border bg-canvas text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand"
            />
          </div>

          <div className="pt-2 border-t border-border flex justify-end gap-2">
            <Button variant="secondary" type="button" onClick={() => setModuleModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={submittingModule}>
              {editingModule ? 'Save Changes' : 'Create Module'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Topic Create/Edit Modal */}
      <Modal
        isOpen={topicModalOpen}
        onClose={() => setTopicModalOpen(false)}
        title={editingTopic ? 'Edit Topic' : 'Add New Topic'}
        description="Configure topic curriculum, learning objectives, resources, and practice items."
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSaveTopic} className="space-y-4 max-h-[75vh] overflow-y-auto px-1">
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-ink-muted uppercase tracking-wider">
              Topic Title <span className="text-red-500">*</span>
            </label>
            <Input
              value={topicTitle}
              onChange={(e) => handleTopicTitleChange(e.target.value)}
              placeholder="e.g. Balanced Binary Search Trees"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-ink-muted uppercase tracking-wider">
                Stable Key <span className="text-red-500">*</span>
              </label>
              <Input
                value={topicKey}
                onChange={(e) => setTopicKey(e.target.value)}
                placeholder="balanced-trees"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-ink-muted uppercase tracking-wider">
                Type
              </label>
              <select
                value={topicType}
                onChange={(e) => setTopicType(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-canvas text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand"
              >
                <option value="core">Core (Counts in progress fraction)</option>
                <option value="optional">Optional</option>
                <option value="stretch">Stretch</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-ink-muted uppercase tracking-wider">
                Est. Minutes
              </label>
              <Input
                type="number"
                min="5"
                value={topicMinutes}
                onChange={(e) => setTopicMinutes(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-ink-muted uppercase tracking-wider">
              Builds On (optional note)
            </label>
            <Input
              value={topicBuildsOn}
              onChange={(e) => setTopicBuildsOn(e.target.value)}
              placeholder="e.g. Basic binary trees and recursive traversals"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-ink-muted uppercase tracking-wider">
              Learning Objectives (one per line)
            </label>
            <textarea
              value={topicObjectivesText}
              onChange={(e) => setTopicObjectivesText(e.target.value)}
              rows={3}
              placeholder="Understand AVL tree rotation mechanics&#10;Implement self-balancing insert algorithm"
              className="w-full px-3 py-2 rounded-lg border border-border bg-canvas text-xs text-ink focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand font-mono"
            />
          </div>

          {/* Embedded Resources Editor */}
          <div className="space-y-2 pt-2 border-t border-border">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-ink-muted uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-brand" />
                Curated Resources ({topicResources.length})
              </label>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={handleAddResource}
                className="text-xs px-2 h-7"
              >
                <Plus className="w-3 h-3 mr-1" />
                Add Resource
              </Button>
            </div>

            {topicResources.map((res, rIdx) => (
              <div
                key={rIdx}
                className="p-3 rounded-lg border border-border bg-surface-subtle space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-ink">Resource #{rIdx + 1}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveResource(rIdx)}
                    className="text-ink-muted hover:text-red-500"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <Input
                    placeholder="Resource title"
                    value={res.title}
                    onChange={(e) => handleUpdateResource(rIdx, 'title', e.target.value)}
                    required
                  />
                  <Input
                    placeholder="https://..."
                    value={res.url}
                    onChange={(e) => handleUpdateResource(rIdx, 'url', e.target.value)}
                    required
                  />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <select
                    value={res.type}
                    onChange={(e) => handleUpdateResource(rIdx, 'type', e.target.value)}
                    className="px-2 py-1 rounded border border-border bg-canvas text-xs"
                  >
                    <option value="Documentation">Documentation</option>
                    <option value="Article">Article</option>
                    <option value="Video">Video</option>
                    <option value="Tutorial">Tutorial</option>
                  </select>
                  <select
                    value={res.role}
                    onChange={(e) => handleUpdateResource(rIdx, 'role', e.target.value)}
                    className="px-2 py-1 rounded border border-border bg-canvas text-xs"
                  >
                    <option value="primary">Primary</option>
                    <option value="alternate">Alternate</option>
                    <option value="optional_reading">Optional</option>
                  </select>
                  <Input
                    placeholder="Duration (e.g. 20m)"
                    value={res.duration}
                    onChange={(e) => handleUpdateResource(rIdx, 'duration', e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Embedded Practice Items Editor */}
          <div className="space-y-2 pt-2 border-t border-border">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-ink-muted uppercase tracking-wider flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5 text-brand" />
                Practice Problems ({topicPractice.length})
              </label>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={handleAddPractice}
                className="text-xs px-2 h-7"
              >
                <Plus className="w-3 h-3 mr-1" />
                Add Practice
              </Button>
            </div>

            {topicPractice.map((prac, pIdx) => (
              <div
                key={pIdx}
                className="p-3 rounded-lg border border-border bg-surface-subtle space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-ink">Exercise #{pIdx + 1}</span>
                  <button
                    type="button"
                    onClick={() => handleRemovePractice(pIdx)}
                    className="text-ink-muted hover:text-red-500"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <Input
                    placeholder="Problem title"
                    value={prac.title}
                    onChange={(e) => handleUpdatePractice(pIdx, 'title', e.target.value)}
                    required
                  />
                  <Input
                    placeholder="https://..."
                    value={prac.url}
                    onChange={(e) => handleUpdatePractice(pIdx, 'url', e.target.value)}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={prac.difficulty}
                    onChange={(e) => handleUpdatePractice(pIdx, 'difficulty', e.target.value)}
                    className="px-2 py-1 rounded border border-border bg-canvas text-xs"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                  <Input
                    placeholder="Brief description / instructions"
                    value={prac.description}
                    onChange={(e) => handleUpdatePractice(pIdx, 'description', e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-border flex justify-end gap-2">
            <Button variant="secondary" type="button" onClick={() => setTopicModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={submittingTopic}>
              {editingTopic ? 'Save Topic Changes' : 'Create Topic'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Archive Topic Confirmation Modal */}
      <Modal
        isOpen={!!archiveTargetTopic}
        onClose={() => setArchiveTargetTopic(null)}
        title="Archive Topic Safely?"
        description={`Are you sure you want to archive "${archiveTargetTopic?.title}"?`}
      >
        <div className="space-y-4">
          <p className="text-xs text-ink-muted leading-relaxed">
            Archiving removes this topic from active learner pathways without hard-deleting it.
            Any learner who previously completed this topic will retain their study history intact.
          </p>
          <div className="pt-3 border-t border-border flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setArchiveTargetTopic(null)}>
              Cancel
            </Button>
            <Button variant="danger" loading={archiving} onClick={handleArchiveTopic}>
              Archive Topic
            </Button>
          </div>
        </div>
      </Modal>
    </PageContainer>
  );
}
