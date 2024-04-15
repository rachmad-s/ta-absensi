import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import {
  Avatar,
  AvatarGroup,
  Box,
  IconButton,
  Sheet,
  Stack,
  Table,
  Tooltip,
  Typography,
} from "@mui/joy";
import moment from "moment";
import React from "react";
import Page from "../../components/Page/Page";
import PageContent from "../../components/Page/PageContent";
import PageHeader from "../../components/Page/PageHeader";
import { usePublicHolidayListQuery } from "../../utils/hooks/usePublicHolidayQuery";
import { useTimeOffQuery } from "../../utils/hooks/useTimeOffQuery";
import { TimeOff } from "../../utils/models/timeOff.model";
import { DAYS, MONTHS, getTimeOffNameLabel } from "../../utils/utils";

interface TimeOffByDate {
  [key: string]: { id: string; avatar?: string; name: string; type: string }[];
}

const generateTimeOff = (
  timeOffs: TimeOff[],
  setTimeOffByDate: React.Dispatch<React.SetStateAction<TimeOffByDate>>
) => {
  setTimeOffByDate((prevState) => {
    const timeOffByDate: TimeOffByDate = { ...prevState };
    for (let i = 0; i < timeOffs.length; i++) {
      const duration = timeOffs[i].days;

      let startRange = moment(timeOffs[i].startDate);
      const endRange = moment(timeOffs[i].startDate).add(duration, "days");

      while (startRange < endRange) {
        timeOffByDate[startRange.toDate().toISOString()] = [
          ...(timeOffByDate[startRange.toDate().toISOString()] || []),
        ];

        if (
          !(
            (timeOffByDate[startRange.toDate().toISOString()] || []).findIndex(
              (prevTimeOff) => prevTimeOff.id === timeOffs[i].id
            ) > -1
          )
        ) {
          timeOffByDate[startRange.toDate().toISOString()].push({
            id: timeOffs[i].id,
            avatar: timeOffs[i].user?.profile?.avatarUrl,
            name: timeOffs[i].user?.profile?.name || "",
            type: timeOffs[i].type
          });
        }

        startRange.add(1, "days");
      }
    }
    return timeOffByDate;
  });
};

export default function Calendar() {
  const [calendar, setCalendar] = React.useState({
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
  });
  const [timeOffByDate, setTimeOffByDate] = React.useState<TimeOffByDate>({});

  const { data: timeOffs } = useTimeOffQuery({
    month: String(calendar.month),
    status: "APPROVED",
    year: String(calendar.year),
  });

  const { data: publicHolidays } = usePublicHolidayListQuery({
    month: String(calendar.month),
    year: String(calendar.year),
  });

  React.useEffect(() => {
    if (timeOffs) generateTimeOff(timeOffs, setTimeOffByDate);
  }, [timeOffs]);

  const onPrev = () => {
    setCalendar((prev) => {
      if (prev.month === 0) {
        return {
          month: 11,
          year: prev.year - 1,
        };
      }
      return {
        ...prev,
        month: prev.month - 1,
      };
    });
  };

  const onNext = () => {
    setCalendar((prev) => {
      if (prev.month === 11) {
        return {
          month: 0,
          year: prev.year + 1,
        };
      }
      return {
        ...prev,
        month: prev.month + 1,
      };
    });
  };

  const days = moment({
    month: calendar.month,
    year: calendar.year,
  }).daysInMonth();

  const startsFrom = moment({
    month: calendar.month,
    year: calendar.year,
  })
    .startOf("M")
    .day();

  const getCalendarDay = (rowIndex: number, dataIndex: number) => {
    const indexNumber = 7 * rowIndex + dataIndex + 1;
    const dayNumber = indexNumber - startsFrom;
    const asIsoString = moment({
      date: dayNumber,
      month: calendar.month,
      year: calendar.year,
    }).toISOString();
    const isPublicHoliday = publicHolidays?.find(
      (publicHoliday) => publicHoliday.date === asIsoString
    );
    const isHoliday =
      Boolean(isPublicHoliday) || dataIndex === 0 || dataIndex === 6;

    return indexNumber > startsFrom && dayNumber <= days ? (
      <td
        style={{
          background:
            asIsoString === moment(new Date()).startOf("D").toISOString()
              ? "#dddfe3"
              : "",
        }}
      >
        <Stack height={"100%"}>
          <Stack mb={1}>
            <Typography
              color={isHoliday ? "danger" : "neutral"}
              fontWeight={600}
            >
              {dayNumber}
            </Typography>
            {isPublicHoliday && (
              <Typography
                color={isHoliday ? "danger" : "neutral"}
                fontWeight={400}
              >
                {isPublicHoliday.name}
              </Typography>
            )}
          </Stack>

          {timeOffByDate && timeOffByDate[asIsoString] && (
            <AvatarGroup sx={{ flexWrap: "wrap" }}>
              {timeOffByDate[asIsoString].map((timeoff) => (
                <Tooltip title={timeoff.name + " - " + getTimeOffNameLabel(timeoff.type)} variant="outlined">
                  <Avatar
                    size="sm"
                    src={timeoff.avatar}
                    alt={timeoff.name}
                    variant="outlined"
                    color="danger"
                    sx={{
                      borderWidth: "3px",
                    }}
                  />
                </Tooltip>
              ))}
            </AvatarGroup>
          )}
        </Stack>
      </td>
    ) : (
      <td></td>
    );
  };

  return (
    <Page>
      <PageHeader title="Kalender Perusahaan" />
      <PageContent>
        <Sheet
          sx={{
            py: 2,
          }}
        >
          <Box mb={3}>
            <Stack direction={"row"}>
              <IconButton variant="outlined" color="neutral" onClick={onPrev}>
                <ChevronLeft />
              </IconButton>
              <Typography level="h3" textAlign={"center"} flex={1}>
                {MONTHS[calendar.month]} {calendar.year}
              </Typography>
              <IconButton variant="outlined" color="neutral" onClick={onNext}>
                <ChevronRight />
              </IconButton>
            </Stack>
          </Box>
          <Table borderAxis="bothBetween">
            <thead>
              <tr>
                {Object.values(DAYS).map((day) => (
                  <th>{day}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array(Math.ceil((days + startsFrom) / 7))
                .fill(null)
                .map((_, rowIndex) => (
                  <tr style={{ height: 150 }}>
                    {Object.values(DAYS).map((_, dataIndex) =>
                      getCalendarDay(rowIndex, dataIndex)
                    )}
                  </tr>
                ))}
            </tbody>
          </Table>
        </Sheet>
      </PageContent>
    </Page>
  );
}
