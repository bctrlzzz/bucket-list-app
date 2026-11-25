import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, fonts, fontSize, radius, spacing } from '@/constants/theme';
import type { Plan } from '@/data/types';

// receiving props in PlanCard
type Props = {
    plan: Plan;
    width: number; // card width through a prop
    collectionTitle?: string;
    onTogglePinned: () => void;
    onToggleCompleted: () => void;
    onOpen: () => void;
}

function formatDate(isoDate: string) {
  return new Date(isoDate).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function PlanCard({ plan, width, collectionTitle, onTogglePinned, onToggleCompleted, onOpen } : Props) {
    const isDone = plan.completed_at !== null;
    const location = [plan.place, plan.city].filter(Boolean).join(', ');

    return (
        <View style={[ styles.card, {width}, plan.pinned && styles.cardPinned ]}>
             <View style={styles.topRow}>
                {plan.pinned ? (
                    <View style={styles.pinnedChip}>
                        <MaterialCommunityIcons name="pin" size={10} color={colors.onAccent} />
                        <Text style={styles.pinnedText}>Fijado</Text>
                    </View>
                ) : (
                    <View/>
                )}
                <View style={styles.actions}>
                  {isDone ? null : (
                    <Pressable
                      onPress={onTogglePinned}
                      hitSlop={8} // make pressable area 8px bigger
                      accessibilityLabel={plan.pinned ? 'Quitar de fijados' : 'Fijar plan'}>
                    <MaterialCommunityIcons
                        name={plan.pinned ? 'pin' : 'pin-outline'}
                        size={13}
                        color={plan.pinned ? colors.accent : colors.textMuted}
                    />
                    </Pressable>
                  )}

                  <Pressable
                    onPress={onToggleCompleted}
                    hitSlop={8}
                    accessibilityLabel={isDone ? 'Marcar por hacer' : 'Marcar como completado'}>
                    <Feather
                      name={isDone ? 'check-circle' : 'circle'}
                      size={15}
                      color={isDone ? colors.accent : colors.textMuted}/>
                  </Pressable>
                </View>
             </View>

            {/* plan's cover photo */}
            <Pressable onPress={onOpen} accessibilityRole='link' accessibilityLabel={`Abrir ${plan.title}`}>
             <View style={styles.cover}></View>

             {plan.category ? <Text style={styles.category}>{plan.category}</Text> : null }

             <Text style={styles.title}>{plan.title}</Text>

             {location ? (
                <View style={styles.location}>
                    <Feather name='map-pin' size={10} color={colors.textMuted}/>
                    <Text style={styles.locationText}>{location}</Text>
                </View>
             ) : null}

             {plan.plan_dates?.[0]?.start_date ? (
                <View style={styles.location}>
                    <Feather name='calendar' size={10} color={colors.textMuted}/>
                    <Text style={styles.locationText}>{formatDate(plan.plan_dates[0].start_date)}</Text>
                </View>
             ) : null}

             <View style={styles.footer}>
                <Text style={styles.footerText}>
                  {plan.completed_at ? `Completado el ${formatDate(plan.completed_at)}` : collectionTitle}
                </Text>
                <Feather name="arrow-up-right" size={12} color={colors.textMuted}></Feather>
             </View>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.md,
  },
  cardPinned: {
    borderColor: colors.accent,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 24,
  },
  pinnedChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.sm,
  },
  pinnedText: {
    fontFamily: fonts.regular,
    fontSize: fontSize.caption,
    color: colors.onAccent,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  cover: {
    height: 72,
  },
  category: {
    fontFamily: fonts.regular,
    fontSize: fontSize.caption,
    color: colors.accent,
  },
  title: {
    fontFamily: fonts.regular,
    fontSize: fontSize.cardTitle,
    color: colors.text,
    marginTop: spacing.xs,
  },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  locationText: {
    fontFamily: fonts.regular,
    fontSize: fontSize.small,
    color: colors.textMuted,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  footerText: {
    fontFamily: fonts.regular,
    fontSize: fontSize.caption,
    color: colors.textMuted,
  },
});