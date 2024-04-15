import { useMutation, useQueryClient } from "@tanstack/react-query";

import { AddBox, DeleteOutlined, EditOutlined } from "@mui/icons-material";
import { Button, Grid, IconButton, Sheet, Stack, Typography } from "@mui/joy";
import { useForm, useWatch } from "react-hook-form";
import React from "react";
import { useToast } from "../../../utils/providers/ToastProvider";
import { useDepartmentsListQuery } from "../../../utils/hooks/useDepartmensQuery";
import { presetValidation } from "../../../utils/utils";
import Drawer from "../../../components/Drawer";
import Input from "../../../components/form/Input";
import Table from "../../../components/Table";
import { Department } from "../../../utils/models/department.model";
import {
  createDepartment,
  deleteDepartment,
  updateDepartment,
} from "../../../utils/api/departments.api";
import { useConfirmationDialog } from "../../../utils/providers/ConfirmationProvider";

const ACTIONS = {
  CREATE: "CREATE",
  UPDATE: "UPDATE",
};

interface AddForm {
  id: string;
  action?: typeof ACTIONS.CREATE | typeof ACTIONS.UPDATE;
  name: string;
}

export default function Departments() {
  const { openConfirmation } = useConfirmationDialog();
  const fireToast = useToast();
  const queryClient = useQueryClient();
  const [open, setOpen] = React.useState(false);

  const { handleSubmit, control, reset, setValue } = useForm<AddForm>({
    mode: "onBlur",
    defaultValues: {
      action: ACTIONS.CREATE,
    },
  });

  const { data: departmens, isFetching: isFetchingDepartments } =
    useDepartmentsListQuery();

  const action = useWatch({ name: "action", control });

  const onUpdateData = (data: AddForm) => {
    setValue("action", ACTIONS.UPDATE);
    setValue("id", data.id);
    setValue("name", data.name);
    setOpen(true);
  };

  const { mutateAsync: createDepartmentMutation, isPending: isCreating } =
    useMutation({
      mutationFn: (data: Partial<Department>) => createDepartment(data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["departments"] });
      },
    });

  const { mutateAsync: updateDepartmentMutation, isPending: isUpdating } =
    useMutation({
      mutationFn: (data: Partial<Department>) => updateDepartment(data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["departments"] });
      },
    });

  const { mutateAsync: deleteDepartmentMutation, isPending: isDeleting } =
    useMutation({
      mutationFn: (data: Partial<Department>) => deleteDepartment(data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["departments"] });
      },
    });

  const onSubmit = (data: AddForm) => {
    if (data.action === ACTIONS.CREATE) {
      createDepartmentMutation({
        name: data.name,
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
      updateDepartmentMutation({
        id: data.id,
        name: data.name,
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
        mb={4}
      >
        <Typography level="h4">Department</Typography>
        <Button startDecorator={<AddBox />} onClick={() => onClickAdd()}>
          Tambah Department
        </Button>
      </Stack>

      <Sheet sx={{ width: "100%" }}>
        <Grid container>
          <Grid sm={12}>
            <Table<Department>
              isLoading={isFetchingDepartments}
              tableConfig={[
                {
                  name: "name",
                  label: "Name",
                  render: (data) => data.name || "-",
                },
                {
                  name: "teamTotal",
                  label: "Total Team",
                  style: { width: 120 },
                  render: (data) => (
                    <Typography>{data.totalTeams || "0"}</Typography>
                  ),
                },
                {
                  name: "memberTeam",
                  label: "Total Karyawan",
                  style: { width: 150 },
                  render: (data) => (
                    <Typography>{data.totalEmployees || "0"}</Typography>
                  ),
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
                        onClick={() => onUpdateData(data)}
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
                              await deleteDepartmentMutation({ id });
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
              tableData={departmens || []}
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
        </form>
      </Drawer>
    </>
  );
}
