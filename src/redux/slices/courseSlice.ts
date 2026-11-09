import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { Course } from '@/types';
import { initialCourses } from '@/utils/sampleData';
import { courseApiService } from '@/services/api';

export interface CourseState {
  items: Course[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  searchQuery: string;
  departmentFilter: string; // 'All' or departmentCode
  semesterFilter: number | 'All';
  sortBy: 'code' | 'name' | 'credits' | 'semester';
}

const initialState: CourseState = {
  items: initialCourses,
  status: 'idle',
  error: null,
  searchQuery: '',
  departmentFilter: 'All',
  semesterFilter: 'All',
  sortBy: 'code',
};

export const fetchCourses = createAsyncThunk(
  'courses/fetchCourses',
  async (_, { rejectWithValue }) => {
    try {
      return await courseApiService.getAll();
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to fetch courses');
    }
  }
);

export const courseSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {
    addCourse: (state, action: PayloadAction<Course>) => {
      state.items.unshift(action.payload);
    },
    updateCourse: (state, action: PayloadAction<Course>) => {
      const index = state.items.findIndex((c) => c.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    deleteCourse: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((c) => c.id !== action.payload);
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
    setSortBy: (state, action: PayloadAction<'code' | 'name' | 'credits' | 'semester'>) => {
      state.sortBy = action.payload;
    },
    resetSampleCourses: (state) => {
      state.items = initialCourses;
      state.searchQuery = '';
      state.departmentFilter = 'All';
      state.semesterFilter = 'All';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourses.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.status = 'succeeded';
        if (action.payload && action.payload.length > 0) {
          state.items = action.payload;
        }
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const {
  addCourse,
  updateCourse,
  deleteCourse,
  setSearchQuery,
  setDepartmentFilter,
  setSemesterFilter,
  setSortBy,
  resetSampleCourses,
} = courseSlice.actions;

export default courseSlice.reducer;
