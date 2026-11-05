/** @type {import('tailwindcss').Config} */
module.exports = {
  daisyui: {
    darkTheme: false,
  },
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '2rem',
        lg: '4rem',
        xl: '5rem',
        '2xl': '6rem',
      },
    },
    extend: {
      /* ── Brand Colours ─────────────────────────────── */
      colors: {
        brand: {
          navy:       '#0A0A0A', // Jet Black Canvas
          'navy-deep':'#121212', // Jet Black Card Surface
          'navy-light':'#1C1C1C', // Elevated Jet Black
          royal:      '#171717', // High-Contrast Jet Black Frame
          gold:       '#FDC800', // Vivid Neobrutalism Yellow
          champagne:  '#FEF08A', // Pale Yellow Accent
          electric:   '#FDC800', // High-Contrast Action Yellow
          neon:       '#FFE500', // Neon Bright Yellow
          graphite:   '#141414',
          titanium:   '#1E1E1E',
          steel:      '#262626',
          white:      '#FFFFFF',
          sakura:     '#FF6B9D',
          purple:     '#432DD7', // Neobrutalism Secondary Violet
          teal:       '#16A34A', // Neobrutalism Success Green
        },
        /* ── Official Neobrutalism Tokens ────────────── */
        neo: {
          primary:   '#FDC800',
          secondary: '#432DD7',
          success:   '#16A34A',
          warning:   '#D97706',
          danger:    '#DC2626',
          surface:   '#FBFBF9',
          text:      '#1C293C',
          neutral:   '#FBFBF9',
        }
      },

      /* ── Typography Scale (13/15/17/21/27/35) ──────── */
      fontSize: {
        'neo-xs':   ['0.8125rem', { lineHeight: '1.2' }], // 13px (label-caps)
        'neo-sm':   ['0.9375rem', { lineHeight: '1.4' }], // 15px (body-md)
        'neo-base': ['1.0625rem', { lineHeight: '1.5' }], // 17px
        'neo-lg':   ['1.3125rem', { lineHeight: '1.4' }], // 21px
        'neo-xl':   ['1.6875rem', { lineHeight: '1.3' }], // 27px
        'neo-2xl':  ['2.1875rem', { lineHeight: '1.2' }], // 35px (h1)
      },

      /* ── Typography ────────────────────────────────── */
      fontFamily: {
        heading: ['Orbitron', 'sans-serif'],
        sub:     ['Rajdhani', 'sans-serif'],
        body:    ['Inter', 'sans-serif'],
        mono:    ['JetBrains Mono', 'monospace'],
      },

      /* ── Border Radius ─────────────────────────────── */
      borderRadius: {
        'neo-sm': '4px',
        'neo-md': '8px',
        'neu-sm': '8px',
        'neu-md': '12px',
        'neu-lg': '16px',
        'neu-xl': '24px',
      },

      /* ── Neumorphic + Brand Shadows ────────────────── */
      boxShadow: {
        // Neumorphic raised
        'neu':         '8px 8px 20px #050a15, -8px -8px 20px #0d1e3d',
        'neu-sm':      '4px 4px 10px #050a15, -4px -4px 10px #0d1e3d',
        'neu-lg':      '12px 12px 30px #050a15, -12px -12px 30px #0d1e3d',
        // Neumorphic inset (pressed)
        'neu-inset':   'inset 4px 4px 10px #050a15, inset -4px -4px 10px #0d1e3d',
        'neu-inset-sm':'inset 3px 3px 6px #050a15, inset -3px -3px 6px #0d1e3d',
        // Gold glow
        'glow-gold':   '0 0 20px rgba(214,168,79,0.3)',
        'glow-gold-lg':'0 0 40px rgba(214,168,79,0.25), 0 0 80px rgba(214,168,79,0.1)',
        // Blue glow
        'glow-blue':   '0 0 20px rgba(46,124,246,0.3)',
        'glow-blue-lg':'0 0 40px rgba(46,124,246,0.25), 0 0 80px rgba(46,124,246,0.1)',
        // Purple glow (anime)
        'glow-purple': '0 0 20px rgba(139,92,246,0.3)',
        // Sakura glow
        'glow-sakura': '0 0 20px rgba(255,107,157,0.3)',
        // Combined neumorphic + glow
        'neu-gold':    '8px 8px 20px #050a15, -8px -8px 20px #0d1e3d, 0 0 25px rgba(214,168,79,0.2)',
        'neu-blue':    '8px 8px 20px #050a15, -8px -8px 20px #0d1e3d, 0 0 25px rgba(46,124,246,0.2)',
      },

      /* ── Animations ────────────────────────────────── */
      animation: {
        'shimmer':         'shimmer 3s linear infinite',
        'glow-pulse':      'glow-pulse 2s ease-in-out infinite',
        'float':           'float 6s ease-in-out infinite',
        'float-slow':      'float 10s ease-in-out infinite',
        'manga-reveal':    'manga-reveal 0.6s cubic-bezier(0.16,1,0.3,1) forwards',
        'slide-up':        'slide-up 0.8s cubic-bezier(0.16,1,0.3,1) forwards',
        'slide-down':      'slide-down 0.4s cubic-bezier(0.16,1,0.3,1) forwards',
        'speed-lines':     'speed-lines 0.5s ease-out',
        'sakura-fall':     'sakura-fall 8s linear infinite',
        'rotate-border':   'rotate-border 4s linear infinite',
        'power-fill':      'power-fill 1.5s ease-out forwards',
        'manga-bounce':    'manga-bounce 0.5s cubic-bezier(0.36,1.4,0.5,1)',
        'fade-in':         'fade-in 0.5s ease-out forwards',
        'pulse-gold':      'pulse-gold 2s ease-in-out infinite',
        'energy-wave':     'energy-wave 3s ease-in-out infinite',
      },
      keyframes: {
        shimmer: {
          '0%':   { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
        'glow-pulse': {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.6' },
        },
        float: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%':      { transform: 'translate(30px, -20px) scale(1.05)' },
          '66%':      { transform: 'translate(-20px, 15px) scale(0.95)' },
        },
        'manga-reveal': {
          '0%':   { clipPath: 'polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%)', opacity: '0' },
          '100%': { clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)', opacity: '1' },
        },
        'slide-up': {
          '0%':   { transform: 'translateY(40px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-down': {
          '0%':   { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'speed-lines': {
          '0%':   { transform: 'scaleX(0)', opacity: '1' },
          '100%': { transform: 'scaleX(1)', opacity: '0' },
        },
        'sakura-fall': {
          '0%':   { transform: 'translate(0, -10vh) rotate(0deg)', opacity: '0' },
          '10%':  { opacity: '1' },
          '90%':  { opacity: '1' },
          '100%': { transform: 'translate(80px, 110vh) rotate(720deg)', opacity: '0' },
        },
        'rotate-border': {
          '0%':   { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'power-fill': {
          '0%':   { width: '0%' },
          '100%': { width: 'var(--power-level, 80%)' },
        },
        'manga-bounce': {
          '0%':   { transform: 'scale(0.3) rotate(-10deg)', opacity: '0' },
          '60%':  { transform: 'scale(1.1) rotate(2deg)' },
          '100%': { transform: 'scale(1) rotate(0deg)', opacity: '1' },
        },
        'fade-in': {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'pulse-gold': {
          '0%, 100%': { boxShadow: '0 0 15px rgba(214,168,79,0.2)' },
          '50%':      { boxShadow: '0 0 30px rgba(214,168,79,0.4)' },
        },
        'energy-wave': {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.6' },
          '50%':      { transform: 'scale(1.3)', opacity: '0.2' },
        },
      },

      /* ── Background Images ─────────────────────────── */
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":  "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "gradient-gold":   "linear-gradient(135deg, #FDC800, #FFE266)",
        "gradient-blue":   "linear-gradient(135deg, #2E7CF6, #4DA3FF)",
        "gradient-royal":  "linear-gradient(135deg, #071329, #123C83)",
        "gradient-anime":  "linear-gradient(135deg, #2E7CF6, #8B5CF6)",
        "speed-lines":     "repeating-linear-gradient(-45deg, transparent, transparent 8px, rgba(46,124,246,0.03) 8px, rgba(46,124,246,0.03) 9px)",
      },
    },
  },
  plugins: [require("daisyui")],
};
