import { PlanCard } from '@/components/plan-card';
import { UnderlineTabs } from '@/components/underline-tabs';

import { colors, fonts, fontSize, radius, spacing } from '@/constants/theme';
import type { Collection, Plan } from '@/data/types';
import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { CollectionCard } from '@/components/collection-card';
import { Feather } from '@expo/vector-icons';
import { Link, router } from 'expo-router';

import { applyChanges, toggleCompletedDb, togglePinnedDb } from '@/data/plan-updates';
import { cardWidthFor } from '@/lib/grid';


// database
async function fetchMyPlans() {
  const plansResult = await supabase
    .from('plans')
    .select('*, plan_dates(*)') // join dates table
    .is('archived_at', null) // where archived_at is empty
    .order('pinned', { ascending: false })
    .order('created_at', { ascending: false });

    const collectionsResult = await supabase
    .from('collections')
    .select()
    .is('archived_at', null);

    if (plansResult.error || collectionsResult.error) {
      throw new Error('Could not load plans');
    }
    
    return {
      plans: plansResult.data as Plan[],
      collections: collectionsResult.data as Collection[],
    }
}

// screen
export default function MyPlansScreen() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [reloadCount, setReloadCount] = useState(0);
  const [contentWidth, setContentWidth] = useState(0);
  const [tab, setTab] = useState('todo');
  const [actionError, setActionError] = useState<string | null>(null);

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
    setError(false);
    setLoading(true);
    setReloadCount((count) => count + 1);
  }

  // pin plan logic
  async function togglePinned(plan: Plan) {
      const changes = await togglePinnedDb(plan);

      if (!changes) {
        setActionError('No hemos podido actualizar el plan. Inténtalo de nuevo.');
        return;
      }

      setActionError(null);
      setPlans((current) => applyChanges(current, plan.id, changes));
  }

  // complete plan logic
  async function toggleCompleted(plan: Plan) {
    const changes = await toggleCompletedDb(plan);

      if (!changes) {
        setActionError('No hemos podido guardar el cambio. Inténtalo de nuevo.')
        return;
      }

      setActionError(null);
      setPlans((current) => applyChanges(current, plan.id, changes));
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
        <ActivityIndicator color={colors.accent} />
        <Text style={styles.message}>Cargando...</Text>
      </View>
    )
  }

  // display not completed plans
  const todoPlans = plans
    .filter((plan) => plan.completed_at === null)
    .sort((a, b) => Number(b.pinned) - Number(a.pinned)); // 1 (pinned) before 0 (not pinned)
  
  const donePlans = plans
    .filter((plan) => plan.completed_at !== null)
    .sort((a, b) => (b.completed_at ?? '').localeCompare(a.completed_at ?? '')); // most recently completed first

  const visiblePlans = tab === 'todo' ? todoPlans : donePlans;

  const cardWidth = cardWidthFor(contentWidth);

  return (
    // scrollable box when cards don't fit the screen
    <ScrollView style={styles.scroll} contentContainerStyle={styles.page}>
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={styles.title}>Mis planes</Text>
          <Text style={styles.subtitle}>Las ideas de hoy, los buenos recuerdos de mañana.</Text>
        </View>
      </View>

      <UnderlineTabs
        active={tab}
        onChange={setTab}
        right={
          <>
            {/* TODO: add button at the bottom bar on mobile */}
            <Link href="/plan/new" asChild>
              <Pressable style={styles.addButton}>
                <Feather name="plus" size={14} color={colors.onAccent}></Feather>
                <Text style={styles.addButtonText}>Añadir plan</Text>
              </Pressable>
            </Link>

            <Link href="/collection/new" asChild>
              <Pressable style={styles.addButton}>
                <Feather name="plus" size={14} color={colors.onAccent}></Feather>
                <Text style={styles.addButtonText}>Crear colección</Text>
              </Pressable>
            </Link>
          </>
        }
        tabs={[
          {key: 'todo', label: 'Por hacer', count: todoPlans.length},
          {key: 'done', label: 'Completados', count: donePlans.length}
        ]}
      />

      {actionError ?
        <Text style={styles.actionError}>{actionError}</Text>
      : null } 

      {/* collections section */}
      <View onLayout={(event => setContentWidth(event.nativeEvent.layout.width))}>
        {tab === 'todo' && collections.length > 0 && contentWidth > 0 ? (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Tus colecciones</Text>
              <Text style={styles.count}>{collections.length}</Text>
            </View>
            <View style={styles.grid}>
              {collections.map((collection) => {
                const inCollection = plans.filter((plan) => plan.collection_id === collection.id);
                const doneInCollection = inCollection.filter((plan) => plan.completed_at !== null);

                return (
                  <CollectionCard
                    key={collection.id}
                    collection={collection}
                    done={doneInCollection.length}
                    total={inCollection.length}
                    width={cardWidth}
                    onOpen={() => router.push({ pathname: '/collection/[id]', params: { id: collection.id }})}
                  />
                );
              })}
            </View>
          </>
        ) : null}
      </View>

      {/* plans section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          {tab === 'todo' ? 'Planes por hacer' : 'Planes completados'}
        </Text>
        <Text style={styles.count}>{visiblePlans.length}</Text>
      </View>

      {/* on layout tells the box's size */}
      <View onLayout={(event => setContentWidth(event.nativeEvent.layout.width))}>
        {visiblePlans.length === 0 ? (
          <Text style={styles.message}>
            {tab === 'todo' ? 'Planes por hacer.' : 'Todavía no tienes planes por hacer.'}
            </Text>
        ) : null }

        {contentWidth > 0 && visiblePlans.length > 0 ? (
          <View style={styles.grid}>
            {visiblePlans.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                width={cardWidth}
                collectionTitle={collectionTitle(plan.collection_id)}
                onTogglePinned={() => togglePinned(plan)}
                onToggleCompleted={() => toggleCompleted(plan)}
                onOpen={() => router.push({ pathname: '/plan/[id]', params: {id: plan.id}})}
              />
            ))}
          </View>
        ) : null}        
      </View>
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
    header: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: spacing.lg,
  },
  headerText: {
    flexShrink: 1,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    height: 34,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.accent,
  },
  addButtonText: {
    fontFamily: fonts.regular,
    fontSize: fontSize.small,
    color: colors.onAccent,
  },
  actionError: {
    fontFamily: fonts.regular,
    fontSize: fontSize.small,
    color: colors.accent,
    marginTop: spacing.md,
  },  
    headerButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'flex-end',
    alignSelf: 'flex-end',
    marginTop: spacing.md,
    flexWrap: 'wrap',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    height: 34,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
  },
  secondaryButtonText: {
    fontFamily: fonts.regular,
    fontSize: fontSize.small,
    color: colors.text,
  },
});