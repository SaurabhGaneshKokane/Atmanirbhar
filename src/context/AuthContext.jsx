import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { authAPI } from '../services/api';
import { users as mockUsers } from '../mock/atmanirbharData';

const AuthContext = createContext(null);

export const ROLES = {
  CONSUMER: 'consumer',
  FARMER: 'farmer',
  ADMIN: 'admin',
};

// Helper to normalize user object from MongoDB backend or fallback
const normalizeUser = (user, role = ROLES.CONSUMER) => {
  if (!user) return null;
  const userRole = (user.role || role || ROLES.CONSUMER).toLowerCase();
  const defaultMock = mockUsers[userRole] || mockUsers.consumer;

  return {
    ...defaultMock,
    ...user,
    id: user._id || user.id || defaultMock.id,
    _id: user._id || user.id,
    name: user.name || defaultMock.name,
    phone: user.phone || defaultMock.phone,
    email: user.email || defaultMock.email,
    role: userRole,
    location: typeof user.location === 'string'
      ? user.location
      : user.location?.societyName
      ? `${user.location.societyName}, ${user.location.city || 'Pune'}`
      : user.location?.village
      ? `${user.location.village}, ${user.location.city || 'Pune'}`
      : defaultMock.location || 'Pune',
    village: user.location?.village || user.village || defaultMock.village || 'Shindewadi',
    district: user.location?.district || user.district || defaultMock.district || 'Pune',
    society: user.location?.societyName || user.society || defaultMock.society || 'Green Acres Residency',
    farmDetails: user.farmDetails || defaultMock.farmDetails,
    avatar: user.avatar || defaultMock.avatar,
    verified: user.farmDetails?.isVerified ?? defaultMock.verified ?? true,
  };
};

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('atmanirbhar_token') || null);
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('atmanirbhar_user');
      return saved ? normalizeUser(JSON.parse(saved)) : mockUsers.consumer;
    } catch {
      return mockUsers.consumer;
    }
  });
  const [isAuthenticated, setIsAuthenticated] = useState(() => Boolean(localStorage.getItem('atmanirbhar_token')));
  const [currentRole, setCurrentRole] = useState(() => {
    try {
      const saved = localStorage.getItem('atmanirbhar_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        return (parsed.role || ROLES.CONSUMER).toLowerCase();
      }
    } catch {
      // ignore
    }
    return ROLES.CONSUMER;
  });
  const [activeFarmerType, setActiveFarmerType] = useState('verified'); // 'verified' | 'unverified'
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  // 1. Initial mount: Validate persistent session with GET /api/auth/me
  useEffect(() => {
    const validateSession = async () => {
      const storedToken = localStorage.getItem('atmanirbhar_token');
      if (!storedToken) {
        setIsLoadingAuth(false);
        return;
      }

      try {
        const response = await authAPI.getMe();
        if (response.data && response.data.user) {
          const user = normalizeUser(response.data.user);
          setCurrentUser(user);
          setCurrentRole(user.role || ROLES.CONSUMER);
          setIsAuthenticated(true);
          localStorage.setItem('atmanirbhar_user', JSON.stringify(user));
        }
      } catch (error) {
        console.warn('Persistent session invalid or expired:', error.message);
        // Clear invalid token
        localStorage.removeItem('atmanirbhar_token');
        localStorage.removeItem('atmanirbhar_user');
        setToken(null);
        setIsAuthenticated(false);
        setCurrentUser(mockUsers.consumer);
        setCurrentRole(ROLES.CONSUMER);
      } finally {
        setIsLoadingAuth(false);
      }
    };

    validateSession();
  }, []);

  const setRole = (role) => {
    const lowerRole = role?.toLowerCase();
    if (Object.values(ROLES).includes(lowerRole)) {
      setCurrentRole(lowerRole);
    }
  };

  const toggleFarmerPersona = () => {
    setActiveFarmerType(prev => (prev === 'verified' ? 'unverified' : 'verified'));
  };

  // 2. Real API Login: POST /api/auth/login
  const login = async (identifier, password, role = ROLES.CONSUMER) => {
    try {
      const response = await authAPI.login({ identifier, password });
      const { token: jwtToken, user } = response.data;

      if (jwtToken && user) {
        const normalized = normalizeUser(user, user.role || role);
        localStorage.setItem('atmanirbhar_token', jwtToken);
        localStorage.setItem('atmanirbhar_user', JSON.stringify(normalized));
        setToken(jwtToken);
        setCurrentUser(normalized);
        setCurrentRole(normalized.role || ROLES.CONSUMER);
        setIsAuthenticated(true);
        return { success: true, user: normalized };
      }
      throw new Error('Invalid response from login server');
    } catch (error) {
      console.error('Login error:', error);
      const message = error.response?.data?.message || error.message || 'Login failed';
      throw new Error(message);
    }
  };

  // 3. Real API 1-Click Demo Login: POST /api/auth/demo-login
  const demoLogin = async (role = ROLES.CONSUMER, farmerType = 'verified') => {
    try {
      const targetRole = (role || ROLES.CONSUMER).toLowerCase();
      const response = await authAPI.demoLogin({ role: targetRole });
      const { token: jwtToken, user } = response.data;

      if (jwtToken && user) {
        const normalized = normalizeUser(user, targetRole);
        localStorage.setItem('atmanirbhar_token', jwtToken);
        localStorage.setItem('atmanirbhar_user', JSON.stringify(normalized));
        setToken(jwtToken);
        setCurrentUser(normalized);
        setCurrentRole(targetRole);
        if (targetRole === ROLES.FARMER) {
          setActiveFarmerType(farmerType);
        }
        setIsAuthenticated(true);
        return { success: true, user: normalized, role: targetRole };
      }
      throw new Error('Demo login failed');
    } catch (error) {
      console.error('Demo login error:', error);
      // Fallback local demo login if offline
      const targetRole = (role || ROLES.CONSUMER).toLowerCase();
      const fallbackUser = targetRole === ROLES.FARMER
        ? (farmerType === 'verified' ? mockUsers.farmer : mockUsers.unverifiedFarmer)
        : targetRole === ROLES.ADMIN
        ? mockUsers.admin
        : mockUsers.consumer;

      setCurrentUser(fallbackUser);
      setCurrentRole(targetRole);
      setIsAuthenticated(true);
      return { success: true, user: fallbackUser, role: targetRole };
    }
  };

  // 4. Real API Register: POST /api/auth/register
  const register = async (formData, role = ROLES.CONSUMER) => {
    try {
      const targetRole = (role || ROLES.CONSUMER).toLowerCase();
      const payload = {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        password: formData.password || 'Atmanirbhar@2026',
        role: targetRole,
        location: targetRole === ROLES.CONSUMER
          ? {
              city: formData.city || 'Pune',
              societyName: formData.society || formData.housingSociety || 'Green Acres Residency, Kothrud',
            }
          : {
              city: 'Pune',
              village: formData.village || 'Shindewadi',
              district: formData.taluka || 'Pune',
            },
        farmDetails: targetRole === ROLES.FARMER
          ? {
              landSizeAcres: Number(formData.farmSizeAcres || formData.landSize || 3.5),
              cropsGrown: typeof formData.cropsGrown === 'string'
                ? formData.cropsGrown.split(',').map(s => s.trim())
                : formData.cropsGrown || ['Fresh Produce'],
              isVerified: false,
              certification: 'Under In-Transition Inspection',
              documentUrl: formData.landDocumentUrl || formData.farmDetails?.documentUrl || formData.uploadedDoc?.base64 || formData.uploadedDoc?.previewUrl,
              documentName: formData.landDocument || formData.farmDetails?.documentName || formData.uploadedDoc?.name || '7-12-Land-Extract-Gat.pdf',
            }
          : undefined,
      };

      const response = await authAPI.register(payload);
      const { token: jwtToken, user } = response.data;

      if (jwtToken && user) {
        const normalized = normalizeUser(user, targetRole);
        localStorage.setItem('atmanirbhar_token', jwtToken);
        localStorage.setItem('atmanirbhar_user', JSON.stringify(normalized));
        setToken(jwtToken);
        setCurrentUser(normalized);
        setCurrentRole(targetRole);
        if (targetRole === ROLES.FARMER) {
          setActiveFarmerType('unverified');
        }
        setIsAuthenticated(true);
        return { success: true, user: normalized };
      }
      throw new Error('Registration response invalid');
    } catch (error) {
      console.error('Registration error:', error);
      const message = error.response?.data?.message || error.message || 'Registration failed';
      throw new Error(message);
    }
  };

  // 5. Logout
  const logout = () => {
    localStorage.removeItem('atmanirbhar_token');
    localStorage.removeItem('atmanirbhar_user');
    setToken(null);
    setIsAuthenticated(false);
    setCurrentUser(null);
    setCurrentRole(ROLES.CONSUMER);
  };

  const value = {
    token,
    isAuthenticated,
    isLoadingAuth,
    currentRole,
    currentUser,
    activeFarmerType,
    setRole,
    toggleFarmerPersona,
    login,
    demoLogin,
    register,
    logout,
    ROLES,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
