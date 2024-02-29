import React, { createContext, useContext, useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import { AuthContext } from "./AuthContext";
import { toast } from "react-toastify";
import { v4 as uuid } from "uuid";

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

    const addWeaponToInventory = async (skin) => {
        const weaponName = Object.values(skin.goods_infos)[0].tags.category
            .localized_name;
        const uniqueId = uuid(); // Générer un identifiant unique
        try {
            let updatedInventory = [...inventory];
            const existingWeaponIndex = updatedInventory.findIndex(
                (w) => w.name === weaponName
            );
            if (existingWeaponIndex !== -1) {
                updatedInventory[existingWeaponIndex].skins.push({
                    ...skin,
                    id: uniqueId,
                });
            } else {
                updatedInventory.push({
                    name: weaponName,
                    skins: [{ ...skin, id: uniqueId }],
                });
            }
            setInventory(updatedInventory);
            if (!user) return;
            const userRef = doc(db, "inventories", user.uid);
            await setDoc(userRef, { weapons: updatedInventory });
            toast.success("Le skin a été ajouté à l'inventaire avec succès!");
        } catch (error) {
            console.error(
                "Erreur lors de l'ajout du skin dans l'inventaire: ",
                error
            );
            toast.error(
                "Une erreur est survenue lors de l'ajout du skin à l'inventaire."
            );
        }
    };

    const removeWeaponFromInventory = async (weaponId) => {
        try {
            let updatedInventory = [...inventory];
            updatedInventory = updatedInventory.map((weapon) => ({
                ...weapon,
                skins: weapon.skins.filter((skin) => skin.id !== weaponId),
            }));
            setInventory(updatedInventory);
            if (!user) return;
            const userRef = doc(db, "inventories", user.uid);
            await setDoc(userRef, { weapons: updatedInventory });
            toast.success("Le skin a été supprimé à l'inventaire avec succès!");
        } catch (error) {
            console.error(
                "Erreur lors de la suppression du skin de l'inventaire: ",
                error
            );
            toast.error(
                "Une erreur est survenue lors de la suppression du skin de l'inventaire."
            );
        }
    };

    const value = {
        inventory,
        addWeaponToInventory,
        removeWeaponFromInventory,
    };

    return (
        <InventoryContext.Provider value={value}>
            {children}
        </InventoryContext.Provider>
    );
};
