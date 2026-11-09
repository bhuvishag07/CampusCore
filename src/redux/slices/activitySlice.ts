import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Activity, ActivityCategory } from '@/types';
import { initialActivities } from '@/utils/sampleData';

export interface ActivityState {
  items: Activity[];
  categoryFilter: ActivityCategory;
}

const initialState: ActivityState = {
  items: initialActivities,
  categoryFilter: 'All',
};

export const activitySlice = createSlice({
  name: 'activity',
  initialState,
  reducers: {
    addActivity: (
      state,
      action: PayloadAction<{
        title: string;
        detail: string;
        category: 'Departments' | 'Faculty' | 'Students' | 'Courses';
        iconType: Activity['iconType'];
      }>
    ) => {
      const newActivity: Activity = {
        id: 'act-' + Date.now(),
        title: action.payload.title,
        detail: action.payload.detail,
        category: action.payload.category,
        timestamp: new Date().toISOString(),
        iconType: action.payload.iconType,
      };
      state.items.unshift(newActivity);
      // Keep recent 50
      if (state.items.length > 50) {
        state.items.pop();
      }
    },
    setCategoryFilter: (state, action: PayloadAction<ActivityCategory>) => {
      state.categoryFilter = action.payload;
    },
    clearActivities: (state) => {
      state.items = [];
    },
    resetSampleActivities: (state) => {
      state.items = initialActivities;
      state.categoryFilter = 'All';
    },
  },
});

export const { addActivity, setCategoryFilter, clearActivities, resetSampleActivities } =
  activitySlice.actions;

export default activitySlice.reducer;
