import AppBar from "@/components/AppBar";
import "bootstrap/dist/css/bootstrap.min.css";
import { SessionProvider } from "next-auth/react";
import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css";
import "react-datepicker/dist/react-datepicker.css";

import "@/styles/globals.css";

const App = ({ Component, pageProps: { session, ...pageProps } }) => {
  return (
    <SessionProvider session={session}>
      <AppBar />
      <div className="">
        <Component {...pageProps} />
      </div>
    </SessionProvider>
  );
};

export default App;
