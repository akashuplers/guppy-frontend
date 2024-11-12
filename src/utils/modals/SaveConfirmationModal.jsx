import { Button, Modal } from "antd";
import React from "react";

const SaveConfirmationDialog = ({ open, onClose = () => { }, onConfirm = () => { } }) => {

  return (
    <Modal
      open={open}
      centered
      onCancel={onClose}
      footer={[
        <div className="text-center">
          <Button onClick={onClose} type="secondary" className="custom-btn me-2 md:me-4 bg-gray-400 border-gray-500 text-white">No</Button>
          <Button onClick={onConfirm} type="primary" className="bg-blue-50 border-blue-500 text-blue-500">Yes</Button>
        </div>
      ]}
    >
      <div className="flex flex-col justify-center items-center">
        <p className="mb-5 text-md md:text-lg font-normal">
          Do You Want to Save Changes?
        </p>
      </div>
    </Modal>
  );
};

export default SaveConfirmationDialog;
