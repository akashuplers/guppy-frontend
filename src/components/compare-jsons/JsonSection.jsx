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

const validationSchema = Yup.object().shape({
  story: Yup.string(),
  storyWorld: Yup.string(),
  jsonVersion: Yup.string(),
});

const JsonSection = () => {
  return (
    <div className="ps-8">
      {/* filter section */}
      <Formik
        initialValues={{
          story: "",
          storyWorld: "",
          jsonVersion: "",
        }}
        validationSchema={validationSchema}
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
              <div>
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
              </div>

              <div>
                <p className="mb-1">Story World</p>
                <AntForm.Item
                  validateStatus={
                    touched.storyWorld && errors.storyWorld ? "error" : ""
                  }
                  help={
                    touched.storyWorld && errors.storyWorld
                      ? errors.storyWorld
                      : null
                  }
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
              </div>

              <div>
                <p className="mb-1">Json Version</p>
                <AntForm.Item
                  validateStatus={
                    touched.jsonVersion && errors.jsonVersion ? "error" : ""
                  }
                  help={
                    touched.jsonVersion && errors.jsonVersion
                      ? errors.jsonVersion
                      : null
                  }
                >
                  <Field
                    style={{ width: 200 }}
                    name="jsonVersion"
                    as={FormikSelect}
                  >
                    <Option value="option1">Json Version 1</Option>
                    <Option value="option2">Json Version 2</Option>
                    <Option value="option3">Json Version 3</Option>
                  </Field>
                </AntForm.Item>
              </div>
            </div>
            <AntForm.Item>
              <Button
                type="primary"
                className="bg-blue-50 border-blue-500 text-blue-500"
              >
                Display Json
              </Button>
            </AntForm.Item>
          </Form>
        )}
      </Formik>

      {/* json body */}
      <JsonBody data={jsonData} />
    </div>
  );
};

export default JsonSection;
