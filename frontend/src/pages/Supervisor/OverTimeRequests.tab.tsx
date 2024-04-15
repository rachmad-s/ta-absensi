import { Timelapse } from "@mui/icons-material";
import { Grid, Sheet, Stack, Typography } from "@mui/joy";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { useForm } from "react-hook-form";
import CommonFilters from "../../components/CommonFilters";
import Drawer from "../../components/Drawer";
import OverTimeRequestTable from "../../components/OverTimeRequestTable";
import Input from "../../components/form/Input";
import { settleOverTime } from "../../utils/api/overTime";
import { TimeOffSettlement } from "../../utils/api/timeOff";
import useGetParam from "../../utils/hooks/useGetParam";
import { useOverTimeListQuery } from "../../utils/hooks/useOverTimeListQuery";
import { OverTime } from "../../utils/models/overTime.model";
import { useToast } from "../../utils/providers/ToastProvider";
import { useAuth } from "../../utils/providers/auth/auth.hook";
import { CURRENT_YEAR } from "../../utils/utils";

interface RejectForm {
  id: string;
  remarks: string;
}

export default function OverTimeRequestsTab() {
  const queryClient = useQueryClient();
  const [open, setOpen] = React.useState(false);
  const { user } = useAuth();

  const fireToast = useToast();
  const { param } = useGetParam();
  const [month, year, userId] = [
    param("month"),
    param("year"),
    param("userId"),
  ];

  const { handleSubmit, control, reset, setValue } = useForm<RejectForm>({
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  const { data: overTimes, isFetching: isFetchingOverTimes } =
    useOverTimeListQuery({
      subordinate: true,
      month: month || undefined,
      year: year || CURRENT_YEAR,
      userId: userId || undefined,
    });

  const { mutateAsync: overTimeSettlement, isPending: isSettlingTimeOff } =
    useMutation({
      mutationFn: (data: TimeOffSettlement) => settleOverTime(data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["overTimes"] });
      },
    });

  const onSubmit = (data: RejectForm) => {
    setValue("id", data.id);
    overTimeSettlement({
      id: data.id,
      status: "REJECTED",
      remarks: data.remarks,
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

  const onReject = (data: OverTime) => {
    setValue("id", data.id);
    setOpen(true);
  };

  const onApprove = (data: OverTime) => {
    overTimeSettlement({
      id: data.id,
      status: "APPROVED",
    })
      .then(() => {
        fireToast({
          message: "Pengajuan telah berhasil disetujui!",
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
            <Timelapse
              color="primary"
              sx={{ opacity: 0.75 }}
              fontSize="large"
            />
          }
        >
          Pengajuan Lembur
        </Typography>
        <CommonFilters
          month
          year
          users={{
            show: true,
            teamId: user?.user.profile?.teamId || "",
          }}
        />
      </Stack>

      <Sheet sx={{ width: "100%" }}>
        <Grid container>
          <Grid sm={12}>
            <OverTimeRequestTable
              data={overTimes || []}
              isLoading={isFetchingOverTimes || isSettlingTimeOff}
              onReject={onReject}
              onApprove={onApprove}
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
