import { Feather } from '@expo/vector-icons';
import { Link, router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { ActionButton } from '@/components/action-button';
import { PlanCard } from '@/components/plan-card';
import { UnderlineTabs } from '@/components/underline-tabs';
import { colors, fonts, fontSize, spacing } from '@/constants/theme';
import { applyChanges, toggleCompletedDb, togglePinnedDb } from '@/data/plan-updates';
import type { Collection, Plan } from '@/data/types';
import { cardWidthFor } from '@/lib/grid';
import { supabase } from '@/lib/supabase';

export default function CollectionScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();

    const [collection, setCollection] = useState<Collection | null>(null);
    const [plans, setPlans] = useState<Plan[]>([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState('todo');
    const [contentWidth, setContentWidth] = useState(0);
    const [actionError, setActionError] = useState<string | null>(null);
    const [archiving, setArchiving] = useState(false);

    useEffect(() => {
        async function load() {
            const collectionResult = await supabase
            .from('collections')
            .select()
            .eq('id', id)
            .single()

            const plansResult = await supabase
            .from('plans')
            .select()
            .eq('collection_id', id)
            .order('created_at', { ascending: false })
        
            setCollection(collectionResult.data as Collection | null);
            setPlans((plansResult.data ?? []) as Plan[]);
            setLoading(false);
        }
        load();
    }, [id]);
    
    async function togglePinned(plan: Plan) {
        const changes = await togglePinnedDb(plan);
        if (!changes) {
        setActionError('No hemos podido guardar el cambio. Inténtalo de nuevo.');
        return;
        }
        setActionError(null);
        setPlans((current) => applyChanges(current, plan.id, changes));
    }

    async function toggleCompleted(plan: Plan) {
        const changes = await toggleCompletedDb(plan);
        if (!changes) {
        setActionError('No hemos podido guardar el cambio. Inténtalo de nuevo.');
        return;
        }
        setActionError(null);
        setPlans((current) => applyChanges(current, plan.id, changes));
    }

    async function archive() {
        setArchiving(true);
        setActionError(null);

        const { error } = await supabase
            .from('collections')
            .update({ archived_at: new Date().toISOString() })
            .eq('id', id);
        
            if (error) {
            setActionError('No hemos podido archivar la colección. Inténtalo de nuevo.');
            setArchiving(false);
            return;
        }

        router.replace('/');
    }

    if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.accent} />
      </View>
    );
  }

  if (!collection) {
    return (
      <View style={styles.center}>
        <Text style={styles.muted}>No hemos encontrado esta colección.</Text>
        <Link href="/" style={styles.link}>
          Volver a Mis planes
        </Link>
      </View>
    );
  }

  const todoPlans = plans
    .filter((plan) => plan.completed_at === null)
    .sort((a, b) => Number(b.pinned) - Number(a.pinned));
    
  const donePlans = plans
    .filter((plan) => plan.completed_at !== null)
    .sort((a, b) => (b.completed_at ?? '').localeCompare(a.completed_at ?? ''));
  
  const visiblePlans = tab === 'todo' ? todoPlans : donePlans;
  const cardWidth = cardWidthFor(contentWidth);

  return (
    // scrollable box when cards don't fit the screen
    <ScrollView style={styles.scroll} contentContainerStyle={styles.page}>
      <Link href={'/'} asChild>
        <Pressable style={styles.back}>
            <Feather name="arrow-left" size={14} color={colors.textMuted}/>
            <Text style={styles.muted}>Mis planes</Text>
        </Pressable>
      </Link>

      <View style={styles.badge}>
        <Feather name="layers" size={12} color={colors.onAccent}/>
        <Text style={styles.badgeText}>Colección</Text>
      </View>
      <Text style={styles.title}>{collection.title}</Text>
      { collection.description ? (
          <Text style={styles.description}>{collection.description}</Text>
      ) : null }
 
      <View>
        <View style={styles.meta}> 
            { collection.location ? (
                <View style={styles.meta}>
                    <Feather name="map-pin" size={12} color={colors.textMuted}/>
                    <Text style={styles.muted}>{collection.location}</Text>
                </View>
            ) : null }
            <View style={styles.meta}>
                <Feather name="check-circle" size={12} color={colors.textMuted}></Feather>
                <Text style={styles.muted}>{donePlans.length} de {todoPlans.length}</Text>
            </View>
        </View>
        <View style={styles.actions}>
            <ActionButton
                icon="edit-2"
                label="Editar"
                onPress={() => router.push({ pathname: '/collection/[id]/edit', params: { id: collection.id }})}
            ></ActionButton>
            <ActionButton
                icon="archive"
                label="Archivar"
                onPress={archive}
            ></ActionButton>
        </View>
      </View>

      <UnderlineTabs
        active={tab}
        onChange={setTab}
        tabs={[
          {key: 'todo', label: 'Por hacer', count: todoPlans.length},
          {key: 'done', label: 'Completados', count: donePlans.length}
        ]}
      />

      {actionError ?
        <Text style={styles.error}>{actionError}</Text>
      : null } 


      {/* plans section */}
      <View style={styles.plansSection} onLayout={(event => setContentWidth(event.nativeEvent.layout.width))}>
        {visiblePlans.length === 0 ? (
          <Text style={styles.muted}>
            {tab === 'todo' ? 'Todavía no tienes planes por hacer.' : 'Planes por hacer.'}
            </Text>
        ) : null }

        {contentWidth > 0 && visiblePlans.length > 0 ? (
          <View style={styles.grid}>
            {visiblePlans.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                width={cardWidth}
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
  back: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    alignSelf: 'flex-start',
    marginBottom: spacing.xl,
  },
  muted: {
    fontFamily: fonts.regular,
    fontSize: fontSize.body,
    color: colors.textMuted,
  },
  link: {
    fontFamily: fonts.regular,
    fontSize: fontSize.body,
    color: colors.accent,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  badgeText: {
    fontFamily: fonts.regular,
    fontSize: fontSize.small,
    color: colors.accent,
  },
  title: {
    fontFamily: fonts.semibold,
    fontSize: fontSize.title,
    color: colors.text,
    marginTop: spacing.xs,
  },
  description: {
    fontFamily: fonts.regular,
    fontSize: fontSize.body,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  meta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: spacing.lg,
    marginTop: spacing.md,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  error: {
    fontFamily: fonts.regular,
    fontSize: fontSize.small,
    color: colors.accent,
    marginTop: spacing.md,
  },
  list: {
    marginTop: spacing.xl,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    // gap: cardGap,
    gap: spacing.md,
  },
//   sectionHeader: {
//     flexDirection: 'column',
//     gap: spacing.sm,
//   },
  plansSection: {
    marginTop: spacing.xl,
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.lg,
  }
});