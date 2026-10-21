import React, { useState, useEffect } from 'react';
import { 
  Megaphone, Plus, Search, Calendar, Link, CheckCircle2, 
  AlertCircle, Trash2, Edit3, Eye, Sparkles, Video, Bell, 
  ExternalLink, Clock, ShieldCheck, RefreshCw, X, Check
} from 'lucide-react';
import { 
  fetchAllAnnouncements, 
  createAnnouncement, 
  updateAnnouncement, 
  toggleAnnouncementActive, 
  deleteAnnouncement 
} from '../../services/announcementService';
import { toBengaliNumber, formatRelativeTimeBn } from '../../services/adminService';

const NOTICE_TYPES = {
  info: { label: 'সাধারণ নোটিশ', icon: Bell, bg: 'bg-blue-500/15 text-blue-400 border-blue-500/30' },
  urgent: { label: 'জরুরি ঘোষণা', icon: AlertCircle, bg: 'bg-rose-500/15 text-rose-400 border-rose-500/30' },
  success: { label: 'সুসংবাদ / অর্জন', icon: Sparkles, bg: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' },
  class: { label: 'লাইভ ক্লাস / লিংক', icon: Video, bg: 'bg-purple-500/15 text-purple-400 border-purple-500/30' }
};

export default function NoticesManagerTab() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all'); // all, active, inactive
  const [searchQuery, setSearchQuery] = useState('');

  // Form Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'info',
    linkText: '',
    linkUrl: '',
    isActive: true,
    expiresAt: ''
  });
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  const loadNotices = async () => {
    setLoading(true);
    try {
      const data = await fetchAllAnnouncements();
      setAnnouncements(data || []);
    } catch (err) {
      console.warn('Failed to fetch announcements:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotices();
  }, []);

  const handleOpenCreateModal = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      message: '',
      type: 'info',
      linkText: '',
      linkUrl: '',
      isActive: true,
      expiresAt: ''
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title || '',
      message: item.message || '',
      type: item.type || 'info',
      linkText: item.linkText || '',
      linkUrl: item.linkUrl || '',
      isActive: item.isActive !== false,
      expiresAt: item.expiresAt ? item.expiresAt.split('T')[0] : ''
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.title.trim()) {
      setFormError('দয়া করে নোটিশের শিরোনাম লিখুন');
      return;
    }

    setSaving(true);
    try {
      if (editingItem) {
        await updateAnnouncement(editingItem.id, {
          title: formData.title,
          message: formData.message,
          type: formData.type,
          linkText: formData.linkText,
          linkUrl: formData.linkUrl,
          isActive: formData.isActive,
          expiresAt: formData.expiresAt ? new Date(formData.expiresAt).toISOString() : null
        });
      } else {
        await createAnnouncement({
          title: formData.title,
          message: formData.message,
          type: formData.type,
          linkText: formData.linkText,
          linkUrl: formData.linkUrl,
          isActive: formData.isActive,
          expiresAt: formData.expiresAt ? new Date(formData.expiresAt).toISOString() : null
        });
      }
      setIsModalOpen(false);
      loadNotices();
    } catch (err) {
      setFormError('নোটিশ সংরক্ষণে ত্রুটি হয়েছে।');
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (item) => {
    try {
      await toggleAnnouncementActive(item.id, item.isActive);
      setAnnouncements(prev => prev.map(a => a.id === item.id ? { ...a, isActive: !a.isActive } : a));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (item) => {
    if (window.confirm(`আপনি কি "${item.title}" নোটিশটি ডিলিট করতে চান?`)) {
      try {
        await deleteAnnouncement(item.id);
        setAnnouncements(prev => prev.filter(a => a.id !== item.id));
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Filter & Search
  const filteredNotices = announcements.filter(item => {
    if (filterType === 'active' && !item.isActive) return false;
    if (filterType === 'inactive' && item.isActive) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchTitle = (item.title || '').toLowerCase().includes(q);
      const matchMsg = (item.message || '').toLowerCase().includes(q);
      if (!matchTitle && !matchMsg) return false;
    }

    return true;
  });

  const activeCount = announcements.filter(a => a.isActive).length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Action & Stats Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold">
            <Megaphone size={20} />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <span>লাইভ নোটিশ ও এনাউন্সমেন্ট ব্রডকাস্টার</span>
              <span className="text-xs px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {toBengaliNumber(activeCount)}টি সক্রিয়
              </span>
            </h2>
            <p className="text-xs text-slate-400 font-medium">
              শিক্ষার্থীদের হোমপেজে সরাসরি জরুরি নোটিশ, পরীক্ষা ও ক্লাস লিংক প্রচার করুন
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={loadNotices}
            disabled={loading}
            className="p-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white border border-slate-700 cursor-pointer transition-colors"
            title="রিফ্রেশ করুন"
          >
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
          </button>

          <button
            type="button"
            onClick={handleOpenCreateModal}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors flex items-center gap-1.5 shadow-md shadow-emerald-950/40 cursor-pointer"
          >
            <Plus size={16} />
            <span>নতুন নোটিশ লিখুন</span>
          </button>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filterType === 'all'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
            }`}
          >
            সকল ({toBengaliNumber(announcements.length)})
          </button>
          <button
            type="button"
            onClick={() => setFilterType('active')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filterType === 'active'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
            }`}
          >
            সক্রিয় ({toBengaliNumber(activeCount)})
          </button>
          <button
            type="button"
            onClick={() => setFilterType('inactive')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filterType === 'inactive'
                ? 'bg-slate-700 text-white shadow-xs'
                : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
            }`}
          >
            স্থগিত ({toBengaliNumber(announcements.length - activeCount)})
          </button>
        </div>

        <div className="relative flex-1 max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="নোটিশ খুঁজুন..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Notices List */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 text-xs flex flex-col items-center gap-2">
          <RefreshCw size={24} className="animate-spin text-emerald-400" />
          <span>নোটিশ লোড হচ্ছে...</span>
        </div>
      ) : filteredNotices.length === 0 ? (
        <div className="p-12 rounded-3xl bg-slate-900/60 border border-slate-800/80 text-center space-y-3">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-slate-800 text-slate-400 flex items-center justify-center">
            <Megaphone size={22} />
          </div>
          <p className="text-sm font-bold text-slate-300">কোনো নোটিশ পাওয়া যায়নি</p>
          <p className="text-xs text-slate-500">শিক্ষার্থীদের জন্য নতুন জরুরি বা সাধারণ নোটিশ পোস্ট করুন</p>
          <button
            type="button"
            onClick={handleOpenCreateModal}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold cursor-pointer transition-colors"
          >
            + প্রথম নোটিশ তৈরি করুন
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredNotices.map((item) => {
            const typeConfig = NOTICE_TYPES[item.type] || NOTICE_TYPES.info;
            const TypeIcon = typeConfig.icon;

            return (
              <div
                key={item.id}
                className={`p-5 rounded-2xl border transition-all space-y-3.5 relative overflow-hidden ${
                  item.isActive
                    ? 'bg-slate-900 border-slate-800 hover:border-emerald-500/50 shadow-md'
                    : 'bg-slate-950/60 border-slate-850 opacity-60'
                }`}
              >
                {/* Active Indicator Strip */}
                <div className={`absolute top-0 inset-x-0 h-1 ${item.isActive ? 'bg-emerald-500' : 'bg-slate-700'}`} />

                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border text-[11px] font-bold ${typeConfig.bg}`}>
                      <TypeIcon size={12} />
                      <span>{typeConfig.label}</span>
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium">
                      {formatRelativeTimeBn(item.createdAt)}
                    </span>
                  </div>

                  {/* Toggle Active Switch */}
                  <button
                    type="button"
                    onClick={() => handleToggle(item)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-all border ${
                      item.isActive
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
                        : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                    }`}
                  >
                    {item.isActive ? 'সক্রিয় (লাইভ)' : 'স্থগিত'}
                  </button>
                </div>

                {/* Content */}
                <div className="space-y-1.5">
                  <h3 className="font-bold text-sm sm:text-base text-white leading-snug">
                    {item.title}
                  </h3>
                  {item.message && (
                    <p className="text-xs text-slate-300 leading-relaxed font-normal whitespace-pre-line">
                      {item.message}
                    </p>
                  )}
                </div>

                {/* Optional Link Button */}
                {item.linkUrl && (
                  <div className="pt-1">
                    <a
                      href={item.linkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-emerald-400 text-xs font-bold transition-colors"
                    >
                      <ExternalLink size={12} />
                      <span>{item.linkText || 'লিংক দেখুন'}</span>
                    </a>
                  </div>
                )}

                {/* Expiry / Footer Details */}
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
                  <div className="flex items-center gap-1">
                    <Clock size={12} />
                    <span>
                      {item.expiresAt
                        ? `মেয়াদ: ${new Date(item.expiresAt).toLocaleDateString('bn-BD')}`
                        : 'স্থায়ী নোটিশ'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenEditModal(item)}
                      className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                      title="সম্পাদনা"
                    >
                      <Edit3 size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(item)}
                      className="p-1.5 rounded-lg hover:bg-rose-950/60 text-rose-400 hover:text-rose-300 transition-colors cursor-pointer"
                      title="মুছে ফেলুন"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3.5 sm:p-4 bg-black/70 backdrop-blur-sm animate-fade-in"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden animate-scale-up text-white"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
                  <Megaphone size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-sm sm:text-base">
                    {editingItem ? 'নোটিশ সম্পাদনা করুন' : 'নতুন লাইভ নোটিশ প্রকাশ'}
                  </h3>
                  <p className="text-[11px] text-slate-400">মারকাযুল ঈমান শিক্ষার্থীদের নোটিশ বোর্ড</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
              {formError && (
                <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle size={15} />
                  <span>{formError}</span>
                </div>
              )}

              {/* Title */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">
                  শিরোনাম <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="যেমন: আগামীকাল রাত ৯টায় বিশেষ লাইভ ক্লাস"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-white placeholder-slate-500 outline-none focus:border-emerald-500 font-medium"
                />
              </div>

              {/* Type Select */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">নোটিশের ধরন</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {Object.entries(NOTICE_TYPES).map(([typeKey, cfg]) => {
                    const Icon = cfg.icon;
                    const isSelected = formData.type === typeKey;
                    return (
                      <button
                        key={typeKey}
                        type="button"
                        onClick={() => setFormData({ ...formData, type: typeKey })}
                        className={`p-2 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                          isSelected
                            ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300 shadow-sm'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        <Icon size={16} />
                        <span className="text-[11px] font-bold">{cfg.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Message Details */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">বিস্তারিত বিবরণ (ঐচ্ছিক)</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="নোটিশের বিস্তারিত বার্তা বা দিকনির্দেশনা..."
                  rows={3}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-white placeholder-slate-500 outline-none focus:border-emerald-500 font-medium"
                />
              </div>

              {/* Action Link & Text */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">বাটনের লেখা (ঐচ্ছিক)</label>
                  <input
                    type="text"
                    value={formData.linkText}
                    onChange={(e) => setFormData({ ...formData, linkText: e.target.value })}
                    placeholder="যেমন: ক্লাসে জয়েন করুন"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 outline-none focus:border-emerald-500 font-medium"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">লিংক URL (ঐচ্ছিক)</label>
                  <input
                    type="url"
                    value={formData.linkUrl}
                    onChange={(e) => setFormData({ ...formData, linkUrl: e.target.value })}
                    placeholder="https://zoom.us/j/..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
              </div>

              {/* Expiry & Active Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">মেয়াদ শেষ (ঐচ্ছিক)</label>
                  <input
                    type="date"
                    value={formData.expiresAt}
                    onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="flex items-center gap-3 pt-6">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-10 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                  <span className="text-xs font-bold text-slate-200">
                    {formData.isActive ? 'সরাসরি লাইভ রাখুন' : 'ড্রাফট (স্থগিত)'}
                  </span>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold cursor-pointer transition-colors"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold cursor-pointer transition-colors flex items-center gap-2 shadow-md shadow-emerald-950/50 disabled:opacity-50"
                >
                  {saving ? <RefreshCw size={14} className="animate-spin" /> : <Check size={14} />}
                  <span>{editingItem ? 'আপডেট করুন' : 'নোটিশ প্রকাশ করুন'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
