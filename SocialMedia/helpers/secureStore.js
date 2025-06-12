import { setItemAsync, getItemAsync , deleteItemAsync} from "expo-secure-store";

export const saveSecure = async (key, value) => {
 await setItemAsync(key, value);
}

export const getSecure = async (key) => {
    const result = await getItemAsync(key);
    return result;
}

export const deleteSecure = async (key) => {
    await deleteItemAsync(key);
}

