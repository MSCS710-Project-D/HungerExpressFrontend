
import axios from 'axios';

const base_url = "https://us-central1-maristhungerexpress.cloudfunctions.net/api"


const fetchMenuItems = async (restaurantId) => {
    try {
        const response = await fetch(`${base_url}/menuItems/restaurant/${restaurantId}`);
        const data = await response.json();
        setMenuItems(data);
        setIsMenuVisible(true);
    } catch (error) {
        console.error("Error fetching menu items:", error);
    }
};