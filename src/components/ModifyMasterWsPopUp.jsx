import React, { useState, useEffect } from "react";
import { Button, Modal, Select, Checkbox } from "antd";

const { Option } = Select;

const ModifyMasterWsPopup = ({ open, onClose, type, modifyItemObj, onModify ,storyWorldOptions, types, clusterHead, filteredOptions }) => {
  const [currentValue, setCurrentValue] = useState("");
  const [popupTitle, setPopupTitle] = useState("");

  // Options and selected values (for example purposes)
  const [secondaryWhoOptions, setSecondaryWhoOptions] = useState([]);
  const [secondaryWhoSelectedOptions, setSecondaryWhoSelectedOptions] = useState([]);

  const [primaryWhatOptions, setPrimaryWhatOptions] = useState([]);
  const [primaryWhatSelectedOptions, setPrimaryWhatSelectedOptions] = useState([]);

  // Update on receiving new `modifyItemObj`
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

    // For simplicity, assume options come from modifyItemObj or context
    setSecondaryWhoOptions(modifyItemObj?.secondaryWhos || []);
    setSecondaryWhoSelectedOptions(modifyItemObj?.secondaryWhos || []);

    setPrimaryWhatOptions(modifyItemObj?.primaryWhats || []);
    setPrimaryWhatSelectedOptions(modifyItemObj?.primaryWhats || []);
  }, [modifyItemObj, type]);

  const handleChange = (e) => {
    setCurrentValue(e.target.value);
  };

  const handleSelectAllSecondaryWhos = () => {
    if (secondaryWhoSelectedOptions.length === secondaryWhoOptions.length) {
      setSecondaryWhoSelectedOptions([]);
    } else {
      setSecondaryWhoSelectedOptions(secondaryWhoOptions);
    }
  };

  const handleSelectAllPrimaryWhats = () => {
    if (primaryWhatSelectedOptions.length === primaryWhatOptions.length) {
      setPrimaryWhatSelectedOptions([]);
    } else {
      setPrimaryWhatSelectedOptions(primaryWhatOptions);
    }
  };

  const handleUpdate = () => {
    const updatedObj = {
      id: modifyItemObj?.id || "", // ensure this is set correctly
      ...(type === "title" ? { title: currentValue } : { idea: currentValue }),
      secondaryWhos: secondaryWhoSelectedOptions,
      primaryWhats: primaryWhatSelectedOptions,
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
          <Button onClick={onClose} className="bg-gray-400 border-gray-500">Cancel</Button>
          <Button onClick={handleUpdate} type="primary" className="text-blue-500 bg-blue-50">Update</Button>
        </div>,
      ]}
    >
      <div>
        {/* Editable text area */}
        <label className="block mt-5 mb-2 text-md">{popupTitle}</label>
        <div className="mt-8 mb-6">
          <label className="block mb-2 text-md">W's Form</label>
          <Select
            size="large"
            mode="multiple"
            className="w-full"
            value={secondaryWhoSelectedOptions}
            onChange={setSecondaryWhoSelectedOptions}
            placeholder="Select W's"
          >
            {storyWorldOptions?.map((item, index) => (
              <Option key={index} value={item?._id}>{item.name}</Option>
            ))}
          </Select>
        </div>

        {/* Primary WHAT Dropdown */}
        <div className="mt-8 mb-6">
          <label className="block mb-2 text-md">Cluster Head</label>
          <Select
            size="large"
            mode="multiple"
            className="w-full"
            value={primaryWhatSelectedOptions}
            onChange={setPrimaryWhatSelectedOptions}
            placeholder="Select Cluster Head"
          >
            {clusterHead?.map((item, index) => (
              <Option key={index} value={item?._id}>{item.name}</Option>
            ))}
          </Select>
        </div>
        <div className="mt-8 mb-6">
          <label className="block mb-2 text-md">Type</label>
          <Select
            size="large"
            mode="multiple"
            className="w-full"
            value={primaryWhatSelectedOptions}
            onChange={setPrimaryWhatSelectedOptions}
            placeholder="Select Type"
          >
            <Option value="select-all">
              <Checkbox
                checked={primaryWhatSelectedOptions.length === primaryWhatOptions.length}
                onChange={handleSelectAllPrimaryWhats}
              />
              Select All
            </Option>
            {types?.map((item, index) => (
              <Option key={index} value={item?._id}>{item.name}</Option>
            ))}
          </Select>
        </div>
        <div className="mt-8 mb-6">
          <label className="block mb-2 text-md">Cluster Value</label>
          <Select
            size="large"
            mode="multiple"
            className="w-full"
            value={primaryWhatSelectedOptions}
            onChange={setPrimaryWhatSelectedOptions}
            placeholder="Select Cluster Value"
          >
            <Option value="select-all">
              <Checkbox
                checked={primaryWhatSelectedOptions.length === primaryWhatOptions.length}
                onChange={handleSelectAllPrimaryWhats}
              />
              Select All
            </Option>
            {filteredOptions?.map((item, index) => (
              <Option key={index} value={item?._id}>{item.name}</Option>
            ))}
          </Select>
        </div>
      </div>
    </Modal>
  );
};

export default ModifyMasterWsPopup;
