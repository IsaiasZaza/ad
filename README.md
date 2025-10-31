# Dashboard de Usuários

Um dashboard moderno e responsivo para visualização e gerenciamento de usuários.

## 🚀 Funcionalidades

- **Visualização de Usuários**: Cards elegantes com todas as informações dos usuários
- **Busca Inteligente**: Pesquise por nome, email ou telefone
- **Filtros Avançados**: Filtre por perfil (Admin/Cliente) e status (Ativo/Inativo)
- **Estatísticas**: Visualize estatísticas rápidas sobre os usuários
- **Design Moderno**: Interface moderna com tema escuro e animações suaves
- **Responsivo**: Funciona perfeitamente em desktop, tablet e mobile

## 📋 Como Usar

### Opção 1: Servidor HTTP Local

```bash
npm run serve
```

Isso iniciará um servidor na porta 8080 e abrirá automaticamente no navegador.

### Opção 2: Live Server (VS Code)

Se você usa VS Code, instale a extensão "Live Server" e clique com botão direito no `index.html` e selecione "Open with Live Server".

### Opção 3: Python (se tiver instalado)

```bash
python -m http.server 8000
```

Depois acesse `http://localhost:8000` no navegador.

### Opção 4: Node.js HTTP Server

```bash
npx http-server . -p 8080
```

Acesse `http://localhost:8080` no navegador.

## 🎨 Recursos Visuais

- **Tema Escuro Moderno**: Design com cores vibrantes e elegantes
- **Cards Interativos**: Efeitos hover e animações suaves
- **Ícones SVG**: Ícones vetoriais para melhor qualidade
- **Gradientes**: Backgrounds com gradientes modernos
- **Animações**: Transições suaves em todos os elementos

## 📊 Dados Exibidos

Cada card de usuário exibe:
- Nome completo
- Email
- Telefone
- Perfil (Admin/Cliente)
- Status (Ativo/Inativo)
- Data de criação
- Último login
- Status de verificação 2FA

## 🔍 Filtros Disponíveis

- **Busca**: Digite qualquer texto para buscar em nome, email ou telefone
- **Perfil**: Filtre por Administrador ou Cliente
- **Status**: Filtre por usuários Ativos ou Inativos

## 📱 Responsividade

O dashboard é totalmente responsivo e se adapta a:
- Desktop (4+ colunas)
- Tablet (2-3 colunas)
- Mobile (1 coluna)

## 🛠️ Tecnologias

- HTML5
- CSS3 (com variáveis CSS e Grid/Flexbox)
- JavaScript ES6+ (Módulos ES6)
- Google Fonts (Inter)

## 📝 Notas

- Os dados são carregados diretamente do arquivo `users.json`
- Não requer instalação de dependências para funcionar
- Funciona em todos os navegadores modernos

