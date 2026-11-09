// Redux Slice — Department Meetings
// Demonstrates: Redux Toolkit, nested state, multiple action types

import { createSlice } from '@reduxjs/toolkit';

const today = new Date();
const addDays = (d, n) => new Date(d.getTime() + n * 86400000).toISOString().split('T')[0];
const subDays = (d, n) => new Date(d.getTime() - n * 86400000).toISOString().split('T')[0];

const initialMeetings = [
  {
    id: 'meet-1',
    title: 'Semester Academic Planning — CSE',
    description: 'Review and finalise the academic calendar, course distribution and faculty workload for the upcoming semester.',
    departmentCode: 'CSE',
    date: addDays(today, 5),
    startTime: '10:00',
    endTime: '12:00',
    venue: 'CSE Seminar Hall, Block A',
    coordinator: 'Dr. Arvind Ramanathan',
    coordinatorFacultyId: 'fac-1',
    participants: ['fac-1', 'fac-2', 'fac-3', 'fac-4'],
    agenda: 'Course allocation review, Lab schedule, Faculty leave policy, Industry visit planning.',
    status: 'Upcoming',
    minutes: { summary: '', discussionPoints: '', decisions: '', notes: '' },
    actionItems: [],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'meet-2',
    title: 'AI Research Symposium Planning',
    description: 'Coordinate with faculty for internal paper presentations and define evaluation criteria for the symposium.',
    departmentCode: 'AIDS',
    date: addDays(today, 12),
    startTime: '14:00',
    endTime: '16:00',
    venue: 'Innovation Lab, Block B',
    coordinator: 'Dr. Priya Sundaram',
    coordinatorFacultyId: 'fac-5',
    participants: ['fac-5', 'fac-6', 'fac-7'],
    agenda: 'Paper shortlisting, Reviewer assignment, Symposium logistics.',
    status: 'Upcoming',
    minutes: { summary: '', discussionPoints: '', decisions: '', notes: '' },
    actionItems: [
      {
        id: 'ai-2-1',
        title: 'Shortlist paper submissions',
        description: 'Review the 12 submitted abstracts and shortlist 6 for presentation.',
        assignedFacultyId: 'fac-6',
        deadline: addDays(today, 8),
        priority: 'High',
        status: 'Pending',
      },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'meet-3',
    title: 'IT Department NAAC Compliance Review',
    description: 'Internal audit meeting to verify documentation compliance before the NAAC inspection.',
    departmentCode: 'IT',
    date: subDays(today, 3),
    startTime: '09:00',
    endTime: '11:30',
    venue: 'Conference Room 2, Admin Block',
    coordinator: 'Dr. Rajesh Kumar',
    coordinatorFacultyId: 'fac-8',
    participants: ['fac-8', 'fac-9'],
    agenda: 'Document checklist review, Faculty feedback compilation, Lab upgrade requests.',
    status: 'Completed',
    minutes: {
      summary: 'All mandatory NAAC criteria documents were reviewed. Minor gaps identified in criterion 3.',
      discussionPoints:
        '1. Research publication records need updating.\n2. Student feedback forms must be digitized.\n3. Infrastructure upgrade budget approved for lab expansion.',
      decisions:
        '1. Submit research output report by end of month.\n2. Migrate feedback forms to digital portal.\n3. Lab upgrade proposal submitted to management.',
      notes: 'Next review scheduled 30 days before NAAC visit.',
    },
    actionItems: [
      {
        id: 'ai-3-1',
        title: 'Digitize student feedback forms',
        description: 'Convert existing paper feedback forms to online format via portal.',
        assignedFacultyId: 'fac-9',
        deadline: addDays(today, 10),
        priority: 'Medium',
        status: 'In Progress',
      },
      {
        id: 'ai-3-2',
        title: 'Submit research output report',
        description: 'Compile all faculty research publications and submit to NAAC coordinator.',
        assignedFacultyId: 'fac-8',
        deadline: addDays(today, 25),
        priority: 'High',
        status: 'Pending',
      },
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
  },
  {
    id: 'meet-4',
    title: 'ECE Lab Safety & Equipment Audit',
    description: 'Annual safety compliance and equipment serviceability check for all ECE labs.',
    departmentCode: 'ECE',
    date: subDays(today, 10),
    startTime: '11:00',
    endTime: '13:00',
    venue: 'Electronics Lab, Block C',
    coordinator: 'Dr. Meenakshi Iyer',
    coordinatorFacultyId: 'fac-10',
    participants: ['fac-10', 'fac-11'],
    agenda: 'Equipment audit, Safety signage, Maintenance schedule, Requisition list.',
    status: 'Completed',
    minutes: {
      summary: 'Lab equipment audit completed. 3 instruments flagged for calibration. Safety signage updated.',
      discussionPoints:
        '1. Oscilloscope bank requires calibration.\n2. High-voltage signage replaced.\n3. New soldering stations requisitioned.',
      decisions: 'Maintenance contractor to be called for oscilloscope calibration. Procurement approved for new equipment.',
      notes: 'Lab will remain fully operational during maintenance window.',
    },
    actionItems: [],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 240).toISOString(),
  },
  {
    id: 'meet-5',
    title: 'ME-CE Joint Industry Collaboration Meet',
    description: 'Joint meeting to finalise MOU with two industry partners for internship and project sponsorship.',
    departmentCode: 'ME',
    date: addDays(today, 20),
    startTime: '15:00',
    endTime: '17:00',
    venue: 'Board Room, Main Block',
    coordinator: 'Dr. Vikram Malhotra',
    coordinatorFacultyId: 'fac-12',
    participants: ['fac-12', 'fac-13', 'fac-14', 'fac-15'],
    agenda: 'MOU draft review, Internship quota discussion, Project sponsorship terms, Visit schedule.',
    status: 'Upcoming',
    minutes: { summary: '', discussionPoints: '', decisions: '', notes: '' },
    actionItems: [
      {
        id: 'ai-5-1',
        title: 'Prepare MOU draft',
        description: 'Finalise the MOU template with legal team and share with industry partners.',
        assignedFacultyId: 'fac-14',
        deadline: addDays(today, 15),
        priority: 'High',
        status: 'In Progress',
      },
      {
        id: 'ai-5-2',
        title: 'Coordinate student list for internship',
        description: 'Compile eligible final-year student list for industry review.',
        assignedFacultyId: 'fac-13',
        deadline: addDays(today, 18),
        priority: 'Medium',
        status: 'Pending',
      },
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
];

const meetingsSlice = createSlice({
  name: 'meetings',
  initialState: {
    items: initialMeetings,
  },
  reducers: {
    addMeeting: (state, action) => {
      state.items.push(action.payload);
    },
    updateMeeting: (state, action) => {
      const idx = state.items.findIndex((m) => m.id === action.payload.id);
      if (idx !== -1) {
        state.items[idx] = { ...state.items[idx], ...action.payload };
      }
    },
    deleteMeeting: (state, action) => {
      state.items = state.items.filter((m) => m.id !== action.payload);
    },
    updateMinutes: (state, action) => {
      const { meetingId, minutes } = action.payload;
      const meeting = state.items.find((m) => m.id === meetingId);
      if (meeting) {
        meeting.minutes = { ...meeting.minutes, ...minutes };
      }
    },
    addActionItem: (state, action) => {
      const { meetingId, actionItem } = action.payload;
      const meeting = state.items.find((m) => m.id === meetingId);
      if (meeting) {
        meeting.actionItems.push(actionItem);
      }
    },
    updateActionItem: (state, action) => {
      const { meetingId, actionItemId, updates } = action.payload;
      const meeting = state.items.find((m) => m.id === meetingId);
      if (meeting) {
        const aiIdx = meeting.actionItems.findIndex((ai) => ai.id === actionItemId);
        if (aiIdx !== -1) {
          meeting.actionItems[aiIdx] = { ...meeting.actionItems[aiIdx], ...updates };
        }
      }
    },
    deleteActionItem: (state, action) => {
      const { meetingId, actionItemId } = action.payload;
      const meeting = state.items.find((m) => m.id === meetingId);
      if (meeting) {
        meeting.actionItems = meeting.actionItems.filter((ai) => ai.id !== actionItemId);
      }
    },
  },
});

export const {
  addMeeting,
  updateMeeting,
  deleteMeeting,
  updateMinutes,
  addActionItem,
  updateActionItem,
  deleteActionItem,
} = meetingsSlice.actions;
export default meetingsSlice.reducer;
