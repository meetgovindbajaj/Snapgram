import { useToast } from "@/components/ui/use-toast";
import { INITIAL_USER } from "@/constants";
import { getCurrentUser } from "@/lib/appwrite/api";
import { IContextType, IUser } from "@/types";
import React, { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

/* eslint-disable-next-line react-refresh/only-export-components */

const INITIAL_STATE = {
  user: INITIAL_USER,
  isLoading: false,
  isAuthenticated: false,
  setUser: () => {},
  setIsAuthenticated: () => {},
  checkAuthUser: async () => false as boolean,
};

export const AuthContext = createContext<IContextType>(INITIAL_STATE);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<IUser>(INITIAL_USER);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // checks the session token and signs user in
  const checkAuthUser = async () => {
    try {
      setIsLoading(true);
      // getting user data from session token
      const currentAccount = await getCurrentUser();
      if (currentAccount) {
        setUser({
          id: currentAccount.$id,
          name: currentAccount.name,
          username: currentAccount.username,
          email: currentAccount.email,
          imageUrl: currentAccount.imageUrl,
          bio: currentAccount.bio,
        });
        setIsAuthenticated(true);
        toast({ title: "Signed In Successfully." });
        return true;
      }
      if (window.location.pathname !== "/signup") {
        toast({ title: "Signing In Failed." });
      }
      return false;
    } catch (error) {
      //console.log(error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("cookieFallback") === "[]") navigate("/signin");
    checkAuthUser();
    // eslint-disable-next-line
  }, []);

  const value = {
    user,
    isLoading,
    isAuthenticated,
    setUser,
    setIsAuthenticated,
    checkAuthUser,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
