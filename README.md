# Painel Mídia v6.3 — Híbrido / iOS 9

Build revisado para um único portal híbrido: Android, iPhone/iPad antigos e modernos, desktop e navegadores atuais.

## Correções desta revisão

- Núcleo JavaScript compatível com ES5: sem `const`, `let` ou arrow functions.
- Removidos `Map` e `Set` do caminho crítico de inicialização — um `new Map()` no v5.7 podia interromper todo o JavaScript em Safari antigo.
- Removido `replaceWith()` do caminho crítico; usa substituição DOM compatível.
- Eventos `once` do áudio passaram a usar wrapper ES5.
- `addEventListener` com opções `{once/passive}` removido do caminho legacy.
- `matchMedia` usa `addEventListener` quando disponível e `addListener` como fallback.
- `window.location.origin` possui fallback para protocolo + host.
- Parser de URL do YouTube usa elemento `<a>` para maior compatibilidade.
- `scrollIntoView`/`scrollTo` usam chamadas antigas e seguras no caminho legacy.
- iOS 9 e Android antigo entram automaticamente em modo econômico.
- Mini-player reorganizado para telas pequenas, evitando esmagamento/quebra dos controles.
- Rádios continuam usando um único elemento de áudio e token de controle para evitar áudio fantasma.
- YouTube/biblioteca/radio continuam mutuamente exclusivos.
- HLS nativo continua sendo preferido quando o navegador oferece suporte.
- Layout crítico usa fallback flexível em vez de depender de CSS Grid.
- `min()`, `inset` e outros recursos modernos deixaram de ser necessários para o layout básico.
- Service Worker atualizado para a versão 6.1 e com cache de shell em network-first.
- Manifest atualizado para o nome Painel Mídia e orientação `any`.

## Instalação no Git/Vercel

1. Extraia este ZIP.
2. Substitua os arquivos do projeto pelos arquivos desta pasta.
3. Faça commit/push.
4. Aguarde o novo deploy da Vercel.
5. Em dispositivos antigos, faça recarregamento completo depois do primeiro deploy para evitar uma versão antiga do cache.

## Critérios de aceite

### iPad 3 / iOS 9.3.5
- Página abre.
- Botões de rádio respondem.
- Rádio inicia/paralisa pelo mini-player.
- Troca de rádio encerra a anterior.
- YouTube não é obrigatório para o funcionamento das rádios.
- Não deve haver scroll horizontal.

### Celular
- Mini-player permanece dentro da largura da tela.
- Play/pause, parar, mudo e volume ficam acessíveis.
- Nenhum controle deve sobrepor outro.

### Modernos
- Recursos progressivos continuam disponíveis: YouTube, HLS.js quando necessário, PWA, Cast e Media Session quando suportados.

## Observação sobre streams

A compatibilidade do código não garante que um servidor externo de rádio esteja online, aceite HTTPS/CORS ou permaneça disponível. Streams de terceiros devem ser validados separadamente no momento do teste.


## v6.2
- Preserva todas as rádios existentes, incluindo Total Hits.
- Amplia os presets do YouTube com Reiki, meditação e música instrumental calmante.
- Adiciona categoria Instrumental / Acalmar aos vídeos salvos.
- Mantém a reprodução embutida e a exclusividade rádio/YouTube.


## v6.3
- Reintegra “Agora tocando” para Total Hits via FastCast4U, com tentativa por `system/streaminfo.js` e fallback `status-json.xsl`, atualizada a cada 15s.
- Mini-player móvel elevado para evitar sobreposição com a navegação inferior de celulares modernos, preservando safe-area.
- Clima automático via geolocalização + Open-Meteo, com fallback visual e atualização periódica.
- Manifest PWA reforçado com ícones PNG 192/512 e metadados de instalação.
- Adiciona diagnóstico em `/debug`: stream atual, retries, último erro, uptime, agora tocando, estado YouTube e viewport.
- Mantém todas as rádios, incluindo Total Hits, e todos os recursos da v6.2.
