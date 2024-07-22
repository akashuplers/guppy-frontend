import { Modal, message } from 'antd'
import React, { useContext, useEffect, useState } from 'react'
import { StoryUploadApiContext } from '../../contexts/ApiContext'
import { API_BASE_PATH, API_ROUTES } from '../../constants/api-endpoints';
import axios from 'axios';

const StoryTextPopup = ({ open, onClose = () => {} }) => {
  const { storyUploadApiResponse } = useContext(StoryUploadApiContext);
  const { fileName } = storyUploadApiResponse;
  const [storyText, setStoryText] = useState("");
  const errorMsg = "Error In Fetching Story Text";

  useEffect(() => {
    const storyId = JSON.parse(localStorage.getItem("storyId"));
    const tokenVal = JSON.parse(localStorage.getItem("accessToken"));
    if(storyId && tokenVal) {
      fetchStoryData(storyId, tokenVal);
    }
  }, []);

  const fetchStoryData = async (story_id, token) => {
    let alertKey;
    try {
      const apiUrl = API_BASE_PATH + API_ROUTES.FETCH_STORY_DATA + `/${story_id}`;
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      alertKey = message.loading('Fetching Story Text...', 0).key;
      
      const output = await axios.get(apiUrl, config);
      if(output) {
        const respObj = output?.data?.data;
        const { story_text } = respObj;
        setStoryText(story_text);
      } else {
        message.error(errorMsg);
      }
    } catch (error) {
      console.log("error: ", error);
      message.error(errorMsg);
    }
    message.destroy(alertKey); // stop infinite loader alert
  }
  
  return (
    <Modal
      open={open}
      centered
      onCancel={onClose}
      width={1000}
      title={<p className='text-violet-600'>{`STORY TEXT (${fileName})`}</p>}
      footer={[<></>]}
      className='p-3 max-h-[600px] md:max-h-[800px] overflow-auto'
    >
        <div className='rounded-md text-justify'>
          {storyText}
        </div>
    </Modal>
  )
}

export default StoryTextPopup;