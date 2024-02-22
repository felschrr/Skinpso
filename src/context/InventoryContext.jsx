import React, { createContext, useContext, useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import { AuthContext } from "./AuthContext";

const InventoryContext = createContext();

export const useInventory = () => useContext(InventoryContext);

export const InventoryProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [inventory, setInventory] = useState([]);

  useEffect(() => {
    if (!user) return;
    const fetchInventory = async () => {
      const userRef = doc(db, "inventories", user.uid);
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) {
        setInventory(docSnap.data().weapons ?? []);
      }
    };
    fetchInventory();
  }, [user]);

  const addWeaponToInventory = async (weapon) => {
    if (!user) return;
    const userRef = doc(db, "inventories", user.uid);
    const userDoc = await getDoc(userRef);
    let updatedWeapons = [];
    if (userDoc.exists()) {
      updatedWeapons = [...userDoc.data().weapons, weapon];
    } else {
      updatedWeapons.push(weapon);
    }
    await setDoc(userRef, { weapons: updatedWeapons });
    setInventory(updatedWeapons);
  };
  
  const removeWeaponFromInventory = async (weaponName) => {
    if (!user) return;
    const userRef = doc(db, "inventories", user.uid);
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
      const updatedWeapons = userDoc.data().weapons.filter(weapon => weapon.name !== weaponName);
      await setDoc(userRef, { weapons: updatedWeapons });
      setInventory(updatedWeapons);
    }
  };

  const value = {
    inventory,
    addWeaponToInventory,
    removeWeaponFromInventory,
  };

  return <InventoryContext.Provider value={value}>{children}</InventoryContext.Provider>;
};