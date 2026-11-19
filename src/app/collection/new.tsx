import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text } from 'react-native';

import {
    CollectionForm,
    emptyCollectionForm,
    toCollectionColumns,
    type CollectionFormValues,
} from '@/components/collection-form';
import { colors, fonts, fontSize, spacing } from '@/constants/theme';
import { supabase } from '@/lib/supabase';

// new collection screen
export default function NewCollectionScreen() {
    async function create(values: CollectionFormValues) {
        const { error } = await supabase.from('collections').insert(toCollectionColumns(values));
        if (error) return false;

        router.replace('/');
        return true;
    }

    return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.page}>
      <Text style={styles.title}>Nueva colección</Text>
      <CollectionForm
        initialValues={emptyCollectionForm}
        submitLabel="Crear colección"
        onSubmit={create}
        onCancel={() => router.replace('/')}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
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