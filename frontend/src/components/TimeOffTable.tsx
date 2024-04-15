/* eslint-disable jsx-a11y/anchor-is-valid */
import IconButton from "@mui/joy/IconButton";
import * as React from "react";

import { EditOutlined } from "@mui/icons-material";
import {
  Avatar,
  Button,
  Card,
  CardContent,
  Chip,
  Stack,
  Typography,
} from "@mui/joy";
import moment from "moment";
import { TimeOff } from "../utils/models/timeOff.model";
import { COMMON_DATE_ONLY, getTimeOffNameLabel } from "../utils/utils";
import Table from "./Table";

export default function TimeOffTable({
  data,
  isLoading,
  onUpdateData,
}: {
  data: TimeOff[];
  isLoading?: boolean;
  onUpdateData: (data: TimeOff) => void;
}) {
  const isApproved = (data: TimeOff) => {
    return (
      data.requestActions &&
      data.requestActions.findIndex(
        (action) => action.user.role === "HR" && action.status === "APPROVED"
      ) > -1
    );
  };

  return (
    <React.Fragment>
      <Table<TimeOff>
        isLoading={isLoading}
        tableConfig={[
          {
            name: "type",
            label: "Jenis Cuti",
            style: { width: 70 },
            render: (data) => getTimeOffNameLabel(data.type),
          },
          {
            name: "date",
            label: "Tanggal",
            style: { width: 70 },
            render: (data) => moment(data.startDate).format(COMMON_DATE_ONLY),
          },
          {
            name: "duration",
            label: "Durasi",
            style: { width: 50 },
            render: (data) => data.days + " Hari",
          },
          {
            name: "status",
            label: "Status",
            style: { width: 100 },
            render: (data) => {
              if (!data.requestActions) return "";
              if (data.requestActions?.length === 0) {
                return (
                  <Chip variant="soft" color="primary">
                    Menunggu Persetujuan
                  </Chip>
                );
              }
              return (
                <Stack>
                  {data.requestActions.map((actions) => (
                    <Card
                      variant="plain"
                      sx={{ p: 0, backgroundColor: "transparent", gap: 0.3 }}
                    >
                      {actions.status === "APPROVED" ? (
                        <Typography
                          color="success"
                          fontWeight={600}
                          fontSize={"small"}
                        >
                          Disetujui
                        </Typography>
                      ) : (
                        <Typography
                          color="danger"
                          fontWeight={600}
                          fontSize={"small"}
                        >
                          Ditolak
                        </Typography>
                      )}
                      <CardContent>
                        <Card
                          size="sm"
                          orientation="horizontal"
                          variant="plain"
                          sx={{ p: 0, backgroundColor: "transparent" }}
                        >
                          <Avatar size="sm" sx={{ alignSelf: "center" }}>
                            <img
                              src={actions.user.profile?.avatarUrl}
                              alt="Profile"
                              width={"100%"}
                            />
                          </Avatar>
                          <CardContent>
                            <Typography fontWeight={600}>
                              {actions.user.profile?.name}
                              {actions.user.role === "HR" && (
                                <Chip
                                  size="sm"
                                  sx={{ ml: 1, fontWeight: "bold" }}
                                  variant="soft"
                                  color="primary"
                                >
                                  HR
                                </Chip>
                              )}
                            </Typography>
                            <Typography fontSize={"small"}>
                              Pada{" "}
                              {moment(actions.createdAt).format(
                                COMMON_DATE_ONLY
                              )}
                            </Typography>
                          </CardContent>
                        </Card>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              );
            },
          },
          {
            name: "attachment",
            label: "Dokumen",
            style: { width: 60 },
            render: (data) =>
              data.attachment ? (
                <Button variant="plain">Buka Dokumen</Button>
              ) : (
                "-"
              ),
          },
          {
            name: "remarks",
            label: "Catatan",
            style: { width: 100 },
            render: (data) => (
              <>
                {data.requestActions
                  ?.filter((action) => action.remarks)
                  .map((action) => (
                    <>
                      <Typography fontWeight={600}>
                        {action.user.profile?.name} :
                      </Typography>
                      <Typography>{action.remarks}</Typography>
                    </>
                  )) || "-"}
              </>
            ),
          },
          {
            name: "_action",
            label: "",
            style: { width: 50 },
            render: (data) => (
              <>
                {!isApproved(data) && (
                  <IconButton
                    variant="plain"
                    color="success"
                    size="sm"
                    onClick={() => onUpdateData(data)}
                  >
                    <EditOutlined />
                  </IconButton>
                )}
              </>
            ),
          },
        ]}
        tableData={data || []}
        keyIndex="id"
      />
    </React.Fragment>
  );
}
