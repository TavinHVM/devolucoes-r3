# Sistema de Autenticação - Devoluções R3

## Funcionalidades Implementadas

### 🔐 Login e Autenticação
- Login com email e senha
- Autenticação via JWT (JSON Web Tokens)
- Proteção de rotas com middleware
- Sessão persistente com cookies HTTP-only
- Logout com limpeza de sessão

### 🛡️ Segurança
- Senhas criptografadas com bcrypt
- Tokens JWT com expiração de 24 horas
- Middleware de proteção de rotas
- Cookies seguros (HTTP-only)

## Como Usar

### 1. Criar um Usuário
Para criar um usuário de teste, você pode usar a API `/api/usuarios/create`:

```javascript
const userData = {
  first_name: "Nome",
  last_name: "Sobrenome", 
  email: "email@exemplo.com",
  password: "suasenha",
  role: "administrador", // ou outro role
  user_level: "alto" // ou outro nível
};

fetch('/api/usuarios/create', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(userData)
});
```

### 2. Fazer Login
1. Acesse a página `/login`
2. Digite o email e senha do usuário criado
3. Clique em "Entrar"
4. Você será redirecionado para `/solicitacoes` após login bem-sucedido

### 3. Usuário de Teste Criado
```
Email: admin@teste.com
Senha: 123456
```

## Rotas da API

### POST `/api/usuarios/create`
Cria um novo usuário no sistema.

**Body:**
```json
{
  "first_name": "string",
  "last_name": "string", 
  "email": "string",
  "password": "string",
  "role": "string",
  "user_level": "string"
}
```

### POST `/api/usuarios/login`
Realiza o login do usuário.

**Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "message": "Login realizado com sucesso",
  "user": {
    "id": 1,
    "first_name": "Admin",
    "last_name": "Teste",
    "email": "admin@teste.com",
    "role": "administrador",
    "user_level": "alto"
  },
  "token": "jwt-token-here"
}
```

### POST `/api/usuarios/logout`
Realiza o logout do usuário (limpa cookies).

## Proteção de Rotas

O middleware automaticamente:
- Redireciona usuários não autenticados para `/login`
- Permite acesso livre às rotas `/login` e `/reset-password`
- Verifica a validade do token JWT em todas as outras rotas
- Redireciona `/` para `/login` se não estiver autenticado

## Funções Utilitárias

### `getStoredUser()`
Retorna os dados do usuário logado armazenados no localStorage.

### `getStoredToken()`
Retorna o token JWT armazenado no localStorage.

### `isAuthenticated()`
Verifica se o usuário está autenticado.

### `logout()`
Realiza logout local (limpa localStorage e cookies).

### `getUserDisplayName(user)`
Retorna o nome completo do usuário para exibição.

## Componentes Atualizados

### Header
- Exibe o nome do usuário logado
- Botão de logout com confirmação
- Funcionalidade completa de logout

### Login Page
- Formulário de login com validação
- Exibição de erros de autenticação
- Estado de carregamento durante login
- Redirecionamento após login bem-sucedido

## Variáveis de Ambiente

Adicione ao seu `.env.local`:

```bash
JWT_SECRET=seu-jwt-secret-super-seguro-aqui
```

## Próximos Passos

1. **Redefinição de Senha**: Implementar funcionalidade "Esqueceu a senha?"
2. **Níveis de Acesso**: Implementar controle de acesso baseado em roles
3. **Refresh Tokens**: Implementar refresh tokens para maior segurança
4. **2FA**: Adicionar autenticação de dois fatores (opcional)

## Notas de Segurança

- ⚠️ **Importante**: Altere o `JWT_SECRET` em produção para um valor seguro
- As senhas são automaticamente criptografadas antes de serem salvas no banco
- Os tokens JWT expiram em 24 horas por segurança
- Cookies são HTTP-only para prevenir ataques XSS
