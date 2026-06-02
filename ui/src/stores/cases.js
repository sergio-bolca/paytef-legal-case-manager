import { defineStore }  from 'pinia';
import api              from '../services/api';

export const useCasesStore = defineStore('cases', {
    state: () => ({
        items: [],
        assistants: [],
        loading: false,
        error: null,
    }),
    actions: {
        async fetchCases() {
            this.loading = true;
            this.error = null;
            try {
                const { data } = await api.get('/cases');
                this.items = data.data;
            } catch (err) {
                this.error = err;
                throw err;
            } finally {
                this.loading = false;
            }
        },
        async fetchAssistants() {
            const { data } = await api.get('/users/assistants');
            this.assistants = data.data;
            return this.assistants;
        },
        async createCase(payload) {
            const { data } = await api.post('/cases', payload);
            this.items.push(data.data);
            return data.data;
        },
        async updateCase(id, payload) {
            const { data } = await api.patch(`/cases/${id}`, payload);
            const idx = this.items.findIndex((c) => c.id === id);
            if (idx !== -1) this.items.splice(idx, 1, data.data);
            return data.data;
        },
        async deleteCase(id) {
            await api.delete(`/cases/${id}`);
            this.items = this.items.filter((c) => c.id !== id);
        }
    }
});