/* eslint-disable jsx-a11y/anchor-is-valid */
import IconButton from "@mui/joy/IconButton";
import * as React from "react";

import { Check, Close } from "@mui/icons-material";
import { Avatar, Stack, Typography } from "@mui/joy";
import moment from "moment";
import { OverTime } from "../utils/models/overTime.model";
import { useAuth } from "../utils/providers/auth/auth.hook";
import {
  COMMON_DATE_ONLY,
  COMMON_DATE_TIME,
  getDuration,
} from "../utils/utils";
import Table from "./Table";

export default function OverTimeRequestTable({
  data,
  isLoading,
  onApprove,
  onReject,
}: {
  data: OverTime[];
  isLoading?: boolean;
  onApprove: (data: OverTime) => void;
  onReject: (data: OverTime) => void;
}) {
  const { user } = useAuth();

  const isApproved = (data: OverTime) =>
    data.requestActions &&
    data.requestActions.find((action) => action.createdBy === user?.user.id)
      ?.status === "APPROVED";

  const isRejected = (data: OverTime) =>
    data.requestActions &&
    data.requestActions.find((action) => action.createdBy === user?.user.id)
      ?.status === "REJECTED";

  return (
    <React.Fragment>
      <Table<OverTime>
        isLoading={isLoading}
        tableConfig={[
          {
            name: "name",
            label: "Nama",
            style: { width: 100 },
            render: (data) => (
              <Stack direction={"row"} alignItems={"center"} spacing={1}>
                <Avatar
                  src={data.user.profile?.avatarUrl}
                  alt={data.user.profile?.name}
                  size="sm"
                />
                <Typography>{data.user.profile?.name}</Typography>
              </Stack>
            ),
          },
          {
            name: "createdAt",
            label: "Tanggal Pengajuan",
            style: { width: 100 },
            render: (data) => (
              <Typography>
                {moment(data.createdAt).format(COMMON_DATE_TIME)}
              </Typography>
            ),
          },
          {
            name: "date",
            label: "Tanggal Lembur",
            style: { width: 100 },
            render: (data) => (
              <Typography>
                {moment(data.date).format(COMMON_DATE_ONLY)}
              </Typography>
            ),
          },
          {
            name: "duration",
            label: "Durasi",
            style: { width: 100 },
            render: (data) => getDuration(data.duration),
          },
          {
            name: "message",
            label: "Pesan",
            style: { width: 150 },
            render: (data) => data.message || "-",
          },
          {
            name: "_action",
            label: "",
            style: { width: 70 },
            className: "printHide",
            render: (data) =>
              data.requestActions &&
                data.requestActions.find(
                  (action) => action.user.id === user?.user.id
                ) ? (
                isApproved(data) ? (
                  <Typography color="success" level="title-md">
                    Disetujui
                  </Typography>
                ) : isRejected(data) ? (
                  <Typography color="danger" level="title-md">
                    Ditolak
                  </Typography>
                ) : (
                  ""
                )
              ) : (
                <Stack direction={"row"} spacing={1}>
                  <IconButton
                    variant="outlined"
                    color="success"
                    size="sm"
                    onClick={() => onApprove(data)}
                  >
                    <Check />
                  </IconButton>
                  <IconButton
                    variant="outlined"
                    color="danger"
                    size="sm"
                    onClick={() => onReject(data)}
                  >
                    <Close />
                  </IconButton>
                </Stack>
              ),
          },
        ]}
        tableData={data || []}
        keyIndex="id"
      />
    </React.Fragment>
  );
}
