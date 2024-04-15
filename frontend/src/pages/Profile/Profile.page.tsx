import { Edit } from "@mui/icons-material";
import {
  AspectRatio,
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Card,
  CardContent,
  CardOverflow,
  Grid,
  Stack,
  Tooltip,
  Typography
} from "@mui/joy";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import moment from "moment";
import React, { ChangeEvent } from "react";
import { useForm } from "react-hook-form";
import { Link, useParams } from "react-router-dom";
import CalendarAttendance, {
  CalendarAttendanceLegend,
} from "../../components/CalendarAttendance";
import Drawer from "../../components/Drawer";
import Page from "../../components/Page/Page";
import PageContent from "../../components/Page/PageContent";
import PageHeader from "../../components/Page/PageHeader";
import Input from "../../components/form/Input";
import UploadFile from "../../components/form/UploadFile";
import { UploadAttendancePayload, uploadAttendance } from "../../utils/api/upload.api";
import { EditUserPayload, updateUser } from "../../utils/api/users.api";
import { useUserDetailQuery } from "../../utils/hooks/useUserDetailQuery";
import { User } from "../../utils/models/user.model";
import { useToast } from "../../utils/providers/ToastProvider";
import { useAuth } from "../../utils/providers/auth/auth.hook";
import {
  COMMON_DATE_ONLY,
  CURRENT_MONTH,
  CURRENT_YEAR,
  LEVEL_ENUM,
  presetValidation,
} from "../../utils/utils";

interface EditUserForm extends Partial<EditUserPayload> {
  userId: string;
}

export default function Profile() {
  const { id } = useParams();
  const { user: userLoggedIn } = useAuth();
  const { data: user } = useUserDetailQuery({ id: id || "" });
  const fireToast = useToast();
  const [open, setOpen] = React.useState(false);
  const queryClient = useQueryClient();
  const [pageKey, setPageKey] = React.useState(Date.now());

  const { handleSubmit, control, reset, setValue } = useForm<EditUserForm>({
    mode: "onBlur",
  });

  const onUpdateData = (user: User) => {
    setValue("userId", user.id);
    setValue("email", user.email);
    if (user.profile?.name) setValue("name", user.profile?.name);
    if (user.profile?.address) setValue("address", user.profile?.address);
    setOpen(true);
  };

  const { mutateAsync: updateUserMutation, isPending: isUpdatingUser } =
    useMutation({
      mutationFn: (data: Partial<EditUserPayload>) => updateUser(data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["user", user?.id] })
        queryClient.refetchQueries({ queryKey: ["user", user?.id] })
      }
    });

  const onSubmit = (data: EditUserForm) => {

    updateUserMutation({
      userId: data.userId,
      name: data.name || "",
      address: data.address || "",
      email: data.email || "",
      avatarUrl: data.avatarUrl,
      team: user?.profile?.teamId
    })
      .then((response) => {
        fireToast({
          message: "Berhasil mengubah " + response.data.profile?.name,
        });
        reset();
        setOpen(false);
        setPageKey(Date.now())
      })
      .catch((error) => {
        fireToast({
          error: true,
          message: error?.message || "Oops! Terjadi Error",
        });
      });
  };

  const { mutateAsync: uploadImageMutation, isPending: isUploading } =
    useMutation({
      mutationFn: (data: UploadAttendancePayload) => uploadAttendance(data),

    });

  const onUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]

      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onerror = function (error) {
        console.log('Error: ', error);
      };
      reader.onload = function () {
        uploadImageMutation({ image: reader.result as any }).then(uploadRes => {
          setValue("avatarUrl", uploadRes.path)
        })
      }
    }
  }


  return (
    <Page key={pageKey}>
      <PageHeader title="Profil" />
      <PageContent>
        <Box py={4} px={2}>
          <Grid container spacing={4}>
            <Grid sm={8}>
              <Stack spacing={4}>
                <Card variant="plain" orientation="horizontal">
                  <CardOverflow>
                    <AspectRatio ratio={1} variant="plain" sx={{ width: 100 }}>
                      <Avatar
                        src={user?.profile?.avatarUrl}
                        alt={user?.profile?.name}
                      />
                    </AspectRatio>
                  </CardOverflow>
                  <CardContent>
                    <Stack direction={"row"} justifyContent={"space-between"} alignItems={"start"}>
                      <div>
                        <Typography level="h2">{user?.profile?.name}</Typography>
                        <Typography>{user?.email}</Typography>
                      </div>
                      {userLoggedIn?.user.id === user?.id && (
                        <Button startDecorator={<Edit />} onClick={() => user && onUpdateData(user)} variant="outlined">
                          Edit
                        </Button>
                      )}

                    </Stack>
                  </CardContent>
                </Card>
                <Card variant="outlined">
                  <CardContent>
                    <Grid container spacing={2} sx={{ flexGrow: 1 }}>
                      <Grid sm={6}>
                        <Stack>
                          <Typography level="title-md">Posisi</Typography>
                          <Typography level="body-md">
                            {user?.profile?.position || "-"}
                          </Typography>
                        </Stack>
                      </Grid>
                      <Grid sm={6}>
                        <Stack>
                          <Typography level="title-md">Level</Typography>
                          <Typography level="body-md">
                            {user?.profile?.level !== undefined
                              ? LEVEL_ENUM[user?.profile?.level]
                              : "-"}
                          </Typography>
                        </Stack>
                      </Grid>
                      <Grid sm={6}>
                        <Stack>
                          <Typography level="title-md">
                            Tanggal Bergabung
                          </Typography>
                          <Typography level="body-md">
                            {moment(user?.profile?.createdAt).format(
                              COMMON_DATE_ONLY
                            )}
                          </Typography>
                        </Stack>
                      </Grid>
                      <Grid sm={6}>
                        <Stack>
                          <Typography level="title-md">
                            Tanggal Lahir
                          </Typography>
                          <Typography level="body-md">
                            {user?.profile?.dob || "-"}
                          </Typography>
                        </Stack>
                      </Grid>
                      <Grid sm={6}>
                        <Stack>
                          <Typography level="title-md">Alamat</Typography>
                          <Typography level="body-md">
                            {user?.profile?.address || "-"}
                          </Typography>
                        </Stack>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Stack>
            </Grid>
            <Grid sm={4}>
              <Card variant="outlined" sx={{ height: "100%" }}>
                <CardContent>
                  <Stack spacing={2}>
                    <Stack>
                      <Typography level="title-md">Team</Typography>
                      <Typography level="body-md">
                        {user?.profile?.team?.name || "-"}
                      </Typography>
                    </Stack>
                    <Stack>
                      <Typography level="title-md">Department</Typography>
                      <Typography level="body-md">
                        {user?.profile?.team?.department.name || "-"}
                      </Typography>
                    </Stack>
                    {user?.supervisor && (
                      <Stack>
                        <Typography level="title-md" mb={1}>
                          Supervisor
                        </Typography>
                        <Link
                          to={`/dashboard/profile/${user.supervisor.id}`}
                          className="reset-link"
                        >
                          <Stack
                            direction={"row"}
                            spacing={1}
                            alignItems={"center"}
                          >
                            <Avatar
                              src={user?.supervisor?.profile?.avatarUrl}
                              alt={user?.supervisor?.profile?.name}

                            />
                            <Box>
                              <Typography level="body-md">
                                {user?.supervisor?.profile?.name}
                              </Typography>
                              <Typography level="body-sm">
                                {user?.supervisor?.profile?.position}
                              </Typography>
                            </Box>
                          </Stack>
                        </Link>
                      </Stack>
                    )}
                    {user?.supervising && user?.supervising?.length > 0 && (
                      <Stack>
                        <Typography level="title-md" mb={1}>
                          Subordinate
                        </Typography>
                        <AvatarGroup>
                          {user.supervising.map((subordinate) => (
                            <Link
                              to={`/dashboard/profile/${subordinate.id}`}
                              className="reset-link"
                            >
                              <Tooltip title={subordinate.profile?.name}>
                                <Avatar
                                  src={subordinate.profile?.avatarUrl}
                                  alt={subordinate.profile?.name}
                                />
                              </Tooltip>
                            </Link>
                          ))}
                        </AvatarGroup>
                      </Stack>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          <Box>
            {user && (
              <>
                <Card variant="outlined" sx={{ mt: 4 }}>
                  <CardContent>
                    <Typography level="title-lg" mb={3}>
                      Absensi 6 bulan terakhir
                    </Typography>

                    <Stack
                      direction={"row"}
                      justifyContent={"center"}
                      spacing={3}
                      mb={6}
                    >
                      <CalendarAttendance
                        userId={user.id}
                        month={moment(new Date()).subtract(5, "month").month()}
                        year={moment(new Date()).subtract(5, "month").year()}
                      />
                      <CalendarAttendance
                        userId={user.id}
                        month={moment(new Date()).subtract(4, "month").month()}
                        year={moment(new Date()).subtract(4, "month").year()}
                      />
                      <CalendarAttendance
                        userId={user.id}
                        month={moment(new Date()).subtract(3, "month").month()}
                        year={moment(new Date()).subtract(3, "month").year()}
                      />
                      <CalendarAttendance
                        userId={user.id}
                        month={moment(new Date()).subtract(2, "month").month()}
                        year={moment(new Date()).subtract(2, "month").year()}
                      />
                      <CalendarAttendance
                        userId={user.id}
                        month={moment(new Date()).subtract(1, "month").month()}
                        year={moment(new Date()).subtract(1, "month").year()}
                      />
                      <CalendarAttendance
                        userId={user.id}
                        month={Number(CURRENT_MONTH)}
                        year={Number(CURRENT_YEAR)}
                      />
                    </Stack>
                    <CalendarAttendanceLegend />
                  </CardContent>
                </Card>
              </>
            )}
          </Box>
        </Box>
      </PageContent>
      <Drawer
        open={open}
        setOpen={setOpen}
        title={
          "Edit User"
        }
        onDrawerClose={() => reset()}
        primaryButton={{
          props: {
            disabled: isUpdatingUser || isUploading,
            loading: isUpdatingUser,
          },
          onClick: handleSubmit(onSubmit),
        }}
        secondaryButton={{
          onClick: reset,
        }}
      >
        <form encType="multipart/form-data">
          <Input<EditUserForm>
            label="Email"
            name="email"
            control={control}
            disabled={true}
            type="email"
            required
            rules={{
              minLength: presetValidation("minLength", 6),
              maxLength: presetValidation("maxLength", 30),
            }}
          />

          <Input<EditUserForm>
            label="Nama"
            name="name"
            control={control}
            required
            rules={{
              minLength: presetValidation("minLength", 4),
              maxLength: presetValidation("maxLength", 50),
            }}
          />

          <Input<EditUserForm>
            label="Alamat"
            name="address"
            control={control}
            type="textarea"
            required
          />

          <UploadFile
            isLoading={isUploading}
            label="Foto Profile"
            name="avatarUrl"
            onChange={onUpload}
          />

        </form>
      </Drawer>
    </Page>
  );
}
