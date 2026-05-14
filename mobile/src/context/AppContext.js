import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi, saveToken, getToken, removeToken } from '../services/authApi';
import { plantApi, scanApi } from '../services/plantApi';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [myPlants, setMyPlants] = useState([]);
  const [scanHistory, setScanHistory] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const token = await getToken();
        if (token) {
          const me = await authApi.me();
          setUser(me);
          setIsLoggedIn(true);
          await loadUserData();
        }
      } catch {
        await removeToken();
      } finally {
        setAuthLoading(false);
      }
    })();
  }, []);

  const loadUserData = async () => {
    try {
      const [plants, scans] = await Promise.all([plantApi.getAll(), scanApi.getAll()]);
      setMyPlants(plants);
      setScanHistory(scans);
    } catch {}
  };

  const login = async (email, password) => {
    const { access_token } = await authApi.login({ email, password });
    await saveToken(access_token);
    const me = await authApi.me();
    setUser(me);
    setIsLoggedIn(true);
    await loadUserData();
  };

  const register = async (firstName, lastName, email, password, confirmPassword) => {
    await authApi.register({
      first_name: firstName,
      last_name: lastName,
      email,
      password,
      confirm_password: confirmPassword,
    });
    await login(email, password);
  };

  const logout = async () => {
    await removeToken();
    setUser(null);
    setIsLoggedIn(false);
    setMyPlants([]);
    setScanHistory([]);
  };

  const addPlant = async (plantType, customName) => {
    const plant = await plantApi.create({
      plant_type_id: plantType.id,
      name: customName || `My ${plantType.name}`,
      emoji: plantType.emoji,
    });
    setMyPlants((prev) => [...prev, plant]);
    return plant;
  };

  const addScan = async (scanData) => {
    const scan = await scanApi.create(scanData);
    setScanHistory((prev) => [scan, ...prev]);
    setMyPlants((prev) =>
      prev.map((p) => (p.id === scan.plant_id ? { ...p, status: scan.disease, last_scan: scan.scanned_at } : p))
    );
    return scan;
  };

  const updatePlant = async (plantId, name) => {
    const updated = await plantApi.update(plantId, { name });
    setMyPlants((prev) => prev.map((p) => (p.id === plantId ? { ...p, name: updated.name } : p)));
    return updated;
  };

  const deletePlant = async (plantId) => {
    await plantApi.delete(plantId);
    setMyPlants((prev) => prev.filter((p) => p.id !== plantId));
    setScanHistory((prev) => prev.filter((s) => s.plant_id !== plantId));
  };

  return (
    <AppContext.Provider
      value={{
        isLoggedIn,
        authLoading,
        user,
        login,
        register,
        logout,
        myPlants,
        scanHistory,
        addPlant,
        addScan,
        updatePlant,
        deletePlant,
        loadUserData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
