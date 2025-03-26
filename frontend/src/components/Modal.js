// Modal.js
import React, { useEffect } from 'react';
import './Modal.css'; // Add some basic styling

const Modal = ({ isOpen, onClose, children }) => {
    // Close modal on Escape key press
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content animate__animated animate__fadeIn" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>
                    <span className="close-text">Tap to close</span> ×
                </button>
                <div className="modal-zoom">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;