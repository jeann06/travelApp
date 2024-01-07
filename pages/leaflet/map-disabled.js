import { Container } from "reactstrap";
import dynamic from "next/dynamic";
import { Form, Formik } from "formik";

const MapWithNoSSR = dynamic(() => import("../../components/Maps/Map"), {
  ssr: false,
});

const MapDisabledPage = () => {
  return (
    <Container className="pb-5">
      <div className="py-4">
        <h2 className="fw-bold">Leaflet Map Disabled</h2>
        <p>Below is an example of using leaflet map where it is disabled</p>
      </div>

      <Formik
        initialValues={{
          longitude: 1.2825,
          latitude: 120.8203,
        }}
      >
        {(formik) => (
          <Form>
            <div className="card mb-1">
              <div className="card-body">
                <pre className="">
                  <code>{JSON.stringify(formik.values, null, 2)}</code>
                </pre>
              </div>
            </div>
            <div className="row">
              <div className="col-md-12">
                <div
                  id="map"
                  style={{
                    height: 600,
                  }}
                >
                  <MapWithNoSSR
                    position={[
                      formik.values.longitude || 0,
                      formik.values.latitude || 0,
                    ]}
                    zoom={14}
                    onClickMap={(latLng) => {
                      formik.setFieldValue("longitude", latLng.lng);
                      formik.setFieldValue("latitude", latLng.lat);
                    }}
                    isDisabled={true}
                  />
                </div>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </Container>
  );
};

export default MapDisabledPage;
