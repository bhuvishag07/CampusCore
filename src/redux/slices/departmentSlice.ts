import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Department, DepartmentStatus } from '@/types';
import { initialDepartments } from '@/utils/sampleData';
import { departmentApiService } from '@/services/api';

export interface DepartmentState {
  items: Department[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  searchQuery: string;
  statusFilter: 'All' | DepartmentStatus;
  sortBy: 'name' | 'code' | 'students' | 'year';
  selectedDepartmentId: string | null;
}

const initialState: DepartmentState = {
  items: initialDepartments,
  status: 'idle',
  error: null,
  searchQuery: '',
  statusFilter: 'All',
  sortBy: 'name',
  selectedDepartmentId: null,
};

// Async thunks demonstrating Redux Thunk with Axios
export const fetchDepartments = createAsyncThunk(
  'departments/fetchDepartments',
  async (_, { rejectWithValue }) => {
    try {
      const data = await departmentApiService.getAll();
      return data;
    } catch (err: any) {
      // Fallback gracefully without breaking UI
      return rejectWithValue(err.message || 'Failed to fetch departments from server');
    }
  }
);

export const addDepartmentThunk = createAsyncThunk(
  'departments/addDepartmentThunk',
  async (department: Department, { rejectWithValue }) => {
    try {
      return await departmentApiService.create(department);
    } catch (err: any) {
      // Return optimistically
      return department;
    }
  }
);

export const deleteDepartmentThunk = createAsyncThunk(
  'departments/deleteDepartmentThunk',
  async (id: string, { rejectWithValue }) => {
    try {
      await departmentApiService.delete(id);
      return id;
    } catch (err: any) {
      return id;
    }
  }
);

export const departmentSlice = createSlice({
  name: 'departments',
  initialState,
  reducers: {
    addDepartment: (state, action: PayloadAction<Department>) => {
      // Normalise code to uppercase
      const normalized: Department = {
        ...action.payload,
        code: action.payload.code.toUpperCase().trim(),
        facultyCount: action.payload.facultyCount || 0,
        studentCount: action.payload.studentCount || 0,
        courseCount: action.payload.courseCount || 0,
      };
      state.items.unshift(normalized);
    },
    updateDepartment: (state, action: PayloadAction<Department>) => {
      const index = state.items.findIndex((d) => d.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = {
          ...action.payload,
          code: action.payload.code.toUpperCase().trim(),
        };
      }
    },
    deleteDepartment: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((d) => d.id !== action.payload);
      if (state.selectedDepartmentId === action.payload) {
        state.selectedDepartmentId = null;
      }
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setStatusFilter: (state, action: PayloadAction<'All' | DepartmentStatus>) => {
      state.statusFilter = action.payload;
    },
    setSortBy: (state, action: PayloadAction<'name' | 'code' | 'students' | 'year'>) => {
      state.sortBy = action.payload;
    },
    setSelectedDepartmentId: (state, action: PayloadAction<string | null>) => {
      state.selectedDepartmentId = action.payload;
    },
    resetSampleDepartments: (state) => {
      state.items = initialDepartments;
      state.searchQuery = '';
      state.statusFilter = 'All';
      state.sortBy = 'name';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDepartments.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchDepartments.fulfilled, (state, action) => {
        state.status = 'succeeded';
        if (action.payload && action.payload.length > 0) {
          state.items = action.payload;
        }
      })
      .addCase(fetchDepartments.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(addDepartmentThunk.fulfilled, (state, action) => {
        const exists = state.items.some((d) => d.id === action.payload.id);
        if (!exists) {
          state.items.unshift(action.payload);
        }
      })
      .addCase(deleteDepartmentThunk.fulfilled, (state, action) => {
        state.items = state.items.filter((d) => d.id !== action.payload);
      });
  },
});

export const {
  addDepartment,
  updateDepartment,
  deleteDepartment,
  setSearchQuery,
  setStatusFilter,
  setSortBy,
  setSelectedDepartmentId,
  resetSampleDepartments,
} = departmentSlice.actions;

export default departmentSlice.reducer;
