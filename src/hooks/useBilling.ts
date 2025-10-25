/**
 * Billing Hook (Simplified - Stripe removed)
 * Provides basic billing and subscription management functionality
 */

import { useState, useEffect, useCallback } from 'react';
import { useToast } from './use-toast';

interface SubscriptionStatus {
  isActive: boolean;
  isTester: boolean;
  plan: 'basic' | 'pro' | null;
  status: 'active' | 'inactive' | 'cancelled' | 'past_due' | 'unpaid' | null;
  currentPeriodEnd: Date | null;
  cancelAtPeriodEnd: boolean;
  limits: {
    maxProjects: number;
    maxClients: number;
    maxChatbots: number;
    analyticsAccess: boolean;
    customBranding: boolean;
    apiAccess: boolean;
  };
}

interface BillingHookReturn {
  subscriptionStatus: SubscriptionStatus | null;
  loading: boolean;
  error: string | null;
  refreshSubscription: () => Promise<void>;
  cancelSubscription: (cancelAtPeriodEnd?: boolean) => Promise<boolean>;
  reactivateSubscription: () => Promise<boolean>;
  openCustomerPortal: () => Promise<void>;
  hasFeatureAccess: (feature: 'basic' | 'pro') => boolean;
  canCreateProject: (currentCount: number) => boolean;
  canAddClient: (currentCount: number) => boolean;
  canCreateChatbot: (currentCount: number) => boolean;
}

export const useBilling = (): BillingHookReturn => {
  const { toast } = useToast();
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubscriptionStatus = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // For now, provide default "pro" access to all users (Stripe removed)
      const defaultStatus: SubscriptionStatus = {
        isActive: true,
        isTester: false,
        plan: 'pro',
        status: 'active',
        currentPeriodEnd: null,
        cancelAtPeriodEnd: false,
        limits: {
          maxProjects: 999,
          maxClients: 999,
          maxChatbots: 999,
          analyticsAccess: true,
          customBranding: true,
          apiAccess: true,
        },
      };

      setSubscriptionStatus(defaultStatus);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load subscription status');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubscriptionStatus();
  }, [fetchSubscriptionStatus]);

  const refreshSubscription = useCallback(async () => {
    await fetchSubscriptionStatus();
  }, [fetchSubscriptionStatus]);

  const cancelSubscription = useCallback(async (cancelAtPeriodEnd: boolean = true): Promise<boolean> => {
    toast({
      title: 'Contact Support',
      description: 'To cancel your subscription, please contact support@tourcompanion.com',
      variant: 'default',
    });
    return false;
  }, [toast]);

  const reactivateSubscription = useCallback(async (): Promise<boolean> => {
    toast({
      title: 'Contact Support',
      description: 'To reactivate your subscription, please contact support@tourcompanion.com',
      variant: 'default',
    });
    return false;
  }, [toast]);

  const openCustomerPortal = useCallback(async () => {
    toast({
      title: 'Contact Support',
      description: 'For billing questions, please contact support@tourcompanion.com',
      variant: 'default',
    });
  }, [toast]);

  const hasFeatureAccess = useCallback((feature: 'basic' | 'pro'): boolean => {
    // All users have pro access by default (Stripe removed)
    return true;
  }, []);

  const canCreateProject = useCallback((currentCount: number): boolean => {
    return currentCount < 999; // High limit for now
  }, []);

  const canAddClient = useCallback((currentCount: number): boolean => {
    return currentCount < 999; // High limit for now
  }, []);

  const canCreateChatbot = useCallback((currentCount: number): boolean => {
    return currentCount < 999; // High limit for now
  }, []);

  return {
    subscriptionStatus,
    loading,
    error,
    refreshSubscription,
    cancelSubscription,
    reactivateSubscription,
    openCustomerPortal,
    hasFeatureAccess,
    canCreateProject,
    canAddClient,
    canCreateChatbot,
  };
};
