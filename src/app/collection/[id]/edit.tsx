import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';

import {
  CollectionForm,
  toCollectionColumns,
  type CollectionFormValues,
} from '@/components/collection-form';
import { colors, fonts, fontSize, spacing } from '@/constants/theme';
import type { Collection } from '@/data/types';
import { supabase } from '@/lib/supabase';

export default function EditCollectionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [initialValues, setInitialValues] = useState<CollectionFormValues | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from('collections').select().eq('id', id).single();

      if (data) {
        const collection = data as Collection;
        setInitialValues({
          title: collection.title,
          description: collection.description ?? '',
          location: collection.location ?? '',
          startDate: collection.start_date,
          endDate: collection.end_date,
        });
      }
      setLoading(false);
    }

    load();
  }, [id]);

  function goToCollection() {
    router.replace({ pathname: '/collection/[id]', params: { id } });
  }

  async function save(values: CollectionFormValues) {
    const { error } = await supabase
      .from('collections')
      .update(toCollectionColumns(values))
      .eq('id', id);
    if (error) return false;

    goToCollection();
    return true;
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.accent} />
      </View>
    );
  }

  if (!initialValues) {
    return (
      <View style={styles.center}>
        <Text style={styles.muted}>No hemos encontrado esta colección.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.page}>
      <Text style={styles.title}>Editar colección</Text>
      <CollectionForm
        initialValues={initialValues}
        submitLabel="Guardar cambios"
        onSubmit={save}
        onCancel={goToCollection}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  muted: {
    fontFamily: fonts.regular,
    fontSize: fontSize.body,
    color: colors.textMuted,
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
});