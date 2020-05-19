import axios from "axios";
import axiosRetry from "axios-retry";
import { Logger } from "./utils";

axiosRetry(axios, { retries: 10, retryDelay: axiosRetry.exponentialDelay });

async function httpGet(
  url: string,
  header: any,
  params: any = null
): Promise<any> {
  try {
    const response = await axios.get(url, {
      headers: header,
      params: params,
      timeout: 60_000,
    });
    return response.data;
  } catch (err) {
    Logger.error(`Error invoking GET ${url}`);
    Logger.error(err.response?.data ?? err);
    throw err;
  }
}

async function httpPost(url: string, header: any, requestBody: any) {
  try {
    const response = await axios.post(url, requestBody, {
      headers: header,
      timeout: 60_000,
    });
    return response.data;
  } catch (err) {
    Logger.error(`Error invoking POST ${url}`);
    Logger.error(err.response?.data ?? err);
    throw err;
  }
}

async function httpPatch(url: string, header: any, requestBody: any) {
  try {
    const response = await axios.patch(url, requestBody, {
      headers: header,
      timeout: 60_000,
    });
    return response.data;
  } catch (err) {
    Logger.error(`Error invoking PATCH ${url}`);
    Logger.error(err.response?.data ?? err);
    throw err;
  }
}

export { httpGet, httpPost, httpPatch };
