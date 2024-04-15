import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import { Avatar, Box, Divider, IconButton, Stack, Typography } from "@mui/joy";
import { useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { useConfirmationDialog } from "../../../utils/providers/ConfirmationProvider";
import { useAuth } from "../../../utils/providers/auth/auth.hook";

export default function SidebarProfile() {
  const { user, removeUser } = useAuth();
  const { openConfirmation } = useConfirmationDialog();
  const queryClient = useQueryClient();
  return (
    <>
      <Divider />
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Link to={`/dashboard/profile/${user?.user.id}`} className="reset-link">
          <Stack direction={"row"} spacing={2} alignItems={"center"}>
            <Avatar variant="solid" size="sm" color="success">
              <img
                src={user?.user.profile?.avatarUrl}
                alt="Profile"
                width={"100%"}
              />
            </Avatar>
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography level="title-sm">
                {user?.user.profile?.name || ""}
              </Typography>
              <Typography level="body-xs">{user?.user.email}</Typography>
            </Box>
          </Stack>
        </Link>

        <IconButton
          size="sm"
          variant="outlined"
          color="danger"
          onClick={() =>
            openConfirmation({
              title: "Keluar?",
              message: "Apakah Anda yaking akan keluar dari Aplikasi?",
              buttonLabel: "Ya, keluar",
              onConfirm: () =>
                new Promise((resolve, reject) => {
                  try {
                    removeUser();
                    queryClient.invalidateQueries();
                    resolve(true);
                  } catch {
                    reject();
                  }
                }),
            })
          }
        >
          <LogoutRoundedIcon />
        </IconButton>
      </Box>
    </>
  );
}
