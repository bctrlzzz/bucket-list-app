import { PlanCard } from '@/components/plan-card';
import { colors, fonts, fontSize, radius, spacing } from '@/constants/theme';
import type { Collection, Plan } from '@/data/types';
import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

async function fetchMyPlans() {
  const plansResult = await supabase
    .from('plans')
    .select()
    .order('pinned', { ascending: false })
    .order('created_at', { ascending: false })

    const collectionsResult = await supabase.from('collections').select();

    if (plansResult.error || collectionsResult.error) {
      throw new Error('Could not load plans');
    }
    
    return {
      plans: plansResult.data as Plan[],
      collections: collectionsResult.data as Collection[],
    }
}

export default function MyPlansScreen() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [reloadCount, setReloadCount] = useState(0);

  useEffect(()=> {
    fetchMyPlans()
      .then((result) => {
        setPlans(result.plans);
        setCollections(result.collections);
        setError(false);
      })
      .catch(()=> setError(true))
      .finally(()=> setLoading(false))
  }, [reloadCount]);

  function retry() {
    setLoading(true);
    setReloadCount((count) => count + 1);
  }

  function collectionTitle(collectionId: string | null) {
    return collections.find((collection) => collection.id === collectionId)?.title;
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.message}>No hemos podido cargar tus planes</Text>
        <Pressable style={styles.retryButton} onPress={retry}>
          <Text style={styles.retryText}>Reintentar</Text>
        </Pressable>
      </View>
    )
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <Text style={styles.message}>Cargando...</Text>
      </View>
    )
  }

  // display not completed plans
  const todoPlans = plans.filter((plan) => plan.completed_at === null);

  return (
    // scrollable box when cards don't fit the screen
    <ScrollView style={styles.scroll} contentContainerStyle={styles.page}>
      <Text style={styles.title}>Mis planes</Text>
      <Text style={styles.subtitle}>Las ideas de hoy, los buenos recuerdos de mañana.</Text>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Planes por hacer</Text>
        <Text style={styles.count}>{todoPlans.length}</Text>
      </View>

      {todoPlans.length === 0 ? (
        <Text style={styles.message}>Todavía no tienes planes por hacer.</Text>
      ) : (
        <View style={styles.grid}>
          {todoPlans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              collectionTitle={collectionTitle(plan.collection_id)}
            />
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    backgroundColor: colors.background,
  },
  scroll: {
    flex: 1,
    backgroundColor: colors.background,
  },
  page: {
    padding: spacing.xl,
  },
  title: {
    fontFamily: fonts.semibold,
    fontSize: fontSize.title,
    color: colors.text,
  },
  subtitle: {
    fontFamily: fonts.regular,
    fontSize: fontSize.body,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.xxl,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontFamily: fonts.semibold,
    fontSize: fontSize.heading,
    color: colors.text,
  },
  count: {
    fontFamily: fonts.regular,
    fontSize: fontSize.caption,
    color: colors.textMuted,
  },
  message: {
    fontFamily: fonts.regular,
    fontSize: fontSize.body,
    color: colors.textMuted,
  },
  retryButton: {
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
  },
  retryText: {
    fontFamily: fonts.semibold,
    fontSize: fontSize.body,
    color: colors.onAccent,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
});