import React, { useEffect, useState } from 'react'
import SidebarWithHeader from '../sidebar-with-header'
import { useNavigate } from 'react-router-dom';
import { Tabs, message } from 'antd';
import { API_BASE_PATH, API_ROUTES } from '../../constants/api-endpoints';
import axios from 'axios';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import LoadingButtonPrimary from '../../utils/LoadingButtonPrimary';
import * as Yup from "yup";
import WsList from './WsList';

const notFoundMsg = "No Master Ws Found With Selected Story World !"

const storyWorldsLocal = [
    { _id: 1, name: "story_world_1", lead_who: "Alice" },
    { _id: 2, name: "story_world_2", lead_who: "Sara" },
];

const validationSchema = Yup.object().shape({
    storyWorld: Yup.string().required("Please Select A Story World"),
});

const MasterWsPage = () => {
  const navigate = useNavigate();
  const [storyWorldOptions, setStoryWorldOptions] = useState(storyWorldsLocal);
  const [token, setToken] = useState("");
  const [whos, setWhos] = useState([]);
  const [whats, setWhats] = useState([]);
  const [wheres, setWheres] = useState([]);
  const [isFetched, setIsFetched] = useState(false);
  const [notFetched, setNotFetched] = useState(false);

  useEffect(() => {
    const tokenVal = JSON.parse(localStorage.getItem("accessToken"));
    if(!tokenVal) {
        navigate('/');
    } else {
        setToken(tokenVal);
        fetchStoryWorlds(tokenVal);
    }
  }, []);

  const items = [
    {
      key: '1',
      label: <p className='text-lg'>WHOs</p>,
      children: <WsList type="WHOs" list={whos} />,
    },
    {
      key: '2',
      label: <p className='text-lg'>WHATs</p>,
      children: <WsList type="WHATs" list={whats} />,
    },
    {
      key: '3',
      label: <p className='text-lg'>WHEREs</p>,
      children: <WsList type="WHEREs" list={wheres} />,
    },
  ];

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
        message.success("Story Worlds Fetched Succesfully !");
      } else {
        message.error("Error in fetching story worlds !");
        setStoryWorldOptions(storyWorldsLocal);
      }
    } catch (error) {
      console.error('Error:', error);
      setStoryWorldOptions(storyWorldsLocal);
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
          message.error("Error in fetching story worlds !");
        }
      }      
    }
  }

  const handleSubmit = async (values, { setSubmitting }) => {
    let alertKey;
    try {
        const storyWorldId = values?.storyWorld;
        const apiUrl = API_BASE_PATH + API_ROUTES.FETCH_MASTER_Ws + `/${storyWorldId}`;
  
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        alertKey = message.loading("Fetching Master Ws...", 0).key;
        const response = await axios.get(apiUrl, config); // post api request
        const output = response?.data?.masterWS;
        if(output) {
          const { Who, What, Where } = output;
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
    setSubmitting(false);
  }

  return (
    <SidebarWithHeader>
      <div>
          {/* head */}
          <p className="text-xl md:text-3xl mt-1 mb-2 md:mb-0 font-medium">Master Ws</p>

          {/* body */}
          <div className='mt-8'>
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
                        <option key={index} value={item?._id}>{item?.name}</option>
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
                      <button
                        type="submit"
                        className="text-white w-full md:w-[18vw] px-5 py-3 mt-4 md:mt-9 bg-blue-600 hover:bg-blue-400 focus:ring-4 focus:outline-none ring-primary-300 font-medium rounded-lg text-sm text-center bg-primary-600 hover:bg-primary-700 focus:ring-primary-800"
                        disabled={isSubmitting}
                      >
                        Fetch Master Ws
                      </button>
                    ) : (
                      <LoadingButtonPrimary className="mt-4 md:mt-9" title={"Fetching..."} />
                    )}

                  </div>
                </Form>
              )}
            </Formik>
          </div>

          {/* master Ws Tabs */}
          {isFetched &&
            <div className='mt-10 px-5'>
              <Tabs defaultActiveKey="1" items={items} />
            </div>
          }
          {notFetched &&
            <p className='text-lg py-2 text-center bg-violet-50 border rounded-md mt-20 px-8'>
              {notFoundMsg}
            </p>
          }

      </div>
    </SidebarWithHeader>
  )
}

export default MasterWsPage