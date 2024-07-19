import { Modal } from 'antd'
import React, { useContext } from 'react'
import { StoryUploadApiContext } from '../../contexts/ApiContext'

const StoryTextPopup = ({ open, onClose = () => {} }) => {
  const { storyUploadApiResponse } = useContext(StoryUploadApiContext);
  const { storyText, fileName } = storyUploadApiResponse;
  
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