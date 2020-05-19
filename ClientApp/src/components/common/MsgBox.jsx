import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { StyleSheet, css } from 'aphrodite';
import clsx from 'clsx';


const defaultOptions = {
  okText: 'OK',
  cancelText: 'Cancel',
  closeText: 'Close',
  yesText: 'Yes',
  noText: 'No',
  deleteText: 'Delete',
  buttons: 'ok',
  color: null
}

function MsgBox({ className }, ref) {
  const [isOpen, setIsOpen] = useState(false);
  const [opts, setOpts] = useState(defaultOptions);

  const dismiss = () => {
    const { onDismiss } = opts;
    setIsOpen(false);
    onDismiss && onDismiss();
  }

  const confirm = selection => () => {
    const { onConfirm } = opts;
    setIsOpen(false);
    onConfirm && onConfirm(selection);
  }

  useImperativeHandle(ref, () => ({
    show(options = {}) {
      setOpts({
        ...defaultOptions,
        ...options
      });
      setIsOpen(true);
    }
  }));

  let {
    title,
    message,
    buttons,
    color,

    okText,
    cancelText,
    closeText,
    yesText,
    noText,
    deleteText,
  } = opts || {};

  const hasButtons = !!buttons;
  buttons = buttons && buttons.toLowerCase().split(/\s*,\s*/);

  return (
    <Modal isOpen={isOpen} toggle={dismiss} className={className}>
      {title && <ModalHeader toggle={dismiss}>{title}</ModalHeader>}
      
      <ModalBody className={clsx(color && `alert-${color}`, css(styles.messageTextWhiteSpace))}>
        {message}
      </ModalBody>
      {hasButtons && (
        <ModalFooter>
          {buttons.includes('ok') && <Button className="m2" color="primary" onClick={confirm('ok')}>{okText}</Button>}
          {buttons.includes('delete') && <Button className="m2" color="danger" onClick={confirm('delete')}>{deleteText}</Button>}
          {buttons.includes('yes') && <Button className="m2" color="primary" onClick={confirm('yes')}>{yesText}</Button>}
          {buttons.includes('no') && <Button className="m2" color="primary" onClick={confirm('no')}>{noText}</Button>}
          {buttons.includes('cancel') && <Button className="m2" color="secondary" onClick={dismiss}>{cancelText}</Button>}
          {buttons.includes('close') && <Button className="m2" color="light" onClick={dismiss}>{closeText}</Button>}
        </ModalFooter>
      )}
    </Modal>
  );
}

export default forwardRef(MsgBox);

const styles = StyleSheet.create({
  messageTextWhiteSpace: {
    whiteSpace: 'pre-line'
  }
});