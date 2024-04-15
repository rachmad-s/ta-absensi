import { useRoutes } from "react-router-dom";
import { ProtectedRoute } from "./components/ProtectedRoute";
import RouteRedirect from "./components/RouteRedirection";
import DashboardLayout from "./components/layout/DashboardLayout";
import AdminPage, { adminRoute } from "./pages/Admin/Admin.page";
import Calendar from "./pages/Calendar/Calendar.page";
import Dashboard from "./pages/Dashboard/Dashboard.page";
import EmployeesPage from "./pages/Employees/Employees.page";
import HumanResourcePage, {
  hrPageRoute,
} from "./pages/HumanResource/HumanResource.page";
import LoginPage from "./pages/Login/Login.page";
import MyProfilePage, {
  myProfileRoute,
} from "./pages/MyProfile/MyProfile.page";
import Profile from "./pages/Profile/Profile.page";
import SettingPage from "./pages/Settings/Setting.page";
import SupervisorPage, {
  supervisorRoute,
} from "./pages/Supervisor/Supervisor.page";
import { Error404 } from "./utils/components";
import { accessControl } from "./utils/utils";

export default function Route() {
  const routes = useRoutes([
    { path: "*", element: <Error404 /> },
    {
      path: "/",
      element: <RouteRedirect />,
    },
    {
      path: "/login",
      element: <LoginPage />,
    },
    {
      path: "/dashboard",
      element: (
        <ProtectedRoute>
          <DashboardLayout />
        </ProtectedRoute>
      ),
      children: [
        {
          path: "",
          element: <Dashboard />,
        },
        {
          path: "calendar",
          element: <Calendar />,
        },
        {
          path: "admin",
          element: accessControl(<AdminPage />, ["ADMIN"]),
          children: adminRoute,
        },
        {
          path: "me",
          element: <MyProfilePage />,
          children: myProfileRoute,
        },
        {
          path: "supervisor",
          element: accessControl(<SupervisorPage />, [], (user) =>
            Boolean(user.supervising && user.supervising.length > 0)
          ),
          children: supervisorRoute,
        },
        {
          path: "hr",
          element: accessControl(<HumanResourcePage />, ["HR"]),
          children: hrPageRoute,
        },
        {
          path: "profile/:id",
          element: <Profile />,
        },
        {
          path: "employees",
          element: <EmployeesPage />,
        },
        {
          path: "settings",
          element: <SettingPage />,
        },
      ],
    },
  ]);
  return routes;
}
