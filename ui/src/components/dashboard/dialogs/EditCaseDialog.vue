<template>
    <v-dialog :model-value="modelValue" @update:model-value="onDialogUpdate" max-width="520" persistent>
        <v-card v-if="caseItem">
            <v-card-title class="text-h6 font-weight-regular">
                Edit case #{{ caseItem.id }}
            </v-card-title>

            <v-card-text>
                <div class="text-body-2 text-medium-emphasis mb-4">
                    {{ caseItem.subject }}
                </div>

                <v-form ref="formRef" validate-on="submit" @submit.prevent="onSubmit">
                    <v-select v-model="form.status" :items="statuses" item-title="label" item-value="value"
                        label="Status" :rules="[required]" />
                    <v-select v-model="form.assistantId" :items="assistantOptions" item-title="title" item-value="value"
                        label="Assistant" clearable />

                    <v-alert v-if="errorMsg" type="error" variant="tonal" density="compact" class="mt-2">
                        {{ errorMsg }}
                    </v-alert>
                </v-form>
            </v-card-text>

            <v-card-actions class="px-4 pb-4">
                <v-spacer />
                <v-btn variant="text" :disabled="loading" @click="close">
                    Cancel
                </v-btn>
                <v-btn color="primary" variant="flat" :loading="loading" @click="onSubmit">
                    Save changes
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup>
import { reactive, ref, watch, computed } from 'vue';
import { useCasesStore } from '../../../stores/cases';
import { CASE_STATUSES } from '../../../constants/cases';

const props = defineProps({
    modelValue: { 
        type: Boolean, 
        default: false 
    },
    caseItem: { 
        type: Object, 
        default: null 
    },
    assistants: { 
        type: Array, 
        default: () => [] 
    }
});

const emit = defineEmits(['update:modelValue', 'updated']);

const casesStore = useCasesStore();

const statuses = CASE_STATUSES;

const formRef   = ref(null);
const loading   = ref(false);
const errorMsg  = ref('');

const form = reactive({
    status: null,
    assistantId: null,
});

const assistantOptions = computed(() =>
    props.assistants.map((a) => ({ title: a.name, value: a.id }))
);

const required = (v) => (v !== null && v !== undefined && String(v).trim() !== '') || 'This field is required';

function onDialogUpdate(value) {
    if (!value) close();
}

function close() {
    emit('update:modelValue', false);
}

async function onSubmit() {
    errorMsg.value = '';
    const { valid } = await formRef.value.validate();
    if (!valid) return;

    loading.value = true;
    try {
        const updated = await casesStore.updateCase(props.caseItem.id, {
            status: form.status,
            assistantId: form.assistantId,
        });
        emit('updated', updated);
        close();
    } catch (err) {
        errorMsg.value =
            err.response?.data?.message ||
            'The case could not be updated. Please try again.';
    } finally {
        loading.value = false;
    }
}

watch(() => [props.modelValue, props.caseItem], ([open, item]) => {
    if (open && item) {
        form.status = item.status;
        form.assistantId = item.assistantId ?? null;
        errorMsg.value = '';
    }
}, { immediate: true });
</script>