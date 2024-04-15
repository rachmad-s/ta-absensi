import {
  ArrowForward,
  ArticleOutlined,
  InfoOutlined,
  Print,
} from "@mui/icons-material";
import {
  AspectRatio,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardOverflow,
  Skeleton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/joy";
import { useNavigate } from "react-router-dom";
import CommonFilters from "../../components/CommonFilters";
import ConditionalText from "../../components/ConditionalText";
import Pagination from "../../components/Pagination";
import Table from "../../components/Table";
import { useEmployeesAttendanceQuery } from "../../utils/hooks/useEmployeesAttendanceQuery";
import useGetParam from "../../utils/hooks/useGetParam";
import { useMinimumAttendanceQuery } from "../../utils/hooks/useMinimumAttendanceQuery";
import { AllAttendanceResponse } from "../../utils/models/attendance.model";
import {
  CURRENT_MONTH,
  CURRENT_YEAR,
  MONTHS,
  getDuration,
} from "../../utils/utils";

export function Attendances() {
  const { param } = useGetParam();
  const navigate = useNavigate();

  const [month, year, search, department, team] = [
    param("month") || CURRENT_MONTH,
    param("year") || CURRENT_YEAR,
    param("search"),
    param("department"),
    param("team"),
  ];

  const { data, isFetching } = useEmployeesAttendanceQuery({
    year,
    month,
    search: search || undefined,
    department: department || undefined,
    team: team || undefined,
  });

  const attendances =
    data?.data.filter(
      (user) =>
        user.profile?.team?.department.name.toUpperCase() !== "DIRECTORATE"
    ) || [];

  const { data: minimumAttendance, isFetching: isFetchingMinimumAttendance } =
    useMinimumAttendanceQuery({
      month,
      year,
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
        <Button startDecorator={<Print />} onClick={() => window.print()}>
          Print
        </Button>
      </Stack>

      <CommonFilters
        search={{
          show: true,
          placeholder: "Cari nama",
        }}
        department
        team
        month
        year
      />

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
                  {month && MONTHS[month]} {year}
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
      <div className="printArea">
        <Table<AllAttendanceResponse>
          isLoading={isFetching}
          tableConfig={[
            {
              name: "name",
              label: "Nama",
              style: { width: 170 },
              render(data) {
                return (
                  <Stack direction={"row"} alignItems={"center"} spacing={1}>
                    <Avatar
                      src={data.profile?.avatarUrl}
                      alt={data.profile?.name}
                      size="sm"
                    />
                    <Typography>{data.profile?.name}</Typography>
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
                      className="printHide"
                      style={{
                        fontSize: "14px",
                      }}
                    />
                  </Tooltip>
                ),
              },
              render: (data) => (
                <Typography>
                  {getDuration(data.attendance.averageWorkMinutes)}
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
                      className="printHide"
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
                  {`${data.attendance.minimumWorkDays -
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
                <Typography>
                  {data.attendance.averageWorkMinutes === 0 ||
                    data.attendance.averageWorkMinutes === null
                    ? "N/A"
                    : `${data.attendance.totalLates}x`}
                </Typography>
              ),
            },
            {
              name: "action",
              label: "",
              className: "printHide",
              style: { width: 120 },
              render: (data) => (
                <Button
                  className="printHide"
                  variant="plain"
                  onClick={() => {
                    navigate(
                      `/dashboard/hr/attendances/${data.id}?month=${month}&year=${year}`
                    );
                  }}
                  endDecorator={<ArrowForward />}
                >
                  Detail
                </Button>
              ),
            },
          ]}
          tableData={attendances}
          keyIndex="id"
        />
      </div>

      {data?.pagination && <Pagination pagination={data.pagination} />}
    </>
  );
}
