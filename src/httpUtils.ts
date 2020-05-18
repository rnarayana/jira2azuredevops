import axios from "axios";
import { logger } from "./utils";

axios.interceptors.response.use(
  (response) => response,
  function (error) {
    if (error.response.status !== 200) {
      logger.error(`${error.response.data.message}`);
      logger.error(`${JSON.stringify(error.response.data.errorMessages)}`);
    }
    return Promise.reject(error.response);
  }
);

async function httpGet(
  url: string,
  header: any,
  params: any = null
): Promise<any> {
  try {
    const response = await axios.get(url, {
      headers: header,
      params: params,
    });
    return response.data;
  } catch (err) {
    logger.error(`Error invoking GET ${url}`);
  }
}

async function httpPost(url: string, header: any, requestBody: any) {
  try {
    const response = await axios.post(url, requestBody, { headers: header });
    return response.data;
  } catch (err) {
    logger.error(`Error invoking POST ${url}`);
  }
}

async function httpPatch(url: string, header: any, requestBody: any) {
  try {
    const response = await axios.patch(url, requestBody, { headers: header });
    return response.data;
  } catch (err) {
    logger.error(`Error invoking PATCH ${url}`);
  }
}

export { httpGet, httpPost, httpPatch };
