import React, { useEffect, useContext, useState } from "react";
import { Button, Popconfirm, message, Dropdown, Space } from "antd";
import { StoryUploadApiContext } from "../../contexts/ApiContext";
import { API_BASE_PATH, API_ROUTES } from "../../constants/api-endpoints";
import { useNavigate } from "react-router-dom";
import successGif from "../../assets/success_icon.gif";
import VersionSelectPopup from "./VersionSelectPopup";
import { DownOutlined, LoadingOutlined  } from '@ant-design/icons';
import axios from 'axios';

const DownloadStory = ({ onDiscard = () => {} }) => {
  // story upload context
  const { storyUploadApiResponse } = useContext(StoryUploadApiContext);

  const navigate = useNavigate();
  const { storyWorld, storyWorldId, story_id } = storyUploadApiResponse;
  const [showResetPopConfirm, setShowResetPopConfirm] = useState(false);
  const [showLogoutPopConfirm, setShowLogoutPopConfirm] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState('older');
  const [isVersionLoading, setIsVersionLoading] = useState(false);
  const [selectedType, setSelectedType] = useState('all');
  const [isVersionSelectOpen, setIsVersionSelectOpen] = useState(true);
  const [versionItems, setVersionItems] = useState([]);
  const [selectedJsonVersion, setSelectedJsonVersion] = useState({label: 'Json Version', key: "json version"});
  const userId = localStorage.getItem("userId");
  const apiUrl = API_BASE_PATH + API_ROUTES.DOWNLOAD_STORY + `?id=${storyWorldId}` + `&storyId=${story_id}` + `&userId=${userId}` 
  + `&saveOlderVersion=${selectedVersion === "older"}`
  + `&versionId=${selectedJsonVersion.key}`
  + (selectedType !== "all" && `?type=${selectedType}`);
  const token = JSON.parse(localStorage.getItem("accessToken"));

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('storyId');
    navigate("/");
    message.success("You Have Been Logged Out Successfully !");
  }

  useEffect(() => {
    fetchVersionByStory(story_id);
}, [])

const handleJsonVersionClick = (e, items) => {
    const selectedItem = items.find(item => item.key === e.key);
    if (selectedItem) {
      setSelectedJsonVersion(selectedItem);
    }
};

const fetchVersionByStory = async (story_id) => {
    setIsVersionLoading(true);
    let alertKey;
    try {
      // api call
      const apiUrl = API_BASE_PATH + API_ROUTES.LIST_VERSIONS + story_id;

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      alertKey = message.loading("Fetching Versions...", 0).key;
      const response = await axios.get(apiUrl, config); 
      const output = response?.data?.data;
      if (output?.length) {
        const storyVersions = output.slice().reverse().map(storyVersion => ({
          label: storyVersion.version,
          key: storyVersion._id,
        }));
      
        setVersionItems(
          storyVersions.length > 0 
            ? storyVersions 
            : [{ label: 'Json Version', key: 'version' }]
        );
      
        message.success("Versions Fetched Successfully!");
      }
      message.destroy(alertKey);
    } catch (error) {
        console.error("Error:", error);
        message.destroy(alertKey);
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
            message.error("Error In Fetching Versions !");
            }
        }
    }
    setIsVersionLoading(false);
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
      <div className="flex flex-col items-center mb-5">
        <Dropdown
            menu={{
              items: versionItems.length > 0 ? versionItems : [{label: "No Versions For this Story", key: "No Version"}],
              onClick: (e) => handleJsonVersionClick(e, versionItems),
            }}
            style={{ width: 200 }}
            dropdownRender={(menu) => (
              <div style={{ maxHeight: '50vh', overflowY: 'auto', backgroundColor: 'white' }}>
                {menu}
              </div>
            )}
          >
            <Button className="bg-white border border-gray-300 rounded-lg shadow-lg px-4 py-1 pt-0 text-gray-700 hover:bg-gray-100 focus:bg-gray-200 transition duration-150">
              <Space>
                <span
                  style={{
                    maxWidth: '100px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    display: 'inline-block',
                    verticalAlign: 'middle'
                  }}
                >
                  {selectedJsonVersion.label}
                </span>
                {isVersionLoading ? <LoadingOutlined /> : <DownOutlined />}
              </Space>
            </Button>
          </Dropdown>
        </div>
        
        <div className="flex flex-col items-center gap-2">
          <p className="text-sm text-gray-600 font-medium">
            Select Type <span className="text-red-500">*</span>
          </p>
          
          <div className="flex flex-row items-center gap-4">

            <label className="text-sm flex items-center">
              <input
                type="radio"
                value="all"
                checked={selectedType === 'all'}
                onChange={() => setSelectedType('all')}
                className="w-4 h-4 text-green-600 border-gray-300 disabled:bg-gray-200 focus:ring-blue-500 focus:ring-2"
              />
              <span className="ml-2">All</span>
            </label>

            <label className="text-sm flex items-center">
              <input
                type="radio"
                value="inserted"
                checked={selectedType === 'inserted'}
                onChange={() => setSelectedType('inserted')}
                className="w-4 h-4 text-green-600 border-gray-300 disabled:bg-gray-200 focus:ring-blue-500 focus:ring-2"
              />
              <span className="ml-2">Inserted</span>
            </label>

            <label className="text-sm flex items-center">
              <input
                type="radio"
                value="updated"
                checked={selectedType === 'updated'}
                onChange={() => setSelectedType('updated')}
                className="w-4 h-4 text-green-600 border-gray-300 disabled:bg-gray-200 focus:ring-blue-500 focus:ring-2"
              />
              <span className="ml-2">Updated</span>
            </label>
          </div>
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
              disabled={selectedJsonVersion.label==="Json Version"}
            >
              Export
            </Button>
        </a>
        {console.log(apiUrl,'apiUrl')}

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
      <VersionSelectPopup open={isVersionSelectOpen} handleSelect = {(versionType) => {setSelectedVersion(versionType); setIsVersionSelectOpen(false);}} onCancel={() => setIsVersionSelectOpen(false)}/>
    </div>
  );
};

export default DownloadStory;
