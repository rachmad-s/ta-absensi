import { Print, WorkOffOutlined } from "@mui/icons-material";
import { Button, Grid, Sheet, Stack, Typography } from "@mui/joy";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { useForm } from "react-hook-form";
import CommonFilters from "../../components/CommonFilters";
import Drawer from "../../components/Drawer";
import TimeOffRequestTable from "../../components/TimeOffRequestsTable";
import Input from "../../components/form/Input";
import { TimeOffSettlement, settleTimeOff } from "../../utils/api/timeOff";
import useGetParam from "../../utils/hooks/useGetParam";
import { useTimeOffQuery } from "../../utils/hooks/useTimeOffQuery";
import { TimeOff } from "../../utils/models/timeOff.model";
import { useToast } from "../../utils/providers/ToastProvider";
import { CURRENT_YEAR } from "../../utils/utils";

interface RejectForm {
  id: string;
  remarks: string;
}

export default function TimeOffRequestsTab() {
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

  const { data: timeOffs, isFetching: isFetchingTimeOffs } = useTimeOffQuery({
    month: month || undefined,
    year: year || CURRENT_YEAR,
    search: search || undefined,
    departmentId: departmentId || undefined,
    teamId: teamId || undefined,
    withoutMe: true,
  });

  const { mutateAsync: timeOffSettlement, isPending: isSettlingTimeOff } =
    useMutation({
      mutationFn: (data: TimeOffSettlement) => settleTimeOff(data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["timeOffs"] });
      },
    });

  const onSubmit = (data: RejectForm) => {
    setValue("id", data.id);
    timeOffSettlement({
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

  const onReject = (data: TimeOff) => {
    setValue("id", data.id);
    setOpen(true);
  };

  const onApprove = (data: TimeOff) => {
    timeOffSettlement({
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
            <WorkOffOutlined
              color="primary"
              sx={{ opacity: 0.75 }}
              fontSize="large"
            />
          }
        >
          Pengajuan Cuti
        </Typography>
        <Button startDecorator={<Print />} onClick={() => window.print()}>
          Print
        </Button>
      </Stack>

      <CommonFilters
        search={{
          show: true,
          placeholder: "Cari Nama",
        }}
        month
        year
        department
        team
      />

      <Sheet sx={{ width: "100%" }}>
        <Grid container>
          <Grid sm={12}>
            <div className="printArea">
              <TimeOffRequestTable
                data={timeOffs || []}
                isLoading={isFetchingTimeOffs || isSettlingTimeOff}
                onReject={onReject}
                onApprove={onApprove}
              />
            </div>

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
