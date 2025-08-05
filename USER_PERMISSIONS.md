# User Role Permissions Implementation

This document describes the user role-based permissions system implemented for the solicitações (request) management feature.

## User Roles and Permissions

### Vendas (Sales)
- **Can Access**: 
  - ✅ Aprovar (Approve) - Approve pending requests
  - ✅ Recusar (Reject) - Reject pending requests with reason
- **Cannot Access**:
  - ❌ Desdobrar (Unfold)
  - ❌ Abater (Deduct)
  - ❌ Finalizar (Finalize)
  - ❌ Reenviar (Resend)

### Financeiro (Finance)
- **Can Access**:
  - ✅ Desdobrar (Unfold) - Unfold approved requests
  - ✅ Abater (Deduct) - Deduct unfolded requests
  - ✅ Finalizar (Finalize) - Finalize deducted requests
- **Cannot Access**:
  - ❌ Aprovar (Approve)
  - ❌ Recusar (Reject)
  - ❌ Reenviar (Resend)

### Logística (Logistics)
- **Can Access**:
  - ✅ Reenviar (Resend) - Resend rejected requests
- **Cannot Access**:
  - ❌ Aprovar (Approve)
  - ❌ Recusar (Reject)
  - ❌ Desdobrar (Unfold)
  - ❌ Abater (Deduct)
  - ❌ Finalizar (Finalize)

### Administrador (Administrator)
- **Can Access**:
  - ✅ **All actions** - Has complete access to all buttons and actions

## Status Flow (Preserved)

The existing status flow logic has been **preserved** and works alongside the new role restrictions:

```
PENDENTE → APROVADA → DESDOBRADA → ABATIDA → FINALIZADA
    ↓
RECUSADA → REENVIADA
```

- Only **PENDENTE** requests can be approved or rejected
- Only **APROVADA** requests can be unfolded (desdobrada)
- Only **DESDOBRADA** requests can be deducted (abatida)
- Only **ABATIDA** requests can be finalized
- Only **RECUSADA** requests can be resent (reenviada)

## Implementation Details

### Frontend (Client-side)
- **File**: `src/app/solicitacoes/page.tsx`
- **Logic**: Buttons are conditionally rendered based on user permissions
- **Auth**: Uses `useAuth()` hook to get current user info
- **Permissions**: Uses `getUserPermissions()` utility function

### Backend (Server-side)
- **Files**: All API endpoints in `src/app/api/btnsSolicitacoes/*/route.ts`
- **Logic**: Each endpoint validates user permissions before processing
- **Auth**: Validates JWT token from cookies or Authorization header
- **Permissions**: Uses `validateUserPermission()` middleware function

### Utility Functions
- **Client**: `src/utils/permissions/userPermissions.ts`
  - `getUserPermissions(user)` - Returns permission object for user
  - `hasPermission(user, action)` - Checks specific permission
  
- **Server**: `src/utils/permissions/serverPermissions.ts`
  - `validateUserPermission(request, action)` - Server-side permission validation
  - `getUserFromToken(request)` - Extract user from JWT token
  - `hasServerPermission(userLevel, action)` - Check server-side permissions

## Security Features

1. **Double Validation**: Both client-side (UI) and server-side (API) validation
2. **Token-based Auth**: Uses JWT tokens for user identification
3. **Role-based Access**: Permissions based on `user_level` field
4. **Status Flow Protection**: Existing status transition logic preserved
5. **Error Handling**: Proper 403 Forbidden responses for unauthorized actions

## Usage Example

When a user with "vendas" role logs in:
- They will only see "Aprovar" and "Recusar" buttons on PENDENTE requests
- Other buttons (Desdobrar, Abater, Finalizar, Reenviar) will be hidden
- If they somehow try to access restricted endpoints, they'll get a 403 error

## Testing

To test the implementation:
1. Create users with different `user_level` values (vendas, financeiro, logistica, adm)
2. Login with each user type
3. Verify that only appropriate buttons are visible
4. Test that API endpoints reject unauthorized requests
