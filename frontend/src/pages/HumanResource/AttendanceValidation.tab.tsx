import { List } from "@mui/icons-material";
import { Grid, Sheet, Stack, Typography } from "@mui/joy";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { useForm } from "react-hook-form";
import AttendanceValidationTable from "../../components/AttendanceValidationTable";
import CommonFilters from "../../components/CommonFilters";
import Drawer from "../../components/Drawer";
import Input from "../../components/form/Input";
import { UpdateAttendancePayload, updateAttendance } from "../../utils/api/attendance.api";
import { useAllAttendanceQuery } from "../../utils/hooks/useAllAttendanceQuery";
import useGetParam from "../../utils/hooks/useGetParam";
import { Attendance } from "../../utils/models/attendance.model";
import { useToast } from "../../utils/providers/ToastProvider";

interface RejectForm {
  id: string;
  remarks: string;
}

export default function AttendanceValidation() {
  const queryClient = useQueryClient();
  const [open, setOpen] = React.useState(false);

  const fireToast = useToast();
  const { param } = useGetParam();
  const [month, year, search, departmentId, teamId] = [
    param("month"),
    param("year"),
    param("search"),
    param("departmentId"),
    param("teamId"),
  ];

  const { handleSubmit, control, reset, setValue } = useForm<RejectForm>({
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  const { data: attendances, isFetching: isFetchingAttendances } =
    useAllAttendanceQuery({
      status: "WAITING",
      wihtoutMe: true,
    });

  const { mutateAsync: onUpdateAttendance, isPending: isSettlingTimeOff } =
    useMutation({
      mutationFn: (data: UpdateAttendancePayload) => updateAttendance(data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["rawAttendance"] });
      },
    });

  const onSubmit = (data: RejectForm) => {
    onUpdateAttendance({
      id: data.id,
      status: "REJECTED",
      remarks: data.remarks
    })
      .then(() => {
        fireToast({
          message: "Pengajuan telah berhasil ditolak!",
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
  };

  const onReject = (data: Attendance) => {
    setValue("id", data.id);
    setOpen(true);
  };

  const onApprove = (data: Attendance) => {
    onUpdateAttendance({
      id: data.id,
      status: "APPROVED",
      remarks: "approved",
    })
      .then(() => {
        fireToast({
          message: "Pengajuan telah berhasil disetujui!",
        });
        reset();
      })
      .catch((error) => {
        fireToast({
          error: true,
          message: error?.message || "Oops! Terjadi Error",
        });
      });
  };

  return (
    <>
      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
        mt={2}
        mb={1}
      >
        <Typography
          level="h3"
          mb={1}
          startDecorator={
            <List
              color="primary"
              sx={{ opacity: 0.75 }}
              fontSize="large"
            />
          }
        >
          Validasi Absensi
        </Typography>
      </Stack>
      <CommonFilters
        search={{
          show: true,
          placeholder: "Cari nama",
        }}
        department
        team
        month
        year
      />
      <Sheet sx={{ width: "100%" }}>
        <Grid container>
          <Grid sm={12}>
            <AttendanceValidationTable
              data={attendances || []}
              isLoading={isFetchingAttendances}
              onApprove={data => onApprove(data)}
              onReject={(data) => onReject(data)}
            />
          </Grid>
        </Grid>
      </Sheet>

      <Drawer
        open={open}
        setOpen={setOpen}
        title={"Tolak Pengajuan"}
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
