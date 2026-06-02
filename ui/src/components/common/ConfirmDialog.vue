<template>
    <v-dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)" max-width="420"
        persistent>
        <v-card>
            <v-card-title class="text-h6 font-weight-regular">
                {{ title }}
            </v-card-title>
            <v-card-text class="text-body-2">
                {{ message }}
            </v-card-text>
            <v-card-actions class="px-4 pb-4">
                <v-spacer />
                <v-btn variant="text" :disabled="loading" @click="$emit('update:modelValue', false); $emit('cancel')">
                    {{ cancelText }}
                </v-btn>
                <v-btn :color="confirmColor" variant="flat" :loading="loading" @click="$emit('confirm')">
                    {{ confirmText }}
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup>
defineProps({
    modelValue:     { type: Boolean, default: false },
    title:          { type: String, default: 'Are you sure?' },
    message:        { type: String, default: '' },
    confirmText:    { type: String, default: 'Confirm' },
    cancelText:     { type: String, default: 'Cancel' },
    confirmColor:   { type: String, default: 'primary' },
    loading:        { type: Boolean, default: false }
});

defineEmits(['update:modelValue', 'confirm', 'cancel']);
</script>