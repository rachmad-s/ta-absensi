import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Chip from "@mui/joy/Chip";

import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import ListItemButton, { listItemButtonClasses } from "@mui/joy/ListItemButton";
import ListItemContent from "@mui/joy/ListItemContent";
import Typography from "@mui/joy/Typography";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

import { ArrowCircleRightRounded } from "@mui/icons-material";
import { useLocation } from "react-router-dom";
import Toggler from "./Toggler.sidebar";
import AttendanceRecordModal from "../../AttendanceRecordModal";
import React from "react";

interface BaseMenu {
  name: string;
  label: string;
  path: string;
  access: boolean;
  counter?: number;
}

export interface Menu extends BaseMenu {
  icon: JSX.Element;
  child?: BaseMenu[];
}

interface ComponentProps {
  menus: Menu[];
}

export default function SidebarMenu(props: ComponentProps) {
  const location = useLocation();
  const [attendanceModalOpen, setAttendanceModalOpen] = React.useState(false);

  const onAttendanceModalClose = () => {
    setAttendanceModalOpen(false);
  };

  const isSelected = (name: string) => {
    return location.pathname === name;
  };

  return (
    <Box
      sx={{
        minHeight: 0,
        overflow: "hidden auto",
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
        [`& .${listItemButtonClasses.root}`]: {
          gap: 1.5,
        },
      }}
    >
      <Button
        startDecorator={<ArrowCircleRightRounded fontSize="small" />}
        sx={{
          borderRadius: "3rem",
          mb: "1rem",
        }}
        onClick={() => setAttendanceModalOpen(true)}
      >
        Absensi
      </Button>

      <List
        size="sm"
        sx={{
          gap: 1,
          "--List-nestedInsetStart": "30px",
          "--ListItem-radius": (theme) => theme.vars.radius.sm,
        }}
      >
        {props.menus.map(
          (menu) =>
            menu.access && (
              <ListItem nested={Boolean(menu.child)} key={menu.name}>
                {!Boolean(menu.child) && (
                  <ListItemButton selected={isSelected(menu.path)}>
                    {menu.icon}
                    <ListItemContent
                      role="menuitem"
                      component="a"
                      href={menu.path}
                      style={{
                        textDecoration: "none",
                      }}
                    >
                      <Typography level="title-sm">{menu.label}</Typography>
                    </ListItemContent>
                    {menu.counter && (
                      <Chip size="sm" color="primary" variant="solid">
                        {menu.counter}
                      </Chip>
                    )}
                  </ListItemButton>
                )}
                {Boolean(menu.child) && (
                  <Toggler
                    defaultExpanded={location.pathname.includes(menu.path)}
                    renderToggle={({ open, setOpen }) => (
                      <ListItemButton onClick={() => setOpen(!open)}>
                        {menu.icon}
                        <ListItemContent>
                          <Typography level="title-sm">{menu.label}</Typography>
                        </ListItemContent>
                        <KeyboardArrowDownIcon
                          sx={{ transform: open ? "rotate(180deg)" : "none" }}
                        />
                      </ListItemButton>
                    )}
                  >
                    <List sx={{ gap: 0.5, pt: 0.5 }}>
                      {menu.child?.map(
                        (item) =>
                          item.access && (
                            <ListItem key={`${menu.name}-${item.name}`}>
                              <ListItemButton
                                selected={isSelected(item.path)}
                                role="menuitem"
                                component="a"
                                href={item.path}
                                style={{
                                  textDecoration: "none",
                                }}
                              >
                                {item.label}
                              </ListItemButton>
                            </ListItem>
                          )
                      )}
                    </List>
                  </Toggler>
                )}
              </ListItem>
            )
        )}
      </List>
      <AttendanceRecordModal
        open={attendanceModalOpen}
        onClose={onAttendanceModalClose}
      />
    </Box>
  );
}
