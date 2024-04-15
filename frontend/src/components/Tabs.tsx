import { Tab, TabList, Tabs as JoyTab, tabClasses } from "@mui/joy";

interface ComponentProps {
  index: number;
  setIndex: (index: number) => void;
  tabList: string[];
  label?: string[];
}

export function Tabs(props: ComponentProps) {
  return (
    <JoyTab
      aria-label="Pipeline"
      value={props.index}
      onChange={(_, value) => props.setIndex(Number(value))}
      sx={{
        mb: "0.5rem",
      }}
    >
      <TabList
        sx={{
          justifyContent: "start",
          [`&& .${tabClasses.root}`]: {
            flex: "initial",
            bgcolor: "transparent",
            "&:hover": {
              bgcolor: "transparent",
            },
            [`&.${tabClasses.selected}`]: {
              color: "primary.plainColor",
              "&::after": {
                height: 3,
                borderTopLeftRadius: 3,
                borderTopRightRadius: 3,
                bgcolor: "primary.500",
              },
            },
          },
        }}
      >
        {props.tabList.map((child, index) => (
          <Tab
            indicatorInset
            key={`tab-${child}`}
            sx={{
              textTransform: "capitalize",
            }}
          >
            {props.label ? props.label[index] : child}
          </Tab>
        ))}
      </TabList>
    </JoyTab>
  );
}
