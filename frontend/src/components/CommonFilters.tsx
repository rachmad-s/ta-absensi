import { CloseRounded, FilterAltOutlined, Search } from "@mui/icons-material";
import {
  Avatar,
  AvatarGroup,
  Box,
  IconButton,
  Input,
  Option,
  Select,
  Stack,
  Tooltip,
} from "@mui/joy";
import { debounce } from "lodash";
import React from "react";
import { SetURLSearchParams, useSearchParams } from "react-router-dom";
import { URLSearchParams } from "url";
import { useDepartmentsListQuery } from "../utils/hooks/useDepartmensQuery";
import { useTeamsListQuery } from "../utils/hooks/useTeamsQuery";
import { useUserQuery } from "../utils/hooks/useUserQuery";
import { Department } from "../utils/models/department.model";
import { Team } from "../utils/models/team.model";
import {
  CURRENT_YEAR,
  getOptionsArray,
  monthOptions,
  yearOptions,
} from "../utils/utils";
import s from "./CommonFilter.module.css";

interface FilterFieldProps {
  searchParams: URLSearchParams;
  setSearchParams: SetURLSearchParams;
}

const MonthFilter = ({ searchParams, setSearchParams }: FilterFieldProps) => {
  const monthSelect = React.useRef<{
    focusVisible: () => void;
  }>(null);
  const selectedMonth = searchParams.get("month");
  return (
    <Select
      size="sm"
      action={monthSelect}
      value={selectedMonth}
      variant="outlined"
      placeholder="Pilih Bulan"
      onChange={(e, value) => {
        setSearchParams((params) => {
          if (value) params.set("month", value);
          return params;
        });
      }}
      {...(selectedMonth && {
        endDecorator: (
          <IconButton
            size="sm"
            sx={{
              "--IconButton-size": "unset",
            }}
            variant="plain"
            color="neutral"
            onMouseDown={(event) => {
              event.stopPropagation();
            }}
            onClick={() => {
              setSearchParams((params) => {
                params.delete("month");
                return params;
              });
              monthSelect.current?.focusVisible();
            }}
          >
            <CloseRounded />
          </IconButton>
        ),
        indicator: null,
      })}
    >
      {monthOptions.map((month) => (
        <Option value={month.value} key={`month-options-${month.value}`}>
          {month.label}
        </Option>
      ))}
    </Select>
  );
};

const YearFilter = ({ searchParams, setSearchParams }: FilterFieldProps) => {
  return (
    <Select
      size="sm"
      defaultValue={CURRENT_YEAR.toString()}
      variant="outlined"
      onChange={(e, value) => {
        setSearchParams((params) => {
          if (value) params.set("year", value);
          return params;
        });
      }}
    >
      {yearOptions.map((year) => (
        <Option value={year.value} key={`year-options-${year.value}`}>
          {year.label}
        </Option>
      ))}
    </Select>
  );
};

const SearchInput = ({ searchParams, setSearchParams }: FilterFieldProps) => {
  const onSearch = (value: string) => {
    setSearchParams((params) => {
      params.set("search", value);
      return params;
    });
  };
  const deboounceSearch = debounce(onSearch, 1000);
  const searchRef = React.useRef<HTMLInputElement>(null);
  const value = searchParams.get("search");
  const resetSearch = () => {
    if (searchRef.current) searchRef.current.value = "";
  };
  return (
    <Input
      slotProps={{
        input: {
          ref: searchRef,
        },
      }}
      defaultValue={value || ""}
      size="sm"
      placeholder="Cari nama"
      startDecorator={<Search />}
      onChange={(event) => {
        deboounceSearch(event.target.value);
      }}
      {...(value && {
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
              setSearchParams((params) => {
                params.delete("search");
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
  );
};

const DepartmentFilter = ({
  searchParams,
  setSearchParams,
}: FilterFieldProps) => {
  const value = searchParams.get("department");
  const { data: departmens, isFetching: isFetchingDepartments } =
    useDepartmentsListQuery();
  const departmentOptions = getOptionsArray<Department>(departmens, (d) => ({
    value: d.id,
    label: d.name,
  }));

  return (
    <Select
      size="sm"
      placeholder="Pilih department"
      slotProps={{ button: { sx: { whiteSpace: "nowrap" } } }}
      value={value}
      disabled={isFetchingDepartments}
      onChange={(_, value) => {
        const val = value as string;
        setSearchParams((params) => {
          params.set("department", val);

          return params;
        });
      }}
      {...(value && {
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
              setSearchParams((params) => {
                params.delete("department");
                params.delete("team");
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
      {departmentOptions.map((option) => (
        <Option key={option.value} value={option.value}>
          {option.label}
        </Option>
      ))}
    </Select>
  );
};

const TeamFilter = ({ searchParams, setSearchParams }: FilterFieldProps) => {
  const value = searchParams.get("team");
  const departmentId = searchParams.get("department");
  const { data: teams, isFetching: isFetchingTeams } = useTeamsListQuery(
    {
      departmentId: departmentId || "",
    },
    Boolean(departmentId)
  );
  const teamOptions = getOptionsArray<Team>(teams, (d) => ({
    value: d.id,
    label: d.name,
  }));

  return (
    <Select
      size="sm"
      placeholder="Pilih team"
      slotProps={{ button: { sx: { whiteSpace: "nowrap" } } }}
      value={value}
      disabled={isFetchingTeams || !departmentId}
      onChange={(_, value) => {
        const val = value as string;
        setSearchParams((params) => {
          params.set("team", val);

          return params;
        });
      }}
      {...(value && {
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
              setSearchParams((params) => {
                params.delete("team");
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
      {teamOptions.map((option) => (
        <Option key={option.value} value={option.value}>
          {option.label}
        </Option>
      ))}
    </Select>
  );
};

interface UserFilterProps extends FilterFieldProps {
  teamId: string;
}

const UserFilter = ({
  searchParams,
  setSearchParams,
  teamId,
}: UserFilterProps) => {
  const selectedUser = searchParams.get("userId");
  const { data: users } = useUserQuery({
    team: teamId,
    take: "50",
  });
  return (
    <AvatarGroup
      sx={{ flexDirection: "row-reverse", justifyContent: "flex-end" }}
    >
      {users?.data.map((user, key) => (
        <Tooltip title={user.profile?.name}>
          <div
            onClick={() =>
              setSearchParams((param) => {
                if (param.get("userId") === user.id) {
                  param.delete("userId");
                } else {
                  param.set("userId", user.id);
                }
                return param;
              })
            }
            className={`${s["avatarButton"]} ${
              selectedUser === user.id && s["active"]
            }`}
            style={{
              zIndex: selectedUser === user.id ? 20 : key,
            }}
          >
            <Avatar
              src={user.profile?.avatarUrl}
              alt={user.profile?.name}
              size="sm"
            />
          </div>
        </Tooltip>
      ))}
    </AvatarGroup>
  );
};

interface ComponentProps {
  search?: {
    show: boolean;
    placeholder: string;
  };
  month?: boolean;
  year?: boolean;
  department?: boolean;
  team?: boolean;
  users?: {
    show: boolean;
    teamId: string;
  };
}

export default function CommonFilters(props: ComponentProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  return (
    <Stack direction={"row"} spacing={1.5} justifyContent={"space-between"}>
      {props.search && props.search.show && (
        <Box width={300}>
          <SearchInput
            searchParams={searchParams}
            setSearchParams={setSearchParams}
          />
        </Box>
      )}

      <Stack direction={"row"} spacing={1.5} alignItems={"center"}>
        <FilterAltOutlined />
        {props.department && (
          <Box width={150}>
            <DepartmentFilter
              searchParams={searchParams}
              setSearchParams={setSearchParams}
            />
          </Box>
        )}
        {props.team && (
          <Box width={150}>
            <TeamFilter
              searchParams={searchParams}
              setSearchParams={setSearchParams}
            />
          </Box>
        )}
        {props.month && (
          <Box width={150}>
            <MonthFilter
              searchParams={searchParams}
              setSearchParams={setSearchParams}
            />
          </Box>
        )}
        {props.year && (
          <Box width={150}>
            <YearFilter
              searchParams={searchParams}
              setSearchParams={setSearchParams}
            />
          </Box>
        )}
        {props.users && props.users.show && (
          <Box>
            <UserFilter
              teamId={props.users.teamId}
              searchParams={searchParams}
              setSearchParams={setSearchParams}
            />
          </Box>
        )}
      </Stack>
    </Stack>
  );
}
