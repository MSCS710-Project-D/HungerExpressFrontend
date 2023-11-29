import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, RadioGroup, FormControlLabel, Radio, Button, Grid } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
};

const calorieRanges = [
    { label: '0 - 500', min: 0, max: 500 },
    { label: '501 - 1000', min: 501, max: 1000 },
    { label: '1001+', min: 1001, max: Infinity }
];

const FoodSuggestionModal = ({ open, handleClose }) => {
    const [step, setStep] = useState(1);
    const [menuItems, setMenuItems] = useState([]);
    const [allergyOptions, setAllergyOptions] = useState([]);
    const [selectedAllergy, setSelectedAllergy] = useState('none'); // Default to 'none'
    const [selectedCalorieRange, setSelectedCalorieRange] = useState('0 - 500'); // Default to first range
    const [suggestedItems, setSuggestedItems] = useState([]);

    useEffect(() => {
        const fetchMenuItems = async () => {
            try {
                const response = await axios.get('https://us-central1-maristhungerexpress.cloudfunctions.net/api/menuItems');
                console.log('Fetched Menu Items:', response.data); // Check fetched data
                setMenuItems(response.data);
                extractAllergyOptions(response.data);
            } catch (error) {
                console.error('Error fetching menu items:', error);
            }
        };
        fetchMenuItems();
    }, []);


    const extractAllergyOptions = (items) => {
        const allergies = new Set();
        items.forEach(item => {
            if (item.allergy_info && item.allergy_info.length > 0) {
                item.allergy_info.forEach(allergy => {
                    // Splitting in case multiple allergies are in a single string
                    allergy.split(', ').forEach(individualAllergy => allergies.add(individualAllergy.trim()));
                });
            }
        });
        setAllergyOptions(['none', ...Array.from(allergies)]);
    };

    const handleNextStep = () => {
        if (step < 3) {
            setStep(step + 1);
        } else {
            suggestMenuItems();
        }
    };

    const suggestMenuItems = () => {
        const range = calorieRanges.find(range => range.label === selectedCalorieRange);
        console.log("Selected Range:", range); // Check selected range
    
        const filteredItems = menuItems.filter(item => {
            const allergyMatch = selectedAllergy === 'none' || (item.allergy_info && !item.allergy_info.includes(selectedAllergy));
            const calories = parseInt(item.calories);
            const calorieMatch = calories >= range.min && calories <= range.max;
    
            console.log("Item:", item.name, "Allergy Match:", allergyMatch, "Calorie Match:", calorieMatch); // Check each item
    
            return allergyMatch && calorieMatch;
        });
    
        console.log("Filtered Items:", filteredItems); // Check filtered items
        setSuggestedItems(filteredItems);
        setStep(4); // Move to the final step to show suggestions
    };
    

    const renderAllergyOptions = () => (
        <RadioGroup value={selectedAllergy} onChange={(e) => setSelectedAllergy(e.target.value)}>
            {allergyOptions.map(allergy => (
                <FormControlLabel key={allergy} value={allergy} control={<Radio />} label={allergy} />
            ))}
        </RadioGroup>
    );

    const renderCalorieRangeOptions = () => (
        <RadioGroup value={selectedCalorieRange} onChange={(e) => setSelectedCalorieRange(e.target.value)}>
            {calorieRanges.map(range => (
                <FormControlLabel key={range.label} value={range.label} control={<Radio />} label={range.label} />
            ))}
        </RadioGroup>
    );

    const renderSuggestedItems = () => (
        <Grid container spacing={2}>
            {suggestedItems.length > 0 ? suggestedItems.map(item => (
                <Grid item xs={12} sm={6} md={4} key={item._id}>
                    <div>
                        <img src={item.image_url} alt={item.name} style={{ width: '100%', height: 'auto' }} />
                        <Typography variant="h6">{item.name}</Typography>
                        <Typography>{item.description}</Typography>
                        <Typography>${item.price}</Typography>
                    </div>
                </Grid>
            )) : <Typography>No items match your criteria.</Typography>}
        </Grid>
    );

    const renderStepContent = () => {
        switch (step) {
            case 1:
                return renderAllergyOptions();
            case 2:
                return renderCalorieRangeOptions();
            case 3:
                return renderSuggestedItems();
            default:
                return null;
        }
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={style}>
                <Typography variant="h6" component="h2">
                    {step === 3 ? 'Suggested Dishes' : 'Help us suggest a dish for you'}
                </Typography>
                {renderStepContent()}
                {step < 3 && (
                    <Button variant="contained" onClick={handleNextStep} style={{ marginTop: '20px' }}>
                        Next
                    </Button>
                )}
                <Button variant="text" onClick={handleClose} style={{ marginLeft: '10px', marginTop: '20px' }}>Close</Button>
                <Button style={{ position: 'absolute', top: 5, right: 5 }} onClick={handleClose}>
                    <CloseIcon />
                </Button>
            </Box>
        </Modal>
    );
};

export default FoodSuggestionModal;
