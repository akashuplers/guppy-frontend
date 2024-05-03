import { Button, Modal } from "antd";
import React from "react";
import deleteGif from "../../assets/delete_anime.gif";

const DeleteConfirmationDialog = ({ open, onClose = () => { }, onConfirm = () => { } }) => {

  const handleDelete = () => {
    onConfirm();
    onClose();
  }

  return (
    <Modal
      open={open}
      centered
      onCancel={onClose}
      footer={[
        <div className="text-center">
          <Button onClick={onClose} className="custom-btn me-2 md:me-4 bg-gray-400 border-gray-500 text-white">Cancel</Button>
          <Button onClick={handleDelete} danger className="bg-red-50">Yes, Confirm</Button>
        </div>
      ]}
    >
      <div className="flex flex-col justify-center items-center">
        <img className="h-[100px] md:h-[180px] w-[100px] md:w-[180px]" src={deleteGif} alt="delete-gif" />
        <p className="text-xl md:text-3xl">Are you sure?</p>
        <p className="mb-5 text-md md:text-lg font-normal">
          Are you sure you want to delete this item?
        </p>
      </div>
    </Modal>
  );
};

export default DeleteConfirmationDialog;
