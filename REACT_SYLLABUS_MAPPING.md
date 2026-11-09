# CampusCore – React Syllabus Topic Mapping (40 Topics)

This document maps all 40 React syllabus topics directly to the implementation in **CampusCore**.

---

### Phase 1: React Fundamentals & Setup

| # | Syllabus Topic | Implementation in CampusCore | File / Code Path |
|---|----------------|------------------------------|-------------------|
| 1 | **React Setup with Vite** | Vite 5 bundler configuration with React plugin, ES modules, and path aliases. | [`vite.config.js`](file:///Users/bhuvishagohil/Desktop/REACT%20FINAL%20project%202/vite.config.js), [`package.json`](file:///Users/bhuvishagohil/Desktop/REACT%20FINAL%20project%202/package.json) |
| 2 | **Modern JavaScript (ES6+)** | Destructuring, arrow functions, spread/rest operators, optional chaining, template literals throughout. | Used universally across all components |
| 3 | **Functional Components** | 100% functional component architecture using React Hooks. | [`src/App.jsx`](file:///Users/bhuvishagohil/Desktop/REACT%20FINAL%20project%202/src/App.jsx), [`src/components/departments/DepartmentCard.jsx`](file:///Users/bhuvishagohil/Desktop/REACT%20FINAL%20project%202/src/components/departments/DepartmentCard.jsx) |
| 4 | **JSX Syntax** | Declarative UI markup combining HTML elements with JavaScript logic and expressions. | Used in all `.jsx` files |
| 5 | **Props & Prop Passing** | Component communication via props (`id`, `name`, `code`, `hod`, `tone`, `onDelete`). | [`DepartmentCard.jsx`](file:///Users/bhuvishagohil/Desktop/REACT%20FINAL%20project%202/src/components/departments/DepartmentCard.jsx), [`StatCard.jsx`](file:///Users/bhuvishagohil/Desktop/REACT%20FINAL%20project%202/src/components/dashboard/StatCard.jsx) |
| 6 | **Default Props** | Fallback prop values in reusable components. | [`PropTypesDemoBadge.jsx`](file:///Users/bhuvishagohil/Desktop/REACT%20FINAL%20project%202/src/components/common/PropTypesDemoBadge.jsx#L48-L52), [`EmptyState.jsx`](file:///Users/bhuvishagohil/Desktop/REACT%20FINAL%20project%202/src/components/common/EmptyState.jsx) |
| 7 | **Conditional Rendering** | Inline ternary operators, logical `&&`, and empty-state branching. | [`DepartmentManagerBasic.jsx`](file:///Users/bhuvishagohil/Desktop/REACT%20FINAL%20project%202/src/components/departments/DepartmentManagerBasic.jsx#L198-L230), [`TopBar.jsx`](file:///Users/bhuvishagohil/Desktop/REACT%20FINAL%20project%202/src/components/layout/TopBar.jsx) |
| 8 | **PropTypes Validation** | Runtime type checking for props using `prop-types` library. | [`PropTypesDemoBadge.jsx`](file:///Users/bhuvishagohil/Desktop/REACT%20FINAL%20project%202/src/components/common/PropTypesDemoBadge.jsx), [`DepartmentCard.jsx`](file:///Users/bhuvishagohil/Desktop/REACT%20FINAL%20project%202/src/components/departments/DepartmentCard.jsx#L205-L225) |
| 9 | **List Rendering & Keys** | Dynamic list rendering using `.map()` with unique string `key` props. | [`DepartmentsPage.jsx`](file:///Users/bhuvishagohil/Desktop/REACT%20FINAL%20project%202/src/pages/Departments/DepartmentsPage.jsx#L180-L198), [`FacultyPage.jsx`](file:///Users/bhuvishagohil/Desktop/REACT%20FINAL%20project%202/src/pages/Faculty/FacultyPage.jsx) |
| 10 | **Fragment Usage (`<></>`)** | Grouping child elements without adding extra nodes to the DOM. | [`MobileDrawer.jsx`](file:///Users/bhuvishagohil/Desktop/REACT%20FINAL%20project%202/src/components/layout/MobileDrawer.jsx), [`ProtectedRoute.jsx`](file:///Users/bhuvishagohil/Desktop/REACT%20FINAL%20project%202/src/routes/ProtectedRoute.jsx) |

---

### Phase 2: React Hooks & State

| # | Syllabus Topic | Implementation in CampusCore | File / Code Path |
|---|----------------|------------------------------|-------------------|
| 11 | **`useState` Hook** | Form inputs, modal toggles, search terms, and the pure assignment view. | [`DepartmentManagerBasic.jsx`](file:///Users/bhuvishagohil/Desktop/REACT%20FINAL%20project%202/src/components/departments/DepartmentManagerBasic.jsx#L20-L29), [`StatCard.jsx`](file:///Users/bhuvishagohil/Desktop/REACT%20FINAL%20project%202/src/components/dashboard/StatCard.jsx) |
| 12 | **`useEffect` Hook** | Side effects: theme synchronization to DOM, count-up animation, click outside handlers. | [`ThemeContext.jsx`](file:///Users/bhuvishagohil/Desktop/REACT%20FINAL%20project%202/src/context/ThemeContext.jsx#L16-L23), [`StatCard.jsx`](file:///Users/bhuvishagohil/Desktop/REACT%20FINAL%20project%202/src/components/dashboard/StatCard.jsx) |
| 13 | **`useContext` Hook** | Theme and Authentication state consumption across components. | [`useTheme`](file:///Users/bhuvishagohil/Desktop/REACT%20FINAL%20project%202/src/context/ThemeContext.jsx#L34-L40), [`useAuth`](file:///Users/bhuvishagohil/Desktop/REACT%20FINAL%20project%202/src/context/AuthContext.jsx#L69-L75) |
| 14 | **`useReducer` Hook** | Complex state transitions (filtering, category tags, batch pinning, clearing). | [`useActivitiesReducer.js`](file:///Users/bhuvishagohil/Desktop/REACT%20FINAL%20project%202/src/hooks/useActivitiesReducer.ts), used in [`RecentActivityPanel.jsx`](file:///Users/bhuvishagohil/Desktop/REACT%20FINAL%20project%202/src/components/dashboard/RecentActivityPanel.jsx) |
| 15 | **`useRef` Hook** | DOM click outside detection for dropdowns, input auto-focus, element referencing. | [`PillDropdown.jsx`](file:///Users/bhuvishagohil/Desktop/REACT%20FINAL%20project%202/src/components/common/PillDropdown.jsx#L14-L24), [`TopBar.jsx`](file:///Users/bhuvishagohil/Desktop/REACT%20FINAL%20project%202/src/components/layout/TopBar.jsx) |
| 16 | **`useMemo` Hook** | Expensive computed values (derived statistics, filtered department & student records). | [`useDepartments.js`](file:///Users/bhuvishagohil/Desktop/REACT%20FINAL%20project%202/src/hooks/useDepartments.ts#L22-L52), [`EnrollmentChart.jsx`](file:///Users/bhuvishagohil/Desktop/REACT%20FINAL%20project%202/src/components/dashboard/EnrollmentChart.jsx) |
| 17 | **`useCallback` Hook** | Memoizing callback functions to prevent unnecessary child re-renders. | [`Toast.jsx`](file:///Users/bhuvishagohil/Desktop/REACT%20FINAL%20project%202/src/components/common/Toast.jsx#L11-L24) |
| 18 | **Custom Hook: `useDepartments`** | Encapsulates department CRUD, live related count computation, and filtering. | [`useDepartments.js`](file:///Users/bhuvishagohil/Desktop/REACT%20FINAL%20project%202/src/hooks/useDepartments.ts) |
| 19 | **Custom Hook: `useLocalStorage`** | Synchronization of React state to window localStorage. | [`useLocalStorage.js`](file:///Users/bhuvishagohil/Desktop/REACT%20FINAL%20project%202/src/hooks/useLocalStorage.ts) |
| 20 | **Custom Hook: `useDebounce`** | Debounced search query delay for smooth real-time searching. | [`useDebounce.js`](file:///Users/bhuvishagohil/Desktop/REACT%20FINAL%20project%202/src/hooks/useDebounce.ts) |

---

### Phase 3: Global State & Context

| # | Syllabus Topic | Implementation in CampusCore | File / Code Path |
|---|----------------|------------------------------|-------------------|
| 21 | **Context API: Theme** | Light and Dark theme provider with persistent storage. | [`ThemeContext.jsx`](file:///Users/bhuvishagohil/Desktop/REACT%20FINAL%20project%202/src/context/ThemeContext.jsx) |
| 22 | **Context API: Auth** | Authentication context for Administrator login, profile, and logout. | [`AuthContext.jsx`](file:///Users/bhuvishagohil/Desktop/REACT%20FINAL%20project%202/src/context/AuthContext.jsx) |
| 23 | **Redux Toolkit Store** | Centralized configureStore combining slices for all entities. | [`src/redux/store.ts`](file:///Users/bhuvishagohil/Desktop/REACT%20FINAL%20project%202/src/redux/store.ts) |
| 24 | **Redux Slices** | Modular slices with reducers & actions for Departments, Faculty, Students, Courses, Activities, and Notifications. | [`src/redux/slices/`](file:///Users/bhuvishagohil/Desktop/REACT%20FINAL%20project%202/src/redux/slices/) |
| 25 | **Redux Thunk** | Asynchronous operations with `createAsyncThunk` for API handling. | [`departmentSlice.ts`](file:///Users/bhuvishagohil/Desktop/REACT%20FINAL%20project%202/src/redux/slices/departmentSlice.ts#L25-L60) |
| 26 | **Redux Persist** | Preserving application state across browser reloads. | [`store.ts`](file:///Users/bhuvishagohil/Desktop/REACT%20FINAL%20project%202/src/redux/store.ts#L29-L44) |

---

### Phase 4: Routing & Navigation

| # | Syllabus Topic | Implementation in CampusCore | File / Code Path |
|---|----------------|------------------------------|-------------------|
| 27 | **React Router DOM v6** | Declarative `<Routes>`, `<Route>`, `<BrowserRouter>`, and `<Outlet>`. | [`AppRoutes.jsx`](file:///Users/bhuvishagohil/Desktop/REACT%20FINAL%20project%202/src/routes/AppRoutes.jsx) |
| 28 | **Dynamic Routes (`/departments/:id`)** | URL parameters accessed using `useParams()` to load specific department profiles. | [`DepartmentDetailPage.jsx`](file:///Users/bhuvishagohil/Desktop/REACT%20FINAL%20project%202/src/pages/Departments/DepartmentDetailPage.jsx#L20-L30) |
| 29 | **Nested Routes & Layout** | Persistent `MainLayout` wrapping child route outlets. | [`MainLayout.jsx`](file:///Users/bhuvishagohil/Desktop/REACT%20FINAL%20project%202/src/components/layout/MainLayout.jsx), [`AppRoutes.jsx`](file:///Users/bhuvishagohil/Desktop/REACT%20FINAL%20project%202/src/routes/AppRoutes.jsx) |
| 30 | **Protected Routes** | Guarding admin pages and redirecting unauthorized visits to `/login`. | [`ProtectedRoute.jsx`](file:///Users/bhuvishagohil/Desktop/REACT%20FINAL%20project%202/src/routes/ProtectedRoute.jsx) |

---

### Phase 5: Forms & Validation

| # | Syllabus Topic | Implementation in CampusCore | File / Code Path |
|---|----------------|------------------------------|-------------------|
| 31 | **Controlled Components** | Pure controlled form inputs in `DepartmentManagerBasic`. | [`DepartmentManagerBasic.jsx`](file:///Users/bhuvishagohil/Desktop/REACT%20FINAL%20project%202/src/components/departments/DepartmentManagerBasic.jsx#L150-L190) |
| 32 | **Formik & Yup Validation** | Schema validation, duplicate code prevention, touched/error states. | [`DepartmentForm.jsx`](file:///Users/bhuvishagohil/Desktop/REACT%20FINAL%20project%202/src/components/departments/DepartmentForm.jsx#L8-L45) |

---

### Phase 6: Styling & Performance

| # | Syllabus Topic | Implementation in CampusCore | File / Code Path |
|---|----------------|------------------------------|-------------------|
| 33 | **CSS Modules** | Scoped, collision-free styles for layout and panels. | [`Layout.module.css`](file:///Users/bhuvishagohil/Desktop/REACT%20FINAL%20project%202/src/components/layout/Layout.module.css), [`Dashboard.module.css`](file:///Users/bhuvishagohil/Desktop/REACT%20FINAL%20project%202/src/components/dashboard/Dashboard.module.css) |
| 34 | **Styled Components** | Tone-aware pastel card wrappers and dynamic status pills. | [`styledComponents.js`](file:///Users/bhuvishagohil/Desktop/REACT%20FINAL%20project%202/src/styles/styledComponents.js) |
| 35 | **Framer Motion & Animations** | Sliding pill navbar indicator, modal transitions, and hover elevation. | [`TopBar.jsx`](file:///Users/bhuvishagohil/Desktop/REACT%20FINAL%20project%202/src/components/layout/TopBar.jsx#L120-L135), [`Modal.jsx`](file:///Users/bhuvishagohil/Desktop/REACT%20FINAL%20project%202/src/components/common/Modal.jsx) |
| 36 | **Lazy Loading & React Suspense** | Code-splitting pages with `React.lazy()` and `<Suspense>` fallback skeletons. | [`AppRoutes.jsx`](file:///Users/bhuvishagohil/Desktop/REACT%20FINAL%20project%202/src/routes/AppRoutes.jsx#L8-L50) |

---

### Phase 7: API, Testing, TypeScript & Next.js

| # | Syllabus Topic | Implementation in CampusCore | File / Code Path |
|---|----------------|------------------------------|-------------------|
| 37 | **API Integration (Fetch & Axios)** | API clients and async thunks exist, but the page workflows currently use local Redux reducers and do not dispatch the fetch thunks. | [`src/services/api.ts`](./src/services/api.ts), [`departmentSlice.ts`](./src/redux/slices/departmentSlice.ts) |
| 38 | **Testing (Vitest / React Testing Library)** | Unit and component tests cover department forms/cards, operations, module reducers, and API service mocks. | [`src/tests/`](./src/tests/) |
| 39 | **TypeScript Basics (Interfaces & Typed Props)** | Clean TypeScript demonstration using interfaces and typed props. | [`TypedDepartmentBadge.tsx`](file:///Users/bhuvishagohil/Desktop/REACT%20FINAL%20project%202/src/components/common/TypedDepartmentBadge.tsx), [`types/index.ts`](file:///Users/bhuvishagohil/Desktop/REACT%20FINAL%20project%202/src/types/index.ts) |
| 40 | **Next.js Extension (SSR & File Routing)** | Separate extension demonstrating `getServerSideProps` and dynamic `[id].js`. | [`nextjs-extension/`](file:///Users/bhuvishagohil/Desktop/REACT%20FINAL%20project%202/nextjs-extension/) |

## CampusCore React Concepts Checkpoint

Statuses below reflect code used by the current application, not just helper files or syllabus comments.

| Concept | Status | Example in CampusCore |
|---|---|---|
| Functional components and JSX | IMPLEMENTED | `src/pages/Dashboard/DashboardPage.jsx` composes the dashboard with JSX. |
| Props and reusable components | IMPLEMENTED | `src/components/departments/DepartmentCard.jsx` receives department data and actions; it is reused on the dashboard and department views. |
| `useState` | IMPLEMENTED | `src/pages/Meetings/MeetingsPage.jsx` stores meeting form values and modal state. |
| `useEffect` | IMPLEMENTED | `src/context/ThemeContext.jsx` synchronizes the theme with the document and local storage. |
| Event handling | IMPLEMENTED | Department and faculty forms use change, blur, and submit handlers; `src/pages/Workload/WorkloadPage.jsx` handles allocation actions. |
| Conditional rendering | IMPLEMENTED | `src/pages/Departments/DepartmentsPage.jsx` switches between an empty state and the department list; modal content is conditional. |
| List rendering with `map()` and keys | IMPLEMENTED | `src/pages/Departments/DepartmentsPage.jsx` renders department cards with stable department IDs as keys. |
| Controlled forms and validation | IMPLEMENTED | `src/components/departments/DepartmentForm.jsx` uses Formik/Yup for required fields, duplicate codes, and validation feedback. Faculty and student forms also use Formik/Yup. |
| React Router and navigation | IMPLEMENTED | `src/routes/AppRoutes.jsx` defines lazy-loaded routes; layout links and meeting cards navigate between views. |
| Context API and shared state | IMPLEMENTED | `src/context/AuthContext.jsx` and `src/context/ThemeContext.jsx` provide app-wide auth/theme state; Redux Toolkit stores domain records. |
| Redux reducers and async thunks | PARTIALLY IMPLEMENTED | UI CRUD uses reducers and persisted Redux state (`src/redux/slices/`); async API thunks are defined but no page dispatches them. |
| API integration and CRUD | PARTIALLY IMPLEMENTED | Local create/edit/delete workflows are implemented and persist through Redux Persist. `src/services/api.ts` exposes JSON-server services, but app page mutations are not wired to those services. |
| Search, filtering, and sorting | IMPLEMENTED | Departments, faculty, and students support search/filter/sort; workload, meetings, and resources have search/filter controls. |
| `useMemo` and `useCallback` | IMPLEMENTED | `src/hooks/useDepartments.ts` memoizes derived department lists; `src/components/common/Toast.jsx` memoizes callbacks. |
| Custom hooks and `useReducer` | IMPLEMENTED | `src/hooks/useDepartments.ts` is used by pages, and `src/hooks/useActivitiesReducer.ts` is used by `src/components/dashboard/RecentActivityPanel.jsx`. |
| `useRef` and file input handling | IMPLEMENTED | `src/pages/Resources/ResourcesPage.jsx` uses a ref for file selection and reads uploads with `FileReader`. |
| `React.memo` | IMPLEMENTED | `src/components/departments/DepartmentCard.jsx` and `src/components/dashboard/StatCard.jsx` memoize components. |
| Portals | IMPLEMENTED | `src/components/common/Modal.jsx` mounts dialogs with `ReactDOM.createPortal`. |
| Lazy loading and Suspense | IMPLEMENTED | `src/routes/AppRoutes.jsx` lazy-loads page components and displays a skeleton fallback. |
| Error boundaries and class components | IMPLEMENTED | `src/components/common/ErrorBoundary.jsx` is a class error boundary with error fallback UI. |
| PropTypes and TypeScript types | IMPLEMENTED | Reusable JSX components declare PropTypes; `src/types/index.ts` and typed components define TypeScript contracts. |
| `useDebounce` and `useLocalStorage` helper hooks | NOT USED | `src/hooks/useDebounce.ts` and `src/hooks/useLocalStorage.ts` are defined but have no active application callers. |
| Student role-based material access | NOT USED | `src/routes/ProtectedRoute.jsx` checks only whether any user is authenticated; resources have no student-specific access policy or student portal. |

## Manual Workflow Checkpoint

These checks were performed in the running Vite app. Temporary test records were removed after verification; the original six departments remain.

| Workflow | Result | Observed result |
|---|---|---|
| Department creation and management | PASS | Created a test department, edited its name, deleted it through the confirmation dialog, and verified the original department count returned to six. |
| Faculty management and workload allocation | PASS | Registered a test professor, assigned 16 weekly hours and an academic mentor responsibility, removed the workload allocation, and deleted the test faculty member. |
| Department meeting scheduling | PASS | Scheduled a future CSE meeting with coordinator, time, venue, and agenda; its detail route loaded and the test meeting was deleted. |
| Professor syllabus and study-material upload | PASS | Uploaded test syllabus and lecture-note PDFs under the test professor, verified both remained after reload, filtered by title, confirmed the download handler feedback, and deleted both test resources. |
| Students accessing appropriate materials | FAIL | No student login/role or student-facing resource view is implemented, so student-specific material access and authorization cannot be verified. |
