import { Grid, Sheet, Stack, Typography } from "@mui/joy";
import moment from "moment";
import { useSearchParams } from "react-router-dom";
import AvatarWithOnline from "../../components/AvatarWithOnline";
import Page from "../../components/Page/Page";
import PageContent from "../../components/Page/PageContent";
import PageHeader from "../../components/Page/PageHeader";
import UserFilter from "../../components/user/UserFilter";
import UserTable from "../../components/user/UserTable";
import { useAllAttendancesQuery } from "../../utils/hooks/useAttendancesQuery";
import { useDepartmentsListQuery } from "../../utils/hooks/useDepartmensQuery";
import { useUserQuery } from "../../utils/hooks/useUserQuery";
import { Department } from "../../utils/models/department.model";
import { CURRENT_MONTH, CURRENT_YEAR, getOptionsArray } from "../../utils/utils";

export default function EmployeesPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const { data: departmens } = useDepartmentsListQuery();

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

  const departmentOptions = getOptionsArray<Department>(departmens, (d) => ({
    value: d.id,
    label: d.name,
  }));

  const { data: attendances, isFetching: isFetchingAttendances } =
    useAllAttendancesQuery({ month: CURRENT_MONTH, year: CURRENT_YEAR, date: new Date().getDate().toString() });

  const isIn = (userId: string) => {
    const attendance = attendances && attendances.filter(a => a.userId === userId)
    if (!attendance || attendance?.length < 1) return false;
    const inTime = attendance.find(a => a.type === "IN");
    const outTime = attendance.find(a => a.type === "OUT");
    if (!inTime) return false;
    if (moment(new Date()).isSameOrAfter(inTime.date) || (outTime && moment(new Date()).isBefore(outTime.date))) return true;
    return false
  }

  return (
    <Page>
      <PageHeader title="Karyawan" />
      <PageContent>
        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <Typography level="h4">Karyawan</Typography>
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
                passive
              />
              <UserTable
                users={users?.data || []}
                isLoading={isFetchingUsers}
                pagination={users?.pagination}
                passive
                tableLayout="auto"
                customAvatar={(data) => (
                  <AvatarWithOnline userId={data.id} />
                )}
              />
            </Grid>
          </Grid>
        </Sheet>
      </PageContent>
    </Page>
  );
}
