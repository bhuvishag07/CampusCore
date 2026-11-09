import React, { useState, useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import {
  Library,
  Upload,
  FileText,
  File,
  Image as ImageIcon,
  Download,
  Eye,
  Edit3,
  Trash2,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Building2,
  User,
  BookOpen,
  Calendar,
  AlertTriangle,
  FolderOpen,
  ExternalLink,
} from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import {
  addResource,
  updateResource,
  deleteResource,
} from '@/redux/slices/resourcesSlice';
import { Modal } from '@/components/common/Modal';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { EmptyState } from '@/components/common/EmptyState';
import { Avatar } from '@/components/common/Avatar';
import { useToast } from '@/components/common/Toast';
import { ToneCardWrapper } from '@/styles/styledComponents';
import styles from '@/components/resources/Resources.module.css';

const RESOURCE_CATEGORIES = [
  'Complete Subject Syllabus',
  'Unit-wise Syllabus',
  'Lecture Notes',
  'Presentations',
  'Question Banks',
  'Previous Year Question Papers',
  'Practical Files',
  'Laboratory Manuals',
  'Assignments',
  'Reference Materials',
  'Other Academic Documents',
];

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

// Helper: Format file size
function formatBytes(bytes) {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

// Helper: Convert base64 data URL to Blob
function base64ToBlob(dataUrl) {
  try {
    const parts = dataUrl.split(';base64,');
    const contentType = parts[0].split(':')[1];
    const raw = window.atob(parts[1]);
    const rawLength = raw.length;
    const uInt8Array = new Uint8Array(rawLength);
    for (let i = 0; i < rawLength; ++i) {
      uInt8Array[i] = raw.charCodeAt(i);
    }
    return new Blob([uInt8Array], { type: contentType });
  } catch (err) {
    return null;
  }
}

export const ResourcesPage = () => {
  const dispatch = useAppDispatch();
  const { addToast } = useToast();

  const resources = useAppSelector((state) => state.resources.items);
  const facultyList = useAppSelector((state) => state.faculty.items);
  const departments = useAppSelector((state) => state.departments.items);
  const courses = useAppSelector((state) => state.courses.items);

  // Filter & Nav State
  const [selectedFacultyId, setSelectedFacultyId] = useState('ALL');
  const [selectedDeptCode, setSelectedDeptCode] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedSemester, setSelectedSemester] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Upload/Edit Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [facultyId, setFacultyId] = useState('');
  const [courseId, setCourseId] = useState('');
  const [semester, setSemester] = useState('4');
  const [academicYear, setAcademicYear] = useState('2024-2025');
  const [category, setCategory] = useState(RESOURCE_CATEGORIES[0]);
  const [fileObject, setFileObject] = useState(null);
  const [fileBase64, setFileBase64] = useState('');
  const [formError, setFormError] = useState('');

  const fileInputRef = useRef(null);

  // Preview Modal State
  const [previewItem, setPreviewItem] = useState(null);

  // Delete Dialog State
  const [deleteConfirm, setDeleteConfirm] = useState({
    isOpen: false,
    id: null,
    title: '',
  });

  // KPI Statistics
  const stats = useMemo(() => {
    const total = resources.length;
    const uniqueFaculty = new Set(resources.map((r) => r.facultyId)).size;
    const uniqueDepts = new Set(resources.map((r) => r.departmentCode)).size;
    const totalBytes = resources.reduce((sum, r) => sum + (Number(r.fileSize) || 0), 0);

    return {
      total,
      uniqueFaculty,
      uniqueDepts,
      storageFormatted: formatBytes(totalBytes),
    };
  }, [resources]);

  // Selected faculty member profile (if single faculty chosen)
  const activeFaculty = useMemo(() => {
    if (selectedFacultyId === 'ALL') return null;
    return facultyList.find((f) => f.id === selectedFacultyId) || null;
  }, [selectedFacultyId, facultyList]);

  // Filtered resources
  const filteredResources = useMemo(() => {
    return resources.filter((res) => {
      const matchFaculty =
        selectedFacultyId === 'ALL' || res.facultyId === selectedFacultyId;
      const matchDept =
        selectedDeptCode === 'ALL' || res.departmentCode === selectedDeptCode;
      const matchCat =
        selectedCategory === 'ALL' || res.category === selectedCategory;
      const matchSem =
        selectedSemester === 'ALL' || String(res.semester) === String(selectedSemester);
      const matchSearch =
        searchQuery === '' ||
        res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        res.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        res.fileName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        res.facultyName?.toLowerCase().includes(searchQuery.toLowerCase());

      return matchFaculty && matchDept && matchCat && matchSem && matchSearch;
    });
  }, [resources, selectedFacultyId, selectedDeptCode, selectedCategory, selectedSemester, searchQuery]);

  // Faculty courses matching selected form faculty member
  const availableCoursesForFaculty = useMemo(() => {
    if (!facultyId) return courses;
    const fac = facultyList.find((f) => f.id === facultyId);
    if (!fac) return courses;
    return courses.filter((c) => c.departmentCode === fac.departmentCode);
  }, [facultyId, facultyList, courses]);

  // Open Upload Modal
  const handleOpenUploadModal = () => {
    setEditingItem(null);
    setTitle('');
    setDescription('');
    const defaultFac = selectedFacultyId !== 'ALL' ? selectedFacultyId : (facultyList[0]?.id || '');
    setFacultyId(defaultFac);
    const fac = facultyList.find((f) => f.id === defaultFac);
    const facCourses = courses.filter((c) => c.departmentCode === fac?.departmentCode);
    setCourseId(facCourses[0]?.id || courses[0]?.id || '');
    setSemester('4');
    setAcademicYear('2024-2025');
    setCategory(RESOURCE_CATEGORIES[0]);
    setFileObject(null);
    setFileBase64('');
    setFormError('');
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (res) => {
    setEditingItem(res);
    setTitle(res.title);
    setDescription(res.description || '');
    setFacultyId(res.facultyId);
    setCourseId(res.courseId || '');
    setSemester(String(res.semester || '4'));
    setAcademicYear(res.academicYear || '2024-2025');
    setCategory(res.category);
    setFileObject(null);
    setFileBase64(res.fileData); // keep existing file unless replaced
    setFormError('');
    setIsModalOpen(true);
  };

  // Handle File Input Change with real FileReader
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setFormError(`File size exceeds 5 MB limit (${formatBytes(file.size)}).`);
      return;
    }

    setFormError('');
    setFileObject(file);

    const reader = new FileReader();
    reader.onload = () => {
      setFileBase64(reader.result);
    };
    reader.onerror = () => {
      setFormError('Failed to read file from disk.');
    };
    reader.readAsDataURL(file);
  };

  // Form Submit
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setFormError('Please provide a resource title.');
      return;
    }
    if (!editingItem && !fileBase64) {
      setFormError('Please select a file to upload.');
      return;
    }

    const fac = facultyList.find((f) => f.id === facultyId);
    const crs = courses.find((c) => c.id === courseId);
    const nowIso = new Date().toISOString();

    if (editingItem) {
      // Update
      const updated = {
        ...editingItem,
        title: title.trim(),
        description: description.trim(),
        facultyId,
        facultyName: fac ? fac.fullName : editingItem.facultyName,
        departmentCode: fac ? fac.departmentCode : editingItem.departmentCode,
        courseId,
        courseName: crs ? crs.courseName : editingItem.courseName,
        courseCode: crs ? crs.courseCode : editingItem.courseCode,
        semester: Number(semester),
        academicYear,
        category,
        lastUpdated: nowIso,
        fileData: fileBase64 || editingItem.fileData,
        fileName: fileObject ? fileObject.name : editingItem.fileName,
        fileSize: fileObject ? fileObject.size : editingItem.fileSize,
        fileType: fileObject ? fileObject.type : editingItem.fileType,
      };

      dispatch(updateResource(updated));
      addToast('Academic resource updated.', 'success');
    } else {
      // Create new
      const newRes = {
        id: 'res-' + Date.now(),
        title: title.trim(),
        description: description.trim(),
        facultyId,
        facultyName: fac ? fac.fullName : 'Faculty Member',
        departmentCode: fac ? fac.departmentCode : 'CSE',
        courseId,
        courseName: crs ? crs.courseName : 'General Course',
        courseCode: crs ? crs.courseCode : 'GEN',
        semester: Number(semester),
        academicYear,
        category,
        fileName: fileObject ? fileObject.name : 'document',
        fileSize: fileObject ? fileObject.size : 0,
        fileType: fileObject ? fileObject.type : 'application/octet-stream',
        fileData: fileBase64,
        uploadDate: nowIso,
        lastUpdated: nowIso,
      };

      dispatch(addResource(newRes));
      addToast('Resource uploaded and stored persistently.', 'success');
    }

    setIsModalOpen(false);
  };

  // Download Action
  const handleDownload = (res) => {
    if (!res.fileData) {
      addToast('File data is not available for download.', 'error');
      return;
    }

    try {
      const blob = base64ToBlob(res.fileData);
      if (!blob) {
        // Fallback directly to data URL
        const link = document.createElement('a');
        link.href = res.fileData;
        link.download = res.fileName || 'download';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = res.fileName || 'document';
        document.body.appendChild(link);
        link.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(link);
      }
      addToast(`Downloaded ${res.fileName}`, 'info');
    } catch (err) {
      addToast('Failed to trigger download.', 'error');
    }
  };

  // Delete Action
  const handleDeleteConfirm = () => {
    if (deleteConfirm.id) {
      dispatch(deleteResource(deleteConfirm.id));
      addToast(`Deleted resource "${deleteConfirm.title}".`, 'info');
      setDeleteConfirm({ isOpen: false, id: null, title: '' });
    }
  };

  // Helper file badge styling
  const getBadgeStyle = (fileType = '', fileName = '') => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (fileType.includes('pdf') || ext === 'pdf') {
      return { label: 'PDF', cls: styles.pdfBadge };
    }
    if (fileType.includes('word') || ext === 'doc' || ext === 'docx') {
      return { label: 'DOC', cls: styles.docBadge };
    }
    if (fileType.includes('presentation') || ext === 'ppt' || ext === 'pptx') {
      return { label: 'PPT', cls: styles.pptBadge };
    }
    if (fileType.includes('image') || ext === 'png' || ext === 'jpg' || ext === 'jpeg') {
      return { label: 'IMG', cls: styles.imgBadge };
    }
    return { label: ext?.toUpperCase() || 'FILE', cls: styles.docBadge };
  };

  return (
    <div className={styles.container}>
      {/* ── Page Header ── */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className="page-title">Academic Resources Library</h1>
          <p className="page-subtitle">
            Centralised syllabus repository, lecture notes, question banks, and course materials.
          </p>
        </div>
        <button
          type="button"
          className="btn-dark"
          onClick={handleOpenUploadModal}
        >
          <Upload size={16} />
          Upload Resource
        </button>
      </div>

      {/* ── Stats Dashboard ── */}
      <div className={styles.statsGrid}>
        <ToneCardWrapper $tone={0} className={styles.statCard}>
          <div>
            <div className={styles.statValue}>{stats.total}</div>
            <div className={styles.statLabel}>Total Uploaded Documents</div>
          </div>
          <div className={styles.statIcon} style={{ background: 'rgba(143, 132, 232, 0.2)' }}>
            <FileText size={22} color="var(--chart-purple)" />
          </div>
        </ToneCardWrapper>

        <ToneCardWrapper $tone={1} className={styles.statCard}>
          <div>
            <div className={styles.statValue}>{stats.uniqueFaculty}</div>
            <div className={styles.statLabel}>Contributing Faculty</div>
          </div>
          <div className={styles.statIcon} style={{ background: 'rgba(127, 178, 238, 0.2)' }}>
            <User size={22} color="var(--chart-blue)" />
          </div>
        </ToneCardWrapper>

        <ToneCardWrapper $tone={2} className={styles.statCard}>
          <div>
            <div className={styles.statValue}>{stats.uniqueDepts}</div>
            <div className={styles.statLabel}>Departments Covered</div>
          </div>
          <div className={styles.statIcon} style={{ background: 'rgba(52, 199, 89, 0.2)' }}>
            <Building2 size={22} color="#2d9f4e" />
          </div>
        </ToneCardWrapper>

        <ToneCardWrapper $tone={0} className={styles.statCard}>
          <div>
            <div className={styles.statValue}>{stats.storageFormatted}</div>
            <div className={styles.statLabel}>Persistent Local Storage</div>
          </div>
          <div className={styles.statIcon} style={{ background: 'rgba(242, 167, 195, 0.2)' }}>
            <Library size={22} color="var(--chart-pink)" />
          </div>
        </ToneCardWrapper>
      </div>

      {/* ── Two-Column Workspace ── */}
      <div className={styles.workspaceLayout}>
        {/* Left: Department & Faculty Directory Nav */}
        <aside className={`glass-panel ${styles.sidebarPanel}`}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>
              Faculty Directory
            </span>
            {selectedFacultyId !== 'ALL' && (
              <button
                type="button"
                style={{ background: 'none', border: 'none', color: 'var(--ink-soft)', fontSize: 11, cursor: 'pointer' }}
                onClick={() => setSelectedFacultyId('ALL')}
              >
                Clear selection
              </button>
            )}
          </div>

          <button
            type="button"
            className={`${styles.facultyNavItem} ${selectedFacultyId === 'ALL' ? styles.facultyNavItemActive : ''}`}
            onClick={() => setSelectedFacultyId('ALL')}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <FolderOpen size={16} />
              <span style={{ fontSize: 13, fontWeight: 500 }}>All Faculty Documents</span>
            </div>
            <span className={styles.badgeCount}>{resources.length}</span>
          </button>

          {departments.map((dept) => {
            const deptFaculty = facultyList.filter((f) => f.departmentCode === dept.code);

            return (
              <div key={dept.id} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <div className={styles.deptGroupTitle}>
                  {dept.code} — {dept.name}
                </div>

                {deptFaculty.map((fac) => {
                  const count = resources.filter((r) => r.facultyId === fac.id).length;
                  const isActive = selectedFacultyId === fac.id;

                  return (
                    <button
                      key={fac.id}
                      type="button"
                      className={`${styles.facultyNavItem} ${isActive ? styles.facultyNavItemActive : ''}`}
                      onClick={() => setSelectedFacultyId(fac.id)}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, overflow: 'hidden' }}>
                        <Avatar name={fac.fullName} size={24} />
                        <span style={{ fontSize: 12.5, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                          {fac.fullName}
                        </span>
                      </div>
                      <span className={styles.badgeCount}>{count}</span>
                    </button>
                  );
                })}
              </div>
            );
          })}
        </aside>

        {/* Right: Main Resources Explorer */}
        <div className={styles.mainPanel}>
          {/* Active Faculty Profile Banner (if selected) */}
          {activeFaculty && (
            <div className="glass-panel" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Avatar name={activeFaculty.fullName} size={44} />
                <div>
                  <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--ink)' }}>
                    {activeFaculty.fullName}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--ink-soft)' }}>
                    {activeFaculty.designation} • Dept of {activeFaculty.departmentCode} • ID: {activeFaculty.facultyId}
                  </div>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 18, fontWeight: 600, color: 'var(--chart-purple)' }}>
                  {filteredResources.length}
                </div>
                <div style={{ fontSize: 11, color: 'var(--ink-soft)' }}>Materials Uploaded</div>
              </div>
            </div>
          )}

          {/* Filter Bar */}
          <div className={`glass-panel ${styles.filterBar}`}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Search size={15} color="var(--ink-soft)" />
              <input
                type="text"
                className={styles.searchInput}
                placeholder="Search title, course, subject..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className={styles.filterGroup}>
              {selectedFacultyId === 'ALL' && (
                <select
                  className={styles.filterSelect}
                  value={selectedDeptCode}
                  onChange={(e) => setSelectedDeptCode(e.target.value)}
                >
                  <option value="ALL">All Departments</option>
                  {departments.map((d) => (
                    <option key={d.id} value={d.code}>
                      {d.code}
                    </option>
                  ))}
                </select>
              )}

              <select
                className={styles.filterSelect}
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="ALL">All Document Categories</option>
                {RESOURCE_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>

              <select
                className={styles.filterSelect}
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value)}
              >
                <option value="ALL">All Semesters</option>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                  <option key={s} value={s}>
                    Semester {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Resources Cards Grid */}
          {filteredResources.length === 0 ? (
            <EmptyState
              title="No academic resources found"
              subtext="Upload your first syllabus, lecture slides or notes to this repository."
              action={
                <button
                  type="button"
                  className="btn-dark"
                  onClick={handleOpenUploadModal}
                >
                  <Upload size={14} /> Upload First Document
                </button>
              }
            />
          ) : (
            <div className={styles.resourcesGrid}>
              {filteredResources.map((res) => {
                const badge = getBadgeStyle(res.fileType, res.fileName);

                return (
                  <div key={res.id} className={styles.resourceCard}>
                    <div className={styles.resourceCardTop}>
                      <div className={styles.fileBadgeRow}>
                        <span className={`${styles.fileTypeBadge} ${badge.cls}`}>
                          {badge.label}
                        </span>
                        <span className={styles.categoryPill}>{res.category}</span>
                      </div>

                      <h3 className={styles.resourceTitle}>{res.title}</h3>

                      {res.description && (
                        <p style={{ fontSize: 12, color: 'var(--ink-soft)', lineHeight: 1.4 }}>
                          {res.description}
                        </p>
                      )}

                      <div className={styles.resourceMeta}>
                        <div>
                          <strong>Course:</strong> {res.courseCode ? `${res.courseCode} — ` : ''}{res.courseName || 'General'}
                        </div>
                        <div>
                          <strong>Faculty:</strong> {res.facultyName}
                        </div>
                        <div style={{ display: 'flex', gap: 10, marginTop: 2, fontSize: 11 }}>
                          <span>Sem {res.semester || 'N/A'}</span>
                          <span>•</span>
                          <span>{res.academicYear || '2024-25'}</span>
                          <span>•</span>
                          <span>{formatBytes(res.fileSize)}</span>
                        </div>
                      </div>
                    </div>

                    <div className={styles.resourceActions}>
                      <div style={{ fontSize: 11, color: 'var(--ink-soft)', textOverflow: 'ellipsis', overflow: 'hidden', maxWidth: 120 }}>
                        {res.fileName}
                      </div>

                      <div className={styles.actionBtnGroup}>
                        <button
                          type="button"
                          className="btn-translucent"
                          style={{ padding: '5px 10px', fontSize: 12 }}
                          onClick={() => setPreviewItem(res)}
                          title="Preview document"
                        >
                          <Eye size={13} style={{ marginRight: 4 }} />
                          Preview
                        </button>

                        <button
                          type="button"
                          className="btn-dark"
                          style={{ padding: '5px 12px', fontSize: 12 }}
                          onClick={() => handleDownload(res)}
                          title="Download file"
                        >
                          <Download size={13} />
                        </button>

                        <button
                          type="button"
                          style={{ background: 'none', border: 'none', color: 'var(--ink-soft)', padding: 4, cursor: 'pointer' }}
                          onClick={() => handleOpenEditModal(res)}
                          title="Edit details"
                        >
                          <Edit3 size={14} />
                        </button>

                        <button
                          type="button"
                          style={{ background: 'none', border: 'none', color: 'var(--danger)', padding: 4, cursor: 'pointer' }}
                          onClick={() =>
                            setDeleteConfirm({
                              isOpen: true,
                              id: res.id,
                              title: res.title,
                            })
                          }
                          title="Delete resource"
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
        </div>
      </div>

      {/* ── Upload / Edit Modal ── */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Edit Academic Resource' : 'Upload Academic Resource'}
        maxWidth={580}
      >
        <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {formError && (
            <div style={{ color: 'var(--danger)', background: 'rgba(179,38,30,0.1)', padding: '8px 12px', borderRadius: 8, fontSize: 13 }}>
              {formError}
            </div>
          )}

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Document Title *</label>
            <input
              type="text"
              className={styles.formInput}
              placeholder="e.g. Unit 3 — Distributed Consensus & Paxos Slides"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup} style={{ flex: 1 }}>
              <label className={styles.formLabel}>Faculty Member *</label>
              <select
                className={styles.formSelectInput}
                value={facultyId}
                onChange={(e) => {
                  setFacultyId(e.target.value);
                  const fac = facultyList.find((f) => f.id === e.target.value);
                  const facCourses = courses.filter((c) => c.departmentCode === fac?.departmentCode);
                  if (facCourses.length > 0) setCourseId(facCourses[0].id);
                }}
              >
                {facultyList.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.fullName} ({f.departmentCode})
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup} style={{ flex: 1 }}>
              <label className={styles.formLabel}>Course / Subject</label>
              <select
                className={styles.formSelectInput}
                value={courseId}
                onChange={(e) => setCourseId(e.target.value)}
              >
                {availableCoursesForFaculty.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.courseCode} — {c.courseName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup} style={{ flex: 1 }}>
              <label className={styles.formLabel}>Category</label>
              <select
                className={styles.formSelectInput}
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {RESOURCE_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup} style={{ flex: 1 }}>
              <label className={styles.formLabel}>Semester</label>
              <select
                className={styles.formSelectInput}
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                  <option key={s} value={s}>
                    Semester {s}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup} style={{ flex: 1 }}>
              <label className={styles.formLabel}>Academic Year</label>
              <input
                type="text"
                className={styles.formInput}
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                placeholder="2024-2025"
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Summary / Description</label>
            <textarea
              rows={2}
              className={styles.formTextarea}
              placeholder="Outline of contents, targeted lectures or syllabus units..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Real File Upload Drop Zone */}
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              {editingItem ? 'Replace Document File (Optional)' : 'Document Attachment *'}
            </label>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              accept=".pdf,.doc,.docx,.ppt,.pptx,.png,.jpg,.jpeg"
              onChange={handleFileChange}
            />

            <div
              className={styles.dropZone}
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload size={24} color="var(--ink-soft)" />
              <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink)' }}>
                {fileObject ? 'Click to replace selected file' : 'Click to browse or drop file here'}
              </div>
              <div style={{ fontSize: 11, color: 'var(--ink-soft)' }}>
                Supports PDF, Word (DOC/DOCX), PowerPoint (PPT/PPTX), Images (max 5 MB)
              </div>
            </div>

            {fileObject && (
              <div className={styles.selectedFileInfo}>
                <CheckCircle2 size={16} />
                <span>
                  Selected: <strong>{fileObject.name}</strong> ({formatBytes(fileObject.size)})
                </span>
              </div>
            )}

            {editingItem && !fileObject && (
              <div style={{ fontSize: 12, color: 'var(--ink-soft)', marginTop: 4 }}>
                Current attached file: <strong>{editingItem.fileName}</strong> ({formatBytes(editingItem.fileSize)})
              </div>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
            <button
              type="button"
              className="btn-translucent"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn-dark">
              {editingItem ? 'Save Changes' : 'Upload & Store'}
            </button>
          </div>
        </form>
      </Modal>

      {/* ── Document Preview Modal ── */}
      <Modal
        isOpen={!!previewItem}
        onClose={() => setPreviewItem(null)}
        title={previewItem ? `Preview: ${previewItem.title}` : 'Document Preview'}
        maxWidth={640}
      >
        {previewItem && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {previewItem.fileType?.includes('image') ||
            ['png', 'jpg', 'jpeg'].includes(previewItem.fileName.split('.').pop()?.toLowerCase()) ? (
              <div style={{ maxHeight: 420, overflow: 'auto', textAlign: 'center', background: 'var(--field)', borderRadius: 12, padding: 10 }}>
                <img
                  src={previewItem.fileData}
                  alt={previewItem.title}
                  style={{ maxWidth: '100%', maxHeight: 380, objectFit: 'contain', borderRadius: 8 }}
                />
              </div>
            ) : previewItem.fileType?.includes('pdf') ||
              previewItem.fileName.endsWith('.pdf') ? (
              <div style={{ background: 'var(--field)', borderRadius: 12, padding: 24, textAlign: 'center' }}>
                <FileText size={48} color="var(--danger)" style={{ margin: '0 auto 12px' }} />
                <h4 style={{ fontSize: 16, fontWeight: 600 }}>{previewItem.fileName}</h4>
                <p style={{ fontSize: 13, color: 'var(--ink-soft)', margin: '6px 0 16px' }}>
                  PDF document ({formatBytes(previewItem.fileSize)}) is ready for inspection.
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 10 }}>
                  <button
                    type="button"
                    className="btn-dark"
                    onClick={() => {
                      const blob = base64ToBlob(previewItem.fileData);
                      if (blob) {
                        const url = URL.createObjectURL(blob);
                        window.open(url, '_blank');
                      } else {
                        window.open(previewItem.fileData, '_blank');
                      }
                    }}
                  >
                    <ExternalLink size={14} /> Open in Dedicated Viewer
                  </button>
                  <button
                    type="button"
                    className="btn-translucent"
                    onClick={() => handleDownload(previewItem)}
                  >
                    <Download size={14} /> Download PDF
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ background: 'var(--field)', borderRadius: 12, padding: 24, textAlign: 'center' }}>
                <File size={48} color="var(--chart-blue)" style={{ margin: '0 auto 12px' }} />
                <h4 style={{ fontSize: 16, fontWeight: 600 }}>{previewItem.fileName}</h4>
                <p style={{ fontSize: 13, color: 'var(--ink-soft)', margin: '6px 0 16px' }}>
                  Direct in-browser visual rendering is supported for image and PDF files. You can download this document to inspect it locally.
                </p>
                <button
                  type="button"
                  className="btn-dark"
                  onClick={() => handleDownload(previewItem)}
                >
                  <Download size={14} /> Download Document
                </button>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--glass-border)', paddingTop: 12 }}>
              <div style={{ fontSize: 12, color: 'var(--ink-soft)' }}>
                Uploaded by {previewItem.facultyName} • {previewItem.category}
              </div>
              <button
                type="button"
                className="btn-translucent"
                onClick={() => setPreviewItem(null)}
              >
                Close Preview
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* ── Confirm Delete Dialog ── */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        title="Delete Academic Resource"
        message={`Are you sure you want to delete "${deleteConfirm.title}"? The document will be permanently removed from persistent storage.`}
        confirmLabel="Delete Resource"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteConfirm({ isOpen: false, id: null, title: '' })}
      />
    </div>
  );
};
