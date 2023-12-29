import { errorAlertNotification } from "components/notification";
import { useFormik } from "formik";
import { uploadSingleFiles } from "helpers/shared";
import {
  Button,
  CustomInput,
  Form,
  FormFeedback,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Spinner,
} from "reactstrap";
import * as yup from "yup";

function FileUploadModal({ show, onHide: onModalHide, onFileUpload }) {
  const formId = "file-popup-modal-form";
  const formik = useFormik({
    initialValues: {
      file: null,
      fileName: "",
      notes: "",
    },
    validationSchema: yup.object({
      file: yup.mixed().required("Harus diisi"),
      notes: yup.string().required("Harus diisi"),
    }),
    onSubmit: async (values) => {
      if (values.file) {
        const formData = new FormData();
        formData.append("file", values.file);

        try {
          const response = await uploadSingleFiles(formData, "KecelakaanKerja");

          if (response.status >= 200 || response.status <= 302) {
            onFileUpload(
              response?.data?.id,
              values.notes,
              response?.data?.fileName
            );
          } else {
            errorAlertNotification("Error", "Something went wrong");
          }
        } catch (error) {
          errorAlertNotification(
            "Error",
            error?.response || "Something went wrong"
          );
          console.error("File upload failed:", error);
        }

        formik.resetForm();
        onHide();
      }
    },
  });

  const handleFileChange = (ev) => {
    if (ev.target.files[0]) {
      formik.setFieldValue("file", ev.target.files[0]);
      formik.setFieldValue("fileName", ev.target.files[0].name);
    } else {
      formik.setFieldValue("file", null);
      formik.setFieldValue("fileName", "");
    }
  };

  const onHide = () => {
    formik.resetForm();
    onModalHide();
  };

  return (
    <Modal isOpen={show} toggle={onHide}>
      <ModalHeader toggle={onHide}>Upload File</ModalHeader>
      <ModalBody>
        <Form id={formId} onSubmit={formik.handleSubmit}>
          <FormGroup>
            <Label for="custom-file">Choose File</Label>
            <CustomInput
              type="file"
              id="custom-file"
              onChange={handleFileChange}
              invalid={formik.errors.file && formik.touched.file}
            />
            {formik.errors.file && formik.touched.file && (
              <FormFeedback className="d-block">
                {formik.errors.file}
              </FormFeedback>
            )}
          </FormGroup>
          <FormGroup>
            <Label for="notes">Notes</Label>
            <Input
              type="text"
              id="notes"
              value={formik.values.notes}
              onChange={formik.handleChange}
              invalid={formik.errors.notes && formik.touched.notes}
            />
            <FormFeedback>{formik.errors.notes}</FormFeedback>
          </FormGroup>
          <FormGroup>
            <Label for="fileName">File Name</Label>
            <Input
              type="text"
              id="fileName"
              value={formik.values.fileName}
              disabled
            />
          </FormGroup>
        </Form>
      </ModalBody>
      <ModalFooter>
        {formik.isSubmitting ? (
          <Spinner size="sm" color="light" />
        ) : (
          <>
            <Button color="danger" onClick={onHide}>
              Close
            </Button>
            <Button
              form={formId}
              color="primary"
              type="submit"
              data-test-id="file-upload-submit-button"
            >
              Upload
            </Button>
          </>
        )}
      </ModalFooter>
    </Modal>
  );
}

export default FileUploadModal;
