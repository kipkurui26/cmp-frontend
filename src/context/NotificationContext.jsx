import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axiosInstance from '../utils/AxiosInstance';

const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ws, setWs] = useState(null);
  const [wsConnected, setWsConnected] = useState(true);
  const reconnectDelay = 3000;
  const maxRetries = 10;
  const retryRef = React.useRef(0);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get('/auth/notifications/');
      setNotifications(res.data);
    } catch (err) {
      // Optionally handle error
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const setupWebSocket = useCallback(() => {
    const wsUrl = import.meta.env.VITE_WS_URL;
    const socket = new window.WebSocket(wsUrl);
    setWs(socket);

    socket.onopen = () => {
      setWsConnected(true);
      retryRef.current = 0;
    };
    socket.onmessage = (event) => {
      try {
        const notif = JSON.parse(event.data);
        setNotifications((prev) => {
          if (prev.some(n => n.id === notif.id)) return prev;
          return [notif, ...prev];
        });
      } catch (e) {
        // Ignore parse errors
      }
    };
    socket.onclose = () => {
      setWsConnected(false);
      if (retryRef.current < maxRetries) {
        setTimeout(() => {
          retryRef.current += 1;
          setupWebSocket();
        }, reconnectDelay);
      }
    };
    socket.onerror = () => {
      socket.close();
    };
    return socket;
  }, []);

  useEffect(() => {
    const socket = setupWebSocket();
    return () => socket && socket.close();
  }, [setupWebSocket]);

  const markAsRead = async (id) => {
    try {
      await axiosInstance.patch(`/auth/notifications/${id}/`, { is_read: true });
      setNotifications((prev) => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    } catch (err) {
      // Optionally handle error
    }
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, loading, fetchNotifications, markAsRead, wsConnected }}>
      {children}
    </NotificationContext.Provider>
  );
}; 
