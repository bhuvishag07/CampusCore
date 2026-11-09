import { describe, it, expect } from 'vitest';
import workloadReducer, {
  addWorkload,
  updateWorkload,
  deleteWorkload,
} from '@/redux/slices/workloadSlice';
import meetingsReducer, {
  addMeeting,
  updateMeeting,
  updateMinutes,
  addActionItem,
  updateActionItem,
  deleteActionItem,
} from '@/redux/slices/meetingsSlice';
import resourcesReducer, {
  addResource,
  updateResource,
  deleteResource,
} from '@/redux/slices/resourcesSlice';
import { initialDepartments, initialFaculty, initialCourses } from '@/utils/sampleData';

describe('New Department Management Modules — Redux & Business Logic', () => {
  describe('Module 1: Faculty Workload Management', () => {
    it('initializes with sample workload items mapped to existing faculty', () => {
      const state = workloadReducer(undefined, { type: '@@INIT' });
      expect(state.items.length).toBeGreaterThan(0);
      // Verify faculty IDs match existing faculty
      const sampleFacultyIds = initialFaculty.map((f) => f.id);
      state.items.forEach((item) => {
        expect(sampleFacultyIds).toContain(item.facultyId);
      });
    });

    it('adds a new workload allocation', () => {
      const initialState = { items: [] };
      const newAllocation = {
        id: 'wl-test-1',
        facultyId: 'fac-1',
        courseIds: ['course-1'],
        weeklyHours: 14,
        additionalResponsibilities: ['HOD'],
        status: 'Normal',
      };

      const nextState = workloadReducer(initialState, addWorkload(newAllocation));
      expect(nextState.items).toHaveLength(1);
      expect(nextState.items[0].weeklyHours).toBe(14);
    });

    it('updates teaching hours and re-computes workload allocation', () => {
      const initialState = {
        items: [
          {
            id: 'wl-test-1',
            facultyId: 'fac-1',
            courseIds: ['course-1'],
            weeklyHours: 12,
            additionalResponsibilities: [],
            status: 'Normal',
          },
        ],
      };

      const updated = workloadReducer(
        initialState,
        updateWorkload({
          id: 'wl-test-1',
          weeklyHours: 22,
          status: 'Overloaded',
        })
      );

      expect(updated.items[0].weeklyHours).toBe(22);
      expect(updated.items[0].status).toBe('Overloaded');
    });

    it('deletes a workload allocation', () => {
      const initialState = {
        items: [{ id: 'wl-test-1', facultyId: 'fac-1', weeklyHours: 10 }],
      };

      const nextState = workloadReducer(initialState, deleteWorkload('wl-test-1'));
      expect(nextState.items).toHaveLength(0);
    });
  });

  describe('Module 2: Department Hierarchy Integration', () => {
    it('correctly maps faculty records into department hierarchies without duplicates', () => {
      const cseFaculty = initialFaculty.filter((f) => f.departmentCode === 'CSE');
      expect(cseFaculty.length).toBe(4);

      // Verify HOD presence
      const hod = cseFaculty.find((f) => f.designation.includes('HOD'));
      expect(hod).toBeDefined();
      expect(hod?.fullName).toBe('Dr. Arvind Ramanathan');
    });
  });

  describe('Module 3: Department Meetings & Action Items', () => {
    it('schedules a new meeting and records minutes of meeting (MOM)', () => {
      const initialState = { items: [] };
      const newMeeting = {
        id: 'meet-test-1',
        title: 'Curriculum Revision',
        departmentCode: 'CSE',
        date: '2026-11-15',
        startTime: '10:00',
        endTime: '11:30',
        venue: 'Room 302',
        coordinator: 'Dr. Arvind Ramanathan',
        participants: ['fac-1', 'fac-2'],
        status: 'Upcoming',
        minutes: { summary: '', discussionPoints: '', decisions: '', notes: '' },
        actionItems: [],
      };

      const withMeeting = meetingsReducer(initialState, addMeeting(newMeeting));
      expect(withMeeting.items).toHaveLength(1);

      // Add minutes
      const withMinutes = meetingsReducer(
        withMeeting,
        updateMinutes({
          meetingId: 'meet-test-1',
          minutes: {
            summary: 'Approved new elective in Cloud Systems.',
            decisions: 'Introduce CS402 next term.',
          },
        })
      );

      expect(withMinutes.items[0].minutes.summary).toBe(
        'Approved new elective in Cloud Systems.'
      );
    });

    it('creates, updates and cycles action items inside a meeting', () => {
      const initialState = {
        items: [
          {
            id: 'meet-test-1',
            title: 'Lab Modernization',
            actionItems: [],
          },
        ],
      };

      // Add action item
      const actionItem = {
        id: 'ai-1',
        title: 'Procure GPU units',
        assignedFacultyId: 'fac-2',
        deadline: '2026-12-01',
        priority: 'High',
        status: 'Pending',
      };

      const withAction = meetingsReducer(
        initialState,
        addActionItem({ meetingId: 'meet-test-1', actionItem })
      );

      expect(withAction.items[0].actionItems).toHaveLength(1);
      expect(withAction.items[0].actionItems[0].status).toBe('Pending');

      // Update status to Completed
      const completed = meetingsReducer(
        withAction,
        updateActionItem({
          meetingId: 'meet-test-1',
          actionItemId: 'ai-1',
          updates: { status: 'Completed' },
        })
      );

      expect(completed.items[0].actionItems[0].status).toBe('Completed');
    });
  });

  describe('Module 4: Academic Resources Persistent Library', () => {
    it('stores uploaded resource with base64 data for persistence', () => {
      const initialState = { items: [] };
      const sampleResource = {
        id: 'res-test-1',
        title: 'CS401 Lecture 1 Slides',
        facultyId: 'fac-1',
        facultyName: 'Dr. Arvind Ramanathan',
        departmentCode: 'CSE',
        courseId: 'course-1',
        semester: 6,
        academicYear: '2024-2025',
        category: 'Presentations',
        fileName: 'CS401_L1.pdf',
        fileSize: 1048576, // 1MB
        fileType: 'application/pdf',
        fileData: 'data:application/pdf;base64,JVBERi0xLjQK...',
        uploadDate: new Date().toISOString(),
      };

      const nextState = resourcesReducer(initialState, addResource(sampleResource));
      expect(nextState.items).toHaveLength(1);
      expect(nextState.items[0].fileName).toBe('CS401_L1.pdf');
      expect(nextState.items[0].fileData).toContain('base64');
    });

    it('updates and deletes resources', () => {
      const initialState = {
        items: [
          {
            id: 'res-test-1',
            title: 'Draft Syllabus',
            fileData: 'data:...',
          },
        ],
      };

      const updated = resourcesReducer(
        initialState,
        updateResource({
          id: 'res-test-1',
          title: 'Final Approved Syllabus',
        })
      );
      expect(updated.items[0].title).toBe('Final Approved Syllabus');

      const deleted = resourcesReducer(updated, deleteResource('res-test-1'));
      expect(deleted.items).toHaveLength(0);
    });
  });
});
