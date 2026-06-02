<template>
    <v-data-table :headers="headers" :items="cases" :loading="loading" :items-per-page="10"
        :sort-by="[{ key: 'presentedAt', order: 'desc' }]" density="comfortable" class="elevation-0" hover>
        <template #item.caseType="{ item }">
            {{ getCaseTypeLabel(item.caseType) }}
        </template>

        <template #item.presentedAt="{ item }">
            {{ formatDate(item.presentedAt) }}
        </template>

        <template #item.status="{ item }">
            <CaseStatusChip :status="item.status" />
        </template>

        <template #item.assistantName="{ item }">
            <span v-if="item.assistantName">{{ item.assistantName }}</span>
            <span v-else class="text-medium-emphasis font-italic">Unassigned</span>
        </template>

        <template #item.lawyerName="{ item }">
            <span v-if="item.lawyerName">{{ item.lawyerName }}</span>
            <span v-else class="text-medium-emphasis font-italic">Unassigned</span>
        </template>

        <template v-if="canManage" #item.actions="{ item }">
            <div class="d-flex justify-end ga-1">
                <v-btn icon="mdi-pencil-outline" size="small" variant="text" color="primary" aria-label="Edit case"
                    @click="$emit('edit', item)" />
                <v-btn icon="mdi-trash-can-outline" size="small" variant="text" color="error" aria-label="Delete case"
                    @click="$emit('delete', item)" />
            </div>
        </template>

        <template #no-data>
            <EmptyState 
                icon="mdi-folder-open-outline" 
                title="No cases yet" 
                :message="canManage
                    ? 'Create your first case to start tracking your work.'
                    : 'You have no cases assigned at the moment.'" />
        </template>
    </v-data-table>
</template>

<script setup>
import { computed }         from 'vue';
import CaseStatusChip       from './CaseStatusChip.vue';
import EmptyState           from '../common/EmptyState.vue';
import { getCaseTypeLabel } from '../../constants/cases';

const props = defineProps({
    cases: { 
        type: Array, 
        required: true 
    },
    loading: { 
        type: Boolean, 
        default: false 
    },
    canManage: { 
        type: Boolean, 
        default: false 
    }
});

defineEmits(['edit', 'delete']);

const headers = computed(() => {
    const base = [
        { title: 'Type', key: 'caseType' },
        { title: 'Subject', key: 'subject' },
        { title: 'Filed on', key: 'presentedAt' },
        { title: 'Status', key: 'status' },
        props.canManage
            ? { title: 'Assistant', key: 'assistantName' }
            : { title: 'Lawyer', key: 'lawyerName' },
    ];
    if (props.canManage) {
        base.push({
            title: 'Actions',
            key: 'actions',
            sortable: false,
            align: 'end',
            width: 120,
        });
    }
    return base;
});

function formatDate(value) {
    if (!value) return '';
    try {
        return new Date(value).toLocaleDateString('en-GB', {
            year: 'numeric',
            month: 'short',
            day: '2-digit',
        });
    } catch {
        return value;
    }
}
</script>