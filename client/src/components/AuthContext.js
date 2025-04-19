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
            handleLogout();
          }
        } catch (error) {
          console.error('Lỗi xác thực token:', error);
          handleLogout();
        }
      }
      setLoading(false);
    };
    
    verifyToken();
  }, [token]);
  
  // Đặt thông tin xác thực sau khi đăng nhập hoặc đăng ký thành công
  const setAuthData = (userData, jwtToken) => {
    // Lưu token vào localStorage
    localStorage.setItem('token', jwtToken);
    setToken(jwtToken);
    
    // Chỉ lưu những thông tin cần thiết của người dùng
    const safeUserData = {
      id: userData.id,
      username: userData.username,
      email: userData.email,
      role: userData.role
    };
    
    setUser(safeUserData);
    setIsAuthenticated(true);
  };
  
  // Đăng xuất
  const handleLogout = () => {
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
      
      setAuthData(data.user, data.token);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };
  
  // Đăng nhập
  const login = async (username, password) => {
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
      
      setAuthData(data.user, data.token);
      
      // Nếu người dùng vừa đăng nhập thành công, nhưng thấy cảnh báo mật khẩu bị rò rỉ,
      // bạn có thể hiển thị gợi ý đổi mật khẩu ở đây
      // Ví dụ: đặt state hiển thị modal hoặc notification
      
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };
  
  // Đổi mật khẩu (thêm chức năng mới)
  const changePassword = async (currentPassword, newPassword) => {
    if (!token) {
      return { success: false, message: 'Bạn chưa đăng nhập' };
    }
    
    try {
      const response = await fetch('http://localhost:5000/api/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ currentPassword, newPassword })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Đổi mật khẩu thất bại');
      }
      
      return { success: true, message: 'Đổi mật khẩu thành công' };
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
      login,
      logout: handleLogout,
      register,
      changePassword
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;