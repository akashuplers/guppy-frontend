import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE_PATH, API_ROUTES } from "../../constants/api-endpoints";
import axios from "axios";
import { message } from "antd";
import LoadingButton from "../../utils/LoadingButton";
import Footer from "../../utils/Footer";

const validationSchema = Yup.object().shape({
  email: Yup.string().required("Username Is Required"),
  password: Yup.string().required("Password Is Required"),
});

const Login = () => {
  const initialValues = {
    email: "",
    password: "",
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
      const apiUrl = API_BASE_PATH + API_ROUTES.LOGIN;
      const output = await axios.post(apiUrl, values);
      const respObj = output?.data?.data;
      if (respObj) {
        const { accessToken, email } = respObj;
        localStorage.setItem("accessToken", JSON.stringify(accessToken));
        localStorage.setItem("email", JSON.stringify(email));
        message.success("Login Successful !");
        navigate("/home");
      }
    } catch (error) {
      console.log("error: ", error);
      const errorMessage = error?.response?.data?.message;
      if (errorMessage?.toLowerCase() === "incorrect credentials") {
        message.error("Incorrect Credentials !");
      } else if (
        errorMessage?.toLowerCase().includes("could not find account")
      ) {
        message.error(errorMessage);
      } else {
        message.error(
          "Something Went Wrong ! Please Try Again After Some Time !"
        );
      }
    }

    setSubmitting(false);
  };

  return (
    <div style={{ backgroundImage: "url(../cover-pattern.jpg)" }} className="bg-cover relative bg-center h-screen">
      <div className="flex flex-col md:flex-row items-center justify-center">

        {/* left side: image */}
        <div className="mt-2 md:mt-0">
          <img className="h-[35vh] md:h-[70vh] w-[70vw] md:w-[30vw]" src="../guppy-bg-2.jpg" alt="guppy-bg" />
        </div>

        {/* right-side: login form */}
        <div>
          <section>
            <div className="flex flex-col items-center justify-center mx-auto md:h-screen lg:py-0">
              <div className="h-[58vh] md:h-[70vh] w-[70vw] md:[30vw] bg-violet-100 border-2 border-indigo-500 md:mt-0 sm:max-w-md xl:p-0">
                <div className="px-5 mt-3 md:mt-0 md:space-y-6 md:p-8">
                  <h1 className="text-xl mb-2 font-bold text-center leading-tight tracking-tight text-violet-500 md:text-2xl">
                    LOGIN
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
                            htmlFor="email"
                            className="block mb-1 md:mb-2 text-sm md:text-lg font-medium text-gray-900"
                          >
                            Username
                          </label>
                          <Field
                            type="text"
                            name="email"
                            id="email"
                            placeholder="Enter your username"
                            onKeyPress={handleKeyPress}
                            className="p-1 md:p-4 bg-gray-50 border border-violet-300 text-gray-900 text-sm md:text-lg rounded-lg md:focus:border-2 focus:border-violet-500 block w-full focus:outline-none"
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
                            className="block mb-1 md:mb-2 text-sm md:text-lg font-medium text-gray-900"
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
                              className="bg-gray-50 p-1 md:p-4 border border-violet-300 text-gray-900 text-sm md:text-lg rounded-lg md:focus:border-2 focus:border-violet-500 block w-full focus:outline-none"
                            />
                            <button
                              type="button"
                              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-600 focus:outline-none"
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

                        <div className="flex items-start">
                          <div className="flex items-center h-5">
                            <input id="remember" type="checkbox" value="" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300" />
                          </div>
                          <label htmlFor="remember" className="ms-2 text-sm font-medium text-gray-700">Remember Me</label>
                        </div>
                        {/* buttons */}
                        <div>
                          {/* <button
                            type="reset"
                            className="text-white mr-6 w-full bg-gray-400 hover:bg-gray-700 focus:ring-4 focus:outline-none ring-primary-300 font-medium rounded-lg text-sm px-5 py-3 text-center bg-primary-600 hover:bg-primary-700 focus:ring-primary-800"
                            disabled={isSubmitting}
                            onClick={() => resetForm()}
                          >
                            Reset
                          </button> */}
                          {!isSubmitting ? (
                            <button
                              type="submit"
                              style={{ backgroundImage: 'linear-gradient(to right, violet, rgb(55, 55, 243))' }}
                              className="text-white mt-2 w-full bg-blue-600 hover:bg-blue-400 focus:ring-4 focus:outline-none ring-primary-300 font-medium rounded-lg text-sm px-5 py-1 md:py-3 text-center bg-primary-600 hover:bg-primary-700 focus:ring-primary-800"
                              disabled={isSubmitting}
                            >
                              <span className="md:text-lg">Sign In</span>
                            </button>
                          ) : (
                            <LoadingButton title={"Loading..."} />
                          )}
                        </div>

                        <p className="mt-2 text-sm text-center">
                          New User ?{" "}
                          <Link className="text-blue-600" to="/signup">
                            <u>Create new account</u>
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
      </div>

      {/* footer */}
      <Footer />
    </div>
  );
};

export default Login;
