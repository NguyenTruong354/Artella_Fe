# API Integration Guide

## 📁 Cấu trúc API

```
src/api/
├── index.ts              # Main exports
├── client/
│   ├── apiClient.ts      # Axios client với interceptors
│   └── index.ts
├── types/
│   ├── auth.ts          # Authentication types
│   └── index.ts
├── services/
│   ├── authService.ts   # Login/logout services
│   └── index.ts
├── auth/
│   ├── AuthContext.tsx  # React context cho auth
│   └── index.ts
└── utils/
    ├── helpers.ts       # Utility functions
    └── index.ts
```

## 🚀 Setup

1. **Cấu hình environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Chỉnh sửa `.env`:
   ```env
   VITE_API_BASE_URL=http://localhost:8080/api
   VITE_API_TIMEOUT=10000
   ```

2. **Wrap App với AuthProvider (đã setup):**
   ```tsx
   // src/App.tsx
   import { AuthProvider } from './api/auth';
   
   function App() {
     return (
       <AuthProvider>
         <RouterProvider router={router} />
       </AuthProvider>
     );
   }
   ```

## 🔐 Authentication

### Login với Email/Password

```tsx
import { useAuth } from './api/auth';

const { loginWithEmail } = useAuth();

try {
  await loginWithEmail({
    email: 'user@example.com',
    password: 'password123'
  });
  // Login thành công, user được redirect
} catch (error) {
  // Handle login error
  console.error('Login failed:', error);
}
```

### Login với Wallet

```tsx
import { useAuth } from './api/auth';

const { loginWithWallet } = useAuth();

try {
  await loginWithWallet({
    walletAddress: '0x...',
    signedMessage: 'signed_message_here'
  });
  // Login thành công
} catch (error) {
  // Handle login error
}
```

### Authentication State

```tsx
import { useAuth } from './api/auth';

const { state } = useAuth();

// state contains:
// - user: AuthUser | null
// - token: string | null
// - isLoading: boolean
// - error: string | null
// - isAuthenticated: boolean
```

## 🛡️ Protected Routes

Routes được protect tự động:

```tsx
// src/routes/index.tsx
{
  path: "/Home",
  element: (
    <ProtectedRoute>
      <HomeLayout />
    </ProtectedRoute>
  ),
}

// Login/Signup routes redirect nếu đã login
{
  path: "/login",
  element: (
    <ProtectedRoute requireAuth={false}>
      <Login />
    </ProtectedRoute>
  ),
}
```

## 📡 API Client

### Sử dụng API Client

```tsx
import { apiClient } from './api/client';

// GET request
const response = await apiClient.get<UserData>('/users/me');

// POST request
const response = await apiClient.post<LoginResponse>('/auth/login', {
  email: 'user@example.com',
  password: 'password'
});
```

### Auto Token Management

- Token được lưu tự động sau login
- Token được attach vào mọi request
- Token được clear khi logout hoặc expired

### Error Handling

```tsx
try {
  const response = await apiClient.get('/protected-endpoint');
} catch (error) {
  if (isAuthError(error)) {
    // User bị logout tự động, redirect to login
  } else if (isRateLimitError(error)) {
    // Rate limited
  } else {
    // Other errors
  }
}
```

## 🔧 Utility Functions

```tsx
import { 
  formatErrorMessage, 
  isValidEmail, 
  isValidWalletAddress,
  retryWithBackoff 
} from './api/utils';

// Format error messages
const message = formatErrorMessage(error);

// Validation
const isValid = isValidEmail('test@example.com');
const isValidWallet = isValidWalletAddress('0x...');

// Retry với backoff
const result = await retryWithBackoff(
  () => apiClient.get('/unreliable-endpoint'),
  3, // max retries
  1000 // base delay ms
);
```

## 🎯 Backend Integration

API client được thiết kế để work với Spring Boot backend:

### Login Endpoint Expected Format:

```java
@PostMapping("/login")
public ResponseEntity<ApiResponse<String>> login(@RequestBody LoginRequest request) {
    // LoginRequest:
    // - loginMethod: "email" | "wallet"
    // - email?: string
    // - password?: string  
    // - walletAddress?: string
    // - signedMessage?: string
    
    // Response: ApiResponse<String> với JWT token
}
```

### Rate Limiting Support:

Client tự động handle HTTP 429 responses từ backend.

## 🐛 Debugging

1. **Check Network Tab:** Xem API requests/responses
2. **Console Logs:** API errors được log automatically
3. **Auth State:** Check `useAuth().state` để debug authentication
4. **Token:** Check localStorage key `auth_token`

## 📝 TypeScript Support

Tất cả API calls có full TypeScript support:

```tsx
interface UserProfile {
  id: string;
  email: string;
  name: string;
}

// Type-safe API call
const user = await apiClient.get<UserProfile>('/users/me');
// user.data có type UserProfile
```
