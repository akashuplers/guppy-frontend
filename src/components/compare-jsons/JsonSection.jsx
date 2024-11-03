import React from "react";
import { Formik, Form, Field } from "formik";
import { Button, Form as AntForm, message } from "antd";
import * as Yup from "yup";
import { Select } from "antd";
import FormikSelect from "../../utils/FormikSelect";
import JsonBody from "./JsonBody";
import { jsonData } from "./jsonData";
const { Option } = Select;

// Validation schema using Yup
// const validationSchema = Yup.object().shape({
//     story: Yup.string(),
//     storyWorld: Yup.string(),
//     jsonVersion: Yup.string(),
//   }).test('oneOfRequired', 'At least one of the fields is required', function (value) {
//     const { story, storyWorld, jsonVersion } = value;
//     return !!story || !!storyWorld || !!jsonVersion;
// });

const getValidationSchema = (isLeftScreen) =>
  Yup.object().shape({
    story: isLeftScreen ? Yup.string().required("Story is required") : Yup.string(),
    storyWorld: isLeftScreen ? Yup.string().required("Story World is required") : Yup.string(),
    jsonVersion1: Yup.string().required("Json Version is required"),
  });

const JsonSection = ({isLeftScreen}) => {
  return (
    <div className="ps-8 mr-4">
      {/* filter section */}
      <Formik
        initialValues={{
          story: "",
          storyWorld: "",
          jsonVersion1: "",
        }}
        validationSchema={getValidationSchema(isLeftScreen)}
        onSubmit={(values) => {
          console.log("Form submitted:", values);
          if (!values) {
            message.error("required");
            return;
          }
        }}
      >
        {({ errors, touched }) => (
          <Form className="mt-4">
            <div className="flex flex-col md:flex-row gap-2 md:gap-8">
            {isLeftScreen && 
              <><div>
                  <p className="mb-1">Story</p>
                  <AntForm.Item
                    validateStatus={touched.story && errors.story ? "error" : ""}
                    help={touched.story && errors.story ? errors.story : null}
                  >
                    <Field style={{ width: 200 }} name="story" as={FormikSelect}>
                      <Option value="option1">Story 1</Option>
                      <Option value="option2">Story 2</Option>
                      <Option value="option3">Story 3</Option>
                    </Field>
                  </AntForm.Item>
                </div><div>
                    <p className="mb-1">Story World</p>
                    <AntForm.Item
                      validateStatus={touched.storyWorld && errors.storyWorld ? "error" : ""}
                      help={touched.storyWorld && errors.storyWorld
                        ? errors.storyWorld
                        : null}
                    >
                      <Field
                        style={{ width: 200 }}
                        name="storyWorld"
                        as={FormikSelect}
                      >
                        <Option value="option1">Story World 1</Option>
                        <Option value="option2">Story World 2</Option>
                        <Option value="option3">Story World 3</Option>
                      </Field>
                    </AntForm.Item>
                  </div></>
            }

            </div>
            <div className="flex flex-col md:flex-row gap-2 md:gap-8">
              <div>
                <p className="mb-1">Json Version</p>
                <AntForm.Item
                  validateStatus={
                    touched.jsonVersion1 && errors.jsonVersion1 ? "error" : ""
                  }
                  help={
                    touched.jsonVersion1 && errors.jsonVersion1
                      ? errors.jsonVersion1
                      : null
                  }
                >
                  <Field
                    style={{ width: 200 }}
                    name="jsonVersion1"
                    as={FormikSelect}
                  >
                    <Option value="option1">Json Version 1</Option>
                    <Option value="option2">Json Version 2</Option>
                    <Option value="option3">Json Version 3</Option>
                  </Field>
                </AntForm.Item>
                </div>  
                {
                isLeftScreen &&
                  <AntForm.Item>
                    <button type="submit"
                        className="text-white md:w-[10vw] px-5 py-3 mt-5 bg-blue-600 hover:bg-blue-400 focus:ring-4 focus:outline-none ring-primary-300 font-medium rounded-lg text-sm text-center bg-primary-600 hover:bg-primary-700 focus:ring-primary-800"
                        >
                      Display Json
                    </button>
                  </AntForm.Item>
                }
              </div>

          </Form>
        )}
      </Formik>

      {/* json body */}
      <JsonBody data={jsonData} />
    </div>
  );
};

export default JsonSection;
