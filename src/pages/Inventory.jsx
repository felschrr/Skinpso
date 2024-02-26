import { useState } from "react";
import { useInventory } from "../context/InventoryContext";
import { Table } from "../components";

const Inventory = () => {
  const { addWeaponToInventory } = useInventory();
  const [formData, setFormData] = useState({
    weapon: "",
    quantity: 1,
    buyPrice: 0,
  });

  const fetchWeaponInfo = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:4000/buff-proxy/api/market/goods/sell_order?game=csgo&goods_id=${id}`
      );
      const data = await response.json();
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
      const weapon = { ...data, ...formData, id };
      addWeaponToInventory(weapon);
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
      <form
        onSubmit={(e) => handleSubmit(e)}
        className="max-w-md p-6 mx-auto overflow-hidden bg-white rounded-md shadow-md dark:bg-gray-800"
      >
        <h2 className="mb-4 text-2xl font-extrabold dark:text-white">
          Inventaire - Armes
        </h2>
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
            className="w-full p-2 mt-1 border rounded-md focus:outline-none focus:ring focus:border-blue-300 dark:bg-gray-700"
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
            className="w-full p-2 mt-1 border rounded-md focus:outline-none focus:ring focus:border-blue-300 dark:bg-gray-700"
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
            className="w-full p-2 mt-1 border rounded-md focus:outline-none focus:ring focus:border-blue-300 dark:bg-gray-700"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:border-blue-700 focus:ring focus:ring-blue-200"
        >
          Add to table
        </button>
      </form>
      <Table />
    </div>
  );
};

export default Inventory;
