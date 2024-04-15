import { ArrowBack, ArrowForward } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  List,
  ListDivider,
  ListItem,
  ListItemDecorator,
  Stack,
  Typography
} from "@mui/joy";
import moment from "moment";
import CalendarAttendance, {
  CalendarAttendanceLegend,
} from "../../components/CalendarAttendance";
import Page from "../../components/Page/Page";
import PageContent from "../../components/Page/PageContent";
import PageHeader from "../../components/Page/PageHeader";
import { useAttendancesQuery } from "../../utils/hooks/useAttendancesQuery";
import { useTimeOffQuery } from "../../utils/hooks/useTimeOffQuery";
import { useTimeOffQuotaQuery } from "../../utils/hooks/useTimeOffQuotaQuery";
import { User } from "../../utils/models/user.model";
import { useAuth } from "../../utils/providers/auth/auth.hook";
import { COMMON_TIME_FORMAT, CURRENT_MONTH, CURRENT_YEAR, getTimeOffNameLabel } from "../../utils/utils";

export default function Dashboard() {
  const { user } = useAuth();
  const currentUser = user?.user as User;
  const { data: timeOffQuotas } = useTimeOffQuotaQuery();

  const { data: attendances, isFetching: isFetchingAttendances } =
    useAttendancesQuery({ month: CURRENT_MONTH, year: CURRENT_YEAR, userId: user?.user.id });

  const todayAttendance = attendances?.data.find(attendance => moment(attendance.date).isSame(new Date(), "date"))
  const todayIn = todayAttendance?.attendance.in
  const todayOut = todayAttendance?.attendance.out

  const { data: timeOffs } = useTimeOffQuery({
    month: CURRENT_MONTH,
    status: "APPROVED",
    year: CURRENT_YEAR,
  });

  const todayOff = timeOffs && timeOffs.filter(timeOff => moment(new Date()).isSameOrAfter(moment(timeOff.startDate), "date") && moment(new Date()).isSameOrBefore(moment(timeOff.startDate).add((timeOff.days - 1), "days"), "date"))

  return (
    <Page>
      <PageHeader title={`Hi, ${user?.user.profile?.name}`} />
      <PageContent>
        <Stack direction={"row"} justifyContent={"space-between"} spacing={3} mb={4}>
          <Button variant="soft" color="primary" size="lg" sx={{ flex: 1 }}>Absensi</Button>
          <Button variant="soft" color="primary" size="lg" sx={{ flex: 1 }}>Ajukan Cuti</Button>
          <Button variant="soft" color="primary" size="lg" sx={{ flex: 1 }}>Ajukan Lembur</Button>
        </Stack>
        <Grid container spacing={2}>
          <Grid sm={8}>
            <Card variant="outlined" sx={{
              mb: 3
            }}>
              <CardContent>
                <Typography level="title-lg" mb={3}>
                  Rekap Absensi Anda Selama 4 Bulan Terakhir
                </Typography>

                <Stack
                  direction={"row"}
                  justifyContent={"start"}
                  spacing={3}
                  mb={6}
                >
                  <CalendarAttendance
                    userId={currentUser.id}
                    month={moment(new Date()).subtract(3, "month").month()}
                    year={moment(new Date()).subtract(3, "month").year()}
                  />
                  <CalendarAttendance
                    userId={currentUser.id}
                    month={moment(new Date()).subtract(2, "month").month()}
                    year={moment(new Date()).subtract(2, "month").year()}
                  />
                  <CalendarAttendance
                    userId={currentUser.id}
                    month={moment(new Date()).subtract(1, "month").month()}
                    year={moment(new Date()).subtract(1, "month").year()}
                  />
                  <CalendarAttendance
                    userId={currentUser.id}
                    month={Number(CURRENT_MONTH)}
                    year={Number(CURRENT_YEAR)}
                  />
                </Stack>
                <CalendarAttendanceLegend />
              </CardContent>
            </Card>
            <Card variant="outlined">
              <CardContent>
                <Typography level="title-lg" mb={3}>
                  Kuota Cuti
                </Typography>
                <Stack direction={"row"} spacing={2} mb={2}>
                  {timeOffQuotas &&
                    timeOffQuotas.map((timeOff) => (
                      <Card
                        key={timeOff.name}
                        variant="soft"
                        color="info"
                      >
                        <CardContent>
                          <Typography level="title-sm" color="info" mb={0}>
                            {timeOff.label}
                          </Typography>
                          <Typography level="h4" color="info">
                            {timeOff.quotaLeft < 0 ? 0 : timeOff.quotaLeft}
                            <Typography level="body-sm" fontWeight={400} color="info">
                              {Number(timeOff.duration) > 1 &&
                                " x " + timeOff.duration + " hari"}
                            </Typography>
                          </Typography>
                        </CardContent>
                      </Card>
                    ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid sm={4}>
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Stack direction={"row"} spacing={1} mb={1}>
                  <Typography level="title-lg">Absensi hari ini</Typography>
                </Stack>
              </CardContent>
              <Card
                orientation="horizontal"
                size="sm"
                sx={{ bgcolor: "background.surface", border: 0 }}
              >
                <CardContent>
                  <Stack direction={"row"} spacing={2}>
                    <Box
                      sx={(theme) => ({
                        height: "40px",
                        width: "40px",
                        borderRadius: "5rem",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        background: theme.palette.success[200],
                        color: theme.palette.success[500],
                      })}
                    >
                      <ArrowForward
                        style={{
                          color: "inherit",
                        }}
                      />
                    </Box>
                    <Stack>
                      <Typography level="title-md">Masuk</Typography>
                      <Typography level="body-sm">{todayIn ? moment(todayIn.date).format(COMMON_TIME_FORMAT) : "Belum melakukan absen masuk"}</Typography>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
              <Card
                orientation="horizontal"
                size="sm"
                sx={{ bgcolor: "background.surface", border: 0 }}
              >
                <CardContent>
                  <Stack direction={"row"} spacing={2}>
                    <Box
                      sx={(theme) => ({
                        height: "40px",
                        width: "40px",
                        borderRadius: "5rem",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        background: theme.palette.danger[200],
                        color: theme.palette.danger[500],
                      })}
                    >
                      <ArrowBack
                        style={{
                          color: "inherit",
                        }}
                      />
                    </Box>
                    <Stack>
                      <Typography level="title-md">Keluar</Typography>
                      <Typography level="body-sm">{todayOut ? moment(todayOut.date).format(COMMON_TIME_FORMAT) : "Belum melakukan absen keluar"}</Typography>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            </Card>
            <Card>
              <CardContent>
                <Stack direction={"row"} spacing={1} mb={1}>
                  <Typography level="title-lg">Karyawan Cuti Hari Ini</Typography>
                </Stack>
              </CardContent>
              <List
                variant="plain"
                sx={{
                  minWidth: 240,
                  borderRadius: 'sm',
                }}
              >
                {todayOff?.map(off => (
                  <div key={off.id}>
                    <ListItem>
                      <ListItemDecorator>
                        <Avatar size="sm" src={off.user.profile?.avatarUrl} alt={off.user.profile?.name} />
                      </ListItemDecorator>
                      <Stack>
                        <Typography level="title-sm">{off.user.profile?.name}</Typography>
                        <Typography level="body-sm">{getTimeOffNameLabel(off.type)}</Typography>
                      </Stack>
                    </ListItem>
                    <ListDivider inset={"gutter"} />
                  </div>
                ))}
              </List>
            </Card>
          </Grid>
        </Grid>
      </PageContent>
    </Page>
  );
}
