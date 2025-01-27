import React, { useState, useEffect, useContext } from "react";
import { Button, Modal, Select, Checkbox } from "antd";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
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
  clusterList,
  modalType,
  myNewData,
  filteredData,
  updateNewData,
  whos,
  whats,
  wheres,
  tableData,
  filterData,
  filteredNewData
}) => {
  const [currentValue, setCurrentValue] = useState("");
  const [popupTitle, setPopupTitle] = useState("");
  const [wsForm, setWsForm] = useState([]);
  const [typo, setTypo] = useState([]);
  const [clusterHead, setClusterHead] = useState([]);
  const [clusterHeadData, setClusterHeadData] = useState([]);
  const [saparate, setSaparate] = useState(false);
  const [clusterValue, setClusterValue] = useState([]);
  const [clusterData, setClusterData] = useState([]);
  const [whoCluster, setWhoCluster] = useState([]);
  const [whatCluster, setWhatCluster] = useState([]);
  const [whereCluster, setWhereCluster] = useState([]);
  const [clusterHeadVals, setclusterHeadVals] = useState([]);
  const [clusterValuesVals, setclusterValuesVals] = useState([]);
  const [payloadClusterValues,setPayloadClusterValues] = useState([]);
  const [anythingChanged, setAnythingChanged] = useState(false);
  const { storyUploadApiResponse } = useContext(StoryUploadApiContext);
  const { story_id } = storyUploadApiResponse;
  const tokenVal = JSON.parse(localStorage.getItem("accessToken"));
  const [typeData, setTypeData] = useState(types);
  const [allData, setAllData] = useState([]);
console.log("mmmmmmmmm", modifyItemObj);
console.log("clusterHeadVals",clusterHeadVals);

console.log("clusterValuesVals",clusterValuesVals);
console.log("filtesssredNewData",filteredNewData);
console.log("clusterList", clusterList);


  // useEffect(() => {
  //   if (filterData?.length > 0 || tableData?.length > 0) {
  //     let masterHeadValues = [];
  //     let clusterValues = [];
  //     if (filterData?.length > 0 && tableData?.length > 0) {
  //       masterHeadValues = [
  //         ...new Set([
  //           ...filterData.map((item) => item.masterHead?.value || item?.masterHead),
  //           ...tableData.map((item) => item.masterHead),
  //         ]),
  //       ];
  //       clusterValues = [
  //         ...new Set([
  //           ...filterData.flatMap(
  //             (item) =>
  //               item.clusterValues?.map((cluster) => cluster.value) || []
  //           ),
  //           ...tableData.flatMap(
  //             (item) =>
  //               item.clusterValues?.map((cluster) => cluster.value) || []
  //           ),
  //         ]),
  //       ];
  //     } else if (filterData?.length > 0) {
  //       masterHeadValues = filterData.map((item) => item.masterHead?.value || item?.masterHead);
  //       clusterValues = filterData.flatMap(
  //         (item) => item.clusterValues?.map((cluster) => cluster.value) || []
  //       );
  //     } else if (tableData?.length > 0) {
  //       masterHeadValues = tableData.map((item) => item.masterHead);
  //       clusterValues = tableData.flatMap(
  //         (item) => item.clusterValues?.map((cluster) => cluster.value) || []
  //       );
  //     }
  //     const combinedValues = [
  //       ...new Set([...masterHeadValues, ...clusterValues]),
  //     ];
  //     setAllData(combinedValues);
  //     if (combinedValues?.length > 0) {
  //       setWhoCluster((prevWhos) => {
  //         const updatedWhos = prevWhos?.filter(
  //           (item) => !combinedValues?.includes(item.value)
  //         );
  //         return JSON.stringify(updatedWhos) !== JSON.stringify(prevWhos)
  //           ? updatedWhos
  //           : prevWhos;
  //       });

  //       setWhatCluster((prevWheres) => {
  //         const updatedWheres = prevWheres?.filter(
  //           (item) => !combinedValues?.includes(item.value)
  //         );
  //         return JSON.stringify(updatedWheres) !== JSON.stringify(prevWheres)
  //           ? updatedWheres
  //           : prevWheres;
  //       });
  //       setWhereCluster((prevWhats) => {
  //         const updatedWhats = prevWhats?.filter(
  //           (item) => !combinedValues?.includes(item.value)
  //         );
  //         return JSON.stringify(updatedWhats) !== JSON.stringify(prevWhats)
  //           ? updatedWhats
  //           : prevWhats;
  //       });
  //     }
  //   }
  // }, [filterData, tableData, whoCluster, whatCluster, whereCluster]);

  const filterClusterList = (clusterList, updatedTableData) => {
    // Extract IDs from updatedTableData
    const updatedTableIds = updatedTableData.map((item) => item.id);
  
    // Filter clusterList.Who to include only items present in updatedTableData
    const filteredWho = clusterList.Who.filter((item) =>
      updatedTableIds.includes(item.id)
    );
    const filteredWhat = clusterList.What.filter((item) =>
      updatedTableIds.includes(item.id)
    );
    const filteredWhere = clusterList.Where.filter((item) =>
      updatedTableIds.includes(item.id)
    );
  
    return {
      ...clusterList,
      Who: filteredWho, // Replace the original Who list with the filtered list
      What: filteredWhat,
      Where: filteredWhere
    };
  };

  const updatedClusterList = filterClusterList(clusterList, filteredNewData);


  const handleClusterChange = () => {
    debugger
    const filteredClusterList = filterClusterList(clusterList, filteredNewData);

    if (wsForm === "who") {
      setclusterHeadVals(filteredClusterList?.Who);
      setWhoCluster(filteredClusterList?.Who);
    } else if (wsForm === "what") {
      setclusterHeadVals(filteredClusterList?.What);
      setWhatCluster(filteredClusterList?.What);
    } else if (wsForm === "where") {
      setWhereCluster(filteredClusterList?.Where);
      setclusterHeadVals(filteredClusterList?.Where);
    } else {
      setWhoCluster(null);
      setWhatCluster(null);
      setWhereCluster(null);
    }
  };

  useEffect(() => {
    handleClusterChange();
  }, [wsForm, clusterList, filteredNewData]);

  useEffect(() => {
    if (!anythingChanged) {
      if (modalType === "InBetweenFlow") {
        setClusterHead(modifyItemObj?.masterHead);
        setClusterHeadId(modifyItemObj?.id || "");
      }
      if (modalType === "saparate") {
        setClusterHeadData(modifyItemObj?.masterHead);
      }
      setTypo(modifyItemObj?.type || []);
      if (modalType === "InBetweenFlow") {
        // debugger

        const selectedWs = modifyItemObj?.ws;
        // const modifyItemObj
        const matchedData = updateNewData.find((data) => data.id === modifyItemObj?.id);
        
        setTypo(matchedData?.type)
        
       
      } else if (modalType === "saparate") {
        const selectedWs = modifyItemObj?.ws;
        const isPrimarySelected = filteredData?.some(
          (comb) => comb.ws === "who" && comb.type === "primary"
        );
        if (selectedWs === "who" && isPrimarySelected) {
          setTypeData((prevTypo) =>
            prevTypo?.filter((item) => item.name !== "Primary")
          );
        }
        if (selectedWs === "what") {
          if (!typeData?.some((item) => item.name === "Primary")) {
            setTypeData((prevTypo) => [
              { id: 1, name: "Primary" },
              ...prevTypo,
            ]);
          }
        } else if (selectedWs === "where") {
          if (!typeData?.some((item) => item.name === "Primary")) {
            setTypeData((prevTypo) => [
              { id: 1, name: "Primary" },
              ...prevTypo,
            ]);
          }
        }
      }

      setWsForm(modifyItemObj?.ws || []);
      if (modalType === "InBetweenFlow") {
        setClusterValue(
          modifyItemObj?.clusterValues?.map((obj) => obj.value) || []
        );
      }
      if (modalType === "saparate") {
        setClusterData(modifyItemObj?.clusterValues || []);
      }
      if (modalType === "InBetweenFlow") {
        // if (
        //   clusterValuesVals?.length === 0 &&
        //   modifyItemObj?.masterHead?.id === clusterHead?.id
        // ) {
        debugger
          getClusterValueData(
            modifyItemObj?.masterHead,
            modifyItemObj?.id ?? clusterHeadId,
            false
          );
        // }
      }
    }
  }, [modifyItemObj, type, clusterHead, clusterHeadVals]);

  const onWsChange = (value) => {
    if (modalType === "InBetweenFlow") {
      const selectedWs = value;

      const isPrimarySelected = myNewData.some(
        (comb) => comb.ws === "who" && comb.type === "primary"
      );
      if (selectedWs === "who" && isPrimarySelected) {
        setTypeData((prevTypo) =>
          prevTypo?.filter((item) => item.name !== "Primary")
        );
      } else if (selectedWs === "what") {
        if (!typeData.some((item) => item.name === "Primary")) {
          setTypeData((prevTypo) => [{ id: 1, name: "Primary" }, ...prevTypo]);
        }
      } else if (selectedWs === "where") {
        if (!typeData.some((item) => item.name === "Primary")) {
          setTypeData((prevTypo) => [{ id: 1, name: "Primary" }, ...prevTypo]);
        }
      }
    } else if (modalType === "saparate") {
      const selectedWs = value;

      const isPrimarySelected = filteredData.some(
        (comb) => comb.ws === "who" && comb.type === "primary"
      );
      if (selectedWs === "who" && isPrimarySelected) {
        setTypeData((prevTypo) =>
          prevTypo?.filter((item) => item.name !== "Primary")
        );
      } else if (selectedWs === "what") {
        if (!typeData.some((item) => item.name === "Primary")) {
          setTypeData((prevTypo) => [{ id: 1, name: "Primary" }, ...prevTypo]);
        }
      } else if (selectedWs === "where") {
        if (!typeData.some((item) => item.name === "Primary")) {
          setTypeData((prevTypo) => [{ id: 1, name: "Primary" }, ...prevTypo]);
        }
      }
    }

    setWsForm(value);
    if (modalType == "saparate") {
      setSaparate(true);
    }
    setAnythingChanged(true);
  };

  const onTypeChange = (value) => {
    setTypo(value);
    if (modalType == "saparate") {
      setSaparate(true);
    }
    setAnythingChanged(true);
  };
  const [clusterHeadId, setClusterHeadId] = useState("");
  const [clusterValueSet, setClusterValueSet] = useState();

  const onClusterHead = (selectedValue, fieldName) => {
    const selectedCluster = clusterHeadVals.find(
      (item) => item?.value === selectedValue
    );
    setClusterHead(selectedCluster?.value);
    setClusterHeadId(selectedCluster?.id);
    if (modalType === "InBetweenFlow") {
      debugger
      getClusterValueData(selectedCluster?.value, selectedCluster?.id, true);
    }
    setAnythingChanged(true);
  };

  const onClusterValues = (selectedValue, fieldName) => {
    const valuesArray = Array?.isArray(selectedValue)
    ? selectedValue
    : [selectedValue];
    const allClusterValues = valuesArray;
    let updatedClusterValues = [];
    if (valuesArray.includes(selectedValue)) {
      // If "cat" is selected, add all four values
      updatedClusterValues = allClusterValues;
    } else {
      updatedClusterValues = valuesArray.filter(value => allClusterValues.includes(value));
    }
    const selectedClusterObjects = updatedClusterValues
    .map((value) => clusterValuesVals.find((item) => item?.value === value))
    .filter(Boolean);
    const oldClusterObjects =
    (payloadClusterValues || []).filter((item) =>
      valuesArray.includes(item.value)
    );
    const mergedClusterObjects = [
      ...oldClusterObjects,
      ...selectedClusterObjects.filter(
        (newItem) => !oldClusterObjects.some((oldItem) => oldItem.id === newItem.id)
      ),
    ].map((item) => ({
      id: item.id,
      value: item.value,
    }));
  
    setClusterValue(updatedClusterValues);
    setClusterValueSet(mergedClusterObjects);
    setAnythingChanged(true);
  };
  const [clusterVals, setClusterValues] = useState([]);
  const [tempClusterValue, setTempClusterValue] = useState("");
  const onInputChange = (e) => {
    setTempClusterValue(e.target.value);
  };
  const onKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      if (tempClusterValue?.trim()) {
        onClusterValuesText(tempClusterValue);
      }
      setTempClusterValue("");
    }
  };
  const onClusterValuesText = (selectedValue) => {
    const valuesArray = selectedValue
      .split(",")
      .map((value) => value?.trim())
      .filter((value) => value);

    const existingValuesMap = new Map(
      clusterData?.map((item) => [item.value, item])
    );
    const updatedClusterData = [];
    valuesArray.forEach((value) => {
      const existingItem = existingValuesMap.get(value);
      if (existingItem) {
        updatedClusterData.push(existingItem);
      } else {
        updatedClusterData.push({ id: uuidv4(), value });
      }
    });

    const combinedClusterData = [...clusterData, ...updatedClusterData];
    setClusterData(combinedClusterData);
    const updatedClusterValues = combinedClusterData?.map((item) => item.value);
    setClusterValues(updatedClusterValues);
    setSaparate(true);
    setAnythingChanged(true);
  };

  const handleDeleteValue = (valueToDelete) => {
    const updatedData = clusterData?.filter(
      (item) => item.value !== valueToDelete
    );
    setClusterData(updatedData);
    setClusterValues(updatedData?.map((item) => item.value));
    setAnythingChanged(true);
  };

  const onClusterHeadText = (inputValue, fieldName) => {
    setClusterHeadData(inputValue);
    setSaparate(true);
    setAnythingChanged(true);
  };

  const getClusterValueData = async (value, clusterId, bool) => {
    debugger
    const data = allData;
    // if (clusterHeadVals?.length === 0) {
    //   console.error("clusterHeadVals is not yet available.");
    //   return;
    // }
    const clustHeadVal = clusterHeadVals?.filter((item) => item?.value !== value)
    const apiUrl = API_BASE_PATH + API_ROUTES.SORT_WS + story_id;
    const payload = {
      clusterHead: { value: value, id: clusterId },
      ws: clustHeadVal,
    };
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenVal}`,
      },
    };

    try {
      const response = await axios.post(apiUrl, payload, config);

      if (bool) {
        const filteredArray = response?.data?.ws?.clusterValues;
        // const filteredNewArrays = filteredArray?.filter(
        //   (item) => item?.value !== value
        // );

        const finalFilteredArray = filteredArray?.filter(
          (item) => !data.includes(item.value)
        );

        setclusterValuesVals(finalFilteredArray);
      } else {
        const filteredArray = response?.data?.ws?.clusterValues;
        const filteredArrays = filteredArray?.filter(
          (item) => !data.includes(item.value)
        );
        setclusterValuesVals(filteredArrays);
        setPayloadClusterValues(filteredArray)
      }
    } catch (error) {
      console.error("Error calling the API:", error);
    }
  };

  const removeDuplicateClusterHeads = (data) => {
    debugger
    // Create a Set to track `masterHead` values present in `clusterValues`
    const clusterHeads = new Set();
  
    // Extract all `masterHead` values from clusterValues
    data.forEach((item) => {
      item.clusterValues?.forEach((cluster) => {
        clusterHeads.add(cluster.value);
      });
    });
  
    // Filter out any object whose `masterHead` exists in the `clusterHeads` set
    const filteredData = data.filter((item) => !clusterHeads.has(item.masterHead));
  
    return filteredData;
  };


// console.log("result",result);

  const filterClusterValues = (filteredNewData, finalFilteredArray,updateNewData) => {
    debugger
  //   const deduplicatedFilteredData = removeItemsWithClusterValues(filteredNewData);
  // const deduplicatedUpdatedData = removeItemsWithClusterValues(updateNewData);
    // Find all masterHeads with ws="who" and type.name="Primary"
    const primaryWhoMasterHeads = filteredNewData
      .filter((item) => item.ws === "who" && item.type?.name === "Primary")
      .map((item) => item.masterHead);

      const primaryWhoRemovedHeads = updateNewData
      .filter((item) => item.ws === "who" && item.type === "Primary")
      .map((item) => item.masterHead);
      const combinedMasterHeads = new Set([...primaryWhoMasterHeads, ...primaryWhoRemovedHeads]);

  
    // Filter out items from finalFilteredArray if their value matches any masterHead
    const updatedFilteredArray = finalFilteredArray.filter(
    (item) => !combinedMasterHeads.has(item.value)
  );
  
    return updatedFilteredArray;
  };  



  const newClusterValues = filterClusterValues(filteredNewData, clusterValuesVals,updateNewData);
  
  
  
  const clusterValus = (newClusterValues?.length > 0) ? newClusterValues:clusterValuesVals
  const removeItemsWithClusterValues = (filteredData, clusterValues, updateNewData) => {
    // Use filteredData or updateNewData based on availability
    const dataToProcess = filteredData && filteredData.length > 0 ? filteredData : updateNewData;
  
    if (!dataToProcess) {
      console.warn("No valid data to process");
      return {
        updatedFilteredData: [],
        updatedClusterValues: clusterValues,
      };
    }
  
    // Extract all masterHeads with clusterValues
    const masterHeadsWithClusterValues = dataToProcess
      .filter((item) => item.clusterValues && item.clusterValues.length > 0)
      .map((item) => item.masterHead);
  
    // Remove items from clusterValues where value matches any masterHead
    const updatedClusterValues = clusterValues.filter(
      (cluster) => !masterHeadsWithClusterValues.includes(cluster.value)
    );
  
    // Remove items from filteredData or updateNewData with non-empty clusterValues
    const updatedFilteredData = dataToProcess.filter(
      (item) => !item.clusterValues || item.clusterValues.length === 0
    );
  
    return {
      updatedFilteredData,
      updatedClusterValues,
    };
  };
  const { updatedFilteredData, updatedClusterValues } = removeItemsWithClusterValues(
    filteredNewData, // This can be null or empty in some cases
    clusterValus,
    updateNewData // Fallback to this if filteredNewData is not valid
  ); 
console.log("updatedFilteredData", updatedFilteredData);
console.log("updatedClusterValues", updatedClusterValues);

  const handleUpdate = () => {
    debugger
    const updatedObj = {
      id: clusterHeadId ? clusterHeadId : modifyItemObj.id,
      ws: wsForm,
      ...(modalType == "saparate" && {
        type: typo || modifyItemObj.type,
      }),
      ...(modalType === "InBetweenFlow" && {

        type: !Array.isArray(modifyItemObj?.type)
        ? modifyItemObj?.type
        : typo === "Primary"
        ? { id: 1, name: "Primary" }
        : typo === "Secondary"
        ? { id: 2, name: "Secondary" }
        : modifyItemObj?.type,
                apiType:modifyItemObj?.apiType ?? modifyItemObj?.type
      }),
      masterHead:
        modalType === "saparate"
          ? clusterHeadData ?? modifyItemObj?.masterHead
          : clusterHead ?? modifyItemObj?.masterHead,
      clusterValues:
        modalType === "saparate"
          ? clusterData ?? modifyItemObj?.clusterValues
          : clusterValueSet ?? modifyItemObj?.clusterValues,
      ...(modalType == "InBetweenFlow" && {
        updated: modifyItemObj?.new === false ? true : false,
        isNewField:
          modifyItemObj?.new === true ? true : modifyItemObj?.new ?? false,
      }),
      ...(modalType == "saparate" && {
        updated: modifyItemObj?.new === false ? true : false,
        isNewField:
          modifyItemObj?.isNewField === true ? true : modifyItemObj?.new ?? false,
      }),
      // updated:modifyItemObj?.new === false ? true: false,
      // isNewField: modifyItemObj?.new === true ? true:modifyItemObj?.new ?? false,
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
            disabled={modalType==="InBetweenFlow"}
          >
            {storyWorldOptions?.map((item, index) => (
              <Option key={item.name} value={item?.name}>
                {item?.name}
              </Option>
            ))}
          </Select>
        </div>
        {modalType === "saparate" && (
          <>
          <div className="mt-8 mb-6">
          <label className="block mt-5 mb-2 font-medium text-gray-900 text-md md:text-lg">
            Type
          </label>
          <Select
            size="large"
            className="w-full"
            value={typo} 
            onChange={(value) => onTypeChange(value, "typo")} 
            placeholder={"Select Type"}
          >
            {typeData?.map((item, index) => (
              <Option key={item.name} value={item?.name}>
                {item?.name}
              </Option>
            ))}
          </Select>
        </div>
          </>
        )}
        
        {modalType === "InBetweenFlow" &&
        (
          <>
           <div className="mt-8 mb-6">
          <label className="block mt-5 mb-2 font-medium text-gray-900 text-md md:text-lg">
            Type
          </label>
          <Select
            size="large"
            className="w-full"
            value={typo?.name ?? typo} 
            onChange={(value) => onTypeChange(value, "typo")} 
            placeholder={"Select Type"}
            disabled
          >
            {typeData?.map((item, index) => (
              <Option key={item.name} value={item?.name}>
                {item?.name}
              </Option>
            ))}
          </Select>
        </div>
          </>
        )}
       
        {modalType === "InBetweenFlow" && (
          <div>
            <div className="mt-8 mb-6">
              <label className="block mt-5 mb-2 font-medium text-gray-900 text-md md:text-lg">
                {"Cluster Head"}
              </label>
              <Select
                size="large"
                className="w-full"
                value={clusterHead}
                onChange={(value) => onClusterHead(value, "masterHead")} 
                showSearch
                optionFilterProp="children" // Enables search by dropdown text
                allowClear
                placeholder="Select Cluster Head"
                disabled
              >
                {whoCluster &&
                  whoCluster?.map((item, index) => (
                    <Option key={item?.id} value={item?.value}>
                      {item?.value}
                    </Option>
                  ))}
                {whatCluster &&
                  whatCluster?.map((item, index) => (
                    <Option key={item?.id} value={item?.value}>
                      {item?.value}
                    </Option>
                  ))}
                {whereCluster &&
                  whereCluster?.map((item, index) => (
                    <Option key={item?.id} value={item?.value}>
                      {item?.value}
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
                onChange={(value) => onClusterValues(value, "clusterValues")} 
                placeholder={"Select Cluster Values"}
              >
                {updatedClusterValues?.map((option) => (
                  <Option key={option.id} value={option.value}>
                    {option?.value}
                  </Option>
                ))}
              </Select>
            </div>
          </div>
        )}
        {modalType === "saparate" && (
          <>
            <div className="mt-8 mb-6">
              <label className="block mt-5 mb-2 font-medium text-gray-900 text-md md:text-lg">
                {"Cluster Head"}
              </label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-lg text-md"
                value={clusterHeadData}
                onChange={(e) =>
                  onClusterHeadText(e.target.value, "masterHead")
                } // Handle input change
                placeholder="Enter Cluster Head"
              />
            </div>

            <div className="space-y-4">
              <label
                htmlFor="clusterVal"
                className="block text-md md:text-lg font-medium text-gray-900"
              >
                {"Cluster Value"}
              </label>
              <div
                className="w-full p-2 border border-gray-300 rounded-lg text-md mb-4"
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                {clusterData.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-2 bg-gray-200 text-black-600 rounded-full px-3 py-1"
                  >
                    <span>{item.value}</span>
                    <button
                      onClick={() => handleDeleteValue(item.value)}
                      className="text-red-500 hover:text-red-700"
                    >
                      &#x2716;
                    </button>
                  </div>
                ))}

                <input
                  type="text"
                  className="w-full border-none outline-none bg-transparent focus:outline-none focus:ring-0"
                  value={tempClusterValue} 
                  onChange={onInputChange} 
                  onKeyDown={onKeyDown} 
                  placeholder="Enter Cluster Values"
                />
              </div>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};

export default ModifyMasterWsPopup;
