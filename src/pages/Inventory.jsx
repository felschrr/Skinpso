import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import { Table } from "../components";

const Inventory = () => {
  const { user } = useContext(AuthContext);
  const [inventory, setInventory] = useState([]);
  const [formData, setFormData] = useState({
    weapon: "",
    quantity: 1,
    buyPrice: 0,
  });

  useEffect(() => {
    const fetchInventory = async () => {
      const userRef = doc(db, "inventories", user.uid);
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) {
        const userData = docSnap.data();
        setInventory(userData.weapons ?? []);
      }
    };
    fetchInventory();
  }, []);

  useEffect(() => {
    console.log("Inventory: ", inventory);
  }, [inventory]);

  const fetchWeaponInfo = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:4000/buff-proxy/api/market/goods/sell_order?game=csgo&goods_id=${id}`
      );
      const data = await response.json();
      console.log("Informations sur l'arme :", data.data);
      handleInventory(id, data.data);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des informations de l'arme :",
        error
      );
    }
  };

  const handleInventory = async (id, data) => {
    try {
      const weapon_name = data.goods_infos[id].tags.weapon.localized_name;
      const userRef = doc(db, "inventories", user.uid);
      const userDoc = await getDoc(userRef);
      const { quantity, buyPrice } = formData;
      if (userDoc.exists()) {
        const currentData = userDoc.data().weapons ?? [];
        const weaponIndex = currentData.findIndex(
          (weapon) => weapon.name === weapon_name
        );
        let updatedWeapons;
        if (weaponIndex !== -1) {
          updatedWeapons = currentData.map((weapon, index) => {
            if (index === weaponIndex) {
              return {
                ...weapon,
                skins: [...weapon.skins, { ...data, quantity, buyPrice }],
              };
            } else {
              return weapon;
            }
          });
        } else {
          updatedWeapons = [
            ...currentData,
            {
              name: weapon_name,
              skins: [{ ...data, formData }],
            },
          ];
        }

        const updatedData = {
          ...userDoc.data(),
          weapons: updatedWeapons,
        };
        setInventory(updatedData.weapons || []);
        await setDoc(userRef, updatedData);
      }
    } catch (error) {
      console.error(
        "Erreur lors de l'ajout du skin dans l'inventaire: ",
        error
      );
    }
  };

  const extractIdFromLink = (input) => {
    if (input.includes("https://buff.163.com/goods/")) {
      const match = input.match(/\/goods\/(\d+)/);
      return match ? match[1] : null;
    } else {
      const id = parseInt(input);
      return Number.isNaN(id) ? null : id.toString();
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const id = extractIdFromLink(formData.weapon);
    if (id) {
      fetchWeaponInfo(id);
      setFormData({
        weapon: "",
        quantity: 1,
        buyPrice: 0,
      });
    } else {
      console.error(
        "Format de lien invalide. Veuillez fournir un lien valide."
      );
    }
  };

  return (
    <div className={`dark:bg-gray-800 dark:text-white`}>
      {user ? (
        <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md p-4">
          <div className="flex items-center space-x-4">
            <img
              className="h-12 w-12 rounded-full"
              src={user.photoURL}
              alt={`${user.displayName} profile picture`}
            />
            <div>
              <h1 className="text-lg font-semibold dark:text-white">{user.displayName}</h1>
              <p className="text-gray-500 dark:text-gray-400">@{user.username}</p>
            </div>
          </div>
        </div>
      ) : (
        "Pas d'utilisateur trouvé"
      )}
      <form
        onSubmit={(e) => handleSubmit(e)}
        className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-md overflow-hidden shadow-md p-6"
      >
      <h2 className="text-2xl font-extrabold mb-4 dark:text-white">Inventaire - Armes</h2>
        <div className="mb-4">
          <label
            htmlFor="weapon"
            className="block text-sm font-medium text-gray-600"
          >
            Weapon Link / ID
          </label>
          <input
            name="weapon"
            id="weapon"
            type="text"
            value={formData.weapon}
            onChange={handleChange}
            placeholder="Paste item's Buff163 link / ID"
            className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300 dark:bg-gray-700"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="quantity"
            className="block text-sm font-medium text-gray-600"
          >
            Quantity
          </label>
          <input
            name="quantity"
            id="quantity"
            type="number"
            value={formData.quantity}
            onChange={handleChange}
            placeholder="Quantity"
            className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300 dark:bg-gray-700"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="buyPrice"
            className="block text-sm font-medium text-gray-600"
          >
            Buy Price (¥)
          </label>
          <input
            name="buyPrice"
            id="buyPrice"
            type="number"
            value={formData.buyPrice}
            onChange={handleChange}
            placeholder="Buy Price (¥)"
            className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300 dark:bg-gray-700"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:border-blue-700 focus:ring focus:ring-blue-200"
        >
          Add to table
        </button>
      </form>
      <div className="mx-auto w-1/3">
        <Table inventory={inventory}/>
      </div>
    </div>
  );
};

export default Inventory;
