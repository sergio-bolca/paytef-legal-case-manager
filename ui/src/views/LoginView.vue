<template>
    <v-app>
        <v-main class="login-bg">
            <v-container class="fill-height" fluid>
                <v-row justify="center" align="center" no-gutters class="w-100">
                    
                    <v-col cols="12" sm="8" md="5" lg="4" xl="3">
                        
                        <div class="text-center mb-6">
                            <img src="/favicon.svg" alt="Vanguardia Jurídica" class="logo" />
                            <div class="text-overline text-secondary mt-2">Law firm</div>
                            <h1 class="text-h4 font-weight-medium text-primary mt-1">
                                Vanguardia Jurídica
                            </h1>
                            <div class="text-body-2 text-medium-emphasis mt-1">
                                Internal case management
                            </div>
                        </div>

                        <v-card elevation="2" class="pa-2">
                            <v-card-title class="text-h6 font-weight-regular pt-4">
                                Sign in
                            </v-card-title>
                            <v-card-text>
                                <v-form ref="formRef" validate-on="submit" @submit.prevent="onSubmit">
                                    <v-text-field v-model="name" label="Name" autocomplete="username"
                                        prepend-inner-icon="mdi-account-outline" :rules="nameRules" autofocus />
                                    <v-text-field v-model="password" label="Password"
                                        :type="showPassword ? 'text' : 'password'" autocomplete="current-password"
                                        prepend-inner-icon="mdi-lock-outline" :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'
                                            " @click:append-inner="showPassword = !showPassword" :rules="passwordRules" />

                                    <v-checkbox v-model="remember" label="Keep me signed in" density="compact"
                                        hide-details class="mt-n2" />

                                    <v-alert v-if="errorMsg" type="error" variant="tonal" density="compact"
                                        class="mt-3">
                                        {{ errorMsg }}
                                    </v-alert>

                                    <v-btn type="submit" color="primary" block size="large" class="mt-4"
                                        :loading="loading">
                                        Sign in
                                    </v-btn>
                                </v-form>
                            </v-card-text>
                        </v-card>

                        <div class="text-caption text-medium-emphasis text-center mt-4">
                            Authorised personnel only.
                        </div>

                    </v-col>

                </v-row>
            </v-container>
        </v-main>
    </v-app>
</template>

<script setup>
import { ref }          from 'vue';
import { useRouter }    from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const auth  = useAuthStore();

const name          = ref('');
const password      = ref('');
const remember      = ref(true);
const showPassword  = ref(false);
const loading       = ref(false);
const errorMsg      = ref('');

const formRef = ref(null);

const nameRules     = [(v) => !!v?.trim() || 'Please enter your name'];
const passwordRules = [(v) => !!v || 'Please enter your password'];

async function onSubmit() {
    errorMsg.value = '';
    const { valid } = await formRef.value.validate();
    if (!valid) return;

    loading.value = true;

    try {
        await auth.login({
            name: name.value.trim(),
            password: password.value,
            remember: remember.value,
        });
        router.push({ name: 'dashboard' });
    } catch (err) {
        if (err.response?.status === 401) {
            errorMsg.value = 'Invalid name or password.';
        } else if (err.response?.status === 400) {
            errorMsg.value = 'Invalid data.';
        } else {
            errorMsg.value = 'Could not reach the server.';
        }
    } finally {
        loading.value = false;
    }
}
</script>

<style scoped>
.login-bg {
    background:
        radial-gradient(circle at 20% 20%, #efe2c9 0%, transparent 60%),
        radial-gradient(circle at 80% 80%, #e9dcc0 0%, transparent 55%),
        #f5efe6;
}

.logo {
    width: 56px;
    height: 56px;
}
</style>