import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Page from "../../components/Page/Page";
import PageContent from "../../components/Page/PageContent";
import PageHeader from "../../components/Page/PageHeader";
import { Tabs } from "../../components/Tabs";
import { AttendanceDetail } from "./AttendanceDetail";
import { Attendances } from "./Attendances.tab";
import OverTimeRequestsTab from "./OverTimeRequests.tab";
import TimeOffRequestsTab from "./TimeOffRequests.tab";

export const supervisorRoute = [
  {
    path: "time-off-requests",
    element: <TimeOffRequestsTab />,
  },
  {
    path: "over-time-requests",
    element: <OverTimeRequestsTab />,
  },
  {
    path: "attendances",
    children: [
      {
        path: "",
        element: <Attendances />,
      },
      {
        path: ":userId",
        element: <AttendanceDetail />,
      },
    ],
  },
];

const supervisorPageTab = supervisorRoute.map((route) => route.path);

export default function SupervisorPage() {
  const location = useLocation();
  const path = location.pathname.split("/")[3];
  const defaultIndex =
    supervisorPageTab.findIndex((tab) => tab === path) > -1
      ? supervisorPageTab.findIndex((tab) => tab === path)
      : 0;

  const navigate = useNavigate();

  return (
    <Page>
      <PageHeader title="Supervisor" />
      <PageContent>
        <Tabs
          index={defaultIndex}
          setIndex={(index) => {
            navigate("/dashboard/supervisor/" + supervisorPageTab[index]);
          }}
          tabList={supervisorPageTab}
          label={["Pengajuan Cuti", "Pengajuan Lembur", "Rekap Absensi"]}
        />
        <Outlet />
      </PageContent>
    </Page>
  );
}
