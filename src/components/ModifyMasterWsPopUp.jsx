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
  const [secondaryWhoSelectedOptions, setSecondaryWhoSelectedOptions] = useState([]);
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
  const [anythingChanged, setAnythingChanged] = useState(false)
  const clusterHeadsOptions = whoCluster ?? whatCluster ?? whereCluster;
  const {storyUploadApiResponse,setStoryUploadApiResponse,handleAnythingChanged,} = useContext(StoryUploadApiContext);  
  const { token, story_id, storyWorld, fileName, primaryWhos, masterWs, filterDatas } = storyUploadApiResponse;
  const tokenVal = JSON.parse(localStorage.getItem("accessToken"));

  const handleClusterChange = () => {
    if (wsForm === "who") {
      setclusterHeadVals(clusterList.Who)
      setWhoCluster(clusterList?.Who);
    } else if (wsForm === "what") {
      setclusterHeadVals(clusterList.What)
      setWhatCluster(clusterList?.What);
    } else if (wsForm === "where") {
      setWhereCluster(clusterList?.Where);
      setclusterHeadVals(clusterList.Where);
    } else {
      setWhoCluster(null);
      setWhatCluster(null);
      setWhereCluster(null);
    }
  };

  useEffect(() => {
    handleClusterChange(); 
  }, [wsForm, clusterList]); 
  
  useEffect(() => {
    if(!anythingChanged){
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
      setClusterHeadId(modifyItemObj?.id || "");
      setTypo(modifyItemObj?.type || []);
      setWsForm(modifyItemObj?.ws || []);
      setClusterValue(modifyItemObj?.clusterValues?.map(obj => obj.value) || [])
      if(clusterValuesVals?.length === 0 && modifyItemObj?.masterHead?.id === clusterHead?.id){
        getClusterValueData(modifyItemObj?.masterHead,modifyItemObj?.id)
      }
    }

  }, [modifyItemObj, type, clusterHead, clusterHeadVals]);

  const onWsChange = (value) => {
    setWsForm(value);
    setAnythingChanged(true)
  }

  const onTypeChange = (value) => {
    setTypo(value);
    setAnythingChanged(true)
  }
  const [clusterHeadId, setClusterHeadId] = useState("");

  const onClusterHead = (selectedValue, fieldName) => {
    const selectedCluster = clusterHeadVals.find(item => item.value === selectedValue);
    setClusterHead(selectedCluster?.value);
    setClusterHeadId(selectedCluster?.id); 
    getClusterValueData(selectedCluster?.value,selectedCluster?.id)
    setAnythingChanged(true) 
  };

  const onClusterValues = (selectedValue, fieldName) => {
    setClusterValue(selectedValue)
    setAnythingChanged(true);
  };
  
  const getClusterValueData = async (value, clusterId) => {
    const apiUrl = API_BASE_PATH + API_ROUTES.SORT_WS + story_id;
    const payload = {
      clusterHead: { value: value, id: clusterId }, 
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

  const handleUpdate = () => {
    const clusterVals = clusterValuesVals?.filter((obj) => clusterValue?.includes(obj?.id))
    const updatedObj = {
      id: clusterHeadId ? clusterHeadId : modifyItemObj.id, 
      ws: wsForm, 
      type: typo || modifyItemObj.type, 
      masterHead: clusterHead , 
      clusterValues:  modifyItemObj.clusterValues,
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
            onChange={(value) => onWsChange(value, "wsForm")}
            placeholder={"Select Ws Form"}
          >
            {storyWorldOptions?.map((item, index) => (
              <Option key={item.name} value={item?.name}>
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
            onChange={(value) => onTypeChange(value, "typo")} // Pass name 'wsForm' to handleChange
            placeholder={"Select Type"}
          >
            {types?.map((item, index) => (
              <Option key={item.name} value={item?.name}>
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
            onChange={(value) => onClusterHead(value, "clusterHead")} // Pass name 'wsForm' to handleChange
            placeholder="Select Cluster Head"
          >
            {clusterHeadVals?.map((item, index) => (
              <Option key={item?.id} value={item?.value}>
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
            onChange={(value) => onClusterValues(value, "clusterValue")} // Pass name 'wsForm' to handleChange
            placeholder={"Select Cluster Values"}
          >
            {clusterValuesVals?.map((option, index) => (
              <Option key={option.id} value={option.value}>
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
