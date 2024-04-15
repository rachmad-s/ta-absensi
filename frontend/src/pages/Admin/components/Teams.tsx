import { useMutation, useQueryClient } from "@tanstack/react-query";

import { AddBox, DeleteOutlined, EditOutlined } from "@mui/icons-material";
import { Button, Grid, IconButton, Sheet, Stack, Typography } from "@mui/joy";
import { useForm, useWatch } from "react-hook-form";
import React from "react";
import { useToast } from "../../../utils/providers/ToastProvider";
import { getOptionsArray, presetValidation } from "../../../utils/utils";
import Drawer from "../../../components/Drawer";
import Input from "../../../components/form/Input";
import Table from "../../../components/Table";

import { useConfirmationDialog } from "../../../utils/providers/ConfirmationProvider";
import { useTeamsListQuery } from "../../../utils/hooks/useTeamsQuery";
import { Team } from "../../../utils/models/team.model";
import {
  createTeam,
  deleteTeam,
  updateTeam,
} from "../../../utils/api/teams.api";
import Autocomplete from "../../../components/form/Autocomplete";
import { useDepartmentsListQuery } from "../../../utils/hooks/useDepartmensQuery";
import { Department } from "../../../utils/models/department.model";

const ACTIONS = {
  CREATE: "CREATE",
  UPDATE: "UPDATE",
};

interface AddForm {
  id: string;
  action?: typeof ACTIONS.CREATE | typeof ACTIONS.UPDATE;
  name: string;
  departmentId: string;
}

export default function Teams() {
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

  const { data: teams, isFetching: isFetchingTeams } = useTeamsListQuery();
  const { data: departmens, isFetching: isFetchingDepartments } =
    useDepartmentsListQuery();

  const action = useWatch({ name: "action", control });

  const onUpdateData = (data: AddForm) => {
    setValue("action", ACTIONS.UPDATE);
    setValue("id", data.id);
    setValue("name", data.name);
    setValue("departmentId", data.departmentId);
    setOpen(true);
  };

  const { mutateAsync: createTeamMutation, isPending: isCreating } =
    useMutation({
      mutationFn: (data: Partial<Team>) => createTeam(data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["teams"] });
      },
    });

  const { mutateAsync: updateTeamMutation, isPending: isUpdating } =
    useMutation({
      mutationFn: (data: Partial<Team>) => updateTeam(data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["teams"] });
      },
    });

  const { mutateAsync: deleteTeamMutation, isPending: isDeleting } =
    useMutation({
      mutationFn: (data: Partial<Team>) => deleteTeam(data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["teams"] });
      },
    });

  const onSubmit = (data: AddForm) => {
    if (data.action === ACTIONS.CREATE) {
      createTeamMutation({
        name: data.name,
        departmentId: data.departmentId,
      })
        .then(() => {
          fireToast({
            message: "Berhasil menambahkan team baru!",
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
      updateTeamMutation({
        id: data.id,
        name: data.name,
        departmentId: data.departmentId,
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

  const departmentOptions = getOptionsArray<Department>(departmens, (d) => ({
    value: d.id,
    label: d.name,
  }));

  return (
    <>
      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
        mb={4}
      >
        <Typography level="h4">Team</Typography>
        <Button startDecorator={<AddBox />} onClick={() => onClickAdd()}>
          Tambah Team
        </Button>
      </Stack>

      <Sheet sx={{ width: "100%" }}>
        <Grid container>
          <Grid sm={12}>
            <Table<Team>
              isLoading={isFetchingTeams}
              tableConfig={[
                {
                  name: "name",
                  label: "Name",
                  render: (data) => data.name || "-",
                },
                {
                  name: "teamTotal",
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
                              await deleteTeamMutation({ id });
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
              tableData={teams || []}
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
            ? "Tambah Team"
            : action === ACTIONS.UPDATE
            ? "Edit Team"
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
          <Autocomplete<AddForm>
            label="Department"
            name="departmentId"
            control={control}
            required
            isLoading={isFetchingDepartments}
            options={departmentOptions}
          />
        </form>
      </Drawer>
    </>
  );
}
