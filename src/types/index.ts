export type DepartmentStatus = 'Active' | 'Inactive';

export interface Department {
  id: string;
  name: string;
  code: string;
  hod: string;
  description?: string;
  establishedYear: number;
  email?: string;
  contactNumber?: string;
  status: DepartmentStatus;
  facultyCount?: number;
  studentCount?: number;
  courseCount?: number;
  avatarColor?: string;
}

export type Designation =
  | 'Professor & HOD'
  | 'Professor'
  | 'Associate Professor'
  | 'Assistant Professor'
  | 'Lecturer';

export interface Faculty {
  id: string;
  facultyId: string;
  fullName: string;
  email: string;
  phone: string;
  designation: Designation;
  departmentCode: string;
  departmentName?: string;
  specialization: string;
  joiningDate: string; // YYYY-MM-DD
  avatar?: string;
}

export type EnrollmentStatus = 'Enrolled' | 'On leave' | 'Graduated';

export interface Student {
  id: string;
  studentId: string;
  fullName: string;
  email: string;
  phone: string;
  departmentCode: string;
  departmentName?: string;
  academicYear: string; // e.g. "2024-2025"
  semester: number;
  admissionDate: string; // YYYY-MM-DD
  enrollmentStatus: EnrollmentStatus;
  gpa?: number;
}

export interface Course {
  id: string;
  courseId: string;
  courseCode: string;
  courseName: string;
  departmentCode: string;
  departmentName?: string;
  credits: number;
  semester: number;
  description: string;
  assignedFacultyId?: string;
  assignedFacultyName?: string;
}

export type ActivityCategory =
  | 'All'
  | 'Departments'
  | 'Faculty'
  | 'Students'
  | 'Courses';

export interface Activity {
  id: string;
  title: string;
  detail: string;
  category: 'Departments' | 'Faculty' | 'Students' | 'Courses';
  timestamp: string; // ISO
  iconType: 'building' | 'faculty' | 'student' | 'book' | 'check' | 'edit' | 'trash';
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  category: 'Departments' | 'Faculty' | 'Students' | 'Courses' | 'System';
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'Administrator' | 'Staff' | 'Viewer';
  avatarInitials: string;
}

export type ToneIndex = 0 | 1 | 2; // 0: lavender, 1: blue, 2: green
