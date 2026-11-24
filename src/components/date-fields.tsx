

import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';

import { colors, fonts, fontSize, radius, spacing } from '@/constants/theme';
import { fromDisplayDate, toDisplayDate } from '@/lib/date-input';
import { Feather } from '@expo/vector-icons';


// register spanish as calendar default lang
LocaleConfig.locales.es = {

  monthNames: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
  monthNamesShort: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
  dayNames: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
  dayNamesShort: ['D', 'L', 'M', 'X', 'J', 'V', 'S'],
  today: 'Hoy',

};

LocaleConfig.defaultLocale = 'es';

type DateFieldProps = {
    label: string;
    value: string | null; // real date (db format) owned by the form
    onChange: (value: string | null) => void;
}

export function DateField({ label, value, onChange} : DateFieldProps) {
    const [text, setText] = useState(value ? toDisplayDate(value) : ''); // text field, owned by the field
    const [open, setOpen] = useState(false);

    // to display error when invalid is true
    // check if not empty and fromDisplayDate returns null (not real date)
    const invalid = text.trim() !== '' && fromDisplayDate(text) === null;

    // type date
    function changeText(newText: string) {
        setText(newText);
        onChange(fromDisplayDate(newText));
    }

    // pick day
    function pickDay(day: string) {
        setText(toDisplayDate(day));
        onChange(day);
        setOpen(false);
    }

    return (
        <View style={styles.field}>
            <Text style={styles.label}>{label}</Text>

            <View style={styles.row}>
                <TextInput
                    style={[styles.input, styles.grow, invalid && styles.inputInvalid]}
                    value={text}
                    onChangeText={changeText}
                    placeholder='DD/MM/AAAA'
                    placeholderTextColor={colors.textMuted}
                    maxLength={10}
                >
                </TextInput>

                <Pressable
                    style={styles.iconButton}
                    onPress={() => setOpen(!open)}
                    accessibilityLabel={open ? 'Cerrar calendario' : 'Abrir calendario'}>
                        <Feather name="calendar" size={16} color={open ? colors.accent : colors.text}></Feather>
                </Pressable>
            </View>

            {invalid ? <Text style={styles.hint}>Usa el formato DD/MM/AAAA</Text> : null}

            { open ? (
                <View style={styles.calendarBox}>
                    <Calendar
                        current={value ?? undefined}
                        firstDay={1}
                        markedDates={value ? { [value]: { selected: true } }: {} }
                        onDayPress={(day) => pickDay(day.dateString)}
                        theme={{
                            calendarBackground: colors.surface,
                            textSectionTitleColor: colors.textMuted,
                            dayTextColor: colors.text,
                            monthTextColor: colors.text,
                            todayTextColor: colors.accent,
                            selectedDayBackgroundColor: colors.accent,
                            selectedDayTextColor: colors.onAccent,
                            arrowColor: colors.accent,
                            textDisabledColor: colors.border,
                            textDayFontFamily: fonts.regular,
                            textMonthFontFamily: fonts.semibold,
                            textDayHeaderFontFamily: fonts.regular,
                            textDayFontSize: fontSize.body,
                            textMonthFontSize: fontSize.heading,
                        }}  
                    />
                </View>
            ): null}
        </View>
    )
}

type TimeFieldProps = {
    label: string;
    value: string | null;
    onChange: (value: string | null) => void;
}

export function TimeField({ label, value, onChange} : TimeFieldProps) {
    const [text, setText] = useState(value ? toDisplayDate(value) : ''); // text field, owned by the field

    const invalid = text.trim() !== '' && fromDisplayDate(text) === null;

    function changeText(newText: string) {
        setText(newText);
        onChange(fromDisplayDate(newText));
    }

    return (
        <View style={styles.field}>
            <Text style={styles.label}>{label}</Text>
            <TextInput style={[styles.input, invalid && styles.inputInvalid]}
                value={text}
                onChangeText={changeText}
                placeholder='HH:MM'
                placeholderTextColor={colors.textMuted}
                maxLength={5}
            />
            { invalid ? <Text style={styles.hint}>Usa el formato HH:MM. </Text> : null}
        </View>
    )

}

const styles = StyleSheet.create({
  field: {
    gap: spacing.xs,
  },
  label: {
    fontFamily: fonts.regular,
    fontSize: fontSize.small,
    color: colors.textMuted,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  grow: {
    flex: 1,
  },
  input: {
    height: 40,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    fontFamily: fonts.regular,
    fontSize: fontSize.body,
    color: colors.text,
  },
  inputInvalid: {
    borderColor: colors.accent,
  },
  iconButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
  },
  hint: {
    fontFamily: fonts.regular,
    fontSize: fontSize.caption,
    color: colors.accent,
  },
  calendarBox: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    overflow: 'hidden',
  },
})