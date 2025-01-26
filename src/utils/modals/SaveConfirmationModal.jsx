import { Button, Modal } from "antd";
import React from "react";

const SaveConfirmationDialog = ({ open, onClose = () => { }, onConfirm = () => { }, title }) => {
console.log("title",title);

  return (
    <Modal
      open={open}
      centered
      onCancel={onClose}
      footer={[
        <div className="text-center">
          <Button onClick={onClose} type="secondary" className="custom-btn me-2 md:me-4 bg-gray-400 border-gray-500 text-white">{title == undefined ? "No": "Close"}</Button>
          {title == undefined &&
          <Button onClick={onConfirm} type="primary" className="bg-blue-50 border-blue-500 text-blue-500">Yes</Button>}
        </div>
      ]}
    >
      <div className="flex flex-col justify-center items-center">
        {title == undefined &&
        <p className="mb-5 text-md md:text-lg font-normal">
          Do You Want to Save Changes?
        </p>}
        {title &&
        <p className="mb-5 text-md md:text-lg font-normal">
        {title}
        </p>
}
      </div>
    </Modal>
  );
};

export default SaveConfirmationDialog;
