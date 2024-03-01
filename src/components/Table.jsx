import { useInventory } from "../context/InventoryContext";
import { motion } from "framer-motion";
import { useUser } from "../context/UserContext";

const Table = () => {
    const { inventory, exchangeRates, removeWeaponFromInventory } =
        useInventory();
    const { currency, currencySymbols } = useUser();

    const convertCurrency = (price) => {
        if (!exchangeRates || !exchangeRates[currency])
            return price + " " + currencySymbols["CNY"]; // Retourner la devise si le taux n'est pas trouvé
        const convertedPrice = price * exchangeRates[currency];
        const symbol = currencySymbols[currency] || currency; // Utilisez le symbole de la devise si disponible, sinon l'acronyme de la devise
        return convertedPrice.toFixed(2) + " " + symbol;
    };

    return (
        <motion.table
            className="w-1/3 mx-auto border border-gray-200 divide-y divide-gray-200 rounded-lg dark:border-gray-600 border-1 dark:divide-gray-700"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                        Icon
                    </th>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                        Name
                    </th>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                        Quality
                    </th>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                        Quantity
                    </th>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                        Buy Price
                    </th>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                        Sell Price
                    </th>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                        Profit
                    </th>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                        Actions
                    </th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                {inventory &&
                    inventory.length > 0 &&
                    inventory.map(
                        (weapon, weaponIndex) =>
                            weapon.skins &&
                            weapon.skins.length > 0 &&
                            weapon.skins.map((skin, skinIndex) => (
                                <motion.tr
                                    key={skinIndex}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                >
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <img
                                            src={
                                                Object.values(
                                                    skin.goods_infos
                                                )[0].icon_url
                                            }
                                            height="32px"
                                            alt={
                                                Object.values(
                                                    skin.goods_infos
                                                )[0].short_name
                                            }
                                        />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {
                                            Object.values(skin.goods_infos)[0]
                                                .short_name
                                        }
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {
                                            Object.values(skin.goods_infos)[0]
                                                .tags.exterior.localized_name
                                        }
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {skin.quantity}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {convertCurrency(skin.buyPrice)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {convertCurrency(skin.items[0].price)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {(
                                            ((skin.items[0].price -
                                                skin.buyPrice) /
                                                skin.buyPrice) *
                                            100
                                        ).toFixed(2)}{" "}
                                        %
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <button
                                            className="text-red-500 hover:text-red-700"
                                            onClick={() =>
                                                removeWeaponFromInventory(
                                                    skin.id
                                                )
                                            }
                                        >
                                            Supprimer
                                        </button>
                                    </td>
                                </motion.tr>
                            ))
                    )}
            </tbody>
        </motion.table>
    );
};

export default Table;
