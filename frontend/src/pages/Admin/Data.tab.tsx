import { Grid } from "@mui/joy";
import Departments from "./components/Departments";
import Teams from "./components/Teams";

export default function DataTab() {
  return (
    <Grid container spacing={4}>
      <Grid sm={6}>
        <Departments />
      </Grid>
      <Grid sm={6}>
        <Teams />
      </Grid>
    </Grid>
  );
}
