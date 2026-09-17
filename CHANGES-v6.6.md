# Painel Mídia — Relatório de Alterações (v6.5 → v6.6)

## Regra seguida

Adicionar antes de remover. Corrigir antes de substituir. Otimizar antes de simplificar.
**Nenhuma rádio, recurso ou funcionalidade foi removida.**

---

## 1. Bugs críticos corrigidos

### 1.1 — Status de rádios favoritadas nunca atualizava

`setStatus(id, text)` sempre prefixava `'status-' + id`. Mas `renderFavoritos()` já passava o ID completo (`'status-fav-total_hits'`), resultando em `'status-status-fav-total_hits'` — elemento que não existe. O status de uma rádio favoritada nunca era atualizado quando tocada pelo card de favoritos.

**Correção:** `setStatus` agora detecta se o ID já começa com `'status-'` e não duplica o prefixo.

### 1.2 — Stop pelo Media Session (fone Bluetooth / tela de bloqueio) não parava a biblioteca

O handler `stop` registrado em `setRadioMediaSession` apontava para `stopRadio()`, que não chama `stopLibrary()`. Se o usuário estivesse ouvindo uma faixa da biblioteca e mandasse "Stop" pelo controle do fone Bluetooth ou pela tela de bloqueio, **a biblioteca continuava tocando**.

**Correção (dupla):**
- `stopRadio()` agora chama `stopLibrary(false)` no início.
- Ambos os handlers `Media Session` (`setRadioMediaSession` e `setLibraryMediaSession`) agora apontam para `stopAllMedia`.

### 1.3 — `safe-area-inset-bottom` sem fallback em navegadores antigos

`--safe-bottom: env(safe-area-inset-bottom, 0px);` sem declaração de fallback. Em navegadores que não parseiam `env()` (iOS < 11.2, Android < 69, Firefox antigo), a declaração inteira é descartada. `var(--safe-bottom)` fica indefinido, `calc(120px + var(--safe-bottom))` vira inválido, e **todo o `padding-bottom` do body é descartado**. Resultado: no Moto X / Android 6, o mini-player cobria o último conteúdo da página.

**Correção:** `--safe-bottom: 0px;` declarado primeiro, depois `--safe-bottom: env(safe-area-inset-bottom, 0px);` sobrescreve em navegadores compatíveis.

### 1.4 — `:has()` com seletor malformado e sem suporte no Safari 9

`.media-item :has(.radio-btn.playing)` — seletor com espaço extra (significado diferente do pretendido), sem suporte em Safari 9, Firefox < 121, Chrome < 105. Regra nunca funcionou como destacar visual de "rádio tocando" — o `.radio-btn.playing` já aplica destaque próprio.

**Correção:** regra removida. O destaque continua funcionando via `.radio-btn.playing`.

---

## 2. Bugs importantes corrigidos

### 2.1 — `togglePlayPause` da biblioteca não confirmava reprodução real

O branch da biblioteca em `togglePlayPause()` chamava `libraryAudio.play()` e atualizava a UI imediatamente se `play()` não retornasse Promise. Se o áudio falhasse silenciosamente, a UI mostrava "tocando" mesmo assim.

**Correção:** mesmo padrão do branch da rádio — registra evento `playing` como confirmação real, mantém `.then()/.catch()` como caminho secundário quando disponível.

### 2.2 — `clearRadioUi` apagava status da biblioteca e de favoritos

`document.querySelectorAll('[id^="status-"]')` pegava `status-total_hits`, `status-fav-*` e `status-lib-*` juntos. Ao trocar de rádio, apagava status da biblioteca (que continuava tocando ou em fila).

**Correção:** seletor restrito a `.radio-btn .status` — apenas status pertencentes a cards de rádio.

### 2.3 — `detectLiteHardware` só pegava iOS 9

iOS 10 e iOS 11 também têm WebKit problemático para HLS.js. Um iPhone 5 com iOS 10 ficava fora do modo econômico.

**Correção:** detecção ampliada para iOS 9, 10 e 11. `isLegacyIOSWebKit()` (que bloqueia HLS.js) continua restrito a iOS 9, porque iOS 10/11 suportam HLS nativo.

### 2.4 — Polling de metadata da Total Hits dobrava requisições quando principal falhava

A cada ciclo de 15s, se `/api/totalhits-streaminfo.json` falhasse (rewrite quebrado, timeout, 404), o código disparava imediatamente `/api/totalhits-status.xsl`. Resultado: 2 XHRs por ciclo em dispositivo legacy.

**Correção:** contador de falhas consecutivas. O fallback só dispara a cada 4 ciclos (1 minuto), ou imediatamente se a falha for do tipo `http` (mais provável de ser persistente). Timeout não dispara fallback — só aguarda próximo ciclo.

### 2.5 — `radioAudioPool` removida; proteção real mantida via token

A pool nunca continha mais de 1 elemento. Era código morto. Removida.

**Proteção real contra áudio fantasma** mantida por:
1. `radioController.token` — já existia e funciona.
2. `safeStopAudio()` chamado explicitamente antes de trocar `src` no mesmo `Audio`.

### 2.6 — `new Audio()` criado a cada troca de rádio

`cleanupRadio()` seta `radioAudio = null`, então `createRadioAudio()` sempre criava um novo `Audio`. Em Safari iOS 9, objetos `Audio` abandonados mantêm conexão de rede aberta por alguns segundos.

**Correção:** um único `Audio` global, criado uma vez. Reutilizado em todas as trocas. `safeStopAudio()` limpa o estado antes de novo `src`.

---

## 3. Bugs pequenos corrigidos

### 3.1 — `loadYouTubePlaylist` passava `videoId` junto com `listId`

Parâmetros conflitantes no `YTLib.Player`. Comportamento dependia da versão da IFrame API.

**Correção:** quando `listId` é passado, `videoId` não é passado.

### 3.2 — `xhrJson` ignorava o segundo argumento (tipo de erro)

Todos os callers usavam `function (data)` sem o segundo argumento. Erros diferentes (timeout, http, json, open) eram tratados igualmente.

**Correção:** `pollTotalHitsNowPlaying` agora usa o segundo argumento para decidir entre aguardar, tentar fallback ou desistir.

---

## 4. O que foi PRESERVADO integralmente

- Todas as 21 rádios do `RADIO_CHANNELS`, incluindo **Total Hits**, **Continental**, Progressive, Trance, Techno, Reiki, etc.
- Stream da Total Hits (`https://eu8.fastcast4u.com/proxy/breaktroy?mp=/stream`) inalterado.
- Stream da Continental inalterado.
- YouTube: todos os presets preservados (exceto Chuva + Piano, já removido na v6.5).
- Biblioteca, favoritos, histórico, busca, Sleep Timer, volume/mute, temas, PWA, Media Session, Chromecast, diagnóstico YouTube, backup/importação.
- `localStorage` — todas as chaves preservadas, sem migração forçada.
- Design moderno (glassmorphism, gradientes, temas de cor).

---

## 5. Compatibilidade validada estaticamente

- Núcleo ES5 preservado (sem `const`, `let`, arrow functions no caminho crítico).
- Polyfills mantidos para `Promise`, `Array.prototype.includes/findIndex`, `String.prototype.padStart`, `Number.isFinite`, `Array.from`, `Element.prototype.remove/append`, `Object.assign`.
- `play()` protegido com `typeof p.then === 'function'` em todos os caminhos.
- HLS nativo preferido no iOS legado; HLS.js não carregado em iOS 9.
- safe-area com fallback de declaração.
- Sem `:has()`.

---

## 6. O que depende de teste real em dispositivo / serviço externo

Não é possível validar a partir do código entregue (sem acesso à rede ou dispositivos físicos):

1. Se o rewrite do Vercel para `/api/totalhits-streaminfo.json` responde corretamente em produção.
2. Comportamento real no iPad 3 / iOS 9.3.5 e Moto X 2ª geração.
3. Disponibilidade contínua dos streams de terceiros (Continental, Salamanca, laut.fm, somaFM, Radio Paradise etc.).
4. Se ícones `icons/icon-192.png` e `icons/icon-512.png` existem no repositório (o PWA precisa deles).

---

## 7. Como aplicar

1. Substituir no repositório: `index.html`, `sw.js`, `vercel.json`, `manifest.webmanifest`.
2. Garantir que existem: `icons/icon-192.png`, `icons/icon-512.png`.
3. Commit + push.
4. Após deploy da Vercel, forçar recarregamento completo em pelo menos um dispositivo para o novo Service Worker (cache `painel-midia-v66-ui`) assumir.

---

## 8. Comparação com v6.5

| Item | v6.5 | v6.6 |
|---|---|---|
| `setStatus` com prefixo | ❌ | ✅ |
| `stopRadio` para biblioteca | ❌ | ✅ |
| Media Session stop consistente | ❌ | ✅ |
| safe-area fallback | ❌ | ✅ |
| `:has()` | ❌ | ✅ Removido |
| `togglePlayPause` biblioteca | ⚠️ parcial | ✅ |
| `clearRadioUi` amplo | ❌ | ✅ |
| iOS 10/11 no modo lite | ❌ | ✅ |
| Polling duplo Total Hits | ❌ | ✅ |
| `radioAudioPool` | ❌ | ✅ Removido |
| `new Audio()` por troca | ❌ | ✅ Único |
| `loadYouTubePlaylist` | ❌ | ✅ |
| `xhrJson` 2º argumento | ❌ | ✅ |