import React, { useEffect, useState } from 'react'
import SidebarWithHeader from '../sidebar-with-header'
import { useNavigate } from 'react-router-dom';
import { Table, message } from 'antd';
import { API_BASE_PATH, API_ROUTES } from '../../constants/api-endpoints';
import axios from 'axios';

const UserHistory = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [stories, setStories] = useState([]);

  useEffect(() => {
    const tokenVal = JSON.parse(localStorage.getItem("accessToken"));
    if(!tokenVal) {
        navigate('/');
    } else {
        fetchStories(tokenVal);
    }
  }, []);

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
      const response = await axios.get(apiUrl, config); // post api request
      const output = response?.data?.data;
      if(output) {
        setStories(output.slice().reverse());
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
                <div
                    className='text-blue-600 underline cursor-pointer'
                    onClick={() => {
                        localStorage.setItem("storyId", JSON.stringify(record?.story_id));
                        navigate('/home');
                    }}
                >
                    View
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
                        dataSource={stories}
                        columns={historyColumns}
                        bordered
                    />
                }
            </div>


        </div>
    </SidebarWithHeader>
  )
}

export default UserHistory