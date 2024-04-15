import { FormControl, FormHelperText, FormLabel } from "@mui/joy";
import {
  Control,
  Controller,
  FieldValues,
  Path,
  RegisterOptions,
} from "react-hook-form";
import styles from "./CustomDatePicker.module.css";

import { CalendarMonth } from "@mui/icons-material";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface ComponentProps<T extends FieldValues> {
  control: Control<T, any>;
  name: Path<T>;
  label: string;
  required?: boolean;
  disabled?: boolean;
  type?: string;
  rules?: RegisterOptions;
  minDate?: Date;
}

export default function CustomDatePicker<T extends FieldValues>({
  control,
  required,
  label,
  name,
  type = "text",
  rules,
  minDate,
}: ComponentProps<T>) {
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
          <ReactDatePicker
            showIcon
            icon={<CalendarMonth className={styles["date-icon"]} />}
            selected={value}
            onChange={onChange}
            minDate={minDate}
            className={styles.datePicker}
          />
          {invalid && <FormHelperText>{error?.message}</FormHelperText>}
        </FormControl>
      )}
    />
  );
}
