# Painel Mídia v6.10.0 — Revisão completa

## 1. Rádio no iPad (prioridade)
- Removida corrida: unlock silencioso **não** grava mais `SILENT_WAV` no mesmo `radioAudio` que toca o stream
- Progressive usa `<source type="audio/mpeg">` quando possível
- Proxy same-origin: `/api/stream/totalhits` → FastCast4U (primeiro da lista Total Hits)
- Diagnóstico de erro com código + tip (rede/decode/formato) + networkState/readyState
- `<audio id="portal-radio-audio">` permanece no DOM

## 2. YouTube no iPad
- Embed clássico `youtube.com/embed` (sem enablejsapi)
- Status claro: “toque no vídeo para iniciar”
- Link de fallback “abrir no YouTube” se o embed for bloqueado
- Overlay de “erro de configuração” evitado no caminho legado

## 3. Android / layout
- `overflow-x: hidden` reforçado em html/body
- `min-width: 0` em flex críticos (header, cards, mini-player)
- `max-width: 100%` em mídia

## 4. Mini-player
- Mantém pin por `visualViewport` (`--vv-bottom`)

## 5. Branding
- Título: **Painel Mídia** (sem “— Total Hits” no h1/title/footer)

## 6. Temas no modo claro
- Classes `html.light-mode.theme-*` com acentos e superfícies legíveis
- `applyColorTheme` aplica cor também com light-mode ativo

## 7. Botão da grade
- Removido do header
- Opção **Densidade: Normal | Compacto** dentro do painel Aparência

## Deploy
- Atualizar `vercel.json` (rewrite `/api/stream/totalhits`)
- Service worker cache: `painel-midia-v610-ui`
- Limpar cache / reabrir PWA após publicar
