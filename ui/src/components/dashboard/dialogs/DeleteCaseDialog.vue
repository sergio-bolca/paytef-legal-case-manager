<template>
    <ConfirmDialog 
        :model-value="modelValue" 
        title="Delete case" 
        :message="message" 
        confirm-text="Delete"
        confirm-color="error" 
        :loading="loading" 
        @update:model-value="$emit('update:modelValue', $event)"
        @confirm="onConfirm" />
</template>

<script setup>
import { computed, ref }    from 'vue';
import ConfirmDialog        from '../../common/ConfirmDialog.vue';
import { useCasesStore }    from '../../../stores/cases';

const props = defineProps({
    modelValue: { 
        type: Boolean, 
        default: false 
    },
    caseItem: { 
        type: Object, 
        default: null 
    }
});

const emit = defineEmits(['update:modelValue', 'deleted', 'error']);

const casesStore = useCasesStore();
const loading = ref(false);

const message = computed(() => {
    if (!props.caseItem) return '';
    return `Case #${props.caseItem.id} - "${props.caseItem.subject}" will be permanently removed. This action cannot be undone.`;
});

async function onConfirm() {
    if (!props.caseItem) return;
    loading.value = true;
    try {
        await casesStore.deleteCase(props.caseItem.id);
        emit('deleted', props.caseItem);
        emit('update:modelValue', false);
    } catch (err) {
        emit(
            'error',
            err.response?.data?.message ||
                'The case could not be deleted. Please try again.'
        );
    } finally {
        loading.value = false;
    }
}
</script>