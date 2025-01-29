import React, { useEffect, useState, useRef, useContext, useMemo } from "react";
import axios from "axios";
import { Formik } from "formik";
import ShareModal from "../ShareModal";
import FooterButtons from "../FooterButtons";
import { useNavigate } from "react-router-dom";
import DownloadCSVFile from "../../DownloadCsv";
import { Table, message, Modal, Select } from "antd";
import { useFormik, Field, Form, ErrorMessage } from "formik";
import ModifyMasterWsPopup from "../../ModifyMasterWsPopUp";
import { StoryUploadApiContext } from "../../../contexts/ApiContext";
import DownloadVersionSelectPopup from "../DownloadVersionSelectPopup";
import { API_BASE_PATH, API_ROUTES } from "../../../constants/api-endpoints";
import DeleteConfirmationDialog from "../../../utils/modals/DeleteConfirmationDialog";
import SaveConfirmationDialog from "../../../utils/modals/SaveConfirmationModal";

const MasterWssPage = ({
  onDiscard = () => {},
  saveMasterWs,
  handleSaveSuccess = () => {},
}) => {
  const { Option } = Select;
  const navigate = useNavigate();
  const flow = true;
  const [editIndex, setEditIndex] = useState(null);
  const [dialogPopup, setDialogPopup] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isShareModalOpen, setShareModalOpen] = useState(false);
  const [storyDetails, setStoryDetails] = useState(null);
  const [users, setUsers] = useState([]);
  const [tempUsers, setTempUsers] = useState([]);
  const [shareIds, setShareIds] = useState([]);
  const [updatedShareIds, setUpdatedShareIds] = useState([]);
  const [showVersionModal, setShowVersionModal] = useState(false);
  const [isStoryDeleted, setIsStoryDeleted] = useState(false);
  const [selectedStoryId, setSelectedStoryId] = useState("");
  const [selectedVersionId, setSelectedVersionId] = useState("");
  const [clusterList, setClusterList] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const tokenVal = JSON.parse(localStorage.getItem("accessToken"));
  const errorMsg = "Error In Fetching Saved Response";
  const downloadLinkRef = useRef(null);
  const [selected, setSelected] = useState([]);
  const [primaryWhos, setPrimaryWho] = useState([]);
  const [secondaryWhos, setSecondaryWho] = useState([]);
  const [primaryWhats, setPrimaryWhat] = useState([]);
  const [secondaryWhats, setSecondaryWhat] = useState([]);
  const [primaryWheres, setPrimaryWhere] = useState([]);
  const [secondaryWheres, setSecondaryWhere] = useState([]);
  const [myNewData, setMyNewData] = useState([]);
  const [allData, setAllData] = useState([]);
  const [filteredData, setFilteredNewData] = useState([]);
  const [newWhoTypeData,setNewWhoTypeData ] = useState([]);
  const [newWhatTypeData, setNewWhatTypeData] = useState([]);
  const [newWhereTypeData, setNewWhereTypeData] = useState([]);
  const [handleAnyChange, setHandleAnythingChange] = useState(false)
  const meregedData =  [...newWhoTypeData, ...newWhatTypeData, ...newWhereTypeData]

  const [tablePagination, setTablePagination] = useState({
    current: 1,   // Default to page 1
    pageSize: 10, // Default to 10 records per page
  });
  
  const {storyUploadApiResponse,setStoryUploadApiResponse,handleAnythingChanged} = useContext(StoryUploadApiContext);
  const {token,story_id,storyWorld,fileName,storyWorldId,masterws} = storyUploadApiResponse;
  const [filterData, setFilteredData] = useState([]);
  const [selectedTypeByRow, setSelectedTypeByRow] = useState({});

function removeDuplicates(data, typeMapping) {
  const seenIds = new Set(); 
  const uniqueData = [];
  const normalizedData = updateForUnique(data, typeMapping);
  for (const item of normalizedData) {
    if (!seenIds.has(item.id)) {
      seenIds.add(item.id); 
      uniqueData.push(item); 
    }
  }

  return uniqueData;
}

const uniqueData = removeDuplicates(myNewData, selectedTypeByRow);

  const formik = useFormik({
    initialValues: {
      ws: "",
      masterHead: "",
      type: "",
      clusterValues: [],
    },
    onSubmit: () => {
      console.log("submit");
    },
  });

  const [whos, setWhos] = useState([]);
  const [whats, setWhats] = useState([]);
  const [wheres, setWheres] = useState([]);
  const [filteredOptions, setFilteredOption] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [isClusterLoading, setClusterLoading] = useState(false);

  const options = (filteredOptions || [])?.map((item) => ({
    label: item?.value,
    value: item?.id,
  }));
  
  const fetchMasterWsList = async () => {
    setClusterLoading(true);
    let alertKey = null; 
    try {
      const apiUrl = API_BASE_PATH + API_ROUTES.MASTER_WS_LIST + storyWorldId;
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenVal}`,
        },
      };
      alertKey = message.loading("Fetching Clusters...", 0).key;
      const response = await axios.get(apiUrl, config);
      const output = response?.data?.masterWs;

      if(output) {
      setTableData(groupDataByTypeAndWs(output));
      message.destroy(alertKey);
      message.success("Clusters Fetched Successfully !");
      } else {
        message.destroy(alertKey);
      }
    } catch (error) {
      console.error("Error:", error);
      if (alertKey) message.destroy(alertKey);
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
          message.error("Error In Fetching Clusters !");
          }
      }
    }
    finally {
      setClusterLoading(false);
    }
  };

  useEffect(() => {
    fetchMasterWsList();
  }, [storyWorldId]);

const handleDelete = () => {
  const deleteId= selectedRow?.id
  if (deleteId !== null && deleteId !== undefined) {
    const tableIndex = tableData.findIndex((item) => item.id === deleteId);
    const filterIndex = filterData.findIndex((item) => item.id === deleteId);
    const myNewDataIndex = myNewData.findIndex((item) => item.id === deleteId);
    const newWhoDataIndex = newWhoTypeData.findIndex((item) => item.id === deleteId);
    const newWhatDataIndex = newWhatTypeData.findIndex((item) => item.id === deleteId);
    const newWhereDataIndex = newWhereTypeData.findIndex((item) => item.id === deleteId);
    let updatedTableData = [...tableData];
    let updatedFilterData = [...filterData];
    let updateMyNewData = [...myNewData];
    if (myNewDataIndex !== -1) {
      updateMyNewData = myNewData.filter((item) => item.id !== deleteId);
      setMyNewData(updateMyNewData);
      
    } 
    if (tableIndex !== -1) {
      updatedTableData = tableData.filter((item) => item.id !== deleteId);
      setTableData(updatedTableData);
    }
     else {
      // If deleteId is not found in either dataset
      return;
    }

    setShowDeleteModal(false);
    message.success("Deleted Successfully!");
    handleAnythingChanged(true);
  } else {
    message.error("Invalid ID for deletion.");
  }
};
  
  useEffect(() => {
    if (!tokenVal) {
      navigate("/");
    } 
  }, [isStoryDeleted]);

  useEffect(() => {
    if (shareIds || updatedShareIds) {
      handleSharedUsers();
    }
  }, [shareIds, updatedShareIds]);

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
  };

  useEffect(() => {
    clusterHeadWsList();
  }, [story_id]);

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

  const handleRemoveChip = (value) => {
    // debugger
    const removeChipFromClusterValues = (data, isIdCheck) => {
      return data.map((item) => ({
        ...item,
        clusterValues: item.clusterValues.filter(
          (clusterItem) => (isIdCheck ? clusterItem?.id !== value?.id : clusterItem?.value !== value?.value)
        ),
      }));
    };
    if(myNewData?.length > 0) {
      const updatedNewData = removeChipFromClusterValues(myNewData, true); 
      setMyNewData(updatedNewData);
    }
    if(forFilter?.length > 0) {
      const updatedNewData = removeChipFromClusterValues(forFilter, true); 
      setForFilter(updatedNewData);
    }
    handleAnythingChanged(true);
    message.success("Cluster Value removed successfully!");
  };
  
  useEffect(() => {
    if(saveMasterWs){
      handleOpenDialog()
    }
  }, [saveMasterWs]);

  const type = [
    { id: 1, name: "Primary" },
    { id: 2, name: "Secondary" },
  ];

  const [typo, setTypo] = useState(type);

  const handleRadioChange = (recordId, selectedType) => {
    setSelectedTypeByRow((prev) => ({
      ...prev,
      [recordId]: selectedType,
    }));
  };  
  
  const historyColumns = [
    {
      dataIndex: "id",
      title: "S.No",
      render: (text, record, index) => index + 1,
      // render: (text, record, index) => {
      //   const currentStartIndex =
      //     (tablePagination.current - 1) * tablePagination.pageSize;
      //   return currentStartIndex + index + 1;
      // },
      width: 60,
    },
    {
      dataIndex: "ws",
      title: "W's Form",
      render: (text, record) => {
        return (
          <div>
            <span>{record?.ws}</span>{" "}
          </div>
        );
      },
    },
    {
      dataIndex: 'type',
      title: 'Type',
      render: (text, record) => {
        // Extract type array and preselected type
        const typoArray = Array.isArray(record?.type) ? record?.type : record?.apiType ?? [];
        const preSelectedType =
          typeof record?.type === 'object' && record?.type?.name ? record?.type?.name : null;
    
        // Dynamically check if "Primary" is selected for any record with ws: "who"
        const isPrimarySelectedForWho = updateNewData.some(
          (item) => item.ws === 'who' && (item.type === 'Primary' || selectedTypeByRow[item.id] === 'Primary')
        );
    
        return (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
          {typoArray.map((typeItem) => {
            // Determine if this option should be disabled
            const isDisabled =
              record.ws === 'who' &&
              typeItem.name === 'Primary' &&
              isPrimarySelectedForWho &&
              selectedTypeByRow[record.id] !== 'Primary';
        
            // Determine the background color based on selection
            const backgroundColor =
              selectedTypeByRow[record.id] === typeItem.name // User-selected value
                ? 'green'
                : preSelectedType === typeItem.name && !selectedTypeByRow[record.id] // Pre-selected value when no new selection
                ? 'green'
                : 'white';
        
            return (
              <label
                key={typeItem.id || typeItem.name}
                style={{
                  marginBottom: '5px',
                  color: isDisabled ? '#b0b0b0' : 'black', // Greyed-out text for disabled
                  cursor: isDisabled ? 'not-allowed' : 'pointer', // Pointer cursor
                  opacity: isDisabled ? 0.6 : 1, // Reduced opacity for disabled
                }}
              >
                <input
                  type="radio"
                  name={`type-${record.id}`} // Group radio buttons by record ID
                  value={typeItem.name}
                  onChange={() => handleRadioChange(record.id, typeItem.name)} // Handle selection
                  style={{
                    marginRight: '10px',
                    width: '20px',
                    height: '20px',
                    border: '0.5px solid',
                    borderRadius: '50%', // Circular shape
                    backgroundColor: backgroundColor, // Highlight logic
                    cursor: isDisabled ? 'not-allowed' : 'pointer',
                  }}
                  checked={
                    selectedTypeByRow[record.id] === typeItem.name || // User-selected value
                    preSelectedType === typeItem.name // Pre-selected value
                  }
                  disabled={isDisabled} // Apply disable logic
                />
                {typeItem.name}
              </label>
            );
          })}
        </div>
        
        );
      },
    },
    {
      dataIndex: "masterHead",
      title: "Cluster Head",
      render: (text, record) => {
        return (
          <div>
            <span>{record?.masterHead?.value ?? record?.masterHead}</span>
          </div>
        );
      },
    },
    {
      dataIndex: "clusterValues",
      title: "Cluster Value",
      render: (clusterValues, record, index) => {
        const normalizedClusterValues =
          typeof clusterValues === "string"
            ? clusterValues
                .split(", ")
                .map((value) => ({ value: value?.trim() }))
            : clusterValues || [];

        return (
          <div className="flex flex-wrap gap-2">
            {normalizedClusterValues?.length > 0
              ? normalizedClusterValues?.map((value, idx) => (
                  <div
                    key={idx}
                    className="flex items-center bg-gray-200 rounded-lg px-2.5 py-1.5 text-sm text-gray-800 border border-gray-300"
                  >
                    <span>{value?.value ?? value ?? []}</span>
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
              : "NA"}
          </div>
        );
      },
    },
    {
      dataIndex: "action",
      title: "Action",
      render: (val, record, index) => {
        const matchedData = updateNewData.some((data) => data.id === record?.id);        
        return (
          <div style={{ display: "flex", gap: "15px" }}>
            <button
              title="View/Modify"
              onClick={() => {
                if(matchedData == false) {
                  setIsDialogOpen(true);
                  setTitles("Please Select all type either Primary or Secondary");
                } else {
                  setDialogPopup(true);
                }
                setSelectedRow(record);
                setEditIndex(index);
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
                setDeleteIndex(index);
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

  const storyWorldOptions = [
    { id: 1, name: "who" },
    { id: 2, name: "what" },
    { id: 3, name: "where" },
  ];

  const onReset = () => {
    setTableData(processData(masterws?.masterWs));
    message.success("Reset Successfully !");
    handleAnythingChanged(true);
  };
  
  const [blankValue, setBlankValue] = useState();
  const [fieldValue, setFieldValue] = useState();

  const organizeDataByWs = (data) => {
    const categorizedData = {
      who: [],
      what: [],
      where: []
    };
  
    data.forEach((item) => {
      if (item.ws === "who") {
        categorizedData.who.push(item);
      } else if (item.ws === "what") {
        categorizedData.what.push(item);
      } else if (item.ws === "where") {
        categorizedData.where.push(item);
      }
    });
  
    return categorizedData;
  };
  
  const [forFilter, setForFilter] = useState([])
  
  const handleChange = async (e, name) => { 
    const categorizedData = organizeDataByWs(tableData);
    const blankValue = e?.target?.value;
    const fieldName = name;
    let combinedData = []; 

    setFieldValue(fieldName)
    setBlankValue(blankValue)
    if (e?.target?.value === "who") {
      setWhos(clusterList?.Who);
      const dataSource = clusterList?.Who?.map((item, index) => ({
        id: item.id, 
        ws: e?.target?.value, 
        type: typo,  
        masterHead: item.value, 
        clusterValues: [],
      }));

      combinedData = [...categorizedData?.who, ...dataSource] 
      
      setFilteredData(dataSource)
      if(newWhoTypeData?.length === 0){
        setMyNewData(removeDuplicates(combinedData))
      } else if(newWhoTypeData?.length > 0){
        setMyNewData(newWhoTypeData)
      }
      if(newWhoTypeData?.length > 0) {
        handleAnythingChanged(true);
      } else if (newWhoTypeData?.length === 0) {
        handleAnythingChanged(false);
      } else if (newWhoTypeData?.length !== categorizedData?.who) {
        handleAnythingChanged(true);
      } else {
        handleAnythingChanged(false);
      }
      setForFilter(removeDuplicates(combinedData))
      setWhoSelectedValue(e?.target?.value)
      setWhatSelectedValue(false);
      setWhereSelectedValue(false);      
      setWhats([]);
      setWheres([]);
    } else if (e?.target?.value === "what") {
      setWhats(clusterList?.What);
      const dataSource = clusterList?.What?.map((item, index) => ({
        id: item.id, 
        ws: e?.target?.value, 
        type: typo,  
        masterHead: item.value,
        clusterValues: [], 
      }));
      combinedData = [...categorizedData?.what, ...dataSource] 
      setFilteredData(dataSource)
      if(newWhatTypeData?.length === 0){
        setMyNewData(removeDuplicates(combinedData))
      } else if(newWhatTypeData?.length > 0){
        setMyNewData(newWhatTypeData)
      }
      if(newWhatTypeData?.length > 0) {
        handleAnythingChanged(true);
      } else if (newWhatTypeData?.length === 0) {
        handleAnythingChanged(false);
      } else if (newWhatTypeData?.length !== categorizedData?.what) {
        handleAnythingChanged(true);
      } else {
        handleAnythingChanged(false);
      }
      setForFilter(removeDuplicates(combinedData))
      setWhatSelectedValue(e?.target?.value);
      setWhereSelectedValue(false);
      setWhoSelectedValue(false);
      setWhos([]);
      setWheres([]);
    } else if (e?.target?.value === "where") {
      setWheres(clusterList?.Where);
      const dataSource = clusterList?.Where?.map((item, index) => ({
        id: item.id,
        ws: e?.target?.value, 
        type: typo, 
        masterHead: item.value, 
        clusterValues: [], 
      }));
      combinedData = [...categorizedData?.where, ...dataSource] 
      setFilteredData(dataSource)
      if(newWhereTypeData?.length === 0){
        setMyNewData(removeDuplicates(combinedData))
      } else if(newWhereTypeData?.length > 0){
        setMyNewData(newWhereTypeData)
      }
      if(newWhereTypeData?.length > 0) {
        handleAnythingChanged(true);
      } else if (newWhereTypeData?.length === 0) {
        handleAnythingChanged(false);
      } else if (newWhereTypeData?.length !== categorizedData?.where) {
        handleAnythingChanged(true);
      } else {
        handleAnythingChanged(false);
      }
      setForFilter(removeDuplicates(combinedData))
      setWhereSelectedValue(e?.target?.value);
      setWhatSelectedValue(false);
      setWhoSelectedValue(false);
      formik.setFieldValue("masterHead", { id: "", value: "" }); 
      setWhats([]);
      setWhos([]);
      
    }  else if(blankValue=="" && name==="ws"){
      setMyNewData([]);
    }

    if (name === "ws") {
      formik.setFieldValue("ws", e.target.value);
    } 
  };

  const getUpdatedJson = (list) => {
    const arr = list || [];
    if (arr && arr.length > 0) {
      const updated = arr.map((item, index) => ({
        id: item.id,
        title: item.Title,
        primaryWhos: item.Who_Primary,
        secondaryWhos: item.Who_Secondary,
        primaryWhats: item.What_Primary,
        secondaryWhats: item.What_Secondary,
        primaryWheres: item.Where_Primary,
        secondaryWheres: item.Where_Secondary,
        new: item.new,
        updated: item.updated,
        comment: item.comment,
      }));
      return updated;
    }
    return [];
  };

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
      alertKey = message.loading("Saving Clusters...", 0).key;
      const response = await axios.post(apiUrl, payload, config);
      const output = response?.data;
      if (output) {
        const { masterWs, titles } = output;
        const contextObj = { ...storyUploadApiResponse };
        const updatedContextObj = {
          ...contextObj,
          masterWs: masterWs,
          filterDatas: filterData,
          titles: getUpdatedJson(titles),
          updatedTitles: getUpdatedJson(titles),
          primaryWhos: primaryWhos,
          secondaryWhos: secondaryWhos,
          primaryWhats: primaryWhats,
          secondaryWhats: secondaryWhats,
          primaryWheres: primaryWheres,
          secondaryWheres: secondaryWheres,
        };
        setStoryUploadApiResponse(updatedContextObj);
        setIsSaved(true);
        message.destroy(alertKey);
        message.success("Clusters Saved Successfully !");
        handleSaveSuccess(true);
        handleAnythingChanged(false);
        setHandleAnythingChange(true)
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
          message.error("Error In Saving Ws ! Unable To Fetch Response !");
        }
      }
    }
    setIsSubmitting(false);
  };

  function convertData(inputData) {

    const result = {};
  
    inputData.forEach((item, index) => {
      const wsKey = item.ws.toLowerCase().replace(/'s$/, ""); 
      if (!result[wsKey]) {
        result[wsKey] = [];
      }
  
      const formattedItem = {
        id: item.masterHead?.id ?? item.id,
        masterHead: item?.masterHead?.value || item?.masterHead, 
        clusterValues: item?.clusterValues?.map((cluster) => ({
          id: cluster?.id,
          value: cluster?.value,
        })) || [], 
        type: item?.type || [], 
        apiType: item?.apiType ?? item?.type,
        new: filterData?.length > 0 ? true:item?.new, 
        updated: item?.updated === true ? true : item?.updated ?? false, 
      };
  
      result[wsKey].push(formattedItem); 
    });
  
    return result;
  }

  function groupDataByTypeAndWs(apiData) {
    const typeArray = [
      { id: 1, name: "Primary" },
      { id: 2, name: "Secondary" },
    ];
  
    const result = [];
  
    Object.keys(apiData).forEach((ws) => {
      Object.keys(apiData[ws]).forEach((typeKey) => {
        const items = apiData[ws][typeKey];
  
        if (Array.isArray(items)) {
          items.forEach((item) => {
            
            result.push({
              ws, 
              type: typeArray.find((type) => type.name.toLowerCase() === typeKey), 
              id: item.id, 
              apiType:typeArray,
              masterHead: item.masterHead, 
              clusterValues: item.clusterValues?.map((cluster) => ({
                id: cluster?.id,
                value: cluster?.value,
              })) || [], 
              new: item.new === true, 
              updated: item.updated === true, 
            });
          });
        }
      });
    });
  
    return result;
  }
  
  const manualData = convertData(filterData);

  const processData = (data) => {
    const result = [];
  
    Object.keys(data)?.forEach((ws) => {
      data[ws]?.forEach((item) => {
        result.push({
          ws, 
          id: item?.id, 
          type: item?.type || [], 
          masterHead: item?.masterHead, 
          clusterValues: item?.clusterValues?.map((cluster) => ({
            id: cluster?.id,
            value: cluster?.value,
          })), 
          new: filterData?.length > 0 ? true:item?.new, 
          updated: item?.updated === true, 
          apiType: item?.apiType,
          index: item?.index, 
        });
      });
    });
  
    result.sort((a, b) => a.index - b.index);
  
    return result;
  };

  const newManualData = useMemo(
    () => processData(manualData || []),
    [manualData]
  );

  const flattenData = myNewData?.map((item) => {
    const normalizedClusterValues = (() => {
      if (Array?.isArray(item?.clusterValues)) {
        return item?.clusterValues.map((val) =>
          typeof val === "object" ? val?.value : val
        );
      } else if (typeof item?.clusterValues === "string") {
        return item?.clusterValues?.split(",").map((value) => value?.trim());
      }
      return [];
    })();

    return {
      ws: item?.ws ?? "",
      type: item?.type ?? "",
      ClusterHead: item?.masterHead ?? "",
      clusterValues: normalizedClusterValues?.join(", "),
    };
  });

  const transformData = (data) => {
    const result = {
      who: {
        primary: [],
        secondary: [],
      },
      what: {
        primary: [],
        secondary: [],
      },
      where: {
        primary: [],
        secondary: [],
      },
    };

    data?.forEach((item) => {
      const newItem = {
        id: item.id ?? null,
        masterHead: item?.masterHead?.value ?? item.masterHead, 
        clusterValues: item.clusterValues?.map((cluster) => ({
          id: cluster.id,
          value: cluster.value,
        })),
        new:filterData?.length > 0 ? true:item?.new ,
        updated: item.updated,
      };

      if (item.ws === "who") {
        if (item.type.toLowerCase() === "primary") {
          result.who.primary.push(newItem);
        } else {
          result.who.secondary.push(newItem);
        }
      } else if (item.ws === "what") {
        if (item.type.toLowerCase() === "primary") {
          result.what.primary.push(newItem);
        } else {
          result.what.secondary.push(newItem);
        }
      } else if (item.ws === "where") {
        if (item.type.toLowerCase() === "primary") {
          result.where.primary.push(newItem);
        } else {
          result.where.secondary.push(newItem);
        }
      }
    });

    return cleanEmptySections(result);
  };

  const cleanEmptySections = (data) => {
    const cleanedData = {};
  
    for (const [key, value] of Object.entries(data)) {
      const hasPrimary = value.primary.length > 0;
      const hasSecondary = value.secondary.length > 0;
  
      if (hasPrimary || hasSecondary) {
        cleanedData[key] = {
          ...(hasPrimary && { primary: value.primary }),
          ...(hasSecondary && { secondary: value.secondary }),
        };
      }
    }
    return cleanedData;
  };
  
  function updateAndNormalizeData(data, typeMapping) {
    return data.map((item) => {
      let updatedItem = { ...item };
  
      if (typeMapping && typeMapping[item.id]) {
        updatedItem.type = typeMapping[item.id];
      }
      else {
        updatedItem.type = item.type?.name ?  item.type.name:undefined ;
      }

        delete updatedItem.apiType;
     
      
      return updatedItem;
    })
    .filter((item) => item.type !== undefined);
  }
  
  function updateForUnique(data, typeMapping) {
    const typeArray = [
      { id: 1, name: "Primary" },
      { id: 2, name: "Secondary" },
    ];
    return data.map((item) => {
      let updatedItem = { ...item };
  
      if (typeMapping && typeMapping[item.id]) {
        const name = typeMapping[item.id];
        const id = name === "Primary" ? 1 : name === "Secondary" ? 2 : undefined;
        updatedItem.type = {
          id: id, 
          name: name, 
        };
      }
      else {
        updatedItem.type = item.type ?  item.type:undefined ;
      }
      updatedItem.apiType = typeArray;
      
      return updatedItem;
    })
    .filter((item) => item.type !== undefined);
  }

  const updatedData = updateAndNormalizeData(meregedData, selectedTypeByRow); 
  const apiData = updateAndNormalizeData(tableData, selectedTypeByRow)

const updatedWhoData = updatedData.filter(item => item.ws === "who");
const updatedWhatData = updatedData.filter(item => item.ws === "what");
const updatedWhereData = updatedData.filter(item => item.ws === "where");

const apiWhoData = apiData.filter(item => item.ws === "who");
const apiDataWhatData = apiData.filter(item => item.ws === "what");
const apiDataWhereData = apiData.filter(item => item.ws === "where");

let newMergedData = [];
if (updatedWhoData?.length > 0) {
  if (apiDataWhatData?.length > 0 || apiDataWhereData?.length > 0) {
    if (updatedWhatData?.length === 0 && updatedWhereData?.length === 0) {
      newMergedData = [...updatedWhoData, ...apiDataWhatData, ...apiDataWhereData];
    }
  }

  if (updatedWhatData?.length > 0 && updatedWhereData?.length === 0 && apiDataWhereData?.length > 0) {
    newMergedData = [...updatedWhoData, ...updatedWhatData, ...apiDataWhereData];
  }
}

  const newGeneratedData = (updatedData?.length == 0) ? apiData:newMergedData?.length > 0 ? newMergedData: updatedData  
  const [updateNewData, setUpdateNewData] = useState([]);
  const prevDataRef = useRef(null);
  
  useEffect(() => {
    const currentDataString = JSON.stringify(newGeneratedData);
    const previousDataString = JSON.stringify(prevDataRef.current);
    if (currentDataString !== previousDataString) {
      const uniqueData = removeDuplicates(newGeneratedData);
      setUpdateNewData(uniqueData);
      prevDataRef.current = newGeneratedData; 
    }
  }, [newGeneratedData]);
  
  const checkIfPrimaryWhoExists = (data) => {
    return data.some(item => item.ws === "who" && (item.type.name === "Primary" || item.type === "Primary"));
  };

  const transformedData = transformData(updateNewData|| []);
  const [whoSelectedValues, setWhoSelectedValue] = useState(false);
  const [whatSelectedValues, setWhatSelectedValue] = useState(false);
  const [whereSelectedValues, setWhereSelectedValue] = useState(false);
  const whosRef = useRef(whos);
  const whatsRef = useRef(whats);
  const wheresRef = useRef(wheres);

  useEffect(() => {
  const whosChanged = whosRef.current !== whos;
  const whatsChanged = whatsRef.current !== whats;
  const wheresChanged = wheresRef.current !== wheres;
  whosRef.current = whos;
  whatsRef.current = whats;
  wheresRef.current = wheres;
    if (
      (filterData?.length > 0 || tableData?.length > 0) &&
      (whoSelectedValues || whatSelectedValues || whereSelectedValues || blankValue === "") &&
      (whosChanged || whatsChanged || wheresChanged)
    ) {
      let masterHeadValues = [];
      let clusterValues = [];
  
      if (filterData?.length > 0 && tableData?.length > 0) {
        masterHeadValues = [
          ...new Set([
            ...filterData.map((item) => item.masterHead?.value || item?.masterHead),
            ...tableData.map((item) => item.masterHead),
          ]),
        ];
        clusterValues = [
          ...new Set([
            ...filterData.flatMap((item) =>
              item.clusterValues?.map((cluster) => cluster.value) || []
            ),
            ...tableData.flatMap((item) =>
              item.clusterValues?.map((cluster) => cluster.value) || []
            ),
          ]),
        ];
      } else if (filterData?.length > 0) {
        masterHeadValues = filterData.map((item) => item.masterHead?.value || item?.masterHead);
        clusterValues = filterData.flatMap((item) =>
          item.clusterValues?.map((cluster) => cluster.value) || []
        );
      } else if (tableData?.length > 0) {
        masterHeadValues = tableData.map((item) => item.masterHead);
        clusterValues = tableData.flatMap((item) =>
          item.clusterValues?.map((cluster) => cluster.value) || []
        );
      }
  
      const combinedValues = [...new Set([...masterHeadValues, ...clusterValues])];
  
      if (combinedValues?.length > 0) {
        setWhos((prevWhos) => {
          if (whoSelectedValues) {
            return (clusterList?.Who || []).filter(
              (item) => !combinedValues.includes(item.value)
            );
          }
          return prevWhos;
        });
  
        setWheres((prevWheres) => {
          if (whereSelectedValues) {
            return (clusterList?.Where || []).filter(
              (item) => !combinedValues.includes(item.value)
            );
          }
          return prevWheres;
        });
  
        setWhats((prevWhats) => {
          if (whatSelectedValues) {
            return (clusterList?.What || []).filter(
              (item) => !combinedValues.includes(item.value)
            );
          }
          return prevWhats;
        });
  
        if (whoSelectedValues) {
          setWhats([]);
          setWheres([]);
        } else if (whatSelectedValues) {
          setWhos([]);
          setWheres([]);
        } else if (whereSelectedValues) {
          setWhos([]);
          setWhats([]);
        }
  
        if (blankValue === "") {
          setWhos([]);
          setWhats([]);
          setWheres([]);
        }
  
        if (filterData?.length > 0) {
          setFilteredOption((prevFilteredOptions) =>
            prevFilteredOptions?.filter(
              (item) => !combinedValues.includes(item.value)
            )
          );
        }
      }
    }
  }, [
    filterData,
    tableData,
    whoSelectedValues,
    whatSelectedValues,
    whereSelectedValues,
    blankValue,
  ]);  

  const onModify = (updatedObj) => {
    let modifiedFilterData = [];
    let modifiedTableData = [];
    let modifiedMyNewTableData = [];
    if(myNewData?.length > 0) {
      const curFilterData = [...myNewData];
      modifiedMyNewTableData = curFilterData.map((ele) =>
        ele.id === selectedRow.id ? updatedObj : ele
      );
      setMyNewData(modifiedMyNewTableData)
      message.success("Updated Successfully!");
    }
    handleAnythingChanged(true);
  };

  const handleSaveModalClose = () => {
    handleCloseDialog();
  };

  useEffect(() => {
    if (myNewData) {
      const { who, what, where } = transformedData;
      const extractIdAndValue = (data = []) =>
        data.map(({ id, masterHead }) => ({
          id,
          value: masterHead || null,
        }));
      const primaryWho = extractIdAndValue(who?.primary || []);
      const secondaryWho = extractIdAndValue(who?.secondary || []);
      const primaryWhat = extractIdAndValue(what?.primary || []);
      const secondaryWhat = extractIdAndValue(what?.secondary || []);
      const primaryWhere = extractIdAndValue(where?.primary || []);
      const secondaryWhere = extractIdAndValue(where?.secondary || []);
      setPrimaryWho(primaryWho);
      setSecondaryWho(secondaryWho);
      setPrimaryWhat(primaryWhat);
      setSecondaryWhat(secondaryWhat);
      setPrimaryWhere(primaryWhere);
      setSecondaryWhere(secondaryWhere);
    }
  }, [myNewData]); 

  const handleTableChange = (pagination) => {
    setTablePagination({
      current: pagination.current,
      pageSize: pagination.pageSize,
    });
  };

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [titles, setTitles] = useState(false);

  const handleOpenDialog = () => {
    const hasPrimaryWho = checkIfPrimaryWhoExists(updateNewData);
    if (meregedData?.length === updateNewData?.length && hasPrimaryWho) {
      onSave();
    } else {
      setIsDialogOpen(true);
      if (meregedData?.length !== updateNewData?.length) {
        setTitles("Please Select type as either Primary or Secondary");
      } else if (!hasPrimaryWho) {
        setTitles("Please Select one who Primary");
      }
    }
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

const removeDuplicateClusterHeads = (data) => {
  const clusterHeads = new Set();
  data.forEach((item) => {
    item.clusterValues?.forEach((cluster) => {
      clusterHeads.add(cluster.value);
    });
  });

  const filteredData = data.filter((item) => !clusterHeads.has(item.masterHead));

  return filteredData;
};

const handleDataFiltering = (newData) => {
  const newFilteredData = removeDuplicateClusterHeads(newData);
  setFilteredNewData(newFilteredData);
};

useEffect(() => {
    handleDataFiltering(myNewData);
}, [myNewData]);

const uniqueFilterData = removeDuplicates(filteredData, selectedTypeByRow);

useEffect(()=>{
  const uniqueFilterDatas = removeDuplicates(filteredData, selectedTypeByRow);
if(whoSelectedValues === "who"){
  setNewWhoTypeData(uniqueFilterDatas)
} else if(whatSelectedValues === "what"){
  setNewWhatTypeData(uniqueFilterDatas)
} else if(whereSelectedValues === "where") {
  setNewWhereTypeData(uniqueFilterDatas)
}
}, [filteredData, selectedTypeByRow, whoSelectedValues, whatSelectedValues, whereSelectedValues])

useEffect(()=>{
  if (handleAnyChange === true) {
    handleAnythingChanged(false);
  } 
},[handleAnyChange])

  return (
    <>
      <div className="px-5 pb-5 border rounded-md">
        <Formik
          initialValues={{
            ws: "",
            masterHead: "",
            type: "",
            clusterValues: [],
          }}
          onSubmit={formik.handleSubmit}
        >
          {({ values, resetForm }) => (
            <Form>
              <div className="flex flex-col justify-between mt-5 mb-3 text-lg md:flex-row md:items-center md:text-xl md:mb-4">
                <p className="text-center md:text-left">Step-3 : Master W's</p>
                <div className="flex flex-col items-center space-y-4 mt-4 md:mt-0 md:space-y-0 md:flex-row md:space-x-4">
                  <button
                    type="submit"
                    className="w-full max-w-[120px] px-4 py-2 text-sm font-medium text-center text-white bg-blue-600 rounded-lg hover:bg-blue-500 focus:ring-4 focus:outline-none focus:ring-blue-300 md:w-24 lg:w-28"
                  >
                    <DownloadCSVFile
                      csvDat={flattenData}
                      fileName={fileName}
                      storyWorld={storyWorld}
                    />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 mt-4">
                <div>
                  <label
                    htmlFor="ws"
                    className="block mb-2 text-sm font-medium text-gray-900"
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
              </div>
            </Form>
          )}
        </Formik>

        <div className="overflow-auto mt-8">
          {!isClusterLoading && (
            <Table
              dataSource={uniqueFilterData}
              columns={historyColumns}
              className="custom-table"
              // pagination={{ pageSize: 10 }}
              // onChange={handleTableChange}
              bordered
            />
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
      {dialogPopup && flow && (
        <ModifyMasterWsPopup
          open={dialogPopup}
          filteredNewData={filteredData}
          modifyItemObj={selectedRow}
          clusterList={clusterList}
          whos={whos}
          updateNewData={updateNewData}
          uniqueFilterData={uniqueFilterData}
          whats={whats}
          wheres={wheres}
          tableData={tableData}
          filterData={filterData}
          onClose={() => setDialogPopup(false)}
          storyWorldOptions={storyWorldOptions}
          filteredOptions={options}
          types={type}
          clusterHeads={whos ? whats : wheres}
          onModify={onModify}
          modalType="InBetweenFlow"
          myNewData={myNewData}
        />
      )}
      <FooterButtons
        onDiscard={onDiscard}
        onReset={onReset}
        onSubmit={handleOpenDialog}
        // onSubmit={onSave}
        saveType="Clusters"
        isSubmitting={isSubmitting}
      />
      <div>
      {isDialogOpen && (
        <SaveConfirmationDialog
          open={isDialogOpen}
          onClose={handleSaveModalClose}
          title={titles}
        />
      )}
    </div>
    </>
  );
};

export default MasterWssPage;
