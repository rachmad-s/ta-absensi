import { Box, Sheet, Stack, Tooltip, Typography } from "@mui/joy";
import moment from "moment";
import { useAttendancesQuery } from "../utils/hooks/useAttendancesQuery";
import {
  COMMON_DATE_ONLY,
  COMMON_TIME_FORMAT,
  MONTHS,
  getDuration,
} from "../utils/utils";

const isLate = (date?: string) => {
  if (!date) return false;
  const toDate = new Date(date);
  return moment(toDate).isAfter({
    date: toDate.getDate(),
    month: toDate.getMonth(),
    year: toDate.getFullYear(),
    hour: 9,
    minute: 0,
    second: 0,
  });
};

const isAfterToday = (date?: string) => {
  if (!date) return false;
  const toDate = new Date(date);
  return moment(toDate).isAfter();
};

const isToday = (date?: string) => {
  if (!date) return false;

  return moment(date).isSame(moment(new Date()).startOf("D"));
};

export function CalendarAttendanceLegend() {
  return (
    <Stack direction={"row"} justifyContent={"center"} spacing={3}>
      <Stack direction={"row"} spacing={1}>
        <Sheet
          variant="solid"
          sx={{
            height: "24px",
            width: "24px",
            borderRadius: "6px",
            background: "#41e293",
          }}
        />
        <Typography>Hadir</Typography>
      </Stack>
      <Stack direction={"row"} spacing={1}>
        <Sheet
          variant="solid"
          sx={{
            height: "24px",
            width: "24px",
            borderRadius: "6px",
            background: "#dbe71a",
          }}
        />
        <Typography>Terlambat</Typography>
      </Stack>
      <Stack direction={"row"} spacing={1}>
        <Sheet
          variant="solid"
          sx={{
            height: "24px",
            width: "24px",
            borderRadius: "6px",
            background: "#f35135",
          }}
        />
        <Typography>Tidak Hadir</Typography>
      </Stack>
    </Stack>
  );
}

export default function CalendarAttendance({
  userId,
  month,
  year,
}: {
  userId: string;
  month: number;
  year: number;
}) {
  const { data: attendances } = useAttendancesQuery({
    month: String(month),
    year: String(year),
    userId,
  });

  return (
    <Box>
      <Stack direction={"row"}>
        <Typography level="body-md" flex={1} mb={1}>
          {MONTHS[month]} {year}
        </Typography>
      </Stack>
      <Stack
        direction={"row"}
        rowGap={"5px"}
        columnGap={"5px"}
        flexWrap={"wrap"}
        maxWidth={24 * 6}
      >
        {attendances &&
          attendances.data.map((attendance, index) =>
            attendance.isPublicHoliday ? null : (
              <Tooltip
                key={index}
                variant="outlined"
                arrow
                title={
                  <>
                    <Stack direction={"row"} spacing={1}>
                      <Typography level="title-sm">Tanggal</Typography>
                      <Typography level="body-sm">
                        {moment(attendance.date).format(COMMON_DATE_ONLY)}
                      </Typography>
                    </Stack>
                    <Stack direction={"row"} spacing={1}>
                      <Typography level="title-sm">Masuk</Typography>
                      <Typography level="body-sm">
                        {attendance.attendance.in?.date
                          ? moment(attendance.attendance.in.date).format(
                            COMMON_TIME_FORMAT
                          )
                          : "-"}
                      </Typography>
                    </Stack>
                    <Stack direction={"row"} spacing={1}>
                      <Typography level="title-sm">Keluar</Typography>
                      <Typography level="body-sm">
                        {attendance.attendance.out?.date
                          ? moment(attendance.attendance.out.date).format(
                            COMMON_TIME_FORMAT
                          )
                          : "-"}
                      </Typography>
                    </Stack>
                    <Stack direction={"row"} spacing={1}>
                      <Typography level="title-sm">Total Jam Kerja</Typography>
                      <Typography level="body-sm">
                        {attendance.totalWorkMinute
                          ? getDuration(attendance.totalWorkMinute)
                          : "-"}
                      </Typography>
                    </Stack>
                  </>
                }
              >
                <Box
                  key={attendance.date}
                  sx={{
                    height: "24px",
                    width: "24px",
                    borderRadius: "6px",
                    outline: isToday(attendance.date)
                      ? "2px solid #9898ff"
                      : "0px",
                    outlineOffset: "1px",
                    background: isAfterToday(attendance.date)
                      ? "#dbe0e4"
                      : attendance.totalWorkMinute !== null || attendance.attendance.in
                        ? isLate(attendance.attendance.in?.date)
                          ? "#dbe71a"
                          : "#41e293"
                        : "#f35135",
                  }}
                />
              </Tooltip>
            )
          )}
      </Stack>
    </Box>
  );
}
