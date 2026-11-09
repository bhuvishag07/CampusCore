// Redux Slice — Faculty Workload Management
// Demonstrates: Redux Toolkit, createSlice, reducers, initial state

import { createSlice } from '@reduxjs/toolkit';

// Initial workload data mapped to existing faculty IDs from sampleData.ts
const initialWorkloads = [
  {
    id: 'wl-1',
    facultyId: 'fac-1',
    courseIds: ['course-1'],
    weeklyHours: 14,
    additionalResponsibilities: ['HOD', 'Academic Mentor'],
    status: 'Normal',
  },
  {
    id: 'wl-2',
    facultyId: 'fac-2',
    courseIds: ['course-3'],
    weeklyHours: 10,
    additionalResponsibilities: ['Curriculum Coordinator'],
    status: 'Normal',
  },
  {
    id: 'wl-3',
    facultyId: 'fac-3',
    courseIds: [],
    weeklyHours: 6,
    additionalResponsibilities: ['Lab In-charge'],
    status: 'Underutilized',
  },
  {
    id: 'wl-4',
    facultyId: 'fac-4',
    courseIds: ['course-2'],
    weeklyHours: 12,
    additionalResponsibilities: ['Research Coordinator'],
    status: 'Normal',
  },
  {
    id: 'wl-5',
    facultyId: 'fac-5',
    courseIds: ['course-4'],
    weeklyHours: 20,
    additionalResponsibilities: ['HOD', 'PhD Guide', 'Placement Coordinator'],
    status: 'Overloaded',
  },
  {
    id: 'wl-6',
    facultyId: 'fac-6',
    courseIds: ['course-5'],
    weeklyHours: 12,
    additionalResponsibilities: ['Lab In-charge'],
    status: 'Normal',
  },
  {
    id: 'wl-7',
    facultyId: 'fac-7',
    courseIds: [],
    weeklyHours: 8,
    additionalResponsibilities: ['Student Mentor'],
    status: 'Normal',
  },
  {
    id: 'wl-8',
    facultyId: 'fac-8',
    courseIds: ['course-6'],
    weeklyHours: 16,
    additionalResponsibilities: ['HOD', 'NAAC Coordinator'],
    status: 'Normal',
  },
  {
    id: 'wl-9',
    facultyId: 'fac-9',
    courseIds: ['course-7'],
    weeklyHours: 10,
    additionalResponsibilities: ['Timetable Coordinator'],
    status: 'Normal',
  },
  {
    id: 'wl-10',
    facultyId: 'fac-10',
    courseIds: ['course-8'],
    weeklyHours: 22,
    additionalResponsibilities: ['HOD', 'Lab In-charge', 'Research Guide', 'Industry Liaison'],
    status: 'Overloaded',
  },
  {
    id: 'wl-11',
    facultyId: 'fac-11',
    courseIds: [],
    weeklyHours: 7,
    additionalResponsibilities: ['Lab In-charge'],
    status: 'Underutilized',
  },
  {
    id: 'wl-12',
    facultyId: 'fac-12',
    courseIds: ['course-9'],
    weeklyHours: 15,
    additionalResponsibilities: ['HOD', 'Sports Coordinator'],
    status: 'Normal',
  },
  {
    id: 'wl-13',
    facultyId: 'fac-13',
    courseIds: [],
    weeklyHours: 9,
    additionalResponsibilities: ['Academic Mentor'],
    status: 'Normal',
  },
  {
    id: 'wl-14',
    facultyId: 'fac-14',
    courseIds: ['course-10'],
    weeklyHours: 18,
    additionalResponsibilities: ['HOD', 'PhD Guide', 'Industry Liaison'],
    status: 'Normal',
  },
  {
    id: 'wl-15',
    facultyId: 'fac-15',
    courseIds: [],
    weeklyHours: 5,
    additionalResponsibilities: [],
    status: 'Underutilized',
  },
];

const workloadSlice = createSlice({
  name: 'workload',
  initialState: {
    items: initialWorkloads,
  },
  reducers: {
    // Add a new workload record
    addWorkload: (state, action) => {
      state.items.push(action.payload);
    },
    // Update an existing workload record by id
    updateWorkload: (state, action) => {
      const idx = state.items.findIndex((w) => w.id === action.payload.id);
      if (idx !== -1) {
        state.items[idx] = { ...state.items[idx], ...action.payload };
      }
    },
    // Delete a workload record by id
    deleteWorkload: (state, action) => {
      state.items = state.items.filter((w) => w.id !== action.payload);
    },
  },
});

export const { addWorkload, updateWorkload, deleteWorkload } = workloadSlice.actions;
export default workloadSlice.reducer;
