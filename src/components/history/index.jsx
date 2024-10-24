import React, { useEffect, useState } from 'react'
import SidebarWithHeader from '../sidebar-with-header'
import { useNavigate } from 'react-router-dom';
import { Table, message } from 'antd';
import { API_BASE_PATH, API_ROUTES } from '../../constants/api-endpoints';
import axios from 'axios';
import ShareModal from '../home/ShareModal';
import { Dropdown, Space } from 'antd';
import { FilterOutlined } from '@ant-design/icons';

const UserHistory = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [stories, setStories] = useState([]);
  const [filteredStories, setFilteredStories] = useState([]);
  const [isShareModalOpen, setShareModalOpen] = useState(false);
  const [storyId, setStoryId] = useState(null);
  const [users, setUsers] = useState([]);
  const [shareIds, setShareIds] = useState([]);
  const tokenVal = JSON.parse(localStorage.getItem("accessToken"));
  const errorMsg = "Error In Fetching Saved Response";

  useEffect(() => {
    if(!tokenVal) {
        navigate('/');
    } else {
        fetchStories(tokenVal);
        fetchUsers(tokenVal);
    }
  }, []);

  useEffect(() => {
    if(storyId && shareIds)
      handleSharedUsers();
  }, [storyId]);

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

  const fetchUsers = async (token) => {
    try {
        const apiUrl = API_BASE_PATH + API_ROUTES.LIST_USERS;
        const config = {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        };
        const output = await axios.get(apiUrl, config);
        setUsers(output.data?.data);
        console.log('users',output);
    } catch (error) {
        console.log("error: ", error);
        message.error(errorMsg);
    }
}

const handleSharedUsers = () => {
  const sharedUserIds = shareIds.map(share => share.userId);
  const finalUsers = users.filter(user => !sharedUserIds.includes(user._id));
  setUsers(finalUsers);
}
  const fetchStories = async (token) => {
    setIsLoading(true);
    let alertKey;
    try {
      // api call
      const apiUrl = API_BASE_PATH + API_ROUTES.LIST_STORIES_UPLOAD_BY_USER;

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
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
                <div className="text-light d-inline-flex flex-wrap gap gx-2">
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
                  } }
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
                  onClick={() => 
                    {
                    setShareModalOpen(true); 
                    setStoryId(record?.story_id);
                    console.log('kukka',record);
                    setShareIds(record?.shareIds);
                  }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path fill-rule="evenodd" clip-rule="evenodd" d="M19.6495 0.799565C18.4834 -0.72981 16.0093 0.081426 16.0093 1.99313V3.91272C12.2371 3.86807 9.65665 5.16473 7.9378 6.97554C6.10034 8.9113 5.34458 11.3314 5.02788 12.9862C4.86954 13.8135 5.41223 14.4138 5.98257 14.6211C6.52743 14.8191 7.25549 14.7343 7.74136 14.1789C9.12036 12.6027 11.7995 10.4028 16.0093 10.5464V13.0069C16.0093 14.9186 18.4834 15.7298 19.6495 14.2004L23.3933 9.29034C24.2022 8.2294 24.2022 6.7706 23.3933 5.70966L19.6495 0.799565ZM7.48201 11.6095C9.28721 10.0341 11.8785 8.55568 16.0093 8.55568H17.0207C17.5792 8.55568 18.0319 9.00103 18.0319 9.55037L18.0317 13.0069L21.7754 8.09678C22.0451 7.74313 22.0451 7.25687 21.7754 6.90322L18.0317 1.99313V4.90738C18.0317 5.4567 17.579 5.90201 17.0205 5.90201H16.0093C11.4593 5.90201 9.41596 8.33314 9.41596 8.33314C8.47524 9.32418 7.86984 10.502 7.48201 11.6095Z" fill="#0F0F0F" />
                      <path d="M7 1.00391H4C2.34315 1.00391 1 2.34705 1 4.00391V20.0039C1 21.6608 2.34315 23.0039 4 23.0039H20C21.6569 23.0039 23 21.6608 23 20.0039V17.0039C23 16.4516 22.5523 16.0039 22 16.0039C21.4477 16.0039 21 16.4516 21 17.0039V20.0039C21 20.5562 20.5523 21.0039 20 21.0039H4C3.44772 21.0039 3 20.5562 3 20.0039V4.00391C3 3.45162 3.44772 3.00391 4 3.00391H7C7.55228 3.00391 8 2.55619 8 2.00391C8 1.45162 7.55228 1.00391 7 1.00391Z" fill="#0F0F0F" />
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
            <p className="text-xl md:text-3xl mt-1 mb-2 md:mb-0 font-medium">User History</p>

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

            <ShareModal open={isShareModalOpen} storyId={storyId} users={users} onClose={() => setShareModalOpen(false)}/>
        </div>
    </SidebarWithHeader>
  )
}

export default UserHistory