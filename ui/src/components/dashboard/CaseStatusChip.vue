<template>
    <v-chip :color="meta.color" size="small" variant="tonal" label>
        {{ meta.label }}
    </v-chip>
</template>

<script setup>
import { computed }         from 'vue';
import { getStatusMeta }    from '../../constants/cases';

const props = defineProps({
    status: { type: String, required: true },
});

const meta = computed(() => getStatusMeta(props.status));
</script>