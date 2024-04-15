import {
  CircularProgress,
  FormControl,
  FormHelperText,
  FormLabel,
  Select as JoySelect,
  Option,
} from "@mui/joy";
import {
  Control,
  Controller,
  FieldValues,
  Path,
  PathValue,
  RegisterOptions,
} from "react-hook-form";

interface ComponentProps<T extends FieldValues> {
  control: Control<T, any>;
  name: Path<T>;
  label: string;
  required?: boolean;
  disabled?: boolean;
  isLoading?: boolean;
  rules?: RegisterOptions;
  defaultValue?: PathValue<T, Path<T>>;
  options: {
    value: string | number;
    label: string;
    disabled?: boolean;
  }[];
}

export default function Select<T extends FieldValues>({
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
        field: { onChange, onBlur, value, name, ref },
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
            <JoySelect
              defaultValue={defaultValue}
              disabled={disabled || isLoading}
              variant="outlined"
              value={value}
              name={name}
              onChange={(e, value) => {
                onChange(value);
              }}
              onBlur={onBlur}
              endDecorator={
                isLoading && (
                  <CircularProgress
                    size="sm"
                    sx={{ bgcolor: "background.surface" }}
                  />
                )
              }
              slotProps={{
                root: {
                  ref,
                },
              }}
            >
              {options.map((option) => (
                <Option key={option.value} value={option.value} disabled={option.disabled}>
                  {option.label}
                </Option>
              ))}
            </JoySelect>
            {invalid && <FormHelperText>{error?.message}</FormHelperText>}
          </FormControl>
        );
      }}
    />
  );
}
