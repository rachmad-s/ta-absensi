import { CssVarsProvider, extendTheme } from "@mui/joy/styles";
import { CssBaseline } from "@mui/joy";
import { PropsWithChildren } from "react";

// You can put this to any file that's included in your tsconfig
import type { PaletteRange } from "@mui/joy/styles";

declare module "@mui/joy/styles" {
  interface ColorPalettePropOverrides {
    info: true;
  }

  interface Palette {
    info: PaletteRange;
  }
}

const primary = {
  50: "#F4FAFF",
  100: "#DDF1FF",
  200: "#ADDBFF",
  300: "#6FB6FF",
  400: "#3990FF",
  500: "#096BDE",
  600: "#054DA7",
  700: "#02367D",
  800: "#072859",
  900: "#00153C",
};
const neutral = {
  50: "#F7F7F8",
  100: "#EBEBEF",
  200: "#D8D8DF",
  300: "#B9B9C6",
  400: "#8F8FA3",
  500: "#73738C",
  600: "#5A5A72",
  700: "#434356",
  800: "#25252D",
  900: "#131318",
};

const danger = {
  50: "#FFF8F6",
  100: "#FFE9E8",
  200: "#FFC7C5",
  300: "#FF9192",
  400: "#FA5255",
  500: "#D3232F",
  600: "#A10E25",
  700: "#77061B",
  800: "#580013",
  900: "#39000D",
};

const success = {
  50: "#F3FEF5",
  100: "#D7F5DD",
  200: "#77EC95",
  300: "#4CC76E",
  400: "#2CA24D",
  500: "#1A7D36",
  600: "#0F5D26",
  700: "#034318",
  800: "#002F0F",
  900: "#001D09",
};

const warning = {
  50: "#FFF8C5",
  100: "#FAE17D",
  200: "#EAC54F",
  300: "#D4A72C",
  400: "#BF8700",
  500: "#9A6700",
  600: "#7D4E00",
  700: "#633C01",
  800: "#4D2D00",
  900: "#3B2300",
};

const info = {
  50: "#FDF7FF",
  100: "#F4EAFF",
  200: "#E1CBFF",
  300: "#C69EFF",
  400: "#A374F9",
  500: "#814DDE",
  600: "#5F35AE",
  700: "#452382",
  800: "#301761",
  900: "#1D0A42",
};

const theme = extendTheme({
  colorSchemes: {
    light: {
      palette: {
        primary: {
          ...primary,
          plainColor: `var(--joy-palette-primary-600)`,
          plainHoverBg: `var(--joy-palette-primary-100)`,
          plainActiveBg: `var(--joy-palette-primary-200)`,
          plainDisabledColor: `var(--joy-palette-primary-200)`,

          outlinedColor: `var(--joy-palette-primary-500)`,
          outlinedBorder: `var(--joy-palette-primary-200)`,
          outlinedHoverBg: `var(--joy-palette-primary-100)`,
          outlinedHoverBorder: `var(--joy-palette-primary-300)`,
          outlinedActiveBg: `var(--joy-palette-primary-200)`,
          outlinedDisabledColor: `var(--joy-palette-primary-100)`,
          outlinedDisabledBorder: `var(--joy-palette-primary-100)`,

          softColor: `var(--joy-palette-primary-600)`,
          softBg: `var(--joy-palette-primary-100)`,
          softHoverBg: `var(--joy-palette-primary-200)`,
          softActiveBg: `var(--joy-palette-primary-300)`,
          softDisabledColor: `var(--joy-palette-primary-300)`,
          softDisabledBg: `var(--joy-palette-primary}-)50`,

          solidColor: "#fff",
          solidBg: `var(--joy-palette-primary-500)`,
          solidHoverBg: `var(--joy-palette-primary-600)`,
          solidActiveBg: `var(--joy-palette-primary-700)`,
          solidDisabledColor: `#fff`,
          solidDisabledBg: `var(--joy-palette-primary-200)`,
        },
        neutral: {
          ...neutral,
          plainColor: `var(--joy-palette-neutral-800)`,
          plainHoverColor: `var(--joy-palette-neutral-900)`,
          plainHoverBg: `var(--joy-palette-neutral-100)`,
          plainActiveBg: `var(--joy-palette-neutral-200)`,
          plainDisabledColor: `var(--joy-palette-neutral-300)`,

          outlinedColor: `var(--joy-palette-neutral-800)`,
          outlinedBorder: `var(--joy-palette-neutral-200)`,
          outlinedHoverColor: `var(--joy-palette-neutral-900)`,
          outlinedHoverBg: `var(--joy-palette-neutral-100)`,
          outlinedHoverBorder: `var(--joy-palette-neutral-300)`,
          outlinedActiveBg: `var(--joy-palette-neutral-200)`,
          outlinedDisabledColor: `var(--joy-palette-neutral-300)`,
          outlinedDisabledBorder: `var(--joy-palette-neutral-100)`,

          softColor: `var(--joy-palette-neutral-800)`,
          softBg: `var(--joy-palette-neutral-100)`,
          softHoverColor: `var(--joy-palette-neutral-900)`,
          softHoverBg: `var(--joy-palette-neutral-200)`,
          softActiveBg: `var(--joy-palette-neutral-300)`,
          softDisabledColor: `var(--joy-palette-neutral-300)`,
          softDisabledBg: `var(--joy-palette-neutral-50)`,
          solidColor: `var(--joy-palette-common-white)`,
          solidBg: `var(--joy-palette-neutral-600)`,
          solidHoverBg: `var(--joy-palette-neutral-700)`,
          solidActiveBg: `var(--joy-palette-neutral-800)`,
          solidDisabledColor: `var(--joy-palette-neutral-300)`,
          solidDisabledBg: `var(--joy-palette-neutral-50)`,
        },
        danger: {
          ...danger,
          plainColor: `var(--joy-palette-danger-600)`,
          plainHoverBg: `var(--joy-palette-danger-100)`,
          plainActiveBg: `var(--joy-palette-danger-200)`,
          plainDisabledColor: `var(--joy-palette-danger-200)`,

          outlinedColor: `var(--joy-palette-danger-500)`,
          outlinedBorder: `var(--joy-palette-danger-200)`,
          outlinedHoverBg: `var(--joy-palette-danger-100)`,
          outlinedHoverBorder: `var(--joy-palette-danger-300)`,
          outlinedActiveBg: `var(--joy-palette-danger-200)`,
          outlinedDisabledColor: `var(--joy-palette-danger-100)`,
          outlinedDisabledBorder: `var(--joy-palette-danger-100)`,

          softColor: `var(--joy-palette-danger-600)`,
          softBg: `var(--joy-palette-danger-100)`,
          softHoverBg: `var(--joy-palette-danger-200)`,
          softActiveBg: `var(--joy-palette-danger-300)`,
          softDisabledColor: `var(--joy-palette-danger-300)`,
          softDisabledBg: `var(--joy-palette-danger}-)50`,

          solidColor: "#fff",
          solidBg: `var(--joy-palette-danger-500)`,
          solidHoverBg: `var(--joy-palette-danger-600)`,
          solidActiveBg: `var(--joy-palette-danger-700)`,
          solidDisabledColor: `#fff`,
          solidDisabledBg: `var(--joy-palette-danger-200)`,
        },
        success: {
          ...success,
          plainColor: `var(--joy-palette-success-600)`,
          plainHoverBg: `var(--joy-palette-success-100)`,
          plainActiveBg: `var(--joy-palette-success-200)`,
          plainDisabledColor: `var(--joy-palette-success-200)`,

          outlinedColor: `var(--joy-palette-success-500)`,
          outlinedBorder: `var(--joy-palette-success-200)`,
          outlinedHoverBg: `var(--joy-palette-success-100)`,
          outlinedHoverBorder: `var(--joy-palette-success-300)`,
          outlinedActiveBg: `var(--joy-palette-success-200)`,
          outlinedDisabledColor: `var(--joy-palette-success-100)`,
          outlinedDisabledBorder: `var(--joy-palette-success-100)`,

          softColor: `var(--joy-palette-success-600)`,
          softBg: `var(--joy-palette-success-100)`,
          softHoverBg: `var(--joy-palette-success-200)`,
          softActiveBg: `var(--joy-palette-success-300)`,
          softDisabledColor: `var(--joy-palette-success-300)`,
          softDisabledBg: `var(--joy-palette-success}-)50`,

          solidColor: "#fff",
          solidBg: `var(--joy-palette-success-500)`,
          solidHoverBg: `var(--joy-palette-success-600)`,
          solidActiveBg: `var(--joy-palette-success-700)`,
          solidDisabledColor: `#fff`,
          solidDisabledBg: `var(--joy-palette-success-200)`,
        },
        warning: {
          ...warning,
          plainColor: `var(--joy-palette-warning-800)`,
          plainHoverBg: `var(--joy-palette-warning-50)`,
          plainActiveBg: `var(--joy-palette-warning-200)`,
          plainDisabledColor: `var(--joy-palette-warning-200)`,

          outlinedColor: `var(--joy-palette-warning-800)`,
          outlinedBorder: `var(--joy-palette-warning-200)`,
          outlinedHoverBg: `var(--joy-palette-warning-50)`,
          outlinedHoverBorder: `var(--joy-palette-warning-300)`,
          outlinedActiveBg: `var(--joy-palette-warning-200)`,
          outlinedDisabledColor: `var(--joy-palette-warning-100)`,
          outlinedDisabledBorder: `var(--joy-palette-warning-100)`,

          softColor: `var(--joy-palette-warning-800)`,
          softBg: `var(--joy-palette-warning-50)`,
          softHoverBg: `var(--joy-palette-warning-100)`,
          softActiveBg: `var(--joy-palette-warning-200)`,
          softDisabledColor: `var(--joy-palette-warning-200)`,
          softDisabledBg: `var(--joy-palette-warning-50)`,

          solidColor: `var(--joy-palette-warning-800)`,
          solidBg: `var(--joy-palette-warning-200)`,
          solidHoverBg: `var(--joy-palette-warning-300)`,
          solidActiveBg: `var(--joy-palette-warning-400)`,
          solidDisabledColor: `var(--joy-palette-warning-200)`,
          solidDisabledBg: `var(--joy-palette-warning-50)`,
        },
        info: {
          ...info,
          plainColor: `var(--joy-palette-info-600)`,
          plainHoverBg: `var(--joy-palette-info-100)`,
          plainActiveBg: `var(--joy-palette-info-200)`,
          plainDisabledColor: `var(--joy-palette-info-200)`,
          outlinedColor: `var(--joy-palette-info-500)`,
          outlinedBorder: `var(--joy-palette-info-200)`,
          outlinedHoverBg: `var(--joy-palette-info-100)`,
          outlinedHoverBorder: `var(--joy-palette-info-300)`,
          outlinedActiveBg: `var(--joy-palette-info-200)`,
          outlinedDisabledColor: `var(--joy-palette-info-100)`,
          outlinedDisabledBorder: `var(--joy-palette-info-100)`,
          softColor: `var(--joy-palette-info-600)`,
          softBg: `var(--joy-palette-info-100)`,
          softHoverBg: `var(--joy-palette-info-200)`,
          softActiveBg: `var(--joy-palette-info-300)`,
          softDisabledColor: `var(--joy-palette-info-300)`,
          softDisabledBg: `var(--joy-paletteinfo}-50)`,
          solidColor: "#fff",
          solidBg: `var(--joy-palette-info-500)`,
          solidHoverBg: `var(--joy-palette-info-600)`,
          solidActiveBg: `var(--joy-palette-info-700)`,
          solidDisabledColor: `#fff`,
          solidDisabledBg: `var(--joy-palette-info-200)`,
        },
        common: {
          white: "#FFF",
          black: "#09090D",
        },
        text: {
          secondary: "var(--joy-palette-neutral-600)",
          tertiary: "var(--joy-palette-neutral-500)",
        },
        background: {
          body: "var(--joy-palette-common-white)",
          tooltip: "var(--joy-palette-neutral-800)",
          backdrop: "rgba(0 0 0 / 0.5)",
        },
      },
    },
  },
  components: {
    JoyInput: {
      styleOverrides: {
        root: {
          "--Input-focusedThickness": "1px",
        },
      },
    },
  },
});

export default function Theme(props: PropsWithChildren) {
  return (
    <CssVarsProvider theme={theme}>
      <CssBaseline />
      {props.children}
    </CssVarsProvider>
  );
}
