import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { FormButtons } from '@/components/form-buttons';
import { TextField } from '@/components/text-field';
import { colors, fonts, fontSize, spacing } from '@/constants/theme';

export type CollectionFormValues = {
    title: string;
    description: string;
    location: string;
};

export const emptyCollectionForm: CollectionFormValues = {
    title: '',
    description: '',
    location: '',
};


export function toCollectionColumns(values : CollectionFormValues) {
    return {
        title: values.title.trim(),
        description: values.description.trim() || null,
        location: values.location.trim() || null,
    };
}

type Props = {
    initialValues: CollectionFormValues;
    submitLabel: string;
    onSubmit: (values: CollectionFormValues) => Promise<boolean>; 
    onCancel: () => void;
}

export function CollectionForm( {initialValues,submitLabel, onSubmit, onCancel } : Props ) {
    const [title, setTitle] = useState(initialValues.title);
    const [description, setDescription] = useState(initialValues.description);
    const [location, setLocation] = useState(initialValues.location);
        
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function submit() {
        if (title.trim() === '') {
            setError('Tu colección necesita un título.');
            return;
        }

        setSaving(true);
        setError(null);

        const saved = await onSubmit({ title, description, location });
        if (!saved) {
            setError('No hemos podido guardar la colección. Inténtalo de nuevo.');
            setSaving(false);
        }
    }

    return (
        <View style={styles.form}>
            <TextField
                label="Título"
                value={title}
                onChangeText={setTitle}
                placeholder="Viaje Mallorca - 2026"
                required
            ></TextField>
            <TextField
                label="Descripción"
                value={description}
                onChangeText={setDescription}
                placeholder="Viaje con amigos"
            ></TextField>
            <TextField
                label="Ubicación"
                value={location}
                onChangeText={setLocation}
                placeholder="Mallorca, España"
            ></TextField>

            { error ? <Text style={styles.error}>{error}</Text> : null }

            <FormButtons
                submitLabel={submitLabel}
                saving={saving}
                onSubmit={submit}
                onCancel={onCancel}
            ></FormButtons>
        </View>
    )
}

const styles = StyleSheet.create({
  form: {
    maxWidth: 480,
    gap: spacing.lg,
    marginTop: spacing.xl,
  },
  error: {
    fontFamily: fonts.regular,
    fontSize: fontSize.small,
    color: colors.accent,
  },
});