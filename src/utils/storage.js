import AsyncStorage from "@react-native-async-storage/async-storage";

const Storage = {
  // 🟢 Save data (string or object)
  setItem: async (key, value) => {
    try {
      const data = typeof value === "string" ? value : JSON.stringify(value);
      await AsyncStorage.setItem(key, data);
    } catch (error) {
      console.error(`Error setting AsyncStorage key [${key}]:`, error);
    }
  },

  // 🔵 Get data (auto-parse JSON)
  getItem: async (key) => {
    try {
      const value = await AsyncStorage.getItem(key);
      try {
        return JSON.parse(value);
      } catch {
        return value; // not JSON
      }
    } catch (error) {
      console.error(`Error getting AsyncStorage key [${key}]:`, error);
      return null;
    }
  },

  // 🔴 Remove one item
  removeItem: async (key) => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing AsyncStorage key [${key}]:`, error);
    }
  },

  // ⚫ Clear all storage (use carefully)
  clearAll: async () => {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error("Error clearing AsyncStorage:", error);
    }
  },
};

export default Storage;
