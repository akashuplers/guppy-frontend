import { Button, Dropdown, Space, message, Modal } from 'antd';
import { DownOutlined, LoadingOutlined  } from '@ant-design/icons';
import React, { useState, useEffect } from "react";
import { API_BASE_PATH, API_ROUTES } from '../../constants/api-endpoints';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const DownloadVersionSelectPopup = ({ open, story_id, handleDownload = () => {}, handleVersionSelect = () => {}, onClose = () => {} }) => {
    const navigate = useNavigate();
    const [isVersionLoading, setIsVersionLoading] = useState(false);
    const [versionItems, setVersionItems] = useState([]);
    const [selectedVersion, setSelectedVersion] = useState({label: 'Json Version'});

    const token = JSON.parse(localStorage.getItem("accessToken"));

    useEffect(() => {
        fetchVersionByStory(story_id);
    }, [])

    const handleJsonVersionClick = (e, items) => {
        const selectedItem = items.find(item => item.key === e.key);
        if (selectedItem) {
          setSelectedVersion(selectedItem);
          handleVersionSelect(selectedItem.key);
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
    <Modal
      open={open}
      centered
      onCancel={onClose}
      footer={[
        <div className="text-center">
          <Button onClick={onClose} className="custom-btn me-2 md:me-4 bg-gray-400 border-gray-500 text-white">Cancel</Button>
          <Button disabled={selectedVersion.label === "Json Version"} onClick={handleDownload} className="custom-btn me-2 md:me-4 bg-blue-400 border-blue-500 text-white">Download</Button>
        </div>
      ]}
    >
      <div className="flex flex-col justify-center items-center mb-6">
        <p className="mb-5 text-md md:text-lg font-normal">
            Please Select the Version to Download
        </p>
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
                      {selectedVersion.label}
                    </span>
                    {isVersionLoading ? <LoadingOutlined /> : <DownOutlined />}
                  </Space>
                </Button>
        </Dropdown>
      </div>
    </Modal>
  );
};

export default DownloadVersionSelectPopup;
