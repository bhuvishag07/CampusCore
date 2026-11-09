import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NotificationItem } from '@/types';
import { initialNotifications } from '@/utils/sampleData';

export interface NotificationState {
  items: NotificationItem[];
}

const initialState: NotificationState = {
  items: initialNotifications,
};

export const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (
      state,
      action: PayloadAction<{
        title: string;
        message: string;
        category: NotificationItem['category'];
      }>
    ) => {
      state.items.unshift({
        id: 'notif-' + Date.now(),
        title: action.payload.title,
        message: action.payload.message,
        timestamp: new Date().toISOString(),
        read: false,
        category: action.payload.category,
      });
    },
    markAsRead: (state, action: PayloadAction<string>) => {
      const notif = state.items.find((n) => n.id === action.payload);
      if (notif) notif.read = true;
    },
    markAllAsRead: (state) => {
      state.items.forEach((n) => {
        n.read = true;
      });
    },
    clearNotifications: (state) => {
      state.items = [];
    },
  },
});

export const { addNotification, markAsRead, markAllAsRead, clearNotifications } =
  notificationSlice.actions;

export default notificationSlice.reducer;
