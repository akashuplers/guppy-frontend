import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { API_BASE_PATH, API_ROUTES } from "../../constants/api-endpoints";
import axios from "axios";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import LoadingButtonPrimary from "../../utils/LoadingButtonPrimary";

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Field Required"),
  leadWho: Yup.string().required("Field Required"),
});

const AddStoryWorld = ({ token, onAddStoryWorld = () => { } }) => {
  const navigate = useNavigate();

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const apiUrl = API_BASE_PATH + API_ROUTES.ADD_STORY_WORLD;
      const formData = {
        name: values?.name,
        lead_who: values?.leadWho
      }
      // api call
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.post(apiUrl, formData, config); // post api request
      const output = response?.data?.latestStoryWorld;
      if(output) {
        onAddStoryWorld(output);
        resetForm();
      }

    } catch (error) {
      console.error('Error:', error);
      const statusCode = error?.response?.status;
      if(statusCode === 401) {
        message.error("Not Authorized ! You need to login first !");
        navigate("/");
      } else if(statusCode === 400) {
        message.error("Story World Already Exists With This Name !");
      } else if(statusCode === 500) {
        message.error("Internal Server Error !");
      } else {
        const errorMessage = error?.response?.data?.message;
        if(errorMessage) {
          message.error(errorMessage);
        } else {
          message.error("Something Went Wrong ! Please Try Again After Some Time !");
        }
      }
    }
    setSubmitting(false);
  }

  return (
    <div className="px-6 py-6 space-y-4 md:space-y-6 sm:px-8 sm:py-4">
      <Formik
        initialValues={{
          name: "",
          leadWho: "",
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, setFieldValue }) => (
          <Form className="flex flex-col md:flex-row gap-2 md:gap-5">
            <div>
                <label
                    htmlFor="name"
                    className="block mb-2 text-md md:text-lg font-medium text-gray-900"
                >
                    Name
                </label>
                <Field
                    type="text"
                    name="name"
                    id="name"
                    className="bg-gray-50 w-full lg:w-[14vw] md:w-[18vw] border p-2 border-gray-300 text-gray-900 sm:text-md rounded-lg focus:ring-primary-600 focus:border-primary-600 block"
                />
                <ErrorMessage
                    name="name"
                    component="div"
                    className="text-red-500 text-sm"
                />
            </div>
            
            <div>
                <label
                    htmlFor="leadWho"
                    className="block mb-2 text-md md:text-lg font-medium text-gray-900"
                >
                    Lead WHO
                </label>
                <Field
                    type="text"
                    name="leadWho"
                    id="leadWho"
                    className="bg-gray-50 w-full lg:w-[14vw] md:w-[18vw] border p-2 border-gray-300 text-gray-900 sm:text-md rounded-lg focus:ring-primary-600 focus:border-primary-600 block"
                />
                <ErrorMessage
                    name="leadWho"
                    component="div"
                    className="text-red-500 text-sm"
                />
            </div>

            <div>
              {!isSubmitting ? (
                <button
                  type="submit"
                  className="text-white w-full lg:w-[14vw] md:w-[18vw] px-5 py-3 mt-4 md:mt-8 bg-blue-600 hover:bg-blue-400 focus:ring-4 focus:outline-none ring-primary-300 font-medium rounded-lg text-sm text-center bg-primary-600 hover:bg-primary-700 focus:ring-primary-800"
                  disabled={isSubmitting}
                >
                  Add Story World
                </button>
              ) : (
                <LoadingButtonPrimary
                    title={"Loading..."}
                    className={"w-full lg:w-[14vw] md:w-[18vw] px-5 py-3 mt-4 md:mt-8"}
                />
              )}
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddStoryWorld;
