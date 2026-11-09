import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DepartmentForm } from '@/components/departments/DepartmentForm';

describe('DepartmentForm Component', () => {
  it('renders required input fields', () => {
    render(<DepartmentForm onSubmit={vi.fn()} existingCodes={['CSE']} />);

    expect(screen.getByLabelText(/Department Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Department Code/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Head of Department/i)).toBeInTheDocument();
  });

  it('validates duplicate department code and required fields', async () => {
    const handleSubmit = vi.fn();
    render(<DepartmentForm onSubmit={handleSubmit} existingCodes={['CSE']} />);

    const submitBtn = screen.getByRole('button', { name: /Add Department/i });
    fireEvent.click(submitBtn);

    // Shows validation errors for empty fields
    await waitFor(() => {
      expect(screen.getByText(/Department name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Department code is required/i)).toBeInTheDocument();
    });

    // Enter existing code 'CSE'
    const codeInput = screen.getByLabelText(/Department Code/i);
    fireEvent.change(codeInput, { target: { value: 'CSE' } });
    fireEvent.blur(codeInput);

    await waitFor(() => {
      expect(screen.getByText(/Department code already exists/i)).toBeInTheDocument();
    });

    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it('submits successfully with valid data and normalizes code to uppercase', async () => {
    const handleSubmit = vi.fn();
    render(<DepartmentForm onSubmit={handleSubmit} existingCodes={['CSE']} />);

    fireEvent.change(screen.getByLabelText(/Department Name/i), {
      target: { value: 'Information Technology' },
    });
    fireEvent.change(screen.getByLabelText(/Department Code/i), {
      target: { value: 'it' },
    });
    fireEvent.change(screen.getByLabelText(/Head of Department/i), {
      target: { value: 'Dr. Rajesh Kumar' },
    });

    const submitBtn = screen.getByRole('button', { name: /Add Department/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalled();
      const submitted = handleSubmit.mock.calls[0][0];
      expect(submitted.code).toBe('IT');
      expect(submitted.name).toBe('Information Technology');
    });
  });
});
