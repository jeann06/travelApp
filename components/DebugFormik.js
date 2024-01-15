import { FormikConsumer } from "formik";
import { useState } from "react";
import { Button } from "reactstrap";

const FormikStatePrint = () => (
  <div
    className="card shadow-lg"
    style={{
      overflowY: "auto",
      overflowX: "auto",
      maxHeight: "400px",
    }}
  >
    <div className="card-body">
      <h3 className="card-title">Formik State</h3>
      <hr />
      <FormikConsumer>
        {({ validationSchema, validate, onSubmit, ...rest }) => (
          <pre suppressHydrationWarning>{JSON.stringify(rest, null, 2)}</pre>
        )}
      </FormikConsumer>
    </div>
  </div>
);

export const DebugFormik = () => {
  const [show, setShow] = useState(false);

  if (process.env.NODE_ENV !== "development") return null;

  return (
    <div className="fixed-bottom position-fixed start-0 p-2">
      {show && <FormikStatePrint />}

      <Button
        color={show ? "danger" : "warning"}
        className="mt-2"
        onClick={() => setShow(!show)}
      >
        {show ? "Close" : "Open"} Debug Formik
      </Button>
    </div>
  );
};
