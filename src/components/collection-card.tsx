import { Feather } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, fonts, fontSize, radius, spacing } from '@/constants/theme';
import type { Collection } from '@/data/types';
import { formatDate } from '@/lib/format';

type Props = {
    collection: Collection;
    width: number;
    done: number;
    total: number;
    onOpen: (() => void);
};

export function CollectionCard({ collection, width, done, total, onOpen} : Props) {
    const progress = total === 0 ? 0 : done / total;

    return (
        <Pressable
          style={[styles.card, { width }]}
          onPress={onOpen}
          accessibilityRole="link"
          accessibilityLabel={`Abrir ${collection.title}`}
          >
        <View style={styles.badge}>
            <Feather name="layers" size={11} color={colors.text} />
            <Text style={styles.badgeText}>Colección</Text>
        </View>

        {/* Space for a cover photo, which comes in a later layer. */}
        <View style={styles.cover} />

        <Text style={styles.title} numberOfLines={1}>
            {collection.title}
        </Text>
        {collection.description ? (
            <Text style={styles.description} numberOfLines={1}>
            {collection.description}
            </Text>
        ) : null}

        <Text style={styles.progressText}>
            {done} de {total} planes
        </Text>
        <View style={styles.track}>
            <View style={[styles.fill, { width: `${progress * 100}%` }]} />
        </View>

        {collection.location ? (
            <View style={styles.location}>
            <Feather name="map-pin" size={10} color={colors.textMuted} />
            <Text style={styles.locationText}>{collection.location}</Text>
            </View>
        ) : null}

        {/* dates */}
        { collection.start_date && collection.end_date ? (
          <View style={styles.progressText}>
            <View style={styles.badge}>
              <Feather name="calendar" size={10} color={colors.textMuted}></Feather>
              <Text style={styles.locationText}>{formatDate(collection.start_date)} - {formatDate(collection.end_date)}</Text>
            </View>
          </View>
        ) : null}
        </Pressable>
    );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.md,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  badgeText: {
    fontFamily: fonts.regular,
    fontSize: fontSize.caption,
    color: colors.text,
  },
  cover: {
    height: 64,
  },
  title: {
    fontFamily: fonts.semibold,
    fontSize: fontSize.heading,
    color: colors.text,
  },
  description: {
    fontFamily: fonts.regular,
    fontSize: fontSize.small,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  progressText: {
    fontFamily: fonts.regular,
    fontSize: fontSize.caption,
    color: colors.textMuted,
    marginTop: spacing.md,
  },
  track: {
    height: 3,
    marginTop: spacing.xs,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceMuted,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: radius.pill,
    backgroundColor: colors.accent,
  },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.md,
  },
  locationText: {
    fontFamily: fonts.regular,
    fontSize: fontSize.caption,
    color: colors.textMuted,
  },
});