# Portal de Mídia Híbrido v6.0

Um único portal para iPad/iPhone antigos, Android antigo e dispositivos modernos. O núcleo do aplicativo foi preparado em sintaxe ES5, com melhorias progressivas para navegadores atuais.

## Compatibilidade
- Núcleo sem `const`, `let` ou arrow functions.
- Fallbacks para APIs JavaScript básicas usadas pelo portal.
- CSS moderno é progressivo e não é requisito para o funcionamento.
- O Service Worker/PWA é opcional e destinado a navegadores atuais; não é requisito para iOS 9.

## Mídia
- Rádio, biblioteca e YouTube são mutuamente exclusivos.
- Pause → Play reutiliza o mesmo elemento de áudio e a mesma estação.
- Trocar de estação invalida o player anterior para evitar áudio fantasma.
- `visibilitychange` não pausa automaticamente o áudio, permitindo continuidade em tela bloqueada quando o navegador/SO suportar.
- HLS prioriza reprodução nativa; HLS.js fica como fallback para navegadores que precisam dele.
- Continental FM e Total Hits permanecem no catálogo.

## Deploy
Suba estes arquivos na raiz do repositório Git conectado ao Vercel.
