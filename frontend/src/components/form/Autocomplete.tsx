import {
  CircularProgress,
  FormControl,
  FormHelperText,
  FormLabel,
  Autocomplete as JoyAutocomplete,
} from "@mui/joy";
import React from "react";
import {
  Control,
  Controller,
  FieldValues,
  Path,
  PathValue,
  RegisterOptions,
} from "react-hook-form";
import { OptionType } from "../../utils/types";

interface ComponentProps<T extends FieldValues> {
  control: Control<T, any>;
  name: Path<T>;
  label: string;
  required?: boolean;
  disabled?: boolean;
  isLoading?: boolean;
  rules?: RegisterOptions;
  defaultValue?: PathValue<T, Path<T>>;
  options: OptionType[];
}

export default function Autocomplete<T extends FieldValues>({
  control,
  required,
  label,
  name,
  rules,
  options,
  defaultValue,
  disabled,
  isLoading,
}: ComponentProps<T>) {
  const [open, setOpen] = React.useState(false);

  const selected = (value: string) => {
    return options.find((option) => option.value === value) || null;
  };
  return (
    <Controller
      control={control}
      name={name}
      defaultValue={defaultValue}
      rules={{
        required: required ? `${label} Harus diisi` : false,
        ...rules,
      }}
      render={({
        field: { onChange, onBlur, value },
        fieldState: { invalid, error },
      }) => {
        return (
          <FormControl
            error={invalid}
            required={required}
            sx={{
              mb: "1rem",
            }}
          >
            <FormLabel required={required}>{label}</FormLabel>
            <JoyAutocomplete
              onBlur={onBlur}
              onChange={(e, value) => onChange(value && value.value)}
              open={open}
              value={selected(value)}
              onOpen={() => {
                setOpen(true);
              }}
              onClose={() => {
                setOpen(false);
              }}
              getOptionLabel={(option) => option.label || ""}
              options={options}
              loading={isLoading}
              disabled={disabled}
              isOptionEqualToValue={(option, value) =>
                option.label === value.label
              }
              endDecorator={
                isLoading && (
                  <CircularProgress
                    size="sm"
                    sx={{ bgcolor: "background.surface" }}
                  />
                )
              }
            />
            {invalid && <FormHelperText>{error?.message}</FormHelperText>}
          </FormControl>
        );
      }}
    />
  );
}
