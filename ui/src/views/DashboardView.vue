<template>
    <v-app>

        <AppTopBar />

        <v-main class="dashboard-bg">
            <v-container>
                <div class="d-flex align-center mb-4 flex-wrap ga-2">
                    <div>
                        <h1 class="text-h5 font-weight-medium text-primary">
                            {{ title }}
                        </h1>
                        <div class="text-body-2 text-medium-emphasis">
                            {{ subtitle }}
                        </div>
                    </div>
                    <v-spacer />
                    <v-btn v-if="canManage" color="primary" prepend-icon="mdi-plus" @click="openCreate">
                        New case
                    </v-btn>
                </div>

                <v-card class="pa-2" elevation="1">
                    <v-alert v-if="loadError" type="error" variant="tonal" density="compact" class="ma-2">
                        Could not load cases. Please try again.
                    </v-alert>

                    <CasesTable :cases="casesStore.items" :loading="casesStore.loading" :can-manage="canManage"
                        @edit="openEdit" @delete="openDelete" />
                </v-card>
            </v-container>
        </v-main>

        <CreateCaseDialog v-if="canManage" 
            v-model="createOpen" 
            :assistants="casesStore.assistants"
            @created="onCreated" />

        <EditCaseDialog v-if="canManage" 
            v-model="editOpen" 
            :case-item="selectedCase"
            :assistants="casesStore.assistants" @updated="onUpdated" />

        <DeleteCaseDialog v-if="canManage" 
            v-model="deleteOpen" 
            :case-item="selectedCase" 
            @deleted="onDeleted"
            @error="onDeleteError" />

        <v-snackbar v-model="snackbar.open" :color="snackbar.color" timeout="2800">
            {{ snackbar.text }}
        </v-snackbar>

    </v-app>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue';

import { useAuthStore }     from '../stores/auth';
import { useCasesStore }    from '../stores/cases';

import AppTopBar        from '../components/common/AppTopBar.vue';
import CasesTable       from '../components/dashboard/CasesTable.vue';
import CreateCaseDialog from '../components/dashboard/dialogs/CreateCaseDialog.vue';
import EditCaseDialog   from '../components/dashboard/dialogs/EditCaseDialog.vue';
import DeleteCaseDialog from '../components/dashboard/dialogs/DeleteCaseDialog.vue';

const auth = useAuthStore();
const casesStore = useCasesStore();

const canManage = computed(() => auth.isLawyer);
const title = computed(() =>
    canManage.value ? 'My cases' : 'Assigned cases'
);
const subtitle = computed(() =>
    canManage.value
        ? 'Manage the cases you own. Create, edit and delete as needed.'
        : 'Review the cases you have been assigned to.'
);

const loadError = ref(false);

const createOpen    = ref(false);
const editOpen      = ref(false);
const deleteOpen    = ref(false);
const selectedCase  = ref(null);

const snackbar = reactive({ open: false, text: '', color: 'success' });

function notify(text, color = 'success') {
    snackbar.text = text;
    snackbar.color = color;
    snackbar.open = true;
}

async function loadAll() {
    loadError.value = false;
    try {
        const tasks = [casesStore.fetchCases()];
        if (canManage.value) {
            tasks.push(casesStore.fetchAssistants());
        }
        await Promise.all(tasks);
    } catch {
        loadError.value = true;
    }
}

function openCreate() {
    createOpen.value = true;
}

function openEdit(item) {
    selectedCase.value = item;
    editOpen.value = true;
}

function openDelete(item) {
    selectedCase.value = item;
    deleteOpen.value = true;
}

function onCreated() {
    notify('Case created.');
}

function onUpdated() {
    notify('Case updated.');
}

function onDeleted() {
    notify('Case deleted.');
}

function onDeleteError(message) {
    notify(message, 'error');
}

onMounted(loadAll);
</script>

<style scoped>
.dashboard-bg {
    background-color: #f5efe6;
    min-height: 100vh;
}
</style>
