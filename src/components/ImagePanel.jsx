import React, { useState, useEffect } from 'react';

const ImagePanel = () => {
    // Sample image paths. Replace these with your own paths.
    const images = [
        '/bannerimage1.jpeg',
        '/bannerimage2.jpeg',
        '/bannerimage3.jpeg',
        '/bannerimage4.jpeg',
        '/bannerimage5.jpeg',
        '/bannerimage6.jpeg',
        '/bannerimage7.jpeg',
        '/bannerimage8.jpeg',
        '/bannerimage9.jpeg',
    ];

    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 10000); // Change image every 10 seconds

        // Cleanup the interval on component unmount
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="image-panel" style={{ width: '100%', height: '50vh', float: 'left' }}>
            <img
                src={images[currentImageIndex]}
                alt="Rotating content"
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover', // This ensures the image covers the div without stretching
                }}
            />
        </div>
    );
};

export default ImagePanel;
