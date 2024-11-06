import SidebarWithHeader from "../sidebar-with-header";
import { DownOutlined, LoadingOutlined  } from '@ant-design/icons';
import { Button, Dropdown, Space, message } from 'antd';
import JsonBody from "./JsonBody";
import { useEffect, useState } from "react";
import { API_BASE_PATH, API_ROUTES } from '../../constants/api-endpoints';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CompareJsons = () => {
  const navigate = useNavigate();
  const [selectedStory, setSelectedStory] = useState({label: 'Story', key: 'story'});
  const [selectedStoryWorld, setSelectedStoryWorld] = useState({label: 'Story World', key: 'story world'});
  const [storyWorldItems, setStoryWorldItems] = useState([]);
  const [storyItems, setStoryItems] = useState([]);
  const [versionItems, setVersionItems] = useState([]);
  const [leftVersionData, setLeftVersionData] = useState([]);
  const [rightVersionData, setRightVersionData] = useState([]);
  const [selectedVersion1, setSelectedVersion1] = useState({label: 'Json Version', key: 'version1'});
  const [selectedVersion2, setSelectedVersion2] = useState({label: 'Json Version', key: 'version2'});
  const [isStoryLoading, setIsStoryLoading] = useState(false);
  const [isStoryWorldLoading, setIsStoryWorldLoading] = useState(false);
  const [isVersionLoading, setIsVersionLoading] = useState(false);
  const [isLeftVersionLoading, setIsLeftVersionLoading] = useState(false);
  const [isRightVersionLoading, setIsRightVersionLoading] = useState(false);
  const tokenVal = JSON.parse(localStorage.getItem("accessToken"));

  useEffect(() => {
    if(!tokenVal) {
        navigate('/');
    } else {
        fetchAllStories(tokenVal);
    }
  }, []);

  useEffect( () => {
    if(selectedVersion1.label === "No Versions" || selectedVersion2.label === "No Versions")
    {
      setRightVersionData([]);
      setLeftVersionData([]);
    }
  },[selectedVersion1, selectedVersion2])

  useEffect(()=> {
    setSelectedVersion1({label: 'Json Version', key: 'version1'});
    setSelectedVersion2({label: 'Json Version', key: 'version2'});
  },
  [selectedStoryWorld,selectedStory])

  const getButtonDisableState = () => {
    const isDisabled = selectedStory.label !== "Story" && selectedStoryWorld.label !== "Story World" && selectedVersion1.label !== "Json Version" && selectedVersion2.label !== "Json Version" && selectedVersion1.label !== "No Versions" && selectedVersion2.label !== "No Versions";
    return isDisabled;  }

  const handleStoryItemClick = (e, items) => {
    if (selectedStoryWorld.label === "Story World") {
      message.warning("Please select Story World first.");
      return;
    }
    const selectedItem = items.find(item => item.key === e.key);
    if (selectedItem) {
      setSelectedStory(selectedItem);
      fetchVersionByStory(tokenVal, selectedItem.key);
      console.log('Selected item label:', selectedItem);
    }
  };
  
  const handleStoryWorldClick = (e, items) => {
    const selectedItem = items.find(item => item.key === e.key);
    if (selectedItem) {
      setSelectedStoryWorld(selectedItem);
      fetchStoryByStoryWorld(tokenVal, selectedItem.key);
    }
  };
  
  const handleJsonVersion1Click = (e, items) => {
    if (selectedStoryWorld.label === "Story World" || selectedStory.label === "Story") {
      message.warning("Please select Story World and Story first.");
      return;
    }
    const selectedItem = items.find(item => item.key === e.key);
    if (selectedItem) {
      setSelectedVersion1(selectedItem);
    }
  };
  
  const handleJsonVersion2Click = (e, items) => {
    if (selectedStoryWorld.label === "Story World" || selectedStory.label === "Story") {
      message.warning("Please select Story World and Story first.");
      return;
    }
    const selectedItem = items.find(item => item.key === e.key);
    if (selectedItem) {
      setSelectedVersion2(selectedItem);
    }
  };

  const fetchAllStories = async (token) => {
    setIsStoryWorldLoading(true);
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
        const data = output.slice().reverse();
        const storyWorldMap = new Map();

        data.forEach(story => {
          if (!storyWorldMap.has(story.story_world_id)) {
            storyWorldMap.set(story.story_world_id, story.story_world);
          }
        });

        const storyWorlds = Array.from(storyWorldMap.entries()).map(([id, name]) => ({
          label: name,
          key: id,
        }));

        setStoryWorldItems(
          storyWorlds.length > 0 
            ? storyWorlds 
            : [{ label: 'No Story Worlds', key: 'story world' }]
        );
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
    setIsStoryWorldLoading(false);
  }

  const fetchStoryByStoryWorld = async (token, story_world_id) => {
    setIsStoryLoading(true);
    let alertKey;
    try {
      // api call
      const apiUrl = API_BASE_PATH + API_ROUTES.LIST_STORIES + story_world_id;

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      alertKey = message.loading("Fetching Stories...", 0).key;
      const response = await axios.get(apiUrl, config); 
      const output = response?.data?.data;
      if(output) {
        const data = output.slice().reverse();
        
        const stories = Array.from(data.map(story => { return {story_id: story.story_id, story_file_name: story.story_file_name}}))
        .map(story => ({
          label: story.story_file_name,
          key: story.story_id,
        }));
        setStoryItems(
          stories.length > 0 
            ? stories 
            : [{ label: 'No Stories', key: 'story' }]
        );
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
    setIsStoryLoading(false);
  }

  const fetchVersionByStory = async (token, story_id) => {
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
      alertKey = message.loading("Fetching Stories...", 0).key;
      const response = await axios.get(apiUrl, config); 
      const output = response?.data?.data;
      if(output) {
        const data = output.slice().reverse();
        
        const storyVersions = Array.from(data.map(storyVersion => { return {version_id: storyVersion._id, version: storyVersion.version}}))
        .map(story => ({
          label: story.version,
          key: story.version_id,
        }));
        setVersionItems(
          storyVersions.length > 0 
            ? storyVersions 
            : [{ label: 'No Versions', key: 'version' }]
        );
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
    setIsVersionLoading(false);
  }

  const fetchVersionDetails = async (token, type, version_id) => {
    type === "left" ? setIsLeftVersionLoading(true) : setIsRightVersionLoading(true);
    try {
      // api call
      const apiUrl = API_BASE_PATH + API_ROUTES.FETCH_VERSION + version_id;

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(apiUrl, config); 
      const output = response?.data?.data.data;
      if(output) {
        type === "left" ? setLeftVersionData(output) : setRightVersionData(output);
      } else {
        message.error("Error In Fetching Version Data !");
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
            message.error("Error In Fetching Stories !");
            }
        }
    }
    type === "left" ? setIsLeftVersionLoading(false) : setIsRightVersionLoading(false);
  }

  return (
    <SidebarWithHeader>
      <div>
        {/* Head */}
        <p className="text-xl md:text-3xl mt-1 mb-2 md:mb-0 font-medium">Compare Jsons</p>
        
        {/* Body */}
        <div className="mt-8">
          <div className="flex gap-5 justify-center items-center">
            <p className="text-sm text-gray-600 font-medium mb-1">Story World</p>
            <Dropdown
                menu={{
                  items: storyWorldItems.length > 0 ? storyWorldItems : [{label: "No Story Worlds", key: "No Story World"}],
                  onClick: (e) => handleStoryWorldClick(e, storyWorldItems),
                }}
                style={{ width: 200}}
                dropdownRender={(menu) => (
                  <div style={{ maxHeight: '50vh', overflowY: 'auto', backgroundColor: 'white' }}>
                    {menu}
                  </div>
                )}
                disabled={selectedStoryWorld.label === "No Story Worlds"}
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
                    {selectedStoryWorld.label}
                  </span>
                  {isStoryWorldLoading ? <LoadingOutlined /> : <DownOutlined />}
                </Space>
              </Button>
            </Dropdown>

            <p className="text-sm text-gray-600 font-medium mb-1">Story</p>
            <Dropdown
              menu={{
                items: storyItems.length > 0 ? storyItems : [{label: "No Stories", key: "No Stories"}],
                onClick: (e) => handleStoryItemClick(e, storyItems),
              }}
              style={{ width: 200 }}
              dropdownRender={(menu) => (
                <div style={{ maxHeight: '50vh', overflowY: 'auto', backgroundColor: 'white' }}>
                  {menu}
                </div>
              )}
              disabled={selectedStory.label === "No Stories"}
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
                    {selectedStory.label}
                  </span>
                  {isStoryLoading ? <LoadingOutlined /> : <DownOutlined />}
                </Space>
              </Button>
            </Dropdown>


            <button 
              type="submit"
              disabled={!getButtonDisableState()}
              className={`text-white md:w-[10vw] px-5 py-3 font-medium rounded-lg text-sm text-center ${
                getButtonDisableState() ? "bg-blue-600 hover:bg-blue-400" : "bg-blue-300 cursor-not-allowed"
              }`}
              onClick={() => {
                fetchVersionDetails(tokenVal, "left", selectedVersion1.key);
                fetchVersionDetails(tokenVal, "right", selectedVersion2.key);
              }}
            >
              Display Json
            </button>
          </div>

          <div className="flex flex-col-1 mt-2 md:flex-row lg:flex-col-2 divide-x-4 justify-center items-center">
            <div className="flex flex-col md:flex-row gap-2 md:gap-8 m-4">
              {leftVersionData.length > 0 && (isLeftVersionLoading ? <LoadingOutlined /> : <JsonBody data={leftVersionData} />)}
              <div className="flex flex-col gap-2">
                <p className="text-sm text-gray-600 font-medium mb-1 ml-6">Json Version</p>
                <Dropdown
                  menu={{
                    items: versionItems.length > 0 ? versionItems : [{label: "No Versions", key: "No Version"}],
                    onClick: (e) => handleJsonVersion1Click(e, versionItems),
                  }}
                  style={{ width: 200 }}
                  dropdownRender={(menu) => (
                    <div style={{ maxHeight: '50vh', overflowY: 'auto', backgroundColor: 'white' }}>
                      {menu}
                    </div>
                  )}
                  disabled={selectedVersion1.label === "No Versions"}
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
                        {selectedVersion1.label}
                      </span>
                      {isVersionLoading ? <LoadingOutlined /> : <DownOutlined />}
                    </Space>
                  </Button>
                </Dropdown>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-2 md:gap-8 m-4 ps-8">
            {rightVersionData.length > 0 && (isRightVersionLoading ? <LoadingOutlined /> : <JsonBody data={rightVersionData} />)}
            <div className="flex flex-col gap-2">
              <p className="text-sm text-gray-600 font-medium mb-1 ml-6">Json Version</p>
              <Dropdown
                  menu={{
                    items: versionItems.length > 0 ? versionItems : [{label: "No Versions", key: "No Version"}],
                    onClick: (e) => handleJsonVersion2Click(e, versionItems),
                  }}
                  style={{ width: 200 }}
                  dropdownRender={(menu) => (
                    <div style={{ maxHeight: '50vh', overflowY: 'auto', backgroundColor: 'white' }}>
                      {menu}
                    </div>
                  )}
                  disabled={selectedVersion2.label === "No Versions"}
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
                        {selectedVersion2.label}
                      </span>
                      {isVersionLoading ? <LoadingOutlined /> : <DownOutlined />}
                    </Space>
                  </Button>
              </Dropdown>
            </div>
            </div>
          </div>
        </div>
      </div>
    </SidebarWithHeader>
  );
};

export default CompareJsons;
