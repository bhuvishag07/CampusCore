import React from 'react';
import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { CourseForm } from '@/components/courses/CourseForm';
import { FacultyForm } from '@/components/faculty/FacultyForm';
import { StudentForm } from '@/components/students/StudentForm';

const departments = [{ id: 'dept-1', code: 'CSE', name: 'Computer Science & Engineering' }];

describe('Formik form defaults', () => {
  it.each([
    ['faculty', FacultyForm, 'facultyId'],
    ['student', StudentForm, 'studentId'],
    ['course', CourseForm, 'courseCode'],
  ])('keeps the generated %s identifier stable across renders', (_, Form, identifierField) => {
    const props = { departments, onSubmit: vi.fn() };
    const { container, rerender } = render(<Form {...props} />);
    const initialIdentifier = container.querySelector(`[name="${identifierField}"]`).value;

    rerender(<Form {...props} />);

    expect(container.querySelector(`[name="${identifierField}"]`).value).toBe(initialIdentifier);
  });
});
