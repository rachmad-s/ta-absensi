import { Tab, TabList, Tabs, tabClasses } from "@mui/joy";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import TimeOffRequestsTab from "./TimeOffRequests.tab";

export default function RequestsTab() {
  const routes = [
    "/dashboard/hr/requests/time-off",
    "/dashboard/hr/requests/over-time",
    "/dashboard/hr/requests/attendance",
  ];
  const navigate = useNavigate();
  const location = useLocation();

  const isRoot = location.pathname !== "/dashboard/hr/requests/over-time" && location.pathname !== "/dashboard/hr/requests/attendance";

  return (
    <>
      <Tabs
        aria-label="tabs"
        defaultValue={routes.findIndex((route => route === location.pathname))}
        sx={{ bgcolor: "transparent" }}
        onChange={(_, value) => navigate(routes[Number(value)])}
      >
        <TabList
          disableUnderline
          sx={{
            p: 0.5,
            gap: 0.5,
            borderRadius: "xl",
            bgcolor: "background.level1",
            [`& .${tabClasses.root}[aria-selected="true"]`]: {
              boxShadow: "sm",
              bgcolor: "background.surface",
            },
          }}
        >
          <Tab disableIndicator>Pengajuan Cuti</Tab>
          <Tab disableIndicator>Pengajuan Lembur</Tab>
          <Tab disableIndicator>Pengajuan Absensi</Tab>
        </TabList>
      </Tabs>
      {isRoot ? <TimeOffRequestsTab /> : <Outlet />}
    </>
  );
}
