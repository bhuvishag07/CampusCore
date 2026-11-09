import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { Faculty, Designation } from '@/types';
import { initialFaculty } from '@/utils/sampleData';
import { facultyApiService } from '@/services/api';

export interface FacultyState {
  items: Faculty[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  searchQuery: string;
  departmentFilter: string; // 'All' or departmentCode
  designationFilter: string; // 'All' or designation
  sortBy: 'name' | 'designation' | 'joiningDate';
}

const initialState: FacultyState = {
  items: initialFaculty,
  status: 'idle',
  error: null,
  searchQuery: '',
  departmentFilter: 'All',
  designationFilter: 'All',
  sortBy: 'name',
};

export const fetchFaculty = createAsyncThunk(
  'faculty/fetchFaculty',
  async (_, { rejectWithValue }) => {
    try {
      return await facultyApiService.getAll();
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to fetch faculty');
    }
  }
);

export const facultySlice = createSlice({
  name: 'faculty',
  initialState,
  reducers: {
    addFaculty: (state, action: PayloadAction<Faculty>) => {
      state.items.unshift(action.payload);
    },
    updateFaculty: (state, action: PayloadAction<Faculty>) => {
      const index = state.items.findIndex((f) => f.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    deleteFaculty: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((f) => f.id !== action.payload);
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setDepartmentFilter: (state, action: PayloadAction<string>) => {
      state.departmentFilter = action.payload;
    },
    setDesignationFilter: (state, action: PayloadAction<string>) => {
      state.designationFilter = action.payload;
    },
    setSortBy: (state, action: PayloadAction<'name' | 'designation' | 'joiningDate'>) => {
      state.sortBy = action.payload;
    },
    resetSampleFaculty: (state) => {
      state.items = initialFaculty;
      state.searchQuery = '';
      state.departmentFilter = 'All';
      state.designationFilter = 'All';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFaculty.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchFaculty.fulfilled, (state, action) => {
        state.status = 'succeeded';
        if (action.payload && action.payload.length > 0) {
          state.items = action.payload;
        }
      })
      .addCase(fetchFaculty.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const {
  addFaculty,
  updateFaculty,
  deleteFaculty,
  setSearchQuery,
  setDepartmentFilter,
  setDesignationFilter,
  setSortBy,
  resetSampleFaculty,
} = facultySlice.actions;

export default facultySlice.reducer;
