# Painel Mídia v6.9.1 — Legacy Radio Hardening

## Problema reportado
Links de rádio falhavam ou não abriam de forma confiável em dispositivos antigos (especialmente iPad 3 / Safari iOS 9 e Android ≤ 7).

## Correções profundas no motor de rádio

### 1. Bug crítico no fallback de URLs
Em `failAttempt`, o índice era comparado com `channel.urls.length` (lista original) em vez da lista **ordenada** usada em `tryNextUrl`. Isso podia:
- pular URLs válidas
- ou tentar índices fora da ordem correta em canais com múltiplos endpoints

Agora usa `totalUrls` da lista já ordenada por dispositivo.

### 2. Elemento `Audio` fresco em legado
Safari 9 e WebViews antigas costumam “sujar” o elemento `Audio` após erro de rede ou `MEDIA_ERR_*`.  
Em dispositivos legados:
- a cada falha de tentativa, um **novo** `Audio()` é criado (`createPortalAudio`)
- `playsinline` / `webkit-playsinline` são aplicados
- **nunca** se define `crossOrigin` (quebra Icecast/Shoutcast)

### 3. `safeStopAudio` compatível com Safari 9
- `pause()` + limpa `src`
- **não** chama `load()` no caminho iOS 9/10 (interferia no próximo play ligado a gesto do usuário)
- em navegadores modernos, `load()` continua sendo usado para reset limpo

### 4. Ordenação de URLs por dispositivo
| Dispositivo | Ordem |
|-------------|--------|
| Safari iOS 9/10 | HLS nativo **primeiro** (único caminho confiável para `.m3u8`) |
| Android ≤ 7 | Progressive (mp3/aac) **primeiro** — HLS.js é pesado |
| Modernos | Ordem original do canal |

### 5. HLS no Safari legado
Se `canPlayType('application/vnd.apple.mpegurl')` vier vazio (alguns builds do Safari 9), ainda assim tenta HLS nativo antes de desistir.  
HLS.js **nunca** é carregado no caminho iOS 9.

### 6. Timeouts e atrasos maiores no legado
- timeout de conexão ~60% maior
- intervalo entre tentativas de fallback: 320 ms (legado) vs 180 ms (moderno)
- `canplay` reforça `play()` se o stream chegou mas o áudio ficou pausado

### 7. `togglePlayPause` resiliente
Se o `src` do áudio foi perdido (comum após stop em legado), reabre o canal em vez de falhar silenciosamente.

## O que NÃO mudou
- Lista `RADIO_CHANNELS` (nenhuma rádio removida)
- YouTube, biblioteca, Cast, PWA, temas, favoritos, histórico, timer
- Caminho moderno (HLS.js + Cast) intacto

## Como validar no iPad 3 / Safari 9
1. Abrir o painel — o banner **iPad Legacy v6.9.1** deve aparecer.
2. Tocar em uma rádio progressive (ex.: Total Hits, Continental, Antena 1).
3. Tocar em uma rádio HLS (ex.: Atlântida, 102.3, CBN) — deve usar HLS nativo.
4. Observar o diagnóstico no rodapé: `HLS nativo:` ou `Áudio direto:` + índice da tentativa.

## Notas de infraestrutura
- Streams que só existem em `.m3u8` (sem fallback mp3) dependem 100% do HLS nativo do Safari.
- Alguns servidores de stream bloqueiam por User-Agent ou Referer — isso é limitação do provedor, não do player.
- Service Worker: cache UI atualizado para `painel-midia-v691-ui` (áudio/stream continua **nunca** cacheado).
