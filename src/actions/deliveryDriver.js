
export const saveDriver = async (driverData) => {
    const API_URL = 'https://us-central1-maristhungerexpress.cloudfunctions.net/api/drivers/create'; // Endpoint URL

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(driverData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to save driver');
        }

        const responseData = await response.json();
        console.log('Driver saved successfully:', responseData);
        return responseData; // Return the saved driver data or any other relevant info

    } catch (error) {
        console.error('Error saving driver:', error);
        throw error; // Re-throw the error so it can be caught and handled by the calling function
    }
};


