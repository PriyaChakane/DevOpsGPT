import { mockDelay, generateId } from '@/lib/utils';
import type { AuthResponse, LoginCredentials, SignupPayload } from '@/types/auth';

// TODO(flask-integration): replace with `apiClient.post('/auth/login', credentials)`
// once the Flask JWT auth endpoints are available.
export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(credentials.email);
  if (!emailIsValid || credentials.password.length < 6) {
    throw { message: 'Invalid email or password.' };
  }

  const mockUser: AuthResponse = {
    user: {
      id: generateId('user'),
      fullName: credentials.email.split('@')[0].replace(/[._]/g, ' '),
      email: credentials.email,
      role: 'DevOps Engineer',
      createdAt: new Date().toISOString(),
    },
    token: `mock_jwt_${generateId()}`,
  };

  return mockDelay(mockUser, 900);
}

// TODO(flask-integration): replace with `apiClient.post('/auth/signup', payload)`.
export async function signup(payload: SignupPayload): Promise<AuthResponse> {
  const mockUser: AuthResponse = {
    user: {
      id: generateId('user'),
      fullName: payload.fullName,
      email: payload.email,
      role: 'DevOps Engineer',
      createdAt: new Date().toISOString(),
    },
    token: `mock_jwt_${generateId()}`,
  };

  return mockDelay(mockUser, 1000);
}
