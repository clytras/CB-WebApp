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

function MsgBox({
  className,
  disableButtons = '',
  hideButtons = '',
  children
}, ref) {
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
  const disabled = (disableButtons || '').toLowerCase().split(/\s*,\s*/);
  const hidden = (hideButtons || '').toLowerCase().split(/\s*,\s*/);

  const btns = {
    ok: ['primary', okText, confirm('ok')],
    delete: ['danger', deleteText, confirm('delete')],
    yes: ['primary', yesText, confirm('yes')],
    no: ['primary', noText, confirm('no')],
    cancel: ['secondary', cancelText, dismiss],
    close: ['light', closeText, dismiss],
  };

  console.log('MsgBox', disableButtons, disabled, hidden);

  return (
    <Modal isOpen={isOpen} toggle={dismiss} className={className}>
      {title && <ModalHeader toggle={dismiss}>{title}</ModalHeader>}
      <ModalBody className={clsx(color && `alert-${color}`, css(styles.messageTextWhiteSpace))}>
        {children || message}
      </ModalBody>
      {hasButtons && (
        <ModalFooter>
          {buttons.filter(key => hidden.indexOf(key) < 0).map(key => {
            const [color, text, callback] = btns[key];
            return <Button key={`msgbox-btn-${key}`} className="m2" color={color} disabled={disabled.includes(key)} onClick={callback}>{text}</Button>;
          })}
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