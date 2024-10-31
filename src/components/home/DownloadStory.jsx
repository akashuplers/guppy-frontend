import React, { useContext, useState } from "react";
import { Button, Popconfirm, message } from "antd";
import { StoryUploadApiContext } from "../../contexts/ApiContext";
import { API_BASE_PATH, API_ROUTES } from "../../constants/api-endpoints";
import { useNavigate } from "react-router-dom";
import successGif from "../../assets/success_icon.gif";

const DownloadStory = ({ onDiscard = () => {} }) => {
  // story upload context
  const { storyUploadApiResponse } = useContext(StoryUploadApiContext);

  const navigate = useNavigate();
  const { storyWorld, storyWorldId, story_id } = storyUploadApiResponse;
  const [showResetPopConfirm, setShowResetPopConfirm] = useState(false);
  const [showLogoutPopConfirm, setShowLogoutPopConfirm] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState('older');
  const userId = localStorage.getItem("userId");
  const apiUrl = API_BASE_PATH + API_ROUTES.DOWNLOAD_STORY + `?id=${storyWorldId}` + `&storyId=${story_id}` + `&userId=${userId}` + `&saveOlderVersion=${selectedVersion === "older"}`;

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('storyId');
    navigate("/");
    message.success("You Have Been Logged Out Successfully !");
  }

  return (
    <div className="px-5 pb-5 rounded-md border">
      <div className="text-lg flex flex-col md:flex-row justify-between md:text-xl mt-5 mb-3 md:mb-4">
        <p>Download Story</p>
        {storyWorld &&
          <p className="text-lg md:text-xl mt-2 md:mt-0">
            Story World : <span className="text-violet-500">{storyWorld}</span>
          </p>
        }
      </div>

      <div className="flex flex-col items-center">
        <img className="h-20 w-20" src={successGif} alt="success-gif" />
        <p className="text-md md:text-lg mb-4 md:mb-6">
          Your Data Has Been Saved Successfully.
        </p>
      </div>

      <div className="flex flex-col items-center gap-2">
          <label className="text-sm">
              <input
                  type="radio"
                  value="older"
                  checked={selectedVersion === 'older'}
                  onChange={() => setSelectedVersion('older')}
                  className="w-4 h-4 mr-3 mb-1 text-green-600 border-gray-300 disabled:bg-gray-200 focus:ring-blue-500 focus:ring-2"
              />
              Older Version
          </label>

          <label className="text-sm">
              <input
                  type="radio"
                  value="newer"
                  checked={selectedVersion === 'newer'}
                  onChange={() => setSelectedVersion('newer')}
                  className="w-4 h-4 ml-1 mr-3 mb-1 text-green-600 border-gray-300 disabled:bg-gray-200 focus:ring-blue-500 focus:ring-2"
              />
              Newer Version
          </label>
      </div>

      <div className="flex justify-center mt-3">
        {/* restart button */}
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

        {/* export button */}
        <a href={apiUrl} target="_blank" rel="noopener noreferrer">
            <Button
              className="bg-blue-500 border-blue-600 text-white h-9 me-4"
              onClick={() => localStorage.removeItem("storyId")}
            >
              Export
            </Button>
        </a>

        {/* ner harmonization button */}
        <a> {/* call the ner harmonization api url */}
            <Button
              type="secondary"
              className="bg-blue-500 border-blue-600 text-white h-9 me-4"
              onClick={() => console.log("ner harmonization in progress")}
            >
              Run Ner Harmonization
            </Button>
        </a>


        {/* logout button */}
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
