import Page from "../../components/Page/Page";
import PageContent from "../../components/Page/PageContent";
import PageHeader from "../../components/Page/PageHeader";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import React from "react";
import { Tabs } from "../../components/Tabs";
import MyAttendanceTab from "./MyAttendance.tab";
import MyTimeOffTab from "./MyTimeOff.tab";
import MyOverTimeTab from "./MyOverTime.tab";
import MyTeamTab from "./MyTeam.tab";

export const myProfileRoute = [
  {
    path: "attendances",
    element: <MyAttendanceTab />,
  },
  {
    path: "time-off",
    element: <MyTimeOffTab />,
  },
  {
    path: "over-time",
    element: <MyOverTimeTab />,
  },
  {
    path: "my-team",
    element: <MyTeamTab />,
  },
];

const MyProfileTabs = myProfileRoute.map((route) => route.path);

export default function MyProfilePage() {
  const location = useLocation();
  const path = location.pathname.split("/")[3];
  const defaultIndex =
    MyProfileTabs.findIndex((tab) => tab === path) > -1
      ? MyProfileTabs.findIndex((tab) => tab === path)
      : 0;

  const navigate = useNavigate();

  return (
    <Page>
      <PageHeader title="Profil" />
      <PageContent>
        <Tabs
          index={defaultIndex}
          setIndex={(index) => {
            navigate("/dashboard/me/" + MyProfileTabs[index]);
          }}
          tabList={MyProfileTabs}
          label={["Kehadiran", "Cuti", "Lembur", "Team"]}
        />
        <Outlet />
      </PageContent>
    </Page>
  );
}
