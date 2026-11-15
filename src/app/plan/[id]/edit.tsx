import { PlanForm, PlanFormValues, toPlanColumns } from "@/components/plan-form";
import { colors, fonts, fontSize, spacing } from "@/constants/theme";
import { Plan } from "@/data/types";
import { supabase } from "@/lib/supabase";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";

export default function EditPlanScreen() {
    const {id} = useLocalSearchParams<{ id: string}>();
    const [initialValues, setInitialValues] = useState<PlanFormValues | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        supabase
            .from('plans')
            .select()
            .eq('id', id)
            .single()
            .then(({data}) => {
                if (data) {
                    const plan = data as Plan;
                    setInitialValues({
                        title: plan.title,
                        category: plan.category ?? '',
                        place: plan.place ?? '',
                        city: plan.city ?? '',
                        collectionId: plan.collection_id,
                    })
                }
                setLoading(false);
            })
    }, [id]);

    function goToPlan() {
        router.replace({ pathname: '/plan/[id]', params: {id}});
    }

    async function save(values: PlanFormValues) {
        const {error} = await supabase.from('plans').update(toPlanColumns(values)).eq('id', id);
        if (error) return false;

        goToPlan();
        return true;
    }

    if (loading) {
        <View style={styles.center}>
            <ActivityIndicator color={colors.accent} />
        </View>
    }

    if (!initialValues) {
        return (
        <View style={styles.center}>
            <Text style={styles.muted}>No hemos encontrado este plan.</Text>
        </View>
        );
    }

    return (
        <ScrollView style={styles.scroll} contentContainerStyle={styles.page}>
        <Text style={styles.title}>Editar plan</Text>
        <PlanForm
            initialValues={initialValues}
            submitLabel="Guardar cambios"
            onSubmit={save}
            onCancel={goToPlan}
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