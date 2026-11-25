import { Feather } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';

import { ActionButton } from '@/components/action-button';
import { colors, fonts, fontSize, spacing } from '@/constants/theme';
import type { Collection, Plan } from '@/data/types';
import { formatDate } from '@/lib/format';
import { supabase } from '@/lib/supabase';


type ArchivedTable = 'plans' | 'collections';

type ArchivedRowProps = {
    icon: 'layers' | 'circle';
    title: string;
    archivedAt: string | null;
    restoring: boolean;
    onRestore: () => void;
}

export default function ArchiveScreen() {
    const [plans, setPlans] = useState<Plan[]>([]);
    const [collections, setCollections] = useState<Collection[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [restoringId, setRestoringId] = useState<string | null>(null); // remembers which row is being restored

    useEffect(() => {
        async function load() {
            const plansResult = await supabase
                .from('plans')
                .select()
                .not('archived_at', 'is', null)
                .order('archived_at', { ascending: false });

            const collectionsResult = await supabase
                .from('collections')
                .select()
                .not('archived_at', 'is', null)
                .order('archived_at', { ascending: false });

            if (plansResult.error || collectionsResult.error) {
                setError('No hemos podido cargar los archivados');
            } else {
                setPlans(plansResult.data as Plan[]);
                setCollections(collectionsResult.data as Collection[]);
            }
            setLoading(false);
        }
        load();
    }, []);

    async function restore(table: ArchivedTable, id: string) {
        setRestoringId(id);
        setError(null);

        const { error: restoreError } = await supabase
            .from(table)
            .update({ archived_at: null })
            .eq('id', id);
        
        setRestoringId(null); // no row is busy
        setError(null);

        if (restoreError) {
            setError('No hemos podido restaurar el archivado. Inténtalo de nuevo');
            return;
        }

        // update what's on screen
        if (table === 'plans') {
            setPlans((current) => current.filter((item) => item.id !== id));
        } else {
            setCollections((current) => current.filter((item) => item.id !== id));
        }
    }
    
    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator color={colors.accent}/>
            </View>
        )
    }

    function ArchivedRow({ icon, title, archivedAt, restoring, onRestore } : ArchivedRowProps) {
        return (
            <View style={styles.row}>
                <Feather name={icon} size={14} color={colors.textMuted}></Feather>
                <View style={styles.rowText}>
                    <Text style={styles.rowTitle} numberOfLines={1}>
                        {title}
                    </Text>
                    <Text style={styles.rowMeta}>{archivedAt ? `Archivado el ${formatDate(archivedAt)}` : 'Archivado'}</Text>
                </View>
                <ActionButton icon="rotate-ccw" label="Restaurar" onPress={onRestore} disabled={restoring}></ActionButton>
            </View>
        )
    }

    return (
        <ScrollView style={styles.scroll} contentContainerStyle={styles.page}>
            <Text style={styles.title}>Archivados</Text>
            <Text style={styles.subtitle}>Lo que has archivado. Restáuralo cuando quieras.</Text>

            { error ? <Text style={styles.error}>{error}</Text> : null }

            {/* collections section */}
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Colecciones</Text>
                <Text style={styles.count}>{collections.length}</Text>
            </View>
            { collections.length === 0 ? (
                <Text style={styles.empty}>No tienes colecciones archivadas.</Text>
            ) : (
                collections.map((collection) => (
                    <ArchivedRow
                        key={collection.id}
                        icon='layers'
                        title={collection.title}
                        archivedAt={collection.archived_at}
                        restoring={restoringId === collection.id}
                        onRestore={() => restore('collections', collection.id)}
                    ></ArchivedRow>
                ))
            )}

            {/* plans section */}

            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Planes</Text>
                <Text style={styles.count}>{plans.length}</Text>
            </View>
            { plans.length === 0 ? (
                <Text style={styles.empty}>No tienes planes archivados.</Text>
            ) : (
                plans.map((plan) => (
                    <ArchivedRow
                        key={plan.id}
                        icon='layers'
                        title={plan.title}
                        archivedAt={plan.archived_at}
                        restoring={restoringId === plan.id}
                        onRestore={() => restore('plans', plan.id)}
                    ></ArchivedRow>
                ))
            )}

        </ScrollView>
    )

}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  scroll: {
    flex: 1,
    backgroundColor: colors.background,
  },
  page: {
    padding: spacing.xl,
    maxWidth: 720,
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
  error: {
    fontFamily: fonts.regular,
    fontSize: fontSize.small,
    color: colors.accent,
    marginTop: spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.xl,
    marginBottom: spacing.sm,
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
  empty: {
    fontFamily: fonts.regular,
    fontSize: fontSize.body,
    color: colors.textMuted,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  rowText: {
    flex: 1,
  },
  rowTitle: {
    fontFamily: fonts.regular,
    fontSize: fontSize.body,
    color: colors.text,
  },
  rowMeta: {
    fontFamily: fonts.regular,
    fontSize: fontSize.caption,
    color: colors.textMuted,
    marginTop: 2,
  },
});