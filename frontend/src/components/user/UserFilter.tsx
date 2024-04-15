import { CloseRounded, Search } from "@mui/icons-material";
import {
  Box,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  Option,
  Select,
} from "@mui/joy";
import debounce from "lodash/debounce";
import React from "react";
import { SetURLSearchParams } from "react-router-dom";
import { OptionType } from "../../utils/types";

interface ComponentProps {
  setSearchParams: SetURLSearchParams;
  filter?: string | null;
  role?: string | null;
  department?: string | null;
  departmentOptions: OptionType[];
  passive?: boolean;
}

export default function UserFilter(props: ComponentProps) {
  const onSearch = (value: string) => {
    props.setSearchParams((params) => {
      params.set("filter", value);
      params.set("skip", "0");
      return params;
    });
  };
  const deboounceSearch = debounce(onSearch, 1000);
  const searchRef = React.useRef<HTMLInputElement>(null);
  const resetSearch = () => {
    if (searchRef.current) searchRef.current.value = "";
  };

  return (
    <Box
      sx={{
        borderRadius: "sm",
        py: 2,
        display: "flex",
        flexWrap: "wrap",
        gap: 1.5,
        "& > *": {
          minWidth: "200px",
        },
      }}
    >
      <FormControl sx={{ flex: 1 }} size="sm">
        <FormLabel>Cari</FormLabel>
        <Input
          slotProps={{
            input: {
              ref: searchRef,
            },
          }}
          size="sm"
          placeholder="Masukan nama atau email"
          startDecorator={<Search />}
          onChange={(event) => {
            deboounceSearch(event.target.value);
          }}
          {...(props.filter && {
            endDecorator: (
              <IconButton
                sx={{
                  "--IconButton-size": "unset",
                }}
                variant="plain"
                color="neutral"
                onMouseDown={(event) => {
                  event.stopPropagation();
                }}
                onClick={() => {
                  props.setSearchParams((params) => {
                    params.delete("filter");
                    return params;
                  });
                  resetSearch();
                }}
              >
                <CloseRounded />
              </IconButton>
            ),
          })}
        />
      </FormControl>
      <FormControl
        size="sm"
        sx={{
          maxWidth: "200px",
        }}
      >
        <FormLabel>Department</FormLabel>
        <Select
          size="sm"
          slotProps={{ button: { sx: { whiteSpace: "nowrap" } } }}
          value={props.department}
          onChange={(_, value) => {
            const val = value as string;
            props.setSearchParams((params) => {
              params.set("department", val);
              params.set("skip", "0");

              return params;
            });
          }}
          {...(props.department && {
            endDecorator: (
              <IconButton
                sx={{
                  "--IconButton-size": "unset",
                }}
                variant="plain"
                color="neutral"
                onMouseDown={(event) => {
                  event.stopPropagation();
                }}
                onClick={() => {
                  props.setSearchParams((params) => {
                    params.delete("department");
                    return params;
                  });
                }}
              >
                <CloseRounded />
              </IconButton>
            ),
            indicator: null,
          })}
        >
          {props.departmentOptions.map((option) => (
            <Option key={option.value} value={option.value}>
              {option.label}
            </Option>
          ))}
        </Select>
      </FormControl>
      {!props.passive && (
        <FormControl size="sm">
          <FormLabel>Role</FormLabel>
          <Select
            size="sm"
            value={props.role}
            onChange={(_, value) => {
              const val = value as string;
              props.setSearchParams((params) => {
                params.set("role", val);
                params.set("skip", "0");

                return params;
              });
            }}
            {...(props.role && {
              endDecorator: (
                <IconButton
                  sx={{
                    "--IconButton-size": "unset",
                  }}
                  variant="plain"
                  color="neutral"
                  onMouseDown={(event) => {
                    event.stopPropagation();
                  }}
                  onClick={() => {
                    props.setSearchParams((params) => {
                      params.delete("role");
                      return params;
                    });
                  }}
                >
                  <CloseRounded />
                </IconButton>
              ),
              indicator: null,
            })}
          >
            <Option value="USER">User</Option>
            <Option value="ADMIN">Admin</Option>
            <Option value="HR">HR</Option>
          </Select>
        </FormControl>
      )}

    </Box>
  );
}
