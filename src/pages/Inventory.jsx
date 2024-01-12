import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from '../context/AuthContext.jsx';
import { doc, getDoc, setDoc, arrayUnion } from "firebase/firestore";
import { db } from '../config/firebase';

const Inventory = () => {
    const { user } = useContext(AuthContext);
    const [inventory, setInventory] = useState([]);
    const [formData, setFormData] = useState({
        weapon: "",
        quantity: 1,
        buyPrice: 0,
    });

    useEffect(() => {
        fetchInventory();
    }, []);

    useEffect(() => {
        console.log(inventory);
    }, [inventory]);

    const fetchInventory = async () => {
        const userRef = doc(db, "inventories", user.uid);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
            const userData = docSnap.data();
            setInventory(userData.weapons ?? []);
        }
    };

    const fetchWeaponInfo = async (id) => {
        try {
            const response = await fetch(`http://localhost:4000/buff-proxy/api/market/goods/sell_order?game=csgo&goods_id=${id}`);
            const data = await response.json();
            handleInventory(id, data.data);
            console.log("Informations sur l'arme :", data.data);
        } catch (error) {
            console.error("Erreur lors de la récupération des informations de l'arme :", error);
        }
    };

    const handleInventory = async (id, data) => {
        const weapon_name = data.goods_infos[id].tags.weapon.localized_name;
        try {
            const userRef = doc(db, "inventories", user.uid);
            const userDoc = await getDoc(userRef);
    
            if (userDoc.exists()) {
                const currentData = userDoc.data().weapons ?? [];
    
                const weaponIndex = currentData.findIndex((weapon) => weapon.name === weapon_name);
    
                let updatedWeapons;
                if (weaponIndex !== -1) {
                    updatedWeapons = currentData.map((weapon, index) => {
                        if (index === weaponIndex) {
                            // Ajoute le contenu de formData à la propriété skins
                            return {
                                ...weapon,
                                skins: [...weapon.skins, { ...data, formData }],
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
            console.error("Erreur lors de l'ajout du skin dans l'inventaire: ", error);
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
            console.error("Format de lien invalide. Veuillez fournir un lien valide.");
        }
    };

    return (
        <div>
            {user ? (
                <div>
                    <h1>Profile :</h1>
                    <img src={user.photoURL} alt={`${user.displayName} profile picture`} />
                    <p>{user.displayName}</p>
                </div>
            ) : (
                "Pas d'utilisateur trouvé"
            )}
            <h2>Inventaire - Armes</h2>
            <form onSubmit={(e) => handleSubmit(e)}>
                <input
                    name="weapon"
                    id="weapon"
                    type="text"
                    value={formData.weapon}
                    onChange={handleChange}
                    placeholder="Paste item's Buff163 link / ID"
                />
                <input
                    name="quantity"
                    id="quantity"
                    type="number"
                    value={formData.quantity}
                    onChange={handleChange}
                    placeholder="Quantity"
                />
                <input
                    name="buyPrice"
                    id="buyPrice"
                    type="number"
                    value={formData.buyPrice}
                    onChange={handleChange}
                    placeholder="Buy Price (¥)"
                />
                <button type="submit">Add to table</button>
            </form>
            <table>
                <thead>
                    <tr>
                        <th>Icon</th>
                        <th>Name</th>
                        <th>Quantity</th>
                        <th>Buy Price</th>
                        <th>Sell Price</th>
                        <th>Profit</th>
                    </tr>
                </thead>
                <tbody>
                    {inventory && inventory.length > 0 && inventory.map((weapon) => (
                        weapon.skins && weapon.skins.length > 0 && weapon.skins.map((skin, i) => (
                            <tr key={i}>
                                {/* <td><img src={Object.values(skin.goods_infos)[0].icon_url} height="128px" alt={Object.values(skin.goods_infos)[0].name}/></td> */}
                                <td>{Object.values(skin.goods_infos)[0].name}</td>
                                <td>{weapon.quantity}</td>
                                <td>{weapon.buyPrice}</td>
                                <td>{skin.items[0].price} ¥</td>
                                <td>{((skin.items[0].price - weapon.buyPrice) / weapon.buyPrice) * 100 } %</td>
                            </tr>
                        ))
                    ))}
                </tbody>

            </table>
        </div>
    );
};

export default Inventory;
