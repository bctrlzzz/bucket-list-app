import { useEffect, useState } from 'react';

import { colors, fonts, fontSize, radius, spacing } from '@/constants/theme';
import type { Collection } from '@/data/types';
import { supabase } from '@/lib/supabase';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { TextField } from './text-field';

// what the form works with
export type PlanFormValues = {
    title: string;
    category: string;
    place: string;
    city: string;
    collectionId: string | null;
}

// new form
export const emptyPlanForm: PlanFormValues = {
    title: '',
    category: '',
    place: '',
    city: '',
    collectionId: null,
};

// turn form values into the plans table columns
export function toPlanColumns(values: PlanFormValues) {
    return {
        title: values.title.trim(),
        category: values.category.trim() || null,
        place: values.place.trim() || null,
        city: values.city.trim() || null,
        collection_id: values.collectionId,
    };
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
    const [collectionId, setCollectionId] = useState<string | null>(initialValues.collectionId);
    
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

        setSaving(true);
        setError(null);

        const saved = await onSubmit({ title, category, place, city, collectionId });
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
        
        <View style={styles.buttons}>
        <Pressable style={styles.secondaryButton} onPress={onCancel}>
          <Text style={styles.secondaryButtonText}>Cancelar</Text>
        </Pressable>

        <Pressable
            style={[styles.primaryButton, saving && styles.buttonBusy]}
            onPress={submit}
            disabled={saving}>
            
            {saving ? (
                <ActivityIndicator color={colors.onAccent}/> ) :(
                    <Text style={styles.primaryButtonText}>{submitLabel}</Text>
            )}
        </Pressable>
        </View>
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
    minWidth: 120,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
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