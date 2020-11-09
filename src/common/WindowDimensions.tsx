import { useState, useLayoutEffect } from 'react';

function getWindowDimensions() {
    const { innerWidth, innerHeight } = window;
    return [innerWidth, innerHeight];
}

export default function useWindowDimensions() {
    const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

    useLayoutEffect(() => {
        function handleResize() {
            setWindowDimensions(getWindowDimensions());
        }

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return windowDimensions;
}
