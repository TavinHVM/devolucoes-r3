import { Usuario } from './types';

export const getInitials = (firstName: string, lastName: string) => {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
};

export const levelBadgeConfig = {
  adm: {
    bgColor: '#dc2626',
    textColor: '#ffffff'
  },
  vendas: {
    bgColor: '#3b82f6',
    textColor: '#ffffff'
  },
  financeiro: {
    bgColor: '#059669',
    textColor: 'text-white'
  },
  logistica: {
    bgColor: '#f97316',
    textColor: '#ffffff'
  },
  default: {
    bgColor: '#6b7280',
    textColor: '#ffffff'
  }
};

export const getLevelBadgeClass = (level: string) => {
  const config = levelBadgeConfig[level.toLowerCase() as keyof typeof levelBadgeConfig] || levelBadgeConfig.default;
  
  let classes = [];
  
  if (!config.bgColor.startsWith('#')) {
    classes.push(config.bgColor);
  }
  
  if (!config.textColor.startsWith('#')) {
    classes.push(config.textColor);
  }
  
  classes.push('border-0', 'hover:bg-current', 'hover:text-current', 'transition-none');
  
  return classes.join(' ');
};

export const getLevelBadgeStyle = (level: string) => {
  const config = levelBadgeConfig[level.toLowerCase() as keyof typeof levelBadgeConfig] || levelBadgeConfig.default;
  
  const baseStyle: React.CSSProperties = {
    border: 'none',
    transition: 'none',
    cursor: 'default'
  };
  
  const needsInlineStyle = config.bgColor.startsWith('#') || config.textColor.startsWith('#');
  
  if (needsInlineStyle) {
    let backgroundColor = config.bgColor;
    let textColor = config.textColor;
    
    if (!backgroundColor.startsWith('#')) {
      backgroundColor = '';
    }
    
    if (textColor.includes('white')) {
      textColor = '#ffffff';
    } else if (textColor.includes('black')) {
      textColor = '#000000';
    } else if (!textColor.startsWith('#')) {
      textColor = '#ffffff';
    }
    
    if (backgroundColor) {
      baseStyle.backgroundColor = backgroundColor;
    }
    
    if (textColor) {
      baseStyle.color = textColor;
    }
  }
  
  return baseStyle;
};

export const filterUsuarios = (
  usuarios: Usuario[], 
  searchTerm: string, 
  selectedLevel: string
) => {
  return usuarios.filter(usuario => {
    const matchesSearch = 
      usuario.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.role.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesLevel = selectedLevel === 'all' || usuario.user_level === selectedLevel;
    
    return matchesSearch && matchesLevel;
  });
};
