import { useState, useEffect } from 'react';

function getWindowDimensions() {
    const { innerWidth: innerWidth, innerHeight: innerHeight } = window;
    return {
        w: innerWidth,
        h: innerHeight
    };
}

export default function useWindowDimensions() {
    const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

    useEffect(() => {
        function handleResize() {
            setWindowDimensions(getWindowDimensions());
        }

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return windowDimensions;
}
