/**
 * @fileoverview Full subscription management page for React Native.
 *
 * Displays the current subscription status (active/inactive badge, plan name,
 * expiration date, auto-renew status), followed by package cards with features,
 * pricing, "Most Popular" badge, and purchase buttons. Also includes a
 * "Restore Purchases" button with loading states.
 */
import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import type {
  SubscriptionPageLabels,
  SubscriptionPageFormatters,
  AnalyticsTrackingParams,
} from '../../types';
import type { SubscriptionPackage } from '../subscription/SubscriptionScreen';
import { createThemedStyles } from '../../utils/styles';

export interface CurrentSubscriptionStatus {
  isActive: boolean;
  planName?: string;
  expirationDate?: string | null;
  willRenew?: boolean;
  productIdentifier?: string;
}

export interface AppSubscriptionPageLabels extends SubscriptionPageLabels {
  statusActive?: string;
  statusInactive?: string;
  statusInactiveMessage?: string;
  labelPlan?: string;
  labelExpires?: string;
  labelRenews?: string;
  yes?: string;
  no?: string;
}

export interface AppSubscriptionPageProps {
  currentStatus?: CurrentSubscriptionStatus;
  packages: SubscriptionPackage[];
  labels?: AppSubscriptionPageLabels;
  formatters?: SubscriptionPageFormatters;
  onPurchase: (packageId: string) => Promise<boolean>;
  onRestore: () => Promise<boolean>;
  onPurchaseSuccess?: () => void;
  onRestoreSuccess?: () => void;
  onError?: (title: string, message: string) => void;
  style?: StyleProp<ViewStyle>;
  onTrack?: (params: AnalyticsTrackingParams) => void;
  isLoading?: boolean;
}

export function AppSubscriptionPage({
  currentStatus,
  packages,
  labels = {},
  formatters = {},
  onPurchase,
  onRestore,
  onPurchaseSuccess,
  onRestoreSuccess,
  onError,
  style,
  onTrack,
  isLoading: externalLoading,
}: AppSubscriptionPageProps) {
  const styles = useStyles();
  const [loading, setLoading] = useState<string | null>(null);

  const formatPrice =
    formatters.formatPrice ??
    ((price, currency) => `${currency} ${price.toFixed(2)}`);

  const handlePurchase = useCallback(
    async (pkg: SubscriptionPackage) => {
      if (loading) return;
      setLoading(pkg.id);
      onTrack?.({
        eventType: 'subscription_action',
        componentName: 'AppSubscriptionPage',
        label: 'purchase_tapped',
        params: { package_id: pkg.id },
      });
      try {
        const success = await onPurchase(pkg.id);
        if (success) {
          onPurchaseSuccess?.();
        }
      } catch (e) {
        onError?.(
          'Purchase Failed',
          e instanceof Error ? e.message : 'An error occurred.'
        );
      } finally {
        setLoading(null);
      }
    },
    [loading, onPurchase, onPurchaseSuccess, onError, onTrack]
  );

  const handleRestore = useCallback(async () => {
    if (loading) return;
    setLoading('restore');
    onTrack?.({
      eventType: 'subscription_action',
      componentName: 'AppSubscriptionPage',
      label: 'restore_tapped',
    });
    try {
      const success = await onRestore();
      if (success) {
        onRestoreSuccess?.();
      }
    } catch (e) {
      onError?.(
        'Restore Failed',
        e instanceof Error ? e.message : 'An error occurred.'
      );
    } finally {
      setLoading(null);
    }
  }, [loading, onRestore, onRestoreSuccess, onError, onTrack]);

  return (
    <ScrollView
      style={[styles.container, style]}
      contentContainerStyle={styles.content}
    >
      {/* Current Status Section */}
      {currentStatus && (
        <View
          style={styles.statusCard}
          accessibilityRole='summary'
          accessibilityLabel={`Subscription status: ${currentStatus.isActive ? 'Active' : 'Inactive'}`}
        >
          <View style={styles.statusHeader}>
            <View
              style={[
                styles.statusBadge,
                currentStatus.isActive
                  ? styles.statusBadgeActive
                  : styles.statusBadgeInactive,
              ]}
            >
              <Text
                style={[
                  styles.statusBadgeText,
                  currentStatus.isActive
                    ? styles.statusBadgeTextActive
                    : styles.statusBadgeTextInactive,
                ]}
              >
                {currentStatus.isActive
                  ? (labels.statusActive ?? 'Active')
                  : (labels.statusInactive ?? 'Inactive')}
              </Text>
            </View>
          </View>

          {currentStatus.isActive ? (
            <View style={styles.statusFields}>
              {currentStatus.planName && (
                <View style={styles.statusField}>
                  <Text style={styles.statusFieldLabel}>
                    {labels.labelPlan ?? 'Plan'}
                  </Text>
                  <Text style={styles.statusFieldValue}>
                    {currentStatus.planName}
                  </Text>
                </View>
              )}
              {currentStatus.expirationDate && (
                <View style={styles.statusField}>
                  <Text style={styles.statusFieldLabel}>
                    {labels.labelExpires ?? 'Expires'}
                  </Text>
                  <Text style={styles.statusFieldValue}>
                    {currentStatus.expirationDate}
                  </Text>
                </View>
              )}
              {currentStatus.willRenew !== undefined && (
                <View style={styles.statusField}>
                  <Text style={styles.statusFieldLabel}>
                    {labels.labelRenews ?? 'Auto-renews'}
                  </Text>
                  <Text style={styles.statusFieldValue}>
                    {currentStatus.willRenew
                      ? (labels.yes ?? 'Yes')
                      : (labels.no ?? 'No')}
                  </Text>
                </View>
              )}
            </View>
          ) : (
            <Text style={styles.statusInactiveMessage}>
              {labels.statusInactiveMessage ??
                'Subscribe to unlock premium features'}
            </Text>
          )}
        </View>
      )}

      {/* Loading State */}
      {externalLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            size='large'
            color={styles.loadingIndicator.color}
            accessibilityLabel='Loading subscription packages'
          />
        </View>
      )}

      {/* Package Cards */}
      {!externalLoading && packages.length > 0 && (
        <View style={styles.packageList} accessibilityRole='list'>
          {packages.map(pkg => (
            <View
              key={pkg.id}
              style={[
                styles.packageCard,
                pkg.isMostPopular && styles.packageCardPopular,
              ]}
              accessibilityRole='summary'
              accessibilityLabel={`${pkg.title}, ${formatPrice(pkg.price, pkg.currency)}${pkg.isMostPopular ? ', Most Popular' : ''}${pkg.isCurrent ? ', Current Plan' : ''}`}
            >
              {pkg.isMostPopular && (
                <View style={styles.popularBadge}>
                  <Text style={styles.popularBadgeText}>
                    {labels.mostPopular ?? 'Most Popular'}
                  </Text>
                </View>
              )}

              <Text style={styles.packageTitle}>{pkg.title}</Text>
              {pkg.description && (
                <Text style={styles.packageDescription}>{pkg.description}</Text>
              )}
              <Text style={styles.packagePrice}>
                {formatPrice(pkg.price, pkg.currency)}
              </Text>

              {pkg.features && pkg.features.length > 0 && (
                <View style={styles.featureList}>
                  {pkg.features.map((feature, i) => (
                    <Text key={i} style={styles.featureItem}>
                      {'\u2713'} {feature}
                    </Text>
                  ))}
                </View>
              )}

              {pkg.isCurrent ? (
                <View style={styles.currentBadge}>
                  <Text style={styles.currentBadgeText}>
                    {labels.currentlyActive ?? 'Current Plan'}
                  </Text>
                </View>
              ) : (
                <Pressable
                  style={[
                    styles.purchaseButton,
                    loading === pkg.id && styles.purchaseButtonDisabled,
                  ]}
                  onPress={() => handlePurchase(pkg)}
                  disabled={loading !== null}
                  accessibilityRole='button'
                  accessibilityLabel={`${labels.purchase ?? 'Subscribe'} to ${pkg.title}`}
                  accessibilityState={{
                    disabled: loading !== null,
                    busy: loading === pkg.id,
                  }}
                >
                  {loading === pkg.id ? (
                    <ActivityIndicator color='#ffffff' size='small' />
                  ) : (
                    <Text style={styles.purchaseButtonText}>
                      {labels.purchase ?? 'Subscribe'}
                    </Text>
                  )}
                </Pressable>
              )}
            </View>
          ))}
        </View>
      )}

      {/* Restore Purchases */}
      <Pressable
        style={[
          styles.restoreButton,
          loading === 'restore' && styles.restoreButtonDisabled,
        ]}
        onPress={handleRestore}
        disabled={loading !== null}
        accessibilityRole='button'
        accessibilityLabel={labels.restore ?? 'Restore Purchases'}
        accessibilityState={{
          disabled: loading !== null,
          busy: loading === 'restore',
        }}
      >
        {loading === 'restore' ? (
          <ActivityIndicator color={styles.restoreText.color} size='small' />
        ) : (
          <Text style={styles.restoreText}>
            {labels.restore ?? 'Restore Purchases'}
          </Text>
        )}
      </Pressable>
      {labels.restoreDescription && (
        <Text style={styles.restoreDescription}>
          {labels.restoreDescription}
        </Text>
      )}
    </ScrollView>
  );
}

const useStyles = createThemedStyles(colors => ({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  // Status card
  statusCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusBadge: {
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  statusBadgeActive: {
    backgroundColor: colors.successBg,
  },
  statusBadgeInactive: {
    backgroundColor: colors.surfaceSecondary,
  },
  statusBadgeText: {
    fontSize: 13,
    fontWeight: '600',
  },
  statusBadgeTextActive: {
    color: colors.successText,
  },
  statusBadgeTextInactive: {
    color: colors.textSecondary,
  },
  statusFields: {
    gap: 8,
  },
  statusField: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusFieldLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  statusFieldValue: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  statusInactiveMessage: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  // Loading
  loadingContainer: {
    paddingVertical: 48,
    alignItems: 'center',
  },
  loadingIndicator: {
    color: colors.primary,
  },
  // Package cards (mirrors SubscriptionScreen styles)
  packageList: {
    gap: 16,
  },
  packageCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  packageCardPopular: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  popularBadge: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  popularBadgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  packageTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
  },
  packageDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  packagePrice: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginTop: 8,
  },
  featureList: {
    marginTop: 12,
    gap: 6,
  },
  featureItem: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  purchaseButton: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 16,
    minHeight: 48,
    justifyContent: 'center',
  },
  purchaseButtonDisabled: {
    opacity: 0.6,
  },
  purchaseButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  currentBadge: {
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 16,
    backgroundColor: colors.surfaceSecondary,
  },
  currentBadgeText: {
    color: colors.textSecondary,
    fontSize: 16,
    fontWeight: '500',
  },
  restoreButton: {
    marginTop: 24,
    paddingVertical: 12,
    alignItems: 'center',
    minHeight: 44,
    justifyContent: 'center',
  },
  restoreButtonDisabled: {
    opacity: 0.6,
  },
  restoreText: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: '500',
  },
  restoreDescription: {
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 4,
  },
}));
