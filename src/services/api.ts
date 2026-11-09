import axios from 'axios';
import { Department, Faculty, Student, Course } from '@/types';

const API_BASE_URL = 'http://localhost:5001';

// 1. AXIOS API Client (Demonstrating Axios with interceptors, timeouts, and headers)
export const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 4000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Axios response interceptor for unified logging
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Graceful offline fallback logging
    console.info('[Axios API Notice] Mock server offline or unreachable; using persisted state.', error.message);
    return Promise.reject(error);
  }
);

export const departmentApiService = {
  // Axios GET
  async getAll(): Promise<Department[]> {
    const res = await axiosClient.get<Department[]>('/departments');
    return res.data;
  },
  // Axios POST
  async create(dept: Department): Promise<Department> {
    const res = await axiosClient.post<Department>('/departments', dept);
    return res.data;
  },
  // Axios PUT
  async update(dept: Department): Promise<Department> {
    const res = await axiosClient.put<Department>(`/departments/${dept.id}`, dept);
    return res.data;
  },
  // Axios DELETE
  async delete(id: string): Promise<string> {
    await axiosClient.delete(`/departments/${id}`);
    return id;
  },
};

export const facultyApiService = {
  // Axios GET
  async getAll(): Promise<Faculty[]> {
    const res = await axiosClient.get<Faculty[]>('/faculty');
    return res.data;
  },
  async create(fac: Faculty): Promise<Faculty> {
    const res = await axiosClient.post<Faculty>('/faculty', fac);
    return res.data;
  },
  async delete(id: string): Promise<string> {
    await axiosClient.delete(`/faculty/${id}`);
    return id;
  },
};

// 2. NATIVE FETCH API Client (Demonstrating Fetch API with custom request wrapper)
export const fetchClient = {
  async get<T>(endpoint: string): Promise<T> {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    });
    if (!res.ok) throw new Error(`Fetch error: ${res.statusText}`);
    return res.json() as Promise<T>;
  },

  async post<T>(endpoint: string, body: unknown): Promise<T> {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`Fetch error: ${res.statusText}`);
    return res.json() as Promise<T>;
  },

  async delete(endpoint: string): Promise<void> {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error(`Fetch error: ${res.statusText}`);
  },
};

export const studentApiService = {
  // Native Fetch API GET
  async getAll(): Promise<Student[]> {
    return fetchClient.get<Student[]>('/students');
  },
  // Native Fetch API POST
  async create(student: Student): Promise<Student> {
    return fetchClient.post<Student>('/students', student);
  },
  // Native Fetch API DELETE
  async delete(id: string): Promise<string> {
    await fetchClient.delete(`/students/${id}`);
    return id;
  },
};

export const courseApiService = {
  // Native Fetch API GET
  async getAll(): Promise<Course[]> {
    return fetchClient.get<Course[]>('/courses');
  },
  // Native Fetch API POST
  async create(course: Course): Promise<Course> {
    return fetchClient.post<Course>('/courses', course);
  },
  // Native Fetch API DELETE
  async delete(id: string): Promise<string> {
    await fetchClient.delete(`/courses/${id}`);
    return id;
  },
};

/**
 * 3. API Request Cancellation Demonstration
 * Demonstrates AbortController signal handling for cancelling in-flight requests.
 */
export function createCancelableSearch() {
  let controller: AbortController | null = null;

  return async function searchDepartments(query: string): Promise<Department[]> {
    // Abort previous in-flight request if user keeps typing
    if (controller) {
      controller.abort();
    }
    controller = new AbortController();

    try {
      const res = await fetch(`${API_BASE_URL}/departments?q=${encodeURIComponent(query)}`, {
        signal: controller.signal,
      });
      return await res.json();
    } catch (err: any) {
      if (err.name === 'AbortError') {
        console.info('[AbortController] Department search request successfully canceled.');
      }
      return [];
    }
  };
}
