import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  i18n: {
    locales: ['en', 'it', 'de'], // idiomas suportados
    defaultLocale: 'en',         // idioma padrão
  },
}

export default nextConfig
