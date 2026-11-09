import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { Student, EnrollmentStatus } from '@/types';
import { initialStudents } from '@/utils/sampleData';
import { studentApiService } from '@/services/api';

export interface StudentState {
  items: Student[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  searchQuery: string;
  departmentFilter: string; // 'All' or departmentCode
  semesterFilter: number | 'All';
  statusFilter: 'All' | EnrollmentStatus;
  sortBy: 'name' | 'id' | 'gpa' | 'admission';
}

const initialState: StudentState = {
  items: initialStudents,
  status: 'idle',
  error: null,
  searchQuery: '',
  departmentFilter: 'All',
  semesterFilter: 'All',
  statusFilter: 'All',
  sortBy: 'name',
};

export const fetchStudents = createAsyncThunk(
  'students/fetchStudents',
  async (_, { rejectWithValue }) => {
    try {
      return await studentApiService.getAll();
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to fetch students');
    }
  }
);

export const studentSlice = createSlice({
  name: 'students',
  initialState,
  reducers: {
    addStudent: (state, action: PayloadAction<Student>) => {
      state.items.unshift(action.payload);
    },
    updateStudent: (state, action: PayloadAction<Student>) => {
      const index = state.items.findIndex((s) => s.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    deleteStudent: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((s) => s.id !== action.payload);
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setDepartmentFilter: (state, action: PayloadAction<string>) => {
      state.departmentFilter = action.payload;
    },
    setSemesterFilter: (state, action: PayloadAction<number | 'All'>) => {
      state.semesterFilter = action.payload;
    },
    setStatusFilter: (state, action: PayloadAction<'All' | EnrollmentStatus>) => {
      state.statusFilter = action.payload;
    },
    setSortBy: (state, action: PayloadAction<'name' | 'id' | 'gpa' | 'admission'>) => {
      state.sortBy = action.payload;
    },
    resetSampleStudents: (state) => {
      state.items = initialStudents;
      state.searchQuery = '';
      state.departmentFilter = 'All';
      state.semesterFilter = 'All';
      state.statusFilter = 'All';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudents.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchStudents.fulfilled, (state, action) => {
        state.status = 'succeeded';
        if (action.payload && action.payload.length > 0) {
          state.items = action.payload;
        }
      })
      .addCase(fetchStudents.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const {
  addStudent,
  updateStudent,
  deleteStudent,
  setSearchQuery,
  setDepartmentFilter,
  setSemesterFilter,
  setStatusFilter,
  setSortBy,
  resetSampleStudents,
} = studentSlice.actions;

export default studentSlice.reducer;
