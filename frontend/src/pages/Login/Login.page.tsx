import { Key, Lock, MailOutline } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  Checkbox,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Link,
  Stack,
  Typography
} from "@mui/joy";
import React from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { Navigate } from "react-router-dom";
import { login } from "../../utils/api/auth.api";
import { useAuth } from "../../utils/providers/auth/auth.hook";
import s from "./Login.module.css";

interface LoginForm {
  email: string;
  password: string;
}

export default function LoginPage() {
  const { control, handleSubmit, setError } = useForm<LoginForm>();
  const { saveUser, user, removeUser } = useAuth();
  const [isLoading, setLoading] = React.useState(false);

  const onSubmit: SubmitHandler<LoginForm> = (data) => {
    setLoading(true);
    login(data)
      .then((response) => {
        setLoading(false);
        removeUser()
        saveUser(response);
      })
      .catch((error) => {
        setLoading(false);
        setError("email", { message: error.message, type: "value" });
      });
  };

  if (user) return <Navigate to={"/dashboard"} />;

  return (
    <Box
      className={s["login-page"]}
      sx={(theme) => ({
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      })}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card
          size="lg"
          className={s["login-card"]}
          sx={{
            width: 450,
          }}
        >
          <Stack spacing={5}>
            <Stack
              direction={"row"}
              spacing={1}
              alignItems={"center"}
              justifyContent={"center"}
            >
              <Lock style={{ fontSize: "1.25rem" }} />
              <Typography level="h3" mb={0}>
                Masuk ke akun Anda
              </Typography>
            </Stack>
            <Stack spacing={3}>
              <Controller
                control={control}
                name="email"
                render={({
                  field: { onChange, onBlur, value, name, ref },
                  fieldState: { invalid, error },
                }) => (
                  <FormControl error={invalid}>
                    <FormLabel>Email</FormLabel>
                    <Input
                      variant="outlined"
                      value={value}
                      onChange={onChange}
                      onBlur={onBlur}
                      type={"email"}
                      slotProps={{
                        input: {
                          ref,
                        },
                      }}
                      startDecorator={
                        <MailOutline
                          fontSize="small"
                          style={{
                            opacity: "0.4",
                          }}
                        />
                      }
                    />
                    {invalid && (
                      <FormHelperText>{error?.message}</FormHelperText>
                    )}
                  </FormControl>
                )}
              />

              <Controller
                control={control}
                name="password"
                render={({
                  field: { onChange, onBlur, value, name, ref },
                  fieldState: { invalid, error },
                }) => (
                  <FormControl error={invalid}>
                    <FormLabel>Password</FormLabel>
                    <Input
                      variant="outlined"
                      value={value}
                      onChange={onChange}
                      onBlur={onBlur}
                      type={"password"}
                      slotProps={{
                        input: {
                          ref,
                        },
                      }}
                      startDecorator={
                        <Key
                          fontSize="small"
                          style={{
                            opacity: "0.4",
                          }}
                        />
                      }
                    />
                    {invalid && (
                      <FormHelperText>{error?.message}</FormHelperText>
                    )}
                  </FormControl>
                )}
              />
              <Checkbox label="Simpan selama 30 hari" />
            </Stack>
            <Stack spacing={2}>
              <Button type="submit" loading={isLoading} size="lg">
                Masuk
              </Button>
              <Typography textAlign={"center"}>
                Butuh bantuan? <Link>Hubungi Admin</Link>
              </Typography>
            </Stack>
          </Stack>
        </Card>
      </form>
    </Box>
  );
}
