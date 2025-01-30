export function useLocalStorage(key, initialData) {
  // Retrieve data from localStorage or use initialData if not present
  let data = JSON.parse(localStorage.getItem(key)) || initialData;

  // Function to update localStorage and the internal data
  function updateLocalStorage(newData) {
    if (typeof newData === "function") {
      data = newData(data);
    } else {
      data = newData;
    }
    localStorage.setItem(key, JSON.stringify(data));
    return data; // Return the updated data
  }

  // Initialize localStorage with initialData if it doesn't exist
  if (!localStorage.getItem(key)) {
    localStorage.setItem(key, JSON.stringify(initialData));
  }

  // Return the data and the update function
  return [data, updateLocalStorage];
}
