export function formatDate(isoDate: string, month: 'short' | 'long' = 'short') {
    return new Date(isoDate).toLocaleDateString('es-ES', {
        day: 'numeric',
        month,
        year: 'numeric',
    });
}