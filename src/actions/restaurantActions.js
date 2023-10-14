import axios from 'axios';

const base_url = "https://us-central1-maristhungerexpress.cloudfunctions.net/api"

export const fetchRestaurants = async () => {
    try {
        const response = await axios.get(`${base_url}/restaurant`);
        return response.data;
    } catch (error) {
        console.error("Error fetching restaurants:", error);
        return [];
    }
};
