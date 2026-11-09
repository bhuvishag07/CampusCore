import { describe, it, expect, vi, beforeEach } from 'vitest';
import { departmentApiService, studentApiService, axiosClient, createCancelableSearch } from '@/services/api';

describe('API Services (Axios & Fetch API Integration)', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('departmentApiService.getAll uses Axios to fetch departments', async () => {
    const mockData = [
      { id: '1', code: 'CSE', name: 'Computer Science', hod: 'Dr. Arvind' },
    ];
    vi.spyOn(axiosClient, 'get').mockResolvedValue({ data: mockData });

    const result = await departmentApiService.getAll();
    expect(axiosClient.get).toHaveBeenCalledWith('/departments');
    expect(result).toEqual(mockData);
  });

  it('studentApiService.getAll uses Fetch API to retrieve students', async () => {
    const mockStudents = [
      { id: '1', studentId: 'STU-01', fullName: 'Anna Morgan', departmentCode: 'CSE' },
    ];

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockStudents,
    });

    const result = await studentApiService.getAll();
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/students'),
      expect.objectContaining({ method: 'GET' })
    );
    expect(result).toEqual(mockStudents);
  });

  it('createCancelableSearch demonstrates AbortController signal handling', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [{ id: '1', code: 'CSE' }],
    });

    const searchFn = createCancelableSearch();
    const promise = searchFn('comp');
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('departments?q=comp'),
      expect.objectContaining({ signal: expect.any(Object) })
    );
    const res = await promise;
    expect(res).toHaveLength(1);
  });
});
