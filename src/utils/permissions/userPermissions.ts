import { User } from '@/lib/auth';

// Define the user permissions based on user level
export interface UserPermissions {
  canAprovar: boolean;
  canRecusar: boolean;
  canDesdobrar: boolean;
  canAbater: boolean;
  canFinalizar: boolean;
  canReenviar: boolean;
}

/**
 * Get user permissions based on their user_level
 * @param user The user object
 * @returns UserPermissions object with boolean flags for each permission
 */
export function getUserPermissions(user: User | null): UserPermissions {
  if (!user) {
    return {
      canAprovar: false,
      canRecusar: false,
      canDesdobrar: false,
      canAbater: false,
      canFinalizar: false,
      canReenviar: false,
    };
  }

  const userLevel = user.user_level?.toLowerCase();

  switch (userLevel) {
    case 'vendas':
      return {
        canAprovar: true,
        canRecusar: true,
        canDesdobrar: false,
        canAbater: false,
        canFinalizar: false,
        canReenviar: false,
      };

    case 'marketplace':
      return {
        canAprovar: false,
        canRecusar: false,
        canDesdobrar: false,
        canAbater: false,
        canFinalizar: false,
        canReenviar: false,
      };

    case 'financeiro':
      return {
        canAprovar: false,
        canRecusar: false,
        canDesdobrar: true,
        canAbater: true,
        canFinalizar: true,
        canReenviar: false,
      };

    case 'logistica':
      return {
        canAprovar: false,
        canRecusar: false,
        canDesdobrar: false,
        canAbater: false,
        canFinalizar: false,
        canReenviar: true,
      };

    case 'adm':
      return {
        canAprovar: true,
        canRecusar: true,
        canDesdobrar: true,
        canAbater: true,
        canFinalizar: true,
        canReenviar: true,
      };

    default:
      // No permissions for unknown user levels
      return {
        canAprovar: false,
        canRecusar: false,
        canDesdobrar: false,
        canAbater: false,
        canFinalizar: false,
        canReenviar: false,
      };
  }
}

/**
 * Check if user has permission for a specific action
 * @param user The user object
 * @param action The action to check permission for
 * @returns true if user has permission, false otherwise
 */
export function hasPermission(
  user: User | null,
  action: keyof UserPermissions
): boolean {
  const permissions = getUserPermissions(user);
  return permissions[action];
}
