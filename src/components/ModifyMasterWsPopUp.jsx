import React, { useState, useEffect, useContext } from "react";
import { Button, Modal, Select, Checkbox } from "antd";
import axios from "axios";
import { API_BASE_PATH, API_ROUTES } from "../constants/api-endpoints";
import { StoryUploadApiContext } from "../contexts/ApiContext";

const { Option } = Select;
const ModifyMasterWsPopup = ({
  open,
  onClose,
  type,
  modifyItemObj,
  onModify = () => {},
  storyWorldOptions,
  types,
  wsForms,
  clusterHeads,
  filteredOptions,
  clusterList
}) => {
  const [currentValue, setCurrentValue] = useState("");
  const [popupTitle, setPopupTitle] = useState("");
  const [secondaryWhoOptions, setSecondaryWhoOptions] = useState([]);
  const [secondaryWhoSelectedOptions, setSecondaryWhoSelectedOptions] =
    useState([]);

  const [primaryWhatOptions, setPrimaryWhatOptions] = useState([]);
  const [wsForm, setWsForm] = useState([]);
  const [typo, setTypo] = useState([]);
  const [clusterHead, setClusterHead] = useState([]);
  const [clusterValue, setClusterValue] = useState([]);
  const [whoCluster, setWhoCluster] = useState([]);
  const [whatCluster, setWhatCluster] = useState([]);
  const [whereCluster, setWhereCluster] = useState([]);
  const [clusterHeadVals, setclusterHeadVals] = useState([]);
  const [clusterValuesVals, setclusterValuesVals] = useState([]);
  const clusterHeadsOptions = whoCluster ?? whatCluster ?? whereCluster;
  
  const {storyUploadApiResponse,setStoryUploadApiResponse,handleAnythingChanged,} = useContext(StoryUploadApiContext);  
  const { token, story_id, storyWorld, fileName, primaryWhos, masterWs, filterDatas } = storyUploadApiResponse;
  const tokenVal = JSON.parse(localStorage.getItem("accessToken"));

  console.log("dddddddddd", wsForm);
  console.log("modifyItemObj", modifyItemObj);
  console.log("clusterHeadsOptions", clusterHeadsOptions);
  
  console.log("filteredOptions", filteredOptions);

  const handleClusterChange = () => {
    if (wsForm === "Who's") {
      setclusterHeadVals(clusterList.Who)
      setWhoCluster(clusterList?.Who);
    } else if (wsForm === "What's") {
      setclusterHeadVals(clusterList.What)
      setWhatCluster(clusterList?.What);
    } else if (wsForm === "Where's") {
      setWhereCluster(clusterList?.Where);
      setclusterHeadVals(clusterList.Where);
    } else {
      // Reset or handle default case if necessary
      setWhoCluster(null);
      setWhatCluster(null);
      setWhereCluster(null);
    }
  };

  useEffect(() => {
    handleClusterChange(); // Trigger the function whenever wsForm or clusterList changes
  }, [wsForm, clusterList]); 
  
  useEffect(() => {
    if (type === "title") {
      setCurrentValue(modifyItemObj?.title || "");
      setPopupTitle("Update Master W's");
    } else if (type === "situation") {
      setCurrentValue(modifyItemObj?.idea || "");
      setPopupTitle("Situation");
    } else {
      setCurrentValue(modifyItemObj?.idea || "");
      setPopupTitle("Action");
    }
    setSecondaryWhoOptions(modifyItemObj?.secondaryWhos || []);
    setSecondaryWhoSelectedOptions(modifyItemObj?.secondaryWhos || []);
    setClusterHead(modifyItemObj?.masterHead);
    setTypo(modifyItemObj?.type || []);
    setWsForm(modifyItemObj?.ws || []);
    setClusterValue(modifyItemObj?.clusterValue?.map(obj => obj.id) || [])
    if(clusterValuesVals?.length === 0 && modifyItemObj?.masterHead?.id === clusterHead?.id){
      const allMH = clusterList[modifyItemObj?.ws.split("'")[0]];
      getClusterValueData(allMH.findIndex(obj =>obj.id===clusterHead.id))
    }
  }, [modifyItemObj, type, clusterHead, clusterHeadVals]);

  

  const handleChange = (value, name) => {
    switch (name) {
      case 'wsForm':
        setWsForm(value);
        if(parseInt(value)===0)
          setclusterHeadVals(clusterList.Who)
        else if(parseInt(value)===1)
          setclusterHeadVals(clusterList.What)
        else if(parseInt(value)===2)
          setclusterHeadVals(clusterList.Where)
        
        setClusterHead([])
        setTypo([])
        setClusterValue([])
        break;
      case 'typo':
        setTypo(value); 
        break;
      case 'clusterHead':
        setClusterHead(value); 
        getClusterValueData(value)
        break;
      case 'clusterValue':
        setClusterValue(value);
        break;
      default:
        break;
    }
    if (value === "0") {
      setWhoCluster(clusterList?.Who);
    } else if (value === "1") {
      setWhatCluster(clusterList?.What);
    } else if (value === "2") {
      setWhereCluster(clusterList?.Where);
    } else {
      // Reset or handle default case if necessary
      setWhoCluster(null);
      setWhatCluster(null);
      setWhereCluster(null);
    }
  };
  const getClusterValueData = async (e, name) => {
    const apiUrl = API_BASE_PATH + API_ROUTES.SORT_WS + story_id;
    const payload = {
      clusterHead: clusterHeadVals[e],
      ws: clusterHeadVals
    };
    
    const config = {
      headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenVal}`,
      },
      };
    try {
      const response = await axios.post(apiUrl, payload, config); 
      const filteredArray = response?.data?.ws?.clusterValues
      setclusterValuesVals(filteredArray)
    } catch (error) {
      console.error("Error calling the API:", error);
    }
  }

  const handleClusterValue = () => {
    if(secondaryWhoSelectedOptions.length === secondaryWhoOptions?.length) {
        setSecondaryWhoSelectedOptions([]);
    } else {
        setSecondaryWhoSelectedOptions(secondaryWhoOptions);
    }
  }

  const handleUpdate = () => {
    const clusterVals = clusterValuesVals?.filter((obj) => clusterValue?.includes(obj?.id))
    const updatedObj = {
      id: modifyItemObj.isNewField ? "" : modifyItemObj.id, 
      ws: wsForm || modifyItemObj.ws, 
      type: typo || modifyItemObj.type, 
      masterHead: clusterHead || modifyItemObj.masterHead, 
      clusterValue: clusterVals || modifyItemObj.clusterValue,
      ...(type === "title" ? { title: currentValue } : { idea: currentValue }), 
      ...(modifyItemObj.isNewField ? { isNewField: true } : { isEditField: true }), 
    };
    onModify(updatedObj);
    onClose();
  };
  
  return (
    <Modal
      open={open}
      centered
      onCancel={onClose}
      width={700}
      footer={[
        <div key="footer">
          <Button onClick={onClose} className="bg-gray-400 border-gray-500">
            Cancel
          </Button>
          {"   "}
          <Button
            onClick={handleUpdate}
            type="primary"
            className="text-blue-500 bg-blue-50"
          >
            Update
          </Button>
        </div>,
      ]}
    >
      <div>
        <label className="block mt-5 mb-2 font-medium text-gray-900 text-md md:text-lg">
          {popupTitle}
        </label>
        <div className="mt-8 mb-6">
        <label className="block mt-5 mb-2 font-medium text-gray-900 text-md md:text-lg">
            Ws Form
          </label>
          <Select
            size="large"
            className="w-full"
            value={wsForm} 
            onChange={(value) => handleChange(value, "wsForm")}
            placeholder={"Select Ws Form"}
          >
            {storyWorldOptions?.map((item, index) => (
              <Option key={index} value={item?._id}>
                {item?.name}
              </Option>
            ))}
          </Select>
        </div>
        <div className="mt-8 mb-6">
        <label className="block mt-5 mb-2 font-medium text-gray-900 text-md md:text-lg">
            Type
          </label>
          <Select
            size="large"
            className="w-full"
            value={typo} // Bind value to the state variable
            onChange={(value) => handleChange(value, "typo")} // Pass name 'wsForm' to handleChange
            placeholder={"Select Type"}
          >
            {types?.map((item, index) => (
              <Option key={index} value={item?._id}>
                {item?.name}
              </Option>
            ))}
          </Select>
        </div>
        <div className="mt-8 mb-6">
          <label className="block mt-5 mb-2 font-medium text-gray-900 text-md md:text-lg">
            {"Cluster Head"}
          </label>
          <Select
            size="large"
            className="w-full"
            value={clusterHead}
            onChange={(value) => handleChange(value, "clusterHead")} // Pass name 'wsForm' to handleChange
            placeholder="Select Cluster Head"
          >
            {clusterHeadVals?.map((item, index) => (
              <Option key={index} value={item?._id}>
                {item.value}
              </Option>
            ))}
          </Select>
        </div>
        <div>
          <label
            htmlFor="secondaryWhos"
            className="block mb-2 text-md md:text-lg font-medium text-gray-900"
          >
            {"Cluster Value"}
          </label>
          <Select
            size="large"
            mode="tags"
            className="w-full"
            value={clusterValue}
            onChange={(value) => handleChange(value, "clusterValue")} // Pass name 'wsForm' to handleChange
            placeholder={"Select Cluster Values"}
          >
            {clusterValuesVals?.map((option, index) => (
              <Option key={index} value={option.id}>
                {option.value}
              </Option>
            ))}
          </Select>
        </div>
      </div>
    </Modal>
  );
};

export default ModifyMasterWsPopup;
