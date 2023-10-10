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
        <div className="image-panel">
            <img src={images[currentImageIndex]} alt="Rotating content" style={{ width: '100%', height: 'auto' }} />
        </div>
    );
};

export default ImagePanel;
