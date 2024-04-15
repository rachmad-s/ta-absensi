import {
  AddBox,
  EditOutlined,
  MonetizationOn,
  Schedule,
} from "@mui/icons-material";
import {
  Avatar,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  IconButton,
  Select as JoySelect,
  Option,
  Sheet,
  Stack,
  Typography,
} from "@mui/joy";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import moment from "moment";
import React from "react";
import { useForm, useWatch } from "react-hook-form";
import Drawer from "../../components/Drawer";
import Table from "../../components/Table";
import Input from "../../components/form/Input";
import Select from "../../components/form/Select";
import {
  RequestOverTimePayload,
  UpdateOverTimePayload,
  requestOverTime,
  updateOverTime,
} from "../../utils/api/overTime";
import { useAttendancesQuery } from "../../utils/hooks/useAttendancesQuery";
import { useOverTimeListQuery } from "../../utils/hooks/useOverTimeListQuery";
import { OverTime } from "../../utils/models/overTime.model";
import { useToast } from "../../utils/providers/ToastProvider";
import { useAuth } from "../../utils/providers/auth/auth.hook";
import {
  COMMON_DATE_ONLY,
  CURRENT_MONTH,
  CURRENT_YEAR,
  getDuration,
  monthOptions,
  yearOptions,
} from "../../utils/utils";

const ACTIONS = {
  CREATE: "CREATE",
  UPDATE: "UPDATE",
};

const MINIMUM_OVERTIME_MINUTES = 60 * 10;

interface RequestOverTimeForm extends RequestOverTimePayload {
  id: string;
  action: typeof ACTIONS.CREATE | typeof ACTIONS.UPDATE;
}

export default function MyOverTimeTab() {
  const fireToast = useToast();
  const queryClient = useQueryClient();

  const [filter, setFilter] = React.useState({
    month: String(CURRENT_MONTH),
    year: String(CURRENT_YEAR),
  });

  const { user } = useAuth();
  const currentUserId = user?.user.id;

  const { handleSubmit, control, reset, setValue } =
    useForm<RequestOverTimeForm>({
      mode: "onBlur",
      reValidateMode: "onChange",
    });

  const { data: attendances, isFetching: isFetchingAttendances } =
    useAttendancesQuery({
      userId: currentUserId,
      month: filter.month,
      year: filter.year,
    });

  const { data: overTimeList, isFetching: isFetchingOverTimeList } =
    useOverTimeListQuery({
      userId: currentUserId,
      month: filter.month,
      year: filter.year,
    });

  const approvedOvertime = overTimeList ? overTimeList.filter(overtime => overtime.requestActions?.every(action => action.status === "APPROVED") && overtime.requestActions?.some(action => action.user.role === "HR")) : []
  const totalApprovedOverTime = approvedOvertime.length > 0 ? approvedOvertime.reduce((a, b) => a + b.duration, 0) : 0

  const action = useWatch({ name: "action", control });

  const [open, setOpen] = React.useState(false);

  const availableOverTimes = attendances?.data.filter(
    (attendance) => (attendance.totalWorkMinute || 0) > MINIMUM_OVERTIME_MINUTES
  );

  const overTimesDateOptions = availableOverTimes
    ? availableOverTimes.map((attendance) => ({
      value: attendance.date,
      label: `${moment(attendance.date).format(
        COMMON_DATE_ONLY
      )} (${getDuration(attendance.totalWorkMinute || 0)})`,
    }))
    : [];

  const isApproved = (data: OverTime) => {
    return (
      data.requestActions &&
      data.requestActions.findIndex(
        (action) => action.user.role === "HR" && action.status === "APPROVED"
      ) > -1
    );
  };

  const onUpdateData = (data: OverTime) => {
    setValue("action", ACTIONS.UPDATE);
    setValue("id", data.id);
    setValue("message", data.message);
    setValue("date", data.date);
    setValue("duration", data.duration);
    setOpen(true);
  };

  const { mutateAsync: requestOverTimeMutation, isPending: isCreatingUser } =
    useMutation({
      mutationFn: (data: RequestOverTimePayload) => requestOverTime(data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["overTimes"] });
      },
    });

  const { mutateAsync: updateOverTimeMutation, isPending: isUpdatingUser } =
    useMutation({
      mutationFn: (data: UpdateOverTimePayload) => updateOverTime(data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["overTimes"] });
      },
    });

  const onSubmit = (data: RequestOverTimeForm) => {
    if (data.action === ACTIONS.CREATE) {
      requestOverTimeMutation({
        message: data.message,
        date: data.date,
        duration:
          (availableOverTimes?.find(
            (attendance) => attendance.date === data.date
          )?.totalWorkMinute || 0) - (MINIMUM_OVERTIME_MINUTES - 60),
      })
        .then(() => {
          fireToast({
            message: "Berhasil mengajukan lembur!",
          });
          reset();

          setOpen(false);
        })
        .catch((error) => {
          fireToast({
            error: true,
            message: error?.message || "Oops! Terjadi Error",
          });
        });
    }
    if (data.action === ACTIONS.UPDATE) {
      updateOverTimeMutation({
        id: data.id,
        message: data.message,
        date: data.date,
        duration:
          (availableOverTimes?.find(
            (attendance) => attendance.date === data.date
          )?.totalWorkMinute || 0) - MINIMUM_OVERTIME_MINUTES,
      })
        .then(() => {
          fireToast({
            message: "Berhasil mengubah data",
          });
          reset();
          setOpen(false);
        })
        .catch((error) => {
          fireToast({
            error: true,
            message: error?.message || "Oops! Terjadi Error",
          });
        });
    }
  };

  const onClickAdd = () => {
    setOpen(true);
    setValue("action", ACTIONS.CREATE);
  };

  return (
    <>
      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
        mb={2}
      >
        <Typography level="h2">Lembur</Typography>
        <Stack direction={"row"} spacing={1} alignItems={"center"}>
          <Grid container direction={"row"} spacing={1} width={300}>
            <Grid sm={6}>
              <JoySelect
                defaultValue={CURRENT_MONTH.toString()}
                variant="outlined"
                color="primary"
                onChange={(e, value) => {
                  setFilter((prev) => ({
                    ...prev,
                    month: value || "",
                  }));
                }}
              >
                {monthOptions.map((month) => (
                  <Option value={month.value}>{month.label}</Option>
                ))}
              </JoySelect>
            </Grid>
            <Grid sm={6}>
              <JoySelect
                defaultValue={CURRENT_YEAR.toString()}
                variant="outlined"
                color="primary"
                onChange={(e, value) => {
                  setFilter((prev) => ({
                    ...prev,
                    year: value || "",
                  }));
                }}
              >
                {yearOptions.map((year) => (
                  <Option value={year.value}>{year.label}</Option>
                ))}
              </JoySelect>
            </Grid>
          </Grid>
          <Button startDecorator={<AddBox />} onClick={() => onClickAdd()}>
            Ajukan Lembur
          </Button>
        </Stack>
      </Stack>

      <Stack direction={"row"} spacing={3} mb={2}>
        <Card
          variant="soft"
          orientation="horizontal"
          invertedColors
          color="info"
        >
          <Schedule sx={{ fontSize: "2rem" }} />
          <CardContent>
            <Typography level="body-sm">Total Lembur</Typography>
            <Typography level="h3">{getDuration(totalApprovedOverTime)}</Typography>
          </CardContent>
        </Card>

        <Card
          variant="soft"
          orientation="horizontal"
          invertedColors
          color="info"
        >
          <MonetizationOn sx={{ fontSize: "2rem" }} />
          <CardContent>
            <Typography level="body-sm">Tunjangan didapatkan</Typography>
            <Typography level="h3">Rp {Math.floor(totalApprovedOverTime / 60) * 50000}</Typography>
          </CardContent>
        </Card>
      </Stack>

      <Sheet sx={{ width: "100%" }}>
        <Grid container>
          <Grid sm={12}>
            <Table<OverTime>
              isLoading={isFetchingOverTimeList}
              tableConfig={[
                {
                  name: "date",
                  label: "Tanggal",
                  style: { width: 130 },
                  render: (data) => moment(data.date).format(COMMON_DATE_ONLY),
                },
                {
                  name: "duration",
                  label: "Durasi",
                  style: { width: 150 },
                  render: (data) => getDuration(data.duration),
                },
                {
                  name: "message",
                  label: "Message",
                  dataIndex: "message",
                  style: { width: 300 },
                },
                {
                  name: "status",
                  label: "Status",
                  render(data) {
                    return data.requestActions &&
                      data.requestActions?.length < 1 ? (
                      <Chip variant="soft" color="info">
                        Menunggu Persetujuan
                      </Chip>
                    ) : (
                      (
                        <Stack>
                          {data.requestActions?.map((actions) => (
                            <Card
                              variant="plain"
                              sx={{ p: 0, backgroundColor: "transparent", gap: 0.3 }}
                            >
                              {actions.status === "APPROVED" ? (
                                <Typography
                                  color="success"
                                  fontWeight={600}
                                  fontSize={"small"}
                                >
                                  Disetujui
                                </Typography>
                              ) : (
                                <Typography
                                  color="danger"
                                  fontWeight={600}
                                  fontSize={"small"}
                                >
                                  Ditolak
                                </Typography>
                              )}
                              <CardContent>
                                <Card
                                  size="sm"
                                  orientation="horizontal"
                                  variant="plain"
                                  sx={{ p: 0, backgroundColor: "transparent" }}
                                >
                                  <Avatar size="sm" sx={{ alignSelf: "center" }}>
                                    <img
                                      src={actions.user.profile?.avatarUrl}
                                      alt="Profile"
                                      width={"100%"}
                                    />
                                  </Avatar>
                                  <CardContent>
                                    <Typography fontWeight={600}>
                                      {actions.user.profile?.name}
                                      {actions.user.role === "HR" && (
                                        <Chip
                                          size="sm"
                                          sx={{ ml: 1, fontWeight: "bold" }}
                                          variant="soft"
                                          color="primary"
                                        >
                                          HR
                                        </Chip>
                                      )}
                                    </Typography>
                                    <Typography fontSize={"small"}>
                                      Pada{" "}
                                      {moment(actions.createdAt).format(
                                        COMMON_DATE_ONLY
                                      )}
                                    </Typography>
                                  </CardContent>
                                </Card>
                              </CardContent>
                            </Card>
                          ))}
                        </Stack>
                      )
                    );
                  },
                },
                {
                  name: "_action",
                  label: "",
                  style: { width: 50 },
                  render: (data) => (
                    <>
                      {!isApproved(data) && (
                        <IconButton
                          variant="plain"
                          color="success"
                          size="sm"
                          onClick={() => onUpdateData(data)}
                        >
                          <EditOutlined />
                        </IconButton>
                      )}
                    </>
                  ),
                },
              ]}
              tableData={overTimeList || []}
              keyIndex="id"
            />
          </Grid>
        </Grid>
      </Sheet>

      <Drawer
        open={open}
        setOpen={setOpen}
        title={
          action === ACTIONS.CREATE
            ? "Ajukan Lembur"
            : action === ACTIONS.UPDATE
              ? "Ubah Pengajuan Lembur"
              : ""
        }
        onDrawerClose={() => reset()}
        primaryButton={{
          props: {
            loading: isCreatingUser || isUpdatingUser,
          },
          onClick: handleSubmit(onSubmit),
        }}
        secondaryButton={{
          onClick: reset,
        }}
      >
        <form>
          <Typography fontStyle={"italic"} level="body-sm" mb={3}>
            * Minimal jam kerja untuk mengajukan lembur adalah 10 jam
          </Typography>

          <Select<RequestOverTimeForm>
            label="Tanggal"
            name="date"
            control={control}
            options={overTimesDateOptions.filter(option => !approvedOvertime.find(approved => approved.date === option.value))}
            isLoading={isFetchingAttendances}
            required
          />

          <Input<RequestOverTimeForm>
            label="Catatan"
            type="textarea"
            name="message"
            control={control}
          />
        </form>
      </Drawer>
    </>
  );
}
