import {
  ArrowForward,
  ArticleOutlined,
  InfoOutlined,
} from "@mui/icons-material";
import {
  AspectRatio,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardOverflow,
  Grid,
  Option,
  Select,
  Skeleton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/joy";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ConditionalText from "../../components/ConditionalText";
import Table from "../../components/Table";
import { useMinimumAttendanceQuery } from "../../utils/hooks/useMinimumAttendanceQuery";
import { useTeamAttendancesQuery } from "../../utils/hooks/useTeamAttendancesQuery";
import { TeamAttendanceResponse } from "../../utils/models/attendance.model";
import { useAuth } from "../../utils/providers/auth/auth.hook";
import {
  CURRENT_MONTH,
  CURRENT_YEAR,
  MONTHS,
  getDuration,
  monthOptions,
  yearOptions,
} from "../../utils/utils";

export function Attendances() {
  const { user } = useAuth();
  const teamId = user?.user.profile?.teamId;

  const [filter, setFilter] = useState({
    month: String(CURRENT_MONTH),
    year: String(CURRENT_YEAR),
  });

  const navigate = useNavigate();

  const { data, isFetching } = useTeamAttendancesQuery({
    ...filter,
    teamId,
  });

  const { data: minimumAttendance, isFetching: isFetchingMinimumAttendance } =
    useMinimumAttendanceQuery({
      month: filter.month,
      year: filter.year,
    });

  const renderWorkHourPercentage = (value: number) => {
    const adjustedValue = value < 100 ? value : 100;
    return (
      <ConditionalText
        condition={{
          success: adjustedValue >= 95,
          warning: adjustedValue < 95 && adjustedValue > 70,
          danger: adjustedValue < 70,
        }}
      >
        {adjustedValue}%
      </ConditionalText>
    );
  };

  return (
    <>
      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
        mt={2}
        mb={1}
      >
        <Typography
          level="h3"
          startDecorator={
            <ArticleOutlined
              color="primary"
              sx={{ opacity: 0.75 }}
              fontSize="large"
            />
          }
        >
          Rekap Kehadiran
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

      {isFetchingMinimumAttendance && (
        <Skeleton
          height={"2rem"}
          variant="rectangular"
          width={"100%"}
          sx={{ mb: 2 }}
        />
      )}
      {minimumAttendance && (
        <Card orientation="horizontal" variant="soft" color="info">
          <CardOverflow>
            <AspectRatio
              ratio={1}
              sx={{ width: 75 }}
              variant="solid"
              color="info"
            >
              <Box>
                <InfoOutlined />
              </Box>
            </AspectRatio>
          </CardOverflow>

          <CardContent>
            <Stack direction={"row"} spacing={6}>
              <Stack>
                <Typography level="title-sm">Periode</Typography>
                <Typography level="body-sm">
                  {MONTHS[filter.month]} {filter.year}
                </Typography>
              </Stack>
              <Stack>
                <Typography level="title-sm">Total Hari Kerja</Typography>
                <Typography level="body-sm">
                  {minimumAttendance.workDays} hari
                </Typography>
              </Stack>
              <Stack>
                <Typography level="title-sm">Minimal Jam Kerja</Typography>
                <Typography level="body-sm">
                  {getDuration(minimumAttendance.totalWorkMinutes)}
                </Typography>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      )}

      <Table<TeamAttendanceResponse>
        isLoading={isFetching}
        tableConfig={[
          {
            name: "name",
            label: "Nama",
            style: { width: 170 },
            render(data) {
              return (
                <Stack direction={"row"} alignItems={"center"} spacing={1}>
                  <Avatar src={data.avatarUrl} alt={data.name} size="sm" />
                  <Typography>{data.name}</Typography>
                </Stack>
              );
            },
          },
          {
            name: "workHourAverage",
            label: "Rata Rata Jam Kerja",
            labelConfig: {
              startDecorator: (
                <Tooltip
                  title="Rata rata jam kerja karyawan per hari"
                  variant="outlined"
                >
                  <InfoOutlined
                    style={{
                      fontSize: "14px",
                    }}
                  />
                </Tooltip>
              ),
            },
            render: (data) => (
              <Typography>
                {`${Math.floor(data.attendance.averageWorkMinutes / 60)} jam `}
                {`${Math.floor(data.attendance.averageWorkMinutes % 60)} menit`}
              </Typography>
            ),
          },
          {
            name: "workHourPercentage",
            label: "Persentase Jam Kerja",
            labelConfig: {
              startDecorator: (
                <Tooltip
                  title="Persentase dari minimal jam kerja selama sebulan"
                  variant="outlined"
                >
                  <InfoOutlined
                    style={{
                      fontSize: "14px",
                    }}
                  />
                </Tooltip>
              ),
            },
            render: (data) =>
              renderWorkHourPercentage(
                Math.floor(
                  (data.attendance.totalMinutes /
                    data.attendance.minimumWorkMinutes) *
                    100
                )
              ),
          },
          {
            name: "absent",
            label: "Tanpa Keterangan",
            render: (data) => (
              <Typography>
                {`${
                  data.attendance.minimumWorkDays -
                  data.attendance.totalAttendDays
                } hari`}
              </Typography>
            ),
          },
          {
            name: "totalLates",
            label: "Keterlambatan",
            style: {
              width: 120,
            },
            render: (data) => (
              <Typography>{`${data.attendance.totalLates}x`}</Typography>
            ),
          },
          {
            name: "action",
            label: "",
            style: { width: 120 },
            render: (data) => (
              <Button
                variant="plain"
                onClick={() => {
                  navigate(`/dashboard/supervisor/attendances/${data.userId}`);
                }}
                endDecorator={<ArrowForward />}
              >
                Detail
              </Button>
            ),
          },
        ]}
        tableData={data || []}
        keyIndex="id"
      />
    </>
  );
}
