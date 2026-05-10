import React, { createContext, useContext, useState, useEffect } from 'react';

interface RoleContextType {
  role: string;
  setRole: (role: string) => void;
  // Thêm biến chứa toàn bộ thông tin User
  currentUser: any; 
  setCurrentUser: (user: any) => void;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const RoleProvider = ({ children }: { children: React.ReactNode }) => {
  const [role, setRole] = useState<string>('admin');
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Khi F5 trang, lấy cục data user từ LocalStorage đắp vào Context
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setCurrentUser(parsedUser); // LƯU TOÀN BỘ DATA VÀO ĐÂY
      
      const uname = (parsedUser.username || parsedUser.Username || '').toLowerCase();
      if (uname === 'admin') setRole('admin');
      else if (uname.includes('lanhdao')) setRole('leader');
      else setRole('staff');
    }
  }, []);

  return (
    <RoleContext.Provider value={{ role, setRole, currentUser, setCurrentUser }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => {
  const context = useContext(RoleContext);
  if (!context) throw new Error('useRole must be used within a RoleProvider');
  return context;
};