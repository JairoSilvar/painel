# Painel Mídia v6.8.0 — Legacy Engine

Foco: iPad 3 (2012), iOS 9.3.5/9.3.6 e Safari 9.

- Mantém RADIO_CHANNELS e o visual existente.
- Adiciona bootstrap ES5 independente antes do núcleo principal.
- Captura erros JavaScript e mostra a etapa diretamente no iPad.
- Expõe os handlers globais antes da inicialização do DOM.
- Evita declaração de função em bloco no polyfill de Promise, reduzindo risco no WebKit legado.
- Mantém o motor de mídia e as correções da v6.7.x.
- Service Worker atualizado para cache `painel-midia-v680-ui`.

No iPad, o painel inferior deve indicar uma destas etapas:
BOOT OK → POLYFILLS OK → CONTROLES EXPORTADOS → DOM OK/INIT DOM → PORTAL PRONTO/CONTROLES OK.
Se parar antes disso, a própria tela mostrará a etapa/erro.
