import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { message } from "antd";

const validationSchema = Yup.object().shape({
  username: Yup.string().required("Username Is Required"),
  password: Yup.string().required("Password Is Required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords Must Match")
    .required("Confirm Password Is Required"),
});

const SignUp = () => {
  const initialValues = {
    username: "",
    password: "",
    confirmPassword: "",
  };

  const navigate = useNavigate();

  return (
    <div className="h-screen bg-gray-50">
      <section className="dark:bg-gray-900">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold text-center leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Create Your Account
              </h1>
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={async (values, { setSubmitting }) => {
                  console.log("sign up credentials: ", values);
                  message.success('Account Created Successfully!');
                  await new Promise((resolve) => setTimeout(resolve, 2000));
                  navigate('/');
                  setSubmitting(false);
                }}
              >
                {({ isSubmitting, resetForm }) => (
                  <Form className="space-y-4 md:space-y-6">
                    <div>
                      <label
                        htmlFor="username"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Username
                      </label>
                      <Field
                        type="text"
                        name="username"
                        id="username"
                        placeholder="Enter your username"
                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      />
                      <ErrorMessage
                        name="username"
                        component="div"
                        className="text-red-500 text-sm"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="password"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Password
                      </label>
                      <Field
                        type="password"
                        name="password"
                        id="password"
                        placeholder="Enter your password"
                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      />
                      <ErrorMessage
                        name="password"
                        component="div"
                        className="text-red-500 text-sm"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="confirmPassword"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Confirm Password
                      </label>
                      <Field
                        type="password"
                        name="confirmPassword"
                        id="confirmPassword"
                        placeholder="Confirm your password"
                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      />
                      <ErrorMessage
                        name="confirmPassword"
                        component="div"
                        className="text-red-500 text-sm"
                      />
                    </div>
                    {/* buttons */}
                    <div className="flex justify-center">
                      <button
                        type="reset"
                        className="text-white mr-6 bg-gray-400 hover:bg-gray-700 focus:ring-4 focus:outline-none ring-primary-300 font-medium rounded-lg text-sm px-5 py-3 text-center bg-primary-600 hover:bg-primary-700 focus:ring-primary-800"
                        disabled={isSubmitting}
                        onClick={() => resetForm()}
                      >
                        Reset
                      </button>
                      <button
                        type="submit"
                        className="text-white bg-blue-600 hover:bg-blue-400 focus:ring-4 focus:outline-none ring-primary-300 font-medium rounded-lg text-sm px-5 py-3 text-center bg-primary-600 hover:bg-primary-700 focus:ring-primary-800"
                        disabled={isSubmitting}
                      >
                        Sign Up
                      </button>
                    </div>
                    <p className="mt-2 text-sm text-center">
                      Already have an account?{" "}
                      <Link className="text-blue-600" to="/">
                        <u>Sign In</u>
                      </Link>
                    </p>
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

export default SignUp;
