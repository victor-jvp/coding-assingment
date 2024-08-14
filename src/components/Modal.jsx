import "../styles/modal.scss";

const Modal = ({ isOpen, content, handleClose }) => {
  if (isOpen !== true) {
    return null;
  }

  return (
    <section className="modal">
      <div className="modal-content">{content}</div>
      <div className="modal-footer">
        <button className="btn btn-light" onClick={() => handleClose()}>
          <i className="bi bi-x-octagon-fill"></i> Close
        </button>
      </div>
    </section>
  );
};

export default Modal;
