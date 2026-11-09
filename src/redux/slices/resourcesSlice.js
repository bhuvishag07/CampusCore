// Redux Slice — Academic Resources Library
// File data stored as base64 via Redux Persist → survives page refresh
// Demonstrates: Redux Toolkit, file handling in Redux, persistence

import { createSlice } from '@reduxjs/toolkit';

const resourcesSlice = createSlice({
  name: 'resources',
  initialState: {
    items: [], // Each item: { id, title, description, facultyId, departmentCode, courseId,
               //              semester, academicYear, category, fileType, fileSize,
               //              fileName, fileData (base64), uploadDate, lastUpdated }
  },
  reducers: {
    addResource: (state, action) => {
      state.items.push(action.payload);
    },
    updateResource: (state, action) => {
      const idx = state.items.findIndex((r) => r.id === action.payload.id);
      if (idx !== -1) {
        state.items[idx] = { ...state.items[idx], ...action.payload };
      }
    },
    deleteResource: (state, action) => {
      state.items = state.items.filter((r) => r.id !== action.payload);
    },
  },
});

export const { addResource, updateResource, deleteResource } = resourcesSlice.actions;
export default resourcesSlice.reducer;
