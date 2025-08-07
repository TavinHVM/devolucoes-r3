export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  user_level: string;
  created_at: string;
}

export function getStoredUser(): User | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error('Erro ao obter usuário do localStorage:', error);
    return null;
  }
}

export function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  
  return localStorage.getItem('token');
}

export function isAuthenticated(): boolean {
  return getStoredUser() !== null && getStoredToken() !== null;
}

export function logout(): void {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem('user');
  localStorage.removeItem('token');
  
  // Limpar cookie do servidor
  document.cookie = 'auth-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  
  // Redirecionar para login
  window.location.href = '/login';
}

export function getUserDisplayName(user: User | null): string {
  if (!user) return '';
  return `${user.first_name} ${user.last_name}`;
}

export function isUserAdmin(user: User | null): boolean {
  if (!user) return false;
  return user.user_level === 'adm';
}
