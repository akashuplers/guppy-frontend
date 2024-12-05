
import { Button, message, Modal } from "antd";
import React, { useState } from "react";
import { API_BASE_PATH, API_ROUTES } from '../../constants/api-endpoints';
import axios from 'axios';

const ShareModal = ({ open, storyDetails, users, updateUsers = () => {}, onClose = () => {}}) => {

  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const token = JSON.parse(localStorage.getItem("accessToken"));

  const handleCheckboxChange = (userId) => {
    setSelectedUserIds((prev) => {
      if (prev.includes(userId)) {
        // If already selected, remove it
        return prev.filter(id => id !== userId);
      } else {
        // If not selected, add it
        return [...prev, userId];
      }
    });
    };

  const shareStoryToUsers = async () => {
    try {
        const apiUrl = `${API_BASE_PATH}${API_ROUTES.SHARE}${storyDetails?.storyId}`;
        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        };
        
        const body = { userIds: selectedUserIds };
        const output = await axios.post(apiUrl, body, config);

        message.success(output.data.message);

        updateUsers(selectedUserIds);
        setSelectedUserIds([]);
    } catch (error) {
        console.error("Error:", error);
        const errorMsg = error.response?.data?.message || 'An error occurred. Please try again.';
        message.error(errorMsg);
    }
};


  return (
    <Modal
      open={open}
      centered
      onCancel={onClose}
      footer={[
        <div className="flex gap-4 justify-center">
            
          <Button onClick={shareStoryToUsers} type="primary" className="bg-blue-50 border-blue-500 text-blue-500">
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
          <p className="text-xl md:text-2xl mb-5 font-medium">Share Story via Users
            <span className="text-sm text-gray-500 ml-2">({storyDetails?.storyFileName})</span></p>

            <div className="max-h-52 overflow-y-auto p-2">
                {users.map(user => (
                <div key={user._id} className="flex items-center gap-2 mb-2">
                    <input
                        type="checkbox"
                        id={user._id}
                        onChange={() => handleCheckboxChange(user._id)} // Handle checkbox change
                        checked={selectedUserIds.includes(user._id)}
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
