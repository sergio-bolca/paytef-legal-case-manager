export const ROLES = {
    LAWYER: 'lawyer',
    ASSISTANT: 'assistant',
};

export const CASE_STATUSES = [
    { value: 'En curso', label: 'En curso', color: 'info' },
    { value: 'Pendiente', label: 'Pendiente', color: 'warning' },
    { value: 'Completado', label: 'Completado', color: 'success' },
    { value: 'Cancelado', label: 'Cancelado', color: 'error' },
    { value: 'Cerrado', label: 'Cerrado', color: 'secondary' },
];

export function getStatusMeta(value) {
    return (
        CASE_STATUSES.find((s) => s.value === value) || {
            value,
            label: value,
            color: 'default',
        }
    );
}

export const CASE_TYPES = [
    { value: 'Civil', label: 'Civil' },
    { value: 'Penal', label: 'Penal' },
    { value: 'Administrativo', label: 'Administrativo' },
    { value: 'Laboral', label: 'Laboral' },
    { value: 'Familiar', label: 'Familiar' },
];

export function getCaseTypeLabel(value) {
    return CASE_TYPES.find((t) => t.value === value)?.label || value;
}
