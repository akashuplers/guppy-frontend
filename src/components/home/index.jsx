import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";

const validationSchema = Yup.object().shape({
  storyWorld: Yup.string().required("Please Select An Option"),
  leadWho: Yup.string().required("Field Required"),
  fileInput: Yup.mixed().required("File Is Required"),
});

const Home = () => {
  const navigate = useNavigate();

  const handleSignOut = () => {
    navigate("/");
  };

  return (
    <div className="bg-gray-50 h-screen">
      {/* head */}
      <div className="flex justify-between px-2 md:px-8 mb-4 md:mb-8 items-center">
        <button
          className="text-white mt-6 bg-gray-400 hover:bg-gray-500 focus:ring-4 focus:outline-none ring-primary-300 font-medium rounded-lg text-sm px-5 py-3 text-center focus:ring-primary-800"
          onClick={handleSignOut}
        >
          Sign Out
        </button>
        <button className="text-white mt-6 bg-red-500 hover:bg-red-300 focus:ring-4 focus:outline-none ring-danger-300 font-medium rounded-lg text-sm px-5 py-3 text-center focus:ring-primary-800">
          All Stories
        </button>
      </div>

      {/* body */}
      <section className="dark:bg-gray-900">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto lg:py-0">
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <Formik
                initialValues={{
                  storyWorld: "",
                  leadWho: "",
                  fileInput: null,
                }}
                validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting }) => {
                  console.log("Form values:", values);
                  setSubmitting(false);
                }}
              >
                {({ isSubmitting, setFieldValue }) => (
                  <Form className="space-y-4">
                    <div>
                      <label
                        htmlFor="storyWorld"
                        className="block mb-2 text-lg font-medium text-gray-900"
                      >
                        Story World
                      </label>
                      <Field
                        as="select"
                        name="storyWorld"
                        id="storyWorld"
                        className="bg-gray-50 block w-full px-2 py-4 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      >
                        <option value="">
                          Please Select
                        </option>
                        <option value="option1">Story_World_1</option>
                        <option value="option2">Story_World_2</option>
                        <option value="option3">Story_World_2</option>
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
                        className="block mb-2 text-lg font-medium text-gray-900"
                      >
                        Lead WHO
                      </label>
                      <Field
                        type="text"
                        name="leadWho"
                        id="leadWho"
                        className="bg-gray-50 border p-3 border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      />
                      <ErrorMessage
                        name="leadWho"
                        component="div"
                        className="text-red-500 text-sm"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="fileInput"
                        className="block mb-2 text-lg font-medium text-gray-900"
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
                        className="bg-gray-50 p-3 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      />
                      <ErrorMessage
                        name="fileInput"
                        component="div"
                        className="text-red-500 text-sm"
                      />
                    </div>

                    <div className="text-center">
                      <button
                        type="submit"
                        className="text-white mt-6 bg-blue-600 hover:bg-blue-400 focus:ring-4 focus:outline-none ring-primary-300 font-medium rounded-lg text-sm px-5 py-3 text-center bg-primary-600 hover:bg-primary-700 focus:ring-primary-800"
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

export default Home;
