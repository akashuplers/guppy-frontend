import React, { useEffect, useState, useRef, useContext } from 'react'
import SidebarWithHeader from '../../sidebar-with-header'
import { useFormik } from 'formik';
import { Formik, Form, Field, ErrorMessage } from "formik";
import { StoryUploadApiContext } from "../../../contexts/ApiContext";
import { useNavigate } from 'react-router-dom';
import { Table, message } from 'antd';
import { API_BASE_PATH, API_ROUTES } from '../../../constants/api-endpoints';
import axios from 'axios';
import ShareModal from '../ShareModal';
import { Dropdown, Space } from 'antd';
import { FilterOutlined } from '@ant-design/icons';
import DownloadVersionSelectPopup from '../DownloadVersionSelectPopup';
import DeleteConfirmationDialog from '../../../utils/modals/DeleteConfirmationDialog';
import { MultiSelect } from "react-multi-select-component";

import LoadingButtonPrimary from '../../../utils/LoadingButtonPrimary';
import ModifySelectionPopup from '../ModifySelectionPopup';
import FooterButtons from '../FooterButtons';

const MasterWssPage = ({ onDiscard = () => { }, saveTitles, handleSaveSuccess = () => { } }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showModifyPopup, setShowModifyPopup] = useState(false);
  const [stories, setStories] = useState([]);
  const [filteredStories, setFilteredStories] = useState([]);
  const [isShareModalOpen, setShareModalOpen] = useState(false);
  const [storyDetails, setStoryDetails] = useState(null);
  const [users, setUsers] = useState([]);
  const [tempUsers, setTempUsers] = useState([]);
  const [shareIds, setShareIds] = useState([]);
  const [updatedShareIds, setUpdatedShareIds] = useState([]);
  const [titleSelectionItems, setTitleSelectionItems] = useState([]);
  const [showVersionModal, setShowVersionModal] = useState(false);
  const [isStoryDeleted, setIsStoryDeleted] = useState(false);
  const [showDeleteStoryModal, setShowDeleteStoryModal] = useState(false);
  const [selectedStoryId, setSelectedStoryId] = useState('');
  const [selectedVersionId, setSelectedVersionId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const tokenVal = JSON.parse(localStorage.getItem("accessToken"));
  const errorMsg = "Error In Fetching Saved Response";
  const downloadLinkRef = useRef(null);
  const [selected, setSelected] = useState([]);
  const [selectedRow, setSelectedRow] = useState({});
  const formik = useFormik({
    initialValues: {
      storyWorld: '',
      storyWorldLead: '',
      storyLeadWho: '',
    },
    onSubmit: (values) => {
      console.log(values);
    },
  });

  const { storyUploadApiResponse, setStoryUploadApiResponse, handleAnythingChanged } = useContext(StoryUploadApiContext);
  const { token, story_id, storyWorld, fileName, titles, updatedTitles, primaryWhos } = storyUploadApiResponse;
  const [ whos, setWhos ] = useState(storyUploadApiResponse?.updatedWhos);
  const [ whats, setWhats ] = useState(storyUploadApiResponse?.updatedWhats);
  const [ wheres, setWheres ] = useState(storyUploadApiResponse?.updatedWheres);


  // const { storyUploadApiResponse, setStoryUploadApiResponse, handleAnythingChanged } = useContext(StoryUploadApiContext);
  // const { token, story_id, storyWorld, fileName, titles, updatedTitles, primaryWhos } = storyUploadApiResponse;
console.log("whoswhos",whos);
console.log("storyUploadApiResponse",storyUploadApiResponse);
console.log("setStoryUploadApiResponse",setStoryUploadApiResponse);
console.log("handleAnythingChanged",handleAnythingChanged);

const options = [
  { label: "Grapes 🍇", value: "grapes" },
  { label: "Mango 🥭", value: "mango" },
];

const filteredata = [
  {id:1, wsForm: "Who's", type:"Primary", clusterHead: "Maharaja", clusterValue: "Highness", },
  {id:2, wsForm: "What's", type:"Secondary", clusterHead: "Tenali", clusterValue: "Brave", },
  {id:3, wsForm: "Where's", type:"Primary", clusterHead: "Maharaja", clusterValue: "Highnesss", },
  {id:4, wsForm: "Who's", type:"Secondary", clusterHead: "Maharaja", clusterValue: "Royal", }

]

const [filterData, setFilteredData] = useState(filteredata)

  useEffect(() => {
    if (!tokenVal) {
      navigate('/');
    } else {
      fetchStories();
      fetchUsers();
    }
  }, []);

  useEffect(() => {
    if (saveTitles) {
      onSave();
    }
  }, [saveTitles]);

  useEffect(() => {
    if (!tokenVal) {
      navigate('/');
    } else {
      isStoryDeleted && fetchStories();
    }
  }, [isStoryDeleted]);

  useEffect(() => {
    if (shareIds || updatedShareIds) {
      handleSharedUsers();
    }
  }, [shareIds, updatedShareIds]);

  const onClick = ({ key }) => {
    if (key === "all")
      setFilteredStories(stories);
    else
      setFilteredStories(stories.filter(story => story.story_world === key));
  };

  const getItems = () => {
    const uniqueStories = Array.from(new Set(stories.map(story => story.story_world)))
      .map(storyWorld => ({
        label: storyWorld,
        key: storyWorld,
      }));
    uniqueStories.push({ label: "all", key: "all" });

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
      if (response.data?.message) {
        message.success({ content: response.data?.message, duration: 20 });
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
  useEffect(() => {
    setTitleSelectionItems(updatedTitles);
  }, []);


  const getUpdatedTitles = (newTitles) => {
    return newTitles.map(title => {
      return {
        id: title.id,
        title: title.Title,
        primaryWhos: title.Who_Primary,
        primaryWhats: title.What_Primary,
        primaryWheres: title.Where_Primary,
        secondaryWhos: title.Who_Secondary,
        secondaryWhats: title.What_Secondary,
        secondaryWheres: title.Where_Secondary,
        ...(title.comment && { comment: title.comment })
      }

    })
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
      if (output) {
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
    if (downloadLinkRef.current && selectedVersionId) {
      const apiUrl = `${API_BASE_PATH}${API_ROUTES.DOWNLOAD_VERSION_STORY}/${selectedVersionId}`;
      downloadLinkRef.current.href = apiUrl;
      downloadLinkRef.current.click();
      setShowVersionModal(false);
    } else {
      message.error("Please select a version to download.");
    }
  };

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

  const handleCloseShareModal = () => {
    setShareModalOpen(false);
    setShareIds([]);  // Reset shareIds when modal is closed
    setUpdatedShareIds([]);
  }

  const historyColumns = [
    {
      title: "S.No",
      render: (text, record, index) => index + 1,
      width: 60,
    },
    {
      dataIndex: "wsForm",
      title: "W's Form"
      //  render: (val) => {
      //   const csvStr = getCSVsFromList(val);
      //   return (
      //     <p>
      //       {csvStr ? csvStr : "NA"}
      //     </p>
      //   );
      // },
    },
    {
      dataIndex: "type",
      title: "Type"
    },
    {
      dataIndex: "clusterHead",
      title: "Cluster Head"
    },
    {
      dataIndex: "clusterValue",
      title: "Cluster Value"
    },
    {
      dataIndex: "action",
      title: "Action",
      render: (val, record) => {
        return (
          <div style={{ display: 'flex', gap: '15px' }}>
             <button
              title="View/Modify"
              onClick={() => {
                setShowModifyPopup(true);
                setSelectedRow(record);
              }}
            >
              <svg
                className="font-bold text-gray-900 cursor-pointer hover:text-blue-600 bi bi-pencil-square"
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                <path
                  fillRule="evenodd"
                  d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"
                />
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
                <path d="M18 6L17.1991 18.0129C17.129 19.065 17.0939 19.5911 16.8667 19.99C16.6666 20.3412 16.3648 20.6235 16.0011 20.7998C15.588 21 15.0607 21 14.0062 21H9.99377C8.93927 21 8.41202 21 7.99889 20.7998C7.63517 20.6235 7.33339 20.3412 7.13332 19.99C6.90607 19.5911 6.871 19.065 6.80086 18.0129L6 6M4 6H20M16 6L15.7294 5.18807C15.4671 4.40125 15.3359 4.00784 15.0927 3.71698C14.8779 3.46013 14.6021 3.26132 14.2905 3.13878C13.9376 3 13.523 3 12.6936 3H11.3064C10.477 3 10.0624 3 9.70951 3.13878C9.39792 3.26132 9.12208 3.46013 8.90729 3.71698C8.66405 4.00784 8.53292 4.40125 8.27064 5.18807L8 6M14 10V17M10 10V17" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </button>
          </div>
        )
      }
    },
  ];

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const apiUrl = API_BASE_PATH + API_ROUTES.ADD_STORY_WORLD;
      const formData = {
        name: values?.name,
        lead_who: values?.storyWorldLead
      }
      // api call
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.post(apiUrl, formData, config); // post api request
      const output = response?.data?.latestStoryWorld;
      //   if(output) {
      //     onAddStoryWorld(output);
      //     resetForm();
      //   }

    } catch (error) {
      console.error('Error:', error);
      const statusCode = error?.response?.status;
      if (statusCode === 401) {
        message.error("Not Authorized ! You need to login first !");
        navigate("/");
      } else if (statusCode === 400) {
        message.error("Story World Already Exists With This Name !");
      } else if (statusCode === 500) {
        message.error("Internal Server Error !");
      } else {
        const errorMessage = error?.response?.data?.message;
        if (errorMessage) {
          message.error(errorMessage);
        } else {
          message.error("Something Went Wrong ! Please Try Again After Some Time !");
        }
      }
    }
    setSubmitting(false);
  }

  const storyWorldOptions = [
    { id: 1, name: "Who's" },
    { id: 2, name: "What's" },
    { id: 3, name: "Where's" },
  ]

  const type = [
    { id: 1, name: "Primary" },
    { id: 2, name: "Secondary" }
  ]

  const onReset = () => {
    setTitleSelectionItems(titles);
    message.success("Reset Successfully !");
    handleAnythingChanged(true);
  };
  const onSave = async () => {
    setIsSubmitting(true);
    let alertKey;
    try {
      // api call
      const apiUrl = API_BASE_PATH + API_ROUTES.SAVE_TITLES;
      // const payload = bodyForSaveTitlesApi();
      const payload = ""
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      alertKey = message.loading("Saving Titles...", 0).key;
      const response = await axios.post(apiUrl, payload, config); // post api request
      const output = response?.data;
      if (output) {
        const situations = output?.situations;
        const newTitles = output?.updatedTitles?.titles;
        setTitleSelectionItems(getUpdatedTitles(newTitles));
        // update context
        const contextObj = { ...storyUploadApiResponse };
        const updatedContextObj = {
          ...contextObj,
          // updatedTitles: getUpdatedTitles(newTitles),
          // situations: getUpdatedJson(situations),
          // updatedSituations: getUpdatedJson(situations),
        };
        setStoryUploadApiResponse(updatedContextObj);
        handleSaveSuccess(true);
        handleAnythingChanged(false);
        message.destroy(alertKey);
        message.success("Titles Saved Successfully !");
      } else {
        message.destroy(alertKey);
        message.error("Error In Saving Titles ! Unable To Fetch Response !");
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
          message.error("Error In Saving Titles ! Unable To Fetch Response !");
        }
      }
    }
    // setIsSubmitting(false);
  };

  const handleAddRow = () => {
    const newObj = {
      id: filterData?.length + 1,
      wsForm: [],
      type: [],
      clusterHead: [],
      clusterValue: [],
      isNewField: true
    };
    const curData = [newObj, ...filterData];
    setFilteredData(curData);
    message.success("New Row Added Successfully !");
    handleAnythingChanged(true);
  };

  const handleChangeWs = (e) => {
    debugger
    const selectedOption = storyWorldOptions?.find(option => option._id === e.target.value);
    console.log("selectedOption", selectedOption);
    if(e.target.value == "")
  
    // Set the form field values
    formik.setFieldValue('storyWorld', e.target.value);
    formik.setFieldValue('storyWorldLead', selectedOption ? selectedOption.lead_who : '');
    formik.setFieldValue('storyLeadWho', selectedOption ? selectedOption.lead_who : '');
  }

  return (
    // <SidebarWithHeader>
    <div>
      {/* head */}
      <div className="px-5 pb-5 border rounded-md">
        <div className="flex flex-col justify-between mt-5 mb-3 text-lg md:flex-row md:text-xl md:mb-4">
          <p>Step-3 : Master W's</p>
          {/* <p className="mt-2 text-lg md:text-xl md:mt-0">
          Story World : <span className="text-violet-500">{storyWorld}</span>
        </p> */}
          <div className="flex space-x-4">
            <button
              type="submit"
              className="w-20 px-4 py-2 mt-4 text-sm font-medium text-center text-white bg-blue-600 rounded-lg md:w-24 lg:w-28 md:mt-0 hover:bg-blue-400 focus:ring-4 focus:outline-none ring-primary-300 bg-primary-600 hover:bg-primary-700 focus:ring-primary-800"
              onClick={handleAddRow}
            >
              Add Row
            </button>

            <button
              type="submit"
              className="w-20 px-4 py-2 mt-4 text-sm font-medium text-center text-white bg-blue-600 rounded-lg md:w-24 lg:w-28 md:mt-0 hover:bg-blue-400 focus:ring-4 focus:outline-none ring-primary-300 bg-primary-600 hover:bg-primary-700 focus:ring-primary-800"
            >
              Save Cluster
            </button>
            <button
              type="submit"
              className="w-20 px-4 py-2 mt-4 text-sm font-medium text-center text-white bg-blue-600 rounded-lg md:w-24 lg:w-28 md:mt-0 hover:bg-blue-400 focus:ring-4 focus:outline-none ring-primary-300 bg-primary-600 hover:bg-primary-700 focus:ring-primary-800"
            >
              Save Ws
            </button>
          </div>
        </div>
        <Formik
        initialValues={{
          name: "",
          storyWorldLead: "",
        }}
        // validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, setFieldValue }) => (
          <Form className="flex flex-wrap gap-2 md:flex-row md:gap-5">
            <div className="flex-1 min-w-[200px]">
              <label
                htmlFor="storyWorld"
                className="block mb-2 text-sm font-medium text-gray-900 md:text-sm"
              >
                Select Ws
              </label>
              <Field
                as="select"
                name="storyWorld"
                id="storyWorld"
                className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 sm:text-md focus:ring-primary-600 focus:border-primary-600"
                onChange={(e) => {
                  handleChangeWs(e)
                  // const selectedOption = storyWorldOptions?.find(option => option._id === e.target.value);
                  // setFieldValue('storyWorld', e.target.value);
                  // setFieldValue('storyWorldLead', selectedOption ? selectedOption.lead_who : '');
                  // setFieldValue('storyLeadWho', selectedOption ? selectedOption.lead_who : '');
                }}
              >
                <option value="">Please Select...</option>
                {storyWorldOptions?.map((item, index) => (
                  <option key={index} value={item?._id}>{item?.name}</option>
                ))}
              </Field>
              <ErrorMessage
                name="storyWorld"
                component="div"
                className="text-sm text-red-500"
              />
            </div>

            <div className="flex-1 min-w-[200px]">
              <label
                htmlFor="storyWorld"
                className="block mb-2 text-sm font-medium text-gray-900 md:text-sm"
              >
                Select Cluster Head
              </label>
              <Field
                as="select"
                name="storyWorld"
                id="storyWorld"
                className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 sm:text-md focus:ring-primary-600 focus:border-primary-600"
                onChange={(e) => {
                  const selectedOption = storyWorldOptions?.find(option => option._id === e.target.value);
                  setFieldValue('storyWorld', e.target.value);
                  setFieldValue('storyWorldLead', selectedOption ? selectedOption.lead_who : '');
                  setFieldValue('storyLeadWho', selectedOption ? selectedOption.lead_who : '');
                }}
              >
                <option value="">Please Select...</option>
                {storyWorldOptions?.map((item, index) => (
                  <option key={index} value={item?._id}>{item?.name}</option>
                ))}
              </Field>
              <ErrorMessage
                name="storyWorld"
                component="div"
                className="text-sm text-red-500"
              />
            </div>

            <div className="flex-1 min-w-[200px]">
              <label
                htmlFor="storyWorld"
                className="block mb-2 text-sm font-medium text-gray-900 md:text-sm"
              >
                Select Type
              </label>
              <Field
                as="select"
                name="storyWorld"
                id="storyWorld"
                className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 sm:text-md focus:ring-primary-600 focus:border-primary-600"
                onChange={(e) => {
                  const selectedOption = storyWorldOptions?.find(option => option._id === e.target.value);
                  setFieldValue('storyWorld', e.target.value);
                  setFieldValue('storyWorldLead', selectedOption ? selectedOption.lead_who : '');
                  setFieldValue('storyLeadWho', selectedOption ? selectedOption.lead_who : '');
                }}
              >
                <option value="">Please Select...</option>
                {type?.map((item, index) => (
                  <option key={index} value={item?._id}>{item?.name}</option>
                ))}
              </Field>
              <ErrorMessage
                name="storyWorld"
                component="div"
                className="text-sm text-red-500"
              />
            </div>

              <div className="flex-1 min-w-[200px]">
                <label
                  htmlFor="storyWorld"
                  className="block mb-2 text-sm font-medium text-gray-900 md:text-sm"
                  >
                  Select Cluster Values
                </label>
                <div >
                  <MultiSelect
                    id="storyWorld"
                    options={options}
                    value={selected}
                    onChange={setSelected}
                    labelledBy="Please Select"
                  />
                </div>
                {/* Error Message */}
                <ErrorMessage
                  name="storyWorld" // Make sure this matches the form field name
                  component="div"
                  className="mt-1 text-sm text-red-500" // Added margin for better spacing
                />
              </div>
          </Form>

        )}
      </Formik>
      {/* body */}
      <div className='mt-8'>
        {!isLoading &&
          <Table
            dataSource={filterData}
            columns={historyColumns}
            bordered
          />
        }
      </div>
      </div>





      <a ref={downloadLinkRef} style={{ display: 'none' }} download></a>
      <ShareModal open={isShareModalOpen} storyDetails={storyDetails} users={tempUsers} onClose={() => setShareModalOpen(false)} updateUsers={(ids) => setUpdatedShareIds(ids)} />
      {showVersionModal && <DownloadVersionSelectPopup open={showVersionModal} story_id={selectedStoryId} handleVersionSelect={handleVersionSelect} handleDownload={handleVersionDownload} onClose={() => setShowVersionModal(false)} />}
      {showDeleteStoryModal &&
        <DeleteConfirmationDialog
          open={showDeleteStoryModal}
          onClose={() => setShowDeleteStoryModal(false)}
          onConfirm={() => deleteStoryById()}
        />
      }
      {showModifyPopup && (
        <ModifySelectionPopup
          open={showModifyPopup}
          // modifyItemObj={selectedRow}
          onClose={() => setShowModifyPopup(false)}
          // onModify={onModify}
          type="title"
        />
      )}
      <FooterButtons
        onDiscard={onDiscard}
        onReset={onReset}
        onSubmit={onSave}
        saveType="Titles"
      // isSubmitting={isSubmitting}
      />
    </div>


    // </SidebarWithHeader>
  )
}

export default MasterWssPage