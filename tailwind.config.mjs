/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx,vue,svelte}'],
    theme: {
        extend: {
            colors: {
                brand: {
                    DEFAULT: '#24d1f8',
                    dark: '#1b96b4',
                },
            },
            fontFamily: {
                sans: ['system-ui', 'sans-serif'],
                display: ['system-ui', 'sans-serif'],
            },
        },
    },
    plugins: [],
};
