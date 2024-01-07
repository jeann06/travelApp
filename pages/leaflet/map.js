import { Container } from "reactstrap";
import dynamic from "next/dynamic";
import { Form, Formik } from "formik";

const MapWithNoSSR = dynamic(() => import("../../components/Maps/Map"), {
  ssr: false,
});

const MapPage = () => {
  return (
    <Container>
      <div className="py-4">
        <h2 className="fw-bold">Leaflet Map</h2>
        <p>Below is an example of using leaflet map</p>
      </div>

      <Formik
        initialValues={{
          longitude: 1.2825,
          latitude: 120.8203,
          label: "",
        }}
      >
        {(formik) => (
          <Form>
            <div className="row">
              <div className="col-md-6">
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
                    onShowLocation={(location) => {
                      console.log(location, "RAW LOCATION");
                      formik.setFieldValue("longitude", location.x);
                      formik.setFieldValue("latitude", location.y);
                      formik.setFieldValue("label", location.label);
                    }}
                    onRemoveLayer={(e) => {
                      formik.setFieldValue("longitude", null);
                      formik.setFieldValue("latitude", null);
                      formik.setFieldValue("label", null);
                    }}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <p>
                  How to use this:
                  <br />
                  1. Input search term pada input dikiri (yang di atas map)
                  <br />
                  2. Formik will listen to the location and get the x and y
                  <br />
                  3. Jika input di clear (tekan "x" pada input) maka formik akan
                  reset value menjadi null
                </p>

                <div className="card">
                  <div className="card-body">
                    <pre className="">
                      <code>{JSON.stringify(formik.values, null, 2)}</code>
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </Container>
  );
};

export default MapPage;
