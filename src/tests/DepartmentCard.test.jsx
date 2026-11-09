import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import { DepartmentCard } from '@/components/departments/DepartmentCard';

describe('DepartmentCard Component', () => {
  const defaultProps = {
    id: 'dept-test-1',
    name: 'Computer Science & Engineering',
    code: 'CSE',
    hod: 'Dr. Arvind Ramanathan',
    description: 'Premier department specializing in algorithms and systems.',
    establishedYear: 2004,
    status: 'Active',
    facultyCount: 14,
    studentCount: 120,
    courseCount: 8,
    tone: 0,
    onDelete: vi.fn(),
    onEdit: vi.fn(),
  };

  const renderWithRouter = (ui) => {
    return render(<BrowserRouter>{ui}</BrowserRouter>);
  };

  it('renders department name, code badge and HOD name correctly', () => {
    renderWithRouter(<DepartmentCard {...defaultProps} />);

    expect(screen.getByText('Computer Science & Engineering')).toBeInTheDocument();
    // Since code appears in badge and typed badge, query all
    const codes = screen.getAllByText('CSE');
    expect(codes.length).toBeGreaterThan(0);
    expect(screen.getByText('Dr. Arvind Ramanathan')).toBeInTheDocument();
    expect(screen.getByText(/120/)).toBeInTheDocument();
  });

  it('calls onEdit when edit action pill is clicked', () => {
    renderWithRouter(<DepartmentCard {...defaultProps} />);
    const editBtn = screen.getByTitle('Edit department');
    fireEvent.click(editBtn);
    expect(defaultProps.onEdit).toHaveBeenCalledWith('dept-test-1');
  });

  it('calls onDelete when delete action pill is clicked', () => {
    renderWithRouter(<DepartmentCard {...defaultProps} />);
    const deleteBtn = screen.getByTitle('Delete department');
    fireEvent.click(deleteBtn);
    expect(defaultProps.onDelete).toHaveBeenCalledWith('dept-test-1', 'Computer Science & Engineering');
  });
});
