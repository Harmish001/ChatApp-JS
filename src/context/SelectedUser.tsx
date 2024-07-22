import React, { createContext, useContext, useEffect, useState } from "react";

const SelectedUserContext = createContext<any>(null);

const SelectedUserProvider = ({ children }: any) => {
  const [selectedUser, setSelectedUser] = useState(null);

  const handleSelectUser = (user: any) => {
    setSelectedUser(user);
    localStorage.setItem("selected-user", JSON.stringify(user))
  };

  return (
    <SelectedUserContext.Provider value={{ selectedUser, handleSelectUser }}>
      {children}
    </SelectedUserContext.Provider>
  );
};

const useSelectUser = () => {
  const context = useContext(SelectedUserContext);
  return context;
};

export { SelectedUserProvider, SelectedUserContext, useSelectUser };
