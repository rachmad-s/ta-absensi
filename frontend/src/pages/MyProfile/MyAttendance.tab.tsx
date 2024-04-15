import { HelpOutline, History, Schedule, SouthEast } from "@mui/icons-material";
import {
  Card,
  CardContent,
  Grid,
  List,
  Option,
  Select,
  Skeleton,
  Stack,
  Typography,
} from "@mui/joy";
import moment from "moment";
import { useState } from "react";
import AttendanceListItem from "../../components/AttendanceListItem";
import { useAttendancesQuery } from "../../utils/hooks/useAttendancesQuery";
import { useUserDetailQuery } from "../../utils/hooks/useUserDetailQuery";
import { useAuth } from "../../utils/providers/auth/auth.hook";
import {
  COMMON_DATE_ONLY,
  CURRENT_MONTH,
  CURRENT_YEAR,
  MONTHS,
  getDuration,
  monthOptions,
  yearOptions,
} from "../../utils/utils";

export default function MyAttendanceTab() {
  const { user } = useAuth();
  const { data: userDetail } = useUserDetailQuery({
    id: user?.user.id || "",
  });
  const [filter, setFilter] = useState({
    month: String(CURRENT_MONTH),
    year: String(CURRENT_YEAR),
  });

  const renderMinimum = (value: number) => (value < 100 ? value : 100);

  const { data: attendances, isFetching: isFetchingAttendances } =
    useAttendancesQuery({ ...filter, userId: user?.user.id });

  return (
    <>
      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
        mb={1}
      >
        <Typography level="h2">
          {MONTHS[filter.month]} {filter.year}
        </Typography>

        <Grid container direction={"row"} spacing={1} width={300}>
          <Grid sm={6}>
            <Select
              defaultValue={CURRENT_MONTH.toString()}
              variant="solid"
              color="primary"
              onChange={(e, value) => {
                setFilter((prev) => ({
                  ...prev,
                  month: value || "",
                }));
              }}
            >
              {monthOptions.map((month) => (
                <Option value={month.value}>{month.label}</Option>
              ))}
            </Select>
          </Grid>
          <Grid sm={6}>
            <Select
              defaultValue={CURRENT_YEAR.toString()}
              variant="solid"
              color="primary"
              onChange={(e, value) => {
                setFilter((prev) => ({
                  ...prev,
                  year: value || "",
                }));
              }}
            >
              {yearOptions.map((year) => (
                <Option value={year.value}>{year.label}</Option>
              ))}
            </Select>
          </Grid>
        </Grid>
      </Stack>

      <Stack direction={"row"} gap={6} mb={2}>
        <Stack direction="column" gap={"0rem"}>
          <Typography level="body-sm">Periode </Typography>
          <Typography level="title-sm">{moment(attendances?.period.start).format(COMMON_DATE_ONLY)} - {moment(attendances?.period.end).format(COMMON_DATE_ONLY)} ({attendances?.minimumWorkDays} hari)</Typography>
        </Stack>
        <Stack direction="column" gap={"0rem"}>
          <Typography level="body-sm">Total Hadir </Typography>
          <Typography level="title-sm">{attendances?.totalAttendDays} hari</Typography>
        </Stack>
        <Stack direction="column" gap={"0rem"}>
          <Typography level="body-sm">Minimal jam kerja </Typography>
          <Typography level="title-sm">{getDuration(attendances?.minimumWorkMinutes || 0)}</Typography>
        </Stack>
      </Stack>

      {attendances && (
        <Stack direction={"row"} spacing={3} mb={2}>
          <Card
            variant="soft"
            orientation="horizontal"
            invertedColors
            color="info"
          >
            <Schedule sx={{ fontSize: "2rem" }} />
            <CardContent>
              <Typography level="body-sm">Rata Rata Jam Kerja</Typography>
              <Typography level="h3">
                {`${Math.floor(attendances.averageWorkMinutes / 60)} jam `}
                {`${Math.floor(attendances.averageWorkMinutes % 60)} menit`}
              </Typography>
            </CardContent>
          </Card>
          <Card
            variant="soft"
            orientation="horizontal"
            invertedColors
            color="info"
          >
            <History sx={{ fontSize: "2rem" }} />
            <CardContent>
              <Typography level="body-sm">Persentase Jam Kerja</Typography>
              <Typography level="h3">
                {`${renderMinimum(
                  Math.floor(
                    (attendances.totalMinutes /
                      attendances.minimumWorkMinutes) *
                    100
                  )
                )}% `}
              </Typography>
            </CardContent>
          </Card>
          <Card
            variant="soft"
            orientation="horizontal"
            invertedColors
            color="info"
          >
            <HelpOutline sx={{ fontSize: "2rem" }} />
            <CardContent>
              <Typography level="body-sm">Tanpa Keterangan</Typography>
              <Typography level="h3">
                {`${attendances.minimumWorkDays - attendances.totalAttendDays
                  } hari`}
              </Typography>
            </CardContent>
          </Card>
          <Card
            variant="soft"
            orientation="horizontal"
            invertedColors
            color="info"
          >
            <SouthEast sx={{ fontSize: "2rem" }} />
            <CardContent>
              <Typography level="body-sm">Total Keterlambatan</Typography>
              <Typography level="h3">{`${attendances.totalLates}x`}</Typography>
            </CardContent>
          </Card>
        </Stack>
      )}

      <List variant="outlined" sx={{ p: 0, borderRadius: 8 }}>
        {isFetchingAttendances && (
          <Stack py={2} px={2}>
            {Array(30)
              .fill(null)
              .map((_, index) => (
                <Skeleton
                  key={"skeleton_" + index}
                  variant="rectangular"
                  width={"100%"}
                  height="2em"
                  sx={{ mb: 2 }}
                />
              ))}
          </Stack>
        )}
        {userDetail && attendances?.data.map((attendance) => (
          <AttendanceListItem data={attendance} user={userDetail} />
        ))}
      </List>
    </>
  );
}
