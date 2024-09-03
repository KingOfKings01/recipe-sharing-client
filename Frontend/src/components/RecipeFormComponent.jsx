import { Formik, Form, Field, ErrorMessage } from 'formik';
import PropTypes from 'prop-types';

function FormComponent({ initialValues, validationSchema, onSubmit, fields, buttonLabel }) {
  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
      {({ setFieldValue }) => (
        <Form className='form-content'>
          {fields.map((field, index) => (
            <div className="form-controller" key={index}>
              <label>
                {field.type === 'file' ? (
                  <input
                    type="file"
                    name={field.name}
                    onChange={(event) => setFieldValue(field.name, event.currentTarget.files[0])}
                  />
                ) : field.type === 'select' ? (
                  <Field as="select" name={field.name}>
                    <option value="" label={`Select ${field.placeholder}`} />
                    {field.options.map((option, idx) => (
                      <option key={idx} value={option}>
                        {option}
                      </option>
                    ))}
                  </Field>
                ) : (
                  <Field
                    type={field.type}
                    name={field.name}
                    placeholder={field.placeholder}
                  />
                )}
                <ErrorMessage name={field.name} component="div" className="error" />
              </label>
            </div>
          ))}
          <button type="submit">{buttonLabel}</button>
        </Form>
      )}
    </Formik>
  );
}

FormComponent.propTypes = {
  initialValues: PropTypes.object.isRequired,
  validationSchema: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      placeholder: PropTypes.string,
      options: PropTypes.array, // Added for select fields
    })
  ).isRequired,
  buttonLabel: PropTypes.string.isRequired,
};

export default FormComponent;
