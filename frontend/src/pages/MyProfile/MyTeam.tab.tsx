import {
  Avatar,
  AvatarGroup,
  Box,
  Card,
  CardContent,
  Divider,
  Grid,
  Skeleton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/joy";
import moment from "moment";
import Table from "../../components/Table";
import { useTeamDetailByIdQuery } from "../../utils/hooks/useTeamDetailQuery";
import { useTimeOffQuery } from "../../utils/hooks/useTimeOffQuery";
import { useUserDetailQuery } from "../../utils/hooks/useUserDetailQuery";
import { Profile } from "../../utils/models/profile.mode";
import { TimeOff } from "../../utils/models/timeOff.model";
import { User } from "../../utils/models/user.model";
import { useAuth } from "../../utils/providers/auth/auth.hook";
import { COMMON_DATE_ONLY, LEVEL_ENUM } from "../../utils/utils";

const RenderEmail = ({ userId = "" }: { userId?: string }) => {
  const { data, isFetching } = useUserDetailQuery({ id: userId });

  if (isFetching || !data?.email) {
    return (
      <Skeleton
        variant="rectangular"
        width={"100%"}
        height="2em"
        sx={{ mb: 2 }}
      />
    );
  }
  return <Typography>{data?.email}</Typography>;
};

interface TeamTimeOff {
  [key: string]: User[];
}

const generateTeamTimeOff = (timeOffs: TimeOff[], prevState?: TeamTimeOff) => {
  const result = prevState || {};
  timeOffs.forEach((timeOff) => {
    if (timeOff.days > 1) {
      let startDate = moment(timeOff.startDate);
      let endDate = moment(timeOff.startDate).add(timeOff.days, "days");

      while (startDate < endDate) {
        if (result.hasOwnProperty(startDate.toDate().toISOString())) {
          if (
            result[startDate.toDate().toISOString()].findIndex(
              (user) => user.id === timeOff.user.id
            ) < 0
          ) {
            result[startDate.toDate().toISOString()].push(timeOff.user);
          }
        } else {
          result[startDate.toDate().toISOString()] = [timeOff.user];
        }
        startDate.add(1, "day");
      }
    } else {
      if (result.hasOwnProperty(timeOff.startDate)) {
        if (
          result[timeOff.startDate].findIndex(
            (user) => user.id === timeOff.user.id
          ) < 0
        ) {
          result[timeOff.startDate].push(timeOff.user);
        }
      } else {
        result[timeOff.startDate] = [timeOff.user];
      }
    }
  });
  return result;
};

export default function MyTeamTab() {
  const { user } = useAuth();
  const teamId = user?.user.profile?.teamId;
  const { data: team, isFetching: isFetchingTeam } = useTeamDetailByIdQuery(
    teamId || ""
  );

  const { data: timeOffs, isFetching: isFetchingTimeOffs } = useTimeOffQuery({
    teamId,
    status: "APPROVED",
    month: new Date().getMonth().toString(),
    year: new Date().getFullYear().toString(),
  });

  const teamTimeOffs: TeamTimeOff =
    timeOffs && !isFetchingTimeOffs ? generateTeamTimeOff(timeOffs) : {};

  if (isFetchingTeam) {
    return (
      <Stack py={2} px={2}>
        {Array(5)
          .fill(null)
          .map((_, index) => (
            <Skeleton
              key={"skeleton_" + index}
              variant="rectangular"
              width={"100%"}
              height="3rem"
              sx={{ mb: 3 }}
            />
          ))}
      </Stack>
    );
  }

  return (
    <>
      <Stack spacing={1} mb={3}>
        <Typography level="h3">{team?.name}</Typography>
        <Typography>Department: {team?.department.name}</Typography>
      </Stack>
      <Grid container spacing={4}>
        <Grid sm={9}>
          <Table<Profile>
            isLoading={isFetchingTeam}
            tableConfig={[
              {
                name: "name",
                label: "Nama",
                style: { width: 200 },
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
                name: "email",
                label: "Email",
                style: { width: 150 },
                render(data) {
                  return <RenderEmail userId={data.userId} />;
                },
              },
              {
                name: "position",
                label: "Posisi",
                dataIndex: "position",
              },
              {
                name: "joinedDate",
                label: "Tanggal Bergabung",
                render(data) {
                  return (
                    <Typography>
                      {moment(data.createdAt).format(COMMON_DATE_ONLY)}
                    </Typography>
                  );
                },
              },
              {
                name: "level",
                label: "Level",
                render: (data) =>
                  data.level !== undefined ? LEVEL_ENUM[data.level] : "-",
              },
            ]}
            tableData={team?.profiles || []}
            keyIndex="id"
          />
        </Grid>
        <Grid sm={3}>
          {Object.keys(teamTimeOffs) && (
            <Card>
              <CardContent>
                <Typography level="title-lg" mb={2}>
                  Cuti
                </Typography>
                {Object.keys(teamTimeOffs).map((date) => (
                  <Box mb={2} key={date}>
                    <Typography level="title-md" mb={1}>
                      {moment(date).format(COMMON_DATE_ONLY)}
                    </Typography>
                    <AvatarGroup>
                      {teamTimeOffs[date].map((user) => (
                        <Tooltip
                          key={user.id}
                          title={user.profile?.name}
                          variant="outlined"
                          placement="top-end"
                        >
                          <Avatar
                            size="sm"
                            src={user.profile?.avatarUrl}
                            alt={user.profile?.name}
                          />
                        </Tooltip>
                      ))}
                    </AvatarGroup>
                    <Divider sx={{ mt: 2 }} />
                  </Box>
                ))}
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
    </>
  );
}
