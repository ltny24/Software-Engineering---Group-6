import React from 'react';
import { renderHook } from '@testing-library/react';
import { useAuth } from './useAuth';

describe('useAuth', () => {
  it('returns a safe guest context when used outside AuthProvider', () => {
    const { result } = renderHook(() => useAuth());

    expect(result.current.user).toBeNull();
    expect(result.current.isLoggedIn).toBe(false);
    expect(typeof result.current.setUser).toBe('function');
    expect(typeof result.current.logout).toBe('function');
  });
});
