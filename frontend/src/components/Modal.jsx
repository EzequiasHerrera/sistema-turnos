const Modal = ({ title, children, onClose, disabled = false }) => {
    return (
        <div
            className="modal-overlay"
            onClick={() => {
                if (!disabled) onClose();
            }}
        >
            <div
                className="modal-content"
                onClick={(e) => e.stopPropagation()}
            >
                <header className="modal-header">
                    <h2>{title}</h2>

                    <button
                        type="button"
                        className="modal-close"
                        onClick={onClose}
                        disabled={disabled}
                        aria-label="Cerrar modal"
                    >
                        &times;
                    </button>
                </header>

                <div className="modal-body">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;