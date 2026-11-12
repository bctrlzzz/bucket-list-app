

import { TextField } from '@/components/text-field';
import { colors, fonts, fontSize, radius, spacing } from '@/constants/theme';
import type { Collection } from '@/data/types';
import { supabase } from '@/lib/supabase';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

// add plan form
export default function NewPlanScreen() {
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('');
    const [place, setPlace] = useState('');
    const [city, setCity] = useState('');
    const [collectionId, setCollectionId] = useState<string | null>(null);
    
    const [collections, setCollections] = useState<Collection[]>([]);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // load collections
    useEffect(() => {
        supabase
        .from('collections')
        .select()
        .is('archived_at', null)
        .order('title')
        .then(({data}) => setCollections((data ?? ([]) as Collection[])));
    }, []);

    async function save() {
        if (title.trim() === '') {
            setError('Este campo no puede estar vacío.');
            return;
        }
        setSaving(true);
        setError(null);

        const {error: saveError} = await supabase.from('plans').insert({
            title: title.trim(),
            category: category.trim() || null,
            place: place.trim() || null,
            city: city.trim() || null,
            collection_id: collectionId,
        });

        // saveError renames 'error' from supabase while unpacking it
        if (saveError) {
            setError('No hemos podido guardar el plan. Inténtalo de nuevo.');
            setSaving(false);
            return;
        }
        router.replace('/');
    }

    return (
        <ScrollView style={styles.scroll} contentContainerStyle={styles.page}>
            <Text style={styles.title}>Añadir plan</Text>

            <View style={styles.form}>
                <TextField label="Título" value={title} onChangeText={setTitle} placeholder='Título' required></TextField>
                <TextField label="Categoría" value={category} onChangeText={setCategory} placeholder='Categoría'></TextField>
                <TextField label="Lugar" value={place} onChangeText={setPlace} placeholder='Lugar'></TextField>
                <TextField label="Ciudad" value={city} onChangeText={setCity} placeholder='Ciudad'></TextField>
                
                {/* collections */}
                <Text style={styles.label}>Colección</Text>
                <View style={styles.chips}>
                    {/* no collection */}
                    <Pressable
                        // apply styles in order
                        style={[styles.chip, collectionId === null && styles.chipActive]}
                        onPress={() => setCollectionId(null)}>
                            <Text style={[styles.chipText, collectionId === null && styles.chipTextActive]}>
                                Sin colección
                            </Text>
                    </Pressable>

                    {/* choose collection */}
                    {collections.map((collection) => {
                        const isActive = collectionId === collection.id;
                        return (
                            <Pressable
                                key={collection.id}
                                style={[styles.chip, isActive && styles.chipActive]}
                                onPress={()=>setCollectionId(collection.id)}>
                                <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
                                    {collection.title}
                                </Text>
                            </Pressable>
                        );
                    })}
                </View>

                { error ? <Text style={styles.error}>{error}</Text> : null }

                <View style={styles.buttons}>
                    <Pressable style={styles.secondaryButton} onPress={()=> router.replace('/')}>
                        <Text style={styles.secondaryButtonText}>Cancelar</Text>
                    </Pressable>

                    <Pressable
                        style={[styles.primaryButton, saving && styles.buttonBusy]}
                        onPress={(save)}
                        disabled={saving}>
                            {saving ? (
                                <ActivityIndicator color={colors.onAccent}></ActivityIndicator> ) :
                                (
                                    <Text style={styles.primaryButtonText}>Guardar</Text>
                            )}
                    </Pressable>
                </View>
            </View>
        </ScrollView>
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