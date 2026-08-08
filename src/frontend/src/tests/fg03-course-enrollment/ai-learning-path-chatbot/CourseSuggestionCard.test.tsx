import React from 'react';
jest.mock('react-icons/fa6', () => new Proxy({}, { get: () => () => null }), { virtual: true });
import { render, screen, fireEvent } from '@testing-library/react';
import CourseSuggestionCard from '../../../components/chatbot/CourseSuggestionCard';
import type { CourseSuggestion } from '../../../types/chatbot.types';

describe('CourseSuggestionCard - FG03 AI Chatbot Tests', () => {
  const eligibleCourse: CourseSuggestion = {
    courseCode: 'CSC10001',
    courseName: 'Intro to Programming',
    credits: 4,
    prerequisiteCleared: true,
    reasonForRecommendation: 'Core requirement for Computer Science.',
    courseOfferingId: 1,
    prerequisiteStatus: 'CLEARED',
  };

  const blockedCourse: CourseSuggestion = {
    courseCode: 'CSC10002',
    courseName: 'Data Structures',
    credits: 4,
    prerequisiteCleared: false,
    reasonForRecommendation: 'Recommended next step, but missing CSC10001.',
    courseOfferingId: 2,
    prerequisiteStatus: 'MISSING',
  };

  it('TC_AIL_02: Renders course recommendation with Eligible status', () => {
    render(<CourseSuggestionCard course={eligibleCourse} />);
    
    expect(screen.getByText('CSC10001 — Intro to Programming')).toBeInTheDocument();
    expect(screen.getByText('4 credits')).toBeInTheDocument();
    expect(screen.getByText('Eligible')).toBeInTheDocument();
    expect(screen.getByText('Core requirement for Computer Science.')).toBeInTheDocument();
  });

  it('TC_AIL_05: Renders course recommendation with Prerequisite Missing status', () => {
    render(<CourseSuggestionCard course={blockedCourse} />);
    
    expect(screen.getByText('CSC10002 — Data Structures')).toBeInTheDocument();
    expect(screen.getByText('Prerequisite Missing')).toBeInTheDocument();
  });

  it('TC_AIL_03: Handles accepting AI course suggestion (Save to Wishlist)', () => {
    const handleSave = jest.fn();
    render(<CourseSuggestionCard course={eligibleCourse} onSave={handleSave} />);
    
    const saveButton = screen.getByRole('button', { name: /Save to Wishlist/i });
    fireEvent.click(saveButton);
    
    expect(handleSave).toHaveBeenCalledWith(eligibleCourse);
    expect(screen.getByRole('button', { name: /Saved to Wishlist/i })).toBeInTheDocument();
  });
});
