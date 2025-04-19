import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  
  // Kiểm tra token khi component được mount
  useEffect(() => {
    const verifyToken = async () => {
      if (token) {
        try {
          const response = await fetch('http://localhost:5000/api/user', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
            setIsAuthenticated(true);
          } else {
            // Token không hợp lệ hoặc hết hạn
            logout();
          }
        } catch (error) {
          console.error('Lỗi xác thực token:', error);
          logout();
        }
      }
      setLoading(false);
    };
    
    verifyToken();
  }, [token]);
  
  // Đăng nhập
  const login = (userData, jwtToken) => {
    localStorage.setItem('token', jwtToken);
    setToken(jwtToken);
    setUser(userData);
    setIsAuthenticated(true);
  };
  
  // Đăng xuất
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };
  
  // Đăng ký
  const register = async (username, email, password) => {
    try {
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, email, password })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Đăng ký thất bại');
      }
      
      login(data.user, data.token);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };
  
  // Đăng nhập
  const loginUser = async (username, password) => {
    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Đăng nhập thất bại');
      }
      
      login(data.user, data.token);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };
  
  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      user, 
      token, 
      loading,
      login: loginUser,
      logout,
      register
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;