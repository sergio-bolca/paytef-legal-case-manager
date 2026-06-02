<template>
    <div class="text-center py-12">
        <v-icon :icon="icon" size="56" color="secondary" class="mb-3" />
        <div class="text-h6 font-weight-regular text-primary">
            {{ title }}
        </div>
        <div class="text-body-2 text-medium-emphasis mt-1">
            {{ message }}
        </div>
        <div v-if="$slots.action" class="mt-4">
            <slot name="action" />
        </div>
    </div>
</template>

<script setup>
defineProps({
    icon:       { type: String, default: 'mdi-folder-open-outline' },
    title:      { type: String, default: 'Nothing to show' },
    message:    { type: String, default: '' }
});
</script>