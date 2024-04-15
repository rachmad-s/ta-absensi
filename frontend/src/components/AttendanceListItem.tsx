import {
  ArrowBack,
  ArrowForward,
  CalendarToday,
  Schedule,
  WarningRounded
} from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  List,
  ListDivider,
  ListItem,
  ListItemContent,
  Modal,
  ModalClose,
  ModalDialog,
  Stack,
  Typography,
} from "@mui/joy";
import { useTheme } from "@mui/material/styles";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import moment from "moment";
import React from "react";
import { useForm } from "react-hook-form";
import { UpdateAttendancePayload, updateAttendance } from "../utils/api/attendance.api";
import { MonthlyAttendance } from "../utils/models/attendance.model";
import { User } from "../utils/models/user.model";
import { useToast } from "../utils/providers/ToastProvider";
import { useAuth } from "../utils/providers/auth/auth.hook";
import {
  COMMON_DATE_ONLY,
  COMMON_TIME_FORMAT,
  DAYS,
  getDuration,
  withZero,
} from "../utils/utils";
import Drawer from "./Drawer";
import Input from "./form/Input";

interface ComponentProps {
  data: MonthlyAttendance;
  user: User
}

interface RejectForm {
  id: string;
  remarks: string;
}

export default function AttendanceListItem({ data, user }: ComponentProps) {
  const [openDetail, setOpenDetail] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const { user: loggedInUser } = useAuth();
  const queryClient = useQueryClient();
  const toast = useToast();

  const isToday = moment(data.date).isSame(new Date(), "date");
  const isMoreThanToday = moment(data.date).isAfter(new Date(), "date");

  const rejected = data.attendance.in?.status === "REJECTED"

  const { handleSubmit, control, reset, setValue } = useForm<RejectForm>({
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  const { mutateAsync: updateAttendanceMutation, isPending: isUpdating } =
    useMutation({
      mutationFn: (data: UpdateAttendancePayload) => updateAttendance(data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["attendances"] });
      },
    });

  const onSubmit = (formData: RejectForm) => {
    if (data.attendance.in) {
      updateAttendanceMutation({
        id: data.attendance.in.id,
        remarks: formData.remarks,
        status: "REJECTED"
      }).then(res => {
        toast({
          message: "Berhasil melakukan penolakan!",
        });
      })
    }
  }

  const isWaiting = data.attendance.in?.status === "WAITING" || data.attendance.out?.status === "WAITING"
  const theme = useTheme();
  const date = new Date(data.date);
  const color = data.isPublicHoliday
    ? theme.palette.error
    : theme.palette.secondary;
  return (
    <>
      <ListItem variant={isToday ? "soft" : "plain"} color={isToday ? "primary" : "neutral"} sx={{
        opacity: isMoreThanToday ? "0.5" : 1
      }}>
        <ListItemContent sx={{ py: 1 }}>
          <Stack direction={"row"}>
            <Stack
              direction={"row"}
              spacing={2}
              alignItems={"center"}
              width={200}
              sx={(theme) => ({
                color: data.isPublicHoliday
                  ? theme.vars.palette.danger[500]
                  : theme.vars.palette.neutral[800],
              })}
            >
              <Stack direction={"row"} spacing={1} alignItems={"center"}>
                <CalendarToday style={{ fontSize: 14, color: "inherit" }} />
                <Typography level="title-lg" sx={{ color: "inherit" }}>
                  {withZero(date.getDate())}
                </Typography>
              </Stack>
              <Typography level="body-lg" sx={{ color: "inherit" }}>
                {DAYS[date.getDay()]}
              </Typography>
            </Stack>
            {!data.isPublicHoliday && !isMoreThanToday && (
              <Stack
                direction={"row"}
                flex={1}
                spacing={1}
                alignItems={"center"}
              >
                <Chip
                  variant={data.attendance.in ? "soft" : "plain"}
                  color={data.attendance.in ? "success" : "danger"}
                  startDecorator={data.attendance.in ? <ArrowBack /> : "--"}
                >
                  {data.attendance.in ? (
                    moment(data.attendance.in.date).format(COMMON_TIME_FORMAT)
                  ) : (
                    <Typography
                      fontStyle={"italic"}
                      sx={{ color: "white" }}
                      visibility={"hidden"}
                    >
                      No data
                    </Typography>
                  )}
                </Chip>
                <Chip
                  variant={data.attendance.out ? "soft" : "plain"}
                  color={data.attendance.out ? "danger" : "danger"}
                  startDecorator={data.attendance.out ? <ArrowForward /> : "--"}
                >
                  {data.attendance.out ? (
                    moment(data.attendance.out.date).format(COMMON_TIME_FORMAT)
                  ) : (
                    <Typography
                      fontStyle={"italic"}
                      sx={{ color: "white" }}
                      visibility={"hidden"}
                    >
                      No data
                    </Typography>
                  )}
                </Chip>

                {data.totalWorkMinute ? (
                  <Chip
                    variant="soft"
                    color="neutral"
                    startDecorator={<Schedule />}
                  >
                    {Math.floor(data.totalWorkMinute / 60)} Jam{" "}
                    {data.totalWorkMinute % 60} Menit
                  </Chip>
                ) : isMoreThanToday ? null : isWaiting ? (
                  <div>
                    <Chip variant="solid" color="warning" size="sm" startDecorator={<WarningRounded />}>Menunggu Persetujuan</Chip>
                  </div>
                ) : (
                  <Typography fontSize="small">
                    Keterangan: Tidak Hadir
                  </Typography>
                )}

                <Typography
                  fontStyle={"italic"}
                  sx={{ opacity: 0.5 }}
                ></Typography>
              </Stack>
            )}

            {rejected && (
              <div>
                <Chip
                  variant="solid"
                  color="danger"
                >
                  Ditolak: {data.attendance.in?.remarks}
                </Chip>
              </div>

            )}

            {!data.isPublicHoliday && !isMoreThanToday && (
              <Button variant="plain" onClick={() => setOpenDetail(true)}>
                Lihat Detail
              </Button>
            )}
          </Stack>

          <Stack direction={"row"} spacing={1} alignItems={"center"}></Stack>
        </ListItemContent>
      </ListItem>
      <ListDivider sx={{ p: 0, m: 0 }} inset={"gutter"} />
      <Modal open={openDetail} onClose={() => setOpenDetail(false)}>
        <ModalDialog size="lg">
          <ModalClose />
          <Typography level="title-lg">Detail Absensi</Typography>
          <Divider />
          {rejected && (
            <Card variant="outlined" color="danger">
              DITOLAK:
              "{data.attendance.in?.remarks}"
            </Card>
          )}
          <Stack direction={"row"}>
            <Stack minWidth={400} direction={"row"} justifyContent={"space-between"}>
              <List sx={{ p: 0, borderRadius: 8 }}>
                <ListItem>
                  <ListItemContent>
                    <Stack direction={"column"}>
                      <Typography level="body-sm">
                        Nama
                      </Typography>
                      <Typography level="title-md">
                        {user.profile?.name}
                      </Typography>
                    </Stack>
                  </ListItemContent>
                </ListItem>
                <ListItem>
                  <ListItemContent>
                    <Stack direction={"column"}>
                      <Typography level="body-sm">
                        Email
                      </Typography>
                      <Typography level="title-md">
                        {user.email}
                      </Typography>
                    </Stack>
                  </ListItemContent>
                </ListItem>
                <ListItem>
                  <ListItemContent>
                    <Stack direction={"column"}>
                      <Typography level="body-sm">
                        Posisi
                      </Typography>
                      <Typography level="title-md">
                        {user.profile?.position}
                      </Typography>
                    </Stack>
                  </ListItemContent>
                </ListItem>
              </List>
              <List sx={{ p: 0, borderRadius: 8 }}>
                <ListItem>
                  <ListItemContent>
                    <Stack direction={"column"}>
                      <Typography level="body-sm">
                        Department
                      </Typography>
                      <Typography level="title-md">
                        {user.profile?.team?.department.name}
                      </Typography>
                    </Stack>
                  </ListItemContent>
                </ListItem>
                <ListItem>
                  <ListItemContent>
                    <Stack direction={"column"}>
                      <Typography level="body-sm">
                        Divisi
                      </Typography>
                      <Typography level="title-md">
                        {user.profile?.team?.name}
                      </Typography>
                    </Stack>
                  </ListItemContent>
                </ListItem>
                <ListItem>
                  <ListItemContent>
                    <Stack direction={"column"}>
                      <Typography level="body-sm">
                        Supervisor
                      </Typography>
                      <Typography level="title-md">
                        {user.supervisor?.profile?.name}
                      </Typography>
                    </Stack>
                  </ListItemContent>
                </ListItem>
              </List>
            </Stack>
            <Stack direction={"row"} spacing={2}>
              <Card>
                {data.attendance.in?.photoUrl ? (
                  <img
                    src={data.attendance.in.photoUrl}
                    width={200}
                    style={{ objectFit: "contain" }}
                    alt="your clock in"
                  />
                ) : (
                  <Box
                    width={200}
                    height={200}
                    bgcolor={"grey"}
                    display={"flex"}
                    alignItems={"center"}
                    justifyContent={"center"}
                    fontSize={64}
                    fontWeight={700}
                    color={"white"}
                  >
                    ?
                  </Box>
                )}
                <CardContent>
                  <List sx={{ p: 0, borderRadius: 8 }}>
                    <ListItem>
                      <ListItemContent>
                        <Stack direction={"row"} alignItems={"center"} spacing={1}>
                          <Box
                            sx={(theme) => ({
                              color: theme.vars.palette.success[500],
                              lineHeight: 0,
                            })}
                          >
                            <ArrowBack sx={{ color: "inherit" }} />
                          </Box>
                          <Typography fontWeight={700} color="success">
                            Absen Masuk
                          </Typography>
                        </Stack>
                      </ListItemContent>
                    </ListItem>
                    <ListItem>
                      <ListItemContent>
                        <Stack>
                          <Typography level="title-sm" >
                            Tanggal
                          </Typography>
                          <Typography flex={1}>
                            {data.attendance.in
                              ? moment(data.attendance.in.date).format(
                                COMMON_DATE_ONLY
                              )
                              : "-"}
                          </Typography>
                        </Stack>
                      </ListItemContent>
                    </ListItem>
                    <ListItem>
                      <ListItemContent>
                        <Stack>
                          <Typography level="title-sm" flex={1}>
                            Waktu
                          </Typography>
                          <Typography flex={1}>
                            {data.attendance.in
                              ? moment(data.attendance.in.date).format(
                                COMMON_TIME_FORMAT
                              )
                              : "-"}
                          </Typography>
                        </Stack>
                      </ListItemContent>
                    </ListItem>
                    <ListItem>
                      <ListItemContent>
                        <Stack >
                          <Typography level="title-sm" flex={1}>
                            Status
                          </Typography>
                          <Chip variant="soft" size="sm" sx={{ mt: ".4rem" }} color={data.attendance.in?.status === "WAITING" ? "warning" : data.attendance.in?.status === "APPROVED" ? "success" : "neutral"}>
                            {data.attendance.in
                              ? data.attendance.in.status === "WAITING" ? "Menunggu Persetujuan" : "Disimpan" : "-"}
                          </Chip>
                        </Stack>
                      </ListItemContent>
                    </ListItem>
                  </List>
                </CardContent>
              </Card>

              <Card>
                {data.attendance.out?.photoUrl ? (
                  <img
                    src={data.attendance.out.photoUrl}
                    width={200}
                    style={{ objectFit: "contain" }}
                    alt="your clock in"
                  />
                ) : (
                  <Box
                    width={200}
                    height={200}
                    bgcolor={"grey"}
                    display={"flex"}
                    alignItems={"center"}
                    justifyContent={"center"}
                    fontSize={64}
                    fontWeight={700}
                    color={"white"}
                  >
                    ?
                  </Box>
                )}
                <CardContent>
                  <List sx={{ p: 0, borderRadius: 8 }}>
                    <ListItem>
                      <ListItemContent>
                        <Stack direction={"row"} alignItems={"center"} spacing={1}>
                          <Box
                            sx={(theme) => ({
                              color: theme.vars.palette.danger[500],
                              lineHeight: 0,
                            })}
                          >
                            <ArrowForward sx={{ color: "inherit" }} />
                          </Box>
                          <Typography fontWeight={700} color="danger">
                            Absen Keluar
                          </Typography>
                        </Stack>
                      </ListItemContent>
                    </ListItem>
                    <ListItem>
                      <ListItemContent>
                        <Stack>
                          <Typography level="title-sm" flex={1}>
                            Tanggal
                          </Typography>
                          <Typography flex={1}>
                            {data.attendance.out
                              ? moment(data.attendance.out.date).format(
                                COMMON_DATE_ONLY
                              )
                              : "-"}
                          </Typography>
                        </Stack>
                      </ListItemContent>
                    </ListItem>
                    <ListItem>
                      <ListItemContent>
                        <Stack >
                          <Typography level="title-sm" flex={1}>
                            Waktu
                          </Typography>
                          <Typography flex={1}>
                            {data.attendance.out
                              ? moment(data.attendance.out.date).format(
                                COMMON_TIME_FORMAT
                              )
                              : "-"}
                          </Typography>
                        </Stack>
                      </ListItemContent>
                    </ListItem>
                    <ListItem>
                      <ListItemContent>
                        <Stack >
                          <Typography level="title-sm" flex={1}>
                            Status
                          </Typography>
                          <Chip variant="soft" size="sm" sx={{ mt: ".4rem" }} color={data.attendance.out?.status === "WAITING" ? "warning" : data.attendance.out?.status === "APPROVED" ? "success" : "neutral"}>
                            {data.attendance.out
                              ? data.attendance.out.status === "WAITING" ? "Menunggu Persetujuan" : "Disimpan" : "-"}
                          </Chip>
                        </Stack>
                      </ListItemContent>
                    </ListItem>
                  </List>
                </CardContent>

              </Card>
            </Stack>
          </Stack>

          <Divider />
          <Stack direction={"row"} justifyContent={"space-between"}>
            <div>
              <Typography level="body-sm">
                Jam Kerja
              </Typography>
              <Typography level="title-md">
                {getDuration(data.totalWorkMinute || 0)}
              </Typography>
            </div>
            {loggedInUser?.user.role === "HR" && (
              <Button color="danger" disabled={rejected} onClick={() => {
                setOpen(true)
                setOpenDetail(false)
              }}>Tolak Absensi</Button>
            )}

          </Stack>
        </ModalDialog>
      </Modal>
      <Drawer
        open={open}
        setOpen={(state) => {
          setOpen(state)
          setOpenDetail(true)
        }}
        title={"Tolak Absensi"}
        onDrawerClose={() => reset()}
        primaryButton={{
          props: {
            loading: false,
          },
          onClick: handleSubmit(onSubmit),
        }}
        secondaryButton={{
          onClick: reset,
        }}
      >
        <form>
          <Input<RejectForm>
            label="Alasan Penolakan"
            type="textarea"
            name="remarks"
            control={control}
          />
        </form>
      </Drawer>
    </>
  );
}
