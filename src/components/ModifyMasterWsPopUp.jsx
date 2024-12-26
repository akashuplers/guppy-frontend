import React, { useState, useEffect } from "react";
import { Button, Modal, Select, Checkbox } from "antd";
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
  filteredOptions,
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
    setClusterHead(modifyItemObj?.clusterHead);
    setTypo(modifyItemObj?.type || []);
    setWsForm(modifyItemObj?.ws || []);
    setClusterValue(modifyItemObj?.clusterValue || [])
  }, [modifyItemObj, type]);

  const handleChange = (e) => {
    setClusterHead(e.target.value);
  };

  const handleUpdate = () => {
    const updatedObj = {
      id: modifyItemObj?.id || "", 
      clusterValue: clusterValue, 
      clusterHead:clusterHead,
      wsForm:wsForm,
      typo:typo
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
          <Select
            size="large"
            className="w-full"
            value={wsForm}
            onChange={handleChange}
            placeholder={"Select Ws Form"}
          >
            {wsForms?.map((item, index) => (
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
            value={typo}
            onChange={handleChange}
            placeholder="Select Type"
          >
            {types?.map((item, index) => (
              <Option key={index} value={item?._id}>
                {item.name}
              </Option>
            ))}
          </Select>
        </div>
        <div>
          <label
            htmlFor="title"
            className="block mt-5 mb-2 font-medium text-gray-900 text-md md:text-lg"
          >
            {"Cluster Head"}
          </label>
          <input
            type="text"
            value={clusterHead}
            onChange={handleChange}
            id="title"
            className="block w-full p-3 text-gray-900 border border-gray-300 rounded-md bg-gray-50 text-md focus:ring-primary-600 focus:border-primary-600"
          />
        </div>
        <div>
          <label
            htmlFor="title"
            className="block mt-5 mb-2 font-medium text-gray-900 text-md md:text-lg"
          >
            {"Cluster Value"}
          </label>
          <input
            type="text"
            value={clusterValue}
            onChange={handleChange}
            id="title"
            className="block w-full p-3 text-gray-900 border border-gray-300 rounded-md bg-gray-50 text-md focus:ring-primary-600 focus:border-primary-600"
          />
        </div>
      </div>
    </Modal>
  );
};

export default ModifyMasterWsPopup;
