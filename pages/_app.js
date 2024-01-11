import AppBar from "@/components/AppBar";
import "bootstrap/dist/css/bootstrap.min.css";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-geosearch/dist/geosearch.css";
import { SessionProvider } from "next-auth/react";
import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css";
import "react-datepicker/dist/react-datepicker.css";
import "yet-another-react-lightbox/styles.css";
import "@/styles/globals.css";

const App = ({ Component, pageProps: { session, ...pageProps } }) => {
  return (
    <SessionProvider session={session}>
      <div
        className=""
        style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
      >
        <AppBar />
        <Component {...pageProps} />
      </div>
    </SessionProvider>
  );
};

export default App;
