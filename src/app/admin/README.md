# Admin Module - Bartendis

Este módulo contém o painel administrativo do sistema Bartendis, permitindo o gerenciamento completo de lojas, produtos e pedidos.

## 📁 Estrutura de Arquivos

```
src/app/admin/
├── layout.tsx                 # Layout principal do admin
├── page.tsx                   # Dashboard principal
├── stores/
│   ├── page.tsx              # Página de gerenciamento de lojas
│   └── components/
│       ├── StoreForm.tsx     # Formulário para criar/editar lojas
│       └── StoresTable.tsx   # Tabela com lista de lojas
├── produtos/
│   └── page.tsx              # Gerenciamento de produtos (existente)
└── update-subcollection/
    └── page.tsx              # Utilitário de atualização (existente)
```

## 🏪 Módulo de Lojas

### Funcionalidades

#### Dashboard Principal (`/admin`)

- **Visão Geral**: Estatísticas gerais do sistema
- **Métricas em Tempo Real**:
  - Total de lojas cadastradas
  - Lojas abertas/fechadas
  - Número de categorias
  - Total de produtos
  - Taxa de abertura das lojas
- **Ações Rápidas**: Acesso rápido às principais funcionalidades
- **Status do Sistema**: Monitoramento de conexões

#### Gerenciamento de Lojas (`/admin/stores`)

- **CRUD Completo**: Criar, visualizar, editar e excluir lojas
- **Formulário Validado**:
  - Nome obrigatório
  - Slug auto-gerado e editável
  - Descrição, endereço e telefone opcionais
  - Status de abertura/fechamento
- **Tabela Interativa**:
  - Lista todas as lojas com informações detalhadas
  - Toggle de status em tempo real
  - Estatísticas por loja (categorias, produtos, pedidos)
  - Links diretos para cardápio e produtos
- **Estatísticas**: Cards com métricas resumidas

### Componentes

#### `StoreForm`

Formulário modal para criação e edição de lojas:

- **Props**:
  - `store?: Store` - Loja para edição (opcional)
  - `isOpen: boolean` - Controle de visibilidade
  - `onClose: () => void` - Callback para fechar
  - `onSuccess: () => void` - Callback após sucesso
- **Validações**:
  - Nome obrigatório
  - Slug único e válido
  - Formato de telefone
- **Features**:
  - Geração automática de slug
  - Preview da URL
  - Loading states
  - Error handling

#### `StoresTable`

Tabela responsiva com lista de lojas:

- **Real-time Updates**: Usa Firebase onSnapshot
- **Features**:
  - Toggle de status inline
  - Estatísticas por loja
  - Links de navegação
  - Estados de loading
- **Estatísticas Dinâmicas**:
  - Conta categorias por loja
  - Conta produtos por loja
  - Conta pedidos por loja

### Tipos de Dados

```typescript
interface Store {
  id: string;
  name: string;
  slug: string;
  openAt: Timestamp;
  open: boolean;
  description?: string;
  address?: string;
  phone?: string;
}
```

### Integração com Firebase

- **Firestore Collections**:

  - `stores/` - Dados principais das lojas
  - `stores/{storeId}/categories/` - Categorias por loja
  - `stores/{storeId}/categories/{categoryId}/products/` - Produtos por categoria
  - `stores/{storeId}/orders/` - Pedidos por loja

- **Real-time Listeners**: Atualizações automáticas via onSnapshot
- **Batch Operations**: Operações otimizadas para performance

## 🚀 Funcionalidades Técnicas

### Navegação

- Layout responsivo com navegação lateral
- Breadcrumbs automáticos
- Estados ativos nos menus

### Performance

- **Lazy Loading**: Componentes carregados conforme necessário
- **Optimistic Updates**: UI atualizada antes da confirmação do servidor
- **Debounced Searches**: Busca otimizada com delay
- **Pagination**: Para listas grandes (preparado para implementação)

### UX/UI

- **Loading States**: Indicadores visuais durante operações
- **Error Handling**: Mensagens de erro claras
- **Confirmações**: Dialogs para ações destrutivas
- **Toast Notifications**: Feedback imediato de ações
- **Responsive Design**: Funciona em desktop e mobile

### Validação

- **Client-side**: Validação imediata no frontend
- **Server-side**: Validação no Firebase Rules
- **Sanitização**: Limpeza automática de dados de entrada

## 🔧 Configuração

### Pré-requisitos

- Firebase configurado
- Firestore habilitado
- Storage habilitado (para imagens)
- Regras de segurança configuradas

### Variáveis de Ambiente

As configurações do Firebase devem estar em `.env.local`:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

### Regras do Firestore

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /stores/{storeId} {
      allow read, write: if request.auth != null;

      match /categories/{categoryId} {
        allow read, write: if request.auth != null;

        match /products/{productId} {
          allow read, write: if request.auth != null;
        }
      }

      match /orders/{orderId} {
        allow read, write: if request.auth != null;
      }
    }
  }
}
```

## 🛡️ Segurança

- **Autenticação**: Verificação de usuário logado
- **Autorização**: Controle de acesso por roles
- **Validação**: Sanitização de entrada
- **Rate Limiting**: Proteção contra spam

## 📱 Responsividade

O sistema é totalmente responsivo:

- **Desktop**: Layout com sidebar
- **Tablet**: Layout adaptativo
- **Mobile**: Menu colapsável e cards empilhados

## 🔮 Próximas Funcionalidades

### Planejadas

- [ ] **Bulk Operations**: Ações em lote para múltiplas lojas
- [ ] **Advanced Filters**: Filtros por status, data, localização
- [ ] **Export Data**: Exportação de dados em CSV/Excel
- [ ] **Analytics Dashboard**: Gráficos e métricas avançadas
- [ ] **User Management**: Gerenciamento de usuários admin
- [ ] **Audit Log**: Log de todas as ações realizadas
- [ ] **Backup/Restore**: Sistema de backup dos dados
- [ ] **API Keys**: Geração de chaves para integração
- [ ] **Webhooks**: Notificações para sistemas externos
- [ ] **Multi-tenancy**: Suporte a múltiplas organizações

### Em Consideração

- [ ] **Dark Mode**: Tema escuro
- [ ] **i18n**: Internacionalização
- [ ] **PWA**: Progressive Web App
- [ ] **Offline Support**: Funcionamento offline
- [ ] **Push Notifications**: Notificações em tempo real

## 🐛 Troubleshooting

### Problemas Comuns

1. **Erro de Permissão Firebase**

   - Verificar regras do Firestore
   - Confirmar autenticação do usuário

2. **Componente não Carrega**

   - Verificar importações
   - Checar console do navegador

3. **Dados não Sincronizam**
   - Verificar conexão com internet
   - Checar status do Firebase Console

### Logs e Debugging

```javascript
// Ativar logs detalhados do Firebase
import { enableNetwork, disableNetwork } from "firebase/firestore";

// Para debug de conexão
console.log("Firebase conectado:", firebase.apps.length > 0);
```

## 📚 Referências

- [Next.js Documentation](https://nextjs.org/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript](https://www.typescriptlang.org/docs)
