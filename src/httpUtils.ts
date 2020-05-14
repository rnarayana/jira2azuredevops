import axios from "axios";

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  function (error) {
    if (error.response.status !== 200) {
      console.log(
        `Error invoking ${error.config.method} ${
          error.config.url
        } : ${JSON.stringify(error.response.data.errorMessages)}`
      );
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
    console.log("Error");
  }
}

async function httpPost(url: string, header: any, requestBody: any) {
  try {
    const response = await axios.post(url, requestBody, { headers: header });
    return response.data;
  } catch (err) {
    console.log("Error");
  }
}

async function httpPatch(url: string, header: any, requestBody: any) {
  try {
    const response = await axios.patch(url, requestBody, { headers: header });
    return response.data;
  } catch (err) {
    console.log("Error");
  }
}

export { httpGet, httpPost, httpPatch };
