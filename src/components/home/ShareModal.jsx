
import { Button, Modal } from "antd";
import React, { useEffect, useState } from "react";

const ShareModal = ({ open, storyId, users, onClose = () => {}}) => {

    // const [selectedUserIds, setSelectedUserIds] = useState([]);

    // const handleCheckboxChange = (userId) => {
    //     setSelectedUserIds((prev) => {
    //       if (prev.includes(userId)) {
    //         // If already selected, remove it
    //         return prev.filter(id => id !== userId);
    //       } else {
    //         // If not selected, add it
    //         return [...prev, userId];
    //       }
    //     });
    //   };

  return (
    <Modal
      open={open}
      centered
      onCancel={onClose}
      footer={[
        <div className="flex gap-4 justify-center">
            
          <Button onClick={() => {}} type="primary" className="bg-blue-50 border-blue-500 text-blue-500">
            Share
          </Button>
          <Button
            onClick={onClose}
            type="secondary"
            className="custom-btn bg-red-300 hover:bg-red-400 border-red-400 text-white"
          >
            Cancel
          </Button>
        </div>
      ]}
    >
        <div>
            <p className="text-xl md:text-2xl mt-1 mb-5 font-medium">Share Story via Users</p>
            <div className="max-h-52 overflow-y-auto p-2">
                {users.map(user => (
                <div key={user._id} className="flex items-center gap-2 mb-2">
                    <input
                        type="checkbox"
                        id={user._id}
                        // onChange={() => handleCheckboxChange(user._id)} // Handle checkbox change
                        // checked={selectedUserIds.includes(user._id)}
                        className="h-4 w-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor={user._id} className="text-sm text-gray-500">{user.email}</label>
                </div>
                ))}
            </div>
        </div>

    </Modal>
  );
};

export default ShareModal;
