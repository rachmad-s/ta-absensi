import { AddBox } from "@mui/icons-material";
import {
  Button,
  Card,
  CardContent,
  Grid,
  Sheet,
  Stack,
  Typography,
} from "@mui/joy";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import Drawer from "../../components/Drawer";
import TimeOffTable from "../../components/TimeOffTable";
import CustomDatePicker from "../../components/form/CustomDatePicker";
import Input from "../../components/form/Input";
import Select from "../../components/form/Select";
import {
  RequestTimeOffPayload,
  UpdateTimeOffPayload,
  requestTimeOff,
  updateTimeOff,
} from "../../utils/api/timeOff";
import { useTimeOffQuery } from "../../utils/hooks/useTimeOffQuery";
import { useTimeOffQuotaQuery } from "../../utils/hooks/useTimeOffQuotaQuery";
import { TimeOff } from "../../utils/models/timeOff.model";
import { useToast } from "../../utils/providers/ToastProvider";
import { useAuth } from "../../utils/providers/auth/auth.hook";

const ACTIONS = {
  CREATE: "CREATE",
  UPDATE: "UPDATE",
};

interface RequestTimeOffForm extends RequestTimeOffPayload {
  id: string;
  action: typeof ACTIONS.CREATE | typeof ACTIONS.UPDATE;
}

export default function MyTimeOffTab() {
  const [open, setOpen] = React.useState(false);

  const { user } = useAuth();

  const { handleSubmit, control, reset, setValue } =
    useForm<RequestTimeOffForm>({
      mode: "onBlur",
      reValidateMode: "onChange",
      defaultValues: {
        type: "ANNUAL_LEAVE",
      },
    });
  const fireToast = useToast();
  const queryClient = useQueryClient();

  const action = useWatch({ name: "action", control });
  const timeOffType = useWatch({ name: "type", control });

  const { data: timeOffs, isFetching: isFetchingTimeOffs } = useTimeOffQuery({
    userId: user?.user.id,
  });

  const { data: timeOffQuotas } = useTimeOffQuotaQuery();

  const onUpdateData = (data: TimeOff) => {
    setValue("action", ACTIONS.UPDATE);
    setValue("id", data.id);
    setValue("message", data.message);
    setValue("days", String(data.days));
    setValue("startDate", data.startDate ? new Date(data.startDate) : "");
    setOpen(true);
  };

  const { mutateAsync: requestTimeOffMutation, isPending: isCreatingUser } =
    useMutation({
      mutationFn: (data: RequestTimeOffPayload) => requestTimeOff(data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["timeOffs"] });
      },
    });

  const { mutateAsync: updateTimeOffMutation, isPending: isUpdatingUser } =
    useMutation({
      mutationFn: (data: UpdateTimeOffPayload) => updateTimeOff(data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["timeOffs"] });
      },
    });

  const onSubmit = (data: RequestTimeOffForm) => {
    if (data.action === ACTIONS.CREATE) {
      requestTimeOffMutation({
        type: data.type,
        startDate: data.startDate ? new Date(data.startDate).toISOString() : "",
        days: data.days,
        message: data.message,
      })
        .then(() => {
          fireToast({
            message: "Berhasil menambahkan user baru!",
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
      updateTimeOffMutation({
        id: data.id,
        message: data.message,
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

  useEffect(() => {
    if (timeOffType === "MARRIAGE_LEAVE") setValue("days", "5")
  }, [timeOffType])

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
        <Typography level="h2">Cuti Saya</Typography>
        <Button startDecorator={<AddBox />} onClick={() => onClickAdd()}>
          Ajukan Cuti
        </Button>
      </Stack>
      <Stack direction={"row"} spacing={2} mb={2}>
        {timeOffQuotas &&
          timeOffQuotas.map((timeOff) => (
            <Card
              key={timeOff.name}
              variant="soft"
              color="info"
              sx={{
                minWidth: 180,
              }}
            >
              <CardContent>
                <Typography level="title-lg" color="info" mb={0}>
                  {timeOff.label}
                </Typography>
                <Typography level="h2" color="info">
                  {timeOff.quotaLeft < 0 ? 0 : timeOff.quotaLeft}
                  <Typography level="body-sm" fontWeight={400} color="info">
                    {Number(timeOff.duration) > 1 &&
                      " x " + timeOff.duration + " hari"}
                  </Typography>
                </Typography>
                <Typography level="body-sm" color="info">
                  {timeOff.per === "YEAR"
                    ? "/ tahun"
                    : timeOff.per === "CONTRACT"
                      ? "/ Kontrak"
                      : ""}
                </Typography>
              </CardContent>
            </Card>
          ))}
      </Stack>

      <Sheet sx={{ width: "100%" }}>
        <Grid container>
          <Grid sm={12}>
            <TimeOffTable
              data={timeOffs || []}
              isLoading={isFetchingTimeOffs}
              onUpdateData={onUpdateData}
            />
          </Grid>
        </Grid>
      </Sheet>

      <Drawer
        open={open}
        setOpen={setOpen}
        title={
          action === ACTIONS.CREATE
            ? "Pengajuan Cuti"
            : action === ACTIONS.UPDATE
              ? "Ubah Pengajuan Cuti"
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
          <Select<RequestTimeOffForm>
            label="Jenis Cuti"
            name="type"
            control={control}
            required
            options={[
              {
                label: "Cuti Tahunan" + ` (${timeOffQuotas?.find(quota => quota.name === "ANNUAL_LEAVE")?.quotaLeft}x)`,
                value: "ANNUAL_LEAVE",
              },
              {
                label: "Cuti Sakit" + ` (${timeOffQuotas?.find(quota => quota.name === "SICK_LEAVE")?.quotaLeft}x)`,
                value: "SICK_LEAVE",
              },
              {
                label: "Cuti Menikah" + ` (${timeOffQuotas && (timeOffQuotas.find(quota => quota.name === "MARRIAGE_LEAVE")?.quotaLeft || 0) < 0 ? 0 : timeOffQuotas?.find(quota => quota.name === "MARRIAGE_LEAVE")?.quotaLeft}x)`,
                value: "MARRIAGE_LEAVE",
                disabled: (timeOffQuotas?.find(quota => quota.name === "MARRIAGE_LEAVE")?.quotaLeft || 0) < 0
              },
            ]}
          />

          <CustomDatePicker<RequestTimeOffForm>
            label="Tanggal"
            name="startDate"
            required
            control={control}
          />

          <Input<RequestTimeOffForm>
            label="Durasi (Hari)"
            type="number"
            name="days"
            disabled={timeOffType === "MARRIAGE_LEAVE"}
            required
            rules={{
              min: {
                value: 1,
                message: "Minimal 1 hari",
              },
            }}
            control={control}
          />

          <Input<RequestTimeOffForm>
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
