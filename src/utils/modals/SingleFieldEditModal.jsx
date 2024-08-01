import { Button, Modal } from "antd";
import React, { useEffect, useState } from "react";

const SingleFieldEditModal = ({ open, type, field, onClose = () => {}, editItem, onUpdate = () => {} }) => {

  const [currentValue, setCurrentValue] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    setCurrentValue(editItem ? editItem : '');
  }, []);

  const handleChange = (e) => {
    setError(false);
    setCurrentValue(e.target.value);
  }

  const handleUpdate = () => {
    if(currentValue) {
      onUpdate(currentValue);
      onClose();
    } else {
      setError(true);
    }
  }

  return (
    <Modal
      open={open}
      centered
      onCancel={onClose}
      footer={[
        <div className="">
          <Button
            onClick={onClose}
            type="secondary"
            className="custom-btn mt-2 md:mt-4 me-2 md:me-3 bg-gray-400 hover:bg-gray-500 border-gray-500 text-white"
          >
            Cancel
          </Button>
          <Button onClick={handleUpdate} type="primary" className="bg-blue-50 border-blue-500 text-blue-500">
            {type==='Edit' ? 'Update' : 'Add'}
          </Button>
        </div>,
      ]}
    >
      <div>
        {field ?
          <p
            style={{ fontSize: "15px" }}
            className="mt-4 mb-1"
          >
            {field}
          </p>
          :
          <p className="mb-9" />
        }
        <input
          type="text"
          value={currentValue}
          onChange={handleChange}
          className="bg-gray-50 w-full border p-2 border-gray-300 text-gray-900 sm:text-md rounded-lg focus:ring-primary-600 focus:border-primary-600 block p-2"
        />
        {error &&
          <p className="text-red-500 text-sm">
            This Field Cannot Be Empty
          </p>
        }
      </div>
    </Modal>
  );
};

export default SingleFieldEditModal;
