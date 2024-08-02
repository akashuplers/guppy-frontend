import React from 'react';
import { useField, useFormikContext } from 'formik';
import { Select } from 'antd';

const FormikSelect = ({ name, ...props }) => {
  const [field, meta] = useField(name);
  const { setFieldValue, setFieldTouched } = useFormikContext();

  return (
    <Select
      {...field}
      {...props}
      placeholder="Select an option"
      showSearch
      value={field.value}
      onChange={(value) => setFieldValue(name, value)}
      onBlur={() => setFieldTouched(name, true)}
    >
      {props.children}
    </Select>
  );
};

export default FormikSelect;