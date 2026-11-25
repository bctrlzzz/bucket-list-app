import { useEffect, useState } from 'react';

import { colors, fonts, fontSize, radius, spacing } from '@/constants/theme';
import type { Collection } from '@/data/types';
import { parsePrice } from '@/lib/price';
import { supabase } from '@/lib/supabase';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { DateField } from './date-fields';
import { FormButtons } from './form-buttons';
import { TextField } from './text-field';

// what the form works with
export type PlanFormValues = {
    title: string;
    category: string;
    place: string;
    city: string;
    price: string;
    collectionId: string | null;
    startDate: string | null;
    endDate: string | null;
}

// new form
export const emptyPlanForm: PlanFormValues = {
    title: '',
    category: '',
    place: '',
    city: '',
    price: '',
    collectionId: null,
    startDate: null,
    endDate: null,
};

// turn form values into the plans table columns
export function toPlanColumns(values: PlanFormValues) {
    return {
        title: values.title.trim(),
        category: values.category.trim() || null,
        place: values.place.trim() || null,
        city: values.city.trim() || null,
        price: parsePrice(values.price), // "12,5" -> 12.5, empty -> null
        collection_id: values.collectionId,
    };
}

// dates live in the plan_dates table
// returns true if saved (or nothing to save)
export async function savePlanDates(planId: string, values: PlanFormValues) {
    const { data: existing, error: readError } = await supabase
        .from('plan_dates')
        .select('id')
        .eq('plan_id', planId)
        .limit(1);
    if (readError) return false;

    const row = existing?.[0];
    const hasDates = values.startDate !== null || values.endDate !== null;

    if (!hasDates) {
        if (!row) return true;
        const { error } = await supabase.from('plan_dates').delete().eq('id', row.id);
        return !error;
    }

    const dates = { start_date: values.startDate, end_date: values.endDate };
    const { error } = row
        ? await supabase.from('plan_dates').update(dates).eq('id', row.id)
        : await supabase.from('plan_dates').insert({ plan_id: planId, ...dates });
    return !error;
}

type Props = {
    initialValues: PlanFormValues; // start with empty boxes
    submitLabel: string; // lets each screen choose its button text
    onSubmit: (values: PlanFormValues) => Promise<boolean>; // screen returns true or false whether the db saves the form values
    onCancel: () => void;
};

export function PlanForm({initialValues, submitLabel, onSubmit, onCancel } : Props) {
    const [title, setTitle] = useState(initialValues.title);
    const [category, setCategory] = useState(initialValues.category);
    const [place, setPlace] = useState(initialValues.place);
    const [city, setCity] = useState(initialValues.city);
    const [price, setPrice] = useState(initialValues.price);
    const [collectionId, setCollectionId] = useState<string | null>(initialValues.collectionId);
    const [startDate, setStartDate] = useState(initialValues.startDate);
    const [endDate, setEndDate] = useState(initialValues.endDate);

    const [collections, setCollections] = useState<Collection[]>([]);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        supabase
            .from('collections')
            .select()
            .is('archived_at', null)
            .order('title')
            .then(({data}) => setCollections((data ?? ([]) as Collection[])));
    }, []);

    async function submit() {
        if (title.trim() === '') {
            setError('El plan necesita un título.');
            return;
        }

        // check text that isn't price
        if (price.trim() !== '' && parsePrice(price) === null) {
          setError('Escribe el precio como número');
          return;
        }

        setSaving(true);
        setError(null);

        const saved = await onSubmit({ title, category, place, city, collectionId, price, startDate, endDate });
        if (!saved) {
            setError('No hemos podido guardar el plan. Inténtalo de nuevo.');
            setSaving(false);
        }
    }

    return (
        <View style={styles.form}>
            <TextField label='Título' value={title} onChangeText={setTitle} placeholder='' required></TextField>
            <TextField label='Categoría' value={category} onChangeText={setCategory} placeholder=''></TextField>
            <TextField label='Lugar' value={place} onChangeText={setPlace} placeholder=''></TextField>
            <TextField label='Ciudad' value={city} onChangeText={setCity} placeholder=''></TextField>
            <TextField label='Precio' value={price} onChangeText={setPrice} placeholder='34,99€' keyboardType='decimal-pad'></TextField>
            <DateField label='Desde' value={startDate} onChange={setStartDate}></DateField>
            <DateField label='Hasta' value={endDate} onChange={setEndDate}></DateField>
        
            <Text style={styles.label}>Colección</Text>
            <View style={styles.chips}>
                <Pressable
                style={[styles.chip, collectionId === null && styles.chipActive]}
                onPress={() => setCollectionId(null)}>
                <Text style={[styles.chipText, collectionId === null && styles.chipTextActive]}>
                Sin colección
                </Text>
                </Pressable>

            {collections.map((collection) => {
            const isActive = collectionId === collection.id;
            return (
                <Pressable
                key={collection.id}
                style={[styles.chip, isActive && styles.chipActive]}
                onPress={() => setCollectionId(collection.id)}>
                <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
                    {collection.title}
                </Text>
                </Pressable>
            );
            })}
        </View>
        
        {error ? <Text style={styles.error}> {error} </Text> : null}
            
        <FormButtons
          submitLabel={submitLabel}
          saving={saving}
          onSubmit={submit} // plan-form's own function
          onCancel={onCancel} // prop that the plan form receives from each screen
        ></FormButtons>
        
        </View>
    )
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
  form: {
    maxWidth: 480,
    gap: spacing.lg,
    marginTop: spacing.xl,
  },
  label: {
    fontFamily: fonts.regular,
    fontSize: fontSize.small,
    color: colors.textMuted,
    marginBottom: -spacing.sm,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
  },
  chipActive: {
    borderColor: colors.accent,
    backgroundColor: colors.accentSoft,
  },
  chipText: {
    fontFamily: fonts.regular,
    fontSize: fontSize.small,
    color: colors.text,
  },
  chipTextActive: {
    color: colors.accent,
  },
  error: {
    fontFamily: fonts.regular,
    fontSize: fontSize.small,
    color: colors.accent,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  secondaryButton: {
    height: 36,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
  },
  secondaryButtonText: {
    fontFamily: fonts.regular,
    fontSize: fontSize.body,
    color: colors.text,
  },
  primaryButton: {
    height: 36,
    // minWidth: 120,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    borderRadius: radius.md,
    backgroundColor: colors.accent,
  },
  primaryButtonText: {
    fontFamily: fonts.semibold,
    fontSize: fontSize.body,
    color: colors.onAccent,
  },
  buttonBusy: {
    opacity: 0.6,
  },
});