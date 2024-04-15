import { CalendarMonth, CameraAltOutlined, Check, ErrorOutline, InfoOutlined, LockClock, Warning } from "@mui/icons-material";
import { Alert, Button, Card, CardContent, Chip, CircularProgress, Divider, IconButton, Modal, ModalClose, ModalDialog, Sheet, Stack, Typography } from "@mui/joy";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TNetInput } from "face-api.js";
import moment from "moment";
import React, { RefObject } from "react";
import { useNavigate } from "react-router-dom";
import Webcam from "react-webcam";
import { CreateAttendancePayload, createAttendance } from "../utils/api/attendance.api";
import { UploadAttendancePayload, uploadAttendance } from "../utils/api/upload.api";
import useFaceApi, { FaceApiReturn } from "../utils/faceApi/useFaceApi";
import { useAttendancesQuery } from "../utils/hooks/useAttendancesQuery";
import { useUserDetailQuery } from "../utils/hooks/useUserDetailQuery";
import { useToast } from "../utils/providers/ToastProvider";
import { useAuth } from "../utils/providers/auth/auth.hook";
import { COMMON_TIME_FORMAT, CURRENT_MONTH, CURRENT_YEAR, DAYS } from "../utils/utils";

interface ComponentProps {
  open: boolean;
  onClose: () => void;
}

const videoConstraints = {
  width: 720,
  height: 440,
  facingMode: "user",
};


const imageUrlToBase64 = async (url: string) => {
  const data = await fetch(url);
  const blob = await data.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = () => {
      const base64data = reader.result;
      resolve(base64data);
    };
    reader.onerror = reject;
  });
};

export default function AttendanceRecordModal(props: ComponentProps) {
  const webcamRef = React.useRef<any>(null);
  const toast = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { data: userDetail } = useUserDetailQuery({ id: user?.user.id || "" });

  const firstImageRef = React.useRef<TNetInput>();
  const secondImageRef = React.useRef<TNetInput>();

  const [image, setImage] = React.useState<string | undefined>();
  const [firstImg, setFirstImg] = React.useState<unknown>()
  const [faceRecResponse, setFaceRecResponse] = React.useState<FaceApiReturn>()
  const [imageUrlPath, setImageUrlPath] = React.useState<string>();
  const [isAlertShow, setIsAlertShow] = React.useState(true);
  const [isAvatarError, setIsAvatarError] = React.useState(true);

  const navigate = useNavigate()

  const compare = useFaceApi()

  const attendanceQueries = { month: CURRENT_MONTH, year: CURRENT_YEAR, userId: user?.user.id }

  const { data: attendances, isFetching: isFetchingAttendances } =
    useAttendancesQuery(attendanceQueries);

  const todayAttendance = attendances?.data.find(attendance => moment(attendance.date).isSame(new Date(), "date"))
  const todayIn = todayAttendance?.attendance.in
  const todayOut = todayAttendance?.attendance.out
  const hasAttend = Boolean(todayIn && todayOut)

  const [isComparing, setIsComparing] = React.useState(false)

  const { mutateAsync: uploadImageMutation, isPending: isUploading } =
    useMutation({
      mutationFn: (data: UploadAttendancePayload) => uploadAttendance(data),
    });

  const { mutateAsync: createAttendanceMutation, isPending: isCreating } =
    useMutation({
      mutationFn: (data: CreateAttendancePayload) => createAttendance(data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["attendances", { ...attendanceQueries }] })
        queryClient.refetchQueries({ queryKey: ["attendances", { ...attendanceQueries }] })
      }
    });

  const capture = React.useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImage(imageSrc);
  }, [webcamRef]);

  React.useEffect(() => {
    if (userDetail?.profile?.avatarUrl) {
      if (!userDetail.profile.avatarUrl.includes("https://ui-avatars.com")) {
        setIsAvatarError(false)
        imageUrlToBase64(userDetail.profile?.avatarUrl)
          .then((res) => setFirstImg(res))
      } else {
        setIsAvatarError(true)
      }
    }
  }, [userDetail])

  React.useEffect(() => {
    if (firstImageRef.current && secondImageRef.current && image && !hasAttend) {
      setIsComparing(true)
      compare(
        firstImageRef.current,
        secondImageRef.current,
        async ({ message, code, data }) => {
          setFaceRecResponse({
            message, code, data
          })
          if (code !== "NO_FACE") {
            await uploadImageMutation({ image: image }).then(uploadRes => {
              setImageUrlPath(uploadRes.path)
            })
          }
          setIsComparing(false)
        })
    }
  }, [firstImageRef, secondImageRef, image, hasAttend])

  const onCreateAttendance = React.useCallback((imageUrlPath: string, similarity: number, status: "APPROVED" | "WAITING") => {
    if (!isCreating && !hasAttend) {
      createAttendanceMutation({
        photoUrl: imageUrlPath,
        type: todayIn ? "OUT" : "IN",
        status,
        similarity

      }).then(() => {
        toast({
          message: todayIn ? "Berhasil menyimpan absensi clock out!" : "Berhasil menyimpan absensi clock in!",
        });
      })
    }

  }, [isCreating, todayIn, hasAttend])


  React.useEffect(() => {
    if (faceRecResponse) {
      console.log("RESULT:", faceRecResponse)
      if (faceRecResponse.code === "NO_FACE") {
        toast({ message: faceRecResponse.message, error: true })
        setImage(undefined)
        setFaceRecResponse(undefined)
        setImageUrlPath(undefined)
      } else if (faceRecResponse.code === "LESS_SIMILARITY" && imageUrlPath) {
        onCreateAttendance(imageUrlPath, faceRecResponse.data?.similarity || 0, "WAITING")
      } else if (faceRecResponse.code === "ACCEPTED" && imageUrlPath && !isCreating) {
        onCreateAttendance(imageUrlPath, faceRecResponse.data?.similarity || 0, "APPROVED")
      }
    }
  }, [faceRecResponse, imageUrlPath])

  const isLoading = isUploading || isCreating || isComparing

  if (isFetchingAttendances) {
    <div style={{
      height: 440,
    }}>
      <CircularProgress />
    </div>
  }
  return (
    <React.Fragment>
      <Modal
        aria-labelledby="modal-title"
        aria-describedby="modal-desc"
        open={props.open}
        onClose={() => {
          props.onClose();
          setImage(undefined);
          setIsAlertShow(true)
          queryClient.invalidateQueries({ queryKey: ["attendances"] });
        }}
        sx={{
          bgColor: "transparent",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >


        <ModalDialog layout="fullscreen">

          <Stack direction={"row"} alignItems={"center"} gap={"2rem"}>
            <Typography
              component="h3"
              id="modal-title"
              level="h4"
              textColor="inherit"
              fontWeight="lg"
              mb={0}
            >
              Absensi
            </Typography>
            <Typography level="title-sm" startDecorator={<CalendarMonth />}>{DAYS[moment().day()]}, {moment().format("DD/MM/YY")}</Typography>
          </Stack>
          <ModalClose variant="plain" sx={{ m: 1 }} />
          <Divider />

          {isAvatarError && (
            <Sheet variant="plain" color="danger" invertedColors sx={{ height: 200, display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", gap: "1rem" }}>
              <ErrorOutline />
              <Typography level="body-lg" color="danger">Upload Foto Profil Anda untuk melakukan absensi</Typography>
              <Button onClick={() => {
                navigate(`/dashboard/profile/${user?.user.id}`)
                props.onClose()
              }} variant="plain">Upload Foto Profil</Button>
            </Sheet>
          )}
          {!isAvatarError && (
            <Sheet sx={{ overflow: "scroll", minHeight: "100%" }}>
              <Stack spacing={2} justifyContent={"justify-start"} height={"100%"}>
                {((todayIn && todayIn.status === "WAITING") || (todayOut && todayOut.status === "WAITING")) && isAlertShow && (
                  <Alert
                    startDecorator={<Warning />}
                    variant="soft"
                    color={"warning"}
                    endDecorator={
                      <IconButton variant="soft" color={"warning"} onClick={() => setIsAlertShow(false)}>
                        Tutup
                      </IconButton>
                    }
                  >
                    <div>
                      <div>Perbedaan Foto</div>
                      <Typography level="body-sm" color={"warning"}>
                        Terdatapat perbedaan pada
                        <strong> Foto Absensi {todayIn?.status === "WAITING" && todayOut?.status !== "WAITING" ? "Masuk" : todayIn?.status !== "WAITING" && todayOut?.status === "WAITING" ? "Keluar" : ""}</strong>  dengan <strong> Foto Profil</strong>  Anda.
                        Status absensi saat ini <strong>Menunggu Verifikasi Manual</strong> oleh HR.
                      </Typography>
                    </div>
                  </Alert>
                )}
                <Stack direction={"row"} alignItems={"flex-start"} justifyContent={"center"} gap={2}>
                  <Stack gap={"0.5rem"}>
                    {firstImg as string && (
                      <Card variant="soft" sx={{ alignItems: "center", textAlign: "center" }}>
                        <CardContent>
                          <Typography level="title-sm">Foto Profil</Typography>
                          <img width={100} style={{ borderRadius: 4 }} src={firstImg as string} ref={firstImageRef as RefObject<HTMLImageElement>} />
                        </CardContent>
                      </Card>
                    )}

                    {todayIn && (
                      <>
                        <Card variant="soft" sx={{ alignItems: "center", textAlign: "center" }}>
                          <CardContent>
                            <Typography level="title-sm" mb={0}>Absensi Masuk</Typography>
                            <Typography level="body-sm" mb={1} startDecorator={<LockClock />}>{moment(todayIn.date).format(COMMON_TIME_FORMAT)}</Typography>
                            <img width={100} style={{ borderRadius: 4 }} src={todayIn.photoUrl} />

                          </CardContent>
                          <div>
                            {todayIn.status === "WAITING" && <Chip variant="soft" color="warning" size="sm">Menunggu Persetujuan</Chip>}
                            {todayIn.status === "APPROVED" && <Chip variant="soft" color="success" size="sm" startDecorator={<Check />}>Berhasil disimpan</Chip>}
                          </div>
                        </Card>
                      </>

                    )}

                    {todayOut && (
                      <Card variant="soft" sx={{ alignItems: "center", textAlign: "center" }}>
                        <CardContent>
                          <Typography level="title-sm" mb={0}>Absensi Keluar</Typography>
                          <Typography level="body-sm" mb={1} startDecorator={<LockClock />}>{moment(todayOut.date).format(COMMON_TIME_FORMAT)}</Typography>
                          <img width={100} style={{ borderRadius: 4 }} src={todayOut.photoUrl} />
                        </CardContent>
                        <div>
                          {todayOut.status === "WAITING" && <Chip variant="soft" color="warning" size="sm">Menunggu Persetujuan</Chip>}
                          {todayOut.status === "APPROVED" && <Chip variant="soft" color="success" size="sm" startDecorator={<Check />}>Berhasil disimpan</Chip>}
                        </div>
                      </Card>
                    )}
                  </Stack>


                  <Stack>
                    {image ?
                      <img src={image} width={720} ref={secondImageRef as RefObject<HTMLImageElement>} /> :
                      <>
                        <Webcam
                          audio={false}
                          height={440}
                          screenshotFormat="image/jpeg"
                          width={720}
                          videoConstraints={videoConstraints}
                          ref={webcamRef}
                          style={{
                            border: "4px solid #434356",
                            borderBottom: "0px",
                            borderTopLeftRadius: "8px",
                            borderTopRightRadius: "8px",
                          }}
                        />
                        <Sheet variant="solid" invertedColors sx={{
                          paddingBlock: "0.5rem",
                          paddingInline: "0.5rem",
                          borderBottomLeftRadius: "8px",
                          borderBottomRightRadius: "8px",
                          border: 0,
                        }}>
                          <Typography level="title-sm" startDecorator={<InfoOutlined />}>
                            Pastikan wajah anda terlihat seluruhnya agar terdeteksi oleh sistem
                          </Typography>

                        </Sheet>
                      </>
                    }
                    <div style={{ textAlign: "center", marginTop: "1rem" }}>
                      <Button
                        loading={isLoading}
                        onClick={() => {
                          capture()
                        }}
                        size="lg"
                        disabled={hasAttend}
                        startDecorator={hasAttend ? <Check /> : <CameraAltOutlined />}
                        color={todayIn ? "danger" : "primary"}
                      >
                        {todayIn ? "Clock Out" : "Clock In"}
                      </Button>
                    </div>
                  </Stack>

                </Stack>
              </Stack>
            </Sheet>
          )}




        </ModalDialog>

      </Modal>
    </React.Fragment>
  );
}
