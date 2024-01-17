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
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";

const queryClient = new QueryClient();
const App = ({ Component, pageProps: { session, ...pageProps } }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider session={session}>
        <div
          className=""
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <AppBar />
          <Component {...pageProps} />
        </div>
        <ReactQueryDevtools />
      </SessionProvider>
    </QueryClientProvider>
  );
};

export default App;
