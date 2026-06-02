import 'vuetify/styles';
import '@mdi/font/css/materialdesignicons.css';

import { createVuetify } from 'vuetify';
import { aliases, mdi } from 'vuetify/iconsets/mdi';

const vanguardiaTheme = {
    dark: false,
    colors: {
        background: '#f5efe6',
        surface: '#fbf7f0',
        'surface-variant': '#efe6d6',
        primary: '#5b3a1e',
        secondary: '#8a6a3b',
        accent: '#a67b3e',
        error: '#9b2c2c',
        info: '#3f6b8a',
        success: '#4a7c4a',
        warning: '#b88a2a',
        'on-primary': '#fbf7f0',
        'on-surface': '#2b1d10',
        'on-background': '#2b1d10'
    }
};

export default createVuetify({
    icons: {
        defaultSet: 'mdi',
        aliases,
        sets: { mdi },
    },
    theme: {
        defaultTheme: 'vanguardiaTheme',
        themes: { vanguardiaTheme },
    },
    defaults: {
        VBtn: { rounded: 'sm', class: 'text-none' },
        VTextField: { variant: 'outlined', density: 'comfortable' },
        VSelect: { variant: 'outlined', density: 'comfortable' },
        VTextarea: { variant: 'outlined', density: 'comfortable' },
        VCard: { rounded: 'lg' },
    }
});
