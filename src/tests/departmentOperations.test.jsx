import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import { DepartmentManagerBasic } from '@/components/departments/DepartmentManagerBasic';

describe('Department Operations & Empty State (Assignment View)', () => {
  it('displays the exact required empty state message when no records exist', () => {
    render(
      <BrowserRouter>
        <DepartmentManagerBasic />
      </BrowserRouter>
    );

    // Exact word for word requirements:
    // "No department records available" and "Add your first department using the form."
    expect(screen.getByText('No department records available')).toBeInTheDocument();
    expect(screen.getByText('Add your first department using the form.')).toBeInTheDocument();
  });

  it('adds a department dynamically using useState', async () => {
    render(
      <BrowserRouter>
        <DepartmentManagerBasic />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText(/Department Name/i), {
      target: { value: 'Civil Engineering' },
    });
    fireEvent.change(screen.getByLabelText(/Department Code/i), {
      target: { value: 'ce' },
    });
    fireEvent.change(screen.getByLabelText(/HOD Name/i), {
      target: { value: 'Dr. Suresh Varma' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Add Department/i }));

    await waitFor(() => {
      expect(screen.getByText('Civil Engineering')).toBeInTheDocument();
      expect(screen.getByText('Dr. Suresh Varma')).toBeInTheDocument();
      // Empty state should now be gone
      expect(screen.queryByText('No department records available')).not.toBeInTheDocument();
    });
  });

  it('deletes a department after confirmation', async () => {
    render(
      <BrowserRouter>
        <DepartmentManagerBasic />
      </BrowserRouter>
    );

    // Load demo records
    fireEvent.click(screen.getByText(/Load Demo Records/i));

    expect(screen.getByText('Computer Science & Engineering')).toBeInTheDocument();

    // Click delete on first card
    const deleteButtons = screen.getAllByTitle('Delete department');
    fireEvent.click(deleteButtons[0]);

    // Confirmation dialog appears
    expect(screen.getByText(/Are you sure you want to delete/i)).toBeInTheDocument();

    // Confirm deletion
    const confirmBtn = screen.getByRole('button', { name: /^Delete$/i });
    fireEvent.click(confirmBtn);

    await waitFor(() => {
      expect(screen.queryByText('Computer Science & Engineering')).not.toBeInTheDocument();
    });
  });
});
