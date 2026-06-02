import { defineStore }  from 'pinia';
import api              from '../services/api';
import { ROLES }        from '../constants/cases';

const STORAGE_KEY = 'vj.auth';

function readStored() {
    const raw =
        localStorage.getItem(STORAGE_KEY) || sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    try {
        return JSON.parse(raw);
    } catch {
        return null;
    }
}

export const useAuthStore = defineStore('auth', {
    state: () => {
        const stored = readStored();
        return {
            token: stored?.token || null,
            user: stored?.user || null,
        };
    },
    getters: {
        isAuthenticated: (state) => !!state.token,
        isLawyer: (state) => state.user?.role === ROLES.LAWYER,
        isAssistant: (state) => state.user?.role === ROLES.ASSISTANT
    },
    actions: {
        async login({ name, password, remember }) {
            const { data } = await api.post('/auth/login', {
                name,
                password,
                remember,
            });
            this.token = data.token;
            this.user = data.user;

            const payload = JSON.stringify({ token: data.token, user: data.user });
            if (remember) {
                localStorage.setItem(STORAGE_KEY, payload);
                sessionStorage.removeItem(STORAGE_KEY);
            } else {
                sessionStorage.setItem(STORAGE_KEY, payload);
                localStorage.removeItem(STORAGE_KEY);
            }
        },
        logout() {
            this.token = null;
            this.user = null;
            localStorage.removeItem(STORAGE_KEY);
            sessionStorage.removeItem(STORAGE_KEY);
        }
    },
});
