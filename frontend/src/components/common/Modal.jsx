import { X } from "lucide-react";

const Modal = ({ open, title, children, onClose }) => {
  if (!open) return null;

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section className="modal" onMouseDown={(event) => event.stopPropagation()}>
        <header className="modal__header">
          <h2>{title}</h2>
          <button className="icon-button" onClick={onClose}>
            <X size={18} />
          </button>
        </header>
        {children}
      </section>
    </div>
  );
};

export default Modal;
