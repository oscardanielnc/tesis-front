import Modal from 'react-bootstrap/Modal';
import Button from '../Inputs/Button';
import "../scss/Modal.scss"

function ModalBasic({children, title, show, setShow, handleClick,noButtons=false}) {

  return (
      <Modal show={show} onHide={()=> setShow(false)} className='modal-psp'>
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            {children}
        </Modal.Body>
        {!noButtons && <Modal.Footer className='modal-psp-footer'>
          <Button variant="danger" handleClick={()=> setShow(false)} title="Cancelar" icon="bi bi-x"/>
          <Button variant="primary" handleClick={handleClick} title="Aceptar" icon="bi bi-check"/>
        </Modal.Footer>}
      </Modal>
  );
}

export default ModalBasic;