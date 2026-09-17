/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        /** 文字 - 引用 token 系统 */
        t: {
          primary: 'var(--color-text-primary)',
          secondary: 'var(--color-text-secondary)',
          tertiary: 'var(--color-text-soft)',
          disable: 'var(--color-text-muted)'
        },
        /** 边框 - 引用 token 系统 */
        b: {
          dark: 'var(--border-strong)',
          md: 'var(--border-subtle)',
          light: 'var(--border-soft)'
        },
        /** 填充/背景 - 引用 token 系统 */
        fill: {
          dark: 'var(--color-page-bg-secondary)',
          light: 'var(--color-page-bg)'
        },
        /** 页面背景 - 引用 token 系统 */
        page: {
          bg: 'var(--color-page-bg)'
        },
        /** 表面 - 引用 token 系统 */
        surface: {
          base: 'var(--color-surface-base)',
          elevated: 'var(--color-surface-elevated)',
          muted: 'var(--color-surface-muted)'
        },
        /** 品牌色 - 引用 token 系统 */
        brand: {
          primary: 'var(--color-brand-primary)',
          link: 'var(--color-brand-link)'
        },
        /** 强调色 - 引用 token 系统 */
        accent: {
          cyan: 'var(--color-accent-cyan)',
          pink: 'var(--color-accent-pink)',
          purple: 'var(--color-accent-purple)',
          yellow: 'var(--color-accent-yellow)',
          orange: 'var(--color-accent-orange)',
          gold: 'var(--color-accent-gold)'
        },
        /** 状态色 - 引用 token 系统 */
        status: {
          success: 'var(--color-success)',
          warning: 'var(--color-warning)',
          danger: 'var(--color-danger)'
        },
        /** 玻璃态 - 引用 token 系统 */
        glass: {
          bg: 'var(--glass-bg)',
          border: 'var(--glass-border)'
        },
        /** 边框 - 引用 token 系统 */
        border: {
          subtle: 'var(--border-subtle)',
          soft: 'var(--border-soft)',
          strong: 'var(--border-strong)'
        },
        /** 阴影 - 引用 token 系统 */
        shadow: {
          card: 'var(--shadow-sm)'
        },
        /** Focus - 引用 token 系统 */
        focus: {
          ring: 'var(--focus-ring)'
        }
      },
      fontSize: {
        /** 字号 - 引用 token 系统 */
        body: 'var(--text-body-size)',
        caption: 'var(--text-caption-size)',
        h1: 'var(--heading-1-size)',
        h2: 'var(--heading-2-size)',
        h3: 'var(--heading-3-size)',
        h4: 'var(--heading-4-size)'
      },
      borderRadius: {
        xs: 'var(--radius-xs)',
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
        '2xl': 'var(--radius-2xl)',
        '3xl': 'var(--radius-3xl)',
        '4xl': 'var(--radius-4xl)',
        '5xl': 'var(--radius-5xl)',
        pill: 'var(--radius-pill)'
      },
      screens: {
        xs: '480px',
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px'
      },
      spacing: {
        /** 间距 - 引用 token 系统 */
        token: 'var(--space-1)',
        0.5: '6px',
        1: '10px',
        1.5: '12px',
        2: '14px',
        2.5: '16px',
        3: '18px',
        3.5: '20px',
        4: '22px',
        5: '24px',
        5.5: '26px',
        6: '28px',
        7: '34px',
        8: '42px',
        9: '60px',
        10: '100px',
        11: '200px'
      },
      minWidth: {
        34: '34px',
        44: '44px',
        110: '110px',
        220: '220px'
      },
      minHeight: {
        34: '34px',
        44: '44px'
      }
    }
  },
  plugins: []
}
