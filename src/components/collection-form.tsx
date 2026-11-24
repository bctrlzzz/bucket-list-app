import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { FormButtons } from '@/components/form-buttons';
import { TextField } from '@/components/text-field';
import { colors, fonts, fontSize, spacing } from '@/constants/theme';
import { DateField } from './date-fields';


export type CollectionFormValues = {
    title: string;
    description: string;
    location: string;
    startDate: string | null;
    endDate: string | null;
};

export const emptyCollectionForm: CollectionFormValues = {
    title: '',
    description: '',
    location: '',
    startDate: null,
    endDate: null,
}


export function toCollectionColumns(values : CollectionFormValues) {
    return {
        title: values.title.trim(),
        description: values.description.trim() || null,
        location: values.location.trim() || null,
        start_date: values.startDate,
        end_date: values.endDate,
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
    const [startDate, setStartDate] = useState(initialValues.startDate);
    const [endDate, setEndDate] = useState(initialValues.endDate);

    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function submit() {
        if (title.trim() === '') {
            setError('Tu colección necesita un título.');
            return;
        }
        
        if (endDate && !startDate) {
        setError('Añade también la fecha de inicio.');
        return;
        }
        
        if (startDate && endDate && endDate < startDate) {
        setError('La fecha de fin no puede ser anterior a la de inicio.');
        return;
        }

        setSaving(true);
        setError(null);

        const saved = await onSubmit({ title, description, location, startDate, endDate });
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
            <DateField
                label="Desde"
                value={startDate}
                onChange={setStartDate}
            ></DateField>
            <DateField
                label="Hasta"
                value={endDate}
                onChange={setEndDate}
            ></DateField>

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