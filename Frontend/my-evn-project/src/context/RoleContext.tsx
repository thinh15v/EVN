import React, { createContext, useState, useContext } from 'react';

const RoleContext = createContext<any>(null);

export const RoleProvider = ({ children }: { children: React.ReactNode }) => {
  const [role, setRole] = useState('admin'); // 'admin', 'staff', 'leader'
  const [roleName, setRoleName] = useState('Admin (Quản trị)');

  return (
    <RoleContext.Provider value={{ role, setRole, roleName, setRoleName }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => useContext(RoleContext);