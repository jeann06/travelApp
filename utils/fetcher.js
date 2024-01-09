import axios from "axios";
import * as AxiosLogger from "axios-logger";

const fetcher = axios.create({
  baseURL: "http://localhost:8080",
});

fetcher.interceptors.request.use(
  AxiosLogger.requestLogger,
  AxiosLogger.errorLogger
);

export default fetcher;
