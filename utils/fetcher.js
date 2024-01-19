import axios from "axios";
import * as AxiosLogger from "axios-logger";

const fetcher = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

fetcher.interceptors.request.use(
  AxiosLogger.requestLogger,
  AxiosLogger.errorLogger
);

export default fetcher;
