import React, { useEffect, useState, useRef, useContext } from "react";
import { useFormik, Field, Form, ErrorMessage } from "formik";
import { Formik } from "formik";
import { StoryUploadApiContext } from "../../../contexts/ApiContext";
import { useNavigate } from "react-router-dom";
import { Table, message, Button, Checkbox, Modal, Select  } from "antd";
import { API_BASE_PATH, API_ROUTES } from "../../../constants/api-endpoints";
import axios from "axios";
import ShareModal from "../ShareModal";
import DownloadVersionSelectPopup from "../DownloadVersionSelectPopup";
import DeleteConfirmationDialog from "../../../utils/modals/DeleteConfirmationDialog";
import { MultiSelect } from "react-multi-select-component";
 import FooterButtons from "../FooterButtons";
import ModifyMasterWsPopup from "../../ModifyMasterWsPopUp";
import DownloadCSVFile from "../../DownloadCsv";
// import Select from 'react-select'; // Import react-select
const MasterWssPage = ({
  onDiscard = () => {},
  saveTitles,
  handleSaveSuccess = () => {},
}) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showModifyPopup, setShowModifyPopup] = useState(false);
  const [dialogPopup, setDialogPopup] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);  
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
  const [ selectedMasterHeadLabel, setSelectedMasterHeadLabel] = useState();
  const [isStoryDeleted, setIsStoryDeleted] = useState(false);
  const [showDeleteStoryModal, setShowDeleteStoryModal] = useState(false);  
  const [selectedStoryId, setSelectedStoryId] = useState("");
  const [selectedVersionId, setSelectedVersionId] = useState("");
  const [clusterList, setClusterList] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaved, setIsSaved] = useState(false);  
  const tokenVal = JSON.parse(localStorage.getItem("accessToken"));
  const errorMsg = "Error In Fetching Saved Response";
  const downloadLinkRef = useRef(null);
  const [selected, setSelected] = useState([]);
  const {storyUploadApiResponse,setStoryUploadApiResponse,handleAnythingChanged,} = useContext(StoryUploadApiContext);  
  const { token, story_id, storyWorld, fileName, primaryWhos, masterWs, filterDatas } = storyUploadApiResponse;
  const [searchTerm, setSearchTerm] = useState('');

  const formik = useFormik({
    initialValues: {
      ws: "",
      masterHead: "",
      type: "",
      clusterValue: [],
    },
    onSubmit: () => {
      console.log("submit");
    },
  });

  const [whos, setWhos] = useState();
  const [whats, setWhats] = useState();
  const [wheres, setWheres] = useState();
  const [filteredOptions, setFilteredOption] = useState();

  const options = (filteredOptions || [])?.map((item) => ({
    label: item.value,
    value: item.id,
  }));

  const [filterData, setFilteredData] = useState([]);

  console.log("filterDatafilterData", filterData);
  
  const handleDelete = () => {
        const curData = [...filterData];
        const updated = curData.filter((ele) => ele.id !== selectedRow.id);
        setFilteredData(updated);
        message.success("Deleted Successfully !");
        handleAnythingChanged(true);
  };

useEffect(() => {
  if(filterData?.length > 0) {
    const masterHeadIds = filterData.map(item => item.masterHead.id);
    const updatedWhos = whos?.filter(item => !masterHeadIds.includes(item.id));
    const updatedWheres = wheres?.filter(item => !masterHeadIds.includes(item.id));
    const updatedWhats = whats?.filter(item => !masterHeadIds.includes(item.id));  
    setWhos(updatedWhos);
    setWheres(updatedWheres);
    setWhats(updatedWhats);
    const updatedFilteredOptions = filteredOptions?.ws?.clusterValues.filter(item => 
      !masterHeadIds.includes(item.id) 
    );
  
    setFilteredOption(updatedFilteredOptions);
  }

}, [filterData]);

  useEffect(() => {
    if (!tokenVal) {
      navigate("/");
    } else {
      // fetchStories();
      // fetchUsers();
    }
  }, []);

  useEffect(() => {
    if (saveTitles) {
      onSave();
    }
  }, [saveTitles]);

  useEffect(() => {
    if (!tokenVal) {
      navigate("/");
    } else {
      isStoryDeleted && fetchStories();
    }
  }, [isStoryDeleted]);

  useEffect(() => {
    if (shareIds || updatedShareIds) {
      handleSharedUsers();
    }
  }, [shareIds, updatedShareIds]);
  const csvData = [
    ["firstname", "lastname", "email"],
    ["Ahmed", "Tomi", "ah@smthing.co.com"],
    ["Raed", "Labes", "rl@smthing.co.com"],
    ["Yezzi", "Min l3b", "ymin@cocococo.com"],
  ];

  const handleSharedUsers = () => {
    const finalUsers = users.filter(
      (user) =>
        !shareIds.includes(user._id) && !updatedShareIds.includes(user._id)
    );
    setTempUsers(finalUsers);
  };

  const clusterHeadWsList = async () => {
    try {
        const apiUrl = API_BASE_PATH + API_ROUTES.LIST_WS + story_id;
        const config = {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenVal}`,
        },
        };
        const output = await axios.get(apiUrl, config);
        setClusterList(output?.data?.ws?.ws_data); 
    } catch (error) {
        console.log("error: ", error);
        message.error(errorMsg);
    }
  }

  useEffect (()=>{
    clusterHeadWsList();
  },[])

const transformData = (data) => {
  const result = {
    who: {
      primary: [],
      secondary: []
    },
    what: {
      primary: [],
      secondary: []
    },
    where: {
      primary: [],
      secondary: []
    }
  };

  data?.forEach(item => {
    const newItem = {
      id: item.masterHead.id, 
      masterHead: item.masterHead.value, 
      clusterValues: item.clusterValue?.map(cluster => ({
        id: cluster.id,
        value: cluster.value
      })),
      new: true,
      updated: false
    };

    if (item.ws === "Who's") {
      if (item.type === "Primary") {
        result.who.primary.push(newItem);
      } else {
        result.who.secondary.push(newItem);
      }
    } else if (item.ws === "What's") {
      if (item.type === "Primary") {
        result.what.primary.push(newItem);
      } else {
        result.what.secondary.push(newItem);
      }
    } else if (item.ws === "Where's") {
      if (item.type === "Primary") {
        result.where.primary.push(newItem);
      } else {
        result.where.secondary.push(newItem);
      }
    }
  });

  return cleanEmptySections(result);
};

const cleanEmptySections = (data) => {
  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      const sections = data[key];
      for (const section in sections) {
        if (sections[section].length === 0) {
          delete sections[section];
        }
      }
    }
  }
  return data;
};


const transformedData = transformData(filterData);
const cleanedData = transformedData

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
      const response = await axios.post(apiUrl, {}, config);
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
  };

  



  const handleVersionSelect = (versionId) => {
    if (versionId) {
      setSelectedVersionId(versionId);
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

  const handleRemoveChip = (value, index) => {
    const updatedClusterValues = [...filterData[index]?.clusterValue];  
    const newClusterValues = updatedClusterValues?.filter(item => item?.id !== value?.id); 
    updateClusterValue(index, newClusterValues);
  };
  const updateClusterValue = (index, newClusterValues) => {
    const updatedTableData = [...filterData];
    updatedTableData[index].clusterValue = newClusterValues;
    setFilteredData(updatedTableData);
  };
 
  const historyColumns = [
    {
      dataIndex: "id",
      title: "S.No",
      render: (text, record, index) => index + 1,
      width: 60,
    },
    {
      dataIndex: "ws",
      title: "W's Form",
    },
    {
      dataIndex: "type",
      title: "Type",
    },
    {
      dataIndex: "masterHead",
      title: "Cluster Head",
      render: (text, record) => {
        return (
          <div>
            <span>{record.masterHead.value}</span>
          </div>
        );
      },
    },
    {
      dataIndex: "clusterValue",
      title: "Cluster Value",
      render: (clusterValue, record, index) => {
        return (
          <div className="flex flex-wrap gap-2">
            {
              clusterValue?.length > 0
                ? clusterValue?.map((value, idx) => (
                    <div
                      key={idx}
                      className="flex items-center bg-gray-200 rounded-lg px-2.5 py-1.5 text-sm text-gray-800 border border-gray-300"
                    >
                      <span>{value?.value}</span>
                      <button
                        className="text-red-600 bg-transparent border-none cursor-pointer ml-2"
                        onClick={() => handleRemoveChip(value, index)}
                        title="Remove"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-6 h-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  ))
                : "NA" 
            }
          </div>
        );
      },
    },
    {
      dataIndex: "action",
      title: "Action",
      render: (val, record) => {
        return (
          <div style={{ display: "flex", gap: "15px" }}>
            <button
              title="View/Modify"
              onClick={() => {
                setShowModifyPopup(true);
                setDialogPopup(true);
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
                setShowDeleteModal(true);
                setSelectedRow(record);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M18 6L17.1991 18.0129C17.129 19.065 17.0939 19.5911 16.8667 19.99C16.6666 20.3412 16.3648 20.6235 16.0011 20.7998C15.588 21 15.0607 21 14.0062 21H9.99377C8.93927 21 8.41202 21 7.99889 20.7998C7.63517 20.6235 7.33339 20.3412 7.13332 19.99C6.90607 19.5911 6.871 19.065 6.80086 18.0129L6 6M4 6H20M16 6L15.7294 5.18807C15.4671 4.40125 15.3359 4.00784 15.0927 3.71698C14.8779 3.46013 14.6021 3.26132 14.2905 3.13878C13.9376 3 13.523 3 12.6936 3H11.3064C10.477 3 10.0624 3 9.70951 3.13878C9.39792 3.26132 9.12208 3.46013 8.90729 3.71698C8.66405 4.00784 8.53292 4.40125 8.27064 5.18807L8 6M14 10V17M10 10V17"
                  stroke="#EF4444" 
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        );
      },
    },
  ];

  const headers = [
    { label: "W's Form", key: "ws" },
    { label: "Type", key: "type" },
    { label: "Cluster Head", key: "Cluster Head" },
    { label: "Cluster Value", key: "Cluster Value" }
  ];

console.log("filterData",filterData);

const flattenData = filterData?.map(item => ({
  
  ws: item?.ws,  // Directly mapping the 'ws' field
  type: item?.type,  // Mapping the 'type' field
  "Cluster Head": item.masterHead?.value,  // Flattening 'masterHead' and getting its 'value'
  "Cluster Value": item.clusterValue?.map(val => val?.value)?.join(", ")  // Flattening 'clusterValue' array and joining values with commas
}));

console.log("Flatten Data", flattenData);


  const storyWorldOptions = [
    { id: 1, name: "Who's" },
    { id: 2, name: "What's" },
    { id: 3, name: "Where's" },
  ];

  const type = [
    { id: 1, name: "Primary" },
    { id: 2, name: "Secondary" },
  ];

  const onReset = () => {
    message.success("Reset Successfully !");
    handleAnythingChanged(true);
  };

  const handleAddRow = () => {
    const newObj = {
      id: filterData?.length + 1,
      wsForm: [],
      type: [],
      masterHead: [],
      clusterValue: [],
      new: true,
    };
    const curData = [newObj, ...filterData];
    setFilteredData(curData);
    message.success("New Row Added Successfully !");
    handleAnythingChanged(true);
  };

  const apiUrl = API_BASE_PATH + API_ROUTES.SORT_WS + story_id;
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  
  const handleChange = async (e, name) => {
    if (e?.target?.value === "Who's") {
      setWhos(clusterList?.Who);
      setWhats([]);
      setWheres([]);
      setFilteredOption(clusterList?.Who);
    } else if (e?.target?.value === "What's") {
      setWhats(clusterList?.What);
      setWhos([]);
      setWheres([]);
      setFilteredOption(clusterList?.What);
    } else if (e?.target?.value === "Where's") {
      setWheres(clusterList?.Where);
      setWhats([]);
      setWhos([]);
      setFilteredOption(clusterList?.Where);
    }
  
    const selectedOption = [
      ...clusterList?.Who,
      ...clusterList?.What,
      ...clusterList?.Where
    ]?.find((option) => option?.value === e?.target?.value);

    if (name === "ws") {
      formik.setFieldValue("ws", e.target.value);
    }else if ( name === "masterHead" && selectedOption) {
      debugger
      const { id, value } = selectedOption;
    
        formik.setFieldValue("masterHead", { id: id, value:value });
      //   const filteredArray = filteredOptions?.filter(
      //   (item) => item.value !== e.target.value
      // );

      const payload = {
        clusterHead: { value: value, id: id },  // Set selected masterHead as clusterHead
        ws: []  // Initialize ws as an empty array
      };
      if (e?.target?.value === "Who's") {
        payload.ws = clusterList?.Who || [];
      } else if (e?.target?.value === "What's") {
        payload.ws = clusterList?.What || [];
      } else if (e?.target?.value === "Where's") {
        payload.ws = clusterList?.Where || [];
      }
         // Add dynamically selected whos, whats, or wheres to the payload if any
    if (whos?.length > 0) {
      payload.ws = [...payload.ws, ...whos];
    }
    if (whats?.length > 0) {
      payload.ws = [...payload.ws, ...whats];
    }
    if (wheres?.length > 0) {
      payload.ws = [...payload.ws, ...wheres];
    }

    payload.ws = payload.ws.map(item => ({
      value: item.value,
      id: item.id
    }));
      try {
        const response = await axios.post(apiUrl, payload, config); 
        console.log("API Response:", response.data);
        // setApiResponse(response.data);  
          const filteredArray = response?.data?.ws?.clusterValues?.filter(
        (item) => item.value !== e.target.value
      );
      console.log("filteredArray", filteredArray);
      
        setFilteredOption(filteredArray);
      } catch (error) {
        console.error("Error calling the API:", error);
      }
    } else if (name === "type") {
      formik.setFieldValue("type", e.target.value);
    } else {
    
        const selectedValues = e?.map((option) => ({
          label: option.label,
          value: option.value,
        }));
        setSelected(selectedValues);
        formik.setFieldValue("clusterValue", selectedValues);
    
    }
  };
  const { values, setFieldValue } = formik;

  const getUpdatedJson = (list) => {
    const arr = list || [];
    if(arr && arr.length>0) {
      const updated = arr.map((item, index) => ({
        id: item.id,
        title: item.Title,
        primaryWhos: item.Who_Primary,
        secondaryWhos: item.Who_Secondary,
        primaryWhats: item.What_Primary,
        secondaryWhats: item.What_Secondary,
        primaryWheres: item.Where_Primary,
        secondaryWheres: item.Where_Secondary,
        comment: item.comment
      }));
      return updated;
    }
    return [];
  }

  const onSave = async () => {
    setIsSubmitting(true);
    let alertKey;
    try {
      const apiUrl = API_BASE_PATH + API_ROUTES.SAVE_CLUSTER + story_id;
      const payload = transformedData;
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      alertKey = message.loading("Saving Ws...", 0).key;
      const response = await axios.post(apiUrl, payload, config); 
      const output = response?.data;
      if (output) {
        const { masterWs, titles } = output;
        const contextObj = { ...storyUploadApiResponse };
        const updatedContextObj = {
          ...contextObj,
          masterWs: masterWs,
          filterDatas:filterData,
          titles: getUpdatedJson(titles),
          updatedTitles: getUpdatedJson(titles),
        };
        setStoryUploadApiResponse(updatedContextObj);
        setIsSaved(true);
        message.destroy(alertKey); 
        message.success("Clusters Saved Successfully !");
        handleSaveSuccess(true);
        handleAnythingChanged(false);

      } else {
        message.destroy(alertKey); 
        message.error("Error In Saving Ws ! Unable To Fetch Response !");
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
          message.error(
            "Error In Saving Ws ! Unable To Fetch Response !"
          );
        }
      }
    }
    setIsSubmitting(false);
  };

  const handleSaveCluster = (values, resetForm) => {
    if (
      formik.values.ws &&
      formik.values.type &&
      formik.values.masterHead 
    ) {
      const newRow = {
        id: filterData?.length + 1,
        ws: formik.values.ws,
        type: formik.values.type,
        masterHead: formik.values.masterHead,
        clusterValue: formik.values.clusterValue
        .map((val) => ({
          id: val.value,         
          value: val.label    
        }))
      };
      setFilteredData((prevArray) => [...prevArray, newRow]);
      formik.resetForm(formik.values);
      setWhats([]);
      setWhos([]);
      setWheres([]);
      setFilteredOption([]);
    }
  };

  return (
    <div>
      <div className="px-5 pb-5 border rounded-md">
        <Formik
          initialValues={{
            ws: "",
            masterHead: "",
            type: "",
            clusterValue: [],
          }}
          onSubmit={formik.handleSubmit}
        >
          {({ values, resetForm }) => (
            <Form>
              <div className="flex flex-col justify-between mt-5 mb-3 text-lg md:flex-row md:text-xl md:mb-4">
                <p>Step-3 : Master W's</p>
                <div className="flex space-x-4">
                  {/* <button
                    type="button"
                    className="w-20 px-4 py-2 mt-4 text-sm font-medium text-center text-white bg-blue-600 rounded-lg md:w-24 lg:w-28 md:mt-0 hover:bg-blue-400 focus:ring-4 focus:outline-none ring-primary-300 bg-primary-600 hover:bg-primary-700 focus:ring-primary-800"
                    onClick={handleAddRow}
                  >
                    Add Row
                  </button> */}
                  <button
                    type="submit"
                    className="w-20 px-4 py-2 mt-4 text-sm font-medium text-center text-white bg-blue-600 rounded-lg md:w-24 lg:w-28 md:mt-0 hover:bg-blue-400 focus:ring-4 focus:outline-none ring-primary-300 bg-primary-600 hover:bg-primary-700 focus:ring-primary-800"
                    onClick={() => handleSaveCluster(values, resetForm)}
                  >
                    <DownloadCSVFile
                    // csvDat={flattenData}
                    // header={headers}
                    />
                  </button>
                  <button
                    type="button"
                    className="w-20 px-4 py-2 mt-4 text-sm font-medium text-center text-white bg-blue-600 rounded-lg md:w-24 lg:w-28 md:mt-0 hover:bg-blue-400 focus:ring-4 focus:outline-none ring-primary-300 bg-primary-600 hover:bg-primary-700 focus:ring-primary-800"
                    onClick={() => handleSaveCluster(values, resetForm)}
                  >
                    Save Ws
                  </button>
                </div>
              </div>
              <div className="flex flex-wrap mt-4 space-x-4">
                <div className="flex-1 min-w-[200px]">
                  <label
                    htmlFor="storyWorld"
                    className="block mb-2 text-sm font-medium text-gray-900 md:text-sm"
                  >
                    Select Ws
                  </label>
                  <Field
                    as="select"
                    name="ws"
                    id="ws"
                    className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 sm:text-md focus:ring-primary-600 focus:border-primary-600"
                    onChange={(e) => {
                      handleChange(e, "ws");
                    }}
                    value={formik.values.ws}
                  >
                    <option value="">Please Select...</option>
                    {storyWorldOptions?.map((item, index) => (
                      <option key={index} value={item?._id}>
                        {item?.name}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage
                    name="ws"
                    component="div"
                    className="text-sm text-red-500"
                  />
                </div>
                <div className="flex-1 min-w-[200px]">
                  <label
                    htmlFor="masterHead"
                    className="block mb-2 text-sm font-medium text-gray-900 md:text-sm"
                  >
                    Select Cluster Head
                  </label>
                  <Field
                    as="select"
                    name="masterHead"
                    id="masterHead"
                    className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 sm:text-md focus:ring-primary-600 focus:border-primary-600"
                    onChange={(e) => {
                      handleChange(e, "masterHead");
                    }}
                    value={formik.values.masterHead?.value} 
                  >
                    <option value="">Please Select...</option>
                    {whos &&
                      whos?.map((item, index) => (
                        <option key={index} value={item?._id}>
                          {item?.value}
                        </option>
                      ))}
                    {whats &&
                      whats?.map((item, index) => (
                        <option key={index} value={item?._id}>
                          {item?.value}
                        </option>
                      ))}
                    {wheres &&
                      wheres?.map((item, index) => (
                        <option key={index} value={item?._id}>
                          {item?.value}
                        </option>
                      ))}
                  </Field>
                  <ErrorMessage
                    name="masterHead"
                    component="div"
                    className="text-sm text-red-500"
                  />
                </div>


                {/* Select Type */}
                <div className="flex-1 min-w-[200px]">
                  <label
                    htmlFor="type"
                    className="block mb-2 text-sm font-medium text-gray-900 md:text-sm"
                  >
                    Select Type
                  </label>
                  <Field
                    as="select"
                    name="type"
                    id="type"
                    className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 sm:text-md focus:ring-primary-600 focus:border-primary-600"
                    onChange={(e) => {
                      handleChange(e, "type");
                    }}
                    value={formik.values.type} 
                  >
                    <option value="">Please Select...</option>
                    {type?.map((item, index) => (
                      <option key={index} value={item?._id}>
                        {item?.name}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage
                    name="type"
                    component="div"
                    className="text-sm text-red-500"
                  />
                </div>
                <div className="flex-1 min-w-[200px]">
                  <label
                    htmlFor="clusterValue"
                    className="block mb-2 text-sm font-medium text-gray-900 md:text-sm"
                  >
                    Select Cluster Values
                  </label>
                  <Field name="clusterValue">
                    {({ field, form }) => (
                      <MultiSelect
                        id="clusterValue"
                        options={options}
                        onChange={(e) => handleChange(e, "clusterValue")}
                        value={formik.values.clusterValue}
                        labelledBy="Please Select"
                      />
                    )}
                  </Field>
                  <ErrorMessage
                    name="clusterValue"
                    component="div"
                    className="mt-1 text-sm text-red-500"
                  />
                </div>
              </div>
            </Form>
          )}
        </Formik>

        <div className="mt-8">
          {!isLoading && (
            <Table dataSource={ filterDatas  || filterData || []  } columns={historyColumns} bordered />
          )}
        </div>
      </div>
      <a ref={downloadLinkRef} style={{ display: "none" }} download></a>
      <ShareModal
        open={isShareModalOpen}
        storyDetails={storyDetails}
        users={tempUsers}
        onClose={() => setShareModalOpen(false)}
        updateUsers={(ids) => setUpdatedShareIds(ids)}
      />
      {showVersionModal && (
        <DownloadVersionSelectPopup
          open={showVersionModal}
          story_id={selectedStoryId}
          handleVersionSelect={handleVersionSelect}
          handleDownload={handleVersionDownload}
          onClose={() => setShowVersionModal(false)}
        />
      )}
       {showDeleteModal && (
          <DeleteConfirmationDialog
            open={showDeleteModal}
            onClose={() => setShowDeleteModal(false)}
            onConfirm={handleDelete}
          />
        )}
      {dialogPopup && (
        <ModifyMasterWsPopup
          open={dialogPopup}
          modifyItemObj={selectedRow} 
          onClose={() => setDialogPopup(false)}
          storyWorldOptions={storyWorldOptions}
          filteredOptions={filteredOptions}
          types={type}
          clusterHeads={whos ? whats : wheres}
          // onModify={handleModify}
          type="title" 
        />
      )}
      <FooterButtons
        onDiscard={onDiscard}
        onReset={onReset}
        onSubmit={onSave}
        saveType="Clusters"
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default MasterWssPage;
