import { FormikConsumer } from "formik";

export const DebugFormik = () => {
  return (
    <div
      style={{
        margin: "3rem 0",
        borderRadius: 4,
        background: "#f6f8fa",

        boxShadow: "0 0 1px  #eee inset",
      }}
    >
      <div
        style={{
          textTransform: "uppercase",
          fontSize: 11,
          borderTopLeftRadius: 4,
          borderTopRightRadius: 4,
          fontWeight: 500,
          padding: ".5rem",
          background: "#555",
          color: "#fff",
          letterSpacing: "1px",
        }}
      >
        Formik State
      </div>
      <FormikConsumer>
        {({ validationSchema, validate, onSubmit, ...rest }) => (
          <div>
            {console.log(rest, "FORMIK VALUES")}
            <h1>Check console log</h1>
          </div>
        )}
      </FormikConsumer>
    </div>
  );
};
