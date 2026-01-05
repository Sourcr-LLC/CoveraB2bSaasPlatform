import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/api';

const WALKTHROUGH_KEY = 'covera_walkthrough_completed';

export function useWalkthrough(pathname: string) {
  const [shouldShowWalkthrough, setShouldShowWalkthrough] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [pendingShow, setPendingShow] = useState(false); // Track if we need to show when we reach dashboard

  const checkWalkthroughStatus = useCallback(async (setAsPending = false) => {
    try {
      // Check if user has completed walkthrough
      const { data: { session } } = await supabase.auth.getSession();
      
      console.log('🎯 Walkthrough check - Session:', session?.user?.id);
      
      if (!session?.user?.id) {
        console.log('❌ No session, hiding walkthrough');
        setIsChecking(false);
        return;
      }

      // Check localStorage first for quick response
      const localCompleted = localStorage.getItem(`${WALKTHROUGH_KEY}_${session.user.id}`);
      
      console.log('📝 Walkthrough localStorage:', localCompleted);
      
      if (localCompleted === 'true') {
        console.log('✅ Walkthrough already completed');
        setShouldShowWalkthrough(false);
        setPendingShow(false);
        setIsChecking(false);
        return;
      }

      // If not on dashboard and setAsPending is true, mark as pending
      if (setAsPending && pathname !== '/dashboard') {
        console.log('⏳ Setting walkthrough as pending (not on dashboard yet)');
        setPendingShow(true);
        setShouldShowWalkthrough(false);
        setIsChecking(false);
        return;
      }

      // Only show if we're on dashboard
      if (pathname === '/dashboard') {
        console.log('🚀 Showing walkthrough on dashboard!');
        setShouldShowWalkthrough(true);
        setPendingShow(false);
      } else {
        console.log('❌ Not on dashboard, hiding walkthrough');
        setShouldShowWalkthrough(false);
      }
      setIsChecking(false);
    } catch (error) {
      console.error('Error checking walkthrough status:', error);
      // On error, don't show walkthrough to avoid blocking user
      setShouldShowWalkthrough(false);
      setPendingShow(false);
      setIsChecking(false);
    }
  }, [pathname]);

  useEffect(() => {
    checkWalkthroughStatus();
    
    // Expose reset function globally for debugging
    (window as any).resetWalkthrough = () => {
      const keys = Object.keys(localStorage).filter(k => k.startsWith(WALKTHROUGH_KEY));
      keys.forEach(k => localStorage.removeItem(k));
      console.log('🔄 Walkthrough reset! Refresh page to see it again.');
      console.log('Removed keys:', keys);
    };

    // Listen for custom event to trigger walkthrough
    const handleShowWalkthrough = () => {
      console.log('📣 Received showWalkthrough event');
      checkWalkthroughStatus(true); // Pass true to mark as pending if not on dashboard
    };
    
    window.addEventListener('showWalkthrough', handleShowWalkthrough);
    
    return () => {
      window.removeEventListener('showWalkthrough', handleShowWalkthrough);
    };
  }, [checkWalkthroughStatus]);

  // Handle location changes - show walkthrough if pending and we're now on dashboard
  useEffect(() => {
    if (pendingShow && pathname === '/dashboard') {
      console.log('✨ Arrived on dashboard with pending walkthrough - showing now!');
      setShouldShowWalkthrough(true);
      setPendingShow(false);
    } else if (pathname !== '/dashboard') {
      // Hide walkthrough when leaving dashboard
      setShouldShowWalkthrough(false);
    }
  }, [pathname, pendingShow]);

  const completeWalkthrough = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user?.id) {
        // Store in localStorage
        localStorage.setItem(`${WALKTHROUGH_KEY}_${session.user.id}`, 'true');
      }
      
      setShouldShowWalkthrough(false);
    } catch (error) {
      console.error('Error completing walkthrough:', error);
      setShouldShowWalkthrough(false);
    }
  };

  const skipWalkthrough = async () => {
    await completeWalkthrough();
  };

  const resetWalkthrough = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user?.id) {
        // Remove from localStorage
        localStorage.removeItem(`${WALKTHROUGH_KEY}_${session.user.id}`);
        console.log('🔄 Walkthrough reset - triggering immediately');
      }
      
      // Show immediately
      setShouldShowWalkthrough(true);
      
      // Return true to indicate success
      return true;
    } catch (error) {
      console.error('Error resetting walkthrough:', error);
      return false;
    }
  };

  return {
    shouldShowWalkthrough,
    isChecking,
    completeWalkthrough,
    skipWalkthrough,
    resetWalkthrough
  };
}