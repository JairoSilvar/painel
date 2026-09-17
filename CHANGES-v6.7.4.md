# Painel Mídia — Relatório de Alterações (v6.7.3 → v6.7.4)

## Regra seguida
Adicionar antes de remover. Corrigir antes de substituir. Otimizar antes de simplificar.

Esta é uma versão cirúrgica de estabilização. CSS, layout e `RADIO_CHANNELS` não foram alterados.

## 1. Reconexão automática
- `scheduleRetry()` agora chama `playChannel(..., true)` em modo de reconexão.
- A reconexão não cai no atalho de play/pause da mesma rádio.
- O contador de backoff é preservado durante a tentativa automática.
- O backoff só é zerado após reprodução confirmada (`markPlaying`) ou numa nova ação normal do usuário.

## 2. Parada segura da biblioteca
- `stopLibrary()` passa a limpar handlers e usar `safeStopAudio()`.
- Rádio e biblioteca usam a mesma rotina básica de pause + remoção de `src` + `load()`.

## 3. Token como autoridade contra callbacks antigos
- Removido `__portalInvalid`.
- Callbacks de rádio são validados pelo token de `radioController`, canal atual e instância de áudio.
- Mantido um único `Audio` reutilizável para rádios.

## 4. Circuit breaker da metadata Total Hits
- Mantidas as camadas existentes de metadata.
- Após 3 ciclos consecutivos sem metadata válida, as consultas XHR entram em pausa por 60 segundos.
- A ponte oficial `streaminfo.js` continua independente e pode atualizar a UI durante esse período.
- Ao sair/parar a Total Hits, o estado do circuit breaker é limpo.

## 5. Sincronização da faixa
- `renderTrackInfo()` também sincroniza o subtítulo da barra superior quando a Total Hits está tocando.
- Mini-player, barra superior e Media Session continuam compartilhando os dados enriquecidos da faixa.

## 6. Versões/cache
- `version-tag`: v6.7.4.
- Changelog interno: nova entrada v6.7.4.
- Service Worker: `painel-midia-v674-ui`.

## 7. Validação estática executada
- JavaScript inline: `node --check` sem erro.
- `sw.js`: `node --check` sem erro.
- `vercel.json` e `manifest.webmanifest`: JSON válido.
- Confirmada ausência de `__portalInvalid`.
- Confirmada ausência de `radioAudioPool`.
- Confirmada ausência de `:has(`.
- Confirmada ausência de `.play().then` direto.
- Confirmada ausência do vídeo removido `pL14qTbM3ng`.

## 8. Teste real recomendado após deploy
Executar em dispositivo/navegador real:

Rádio A → Rádio B → YouTube → Biblioteca → Total Hits → Stop → Continental → Stop → Total Hits.

Critério: nunca existir mais de uma mídia ativa, nenhum áudio fantasma e nenhum callback antigo reassumir o player.
