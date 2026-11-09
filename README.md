# CampusCore – Integrated College Department Management System

**CampusCore – Integrated College Department Management System** is a comprehensive, elegant, multi-page college academic and department management application built with **React (JavaScript JSX)**, **Redux Toolkit**, **Context API**, and **React Router DOM v6**.

The application is styled with an exact soft lavender palette, Outfit typography, frosted-glass panels, pastel-colored cards with 20px curved borders, and an administrative dashboard layout inspired by modern design standards.

---

## 🌟 Original College Assignment Requirements (Met 100%)

CampusCore honors the original College Department Management System problem statement:

1. **Department Form**: Department Name, Department Code, and HOD Name as required fields with validation and uppercase normalization.
2. **Reusable DepartmentCard Component**: Displays department details via props (`id`, `name`, `code`, `hod`, `tone`, `facultyCount`, `studentCount`, `courseCount`, `onDelete`, etc.). Reused on the Dashboard, Departments page, and assignment demo.
3. **`useState` Management**: In addition to Redux Toolkit in the main portal, the self-contained component **`DepartmentManagerBasic`** (accessible at `/departments/basic-demo`) uses pure `useState` for department records, Add, Delete with confirmation, and dynamic rendering.
4. **Add & Delete Functionality**: Full CRUD support across all entities with confirmation dialogs.
5. **Exact Empty-State Preservation**: Displays the exact required text:
   > **"No department records available"**
   > *"Add your first department using the form."*

---

## 🎨 Visual Design System & Aesthetics

- **Google Font**: `Outfit` (`wght@400;500;600`)
- **Primary Color Palette**:
  - Ink: `#15131f`
  - Ink Soft: `#5d5a72`
  - Lavender Background: `#e9e7fb`
  - White Panels: `#ffffff`
  - Input Field: `#f3f2fa`
  - Lavender Card: `#d9d4f7` (`tone-0`)
  - Blue Card: `#d3e4fa` (`tone-1`)
  - Green Card: `#d5f0d2` (`tone-2`)
  - Danger: `#b3261e`
- **Curved Cards**: 20–24px border radius on all sides with subtle hover lift (`translateY(-4px)`).
- **Background Gradient Blobs**: Lavender `#c9c2f5`, Blue `#bfe3f7`, and Soft-Pink `#f6dce8` radial blurred blobs.
- **Dark Theme**: Violet-ink surfaces (`--bg: #1a1830`, `--panel: #25223d`, `--field: #2e2b49`, etc.) toggled easily via the sidebar pill.

---

## 🚀 Getting Started

### 1. Start the Vite React Application

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 2. Run Test Suite

```bash
npm test
```

### 3. Production Build

```bash
npm run build
npm run preview
```

### 4. Next.js SSR Extension

```bash
cd nextjs-extension
npm install
npm run dev
```
Open [http://localhost:3001](http://localhost:3001) to explore Next.js Server-Side Rendering (SSR) and file-based dynamic routes.

---

## 📁 Modules Included

1. **Dashboard (`/`)**:
   - Time-aware greeting ("Good morning, Admin") and dynamic date.
   - 4 animated statistics cards (Departments, Faculty, Students, Courses).
   - Left column with department search and stacked pastel cards.
   - Recharts ComposedChart (monotone lines, fine vertical bars, weekly progress strip).
   - Recent activity list with real-time timestamps and filter.
   - Top departments leaderboard with live counts.
   - Student distribution donut chart.
2. **Departments (`/departments`)**:
   - Two-column layout with Add Department Formik form on left.
   - Right-side department card grid with live count, search, status filter, and sorting.
   - Edit modal and delete confirmation dialog.
   - Dynamic detail route (`/departments/:id`) with hero banner and faculty/student/course tabs.
   - Assignment View (`/departments/basic-demo`) using pure `useState`.
3. **Faculty Management (`/faculty`)**:
   - Complete faculty directory with designation, department association, and specialization chips.
   - Add/Edit faculty modal and delete confirmation.
4. **Student Management (`/students`)**:
   - Student enrollment directory in leaderboard row style.
   - Filter by department, semester, and enrollment status.
5. **Course Management (`/courses`)**:
   - Course curriculum cards with credits, semester, and assigned faculty avatar.
   - Dynamic faculty dropdown matching selected department.
6. **Reports & Analytics (`/reports`)**:
   - Live department audit tables and student progression charts.
   - CSV export functionality (`exportToCsv`) for institutional auditing.
7. **Settings (`/settings`)**:
   - Admin profile management.
   - Working Light & Dark theme preference toggles with localStorage persistence.
   - "Reset Sample Data" tool.
8. **Authentication (`/login`)**:
   - Protected routes with pre-filled credentials.

---

## 📚 Syllabus Mapping

See [`REACT_SYLLABUS_MAPPING.md`](./REACT_SYLLABUS_MAPPING.md) for the detailed topic-by-topic breakdown across all 40 syllabus topics.
