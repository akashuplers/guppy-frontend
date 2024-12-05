import { Button, Modal } from "antd";
import React, { useState } from "react";

const VersionSelectPopup = ({ open, onCancel = () => {}, handleSelect = () => {}}) => {

  const [showError, setShowError] = useState(false);
  const [version, setVersion] = useState('');
  return (
    <Modal
      open={open}
      centered
      onCancel={() => version!=="" ? onCancel() : setShowError("choose one version!")}
      footer={[
        <div className="text-center">
          <Button onClick={() => {handleSelect("older"); setVersion("older");}} className="custom-btn me-2 md:me-4 bg-blue-500 border-blue-500 text-white">Current Version</Button>
          <Button onClick={() => {handleSelect("newer"); setVersion("newer");}} className="custom-btn me-2 md:me-4 bg-gray-500 border-gray-500 text-white">Newer Version</Button>
        </div>
      ]}
    >
      <div className="flex flex-col justify-center items-center">
        <p className="mb-5 text-md md:text-lg font-normal">
            Do you want to save to the current version or the newer version?
        </p>
        <div className="info-message mb-4 p-3 bg-gray-100 border border-gray-300 rounded">
          <p className="text-sm text-gray-700">
            <strong>Note:</strong> If <strong>Current Version</strong> is selected, your <strong>Story</strong> data will be overridden in the current version. 
            If <strong>Newer Version</strong> is selected, your changes will be saved separately as a newer version.
          </p>
        </div>
        {showError && (
            <span style={{ color: 'red', fontSize: '12px', display: 'block', marginTop: '4px' }}>
            * Choose one option to proceed
            </span>
        )}
      </div>
    </Modal>
  );
};

export default VersionSelectPopup;
