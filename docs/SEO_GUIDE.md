SEO Guide — quick checklist

1) Verificação local com Lighthouse
- Abra o site (rodando via `npm run dev` ou build estático).
- No Chrome: Acesse DevTools → Lighthouse → Run audits (Performance, Accessibility, Best practices, SEO).
- Ou execute via CLI:

```bash
npx http-server . -p 8080   # servir build/static
npx lighthouse http://localhost:8080 --output html --output-path ./lighthouse-report.html
```

2) Google Search Console
- Adicione e verifique a propriedade (domínio ou preferida).
- Envie `https://SEU_DOMINIO/sitemap.xml` em "Sitemaps".
- Verifique erros de cobertura e indexação.

3) Robots / Sitemap
- `public/robots.txt` e `public/sitemap.xml` já adicionados.
- Atualize `sitemap.xml` automaticamente se o site tiver muitas páginas (opcional: gerar via script at build).

4) Structured Data
- JSON-LD principal está em `app/layout.tsx`.
- Teste com Rich Results Test: https://search.google.com/test/rich-results

5) Imagens e `alt`
- Fallbacks de `alt` aplicados; continue adicionando descrições significativas nas imagens que representam conteúdo.
- Use `next/image` para otimização automática.

6) Performance rápida
- Pré-conexões adicionadas para Typekit/Google Fonts.
- `font-display: swap` habilitado via `next/font`.
- Prefetch/preload imagens críticas com `<link rel="preload" as="image" href="/img/home-photo.webp" />` (já adicionado).

7) Submeter e monitorar
- Após deploy, acesse Search Console e envie sitemap.
- Use PageSpeed Insights ou Lighthouse mensalmente.

If you want, I can:
- Add a build-time sitemap generator script.
- Wire up an automatic sitemap publish step in `package.json`.
