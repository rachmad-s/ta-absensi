import { ErrorOutline } from "@mui/icons-material";
import {
  CircularProgress,
  Table as JoyTable,
  Sheet,
  Stack,
  Typography,
} from "@mui/joy";
import { DEFAULT_TAKE } from "../utils/constant";

interface TableConfig<T> {
  name: string;
  hide?: boolean;
  className?: string;
  label: string;
  style?: React.CSSProperties;
  dataIndex?: keyof T;
  render?: (data: T) => string | JSX.Element;
  labelConfig?: {
    startDecorator: JSX.Element;
  };
}

type TableData<T> = {
  [key in keyof T]: any;
};

interface ComponentProps<T> {
  tableConfig: TableConfig<T>[];
  tableData: TableData<T>[];
  keyIndex: keyof T;
  isLoading?: boolean;
  extendEmptyPage?: boolean;
  tableLayout?: string;
}

const thStyle = { padding: "12px 16px" };

export default function Table<T>({
  tableConfig,
  tableData,
  keyIndex,
  isLoading,
  tableLayout = "fixed",
  extendEmptyPage = false,
}: ComponentProps<T>) {
  return (
    <Sheet
      className="OrderTableContainer"
      variant="outlined"
      sx={{
        maxWidth: "100%",
        borderRadius: "sm",
        flexShrink: 1,
        overflowX: "scroll",
      }}
    >
      <JoyTable
        aria-labelledby="tableTitle"
        hoverRow
        sx={{
          tableLayout: tableLayout,
          "--TableCell-headBackground": "var(--joy-palette-background-level1)",
          "--Table-headerUnderlineThickness": "1px",
          "--TableRow-hoverBackground": "var(--joy-palette-neutral-100)",
          "--TableCell-paddingY": "16px",
          "--TableCell-paddingX": "16px",
        }}
      >
        <thead>
          <tr>
            {tableConfig.map((head) =>
              head.hide ? (
                <th style={{ display: "none" }}></th>
              ) : (
                <th key={head.name} className={head.className} style={{ ...head.style, ...thStyle }}>
                  <Typography
                    level="title-sm"
                    startDecorator={
                      head.labelConfig && head.labelConfig.startDecorator
                    }
                  >
                    {head.label}
                  </Typography>
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody>
          {!isLoading &&
            tableData.map((data) => (
              <tr key={data[keyIndex]}>
                {tableConfig.map((head) =>
                  head.hide ? (
                    <td style={{ display: "none" }}></td>
                  ) : (
                    <td key={`${data[keyIndex]}-${head.name}`}>
                      {head.dataIndex
                        ? data[head.dataIndex]
                        : head.render && head.render(data)}
                    </td>
                  )
                )}
              </tr>
            ))}
          {extendEmptyPage &&
            !isLoading &&
            tableData.length < DEFAULT_TAKE &&
            Array(DEFAULT_TAKE - tableData.length)
              .fill("")
              .map((_, trIndex) => (
                <tr>
                  {tableConfig.map((head, tdIndex) =>
                    head.hide ? (
                      <td style={{ display: "none" }}></td>
                    ) : (
                      <td key={`fillter-${trIndex}-${tdIndex}`}></td>
                    )
                  )}
                </tr>
              ))}
        </tbody>
      </JoyTable>

      {!isLoading && tableData.length === 0 && (
        <Sheet sx={{ py: "6rem", width: "100%", textAlign: "center" }}>
          <Stack spacing={1} alignItems={"center"}>
            <ErrorOutline />
            <Typography
              level="h4"
              fontWeight={400}
              fontStyle={"italic"}
              color="neutral"
            >
              Tidak ada data
            </Typography>
          </Stack>
        </Sheet>
      )}
      {isLoading && (
        <div
          style={{
            position: "absolute",
            zIndex: "3",
            top: 0,
            bottom: 0,
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            paddingBlock: "10rem",
            background: "transparent",
          }}
        >
          <CircularProgress />
        </div>
      )}
    </Sheet>
  );
}
