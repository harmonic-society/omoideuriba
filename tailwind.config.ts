import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // レトロポップなカラーパレット
        retro: {
          pink: '#FF6B9D',
          yellow: '#FFE66D',
          blue: '#4ECDC4',
          purple: '#C7CEEA',
          orange: '#FFA07A',
          mint: '#98D8C8',
          lavender: '#B4A7D6',
          peach: '#FFB5A7',
        },
        vintage: {
          cream: '#F7F3E9',
          brown: '#8B6F47',
          darkgreen: '#5F7161',
        }
      },
      fontFamily: {
        retro: ['"M PLUS Rounded 1c"', 'sans-serif'],
        pixel: ['"DotGothic16"', 'sans-serif'],
      },
      boxShadow: {
        'retro': '4px 4px 0px 0px rgba(0,0,0,0.25)',
        'retro-hover': '6px 6px 0px 0px rgba(0,0,0,0.25)',
      },
      borderRadius: {
        'retro': '12px',
      }
    },
  },
  plugins: [],
};

export default config;
