import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Criar permissões básicas
  const permissions = [
    // Permissões de solicitações
    {
      name: 'canViewSolicitacoes',
      label: 'Ver Solicitações',
      description: 'Visualizar solicitações de devolução',
      category: 'solicitacoes'
    },
    {
      name: 'canCreateSolicitacoes',
      label: 'Criar Solicitações',
      description: 'Criar novas solicitações de devolução',
      category: 'solicitacoes'
    },
    {
      name: 'canEditSolicitacoes',
      label: 'Editar Solicitações',
      description: 'Editar solicitações existentes',
      category: 'solicitacoes'
    },
    {
      name: 'canAprovar',
      label: 'Aprovar Solicitações',
      description: 'Aprovar solicitações de devolução',
      category: 'solicitacoes'
    },
    {
      name: 'canRecusar',
      label: 'Recusar Solicitações',
      description: 'Recusar solicitações de devolução',
      category: 'solicitacoes'
    },
    {
      name: 'canDesdobrar',
      label: 'Desdobrar Solicitações',
      description: 'Desdobrar solicitações aprovadas',
      category: 'solicitacoes'
    },
    {
      name: 'canAbater',
      label: 'Abater Solicitações',
      description: 'Abater valor das solicitações',
      category: 'solicitacoes'
    },
    {
      name: 'canFinalizar',
      label: 'Finalizar Solicitações',
      description: 'Finalizar solicitações processadas',
      category: 'solicitacoes'
    },
    {
      name: 'canDeleteSolicitacoes',
      label: 'Excluir Solicitações',
      description: 'Excluir solicitações do sistema',
      category: 'solicitacoes'
    },
    
    // Permissões de usuários
    {
      name: 'canViewUsers',
      label: 'Ver Usuários',
      description: 'Visualizar lista de usuários',
      category: 'usuarios'
    },
    {
      name: 'canCreateUsers',
      label: 'Criar Usuários',
      description: 'Cadastrar novos usuários',
      category: 'usuarios'
    },
    {
      name: 'canEditUsers',
      label: 'Editar Usuários',
      description: 'Editar informações de usuários',
      category: 'usuarios'
    },
    {
      name: 'canDeleteUsers',
      label: 'Excluir Usuários',
      description: 'Excluir usuários do sistema',
      category: 'usuarios'
    },
    {
      name: 'canManagePermissions',
      label: 'Gerenciar Permissões',
      description: 'Atribuir e remover permissões de usuários',
      category: 'usuarios'
    },
    
    // Permissões de sistema
    {
      name: 'canAccessAdmin',
      label: 'Acesso Administrativo',
      description: 'Acesso completo ao painel administrativo',
      category: 'sistema'
    },
    {
      name: 'canViewReports',
      label: 'Ver Relatórios',
      description: 'Visualizar e baixar relatórios',
      category: 'sistema'
    },
    {
      name: 'canSystemSettings',
      label: 'Configurações do Sistema',
      description: 'Alterar configurações gerais do sistema',
      category: 'sistema'
    }
  ];

  console.log('Criando permissões...');
  
  for (const permission of permissions) {
    await prisma.permissions.upsert({
      where: { name: permission.name },
      update: permission,
      create: permission,
    });
  }

  console.log('Permissões criadas com sucesso!');
  
  // Migrar usuários existentes baseado no user_level
  console.log('Migrando permissões dos usuários existentes...');
  
  const users = await prisma.user_profiles.findMany();
  
  for (const user of users) {
    const userLevel = user.user_level?.toLowerCase();
    let permissionNames: string[] = [];
    
    switch (userLevel) {
      case 'adm':
      case 'administrador':
        // Admin tem todas as permissões
        permissionNames = permissions.map(p => p.name);
        break;
        
      case 'vendas':
        permissionNames = [
          'canViewSolicitacoes',
          'canCreateSolicitacoes',
          'canEditSolicitacoes',
          'canAprovar',
          'canRecusar',
          'canViewReports'
        ];
        break;
        
      case 'financeiro':
        permissionNames = [
          'canViewSolicitacoes',
          'canDesdobrar',
          'canAbater',
          'canFinalizar',
          'canViewReports'
        ];
        break;
        
      case 'logistica':
        permissionNames = [
          'canViewSolicitacoes',
          'canViewReports'
        ];
        break;
        
      case 'marketplace':
        permissionNames = [
          'canViewSolicitacoes',
          'canCreateSolicitacoes'
        ];
        break;
        
      default:
        permissionNames = ['canViewSolicitacoes'];
    }
    
    // Buscar IDs das permissões
    const userPermissions = await prisma.permissions.findMany({
      where: { name: { in: permissionNames } }
    });
    
    // Criar relações user_permissions
    for (const permission of userPermissions) {
      await prisma.user_permissions.upsert({
        where: {
          user_id_permission_id: {
            user_id: user.id,
            permission_id: permission.id
          }
        },
        update: {},
        create: {
          user_id: user.id,
          permission_id: permission.id
        }
      });
    }
  }
  
  console.log('Migração concluída!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
