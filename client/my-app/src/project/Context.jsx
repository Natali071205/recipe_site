import React, { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // 🚀 טוען את המשתמש מה-localStorage כשנטען הדף
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (newUser) => {
    if (newUser != null) {
      setUser(newUser);
      localStorage.setItem("user", JSON.stringify(newUser)); // ✅ שמירה
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user"); // ❌ מחיקה
  };

  const updateUser = (user) => {
    if (user) {
      setUser(user);
      localStorage.setItem("user", JSON.stringify(user)); // ✅ עדכון גם ב-localStorage
    }
  };

  return (
    <UserContext.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};
