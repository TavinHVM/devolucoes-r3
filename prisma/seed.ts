import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Criar permissões básicas
  const permissions = [
    // Permissões de solicitações
    {
      name: 'canViewSolicitacoes',
      label: 'Ver Solicitações',
      category: 'solicitacoes'
    },
    {
      name: 'canCreateSolicitacoes',
      label: 'Criar Solicitações',
      category: 'solicitacoes'
    },
    {
      name: 'canEditSolicitacoes',
      label: 'Editar Solicitações',
      category: 'solicitacoes'
    },
    {
      name: 'canAprovar',
      label: 'Aprovar Solicitações',
      category: 'solicitacoes'
    },
    {
      name: 'canRecusar',
      label: 'Recusar Solicitações',
      category: 'solicitacoes'
    },
    {
      name: 'canDesdobrar',
      label: 'Desdobrar Solicitações',
      category: 'solicitacoes'
    },
    {
      name: 'canAbater',
      label: 'Abater Solicitações',
      category: 'solicitacoes'
    },
    {
      name: 'canFinalizar',
      label: 'Finalizar Solicitações',
      category: 'solicitacoes'
    },
    {
      name: 'canDeleteSolicitacoes',
      label: 'Excluir Solicitações',
      category: 'solicitacoes'
    },
    
    // Permissões de usuários
    {
      name: 'canViewUsers',
      label: 'Ver Usuários',
      category: 'usuarios'
    },
    {
      name: 'canCreateUsers',
      label: 'Criar Usuários',
      category: 'usuarios'
    },
    {
      name: 'canEditUsers',
      label: 'Editar Usuários',
      category: 'usuarios'
    },
    {
      name: 'canDeleteUsers',
      label: 'Excluir Usuários',
      category: 'usuarios'
    },
    {
      name: 'canManagePermissions',
      label: 'Gerenciar Permissões',
      category: 'usuarios'
    },
    
    // Permissões de sistema
    {
      name: 'canAccessAdmin',
      label: 'Acesso Administrativo',
      category: 'sistema'
    },
    {
      name: 'canViewReports',
      label: 'Ver Relatórios',
      category: 'sistema'
    },
    {
      name: 'canSystemSettings',
      label: 'Configurações do Sistema',
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
