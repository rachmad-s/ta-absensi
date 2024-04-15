import BrightnessAutoRoundedIcon from "@mui/icons-material/BrightnessAutoRounded";
import Box from "@mui/joy/Box";
import Divider from "@mui/joy/Divider";
import IconButton from "@mui/joy/IconButton";
import Typography from "@mui/joy/Typography";

export default function SidebarLogo() {
  return (
    <>
      <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
        <IconButton variant="soft" color="primary" size="sm">
          <BrightnessAutoRoundedIcon />
        </IconButton>
        <Typography level="title-lg">A</Typography>
      </Box>
      <Divider sx={{ mb: "1rem" }} />
    </>
  );
}
