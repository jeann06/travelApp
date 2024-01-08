import { Container } from "reactstrap";
import dynamic from "next/dynamic";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";

const MapWithNoSSR = dynamic(() => import("../../components/Maps/Map"), {
  ssr: false,
});

const MapPage = () => {
  const [userLocation, setUserLocation] = useState(null);
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([
            position.coords.latitude,
            position.coords.longitude,
          ]);
        },
        (error) => {
          console.error("Error getting user location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by your browser");
    }
  }, []);

  console.log(userLocation, "USER LOCATION!");

  return (
    <Container>
      <div className="py-4">
        <h2 className="fw-bold">Leaflet Map</h2>
        <p>My coordinates: {userLocation}</p>
      </div>

      <Formik
        initialValues={{
          longitude: 1.2825,
          latitude: 120.8203,
        }}
      >
        {(formik) => (
          <Form>
            <div className="row">
              <div className="col-md-6">
                <div
                  id="map"
                  style={{
                    height: 300,
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
