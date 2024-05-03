import React, { useContext } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { API_BASE_PATH, API_ROUTES } from "../../constants/api-endpoints";
import axios from "axios";
import { message } from "antd";
import { StoryUploadApiContext } from "../../contexts/ApiContext";

const validationSchema = Yup.object().shape({
  storyWorld: Yup.string().required("Please Select An Option"),
  leadWho: Yup.string().required("Field Required"),
  storyLeadWho: Yup.string().required("Field Required"),
  fileInput: Yup.mixed().required("File Is Required"),
});

const StoryUpload = ({ onStoryUpload = () => { } }) => {
  const { setStoryUploadApiResponse } = useContext(StoryUploadApiContext);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const apiUrl = API_BASE_PATH + API_ROUTES.UPLOAD_STORY;
      const { storyWorld, leadWho, storyLeadWho, fileInput } = values;
      console.log('form values: ', values);

      // api call
      const formData = new FormData();
      formData.append('file', fileInput);
      formData.append('story_world', storyWorld);
      formData.append('lead_who', leadWho);
      formData.append('story_lead_who', storyLeadWho);

      const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFrYXNoMkBtYWlsaW5hdG9yLmNvbSIsImlkIjoiNjVmZDYzOGFlY2Q5ODllOGFlOWE4MzFhIiwiaWF0IjoxNzE0NjQ5NzE0LCJleHAiOjE3MTQ3MzYxMTR9.17aIl9R8ZghVYAiVWbdwRAPDK7Lo9jxanz3lnt1NlGk";
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.post(apiUrl, formData, config); // post api request
      console.log(response);
      const output = response?.data?.data;

      if(output) {
        const { story_text } = output;
        const respObj = {
          storyWorld: storyWorld,
          leadWho: leadWho,
          storyLeadWho: storyLeadWho,
          storyText: story_text,
        }
        setStoryUploadApiResponse(respObj);
        onStoryUpload(values?.storyWorld, values?.leadWho, fileInput?.name);
      }

    } catch (error) {
      console.error('Error:', error);
      message.error("Something Went Wrong ! Please Try Again After Some Time !");
    }

    setSubmitting(false);

  }

  return (
    <div>
      <section className="mt-6">
        <div className="flex flex-col px-6 py-8 mx-auto lg:py-0">
          <div className="w-full bg-white rounded-lg md:mt-0 sm:max-w-md xl:p-0">
            <p className="text-lg md:text-xl font-medium">Step 1 : <span className="underline">Story Upload</span></p>
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <Formik
                initialValues={{
                  storyWorld: "",
                  leadWho: 'Alice',
                  storyLeadWho: 'Sara',
                  fileInput: null,
                }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ isSubmitting, setFieldValue }) => (
                  <Form className="space-y-4">
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
                        className="bg-gray-50 block w-full md:w-[35vw] p-2 border border-gray-300 text-gray-900 sm:text-md rounded-lg focus:ring-primary-600 focus:border-primary-600 p-2"
                      >
                        <option value="">
                          Please Select
                        </option>
                        <option value="Story_World_1">Story_World_1</option>
                        <option value="Story_World_2">Story_World_2</option>
                        <option value="Story_World_3">Story_World_3</option>
                      </Field>
                      <ErrorMessage
                        name="storyWorld"
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
                        className="bg-gray-50 w-full md:w-[35vw] border p-2 border-gray-300 text-gray-900 sm:text-md rounded-lg focus:ring-primary-600 focus:border-primary-600 block"
                      />
                      <ErrorMessage
                        name="leadWho"
                        component="div"
                        className="text-red-500 text-sm"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="storyLeadWho"
                        className="block mb-2 text-md md:text-lg font-medium text-gray-900"
                      >
                        Story Lead
                      </label>
                      <Field
                        type="text"
                        name="storyLeadWho"
                        id="storyLeadWho"
                        className="bg-gray-50 w-full md:w-[35vw] border p-2 border-gray-300 text-gray-900 sm:text-md rounded-lg focus:ring-primary-600 focus:border-primary-600 block"
                      />
                      <ErrorMessage
                        name="storyLeadWho"
                        component="div"
                        className="text-red-500 text-sm"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="fileInput"
                        className="block mb-2 text-md md:text-lg font-medium text-gray-900"
                      >
                        Select File
                      </label>

                      <input
                        type="file"
                        id="fileInput"
                        name="fileInput"
                        onChange={(event) => {
                          setFieldValue(
                            "fileInput",
                            event.currentTarget.files[0]
                          );
                        }}
                        className="block w-full md:w-[35vw] bg-gray-50 text-gray-900 border border-gray-300 rounded-lg focus:ring-primary-600 focus:border-primary-600 p-0"
                      />
                      <ErrorMessage
                        name="fileInput"
                        component="div"
                        className="text-red-500 text-sm"
                      />
                    </div>

                    <div className="">
                      <button
                        type="submit"
                        className="text-white w-full md:w-[21vw] mt-6 bg-blue-600 hover:bg-blue-400 focus:ring-4 focus:outline-none ring-primary-300 font-medium rounded-lg text-sm px-5 py-3 text-center bg-primary-600 hover:bg-primary-700 focus:ring-primary-800"
                        disabled={isSubmitting}
                      >
                        Upload
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default StoryUpload;