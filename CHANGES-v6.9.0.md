# Painel Mídia v6.9.0 — Media & Cast Foundation

## iPad 3 / Safari iOS 9
- Mantido o Legacy Engine e o diagnóstico visível.
- Parada do elemento Audio evita `load()` no Safari 9, reduzindo interferência no caminho de mídia dependente de gesto.
- HLS continua exclusivamente nativo no Safari 9; HLS.js nunca é carregado nesse caminho.
- Diagnóstico identifica rádio em HLS nativo ou áudio direto.
- YouTube usa iframe direto no iPad 3, sem depender do IFrame API/enablejsapi/origin. O usuário toca no vídeo para iniciar, conforme as restrições históricas do iOS.
- Nenhuma rádio foi removida e `RADIO_CHANNELS` não foi alterado.

## Navegadores modernos
- Google Cast Web Sender continua carregado somente sob demanda.
- Cast de rádio usa Default Media Receiver, stream LIVE, MusicTrack metadata, artwork, estação e informações da faixa quando disponíveis.
- Adicionados RemotePlayer/RemotePlayerController para fundação de controle remoto.
- YouTube NÃO é enviado como URL genérica ao Default Media Receiver. O Portal mantém o player oficial e orienta para Cast do YouTube/app ou transmissão da guia/tela quando o botão não for oferecido pelo iframe.
- Media Session/lock screen recebe artwork e metadata mais completas para rádio, biblioteca e YouTube.

## Preservação
- Total Hits, Continental, todas as rádios, presets YouTube, biblioteca, favoritos, histórico, timer, temas, PWA e exclusividade Rádio ↔ YouTube ↔ Biblioteca permanecem.
- Custom Web Receiver não foi incluído nesta versão porque requer Application ID registrado no Google Cast SDK Developer Console.
