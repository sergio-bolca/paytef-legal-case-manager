<template>
    <v-app-bar flat color="surface" border>
        <v-container class="d-flex align-center" fluid>
            
            <img :src="logoSrc" alt="Vanguardia Jurídica" class="logo" />

            <div class="ml-3">
                <div class="text-subtitle-1 font-weight-medium text-primary">
                    Vanguardia Jurídica
                </div>
                <div class="text-caption text-medium-emphasis mt-n1">
                    Case management
                </div>
            </div>

            <v-spacer />

            <div class="text-right d-none d-sm-block mr-3">
                <div class="text-body-2 font-weight-medium">
                    {{ auth.user?.name }}
                </div>
                <div class="text-caption text-medium-emphasis text-capitalize">
                    {{ auth.user?.role }}
                </div>
            </div>

            <v-avatar color="secondary" size="36" class="mr-3">
                <span class="text-body-2 text-on-primary">
                    {{ initials }}
                </span>
            </v-avatar>

            <v-btn variant="tonal" color="primary" prepend-icon="mdi-logout" @click="onLogout">
                Log out
            </v-btn>

        </v-container>
    </v-app-bar>
</template>

<script setup>
import { computed }     from 'vue';
import { useRouter }    from 'vue-router';
import { useAuthStore } from '../../stores/auth';

const auth = useAuthStore();
const router = useRouter();

const logoSrc = '/favicon.svg';

const initials = computed(() => {
    const name = auth.user?.name || '';
    return name.slice(0, 1).toUpperCase();
});

function onLogout() {
    auth.logout();
    router.push({ name: 'login' });
}
</script>

<style scoped>
.logo {
    width: 32px;
    height: 32px;
}
</style>