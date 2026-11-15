import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text } from 'react-native';

import {
  emptyPlanForm,
  PlanForm,
  toPlanColumns,
  type PlanFormValues,
} from '@/components/plan-form';
import { colors, fonts, fontSize, spacing } from '@/constants/theme';
import { supabase } from '@/lib/supabase';

export default function NewPlanScreen() {
  async function create(values: PlanFormValues) {
    const { error } = await supabase.from('plans').insert(toPlanColumns(values));
    if (error) return false;

    router.replace('/');
    return true;
  }

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.page}>
      <Text style={styles.title}>Nuevo plan</Text>
      <PlanForm
        initialValues={emptyPlanForm}
        submitLabel="Guardar plan"
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