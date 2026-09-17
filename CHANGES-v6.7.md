# Painel Mídia — Relatório de Alterações (v6.6.1 → v6.7)

## Regra seguida

Adicionar antes de remover. Corrigir antes de substituir. Otimizar antes de simplificar.
**Nenhuma rádio, recurso ou funcionalidade foi removida.**

---

## 1. Restaurado (perdido na v6.5)

### 1.1 — 7 presets do YouTube
- ✨ Reiki — Meditação (`Leob7Fv1ibM`)
- 🌿 Reiki — 432Hz / 111Hz (`4AGrxBGEo7o`)
- 🌊 Reiki + Natureza (`x7e2Dm5WdNg`)
- 😴 Reiki — Sono & Relaxamento (`nTnW0copqhI`)
- 🎹 Piano Instrumental — 1 hora (`2kegDq_YB7o`)
- 🎼 Instrumental Calmante — 1 hora (`dOOJW-F7Sx0`)
- 🌙 Piano Healing — 1 hora (`F0opURoKM6w`)

Total de presets: 15.

### 1.2 — Categoria "Instrumental / Acalmar"
Adicionada ao select `yt-categoria`.

---

## 2. Metadata Total Hits — agora com 3 camadas redundantes

### Camada 1 — `streaminfo.js` oficial + MutationObserver
`<script src="https://eu8.fastcast4u.com/system/streaminfo.js">` carregado dinamicamente + `<span class="cc_streaminfo" data-username="breaktroy">` oculto no DOM. Observer detecta mudanças e atualiza a UI.

### Camada 2 — `status-json.xsl` direto (sem rewrite da Vercel)
Consulta direta via XHR a `https://eu8.fastcast4u.com/proxy/breaktroy/status-json.xsl`.

### Camada 3 — RPC atual (`/api/totalhits-streaminfo.json`)
Mantido como terceira opção. Continua funcionando quando o rewrite da Vercel está OK.

**Resultado:** se qualquer uma funcionar, a metadata aparece. Se todas falharem, mantém a última válida — **nunca mostra "Indisponível"**.

---

## 3. Enriquecimento via iTunes

Nova função `enrichTrack(artist, title)` consulta a iTunes Search API e extrai:
- Artista
- Título
- Ano
- Gênero
- Álbum
- Capa (600×600)

**Sem link de compra.** Nenhum botão "Comprar" ou "Ouvir no Spotify/Apple Music".

Cache em `localStorage` (chave `portal-track-cache-v1`) — só consulta uma vez por faixa.

---

## 4. Capa no mini-player e Media Session

- `<img id="mini-cover">` mostra a capa do álbum no mini-player.
- Media Session envia `artwork: [{ src, sizes: '600x600' }]`.
- Fallback: ícone padrão quando sem capa.

---

## 5. Reconexão automática com backoff exponencial

Nova função `scheduleRetry(reason)`:
- 3s → 6s → 12s → 24s → 30s (máximo)
- Dispara em `stalled`, `error`, `online`
- Respeita pausa intencional e estado offline
- Coexiste com o retry atual (que tenta próxima URL da lista)

---

## 6. Status bar no topo

Elemento dinâmico no header:
- `● TRANSMITINDO AO VIVO` (verde) quando tocando
- `○ RECONEXÃO` (amarelo) durante retry
- `● SEM INTERNET` (vermelho) quando offline
- `○ PRONTO` (cinza) quando idle/pausado

---

## 7. Identidade visual Total Hits

- Logo **TH** (SVG próprio) no header, no lugar do emoji 🎧.
- Favicon e apple-touch-icon usam a logo.
- Novo tema de cor **"Neon"** (verde `#00ffa6`) disponível em ◐ Aparência.
- Padrão continua sendo **Violeta** (usuário escolhe).

---

## 8. Visual Dashboard Moderno

### Cards grandes (formato quadrado 1:1) para rádios