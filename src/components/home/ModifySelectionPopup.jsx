import { Button, Checkbox, Modal, Select } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { StoryUploadApiContext } from "../../contexts/ApiContext";
const { Option } = Select;

const ModifySelectionPopup = ({
  open,
  onClose = () => {},
  modifyItemObj,
  onModify = () => {},
  type,
}) => {
  const [currentValue, setCurrentValue] = useState("");
  const [popupTitle, setPopupTitle] = useState("");

  const [secondaryWhoOptions, setSecondaryWhoOptions] = useState([]);
  const [secondaryWhoSelectedOptions, setSecondaryWhoSelectedOptions] = useState([]);
  // whats
  const [primaryWhatOptions, setPrimaryWhatOptions] = useState([]);
  const [primaryWhatSelectedOptions, setPrimaryWhatSelectedOptions] = useState([]);
  const [secondaryWhatOptions, setSecondaryWhatOptions] = useState([]);
  const [secondaryWhatSelectedOptions, setSecondaryWhatSelectedOptions] = useState([]);
  // wheres
  const [primaryWhereOptions, setPrimaryWhereOptions] = useState([]);
  const [primaryWhereSelectedOptions, setPrimaryWhereSelectedOptions] = useState([]);
  const [secondaryWhereOptions, setSecondaryWhereOptions] = useState([]);
  const [secondaryWhereSelectedOptions, setSecondaryWhereSelectedOptions] = useState([]);

  // story upload context
  const { storyUploadApiResponse } = useContext(StoryUploadApiContext);
  const { primaryWhos, secondaryWhos, primaryWhats, secondaryWhats, primaryWheres, secondaryWheres } = storyUploadApiResponse;
console.log("secondaryWhatOptions",secondaryWhatOptions);
console.log("modifyItemObj", modifyItemObj);

  useEffect(() => {
    debugger
    if(type === "title") {
        setCurrentValue(modifyItemObj.title);
        setPopupTitle("Title/Sentence");
    } else if(type === "situation") {
        setCurrentValue(modifyItemObj.idea);
        setPopupTitle("Situation");
    } else {
        setCurrentValue(modifyItemObj.idea);
        setPopupTitle("Action");
    }

    //secondaryWhos
    const tableSecondaryWhos = [...new Set([ ...secondaryWhos])];
    setSecondaryWhoOptions(tableSecondaryWhos || []);
    setSecondaryWhoSelectedOptions(modifyItemObj.secondaryWhos || []);
    // primaryWhats
    const tablePrimaryWhats = [...new Set([ ...primaryWhats])];
    setPrimaryWhatOptions(tablePrimaryWhats || []);
    setPrimaryWhatSelectedOptions(modifyItemObj?.primaryWhats || []);
    //secondaryWhats
    const tableSecondaryWhats = [...new Set([ ...secondaryWhats])];
    setSecondaryWhatOptions(tableSecondaryWhats || []);
    setSecondaryWhatSelectedOptions(modifyItemObj.secondaryWhats || []);
    // primaryWheres
    const tablePrimaryWheres = [...new Set([...primaryWheres])];
    setPrimaryWhereOptions(tablePrimaryWheres || []);
    setPrimaryWhereSelectedOptions(modifyItemObj?.primaryWheres || []);
    //secondaryWheres
    const tableSecondaryWheres = [...new Set([ ...secondaryWheres])];
    setSecondaryWhereOptions(tableSecondaryWheres ||[]);
    setSecondaryWhereSelectedOptions(modifyItemObj.secondaryWheres || []);
  }, []);

  const handleChange = (e) => {
    setCurrentValue(e.target.value);
  };

  // secondaryWhos
//   const onSecondaryWhosChange = (value) => {
//     debugger
//     setSecondaryWhoSelectedOptions(value);
//   }
  const [secondaryWhoSet, seSeccondaryWhoSet] = useState()
  const onSecondaryWhosChange = (selectedValue, fieldName) => {
    debugger
    const valuesArray = Array.isArray(selectedValue) ? selectedValue : [selectedValue];
    const selectedClusterObjects = valuesArray
    ?.map(value => secondaryWhoOptions.find(item => item?.value === value))
    ?.filter(Boolean);
    const updatedClusterValues = selectedClusterObjects?.map(item => item.value);
    const mergedClusterObjects = selectedClusterObjects?.map(item => ({
      id: item?.id,
      value: item?.value
    }));
    setSecondaryWhoSelectedOptions(updatedClusterValues);
    seSeccondaryWhoSet(mergedClusterObjects);
    // setAnythingChanged(true);
    // setAnythingChanged(true) 
  };
  const handleSelectAllSecondaryWhos = () => {
    if(secondaryWhoSelectedOptions?.length === secondaryWhoOptions?.length) {
        setSecondaryWhoSelectedOptions([]);
    } else {
        setSecondaryWhoSelectedOptions(secondaryWhoOptions);
    }
  }

  // primaryWhats
//   const onPrimaryWhatsChange = (value) => {
//     setPrimaryWhatSelectedOptions(value);
//   }
  const [primaryWhatSet, setPrimaryWhatSet] = useState()
  const onPrimaryWhatsChange = (selectedValue, fieldName) => {
    debugger
    const valuesArray = Array.isArray(selectedValue) ? selectedValue : [selectedValue];
    const selectedClusterObjects = valuesArray
    ?.map(value => primaryWhatOptions.find(item => item?.value === value))
    ?.filter(Boolean);
    const updatedClusterValues = selectedClusterObjects?.map(item => item.value);
    const mergedClusterObjects = selectedClusterObjects?.map(item => ({
      id: item?.id,
      value: item?.value
    }));
    setPrimaryWhatSelectedOptions(updatedClusterValues);
    setPrimaryWhatSet(mergedClusterObjects);
    // setAnythingChanged(true);
    // setAnythingChanged(true) 
  };
  const handleSelectAllPrimaryWhats = () => {
    if(primaryWhatSelectedOptions?.length === primaryWhatOptions?.length) {
        setPrimaryWhatSelectedOptions([]);
    } else {
        setPrimaryWhatSelectedOptions(primaryWhatOptions);
    }
  }

  // secondaryWhats
//   const onSecondaryWhatsChange = (value) => {
//     debugger
//     setSecondaryWhatSelectedOptions(value);
//   }

const [secondaryWhatSet, setSecondaryWhatSet] = useState()
  const onSecondaryWhatsChange = (selectedValue, fieldName) => {
    debugger
    const valuesArray = Array.isArray(selectedValue) ? selectedValue : [selectedValue];
    const selectedClusterObjects = valuesArray
    ?.map(value => secondaryWhatOptions.find(item => item?.value === value))
    ?.filter(Boolean);
    const updatedClusterValues = selectedClusterObjects?.map(item => item.value);
    const mergedClusterObjects = selectedClusterObjects?.map(item => ({
      id: item?.id,
      value: item?.value
    }));
    setSecondaryWhatSelectedOptions(updatedClusterValues);
    setSecondaryWhatSet(mergedClusterObjects);
    // setAnythingChanged(true);
    // setAnythingChanged(true) 
  };
  const handleSelectAllSecondaryWhats = () => {
    if(secondaryWhatSelectedOptions?.length === secondaryWhatOptions?.length) {
        setSecondaryWhatSelectedOptions([]);
    } else {
        setSecondaryWhatSelectedOptions(secondaryWhatOptions);
    }
  }

  // primaryWheres
//   const onPrimaryWheresChange = (value) => {
//     setPrimaryWhereSelectedOptions(value);
//   }
  const [primaryWhereSet, setPrimaryWhereSet] = useState()
  const onPrimaryWheresChange = (selectedValue, fieldName) => {
    debugger
    const valuesArray = Array.isArray(selectedValue) ? selectedValue : [selectedValue];
    const selectedClusterObjects = valuesArray
    ?.map(value => primaryWhereOptions.find(item => item?.value === value))
    ?.filter(Boolean);
    const updatedClusterValues = selectedClusterObjects?.map(item => item.value);
    const mergedClusterObjects = selectedClusterObjects?.map(item => ({
      id: item?.id,
      value: item?.value
    }));
    setPrimaryWhereSelectedOptions(updatedClusterValues);
    setPrimaryWhereSet(mergedClusterObjects);
    // setAnythingChanged(true);
    // setAnythingChanged(true) 
  };
  const handleSelectAllPrimaryWheres = () => {
    if(primaryWhereSelectedOptions?.length === primaryWhereOptions?.length) {
        setPrimaryWhereSelectedOptions([]);
    } else {
        setPrimaryWhereSelectedOptions(primaryWhereOptions);
    }
  }

  // secondaryWheres
//   const onSecondaryWheresChange = (value) => {
//     setSecondaryWhereSelectedOptions(value);
//   }
  const [secondaryWhereSet, setSecondaryWhereSet] = useState()
  const onSecondaryWheresChange = (selectedValue, fieldName) => {
    debugger
    const valuesArray = Array.isArray(selectedValue) ? selectedValue : [selectedValue];
    const selectedClusterObjects = valuesArray
    ?.map(value => secondaryWhereOptions.find(item => item?.value === value))
    ?.filter(Boolean);
    const updatedClusterValues = selectedClusterObjects?.map(item => item.value);
    const mergedClusterObjects = selectedClusterObjects?.map(item => ({
      id: item?.id,
      value: item?.value
    }));
    setSecondaryWhereSelectedOptions(updatedClusterValues);
    setSecondaryWhereSet(mergedClusterObjects);
    // setAnythingChanged(true);
    // setAnythingChanged(true) 
  };
  const handleSelectAllSecondaryWheres = () => {
    if(secondaryWhereSelectedOptions?.length === secondaryWhereOptions?.length) {
        setSecondaryWhereSelectedOptions([]);
    } else {
        setSecondaryWhereSelectedOptions(secondaryWhereOptions);
    }
  }

//   const allPrimaryWhoSelected = primaryWhoSelectedOptions.length === primaryWhoOptions.length;
  const allSecondaryWhoSelected = secondaryWhoSelectedOptions?.length === secondaryWhoOptions?.length;
  const allPrimaryWhatSelected = primaryWhatSelectedOptions?.length === primaryWhatOptions?.length;
  const allSecondaryWhatSelected = secondaryWhatSelectedOptions?.length === secondaryWhatOptions?.length;
  const allPrimaryWhereSelected = primaryWhereSelectedOptions?.length === primaryWhereOptions?.length;
  const allSecondaryWhereSelected = secondaryWhereSelectedOptions?.length === secondaryWhereOptions?.length;

  const handleUpdate = () => {
    debugger
    const updatedObj = {
        id: modifyItemObj.isNewField ? '' : modifyItemObj.id,
        ...(type === "title" ? {title: currentValue} : {idea: currentValue}),
        primaryWhos,
        secondaryWhos: secondaryWhoSet ?? modifyItemObj?.secondaryWhos,
        primaryWhats: primaryWhatSet ?? modifyItemObj?.primaryWhats,
        secondaryWhats: secondaryWhatSet ?? modifyItemObj?.secondaryWhats,
        primaryWheres: primaryWhereSet ?? modifyItemObj?.primaryWheres,
        secondaryWheres: secondaryWhereSet ?? modifyItemObj?.secondaryWheres,
        ...(modifyItemObj.isNewField ? {isNewField: true} : {isEditField: true}),
        ...(modifyItemObj.comment && {comment: modifyItemObj.comment})
    }
    onModify(updatedObj);
    onClose();
  }

  return (
    <Modal
      open={open}
      centered
      onCancel={onClose}
      width={700}
      footer={[
        <div>
          <Button
            onClick={onClose}
            className="custom-btn mt-2 md:mt-4 me-2 md:me-3 bg-gray-400 border-gray-500 text-white"
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpdate}
            type="primary"
            className="bg-blue-50 border-blue-500 text-blue-500"
          >
            Update
          </Button>
        </div>,
      ]}
    >
      <div>
        {/* sentence */}
        <div>
          <label
            htmlFor="title"
            className="block mb-2 mt-5 text-md md:text-lg font-medium text-gray-900"
          >
            {popupTitle}
          </label>
          <textarea
            rows={6}
            value={currentValue}
            onChange={handleChange}
            className="bg-gray-50 w-full border p-3 border-gray-300 text-gray-900 text-md rounded-md focus:ring-primary-600 focus:border-primary-600 block"
          />
        </div>

        {/* W's Dropdowns */}
        <div className="mt-8 mb-6 md:mb-16 grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-5">

            {/* secondary who dropdown */}
            <div>
                <label
                    htmlFor="secondaryWhos"
                    className="block mb-2 text-md md:text-lg font-medium text-gray-900"
                >
                    Secondary WHOs
                </label>
                <Select
                    size="large"
                    mode="tags"
                    className="w-full"
                    value={secondaryWhoSelectedOptions}
                    // onChange={onSecondaryWhosChange}
                    onChange={(value) => onSecondaryWhosChange(value, "secWho")} // Pass name 'wsForm' to handleChange

                    placeholder={"Please Select Secondary Whos"}
                >
                    <Option value="select-all">
                        <Checkbox
                            id="selectAllCheckbox"
                            className="me-2"
                            checked={allSecondaryWhoSelected}
                            onChange={handleSelectAllSecondaryWhos}
                        />
                        <label htmlFor="selectAllCheckbox">
                        {
                            allSecondaryWhoSelected ? "Unselect All" : "Select All"
                        }
                        </label>
                    </Option>
                    {secondaryWhoOptions?.map((option, index) => (
                        <Option key={option.id} value={option.value}>
                            {option.value}
                        </Option>
                    ))}
                </Select>         
            </div>

            {/* primary what dropdown */}
            <div>
                <label
                    htmlFor="primaryWhats"
                    className="block mb-2 text-md md:text-lg font-medium text-gray-900"
                >
                    Primary WHATs
                </label>
                <Select
                    size="large"
                    mode="multiple"
                    className="w-full"
                    value={primaryWhatSelectedOptions}
                    // onChange={onPrimaryWhatsChange}
                    onChange={(value) => onPrimaryWhatsChange(value, "primWhat")} // Pass name 'wsForm' to handleChange

                    placeholder={"Please Select Primary Whats"}
                >
                    <Option value="select-all">
                        <Checkbox
                            id="selectAllCheckbox"
                            className="me-2"
                            checked={allPrimaryWhatSelected}
                            onChange={handleSelectAllPrimaryWhats}
                        />
                        <label htmlFor="selectAllCheckbox">
                        {
                            allPrimaryWhatSelected ? "Unselect All" : "Select All"
                        }
                        </label>
                    </Option>
                    {primaryWhatOptions?.map((option, index) => (
                        <Option key={option.id} value={option.value}>
                            {option.value}
                        </Option>
                    ))}
                </Select>         
            </div>

            {/* secondary what dropdown */}
            <div>
                <label
                    htmlFor="secondaryWhats"
                    className="block mb-2 text-md md:text-lg font-medium text-gray-900"
                >
                    Secondary WHATs
                </label>
                <Select
                    size="large"
                    mode="multiple"
                    className="w-full"
                    value={secondaryWhatSelectedOptions}
                    onChange={(value) => onSecondaryWhatsChange(value, "secWhat")} // Pass name 'wsForm' to handleChange
                    // onChange={onSecondaryWhatsChange}
                    placeholder={"Please Select Secondary Whats"}
                >
                    <Option value="select-all">
                        <Checkbox
                            id="selectAllCheckbox"
                            className="me-2"
                            checked={allSecondaryWhatSelected}
                            onChange={handleSelectAllSecondaryWhats}
                        />
                        <label htmlFor="selectAllCheckbox">
                        {
                            allSecondaryWhatSelected ? "Unselect All" : "Select All"
                        }
                        </label>
                    </Option>
                    {secondaryWhatOptions?.map((option, index) => (
                        <Option key={option.id} value={option.value}>
                            {option?.value}
                        </Option>
                    ))}
                </Select>         
            </div>

            {/* primary where dropdown */}
            <div>
                <label
                    htmlFor="primaryWheres"
                    className="block mb-2 text-md md:text-lg font-medium text-gray-900"
                >
                    Primary WHEREs
                </label>
                <Select
                    size="large"
                    mode="multiple"
                    className="w-full"
                    value={primaryWhereSelectedOptions}
                    // onChange={onPrimaryWheresChange}
                    onChange={(value) => onPrimaryWheresChange(value, "primWhere")} // Pass name 'wsForm' to handleChange

                    placeholder={"Please Select Primary Wheres"}
                >
                    <Option value="select-all">
                        <Checkbox
                            id="selectAllCheckbox"
                            className="me-2"
                            checked={allPrimaryWhereSelected}
                            onChange={handleSelectAllPrimaryWheres}
                        />
                        <label htmlFor="selectAllCheckbox">
                        {
                            allPrimaryWhereSelected ? "Unselect All" : "Select All"
                        }
                        </label>
                    </Option>
                    {primaryWhereOptions?.map((option, index) => (
                        <Option key={option.id} value={option.value}>
                            {option?.value}
                        </Option>
                    ))}
                </Select>         
            </div>

            {/* secondary where dropdown */}
            <div>
                <label
                    htmlFor="secondaryWheres"
                    className="block mb-2 text-md md:text-lg font-medium text-gray-900"
                >
                    Secondary WHEREs
                </label>
                <Select
                    size="large"
                    mode="multiple"
                    className="w-full"
                    value={secondaryWhereSelectedOptions}
                    // onChange={onSecondaryWheresChange}
                    onChange={(value) => onSecondaryWheresChange(value, "secWhere")} // Pass name 'wsForm' to handleChange
                    placeholder={"Please Select Secondary Wheres"}
                >
                    <Option value="select-all">
                        <Checkbox
                            id="selectAllCheckbox"
                            className="me-2"
                            checked={allSecondaryWhereSelected}
                            onChange={handleSelectAllSecondaryWheres}
                        />
                        <label htmlFor="selectAllCheckbox">
                        {
                            allSecondaryWhereSelected ? "Unselect All" : "Select All"
                        }
                        </label>
                    </Option>
                    {secondaryWhereOptions?.map((option, index) => (
                        <Option key={option.id} value={option.value}>
                            {option?.value}
                        </Option>
                    ))}
                </Select>         
            </div>

        </div>
      </div>
    </Modal>
  );
};

export default ModifySelectionPopup;