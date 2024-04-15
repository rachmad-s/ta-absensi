import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Page from "../../components/Page/Page";
import PageContent from "../../components/Page/PageContent";
import PageHeader from "../../components/Page/PageHeader";
import { Tabs } from "../../components/Tabs";
import { AttendanceDetail } from "./AttendanceDetail";
import AttendanceValidation from "./AttendanceValidation.tab";
import { Attendances } from "./Attendances.tab";
import EmployeesTab from "./Employees.tab";
import OverTimeRequestsTab from "./OverTimeRequests.tab";
import PublicHoliday from "./PublicHoliday";
import RequestsTab from "./Requests.tab";
import TimeOffRequestsTab from "./TimeOffRequests.tab";

export const hrPageRoute = [
  {
    path: "employees",
    element: <EmployeesTab />,
  },
  {
    path: "requests",
    element: <RequestsTab />,
    children: [
      {
        path: "time-off",
        element: <TimeOffRequestsTab />,
      },
      {
        path: "over-time",
        element: <OverTimeRequestsTab />,
      },
      {
        path: "attendance",
        element: <AttendanceValidation />,
      },
    ],
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
  {
    path: "public-holiday",
    element: <PublicHoliday />,
  },
];

const hrPageTab = hrPageRoute.map((route) => route.path);

export default function HumanResourcePage() {
  const location = useLocation();
  const path = location.pathname.split("/")[3];
  const defaultIndex =
    hrPageTab.findIndex((tab) => tab === path) > -1
      ? hrPageTab.findIndex((tab) => tab === path)
      : 0;

  const navigate = useNavigate();

  return (
    <Page>
      <PageHeader title="Human Resource" />
      <PageContent>
        <Tabs
          index={defaultIndex}
          setIndex={(index) => {
            navigate("/dashboard/hr/" + hrPageTab[index]);
          }}
          tabList={hrPageTab}
          label={["Karyawan", "Pengajuan", "Rekap Kehadiran", "Tanggal Merah"]}
        />
        <Outlet />
      </PageContent>
    </Page>
  );
}
