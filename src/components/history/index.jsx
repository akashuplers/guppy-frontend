import React, { useEffect, useState, useRef } from 'react'
import SidebarWithHeader from '../sidebar-with-header'
import { useNavigate } from 'react-router-dom';
import { Table, message } from 'antd';
import { API_BASE_PATH, API_ROUTES } from '../../constants/api-endpoints';
import axios from 'axios';
import ShareModal from '../home/ShareModal';
import { Dropdown, Space } from 'antd';
import { FilterOutlined } from '@ant-design/icons';
import DownloadVersionSelectPopup from '../home/DownloadVersionSelectPopup';
import DeleteConfirmationDialog from '../../utils/modals/DeleteConfirmationDialog';

const UserHistory = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [stories, setStories] = useState([]);
  const [filteredStories, setFilteredStories] = useState([]);
  const [isShareModalOpen, setShareModalOpen] = useState(false);
  const [storyDetails, setStoryDetails] = useState(null);
  const [users, setUsers] = useState([]);
  const [tempUsers, setTempUsers] = useState([]);
  const [shareIds, setShareIds] = useState([]);
  const [updatedShareIds, setUpdatedShareIds] = useState([]);
  const [showVersionModal, setShowVersionModal] = useState(false);
  const [isStoryDeleted, setIsStoryDeleted] = useState(false);
  const [showDeleteStoryModal, setShowDeleteStoryModal] = useState(false);
  const [selectedStoryId, setSelectedStoryId] = useState('');
  const [selectedVersionId, setSelectedVersionId] = useState('');
  const tokenVal = JSON.parse(localStorage.getItem("accessToken"));
  const errorMsg = "Error In Fetching Saved Response";
  const downloadLinkRef = useRef(null);

  useEffect(() => {
    if(!tokenVal) {
        navigate('/');
    } else {
        fetchStories();
        fetchUsers();
    }
  }, []);

  useEffect(() => {
    if(!tokenVal) {
        navigate('/');
    } else {
      isStoryDeleted && fetchStories();
    }
  }, [isStoryDeleted]);

  useEffect(() => {
    if(shareIds)
      handleSharedUsers();
  }, [shareIds, updatedShareIds]);

  const onClick = ({ key }) => {
    if(key==="all")
      setFilteredStories(stories);
    else
      setFilteredStories(stories.filter(story => story.story_world===key));
  };

  const getItems = () => {
    const uniqueStories = Array.from(new Set(stories.map(story => story.story_world)))
      .map(storyWorld => ({
        label: storyWorld,
        key: storyWorld,
      }));
      uniqueStories.push({label: "all", key: "all"});
    
    return uniqueStories;
  };  
  
  const items = getItems();

  const fetchUsers = async () => {
    try {
        const apiUrl = API_BASE_PATH + API_ROUTES.LIST_USERS;
        const config = {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenVal}`,
        },
        };
        const output = await axios.get(apiUrl, config);
        setUsers(output.data?.data);
        setTempUsers(output.data?.data);
    } catch (error) {
        console.log("error: ", error);
        message.error(errorMsg);
    }
  }

  const deleteStoryById = async () => {
    try {
      const apiUrl = API_BASE_PATH + API_ROUTES.STORY + `/${selectedStoryId}`;
      const config = {
      headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenVal}`,
      },
      };
      const response = await axios.delete(apiUrl, config);
      if(response.data?.message){
        message.success({content: response.data?.message, duration: 20});
        setIsStoryDeleted(true);
      }
  } catch (error) {
      console.log("error: ", error);
      message.error(errorMsg);
  }
    setShowDeleteStoryModal(false);
  }

  const handleSharedUsers = () => {
    const finalUsers = users.filter(user => !shareIds.includes(user._id) && !updatedShareIds.includes(user._id));
    setTempUsers(finalUsers);
  }

  const fetchStories = async () => {
    setIsLoading(true);
    let alertKey;
    try {
      // api call
      const apiUrl = API_BASE_PATH + API_ROUTES.LIST_STORIES_UPLOAD_BY_USER;

      const config = {
        headers: {
          Authorization: `Bearer ${tokenVal}`,
        },
      };
      alertKey = message.loading("Fetching Stories...", 0).key;
      const response = await axios.post(apiUrl, {}, config); // post api request
      const output = response?.data?.data;
      if(output) {
        setStories(output.slice().reverse());
        setFilteredStories(output.slice().reverse());
        message.destroy(alertKey);
        message.success("Stories Fetched Successfully !");
      } else {
        message.destroy(alertKey);
        message.error("Error In Fetching Stories !");
      }
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
            message.error("Error In Fetching Stories !");
            }
        }
    }
    setIsLoading(false);
  }

  const handleVersionSelect = (versionId) => {
    
    if (versionId) {
      setSelectedVersionId(versionId)
    } else {
      message.error("Please select a version to download.");
    }
  };

  const handleVersionDownload = () => {
    const apiUrl = `${API_BASE_PATH}${API_ROUTES.DOWNLOAD_VERSION_STORY}/${selectedVersionId}`;
    downloadLinkRef.current.href = apiUrl;
    downloadLinkRef.current.click(); 
    setShowVersionModal(false);
  }

  const formatDate = (updatedAt) => {
    const dateObject = new Date(updatedAt);
    
    // Format date
    const optionsDate = { month: 'short', day: 'numeric', year: 'numeric' };
    const formattedDate = dateObject.toLocaleDateString('en-US', optionsDate);
    
    // Format time
    const optionsTime = { hour: '2-digit', minute: '2-digit', hour12: true };
    const formattedTime = dateObject.toLocaleTimeString('en-US', optionsTime);

    return { date: formattedDate, time: formattedTime };
  };

  const historyColumns = [
    {
        dataIndex: "story_file_name",
        title: "Story File Name"
    },
    {
      dataIndex: "story_world",
      title: (<Dropdown menu={{ items, onClick }}>
      <a onClick={(e) => e.preventDefault()}>
        <Space>
          Story World
          <FilterOutlined style={{ fontSize: "12px",color: "#555", paddingTop: "5px" }} />
        </Space>
      </a>
    </Dropdown>)
    },
    {
        dataIndex: "story_id",
        title: "Story Id"
    },
    {
        dataIndex: "updatedAt",
        title: "Updated At",
        render: (val) => {
            return (
                <div className="flex-wrap text-light d-inline-flex gap gx-2">
                    <span className='me-2'>{formatDate(val)?.date}</span>
                    <span>{formatDate(val)?.time}</span>
              </div>
            )
        }
    },
    {
        dataIndex: "action",
        title: "Action",
        render: (val, record) => {
            return (
              <div style={{ display: 'flex', gap: '15px' }}>
                <button
                  title="View Story"
                  onClick={() => {
                    localStorage.setItem("storyId", JSON.stringify(record?.story_id));
                    navigate('/home');
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M9 6C9 4.34315 7.65685 3 6 3H4C2.34315 3 1 4.34315 1 6V8C1 9.65685 2.34315 11 4 11H6C7.65685 11 9 9.65685 9 8V6ZM7 6C7 5.44772 6.55228 5 6 5H4C3.44772 5 3 5.44772 3 6V8C3 8.55228 3.44772 9 4 9H6C6.55228 9 7 8.55228 7 8V6Z" fill="#0F0F0F" />
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M9 16C9 14.3431 7.65685 13 6 13H4C2.34315 13 1 14.3431 1 16V18C1 19.6569 2.34315 21 4 21H6C7.65685 21 9 19.6569 9 18V16ZM7 16C7 15.4477 6.55228 15 6 15H4C3.44772 15 3 15.4477 3 16V18C3 18.5523 3.44772 19 4 19H6C6.55228 19 7 18.5523 7 18V16Z" fill="#0F0F0F" />
                    <path d="M11 7C11 6.44772 11.4477 6 12 6H22C22.5523 6 23 6.44772 23 7C23 7.55228 22.5523 8 22 8H12C11.4477 8 11 7.55228 11 7Z" fill="#0F0F0F" />
                    <path d="M11 17C11 16.4477 11.4477 16 12 16H22C22.5523 16 23 16.4477 23 17C23 17.5523 22.5523 18 22 18H12C11.4477 18 11 17.5523 11 17Z" fill="#0F0F0F" />
                  </svg>
                </button>
                <button
                  title="Share story"
                  onClick={() => {
                    setShareModalOpen(true);
                    setStoryDetails({ 
                      storyId: record?.story_id || '', 
                      storyFileName: record?.story_file_name || ''
                    });
                    const ids = record?.shareIds || []; 
                    setShareIds(ids.map(share => share.userId));
                    setUpdatedShareIds([]);
                }}                
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path fill-rule="evenodd" clip-rule="evenodd" d="M19.6495 0.799565C18.4834 -0.72981 16.0093 0.081426 16.0093 1.99313V3.91272C12.2371 3.86807 9.65665 5.16473 7.9378 6.97554C6.10034 8.9113 5.34458 11.3314 5.02788 12.9862C4.86954 13.8135 5.41223 14.4138 5.98257 14.6211C6.52743 14.8191 7.25549 14.7343 7.74136 14.1789C9.12036 12.6027 11.7995 10.4028 16.0093 10.5464V13.0069C16.0093 14.9186 18.4834 15.7298 19.6495 14.2004L23.3933 9.29034C24.2022 8.2294 24.2022 6.7706 23.3933 5.70966L19.6495 0.799565ZM7.48201 11.6095C9.28721 10.0341 11.8785 8.55568 16.0093 8.55568H17.0207C17.5792 8.55568 18.0319 9.00103 18.0319 9.55037L18.0317 13.0069L21.7754 8.09678C22.0451 7.74313 22.0451 7.25687 21.7754 6.90322L18.0317 1.99313V4.90738C18.0317 5.4567 17.579 5.90201 17.0205 5.90201H16.0093C11.4593 5.90201 9.41596 8.33314 9.41596 8.33314C8.47524 9.32418 7.86984 10.502 7.48201 11.6095Z" fill="#0F0F0F" />
                      <path d="M7 1.00391H4C2.34315 1.00391 1 2.34705 1 4.00391V20.0039C1 21.6608 2.34315 23.0039 4 23.0039H20C21.6569 23.0039 23 21.6608 23 20.0039V17.0039C23 16.4516 22.5523 16.0039 22 16.0039C21.4477 16.0039 21 16.4516 21 17.0039V20.0039C21 20.5562 20.5523 21.0039 20 21.0039H4C3.44772 21.0039 3 20.5562 3 20.0039V4.00391C3 3.45162 3.44772 3.00391 4 3.00391H7C7.55228 3.00391 8 2.55619 8 2.00391C8 1.45162 7.55228 1.00391 7 1.00391Z" fill="#0F0F0F" />
                    </svg>
                </button>
                <button
                  title="Download story"
                  onClick={() => {
                    setShowVersionModal(true);
                    setSelectedStoryId(record?.story_id);
                  }}                
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M12.5535 16.5061C12.4114 16.6615 12.2106 16.75 12 16.75C11.7894 16.75 11.5886 16.6615 11.4465 16.5061L7.44648 12.1311C7.16698 11.8254 7.18822 11.351 7.49392 11.0715C7.79963 10.792 8.27402 10.8132 8.55352 11.1189L11.25 14.0682V3C11.25 2.58579 11.5858 2.25 12 2.25C12.4142 2.25 12.75 2.58579 12.75 3V14.0682L15.4465 11.1189C15.726 10.8132 16.2004 10.792 16.5061 11.0715C16.8118 11.351 16.833 11.8254 16.5535 12.1311L12.5535 16.5061Z" fill="#0F0F0F"/>
                    <path d="M3.75 15C3.75 14.5858 3.41422 14.25 3 14.25C2.58579 14.25 2.25 14.5858 2.25 15V15.0549C2.24998 16.4225 2.24996 17.5248 2.36652 18.3918C2.48754 19.2919 2.74643 20.0497 3.34835 20.6516C3.95027 21.2536 4.70814 21.5125 5.60825 21.6335C6.47522 21.75 7.57754 21.75 8.94513 21.75H15.0549C16.4225 21.75 17.5248 21.75 18.3918 21.6335C19.2919 21.5125 20.0497 21.2536 20.6517 20.6516C21.2536 20.0497 21.5125 19.2919 21.6335 18.3918C21.75 17.5248 21.75 16.4225 21.75 15.0549V15C21.75 14.5858 21.4142 14.25 21 14.25C20.5858 14.25 20.25 14.5858 20.25 15C20.25 16.4354 20.2484 17.4365 20.1469 18.1919C20.0482 18.9257 19.8678 19.3142 19.591 19.591C19.3142 19.8678 18.9257 20.0482 18.1919 20.1469C17.4365 20.2484 16.4354 20.25 15 20.25H9C7.56459 20.25 6.56347 20.2484 5.80812 20.1469C5.07435 20.0482 4.68577 19.8678 4.40901 19.591C4.13225 19.3142 3.9518 18.9257 3.85315 18.1919C3.75159 17.4365 3.75 16.4354 3.75 15Z" fill="#0F0F0F"/>
                  </svg>
                </button>
                <button
                  title="Delete story"
                  onClick={() => {
                    setSelectedStoryId(record?.story_id);
                    setShowDeleteStoryModal(true);
                    setIsStoryDeleted(false);
                }}
                >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L17.1991 18.0129C17.129 19.065 17.0939 19.5911 16.8667 19.99C16.6666 20.3412 16.3648 20.6235 16.0011 20.7998C15.588 21 15.0607 21 14.0062 21H9.99377C8.93927 21 8.41202 21 7.99889 20.7998C7.63517 20.6235 7.33339 20.3412 7.13332 19.99C6.90607 19.5911 6.871 19.065 6.80086 18.0129L6 6M4 6H20M16 6L15.7294 5.18807C15.4671 4.40125 15.3359 4.00784 15.0927 3.71698C14.8779 3.46013 14.6021 3.26132 14.2905 3.13878C13.9376 3 13.523 3 12.6936 3H11.3064C10.477 3 10.0624 3 9.70951 3.13878C9.39792 3.26132 9.12208 3.46013 8.90729 3.71698C8.66405 4.00784 8.53292 4.40125 8.27064 5.18807L8 6M14 10V17M10 10V17" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                </button>
              </div>
            )
        }
    },
  ];

  return (
    <SidebarWithHeader>
        <div>
            {/* head */}
            <p className="mt-1 mb-2 text-xl font-medium md:text-3xl md:mb-0">User History</p>

            {/* body */}
            <div className='mt-8'>
              {!isLoading &&
                <Table
                  dataSource={filteredStories}
                  columns={historyColumns}
                  bordered
                />
              }
            </div>
            <a ref={downloadLinkRef} style={{ display: 'none' }} download></a>
            <ShareModal open={isShareModalOpen} storyDetails={storyDetails} users={tempUsers} onClose={() => setShareModalOpen(false)} updateUsers={(ids) => setUpdatedShareIds(ids)}/>
            {showVersionModal && <DownloadVersionSelectPopup open={showVersionModal} story_id={selectedStoryId} handleVersionSelect = {handleVersionSelect} handleDownload = {handleVersionDownload} onClose={() => setShowVersionModal(false)}/>}
            {showDeleteStoryModal && 
              <DeleteConfirmationDialog
                open={showDeleteStoryModal}
                onClose={() => setShowDeleteStoryModal(false)}
                onConfirm={() => deleteStoryById()}
              />
            }
        </div>
    </SidebarWithHeader>
  )
}

export default UserHistory