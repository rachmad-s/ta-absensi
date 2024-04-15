import {
  AssignmentOutlined,
  CalendarMonthOutlined,
  GroupOutlined,
  HomeOutlined,
  PersonOutline,
  SettingsOutlined,
  SupervisedUserCircleOutlined,
} from "@mui/icons-material";
import { useAuth } from "../../../utils/providers/auth/auth.hook";
import SidebarContainer from "./Container.sidebar";
import SidebarLogo from "./Logo.sidebar";
import SidebarMenu from "./Menu.sidebar";
import SidebarProfile from "./Profile.sidebar";

export default function Sidebar() {
  const { user } = useAuth();
  const isSupervising = Boolean(
    user?.user.supervising && user?.user.supervising?.length > 0
  );
  console.log(user?.user.profile?.name)

  const menus = [
    {
      name: "dashboard",
      path: "/dashboard",
      label: "Dashboard",
      access: true,
      icon: <HomeOutlined />,
    },
    {
      name: "calendar",
      path: "/dashboard/calendar",
      label: "Kalender",
      access: true,
      icon: <CalendarMonthOutlined />,
    },
    {
      name: "employeesPage",
      path: "/dashboard/employees",
      label: "Karyawan",
      access: user?.user.role === "USER",
      icon: <GroupOutlined />,
    },
    {
      name: "me",
      path: "/dashboard/me",
      label: "Saya",
      access: true,
      icon: <PersonOutline />,
      child: [
        {
          name: "attendance",
          label: "Kehadiran",
          access: true,
          path: "/dashboard/me/attendances",
        },
        {
          name: "timeOff",
          label: "Cuti",
          access: true,
          path: "/dashboard/me/time-off",
        },
        {
          name: "overTime",
          label: "Lembur",
          access: true,
          path: "/dashboard/me/over-time",
        },
        {
          name: "myTeam",
          label: "Team",
          access: true,
          path: "/dashboard/me/my-team",
        },
      ],
    },
    {
      name: "supervisor",
      label: "Supervisor",
      icon: <SupervisedUserCircleOutlined />,
      access: isSupervising,
      path: "/dashboard/supervisor",
      child: [
        {
          name: "timeOffRequests",
          label: "Pengajuan Cuti",
          access: isSupervising,
          path: "/dashboard/supervisor/time-off-requests",
        },
        {
          name: "overTimeRequests",
          label: "Pengajuan Lembur",
          access: isSupervising,
          path: "/dashboard/supervisor/over-time-requests",
        },
        {
          name: "attendances",
          label: "Absensi",
          access: isSupervising,
          path: "/dashboard/supervisor/attendances",
        },
      ],
    },
    {
      name: "hr",
      path: "/dashboard/hr",
      label: "HR",
      access: user?.user.role === "HR",
      icon: <AssignmentOutlined />,
      child: [
        {
          name: "employees",
          label: "Karyawan",
          access: user?.user.role === "HR",
          path: "/dashboard/hr/employees",
        },
        {
          name: "requests",
          label: "Pengajuan",
          access: user?.user.role === "HR",
          path: "/dashboard/hr/requests",
        },
        {
          name: "attendances",
          label: "Kehadiran",
          access: user?.user.role === "HR",
          path: "/dashboard/hr/attendances",
        },
        {
          name: "publicHoliday",
          label: "Tanggal Merah",
          access: user?.user.role === "HR",
          path: "/dashboard/hr/public-holiday",
        },
      ],
    },
    {
      name: "admin",
      path: "/dashboard/admin",
      label: "Admin",
      access: user?.user.role === "ADMIN",
      icon: <SettingsOutlined />,
      child: [
        {
          name: "users",
          label: "Users",
          access: user?.user.role === "ADMIN",
          path: "/dashboard/admin/users",
        },
        {
          name: "data",
          label: "Data",
          access: user?.user.role === "ADMIN",
          path: "/dashboard/admin/data",
        },
      ],
    },
    // {
    //   name: "settings",
    //   path: "/dashboard/settings",
    //   label: "Pengaturan",
    //   access: user?.user.role === "ADMIN" || user?.user.role === "HR",
    //   icon: <SettingsOutlined />,
    // },
  ];

  return (
    <SidebarContainer>
      <SidebarLogo />
      <SidebarMenu menus={menus} />
      <SidebarProfile />
    </SidebarContainer>
  );
}
