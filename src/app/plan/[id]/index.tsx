import { Link, router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';

import { ActionButton } from '@/components/action-button';
import { colors, fonts, fontSize, radius, spacing } from '@/constants/theme';
import type { Plan } from '@/data/types';
import { supabase } from '@/lib/supabase';
import { Feather } from '@expo/vector-icons';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

// plan detail page
// address will be /plan/[id]

// plan + collection title
type PlanWithCollection = Plan & {
    collection: { title: string } | null;
};

function formatDate(isoDate: string) {
    return new Date(isoDate).toLocaleTimeString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
}

export default function PlanDetailScreen() {
    const {id} = useLocalSearchParams<{id: string}>(); // read address of the screen
    
    const [plan, setPlan] = useState<PlanWithCollection | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [busy, setBusy] = useState(false);

    useEffect(() => {
        supabase
            .from('plans')
            .select('*, collection:collections(title), plan_dates(*)') // plans table references collections
            .eq('id', id)
            .single()
            .then(({ data }) => {
                setPlan(data as PlanWithCollection | null);
                setLoading(false);
            });
    }, [id]); // go straight to the copy's page after duplicating


    // duplicate plan
    async function duplicate() {
        if (!plan) return;
        setBusy(true);
        setError(null);

        const { data, error: duplicateError } = await supabase 
            .from('plans')
            .insert({
                title: `${plan.title} (copia)`,
                category: plan.category,
                place: plan.category,
                collection_id: plan.collection_id,
            })
            .select()
            .single(); // returns the copy
        
        setBusy(false);
        
        if (duplicateError || !data) {
            setError('No hemos podido duplicar el plan. Inténtalo de nuevo.');
            return;
        }

        router.replace({ pathname: '/plan/[id]', params: { id: data.id }}); // go to a dynamic page
    }

    // archive plan
    async function archive() {
        if (!plan) return;
        setBusy(true);
        setError(null);

        const { error: archiveError } = await supabase
            .from('plans')
            .update({
                archived_at: new Date().toISOString()
            })
            .eq('id', plan.id);
        
        if (archiveError) {
            setError('No hemos podido archivar el plan. Inténtalo de nuevo.');
            return;
        }

        router.replace('/');
    }

    if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.accent} />
        <Text style={styles.message}>Cargando...</Text>
    </View>
    )
  }

  if (!plan) {
    return (
        <View style={styles.center}>
            <Text style={styles.muted}>No hemos encontrado este plan.</Text>
            <Link href='/' style={styles.link}>Volver a mis planes.</Link>
        </View>
    );
  }

    const location = [plan.place, plan.city].filter(Boolean).join(', ');

    return (
        <ScrollView style={styles.scroll} contentContainerStyle={styles.page}>
            <Link href="/" asChild>
                <Pressable style={styles.back}>
                    <Feather name="arrow-left" size={14} color={colors.textMuted} />
                    <Text style={styles.muted}>Mis planes</Text>
                </Pressable>
            </Link>

            {plan.category ? <Text style={styles.category}>{plan.category}</Text> : null}
            <Text style={styles.title}>{plan.title}</Text>

            <View style={styles.details}>
                { location ? <Detail icon="map-pin" text={location}></Detail> : null } 
                { plan.collection ? <Detail icon="layers" text={plan.collection.title}/> : null }
                <Detail icon={plan.completed_at ? 'check-circle' : 'circle'}
                        text={plan.completed_at ? `Completado el ${formatDate(plan.created_at)}`: 'Por hacer'}/>
                { plan.plan_dates?.[0]?.start_date ? (
                  <Detail icon="calendar" text={formatDate(plan.plan_dates[0].start_date)}></Detail>
                ) : <Detail icon="calendar" text="Sin fecha prevista"></Detail>}
                <Detail icon="calendar" text={`Añadido el ${formatDate(plan.created_at)}`}></Detail>
            </View>

            {error ? <Text style={styles.error}>{error}</Text>: null}

            <View style={styles.actions}>
                <ActionButton
                    icon="edit-2"
                    label="Editar"
                    onPress={() => router.push({ pathname: '/plan/[id]/edit', params: { id: plan.id }})}
                ></ActionButton>
                <ActionButton
                    icon="archive"
                    label="Archivar"
                    onPress={archive}
                ></ActionButton>
            </View>
        </ScrollView>
    )

}

function Detail({ icon, text }: { icon: 'map-pin' | 'layers' | 'circle' | 'check-circle' | 'calendar'; text: string }) {
  return (
    <View style={styles.detail}>
      <Feather name={icon} size={14} color={colors.textMuted} />
      <Text style={styles.detailText}>{text}</Text>
    </View>
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
    maxWidth: 640,
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
  category: {
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
  details: {
    gap: spacing.md,
    marginTop: spacing.xl,
  },
  detail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  detailText: {
    fontFamily: fonts.regular,
    fontSize: fontSize.body,
    color: colors.text,
  },
  error: {
    fontFamily: fonts.regular,
    fontSize: fontSize.small,
    color: colors.accent,
    marginTop: spacing.lg,
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.xl,
  },
  actionButton: {
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
  actionText: {
    fontFamily: fonts.regular,
    fontSize: fontSize.small,
    color: colors.text,
  },
  busy: {
    opacity: 0.5,
  },
  message: {
    fontFamily: fonts.regular,
    fontSize: fontSize.body,
    color: colors.textMuted,
  },
});