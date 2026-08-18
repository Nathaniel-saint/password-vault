import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import axios from "axios";

const AuthContext = createContext();

export const api = axios.create({
  baseURL: "http://localhost:8000/",
  headers: {
    "Content-Type": "application/json",
  },
});

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(() =>
    localStorage.getItem("access_token"),
  );
  const [loading, setLoading] = useState(true);

  const tokenRef = useRef(accessToken);
  useEffect(() => {
    tokenRef.current = accessToken;
  }, [accessToken]);

  useEffect(() => {
    const requestInterceptor = api.interceptors.request.use(
      (config) => {
        if (tokenRef.current) {
          config.headers.Authorization = `Bearer ${tokenRef.current}`;
        }
        return config;
      },
      (error) => Promise.reject(error),
    );

    return () => api.interceptors.request.eject(requestInterceptor);
  }, []);

  useEffect(() => {
    const responseInterceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (
          error.response?.status === 401 &&
          !originalRequest._retry &&
          !originalRequest.url.includes("auth/api/token/refresh/")
        ) {
          originalRequest._retry = true;
          const refreshToken = localStorage.getItem("refresh_token");

          if (!refreshToken) {
            handleLocalLogout();
            return Promise.reject(error);
          }

          try {
            const res = await axios.post(
              "http://localhost:8000/api/register/api/token/refresh/",
              { refresh: refreshToken },
            );

            const newAccessToken = res.data.access;

            if (res.data.refresh) {
              localStorage.setItem("refresh_token", res.data.refresh);
            }

            localStorage.setItem("access_token", newAccessToken);
            setAccessToken(newAccessToken);
            tokenRef.current = newAccessToken;

            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return api(originalRequest);
          } catch (refreshError) {
            handleLocalLogout();
            return Promise.reject(refreshError);
          }
        }
        return Promise.reject(error);
      },
    );

    return () => api.interceptors.response.eject(responseInterceptor);
  }, []);

  useEffect(() => {
    const checkAuthAndRefresh = async () => {
      const refreshToken = localStorage.getItem("refresh_token");

      if (refreshToken) {
        try {
          const res = await axios.post(
            "http://localhost:8000/api/register/api/token/refresh/",
            { refresh: refreshToken },
          );

          localStorage.setItem("access_token", res.data.access);
          if (res.data.refresh) {
            localStorage.setItem("refresh_token", res.data.refresh);
          }

          setAccessToken(res.data.access);
          tokenRef.current = res.data.access;
        } catch (err) {
          handleLocalLogout();
        }
      } else {
        handleLocalLogout();
      }
      setLoading(false);
    };

    checkAuthAndRefresh();
  }, []);

  const handleLocalLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setAccessToken(null);
    tokenRef.current = null;
  };

  const login = (tokens) => {
    localStorage.setItem("access_token", tokens.access);
    localStorage.setItem("refresh_token", tokens.refresh);
    setAccessToken(tokens.access);
    tokenRef.current = tokens.access;
  };

  const logout = async () => {
    const refreshToken = localStorage.getItem("refresh_token");
    try {
      await api.post("auth/api/logout/", { refresh: refreshToken });
    } catch (err) {
      console.error("Server logout failed:", err);
    } finally {
      handleLocalLogout();
    }
  };

  return (
    <AuthContext.Provider
      value={{ accessToken, login, logout, isAuthenticated: !!accessToken }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
