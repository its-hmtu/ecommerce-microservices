import { Modal } from 'antd'
import React from 'react'

type ModalTypes = {
  open: boolean;
  onOk: () => void;
  onClose: () => void;
}

function LogoutModal({
  open,
  onOk,
  onClose
}: ModalTypes) {
  return (
    <Modal
      open={open}
      title="Logout"
      onOk={onOk}
      onCancel={onClose}
      closable
    >
      <p>Are you sure want to logout?</p>
    </Modal>
  )
}

export default LogoutModal