const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
    purge: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.js',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Nunito', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                'nav-blue': '#212C4A',
            },
        },
        screens: {
            'xs': '338px',
            'invite-list-br-2': '437px',
            'sm': '640px',
            'md': '768px',
            'invite-list-br-1': '910px',
            'lg': '1024px',
            'xl': '1280px',
            '2xl': '1536px',
        }
    },

    variants: {
        extend: {
            opacity: ['disabled'],
        },
    },

    plugins: [require('@tailwindcss/forms')],
};
