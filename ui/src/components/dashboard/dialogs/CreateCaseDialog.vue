<template>
    <v-dialog :model-value="modelValue" @update:model-value="onDialogUpdate" max-width="560" persistent>
        <v-card>
            <v-card-title class="text-h6 font-weight-regular">
                New case
            </v-card-title>

            <v-card-text>
                <v-form ref="formRef" validate-on="submit" @submit.prevent="onSubmit">
                    <v-row>
                        <v-col cols="12" sm="6">
                            <v-select v-model="form.caseType" :items="caseTypes" item-title="label" item-value="value"
                                label="Case type" :rules="[required]" />
                        </v-col>
                        <v-col cols="12" sm="6">
                            <v-text-field v-model="form.presentedAt" type="date" label="Filed on" :rules="[required]" />
                        </v-col>
                        <v-col cols="12">
                            <v-text-field v-model="form.subject" label="Subject" :rules="[required]" />
                        </v-col>
                        <v-col cols="12" sm="6">
                            <v-select v-model="form.status" :items="statuses" item-title="label" item-value="value"
                                label="Status" :rules="[required]" />
                        </v-col>
                        <v-col cols="12" sm="6">
                            <v-select v-model="form.assistantId" :items="assistantOptions" item-title="title"
                                item-value="value" label="Assistant" clearable />
                        </v-col>
                    </v-row>

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
                    Create
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup>
import { reactive, ref, watch, computed }   from 'vue';
import { useCasesStore }                    from '../../../stores/cases';
import { CASE_STATUSES, CASE_TYPES }        from '../../../constants/cases';

const props = defineProps({
    modelValue: { 
        type: Boolean, 
        default: false 
    },
    assistants: { 
        type: Array, 
        default: () => [] 
    }
});

const emit = defineEmits(['update:modelValue', 'created']);

const casesStore = useCasesStore();

const statuses  = CASE_STATUSES;
const caseTypes = CASE_TYPES;

const formRef   = ref(null);
const loading   = ref(false);
const errorMsg  = ref('');

const defaultForm = () => ({
    caseType: null,
    presentedAt: new Date().toISOString().slice(0, 10),
    subject: '',
    status: 'En curso',
    assistantId: null,
});

const form = reactive(defaultForm());

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
        const created = await casesStore.createCase({
            caseType: form.caseType,
            presentedAt: form.presentedAt,
            subject: form.subject.trim(),
            status: form.status,
            assistantId: form.assistantId,
        });
        emit('created', created);
        close();
    } catch (err) {
        errorMsg.value =
            err.response?.data?.message ||
            'The case could not be created. Please try again.';
    } finally {
        loading.value = false;
    }
}

watch(() => props.modelValue, (open) => {
    if (open) {
        Object.assign(form, defaultForm());
        errorMsg.value = '';
    }
});
</script>