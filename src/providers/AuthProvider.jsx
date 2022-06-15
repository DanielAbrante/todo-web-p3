import { createContext, useState } from "react";
import { useAxios } from "../hooks/useAxios";

const AuthContext = createContext({});

const AuthProvider = ({ children }) => {
  const api = useAxios();

  const [data, setData] = useState(() => {
    const userTxt = localStorage.getItem("@taskapp:user");
    const user = JSON.parse(userTxt);
    const token = localStorage.getItem("@taskapp:token");
    if (user && token) {
      return { user, token };
    }
    return {};
  });

  const signIn = async ({ email, password }) => {
    try {
      const { data } = await api.post("users/login", { email, password });
      const { user, token } = data;
      localStorage.setItem("@taskapp:user", JSON.stringify(user));
      localStorage.setItem("@taskapp:token", token);
      api.defaults.headers.Authorization = token;
      setData(data);
    } catch (error) {
      console.log(error);
      throw new Error("Falha na autenticação");
    }
  };

  const signUp = async ({ name, email, password }) => {
    try {
      await api.post("users", { name, email, password });
    } catch (error) {
      console.log(error);
      throw new Error("Falha em criar usuário");
    }
  };

  const signOut = async () => {
    try {
      await api.post("users/logout");
      localStorage.removeItem("@taskapp:user");
      localStorage.removeItem("@taskapp:token");
      setData({});
      api.defaults.headers.Authorization = "";
    } catch (error) {
      throw new Error("Não foi possível fazer logout");
    }
  };

  const isAuthenticated = () => {
    return data.token ? true : false;
  };

  return (
    <AuthContext.Provider
      value={{
        user: data.user,
        signIn,
        signOut,
        signUp,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };
