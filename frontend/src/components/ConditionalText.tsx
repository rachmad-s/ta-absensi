import { ColorPaletteProp, Typography } from "@mui/joy";
import React from "react";

interface ComponentProps {
  condition: {
    danger: boolean;
    warning: boolean;
    success: boolean;
  };
}

export default function ConditionalText({
  condition,
  children,
}: React.PropsWithChildren<ComponentProps>) {
  const color = Object.keys(condition)[
    Object.values(condition).findIndex((value) => value === true)
  ] as ColorPaletteProp;

  return (
    <Typography fontWeight={700} color={color}>
      {children}
    </Typography>
  );
}
