import axios, { AxiosResponse } from "axios";

const request = (() => {
  const authentication = localStorage.getItem("authentication");
  const accessToken =
    authentication && JSON.parse(authentication)?.accessToken
      ? JSON.parse(authentication).accessToken
      : null;

  const Axios = axios;

  Axios.interceptors.response.use(
    (response: AxiosResponse<any>) => {
      return response;
    },
    (error) => {
      if (error.status === 401) {
        alert("Sesi anda telah habis, silahkan login kembali");
        localStorage.removeItem("authentication");
      }
    }
  );

  return accessToken
    ? Axios.create({
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
    : Axios;
})();

export { request };
