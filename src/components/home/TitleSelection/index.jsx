import React, { useContext, useEffect, useState } from "react";
import FooterButtons from "../FooterButtons";
import { Button, Table, message, Input, Checkbox, Select } from "antd";
// import { Button, Checkbox, Modal, Select } from "antd";
import { SearchOutlined } from '@ant-design/icons';
import DeleteConfirmationDialog from "../../../utils/modals/DeleteConfirmationDialog";
import { StoryUploadApiContext } from "../../../contexts/ApiContext";
import { API_BASE_PATH, API_ROUTES } from "../../../constants/api-endpoints";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ModifySelectionPopup from "../ModifySelectionPopup";
import StoryTextPopup from "../StoryTextPopup";
import "../table.css";
import SingleTextAreaModal from "../../../utils/modals/SingleTextAreaModal";

const getCSVsFromList = (list_of_strings) => {
  return list_of_strings?.join(", ");
};

const TitleSelection = ({ onDiscard = () => {}, saveTitles, handleSaveSuccess = () => {}}) => {
const { Option } = Select;

  const [showModifyPopup, setShowModifyPopup] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState({});
  const [titleSelectionItems, setTitleSelectionItems] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showStoryModal, setShowStoryModal] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [comment, setComment] = useState('');
  const [modalType, setModalType] = useState('');
  const navigate = useNavigate();
  // const [searchText, setSearchText] = useState({
  //   title: '',
  //   primaryWhos: '',
  //   secondaryWhos: '',
  //   primaryWhats: '',
  //   secondaryWhats: '',
  //   primaryWheres: '',
  //   secondaryWheres: '',
  //   comment: '',
  // });
  const handleSearchChange = (e, column) => {
    setSearchText((prev) => ({
      ...prev,
      [column]: e.target.value,
    }));
  };

  // story upload context
  const { storyUploadApiResponse, setStoryUploadApiResponse, handleAnythingChanged } = useContext(StoryUploadApiContext);
  const { token, story_id, storyWorld, fileName, titles, updatedTitles, primaryWhos } = storyUploadApiResponse;
  useEffect(() => {
    setTitleSelectionItems(updatedTitles);
  }, []);

  useEffect(() => {
    if(saveTitles){
      onSave();
    }
  }, [saveTitles]);

  console.log("storyUploadApiResponse",storyUploadApiResponse);
  

  const onUpdate = (updatedValue) => {
    const updatedRow = {...selectedRow, comment: updatedValue};
    const current = [...titleSelectionItems];
    const updated = current.map((row) => row?.id===selectedRow?.id ? updatedRow : row);
    setTitleSelectionItems(updated);
    if(modalType === 'Edit') {
      message.success("Comment Updated Successfully");
    } else {
      message.success("Comment Added Successfully");
    }
    handleAnythingChanged(true);
  }

  const bodyForSaveTitlesApi = () => {
    const updated = titleSelectionItems?.map((item) => ({
      id: item.isNewField ? '' : item.id,
      Title: item.title,
      Who_Primary: item.primaryWhos,
      Who_Secondary: item.secondaryWhos,
      What_Primary: item.primaryWhats,
      What_Secondary: item.secondaryWhats,
      Where_Primary: item.primaryWheres,
      Where_Secondary: item.secondaryWheres,
      ...(item.isNewField ? {new: true, updated: false} : item.isEditField && {updated: true}),
      ...(item.comment && {comment: item.comment})
    }));
    const body = {
      titles: updated,
      story_id: story_id,
    };
    return body;
  };

  const getUpdatedJson = (arr) => {
    if(arr && arr.length>0) {
      const updated = arr.map((item, index) => ({
        id: item.id,
        idea: item.idea,
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
        ...(title.comment && {comment: title.comment})
      }
      
    })
  }

  const onSave = async () => {
    setIsSubmitting(true);
    let alertKey;
    try {
      // api call
      const apiUrl = API_BASE_PATH + API_ROUTES.SAVE_TITLES;
      const payload = bodyForSaveTitlesApi();

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      alertKey = message.loading("Saving Titles...", 0).key;
      const response = await axios.post(apiUrl, payload, config); // post api request
      const output = response?.data;
      if(output) {
        const situations = output?.situations;
        const newTitles = output?.updatedTitles?.titles;
        setTitleSelectionItems(getUpdatedTitles(newTitles));
        // update context
        const contextObj = { ...storyUploadApiResponse };
        const updatedContextObj = {
          ...contextObj,
          updatedTitles: getUpdatedTitles(newTitles),
          situations: getUpdatedJson(situations),
          updatedSituations: getUpdatedJson(situations),
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
    setIsSubmitting(false);
  };

  const onModify = (updatedObj) => {
    const curData = [...titleSelectionItems];
    const modified = curData.map((ele) =>
      ele.id === selectedRow.id ? updatedObj : ele
    );
    setTitleSelectionItems(modified);
    message.success("Updated Successfully !");
    handleAnythingChanged(true);
  };

  const onReset = () => {
    setTitleSelectionItems(titles);
    message.success("Reset Successfully !");
    handleAnythingChanged(true);
  };

  const handleAddRow = () => {
    const newObj = {
      id: titleSelectionItems?.length + 1,
      title: "",
      primaryWhos: [],
      secondaryWhos: [],
      primaryWhats: [],
      secondaryWhats: [],
      primaryWheres: [],
      secondaryWheres: [],
      isNewField: true
    };
    const curData = [newObj, ...titleSelectionItems];
    setTitleSelectionItems(curData);
    message.success("New Row Added Successfully !");
    handleAnythingChanged(true);
  };

  const handleDelete = () => {
    const curData = [...titleSelectionItems];
    const updated = curData.filter((ele) => ele.id !== selectedRow.id);
    setTitleSelectionItems(updated);
    message.success("Deleted Successfully !");
    handleAnythingChanged(true);
  };
console.log("storyUploadApiResponse.primaryWhos",storyUploadApiResponse.primaryWhos);

const [searchText, setSearchText] = useState(''); // Manage search text state
const [selectedKeys, setSelectedKeys] = useState([]); // Manage selected filter values

  const titleSelectionColumns = [
    {
      dataIndex: "title",
      title: <p className="text-center">Title / Sentence</p>,
      width: 330,
      align: 'justify',
    },
    {
      dataIndex: "primaryWhos",
      title: <p className="text-center">Primary WHOs</p>,
      filters: storyUploadApiResponse.primaryWhos.map((who) => ({
        text: who,  
        value: who, 
      })),
      onFilter: (value, record) => {
        return record.primaryWhos && record.primaryWhos.includes(value);
      },
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div className="p-2 w-52">
          <Input
            placeholder="Primary WHOs"
            value={selectedKeys[0] || ''}
            onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => confirm()} 
            className="p-2 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none mb-2 w-full"
          />
          <div className="max-h-48 overflow-y-auto">
            {storyUploadApiResponse.primaryWhos
              .filter((who) => who.toLowerCase().includes(selectedKeys[0]?.toLowerCase() || ""))  
              .map((who) => (
                <div key={who} className="flex items-center mb-2">
                  <Checkbox
                    value={who}
                    checked={selectedKeys.includes(who)} 
                    onChange={() => {
                      const newSelectedKeys = selectedKeys.includes(who)
                        ? selectedKeys.filter((key) => key !== who)
                        : [...selectedKeys, who];  
                      setSelectedKeys(newSelectedKeys);
                    }}
                  >
                    {who}
                  </Checkbox>
                </div>
              ))}
          </div>
          <div className="mt-2 ">
          <Button
              icon={<SearchOutlined />}
              size="small"
              className="w-20 bg-blue-500 hover:bg-blue-300 text-sm mr-2"
              onClick={() => {
                confirm();
              }}
            >
              Search
            </Button>
            <Button
              onClick={() => clearFilters && clearFilters()}
              size="small"
              className="w-20 bg-gray-200 hover:bg-gray-300 text-sm"
            >
              Reset
            </Button>
          </div>
        </div>
      ),
      sortDirections: ['descend', 'ascend'],
      render: (val) => {
        const csvStr = getCSVsFromList(val);
        return (
          <p>
            {csvStr ? csvStr : "NA"}
          </p>
        );
      },
    },
    {
      dataIndex: "secondaryWhos",
      title: <p className="text-center">Secondary WHOs</p>,
      filters: storyUploadApiResponse.secondaryWhos.map((who) => ({
        text: who,  
        value: who, 
      })),
      onFilter: (value, record) => {
        return record.secondaryWhos && record.secondaryWhos.includes(value);
      },
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div className="p-2 w-52">
          <Input
            placeholder="Secondary WHOs"
            value={selectedKeys[0] || ''} 
            onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => confirm()} 
            className="p-2 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none mb-2 w-full"
          />
          <div className="max-h-48 overflow-y-auto">
          {storyUploadApiResponse.secondaryWhos
              .filter((who) => who.toLowerCase().includes(selectedKeys[0]?.toLowerCase() || ""))  
              .map((who) => (
                <div key={who}>
                  <Checkbox
                    value={who}
                    checked={selectedKeys.includes(who)} 
                    onChange={() => {
                      const newSelectedKeys = selectedKeys.includes(who)
                        ? selectedKeys.filter((key) => key !== who) 
                        : [...selectedKeys, who];  
                      setSelectedKeys(newSelectedKeys);
                    }}
                  >
                    {who}
                  </Checkbox>
                </div>
              ))}
          </div>
          <div className="mt-2">
          <Button
              icon={<SearchOutlined />}
              size="small"
              className="w-20 bg-blue-500 hover:bg-blue-300 text-sm mr-2"
              onClick={() => {
                confirm();
              }}
            >
              Search
            </Button>
            <Button
              onClick={() => clearFilters && clearFilters()}
              size="small"
              className="w-20 bg-gray-200 hover:bg-gray-300 text-sm"
            >
              Reset
            </Button>
          </div>
        </div>
      ),
      sortDirections: ['descend', 'ascend'],
      render: (val) => {
        const csvStr = getCSVsFromList(val);
        return (
          <p>
            {csvStr ? csvStr : "NA"}
          </p>
        );
      },
    },
    {
      dataIndex: "primaryWhats",
      title: <p className="text-center">Primary WHATs</p>,
      filters: storyUploadApiResponse.primaryWhats.map((who) => ({
        text: who,  
        value: who,
      })),
      onFilter: (value, record) => {
        return record.primaryWhats && record.primaryWhats.includes(value);
      },
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div className="p-2 w-52">
          <Input
            placeholder="Primary WHATs"
            value={selectedKeys[0] || ''} 
            onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => confirm()} 
            className="p-2 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none mb-2 w-full"
            />
          <div className="max-h-48 overflow-y-auto">
          {storyUploadApiResponse.primaryWhats
              .filter((who) => who.toLowerCase().includes(selectedKeys[0]?.toLowerCase() || ""))  
              .map((who) => (
                <div key={who}>
                  <Checkbox
                    value={who}
                    checked={selectedKeys.includes(who)} 
                    onChange={() => {
                      const newSelectedKeys = selectedKeys.includes(who)
                        ? selectedKeys.filter((key) => key !== who) 
                        : [...selectedKeys, who];
                      setSelectedKeys(newSelectedKeys);
                    }}
                  >
                    {who}
                  </Checkbox>
                </div>
              ))}
          </div>
          <div className="mt-2">
          <Button
              icon={<SearchOutlined />}
              size="small"
              className="w-20 bg-blue-500 hover:bg-blue-300 text-sm mr-2"
              onClick={() => {
                confirm(); 
              }}
            >
              Search
            </Button>
            <Button
              onClick={() => clearFilters && clearFilters()}
              size="small"
              className="w-20 bg-gray-200 hover:bg-gray-300 text-sm"
              >
              Reset
            </Button>
          </div>
        </div>
      ),
      sortDirections: ['descend', 'ascend'],
      render: (val) => {
        const csvStr = getCSVsFromList(val);
        return (
          <p>
            {csvStr ? csvStr : "NA"}
          </p>
        );
      },
    },
    {
      dataIndex: "secondaryWhats",
      title: <p className="text-center">Secondary WHATs</p>,
      filters: storyUploadApiResponse.secondaryWhats.map((who) => ({
        text: who,  
        value: who, 
      })),
      onFilter: (value, record) => {
        return record.secondaryWhats && record.secondaryWhats.includes(value);
      },
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div className="p-2 w-52">
          <Input
            placeholder="Secondary WHATs"
            value={selectedKeys[0] || ''} 
            onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => confirm()} 
            className="p-2 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none mb-2 w-full"
            />
          <div className="max-h-48 overflow-y-auto">
          {storyUploadApiResponse.secondaryWhats
              .filter((who) => who.toLowerCase().includes(selectedKeys[0]?.toLowerCase() || ""))  
              .map((who) => (
                <div key={who}>
                  <Checkbox
                    value={who}
                    checked={selectedKeys.includes(who)} 
                    onChange={() => {
                      const newSelectedKeys = selectedKeys.includes(who)
                        ? selectedKeys.filter((key) => key !== who)  
                        : [...selectedKeys, who];  
                      setSelectedKeys(newSelectedKeys);
                    }}
                  >
                    {who}
                  </Checkbox>
                </div>
              ))}
          </div>
          <div className="mt-2">
          <Button
              icon={<SearchOutlined />}
              size="small"
              className="w-20 bg-blue-500 hover:bg-blue-300 text-sm mr-2"
              onClick={() => {
                confirm(); 
              }}
            >
              Search
            </Button>
            <Button
              onClick={() => clearFilters && clearFilters()}
              size="small"
              className="w-20 bg-gray-200 hover:bg-gray-300 text-sm"
              >
              Reset
            </Button>
          </div>
        </div>
      ),
      sortDirections: ['descend', 'ascend'],
      render: (val) => {
        const csvStr = getCSVsFromList(val);
        return (
          <p>
            {csvStr ? csvStr : "NA"}
          </p>
        );
      },
    },
    {
      dataIndex: "primaryWheres",
      title: <p className="text-center">Primary WHEREs</p>,
      filters: storyUploadApiResponse.primaryWheres.map((who) => ({
        text: who, 
        value: who,
      })),
      onFilter: (value, record) => {
        return record.primaryWheres && record.primaryWheres.includes(value);
      },
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div className="p-2 w-52">
          <Input
            placeholder="Primary WHEREs"
            value={selectedKeys[0] || ''} 
            onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => confirm()}
            className="p-2 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none mb-2 w-full"
            />
          
          <div className="max-h-48 overflow-y-auto">
          {storyUploadApiResponse.primaryWheres
              .filter((who) => who.toLowerCase().includes(selectedKeys[0]?.toLowerCase() || ""))  
              .map((who) => (
                <div key={who}>
                  <Checkbox
                    value={who}
                    checked={selectedKeys.includes(who)}
                    onChange={() => {
                      const newSelectedKeys = selectedKeys.includes(who)
                        ? selectedKeys.filter((key) => key !== who)  
                        : [...selectedKeys, who]; 
                      setSelectedKeys(newSelectedKeys);
                    }}
                  >
                    {who}
                  </Checkbox>
                </div>
              ))}
          </div>
          <div className="mt-2">
          <Button
              icon={<SearchOutlined />}
              size="small"
              className="w-20 bg-blue-500 hover:bg-blue-300 text-sm mr-2"
              onClick={() => {
                confirm(); 
              }}
            >
              Search
            </Button>
            <Button
              onClick={() => clearFilters && clearFilters()}
              size="small"
              className="w-20 bg-gray-200 hover:bg-gray-300 text-sm"
              >
              Reset
            </Button>
          </div>
        </div>
      ),
      sortDirections: ['descend', 'ascend'],
      render: (val) => {
        const csvStr = getCSVsFromList(val);
        return (
          <p>
            {csvStr ? csvStr : "NA"}
          </p>
        );
      },
    },
    {
      dataIndex: "secondaryWheres",
      title: <p className="text-center">Secondary WHEREs</p>,
      filters: storyUploadApiResponse.secondaryWheres.map((who) => ({
        text: who, 
        value: who,
      })),
      onFilter: (value, record) => {
        return record.secondaryWheres && record.secondaryWheres.some(val => value.includes(val));
      },
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div className="p-2 w-52">
          <Input
            placeholder="Secondary WHEREs"
            value={selectedKeys[0] || ''} 
            onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => confirm()} 
            className="p-2 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none mb-2 w-full"
          />
          <div className="max-h-48 overflow-y-auto">
            {storyUploadApiResponse.secondaryWheres
              .filter((who) => who.toLowerCase().includes(selectedKeys[0]?.toLowerCase() || ""))  
              .map((who) => (
                <div key={who}>
                  <Checkbox
                    value={who}
                    checked={selectedKeys.includes(who)} 
                    onChange={() => {
                      const newSelectedKeys = selectedKeys.includes(who)
                        ? selectedKeys.filter((key) => key !== who) 
                        : [...selectedKeys, who];  
                      setSelectedKeys(newSelectedKeys);
                    }}
                  >
                    {who}
                  </Checkbox>
                </div>
              ))}
          </div>    
          <div className="mt-2">
          <Button
              icon={<SearchOutlined />}
              size="small"
              className="w-20 bg-blue-500 hover:bg-blue-300 text-sm mr-2"
              onClick={() => {
                confirm(); 
              }}
            >
              Search
            </Button>
            <Button
              onClick={() => clearFilters && clearFilters()}
              size="small"
              className="w-20 bg-gray-200 hover:bg-gray-300 text-sm"
              >
              Reset
            </Button>
          </div>
        </div>
      ),
      sortDirections: ['descend', 'ascend'],
      render: (val) => {
        const csvStr = getCSVsFromList(val);
        return (
          <p>
            {csvStr ? csvStr : "NA"}
          </p>
        );
      },
    },
    {
      dataIndex: "comment",
      title: <p className="text-center">Comment</p>,
      render: (val, record) => {
        return (
          <p
            className={`cursor-pointer hover:text-blue-600 ${!val && "text-blue-600 underline"}`}
            onClick={() => {
              setSelectedRow(record);
              setShowCommentModal(true);
              setModalType(val ? 'Edit' : '');
              setComment(val ? val : '');
            }}
          >
            {val ?
            // "Lorem ipsum dolor sit amet consectetur adipisicing elit. Pariatur quasi soluta laudantium eum enim maiores aperiam eligendi officia nihil fugit neque cupiditate omnis dicta, perspiciatis porro magnam fugiat quaerat doloribus."
            val
            :
            "+ Add Comment"
            }
          </p>
        );
      },
    },
    {
      dataIndex: "action",
      title: "Action",
      render: (val, record) => {
        return (
          <div className="flex">
            {/* edit button */}
            <button
              title="View/Modify"
              onClick={() => {
                setShowModifyPopup(true);
                setSelectedRow(record);
              }}
            >
              <svg
                className="cursor-pointer hover:text-blue-600 text-gray-900 font-bold bi bi-pencil-square"
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
            {/* delete button */}
            <button
              title="Delete"
              onClick={() => {
                setShowDeleteModal(true);
                setSelectedRow(record);
              }}
            >
              <svg
                className="ml-5 cursor-pointer hover:text-red-400 text-red-600 font-boldbi bi-trash3"
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5" />
              </svg>
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="px-5 pb-5 rounded-md border">
      <div className="text-lg flex flex-col md:flex-row justify-between md:text-xl mt-5 mb-3 md:mb-4">
        <p>Step-3 : Title Selection</p>
        <p className="text-lg md:text-xl mt-2 md:mt-0">
          Story World : <span className="text-violet-500">{storyWorld}</span>
        </p>
      </div>

      {fileName && (
        <p className="text-md md:text-lg mb-4 md:mb-6">
          File Uploaded :{" "}
          <span
            title="Click to see story text"
            className="font-medium text-blue-500 cursor-pointer"
            onClick={() => setShowStoryModal(true)}
          >
            {fileName}
          </span>
        </p>
      )}

      {/* body */}
      <div>
        <div className="flex justify-end items-center mb-3">
          <Button className="bg-blue-500 text-white h-9" onClick={handleAddRow}>
            ADD NEW
          </Button>
        </div>
        <div className="overflow-auto">
          <Table
            dataSource={titleSelectionItems}
            columns={titleSelectionColumns}
            bordered
            className="custom-table"
          />
        </div>
      </div>

      {/* modify popup */}
      {showModifyPopup && (
        <ModifySelectionPopup
          open={showModifyPopup}
          modifyItemObj={selectedRow}
          onClose={() => setShowModifyPopup(false)}
          onModify={onModify}
          type="title"
        />
      )}

      {/* modify popup */}
      {showDeleteModal && (
        <DeleteConfirmationDialog
          open={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDelete}
        />
      )}

      {/* story text */}
      {showStoryModal && (
        <StoryTextPopup
          open={showStoryModal}
          onClose={() => setShowStoryModal(false)}
        />
      )}

      {/* add comment modal */}
      {showCommentModal && (
        <SingleTextAreaModal
          open={showCommentModal}
          type={modalType}
          label="Comment"
          editItem={comment}
          onUpdate={onUpdate}
          onClose={() => {
            setShowCommentModal(false);
            setComment("");
            setModalType("");
          }}
        />
      )}

      <FooterButtons
        onDiscard={onDiscard}
        onReset={onReset}
        onSubmit={onSave}
        saveType="Titles"
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default TitleSelection;
