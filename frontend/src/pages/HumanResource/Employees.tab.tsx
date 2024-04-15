import { AddBox } from "@mui/icons-material";
import { Button, Grid, Sheet, Stack, Typography } from "@mui/joy";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { useForm, useWatch } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import Drawer from "../../components/Drawer";
import Autocomplete from "../../components/form/Autocomplete";
import Input from "../../components/form/Input";
import Select from "../../components/form/Select";
import UserFilter from "../../components/user/UserFilter";
import UserTable from "../../components/user/UserTable";
import {
  CreateUserPayload,
  EditUserPayload,
  createUser,
  updateUser,
} from "../../utils/api/users.api";
import { useDepartmentsListQuery } from "../../utils/hooks/useDepartmensQuery";
import { useSupervisorListQuery } from "../../utils/hooks/useSupervisorsQuery";
import { useTeamsListQuery } from "../../utils/hooks/useTeamsQuery";
import { useUserQuery } from "../../utils/hooks/useUserQuery";
import { Department } from "../../utils/models/department.model";
import { Supervisor } from "../../utils/models/supervisor.model";
import { Team } from "../../utils/models/team.model";
import { User } from "../../utils/models/user.model";
import { useToast } from "../../utils/providers/ToastProvider";
import {
  LEVEL_ENUM,
  getOptionsArray,
  presetValidation,
} from "../../utils/utils";

const ACTIONS = {
  CREATE: "CREATE",
  UPDATE: "UPDATE",
};

interface AddUserForm extends CreateUserPayload {
  userId: string;
  action: typeof ACTIONS.CREATE | typeof ACTIONS.UPDATE;
  departmentId: string;
  passwordValidation: string;
}

export default function EmployeesTab() {
  const [open, setOpen] = React.useState(false);

  const { handleSubmit, control, reset, setValue } = useForm<AddUserForm>({
    mode: "onBlur",
    defaultValues: {
      action: ACTIONS.CREATE,
      role: "USER",
      level: 0,
    },
  });
  const [searchParams, setSearchParams] = useSearchParams();
  const fireToast = useToast();
  const queryClient = useQueryClient();

  const { data: departmens, isFetching: isFetchingDepartments } =
    useDepartmentsListQuery();

  const departmentId = useWatch({ name: "departmentId", control });
  const action = useWatch({ name: "action", control });

  const { data: teams, isFetching: isFetchingTeams } = useTeamsListQuery(
    {
      departmentId,
    },
    !!departmentId
  );

  const { data: supervisors, isFetching: isFetchingSupervisors } =
    useSupervisorListQuery();

  const { filter, department, role, skip } = {
    filter: searchParams.get("filter"),
    department: searchParams.get("department"),
    role: searchParams.get("role"),
    skip: searchParams.get("skip"),
  };

  const { data: users, isFetching: isFetchingUsers } = useUserQuery({
    filter,
    department,
    role,
    skip,
  });

  const onUpdateData = (user: User) => {
    setValue("action", ACTIONS.UPDATE);
    setValue("userId", user.id);
    setValue("email", user.email);
    setValue("role", user.role);
    if (user.profile?.name) setValue("name", user.profile?.name);
    if (user.profile?.address) setValue("address", user.profile?.address);
    if (user.profile?.teamId) setValue("team", user.profile?.teamId);
    if (user.profile?.level) setValue("level", user.profile?.level);
    if (user.profile?.position) setValue("position", user.profile?.position);
    if (user.profile?.team?.departmentId)
      setValue("departmentId", user.profile?.team.departmentId);
    if (user.supervisor?.id) setValue("supervisorId", user.supervisor?.id);
    setOpen(true);
  };

  const { mutateAsync: createUserMutation, isPending: isCreatingUser } =
    useMutation({
      mutationFn: (data: CreateUserPayload) => createUser(data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["users"] });
        queryClient.invalidateQueries({ queryKey: ["supervisors"] });
      },
    });

  const { mutateAsync: updateUserMutation, isPending: isUpdatingUser } =
    useMutation({
      mutationFn: (data: EditUserPayload) => updateUser(data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["users"] });
        queryClient.invalidateQueries({ queryKey: ["supervisors"] });
      },
    });

  const onSubmit = (data: AddUserForm) => {
    if (data.action === ACTIONS.CREATE) {
      createUserMutation({
        name: data.name,
        password: data.password,
        email: data.email,
        position: data.position,
        team: data.team,
        address: data.address,
        supervisorId: data.supervisorId,
        role: data.role,
        level: Number(data.level),
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
      updateUserMutation({
        name: data.name,
        email: data.email,
        userId: data.userId,
        role: data.role,
        team: data.team,
        position: data.position,
        address: data.address,
        supervisorId: data.supervisorId,
        level: Number(data.level),
      })
        .then((response) => {
          fireToast({
            message: "Berhasil mengubah " + response.data.profile?.name,
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

  const teamOptions = getOptionsArray<Team>(teams, (d) => ({
    value: d.id,
    label: d.name,
  }));
  const departmentOptions = getOptionsArray<Department>(departmens, (d) => ({
    value: d.id,
    label: d.name,
  }));
  const supervisorOptions = getOptionsArray<Supervisor>(supervisors, (d) => ({
    value: d.id,
    label: d.profile?.name || d.email,
  }));
  const levelOptions = Object.values(LEVEL_ENUM);

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
      >
        <Typography level="h4">Karyawan</Typography>
        <Button startDecorator={<AddBox />} onClick={() => onClickAdd()}>
          Tambah Karyawan
        </Button>
      </Stack>

      <Sheet sx={{ width: "100%" }}>
        <Grid container>
          <Grid sm={12}>
            <UserFilter
              departmentOptions={departmentOptions}
              department={department}
              role={role}
              filter={filter}
              setSearchParams={setSearchParams}
            />
            <UserTable
              users={users?.data || []}
              isLoading={isFetchingUsers}
              pagination={users?.pagination}
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
            ? "Tambah User"
            : action === ACTIONS.UPDATE
            ? "Edit User"
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
          <Input<AddUserForm>
            label=""
            name="email"
            control={control}
            type="email"
            required
            rules={{
              minLength: presetValidation("minLength", 6),
              maxLength: presetValidation("maxLength", 30),
            }}
          />

          <Input<AddUserForm>
            label="Nama"
            name="name"
            control={control}
            required
            rules={{
              minLength: presetValidation("minLength", 4),
              maxLength: presetValidation("maxLength", 50),
            }}
          />

          <Input<AddUserForm>
            label="Posisi"
            name="position"
            control={control}
            rules={{
              minLength: presetValidation("minLength", 4),
              maxLength: presetValidation("maxLength", 50),
            }}
          />

          <Input<AddUserForm>
            label="Alamat"
            name="address"
            type="textarea"
            control={control}
          />

          {action === ACTIONS.CREATE && (
            <>
              <Input<AddUserForm>
                label="Password"
                name="password"
                type="password"
                control={control}
                required
                rules={{
                  minLength: presetValidation("minLength", 6),
                  maxLength: presetValidation("maxLength", 30),
                }}
              />

              <Input<AddUserForm>
                label="Ulangi Password"
                name="passwordValidation"
                type="password"
                control={control}
                required
                rules={{
                  validate: {
                    value: (value, form) => {
                      return value === form.password || "Password Tidak Sama";
                    },
                  },
                }}
              />
            </>
          )}

          <Select<AddUserForm>
            label="Level"
            name="level"
            control={control}
            required
            options={levelOptions.map((level, index) => ({
              label: level,
              value: index,
            }))}
          />

          <Select<AddUserForm>
            label="Role"
            name="role"
            control={control}
            required
            options={[
              {
                value: "ADMIN",
                label: "Admin",
              },
              {
                value: "HR",
                label: "Human Resource",
              },
              {
                value: "USER",
                label: "User",
              },
            ]}
          />

          <Autocomplete<AddUserForm>
            label="Department"
            name="departmentId"
            control={control}
            required
            isLoading={isFetchingDepartments}
            options={departmentOptions}
          />

          <Autocomplete<AddUserForm>
            label="Team"
            name="team"
            control={control}
            required
            disabled={!departmentId}
            isLoading={isFetchingTeams}
            options={teamOptions}
          />

          <Autocomplete<AddUserForm>
            label="Supervisor"
            name="supervisorId"
            control={control}
            isLoading={isFetchingSupervisors}
            options={supervisorOptions}
          />
        </form>
      </Drawer>
    </>
  );
}
