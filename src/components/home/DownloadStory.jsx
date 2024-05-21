import React, { useContext, useState } from "react";
import { Button, Popconfirm, message } from "antd";
import { StoryUploadApiContext } from "../../contexts/ApiContext";
import { API_BASE_PATH, API_ROUTES } from "../../constants/api-endpoints";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import successGif from "../../assets/success_icon.gif";

const DownloadStory = ({ onDiscard = () => {} }) => {
  // story upload context
  const { storyUploadApiResponse } = useContext(StoryUploadApiContext);
  
  const navigate = useNavigate();
  const { storyWorld, token, storyWorldId } = storyUploadApiResponse;
  const [showResetPopConfirm, setShowResetPopConfirm] = useState(false);
  const [showLogoutPopConfirm, setShowLogoutPopConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleExport = async () => {
    setIsSubmitting(true);
    try {
      // api call
      const apiUrl = API_BASE_PATH + API_ROUTES.DOWNLOAD_STORY + `?id=${storyWorldId}`;

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      message.loading("Processing...");
      const response = await axios.get(apiUrl, config); // get api request
      console.log("download story response: ", response);
      const output = response?.data;
      if(output) {        
        
      } else {
        message.error("Error In Export ! Unable To Download Story !");
      }
    } catch (error) {
      console.error("Error:", error);
      const statusCode = error?.response?.status;
      if (statusCode === 401) {
        message.error("Not Authorized ! You need to login first !");
        navigate("/");
      } else if (statusCode === 500) {
        message.error("Internal Server Error !");
      } else {
        const errorMessage = error?.response?.data?.message;
        if (errorMessage) {
          message.error(errorMessage);
        } else {
            message.error("Error In Export ! Unable To Download Story !");
        }
      }
    }
    setIsSubmitting(false);
  }

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    navigate("/");
    message.success("You Have Been Logged Out Successfully !");
  }

  return (
    <div className="px-5 pb-5 rounded-md border">
      <p className="text-lg underline md:text-xl font-medium mt-5 mb-3 md:mb-5">
        Story Download
      </p>
      <p className="text-lg md:text-xl mb-2 text-violet-500">{storyWorld}</p>

      <div className="flex flex-col items-center">
        <img className="h-20 w-20" src={successGif} alt="success-gif" />
        <p className="text-md md:text-lg mb-4 md:mb-6">
          Your Data Has Been Saved Successfully.
        </p>
      </div>

      <div className="flex justify-center mt-3">
        <Popconfirm
            title="Restart From Uploads"
            description="Are you sure you want to discard all changes and restart?"
            open={showResetPopConfirm}
            onOpenChange={() => setShowResetPopConfirm(!showResetPopConfirm)}
            onConfirm={onDiscard}
            onCancel={() => setShowResetPopConfirm(false)}
            okButtonProps={{ className: 'bg-blue-500 border-blue-600 text-white' }}
            cancelButtonProps={{ className: 'bg-gray-100' }}
            okText="Yes"
            cancelText="No"
        >
            <Button
                type="secondary"
                className="border-gray-600 bg-gray-200 hover:bg-gray-300 h-9 me-4"
            >
                Restart From Uploads
            </Button>
        </Popconfirm>
        <Button
            className="bg-blue-500 border-blue-600 text-white h-9 me-4"
            onClick={handleExport}
            loading={isSubmitting}
        >
          Export
        </Button>
        <Popconfirm
            title="Logout"
            description="Are you sure you want to logout?"
            open={showLogoutPopConfirm}
            onOpenChange={() => setShowLogoutPopConfirm(!showLogoutPopConfirm)}
            onConfirm={handleLogout}
            onCancel={() => setShowLogoutPopConfirm(false)}
            okButtonProps={{ className: 'bg-blue-500 border-blue-600 text-white' }}
            cancelButtonProps={{ className: 'bg-gray-100' }}
            okText="Yes"
            cancelText="No"
        >
            <Button danger className="h-9 bg-red-50">
                Logout
            </Button>
        </Popconfirm>
      </div>
    </div>
  );
};

export default DownloadStory;
