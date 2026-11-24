// '2026-12-12' → '12/12/2026' from db to screen
export function toDisplayDate(isoDate: string) {
    const [year, month, day] = isoDate.split('-'); // ['2016', '03', '12']
    return `${day}/${month}/${year}`;
}

// check user typed date, from screen to db
export function fromDisplayDate(text: string) {
    const match = text.trim().match(/^(\d{1,2})[/.-](\d{1,2})[/.-](\d{4})$/);
    if (!match) return null;

    const day = Number(match[1]);
    const month = Number(match[2]);
    const year = Number(match[3]);

    const date = new Date(year, month - 1, day); // js counts months from 0

    // check if it's a real date
    if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    return null;
  }

  // build db format
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export function parseTime(text: string) {
    const match = text.trim().match(/^(\d{1,2})(?::(\d{2}))?$/);
    if (!match) return null;

    const hours = Number(match[1]);
    const minutes = Number(match[2] ?? '0');
    if (hours > 23 || minutes > 59) return null;

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}