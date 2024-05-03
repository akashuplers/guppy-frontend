import React, { useContext, useEffect, useState } from 'react';
import { listOfWhats, listOfWheres, listOfWhos } from '../../utils/data';
import FooterButtons from './FooterButtons';
import DeleteConfirmationDialog from '../../utils/modals/DeleteConfirmationDialog';
import { message } from 'antd';
import EditModal from './EditModal';
import { StoryUploadApiContext } from '../../contexts/ApiContext';

const ThreeWsSelection = ({ storyWorld, leadWho, fileName, onDiscard = () => { } }) => {

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletionItem, setDeletionItem] = useState({});
  const [type, setType] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editItem, setEditItem] = useState({});
  const [whoItems, setWhoItems] = useState([]);
  const [whatItems, setWhatItems] = useState([]);
  const [whereItems, setWhereItems] = useState([]);
  const [primaryWhos, setPrimaryWhos] = useState([]);
  const [secondaryWhos, setSecondaryWhos] = useState([]);
  const [primaryWhats, setPrimaryWhats] = useState([]);
  const [secondaryWhats, setSecondaryWhats] = useState([]);
  const [primaryWheres, setPrimaryWheres] = useState([]);
  const [secondaryWheres, setSecondaryWheres] = useState([]);

  const { storyUploadApiResponse } = useContext(StoryUploadApiContext);
  console.log('storyUploadApiResponse: ', storyUploadApiResponse);

  useEffect(() => {
    setWhoItems(listOfWhos);
    setWhatItems(listOfWhats);
    setWhereItems(listOfWheres);
  }, []);

  const handleWhoRadioChange = (item) => {
    const updatedItem = { ...item, isRadioSelected: !item.isRadioSelected };
    const updatedArr = whoItems.map(ele => ele.id === item.id ? updatedItem : ele);
    setWhoItems(updatedArr);
    setPrimaryWhos([...primaryWhos, item?.name]);
  }

  const handleWhoCheckboxChange = (item) => {
    if(item.isCheckboxSelected) {
        const filteredArr = secondaryWhos.filter(ele => ele.toLowerCase() !== item.name.toLowerCase());
        setSecondaryWhos(filteredArr);
    } else {
        setSecondaryWhos([...secondaryWhos, item?.name]);
    }
    const updatedItem = { ...item, isCheckboxSelected: !item.isCheckboxSelected };
    const updatedArr = whoItems.map(ele => ele.id === item.id ? updatedItem : ele);
    setWhoItems(updatedArr);
  }

  const handleWhatRadioChange = (item) => {
    const updatedItem = { ...item, isRadioSelected: !item.isRadioSelected };
    const updatedArr = whatItems.map(ele => ele.id === item.id ? updatedItem : ele);
    setWhatItems(updatedArr);
    setPrimaryWhats([...primaryWhats, item?.name]);
  }

  const handleWhatCheckboxChange = (item) => {
    if(item.isCheckboxSelected) {
        const filteredArr = secondaryWhats.filter(ele => ele.toLowerCase() !== item.name.toLowerCase());
        setSecondaryWhats(filteredArr);
    } else {
        setSecondaryWhats([...secondaryWhats, item?.name]);
    }
    const updatedItem = { ...item, isCheckboxSelected: !item.isCheckboxSelected };
    const updatedArr = whatItems.map(ele => ele.id === item.id ? updatedItem : ele);
    setWhatItems(updatedArr);
  }

  const handleWhereRadioChange = (item) => {
    const updatedItem = { ...item, isRadioSelected: !item.isRadioSelected };
    const updatedArr = whereItems.map(ele => ele.id === item.id ? updatedItem : ele);
    setWhereItems(updatedArr);
    setPrimaryWheres([...primaryWheres, item?.name]);
  }

  const handleWhereCheckboxChange = (item) => {
    if(item.isCheckboxSelected) {
        const filteredArr = secondaryWheres.filter(ele => ele.toLowerCase() !== item.name.toLowerCase());
        setSecondaryWheres(filteredArr);
    } else {
        setSecondaryWheres([...secondaryWheres, item?.name]);
    }
    const updatedItem = { ...item, isCheckboxSelected: !item.isCheckboxSelected };
    const updatedArr = whereItems.map(ele => ele.id === item.id ? updatedItem : ele);
    setWhereItems(updatedArr);
  }

  const onDelete = (deletionItem) => {
    const threeWsInfoObj = JSON.parse(localStorage.getItem("threeWsInfo"));
    if(type === 'who') {
        const updatedArr = whoItems.filter(ele => ele.id !== deletionItem.id);
        setWhoItems(updatedArr);
        if(deletionItem.isRadioSelected) {
            const updated = primaryWhos.filter(ele => ele.toLowerCase() !== deletionItem.name.toLowerCase())
            setPrimaryWhos(updated);
            const updatedObj = {...threeWsInfoObj, primaryWhos: updated };
            localStorage.setItem("threeWsInfo", JSON.stringify(updatedObj));
        }
        if(deletionItem.isCheckboxSelected) {
            const updated = secondaryWhos.filter(ele => ele.toLowerCase() !== deletionItem.name.toLowerCase())
            setSecondaryWhos(updated);
            const updatedObj = {...threeWsInfoObj, secondaryWhos: updated };
            localStorage.setItem("threeWsInfo", JSON.stringify(updatedObj));
        }
    } else if(type === 'what') {
        const updatedArr = whatItems.filter(ele => ele.id !== deletionItem.id);
        setWhatItems(updatedArr);
        if(deletionItem.isRadioSelected) {
            const updated = primaryWhats.filter(ele => ele.toLowerCase() !== deletionItem.name.toLowerCase())
            setPrimaryWhats(updated);
            const updatedObj = {...threeWsInfoObj, primaryWhats: updated };
            localStorage.setItem("threeWsInfo", JSON.stringify(updatedObj));
        }
        if(deletionItem.isCheckboxSelected) {
            const updated = secondaryWhats.filter(ele => ele.toLowerCase() !== deletionItem.name.toLowerCase())
            setSecondaryWhats(updated);
            const updatedObj = {...threeWsInfoObj, secondaryWhats: updated };
            localStorage.setItem("threeWsInfo", JSON.stringify(updatedObj));
        }
    } else {
        const updatedArr = whereItems.filter(ele => ele.id !== deletionItem.id);
        setWhereItems(updatedArr);
        if(deletionItem.isRadioSelected) {
            const updated = primaryWheres.filter(ele => ele.toLowerCase() !== deletionItem.name.toLowerCase())
            setPrimaryWheres(updated);
            const updatedObj = {...threeWsInfoObj, primaryWheres: updated };
            localStorage.setItem("threeWsInfo", JSON.stringify(updatedObj));
        }
        if(deletionItem.isCheckboxSelected) {
            const updated = secondaryWheres.filter(ele => ele.toLowerCase() !== deletionItem.name.toLowerCase())
            setSecondaryWheres(updated);
            const updatedObj = {...threeWsInfoObj, secondaryWheres: updated };
            localStorage.setItem("threeWsInfo", JSON.stringify(updatedObj));
        }
    }
    message.success('Deleted Successfully !');
  }

  const onUpdate = (editItemObj, updatedValue) => {
    console.log(editItemObj)
    console.log(updatedValue)
    const threeWsInfoObj = JSON.parse(localStorage.getItem("threeWsInfo"));
    if(type === 'who') {
        const updatedObj = { ...editItemObj, name: updatedValue };
        const updatedArr = whoItems.map(ele => ele.id === editItemObj.id ? updatedObj : ele);
        setWhoItems(updatedArr);
        if(editItemObj.isRadioSelected) {
            const newList = [...primaryWhos];
            const index = newList.indexOf(editItemObj.name);
            newList[index] = updatedValue;
            setPrimaryWhos(newList);
            const updatedObj = {...threeWsInfoObj, primaryWhos: newList };
            localStorage.setItem("threeWsInfo", JSON.stringify(updatedObj));
        }
        if(editItemObj.isCheckboxSelected) {
            const newList = [...secondaryWhos];
            const index = newList.indexOf(editItemObj.name);
            newList[index] = updatedValue;
            setSecondaryWhos(newList);
            const updatedObj = {...threeWsInfoObj, secondaryWhos: newList };
            localStorage.setItem("threeWsInfo", JSON.stringify(updatedObj));
        }
    } else if(type === 'what') {
        const updatedObj = { ...editItemObj, name: updatedValue };
        const updatedArr = whatItems.map(ele => ele.id === editItemObj.id ? updatedObj : ele);
        setWhatItems(updatedArr);
        if(editItemObj.isRadioSelected) {
            const newList = [...primaryWhats];
            const index = newList.indexOf(editItemObj.name);
            newList[index] = updatedValue;
            setPrimaryWhats(newList);
            const updatedObj = {...threeWsInfoObj, primaryWhats: newList };
            localStorage.setItem("threeWsInfo", JSON.stringify(updatedObj));
        }
        if(editItemObj.isCheckboxSelected) {
            const newList = [...secondaryWhats];
            const index = newList.indexOf(editItemObj.name);
            newList[index] = updatedValue;
            setSecondaryWhats(newList);
            const updatedObj = {...threeWsInfoObj, secondaryWhats: newList };
            localStorage.setItem("threeWsInfo", JSON.stringify(updatedObj));
        }
    } else {
        const updatedObj = { ...editItemObj, name: updatedValue };
        const updatedArr = whereItems.map(ele => ele.id === editItemObj.id ? updatedObj : ele);
        setWhereItems(updatedArr);
        if(editItemObj.isRadioSelected) {
            const newList = [...primaryWheres];
            const index = newList.indexOf(editItemObj.name);
            newList[index] = updatedValue;
            setPrimaryWheres(newList);
            const updatedObj = {...threeWsInfoObj, primaryWheres: newList };
            localStorage.setItem("threeWsInfo", JSON.stringify(updatedObj));
        }
        if(editItemObj.isCheckboxSelected) {
            const newList = [...secondaryWheres];
            const index = newList.indexOf(editItemObj.name);
            newList[index] = updatedValue;
            setSecondaryWheres(newList);
            const updatedObj = {...threeWsInfoObj, secondaryWheres: newList };
            localStorage.setItem("threeWsInfo", JSON.stringify(updatedObj));
        }
    }
    message.success('Updated Successfully !');
  }

  const onReset = () => {
    setWhoItems(listOfWhos);
    setWhatItems(listOfWhats);
    setWhereItems(listOfWheres);
    setPrimaryWhos([]);
    setPrimaryWhats([]);
    setPrimaryWheres([]);
    setSecondaryWhos([]);
    setSecondaryWhats([]);
    setSecondaryWheres([]);
  }

  const onSave = () => {
    const threeWsInfoObj = {
        primaryWhos: primaryWhos,
        secondaryWhos: secondaryWhos,
        primaryWhats: primaryWhats,
        secondaryWhats: secondaryWhats,
        primaryWheres: primaryWheres,
        secondaryWheres: secondaryWheres,
    };
    localStorage.setItem("threeWsInfo", JSON.stringify(threeWsInfoObj));
    message.success('Details Saved Successfully !');
  }

  return (
    <div className='px-5 pb-5 rounded-md border'>
        <p className='text-lg md:text-xl font-medium mt-5 mb-3 md:mb-5'>Step-2 : <span className='underline'>Three W's Selection</span></p>
        <p className='text-lg md:text-xl mb-2 md:mb-4 text-violet-500'>{storyWorld}</p>
        {fileName &&
            <p className='text-md md:text-lg mb-4 md:mb-6'>File Uploaded : <span className='font-medium text-blue-500 underline'>{fileName}</span></p>
        }

        {/* body */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>

            {/* WHO SECTION */}
            <div className='h-[24vh] overflow-auto border border-2 border-violet-300 bg-violet-50 p-2 md:p-3 rounded-md'>
                <p className='text-center underline mb-2'>WHO</p>
                <ul className='space-y-0 md:space-y-1'>
                    <li>
                        <p className='ml-2 font-medium'>{leadWho}</p>
                    </li>
                    {whoItems.map((item, index) => (
                        <li key={item.id}>
                            <div className="flex items-center">
                                <div title={ item.name.length>20 ? item.name : '' } className='flex items-center w-full md:w-[18vw]'>
                                    <input checked={item.isRadioSelected} disabled={item.isCheckboxSelected} onChange={() => handleWhoRadioChange(item)} id={`link-radio-${index}`} type="radio" value={item.name} className="w-4 h-4 me-3 text-blue-600 border-gray-300 disabled:bg-gray-200 focus:ring-blue-500 focus:ring-2" />
                                    <input checked={item.isCheckboxSelected} disabled={item.isRadioSelected} onChange={() => handleWhoCheckboxChange(item)} id={`default-checkbox-${index}`} type="checkbox" value={item.name} className="w-4 h-4 text-blue-600 border-gray-300 disabled:bg-gray-200 rounded focus:ring-blue-500 focus:ring-2" />
                                    <label htmlFor={`link-radio-${index}`} className="ms-2 text-md">
                                        <p>{( item.name.length > 20 ) ? item.name.slice(0, 20) + '...' : item.name }</p>
                                    </label>
                                </div>
                                {/* edit icon */}
                                <button
                                    title="Edit"
                                    onClick={() => {
                                        setShowEditModal(true);
                                        setEditItem(item);
                                        setType('who');
                                    }}
                                >
                                    <svg className="ml-6 cursor-pointer text-gray-900 hover:text-blue-600 font-bold bi bi-pencil-square" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                        <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                                        <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
                                    </svg>
                                </button>

                                {/* delete icon */}
                                <button
                                    title="Delete"
                                    onClick={() => {
                                        setShowDeleteModal(true);
                                        setDeletionItem(item);
                                        setType('who');
                                    }}
                                >
                                    <svg className="ml-6 cursor-pointer text-red-600 hover:text-red-400 font-boldbi bi-trash3" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                        <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>
                                    </svg>
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            {/* WHAT SECTION */}
            <div className='h-[24vh] overflow-y-auto border border-2 border-violet-300 bg-violet-50 p-2 md:p-3 rounded-md'>
                <p className='text-center underline mb-5'>WHAT</p>
                <ul className='space-y-0 md:space-y-1'>
                    {whatItems.map((item, index) => (
                        <li key={item.id}>
                            <div className="flex items-center">
                                <div title={ item.name.length>20 ? item.name : '' } className='flex items-center w-full md:w-[18vw]'>
                                    <input checked={item.isRadioSelected} disabled={item.isCheckboxSelected} onChange={() => handleWhatRadioChange(item)} id={`link-radio-${index}`} type="radio" value={item.name} className="w-4 h-4 me-3 text-blue-600 disabled:bg-gray-200 border-gray-300 focus:ring-blue-500 focus:ring-2" />
                                    <input checked={item.isCheckboxSelected} disabled={item.isRadioSelected} onChange={() => handleWhatCheckboxChange(item)} id={`default-checkbox-${index}`} type="checkbox" value={item.name} className="w-4 h-4 text-blue-600 disabled:bg-gray-200 border-gray-300 rounded focus:ring-blue-500 focus:ring-2" />
                                    <label htmlFor={`link-radio-${index}`} className="ms-2 text-md">
                                        <p>{( item.name.length > 20 ) ? item.name.slice(0, 20) + '...' : item.name }</p>
                                    </label>
                                </div>
                                {/* edit icon */}
                                <button
                                    title="Edit"
                                    onClick={() => {
                                        setShowEditModal(true);
                                        setEditItem(item);
                                        setType('what');
                                    }}
                                >
                                    <svg className="ml-6 cursor-pointer text-gray-900 hover:text-blue-600 font-bold bi bi-pencil-square" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                        <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                                        <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
                                    </svg>
                                </button>

                                {/* delete icon */}
                                <button
                                    title="Delete"
                                    onClick={() => {
                                        setShowDeleteModal(true);
                                        setDeletionItem(item);
                                        setType('what');
                                    }}                                >
                                    <svg className="ml-6 cursor-pointer text-red-600 hover:text-red-400 font-boldbi bi-trash3" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                        <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>
                                    </svg>
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            {/* WHERE SECTION */}
            <div className='h-[24vh] overflow-y-auto border border-2 border-violet-300 bg-violet-50 p-2 md:p-3 rounded-md'>
                <p className='text-center underline mb-5'>WHERE</p>
                <ul className='space-y-0 md:space-y-1'>
                    {whereItems.map((item, index) => (
                        <li key={item.id}>
                            <div className="flex items-center">
                                <div title={ item.name.length>20 ? item.name : '' } className='flex items-center w-full md:w-[18vw]'>
                                    <input checked={item.isRadioSelected} disabled={item.isCheckboxSelected} onChange={() => handleWhereRadioChange(item)} id={`link-radio-${index}`} type="radio" value={item.name} className="w-4 h-4 me-3 text-blue-600 disabled:bg-gray-200 border-gray-300 focus:ring-blue-500 focus:ring-2" />
                                    <input checked={item.isCheckboxSelected} disabled={item.isRadioSelected} onChange={() => handleWhereCheckboxChange(item)} id={`default-checkbox-${index}`} type="checkbox" value={item.name} className="w-4 h-4 text-blue-600 disabled:bg-gray-200 border-gray-300 rounded focus:ring-blue-500 focus:ring-2" />
                                    <label htmlFor={`link-radio-${index}`} className="ms-2 text-md">
                                        <p>{( item.name.length > 20 ) ? item.name.slice(0, 20) + '...' : item.name }</p>
                                    </label>
                                </div>
                                {/* edit icon */}
                                <button
                                    title="Edit"
                                    onClick={() => {
                                        setShowEditModal(true);
                                        setEditItem(item);
                                        setType('where');
                                    }}
                                >
                                    <svg className="ml-6 cursor-pointer text-gray-900 hover:text-blue-600 font-bold bi bi-pencil-square" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                        <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                                        <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
                                    </svg>
                                </button>

                                {/* delete icon */}
                                <button
                                    title="Delete"
                                    onClick={() => {
                                        setShowDeleteModal(true);
                                        setDeletionItem(item);
                                        setType('where');
                                    }}                                >
                                    <svg className="ml-6 cursor-pointer text-red-600 hover:text-red-400 font-boldbi bi-trash3" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                        <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>
                                    </svg>
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

        </div>

        {/* delete modal */}
        {showDeleteModal &&
            <DeleteConfirmationDialog
                open={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={() => onDelete(deletionItem)}
            />
        }

        {/* delete modal */}
        {showEditModal &&
            <EditModal
                open={showEditModal}
                onClose={() => setShowEditModal(false)}
                editItemObj={editItem}
                onUpdate={onUpdate}
            />
        }

        <FooterButtons onDiscard={onDiscard} onReset={onReset} onSubmit={onSave} />

    </div>
  )
}

export default ThreeWsSelection;