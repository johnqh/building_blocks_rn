import React, { useState, useCallback } from 'react';
import { View, Text, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import type { SubscriptionPageLabels, SubscriptionPageFormatters, AnalyticsTrackingParams } from '../../types';
import { createThemedStyles } from '../../utils/styles';

export interface SubscriptionPackage {
  id: string;
  title: string;
  description?: string;
  price: number;
  currency: string;
  period: 'monthly' | 'yearly' | 'lifetime';
  features?: string[];
  isMostPopular?: boolean;
  isCurrent?: boolean;
}

export interface SubscriptionScreenProps {
  /** Available subscription packages */
  packages: SubscriptionPackage[];
  /** Labels for UI text */
  labels?: SubscriptionPageLabels;
  /** Formatters for prices and periods */
  formatters?: SubscriptionPageFormatters;
  /** Called when a package is purchased */
  onPurchase: (packageId: string) => Promise<boolean>;
  /** Called when restore purchases is pressed */
  onRestore: () => Promise<boolean>;
  /** Called on successful purchase */
  onPurchaseSuccess?: () => void;
  /** Called on successful restore */
  onRestoreSuccess?: () => void;
  /** Called on error */
  onError?: (title: string, message: string) => void;
  /** Custom style */
  style?: StyleProp<ViewStyle>;
  /** Analytics tracking */
  onTrack?: (params: AnalyticsTrackingParams) => void;
}

export function SubscriptionScreen({
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
}: SubscriptionScreenProps) {
  const styles = useStyles();
  const [loading, setLoading] = useState<string | null>(null);

  const formatPrice = formatters.formatPrice ?? ((price, currency) => `${currency} ${price.toFixed(2)}`);

  const handlePurchase = useCallback(async (pkg: SubscriptionPackage) => {
    if (loading) return;
    setLoading(pkg.id);
    onTrack?.({
      eventType: 'subscription_action',
      componentName: 'SubscriptionScreen',
      label: 'purchase_tapped',
      params: { package_id: pkg.id },
    });
    try {
      const success = await onPurchase(pkg.id);
      if (success) {
        onPurchaseSuccess?.();
      }
    } catch (e) {
      onError?.('Purchase Failed', e instanceof Error ? e.message : 'An error occurred.');
    } finally {
      setLoading(null);
    }
  }, [loading, onPurchase, onPurchaseSuccess, onError, onTrack]);

  const handleRestore = useCallback(async () => {
    if (loading) return;
    setLoading('restore');
    onTrack?.({
      eventType: 'subscription_action',
      componentName: 'SubscriptionScreen',
      label: 'restore_tapped',
    });
    try {
      const success = await onRestore();
      if (success) {
        onRestoreSuccess?.();
      }
    } catch (e) {
      onError?.('Restore Failed', e instanceof Error ? e.message : 'An error occurred.');
    } finally {
      setLoading(null);
    }
  }, [loading, onRestore, onRestoreSuccess, onError, onTrack]);

  return (
    <ScrollView
      style={[styles.container, style]}
      contentContainerStyle={styles.content}
    >
      <Text style={styles.title}>{labels.title ?? 'Subscription'}</Text>
      {labels.subtitle && <Text style={styles.subtitle}>{labels.subtitle}</Text>}

      <View style={styles.packageList}>
        {packages.map((pkg) => (
          <View
            key={pkg.id}
            style={[styles.packageCard, pkg.isMostPopular && styles.packageCardPopular]}
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
                style={[styles.purchaseButton, loading === pkg.id && styles.purchaseButtonDisabled]}
                onPress={() => handlePurchase(pkg)}
                disabled={loading !== null}
              >
                {loading === pkg.id ? (
                  <ActivityIndicator color="#ffffff" size="small" />
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

      <Pressable
        style={[styles.restoreButton, loading === 'restore' && styles.restoreButtonDisabled]}
        onPress={handleRestore}
        disabled={loading !== null}
      >
        {loading === 'restore' ? (
          <ActivityIndicator color={styles.restoreText.color} size="small" />
        ) : (
          <Text style={styles.restoreText}>
            {labels.restore ?? 'Restore Purchases'}
          </Text>
        )}
      </Pressable>
      {labels.restoreDescription && (
        <Text style={styles.restoreDescription}>{labels.restoreDescription}</Text>
      )}
    </ScrollView>
  );
}

const useStyles = createThemedStyles((colors) => ({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    marginBottom: 20,
  },
  packageList: {
    gap: 16,
    marginTop: 16,
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
