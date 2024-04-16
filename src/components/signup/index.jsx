import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { message } from "antd";
import { API_BASE_PATH, API_ROUTES } from "../../constants/api-endpoints";
import axios from "axios";
import LoadingButton from "../../utils/LoadingButton";

const validationSchema = Yup.object().shape({
  firstName: Yup.string()
    .required("First Name Is Required")
    .min(2, "First Name must be at least 2 characters")
    .max(30, "First Name must be at most 30 characters"),
  lastName: Yup.string().required("Last Name Is Required"),
  email: Yup.string().email("Invalid Email").required("Email Is Required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(RegExp("(.*[a-z].*)"), "At least one lowercase letter")
    .matches(RegExp("(.*[A-Z].*)"), "At least one uppercase letter")
    .matches(RegExp("(.*[0-9].*)"), "At least one number")
    .required("Password Is Required"),
  dob: Yup.date().required("Date of Birth Is Required"),
});

const SignUp = () => {
  const initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    dob: "",
  };

  const navigate = useNavigate();
  const [passwordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleKeyPress = (e) => {
    if (e.which === 13) {
      e.preventDefault();
    }
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const apiUrl = API_BASE_PATH + API_ROUTES.SIGNUP;
      const output = await axios.post(apiUrl, values);
      if (output?.data?.data) {
        message.success("Account Created Successfully!");
        resetForm();
        await new Promise((resolve) => setTimeout(resolve, 2000));
        navigate("/");
      }
    } catch (error) {
      const errorMessage = error?.response?.data?.message;
      if (errorMessage?.toLowerCase() === "eamil already exist!") {
        message.error("Email Already Exists !");
      } else if (errorMessage?.toLowerCase() === "input errors") {
        message.error("Email Is Invalid !");
      }
    }

    setSubmitting(false);
    return;
  };

  return (
    <div className="h-screen bg-green-50">
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
                onSubmit={handleSubmit}
              >
                {({ isSubmitting, resetForm }) => (
                  <Form className="space-y-4 md:space-y-6">
                    <div>
                      <label
                        htmlFor="firstName"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        First Name
                      </label>
                      <Field
                        type="text"
                        name="firstName"
                        id="firstName"
                        placeholder="Enter your first name"
                        onKeyPress={handleKeyPress}
                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      />
                      <ErrorMessage
                        name="firstName"
                        component="div"
                        className="text-red-500 text-sm"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="lastName"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Last Name
                      </label>
                      <Field
                        type="text"
                        name="lastName"
                        id="lastName"
                        placeholder="Enter your last name"
                        onKeyPress={handleKeyPress}
                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      />
                      <ErrorMessage
                        name="lastName"
                        component="div"
                        className="text-red-500 text-sm"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Email
                      </label>
                      <Field
                        type="email"
                        name="email"
                        id="email"
                        placeholder="Enter your email"
                        onKeyPress={handleKeyPress}
                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      />
                      <ErrorMessage
                        name="email"
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
                      <div className="relative">
                        <Field
                          type={passwordVisible ? "text" : "password"}
                          name="password"
                          id="password"
                          placeholder="Enter your password"
                          onKeyPress={handleKeyPress}
                          className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-600 dark:text-gray-400 focus:outline-none"
                          onClick={togglePasswordVisibility}
                        >
                          {!passwordVisible ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="currentColor"
                              viewBox="0 0 16 16"
                            >
                              <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z" />
                              <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0" />
                            </svg>
                          ) : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="currentColor"
                              viewBox="0 0 16 16"
                            >
                              <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7 7 0 0 0-2.79.588l.77.771A6 6 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755q-.247.248-.517.486z" />
                              <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829" />
                              <path d="M3.35 5.47q-.27.24-.518.487A13 13 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7 7 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12z" />
                            </svg>
                          )}
                        </button>
                      </div>
                      <ErrorMessage
                        name="password"
                        component="div"
                        className="text-red-500 text-sm"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="dob"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Date of Birth
                      </label>
                      <Field
                        type="date"
                        name="dob"
                        id="dob"
                        onKeyPress={handleKeyPress}
                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      />
                      <ErrorMessage
                        name="dob"
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
                      {!isSubmitting ? (
                        <button
                          type="submit"
                          className="text-white bg-blue-600 hover:bg-blue-400 focus:ring-4 focus:outline-none ring-primary-300 font-medium rounded-lg text-sm px-5 py-3 text-center bg-primary-600 hover:bg-primary-700 focus:ring-primary-800"
                          disabled={isSubmitting}
                        >
                          Sign Up
                        </button>
                      ) : (
                        <LoadingButton title={"Loading..."} />
                      )}
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
