import { api } from './api';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthUser {
  id: string;
  username: string;
  role: string;
  email?: string;
}

export interface LoginResponse {
  message: string;
  token: string;
  user: AuthUser;
}

class AuthService {
  private tokenKey = 'authToken';
  private userKey = 'authUser';

  // Get stored token
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // Get stored user
  getUser(): AuthUser | null {
    const userStr = localStorage.getItem(this.userKey);
    return userStr ? JSON.parse(userStr) : null;
  }

  // Set auth data
  setAuth(token: string, user: AuthUser): void {
    localStorage.setItem(this.tokenKey, token);
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  // Clear auth data
  clearAuth(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // Login
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await api.post('/auth/login', credentials);
      const { token, user } = response.data;
      
      this.setAuth(token, user);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        throw new Error('用户名或密码错误');
      } else if (error.response?.status === 429) {
        throw new Error('登录尝试次数过多，请稍后再试');
      } else {
        throw new Error('登录失败，请重试');
      }
    }
  }

  // Logout
  async logout(): Promise<void> {
    try {
      const token = this.getToken();
      if (token) {
        await api.post('/auth/logout', {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.clearAuth();
    }
  }

  // Verify token
  async verifyToken(): Promise<AuthUser | null> {
    try {
      const token = this.getToken();
      if (!token) {
        return null;
      }

      const response = await api.get('/auth/verify', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const user = response.data.user;
      this.setAuth(token, user);
      return user;
    } catch (error) {
      this.clearAuth();
      return null;
    }
  }

  // Setup initial admin (first-time only)
  async setupAdmin(credentials: LoginCredentials & { email?: string }): Promise<LoginResponse> {
    try {
      const response = await api.post('/auth/setup', credentials);
      const { token, user } = response.data;
      
      this.setAuth(token, user);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 403) {
        throw new Error('管理员已存在');
      } else if (error.response?.status === 400) {
        throw new Error('用户名和密码不能为空');
      } else {
        throw new Error('设置失败，请重试');
      }
    }
  }

  // Change password
  async changePassword(currentPassword: string, newPassword: string): Promise<LoginResponse> {
    try {
      const response = await api.post('/auth/change-password', {
        currentPassword,
        newPassword
      });
      const { token, user } = response.data;
      
      this.setAuth(token, user);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        throw new Error('当前密码不正确');
      } else if (error.response?.status === 400) {
        throw new Error('新密码至少需要6个字符');
      } else {
        throw new Error('密码修改失败，请重试');
      }
    }
  }
}

export const authService = new AuthService(); 