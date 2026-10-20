# MelodyPlayer

Um player de música desktop moderno construído com Electron, inspirado na arquitetura do Spotify, mas com implementação original e código próprio.

## 🎵 Recursos

- **Interface Moderna**: Design escuro e responsivo inspirado em plataformas de streaming
- **Player de Áudio Completo**: Controles de play/pause, próximo/anterior, shuffle e repeat
- **Sistema de Biblioteca**: Organização de músicas por álbuns, artistas e faixas
- **Playlists Personalizadas**: Crie e gerencie suas próprias playlists
- **Busca Inteligente**: Encontre músicas por título, artista ou álbum
- **Favoritos**: Marque suas músicas favoritas
- **Controle de Volume**: Ajuste de volume com controle deslizante
- **Barra de Progresso**: Navegue pela música arrastando a barra de progresso
- **Aplicativo Desktop**: Executa nativamente em Windows, macOS e Linux

## 🚀 Como Usar

### Opção 1: Executar com npm (Desenvolvimento)

```bash
cd music-player
npm install
npm start
```

### Opção 2: Construir Executável (Distribuição)

```bash
cd music-player
npm install
npm run build:win    # Para Windows
npm run build:mac    # Para macOS
npm run build:linux  # Para Linux
```

O executável será gerado na pasta `dist/`.

## 📁 Estrutura do Projeto

```
music-player/
├── index.html      # Estrutura HTML da aplicação
├── styles.css      # Estilos e design responsivo
├── app.js          # Lógica JavaScript do player
└── README.md       # Documentação
```

## 🎨 Recursos da Interface

### Sidebar
- Navegação entre seções (Início, Biblioteca, Playlists, Buscar)
- Lista de playlists personalizadas
- Botão para criar novas playlists

### Player Bar
- Informações da música atual (título, artista, capa)
- Controles de reprodução (play/pause, anterior, próximo)
- Controles de shuffle e repeat
- Barra de progresso interativa
- Controle de volume

### Seções
- **Início**: Músicas reproduzidas recentemente e recomendações
- **Biblioteca**: Todas as músicas organizadas com filtros
- **Playlists**: Grade de playlists personalizadas
- **Buscar**: Busca por músicas, artistas ou álbuns

## 🔧 Tecnologias Utilizadas

- HTML5
- CSS3 (com variáveis CSS e Flexbox/Grid)
- JavaScript ES6+ (Classes, arrow functions, template literals)
- Web Audio API (para reprodução de áudio)

## 📝 Notas de Implementação

Este projeto foi desenvolvido como um estudo de arquitetura inspirado no Spotify, mas com código original. Algumas características notáveis:

- **Arquitetura baseada em classes**: O player é implementado como uma classe JavaScript para melhor organização
- **Separação de responsabilidades**: HTML para estrutura, CSS para estilo, JS para lógica
- **Design responsivo**: Interface que se adapta a diferentes tamanhos de tela
- **Variáveis CSS**: Para fácil manutenção e consistência visual
- **Event delegation**: Manipulação eficiente de eventos em elementos dinâmicos

## 🔮 Próximas Melhorias

- [ ] Integração com arquivos de áudio locais
- [ ] Persistência de dados (localStorage)
- [ ] Suporte a múltiplos formatos de áudio
- [ ] Visualizador de áudio
- [ ] Modo tela cheia
- [ ] Atalhos de teclado
- [ ] Suporte a drag-and-drop

## 📄 Licença

Este projeto é fornecido sob a licença MIT. Sinta-se livre para usar, modificar e distribuir conforme necessário.

## 📦 Fazer Upload no GitHub

Para instruções detalhadas de como fazer upload deste projeto no GitHub, consulte o arquivo [GITHUB.md](GITHUB.md).

## 🙏 Agradecimentos

Inspiração arquitetural obtida através de análise defensiva do Spotify usando REA (Reverse Engineer Anything) para fins educacionais de engenharia reversa.
