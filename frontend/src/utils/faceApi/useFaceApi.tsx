import * as faceapi from 'face-api.js';

export interface FaceApiReturn {
    message: string;
    code: "NO_FACE" | "LESS_SIMILARITY" | "ACCEPTED",
    data?: {
        distance: number;
        similarity: number;
    }
}

export default function useFaceApi() {
    const compare = async (
        firstImage: faceapi.TNetInput,
        secondImage: faceapi.TNetInput,
        callback: ({ message, code, data }: FaceApiReturn) => void
    ) => {
        await faceapi.nets.ssdMobilenetv1.loadFromUri('/models');
        await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
        await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
        await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
        await faceapi.nets.faceExpressionNet.loadFromUri('/models');

        // detect a single face from the ID card image
        const idCardFacedetection = await faceapi.detectSingleFace(firstImage,
            new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks().withFaceDescriptor();

        // detect a single face from the selfie image
        const selfieFacedetection = await faceapi.detectSingleFace(secondImage,
            new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks().withFaceDescriptor();

        if (idCardFacedetection && selfieFacedetection) {

            // Using Euclidean distance to comapare face descriptions
            const distance = faceapi.euclideanDistance(idCardFacedetection.descriptor, selfieFacedetection.descriptor);
            if (!!distance && distance > -1) {
                const similarity = 100 - (distance * 100)
                if (distance > 0.6) {
                    callback({
                        message: `Hasil Kemiripan: ${Math.round(similarity)}%, mohon lakukan pengajuan absensi agar dapat ditinjau oleh HR`,
                        code: "LESS_SIMILARITY",
                        data: { distance, similarity }
                    })
                } else {
                    callback({
                        message: "Berhasil",
                        code: "ACCEPTED",
                        data: { distance, similarity }
                    });
                }
                console.log({ distance: distance, similarity: 100 - (distance * 100) })
            }
        } else {
            callback({
                message: "Sistem Tidak dapat mendeteksi wajah, pastikan wajah anda terlihat kamera",
                code: "NO_FACE"
            })
        }
    }

    return compare

}