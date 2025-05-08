export const saveToLocalStorage = (key: string, value: any) => {
  try {
    // For large objects, try to compress by removing unnecessary data
    if (typeof value === "object" && value !== null) {
      // Create a deep copy to avoid modifying the original
      const valueCopy = JSON.parse(JSON.stringify(value));

      // Handle potentially large images for clinics
      if (key.includes("clinic_")) {
        console.log(`Saving clinic data to localStorage with key: ${key}`);

        // Store clinic logo URL reference
        if (valueCopy.logo && typeof valueCopy.logo === "string") {
          console.log(
            "Saving clinic logo URL:",
            valueCopy.logo.substring(0, 30) + "..."
          );
        }

        // Process dentist photos URLs
        if (valueCopy.dentists && Array.isArray(valueCopy.dentists)) {
          console.log(
            `Saving ${valueCopy.dentists.length} dentist entries with photos`
          );
          valueCopy.dentists = valueCopy.dentists.map((dentist: any) => {
            if (dentist.photo && typeof dentist.photo === "string") {
              console.log(
                `Saving photo URL for dentist ${dentist.name}:`,
                dentist.photo.substring(0, 30) + "..."
              );
            }
            return dentist;
          });
        }
      }

      try {
        // Store the full data
        localStorage.setItem(key, JSON.stringify(valueCopy));
        console.log(`Successfully saved data to localStorage with key: ${key}`);
      } catch (storageError) {
        console.error(`Storage error for ${key}:`, storageError);
      }
    } else {
      localStorage.setItem(key, JSON.stringify(value));
    }
  } catch (error) {
    console.error(`Error saving data to localStorage for key ${key}:`, error);
  }
};

export const getFromLocalStorage = (key: string) => {
  try {
    const value = localStorage.getItem(key);
    if (value) {
      console.log(`Retrieved data from localStorage with key: ${key}`);
      const parsedValue = JSON.parse(value);

      // Verify image data existence for clinic data
      if (key.includes("clinic_") && parsedValue) {
        if (parsedValue.logo) {
          console.log(
            "Retrieved clinic logo URL successfully:",
            parsedValue.logo.substring(0, 30) + "..."
          );
        }

        if (parsedValue.dentists && Array.isArray(parsedValue.dentists)) {
          const dentistsWithPhotos = parsedValue.dentists.filter(
            (d: any) => d.photo
          );
          console.log(
            `Retrieved ${dentistsWithPhotos.length} of ${parsedValue.dentists.length} dentists with photos`
          );
        }
      }

      return parsedValue;
    }
    console.log(`No data found in localStorage for key: ${key}`);
    return null;
  } catch (error) {
    console.error(`Error parsing ${key} from localStorage:`, error);
    return null;
  }
};
