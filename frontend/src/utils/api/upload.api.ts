import { AxiosError } from "axios";

import { request } from "../axiosInstance";
import { ImageUpload } from "../models/imageUpload.model";

export interface UploadAttendancePayload {
    image: string,
}

function DataURIToBlob(dataURI: string) {
    const splitDataURI = dataURI.split(',')
    const byteString = splitDataURI[0].indexOf('base64') >= 0 ? atob(splitDataURI[1]) : decodeURI(splitDataURI[1])
    const mimeString = splitDataURI[0].split(':')[1].split(';')[0]

    const ia = new Uint8Array(byteString.length)
    for (let i = 0; i < byteString.length; i++)
        ia[i] = byteString.charCodeAt(i)

    return new Blob([ia], { type: mimeString })
}

export const uploadAttendance = async (payload: UploadAttendancePayload) => {
    try {
        const file = DataURIToBlob(payload.image)
        const form = new FormData();
        form.append('image', file, Date.now().toString() + '.jpg')

        const response = await request.post<ImageUpload>(
            `${process.env.REACT_APP_BASE_API}/upload/attendance`,
            form
        );
        return response.data;
    } catch (e) {
        const error = e as AxiosError;
        throw error.response?.data;
    }
};