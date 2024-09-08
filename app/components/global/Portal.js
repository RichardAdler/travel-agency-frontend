// frontend/components/global/Portal.js
import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

const Portal = ({ children }) => {
    const elRef = useRef(null);

    if (!elRef.current) {
        elRef.current = document.createElement('div');
    }

    useEffect(() => {
        const portalRoot = document.getElementById('portal-root');
        portalRoot.appendChild(elRef.current);

        return () => {
            portalRoot.removeChild(elRef.current);
        };
    }, []);

    return createPortal(children, elRef.current);
};

export default Portal;
