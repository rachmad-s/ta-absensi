import { ChevronRightRounded, HomeRounded } from "@mui/icons-material";
import { Box, Breadcrumbs, Link, Sheet, Stack, Typography } from "@mui/joy";
import styles from "./Page.module.css";
import React from "react";
import { useLocation } from "react-router-dom";

const useTime = () => {
  const [currentDateTime, setCurrentDateTime] = React.useState(new Date());

  const formatNumber = React.useCallback((number: number) => {
    return number < 10 ? "0" + number : number;
  }, []);

  const months = React.useMemo(
    () => [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ],
    []
  );

  const days = React.useMemo(
    () => ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"],
    []
  );

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return {
    day: days[currentDateTime.getDay()],
    date: formatNumber(currentDateTime.getDate()),
    month: months[currentDateTime.getMonth()],
    year: currentDateTime.getFullYear(),
    hour: formatNumber(currentDateTime.getHours()),
    minute: formatNumber(currentDateTime.getMinutes()),
    second: formatNumber(currentDateTime.getSeconds()),
  };
};

function CurrentTime() {
  const current = useTime();
  return (
    <div>
      <Typography
        fontWeight={500}
        fontSize={14}
        textAlign={"right"}
        sx={{
          textShadow: "0px 0px 1px rgba(0, 0, 0, .5)",
        }}
      >
        {`${current.day}, ${current.date} ${current.month} ${current.year}`}
      </Typography>
      <Typography
        fontWeight={500}
        fontSize={22}
        textAlign={"right"}
        sx={{
          textShadow: "0px 0px 1px rgba(0, 0, 0, .5)",
        }}
      >
        {`${current.hour} : ${current.minute} : ${current.second}`}
      </Typography>
    </div>
  );
}

export default function PageHeader({ title }: { title: string }) {
  const { pathname } = useLocation();
  const pathnames = pathname.split("/").filter((path) => path !== "");
  const breadcrumbs = pathnames.map((path, index) => ({
    label: path,
    active: pathnames.length === index + 1,
    link: "/" + pathnames.slice(0, index + 1).join("/"),
  }));

  return (
    <Sheet
      variant="solid"
      component="main"
      className={styles["bg-page-header"]}
      invertedColors
      sx={(theme) => ({
        px: { xs: 2, md: 6 },
        pt: {
          xs: "calc(12px + var(--Header-height))",
          sm: "calc(12px + var(--Header-height))",
          md: 3,
        },
        pb: 10,
        flex: 1,
        display: "flex",
        flexDirection: "column",
        minWidth: 0,
        gap: 1,
      })}
    >
      <Stack
        justifyContent={"space-between"}
        direction={"row"}
        alignItems={"center"}
      >
        <Stack spacing={1}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Breadcrumbs
              size="sm"
              aria-label="breadcrumbs"
              separator={<ChevronRightRounded />}
              sx={{ pl: 0 }}
            >
              <Link
                underline="none"
                color="neutral"
                href="#some-link"
                aria-label="Home"
              >
                <HomeRounded />
              </Link>
              {breadcrumbs.map((breadcrumb) => (
                <Link
                  key={`breadcrumb-${breadcrumb.label}`}
                  underline="hover"
                  color="neutral"
                  href={breadcrumb.link}
                  fontSize={12}
                  fontWeight={500}
                >
                  <Typography
                    color={breadcrumb.active ? "primary" : "neutral"}
                    fontWeight={500}
                    fontSize={12}
                    sx={{
                      textTransform: "capitalize",
                    }}
                  >
                    {breadcrumb.label}
                  </Typography>
                </Link>
              ))}
            </Breadcrumbs>
          </Box>
          <Box
            sx={{
              display: "flex",
              mb: 1,
              gap: 1,
              flexDirection: { xs: "column", sm: "row" },
              alignItems: { xs: "start", sm: "center" },
              flexWrap: "wrap",
              justifyContent: "space-between",
            }}
          >
            <Typography level="h2" component="h1">
              {title}
            </Typography>
          </Box>
        </Stack>
        <CurrentTime />
      </Stack>
    </Sheet>
  );
}
