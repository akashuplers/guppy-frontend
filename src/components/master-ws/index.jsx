import React, { useEffect, useState, useContext } from 'react'
import SidebarWithHeader from '../sidebar-with-header'
import { useNavigate } from 'react-router-dom';
import { Table, Tabs, message } from 'antd';
import { API_BASE_PATH, API_ROUTES } from '../../constants/api-endpoints';
import axios from 'axios';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import LoadingButtonPrimary from '../../utils/LoadingButtonPrimary';
import * as Yup from "yup";
import ModifyMasterWsPopup from '../ModifyMasterWsPopUp';
import { StoryUploadApiContext } from '../../contexts/ApiContext';
import DeleteConfirmationDialog from '../../utils/modals/DeleteConfirmationDialog';
import { v4 as uuidv4 } from 'uuid';

const validationSchema = Yup.object().shape({
    storyWorld: Yup.string().required("Please Select A Story World"),
});

const MasterWsPage = () => {
  const navigate = useNavigate();
  const flow = false;
  const [storyWorldOptions, setStoryWorldOptions] = useState();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showModifyPopup, setShowModifyPopup] = useState(false);
  const tokenVal = JSON.parse(localStorage.getItem("accessToken"));
  const [clusterList, setClusterList] = useState([]); 
  const [token, setToken] = useState("");
  const [selectedRow, setSelectedRow] = useState(null); 
  const [dialogPopup, setDialogPopup] = useState(false);
  const [whos, setWhos] = useState([]);
  const [whats, setWhats] = useState([]);
  const [wheres, setWheres] = useState([]);
  const [isFetched, setIsFetched] = useState(false);
  const [notFetched, setNotFetched] = useState(false);
  const [storyWordId, setStoryWordId] = useState();
  const [filteredOptions, setFilteredOption] = useState();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { storyUploadApiResponse, setStoryUploadApiResponse, handleAnythingChanged } = useContext(StoryUploadApiContext);
    const [editIndex, setEditIndex] = useState(null);
  
  const onModify = (updatedObj) => {
    if (filteredData?.length > 0) {
      const curFilterData = [...filteredData];
      const modifiedFilterData = curFilterData.map((ele) =>
        ele.id === selectedRow.id ? updatedObj : ele
      );
      setFilteredData(modifiedFilterData);
      message.success("Updated Successfully!");
      handleAnythingChanged(true);
    } 
  };

const type = [
  { id: 1, name: "Primary" },
  { id: 2, name: "Secondary" }
]

const wsData = [
  { id: 1, name: "who" },
  { id: 2, name: "what" },
  { id: 3, name: "where" },
];

const clusterHeadWsList = async () => {
  try {
    const apiUrl = API_BASE_PATH + API_ROUTES.LIST_WS + storyWordId;
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
    // message.error(errorMsg);
  }
};

useEffect(() => {
  if(storyWordId) {
    clusterHeadWsList();
  }
}, []);

const fetchStoryWorlds = async (tokenVal) => {
  try {
    const apiUrl = API_BASE_PATH + API_ROUTES.GET_STORY_WORLD;
    const config = {
      headers: {
        Authorization: `Bearer ${tokenVal}`,
      },
    };
    const response = await axios.get(apiUrl, config);
    const outputArr = response?.data?.data;
    if(outputArr?.length > 0) {
      setStoryWorldOptions(outputArr);
    } 
  } catch (error) {
    console.error('Error:', error);
    const statusCode = error?.response?.status;
    if(statusCode === 401) {
      navigate("/");
    } else if(statusCode === 500) {
      message.error("Internal Server Error !");
    } else {
      const errorMessage = error?.response?.data?.message;
      if(errorMessage) {
        message.error(errorMessage);
      } else {
        message.error("Something Went Wrong ! Not able to fetch story worlds !");
      }
    }      
  }
}

  useEffect(() => {
    const tokenVal = JSON.parse(localStorage.getItem("accessToken"));
    if(!tokenVal) {
        navigate('/');
    } else {
        setToken(tokenVal);
        fetchStoryWorlds(tokenVal);
    }
  }, []);

  const handleSubmit = async (values, { setIsSubmitting }) => {
    let alertKey;
    try {
        const storyWorldId = values?.storyWorld;
        setStoryWordId(storyWorldId)
        const apiUrl = API_BASE_PATH + API_ROUTES.FETCH_MASTER_Ws + `/${storyWorldId}`;
  
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        alertKey = message.loading("Fetching Master Ws...", 0).key;
        const response = await axios.get(apiUrl, config); // post api request
        const output = response?.data?.masterWs;
        if(output) {
          const { Who, What, Where } = output;
          setFilteredData(processData(output))
          setWhos(Who);
          setWhats(What);
          setWheres(Where);
          setIsFetched(true);
          message.destroy(alertKey);
          message.success("Master Ws Fetched Successfully !");
        } else {
          setNotFetched(true);
          message.destroy(alertKey);
          message.error("Error In Fetching Master Ws !");
        }
    } catch (error) {
        console.error("Error:", error);
        setNotFetched(true);
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
              message.error("Error In Fetching Master Ws !");
            }
        }
    }
    setIsSubmitting(false);
  }
  
  const [ filteredData, setFilteredData ] = useState([]);
  const processData = (data) => {
    const result = [];
    Object?.keys(data)?.forEach((ws) => {
      Object?.keys(data[ws])?.forEach((type) => {
        data[ws][type]?.forEach((item) => {
          result?.push({
            ws,
            id: item?.id,
            type,
            masterHead: item?.masterHead,
            clusterValues: item?.clusterValues?.map((cluster) => ({
              id: cluster?.id,
              value: cluster?.value,
            })),
            // clusterValues: item?.clusterValues?.map((cv) => cv?.value)?.join(", "),
            status: item?.new ? "New" : item?.updated ? "Updated" : "Old",
          });
        });
      });
    });

    return result;
  };

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
      const normalizedClusterValues = (() => {
        if (Array.isArray(item.clusterValues)) {
          return item.clusterValues.map((cluster) => ({
            id: cluster.id ?? null,
            value: cluster.value ?? cluster,
          }));
        } else if (typeof item.clusterValues === "string") {
          return item.clusterValues.split(",").map((value) => ({
            id: null,
            value: value.trim(),
          }));
        }
        return [];
      })();

      const newItem = {
        id: item.id ?? null,
        masterHead: item?.masterHead?.value ?? item?.masterHead, 
        clusterValues: item.clusterValues?.map((cluster) => ({
          id: cluster?.id,
          value: cluster?.value,
        })),
        new: item.status === "New",
        updated: item.status === "Updated",
      };

      // Add the newItem to the appropriate section
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

  const transformedData = transformData(filteredData);

  const handleSaveWs = async () => {
    setIsSubmitting(true);
    let alertKey;
    try {
      const apiUrl = API_BASE_PATH + API_ROUTES.Update_Master_WS + storyWordId;
      const payload = transformedData;
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      alertKey = message.loading("Saving Ws...", 0).key;
      const response = await axios.post(apiUrl, payload, config);      
      const output = response;
      if (output) {
        message.destroy(alertKey);
        message.success("Clusters Saved Successfully !");
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
          message.error("Error In Saving Ws ! Unable To Fetch Response !");
        }
      }
    }
    setIsSubmitting(false);
  };

  
  const historyColumns = [
    {
      title: "S.No",
      render: (text, record, index) => index + 1,
      width: 60,
    },
    {
      dataIndex: "ws",
      title: "W's Form",
      render: (text, record) => {
        return (
          <div>
            <span>{record?.ws && record.ws.trim() !== "" ? record.ws : "NA"}</span>
          </div>
        );
      },
    },
    {
      dataIndex: "type",
      title: "Type",
      render: (text, record) => {
        return (
          <div>
            <span>{record?.type && record.type.trim() !== "" ? record.type : "NA"}</span>
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
            <span>{record?.masterHead && record?.masterHead?.trim() !== "" ? record?.masterHead : "NA"}</span>
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
        return (
          <div style={{ display: 'flex', gap: '15px' }}>
            <button
              title="View/Modify"
              onClick={() => {
                setShowModifyPopup(true);
                setDialogPopup(true);
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
        )
      }
    },
  ];

  const handleRemoveChip = (value) => {  
    const removeChipFromClusterValues = (data) => {
      return data.map((item) => ({
        ...item,
        clusterValues: item.clusterValues.filter(
          (clusterItem) => clusterItem?.id !== value?.id 
        ),
      }));
    };
  
    const updatedFilterData = removeChipFromClusterValues(filteredData);
    setFilteredData(updatedFilterData);
    handleAnythingChanged(true);
  };
  
  const handleDelete = () => {
      const curData = [...filteredData];
      const updated = curData.filter((ele) => ele.id !== selectedRow.id);
      setFilteredData(updated);
      message.success("Deleted Successfully !");
      handleAnythingChanged(true);
  };

const handleAddRow = () => {
  // Create a new row object with default values
  const newRow = {
    id: uuidv4(),
    ws: "",
    type: "", // Can be updated later in edit
    masterHead: "",
    clusterValues: [],
    status: "New",
  };

  // Initialize filteredData if it's empty
  let updatedFilteredData = Array.isArray(filteredData) ? [...filteredData] : [];

  // Insert the new row at the beginning of the filteredData array
  updatedFilteredData = [newRow, ...updatedFilteredData];

  // Update the filteredData state with the modified structure
  setFilteredData(updatedFilteredData);

  message.success("New row added successfully!");
  handleAnythingChanged(true);
};

  return (
    <SidebarWithHeader>
      <div>
        {/* head */}
        <p className="text-xl md:text-3xl mt-1 mb-2 md:mb-0 font-medium">
          Master Ws
        </p>

        {/* body */}
        <div className="mt-8">
          <Formik
            initialValues={{
              storyWorld: "",
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, setFieldValue }) => (
              <Form className="flex flex-col md:flex-row gap-2 md:gap-8">
                <div>
                  <label
                    htmlFor="storyWorld"
                    className="block mb-2 text-md md:text-lg font-medium text-gray-900"
                  >
                    Story World
                  </label>
                  <Field
                    as="select"
                    name="storyWorld"
                    id="storyWorld"
                    className="bg-gray-50 block cursor-pointer w-full md:w-[35vw] p-2 border border-gray-300 text-gray-900 sm:text-md rounded-lg focus:ring-primary-600 focus:border-primary-600 p-2"
                  >
                    <option value="">Please Select...</option>
                    {storyWorldOptions?.map((item, index) => (
                      <option key={index} value={item?._id}>
                        {item?.name}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage
                    name="storyWorld"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                <div>
                  {!isSubmitting ? (
                    <>
                      <button
                        type="submit"
                        className="text-white w-auto md:w-[10vw] px-4 py-2 mt-4 md:mt-6 bg-blue-600 hover:bg-blue-400 focus:ring-4 focus:outline-none ring-primary-300 font-medium rounded-lg text-sm text-center bg-primary-600 hover:bg-primary-700 focus:ring-primary-800"
                        disabled={isSubmitting}
                      >
                        Fetch Master Ws
                      </button>
                      {"  "}
                      <button
                        type="button"
                        className="text-white w-auto md:w-[10vw] px-4 py-2 mt-4 md:mt-6 bg-blue-600 hover:bg-blue-400 focus:ring-4 focus:outline-none ring-primary-300 font-medium rounded-lg text-sm text-center bg-primary-600 hover:bg-primary-700 focus:ring-primary-800"
                        // disabled={isSubmitting}
                        onClick={handleAddRow}
                      >
                        Add Master Row
                      </button>
                      {"  "}
                      <button
                        type="submit"
                        className="text-white w-auto md:w-[10vw] px-4 py-2 mt-4 md:mt-6 bg-blue-600 hover:bg-blue-400 focus:ring-4 focus:outline-none ring-primary-300 font-medium rounded-lg text-sm text-center bg-primary-600 hover:bg-primary-700 focus:ring-primary-800"
                        disabled={isSubmitting}
                        onClick={handleSaveWs}
                      >
                        Save Master Ws
                      </button>
                    </>
                  ) : (
                    <LoadingButtonPrimary
                      className="mt-4 md:mt-9"
                      title={"Fetching..."}
                    />
                  )}
                </div>
              </Form>
            )}
          </Formik>
        </div>

        {/* master Ws Tabs */}

        <div className="mt-10 px-5">
          {/* <Tabs defaultActiveKey="1" items={items} /> */}
          <Table dataSource={filteredData} columns={historyColumns} bordered />
        </div>

        {dialogPopup && (
          <ModifyMasterWsPopup
            open={dialogPopup}
            modifyItemObj={selectedRow} // Pass selected row data for editing
            onClose={() => setDialogPopup(false)}
            storyWorldOptions={wsData}
            // wsForms={wsData}
            filteredOptions={filteredOptions}
            clusterList={clusterList}
            types={type}
            clusterHead={whos ? whats : wheres}
            onModify={onModify}
            filteredData={filteredData}
            modalType="saparate" // Modify this as per the field you want to edit
          />
        )}

        {showDeleteModal && (
          <DeleteConfirmationDialog
            open={showDeleteModal}
            onClose={() => setShowDeleteModal(false)}
            onConfirm={handleDelete}
          />
        )}

        {/* {notFetched &&
            <p className='text-lg py-2 text-center bg-violet-50 border rounded-md mt-20 px-8'>
              {notFoundMsg}
            </p>
          } */}
      </div>
    </SidebarWithHeader>
  );
}

export default MasterWsPage