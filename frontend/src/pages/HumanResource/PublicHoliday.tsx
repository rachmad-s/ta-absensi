import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  AddBox,
  DeleteOutlined,
  EditOutlined,
  InfoOutlined,
} from "@mui/icons-material";
import {
  AspectRatio,
  Box,
  Button,
  Card,
  CardContent,
  CardOverflow,
  Grid,
  IconButton,
  Sheet,
  Stack,
  Typography,
} from "@mui/joy";
import moment from "moment";
import React from "react";
import { useForm, useWatch } from "react-hook-form";
import CommonFilters from "../../components/CommonFilters";
import Drawer from "../../components/Drawer";
import Table from "../../components/Table";
import CustomDatePicker from "../../components/form/CustomDatePicker";
import Input from "../../components/form/Input";
import {
  createPublicHoliday,
  deletePublicHoliday,
  updatePublicHoliday,
} from "../../utils/api/publicHoliday.api";
import useGetParam from "../../utils/hooks/useGetParam";
import { usePublicHolidayListQuery } from "../../utils/hooks/usePublicHolidayQuery";
import { PublicHoliday } from "../../utils/models/publicHoliday.model";
import { useConfirmationDialog } from "../../utils/providers/ConfirmationProvider";
import { useToast } from "../../utils/providers/ToastProvider";
import {
  COMMON_DATE_ONLY,
  CURRENT_YEAR,
  presetValidation,
} from "../../utils/utils";

const ACTIONS = {
  CREATE: "CREATE",
  UPDATE: "UPDATE",
};

interface AddForm {
  id: string;
  action?: typeof ACTIONS.CREATE | typeof ACTIONS.UPDATE;
  name: string;
  date: Date;
}

export default function PublicHolidayComponent() {
  const { openConfirmation } = useConfirmationDialog();
  const fireToast = useToast();
  const queryClient = useQueryClient();
  const { param } = useGetParam();
  const [open, setOpen] = React.useState(false);

  const [month, year, name] = [
    param("month") || undefined,
    param("year") || CURRENT_YEAR,
    param("search") || undefined,
  ];

  const { handleSubmit, control, reset, setValue } = useForm<AddForm>({
    mode: "onBlur",
    defaultValues: {
      action: ACTIONS.CREATE,
    },
  });

  const { data: publicHolidays, isFetching: isFetchingPublicHolidays } =
    usePublicHolidayListQuery({
      month,
      year,
      name,
    });

  const action = useWatch({ name: "action", control });

  const onUpdateData = (data: AddForm) => {
    setValue("action", ACTIONS.UPDATE);
    setValue("id", data.id);
    setValue("name", data.name);
    setValue("date", data.date);
    setOpen(true);
  };

  const { mutateAsync: createPublicHolidayMutation, isPending: isCreating } =
    useMutation({
      mutationFn: (data: Partial<PublicHoliday>) => createPublicHoliday(data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["publicHolidays"] });
      },
    });

  const { mutateAsync: updatePublicHolidayMutation, isPending: isUpdating } =
    useMutation({
      mutationFn: (data: Partial<PublicHoliday>) => updatePublicHoliday(data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["publicHolidays"] });
      },
    });

  const { mutateAsync: deletePublicHolidayMutation, isPending: isDeleting } =
    useMutation({
      mutationFn: (data: Partial<PublicHoliday>) => deletePublicHoliday(data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["publicHolidays"] });
      },
    });

  const onSubmit = (data: AddForm) => {
    if (data.action === ACTIONS.CREATE) {
      createPublicHolidayMutation({
        name: data.name,
        date: data.date.toISOString(),
      })
        .then(() => {
          fireToast({
            message: "Berhasil menambahkan department baru!",
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
      updatePublicHolidayMutation({
        id: data.id,
        name: data.name,
        date: data.date.toISOString(),
      })
        .then((response) => {
          fireToast({
            message: "Berhasil mengubah " + response.name,
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
        <Typography level="h4">Tanggal Merah</Typography>
        <Button startDecorator={<AddBox />} onClick={() => onClickAdd()}>
          Tambah Tanggal Merah
        </Button>
      </Stack>

      <Card orientation="horizontal" variant="soft" color="info">
        <CardOverflow>
          <AspectRatio
            ratio={1}
            sx={{ width: 50 }}
            variant="solid"
            color="info"
          >
            <Box>
              <InfoOutlined />
            </Box>
          </AspectRatio>
        </CardOverflow>

        <CardContent>
          <Typography level="body-sm">
            Tanggal merah akan dianggap sebagai hari libur, sehingga tidak akan
            menghitung performa absensi pada hari tersebut
          </Typography>
        </CardContent>
      </Card>

      <Box mt={3}>
        <CommonFilters
          search={{
            show: true,
            placeholder: "Cari Nama",
          }}
          month
          year
        />
      </Box>

      <Sheet sx={{ width: "100%" }}>
        <Grid container>
          <Grid sm={12}>
            <Table<PublicHoliday>
              isLoading={isFetchingPublicHolidays}
              tableConfig={[
                {
                  name: "name",
                  label: "Name",
                  render: (data) => data.name || "-",
                },
                {
                  name: "date",
                  label: "Tanggal",
                  render: (data) =>
                    moment(data.date).format(COMMON_DATE_ONLY) || "-",
                },
                {
                  name: "_action",
                  label: "",
                  style: { width: 96 },
                  render: (data) => (
                    <>
                      <IconButton
                        variant="plain"
                        color="success"
                        size="sm"
                        onClick={() =>
                          onUpdateData({
                            ...data,
                            date: new Date(data.date),
                          })
                        }
                      >
                        <EditOutlined />
                      </IconButton>
                      <IconButton
                        variant="plain"
                        color="danger"
                        size="sm"
                        onClick={() => {
                          const { id, name } = data;
                          openConfirmation({
                            message: (
                              <Typography>
                                Apakah Anda yakin untuk menghapus{" "}
                                <Typography fontWeight={800}>{name}</Typography>
                                ?
                              </Typography>
                            ),
                            buttonLabel: "Hapus",
                            buttonLoading: isDeleting,
                            onConfirm: async () => {
                              await deletePublicHolidayMutation({ id });
                              fireToast({
                                message: `Berhasil menghapus ${name}!`,
                              });
                            },
                          });
                        }}
                      >
                        <DeleteOutlined />
                      </IconButton>
                    </>
                  ),
                },
              ]}
              tableData={publicHolidays || []}
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
            ? "Tambah Department"
            : action === ACTIONS.UPDATE
            ? "Edit Department"
            : ""
        }
        onDrawerClose={() => reset()}
        primaryButton={{
          props: {
            loading: isCreating || isUpdating,
          },
          onClick: handleSubmit(onSubmit),
        }}
        secondaryButton={{
          onClick: reset,
        }}
      >
        <form>
          <Input<AddForm>
            label="Nama"
            name="name"
            control={control}
            required
            rules={{
              maxLength: presetValidation("maxLength", 50),
            }}
          />
          <CustomDatePicker<AddForm>
            label="Tanggal"
            name="date"
            required
            control={control}
          />
        </form>
      </Drawer>
    </>
  );
}
