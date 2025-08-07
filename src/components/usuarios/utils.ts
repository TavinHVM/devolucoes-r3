import { Usuario } from './types';

export const getInitials = (firstName: string, lastName: string) => {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
};

export const levelBadgeConfig = {
  adm: {
    bgColor: '#ff0000ff',
    textColor: '#ffffff',
    icon: 'shield-check',
    label: 'Administrador'
  },
  vendas: {
    bgColor: '#0062ffff',
    textColor: '#ffffff',
    icon: 'shopping-cart',
    label: 'Vendas'
  },
  financeiro: {
    bgColor: '#00ffaeff',
    textColor: '#ffffff',
    icon: 'badge-cent',
    label: 'Financeiro'
  },
  logistica: {
    bgColor: '#ff6a00ff',
    textColor: '#ffffff',
    icon: 'truck',
    label: 'Logística'
  },
  default: {
    bgColor: '#6b7280',
    textColor: '#ffffff',
    icon: 'circle',
    label: 'Outro'
  }
};

export const getLevelBadgeConfig = (level: string) => {
  return levelBadgeConfig[level.toLowerCase() as keyof typeof levelBadgeConfig] || levelBadgeConfig.default;
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
  
  classes.push('border-0', 'hover:bg-current', 'hover:text-current', 'transition-none', 'shadow-sm');
  
  return classes.join(' ');
};

export const getLevelBadgeStyle = (level: string) => {
  const config = levelBadgeConfig[level.toLowerCase() as keyof typeof levelBadgeConfig] || levelBadgeConfig.default;
  
  const baseStyle: React.CSSProperties = {
    border: 'none',
    transition: 'none',
    cursor: 'default',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)'
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
      // Converte hex para rgba com transparência
      const hex = backgroundColor.replace('#', '');
      const r = parseInt(hex.substr(0, 2), 16);
      const g = parseInt(hex.substr(2, 2), 16);
      const b = parseInt(hex.substr(4, 2), 16);
      baseStyle.backgroundColor = `rgba(${r}, ${g}, ${b}, 0.2)`; // 20% de opacidade
      baseStyle.border = `1px solid rgba(${r}, ${g}, ${b}, 0.3)`; // Borda com 30% de opacidade
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
