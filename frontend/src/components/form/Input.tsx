import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  FormControl,
  FormHelperText,
  FormLabel,
  IconButton,
  Input as JoyInput,
  Textarea,
} from "@mui/joy";
import React from "react";
import {
  Control,
  Controller,
  FieldValues,
  Path,
  RegisterOptions,
} from "react-hook-form";

interface ComponentProps<T extends FieldValues> {
  control: Control<T, any>;
  name: Path<T>;
  label: string;
  required?: boolean;
  disabled?: boolean;
  type?: string;
  rules?: RegisterOptions;
}

export default function Input<T extends FieldValues>({
  control,
  required,
  label,
  name,
  disabled,
  type = "text",
  rules,
}: ComponentProps<T>) {
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <Controller
      control={control}
      name={name}
      rules={{
        required: required ? `${label} Harus diisi` : false,
        ...rules,
      }}
      render={({
        field: { onChange, onBlur, value, name, ref },
        fieldState: { invalid, error },
      }) => (
        <FormControl
          error={invalid}
          required={required}
          sx={{
            mb: "1rem",
          }}
        >
          <FormLabel required={required}>{label}</FormLabel>
          {type === "textarea" ? (
            <Textarea
              minRows={2}
              value={value || ""}
              onChange={onChange}
              name={name}
              onBlur={onBlur}
            />
          ) : (
            <JoyInput
              variant="outlined"
              value={value || ""}
              onChange={onChange}
              name={name}
              onBlur={onBlur}
              disabled={disabled}
              type={
                type === "password"
                  ? showPassword
                    ? "text"
                    : "password"
                  : type
              }
              slotProps={{
                input: {
                  ref,
                },
              }}
              endDecorator={
                type === "password" && (
                  <IconButton
                    tabIndex={-1}
                    onClick={() => setShowPassword(!showPassword)}
                    variant={showPassword ? "soft" : "plain"}
                  >
                    {!showPassword && <Visibility />}
                    {showPassword && <VisibilityOff />}
                  </IconButton>
                )
              }
            />
          )}

          {invalid && <FormHelperText>{error?.message}</FormHelperText>}
        </FormControl>
      )}
    />
  );
}
