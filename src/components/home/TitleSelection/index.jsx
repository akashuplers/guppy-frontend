import React, { useEffect, useState } from 'react'
import FooterButtons from '../FooterButtons'
import { Button, Table, message } from 'antd'
import { titleSelectionData } from '../../../utils/data';
import ModifyPopup from './ModifyPopup';
import DeleteConfirmationDialog from '../../../utils/modals/DeleteConfirmationDialog';

const getCSVsFromList = (list_of_strings) => {
    return list_of_strings.join(', ');
}

const TitleSelection = ({ storyWorld, fileName, onDiscard = () => { } }) => {
  const [showModifyPopup, setShowModifyPopup] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState({});
  const [titleSelectionItems, setTitleSelectionItems] = useState([]);

  useEffect(() => {
    setTitleSelectionItems(titleSelectionData);
  }, []);

  console.log('rendering...')

  const onModify = (updatedObj) => {
    const curData = [...titleSelectionItems];
    const modified = curData.map(ele => ele.id === selectedRow.id ? updatedObj : ele);
    setTitleSelectionItems(modified);
    message.success('Updated Successfully !');
  }

  const onReset = () => {
    setTitleSelectionItems(titleSelectionData);
    message.success("Reset Successfully !");
  }

  const handleAddRow = () => {
    const newObj = {
        id: titleSelectionItems?.length+1,
        sentence: '',
        primaryWhos: [],
        secondaryWhos: [],
        primaryWhats: [],
        secondaryWhats: [],
        primaryWheres: [],
        secondaryWheres: []
    }
    const curData = [...titleSelectionItems, newObj];
    console.log(curData);
    setTitleSelectionItems(curData);
    message.success("New Row Added Successfully !");
  }

  const handleDelete = () => {
    const curData = [...titleSelectionItems];
    const updated = curData.filter(ele => ele.id !== selectedRow.id);
    setTitleSelectionItems(updated);
    message.success('Deleted Successfully !');
  }

  const titleSelectionColumns = [
    {
        dataIndex: "sentence",
        title: "Sentence / Title",
        render: (val) => {
            return (
                <p title={val?.length>25 ? val : ''}>
                    {val?.length>25 ? val.slice(0, 25) + '...' : val}
                </p>
            )
        }
    },
    {
        dataIndex: "primaryWhos",
        title: "Primary WHOs",
        render: (val) => {
            const csvStr = getCSVsFromList(val);
            return (
                <p title={csvStr?.length>15 ? csvStr : ''}>
                    {csvStr ? csvStr.length>15 ? csvStr.slice(0, 15) + '...' : csvStr : 'NA'}
                </p>
            )
        }
    },
    {
        dataIndex: "secondaryWhos",
        title: "Secondary WHOs",
        render: (val) => {
            const csvStr = getCSVsFromList(val);
            return (
                <p title={csvStr?.length>15 ? csvStr : ''}>
                    {csvStr ? csvStr.length>15 ? csvStr.slice(0, 15) + '...' : csvStr : 'NA'}
                </p>
            )
        }
    },
    {
        dataIndex: "primaryWhats",
        title: "Primary WHATs",
        render: (val) => {
            const csvStr = getCSVsFromList(val);
            return (
                <p title={csvStr?.length>15 ? csvStr : ''}>
                    {csvStr ? csvStr.length>15 ? csvStr.slice(0, 15) + '...' : csvStr : 'NA'}
                </p>
            )
        }
    },
    {
        dataIndex: "secondaryWhats",
        title: "Secondary WHATs",
        render: (val) => {
            const csvStr = getCSVsFromList(val);
            return (
                <p title={csvStr?.length>15 ? csvStr : ''}>
                    {csvStr ? csvStr.length>15 ? csvStr.slice(0, 15) + '...' : csvStr : 'NA'}
                </p>
            )
        }
    },
    {
        dataIndex: "primaryWheres",
        title: "Primary WHEREs",
        render: (val) => {
            const csvStr = getCSVsFromList(val);
            return (
                <p title={csvStr?.length>15 ? csvStr : ''}>
                    {csvStr ? csvStr.length>15 ? csvStr.slice(0, 15) + '...' : csvStr : 'NA'}
                </p>
            )
        }
    },
    {
        dataIndex: "secondaryWheres",
        title: "Secondary WHEREs",
        render: (val) => {
            const csvStr = getCSVsFromList(val);
            return (
                <p title={csvStr?.length>15 ? csvStr : ''}>
                    {csvStr ? csvStr.length>15 ? csvStr.slice(0, 15) + '...' : csvStr : 'NA'}
                </p>
            )
        }
    },
    {
        dataIndex: "action",
        title: "Action",
        render: (val, record) => {
            return (
                <div className='flex'>
                    {/* edit button */}
                    <button
                        title="View/Modify"
                        onClick={() => {
                            setShowModifyPopup(true);
                            setSelectedRow(record);
                        }}
                    >
                        <svg className="cursor-pointer hover:text-blue-600 text-gray-900 font-bold bi bi-pencil-square" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                            <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
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
                        <svg className="ml-5 cursor-pointer hover:text-red-400 text-red-600 font-boldbi bi-trash3" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>
                        </svg>
                    </button>
                </div>

            )
        }
    }
  ];

  return (
    <div className='px-5 pb-5 rounded-md border'>
        <p className='text-lg md:text-xl font-medium mt-5 mb-3 md:mb-5'>Step-3 : <span className='underline'>Title Selection</span></p>
        <p className='text-lg md:text-xl mb-2 md:mb-4 text-violet-500'>{storyWorld}</p>
        {fileName &&
          <p className='text-md md:text-lg mb-4 md:mb-6'>File Uploaded : <span className='font-medium text-blue-500 underline'>{fileName}</span></p>
        }

        {/* body */}
        <div>
          <div className='flex justify-between items-center mb-3'>
            <p className='text-lg md:text-xl underline'>TITLES</p>
            <Button
              className='bg-blue-500 text-white h-9'
              onClick={handleAddRow}
            >
              ADD NEW
            </Button>
          </div>
          <div className='overflow-auto'>
            <Table
                dataSource={titleSelectionItems}
                columns={titleSelectionColumns}
            />
          </div>

        </div>

        {/* modify popup */}
        {showModifyPopup &&
            <ModifyPopup
                open={showModifyPopup}
                modifyItemObj={selectedRow}
                onClose={() => setShowModifyPopup(false)}
                onModify={onModify}
            />
        }

        {/* modify popup */}
        {showDeleteModal &&
            <DeleteConfirmationDialog
                open={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleDelete}
            />
        }

        <FooterButtons onDiscard={onDiscard} onReset={onReset} />

    </div>
  )
}

export default TitleSelection