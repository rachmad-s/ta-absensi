/* eslint-disable jsx-a11y/anchor-is-valid */
import IconButton from "@mui/joy/IconButton";
import * as React from "react";

import { Check, Close } from "@mui/icons-material";
import { Avatar, Button, Stack, Typography } from "@mui/joy";
import moment from "moment";
import { TimeOff } from "../utils/models/timeOff.model";
import { useAuth } from "../utils/providers/auth/auth.hook";
import {
  COMMON_DATE_ONLY,
  COMMON_DATE_TIME,
  getTimeOffNameLabel,
} from "../utils/utils";
import Table from "./Table";

export default function TimeOffRequestTable({
  data,
  isLoading,
  onApprove,
  onReject,
}: {
  data: TimeOff[];
  isLoading?: boolean;
  onApprove: (data: TimeOff) => void;
  onReject: (data: TimeOff) => void;
}) {
  const { user } = useAuth();

  const isApproved = (data: TimeOff) =>
    data.requestActions &&
    data.requestActions.find((action) => action.createdBy === user?.user.id)
      ?.status === "APPROVED";

  const isRejected = (data: TimeOff) =>
    data.requestActions &&
    data.requestActions.find((action) => action.createdBy === user?.user.id)
      ?.status === "REJECTED";

  return (
    <React.Fragment>
      <Table<TimeOff>
        isLoading={isLoading}
        tableConfig={[
          {
            name: "name",
            label: "Nama",
            style: { width: 70 },
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
            style: { width: 70 },
            render: (data) => (
              <Typography>
                {moment(data.createdAt).format(COMMON_DATE_TIME)}
              </Typography>
            ),
          },
          {
            name: "type",
            label: "Cuti",
            style: { width: 100 },
            render: (data) => (
              <Stack spacing={1}>
                <Stack direction={"row"} justifyContent={"space-between"}>
                  <Typography fontWeight={700}>Jenis Cuti</Typography>{" "}
                  <Typography>{getTimeOffNameLabel(data.type)}</Typography>
                </Stack>
                <Stack direction={"row"} justifyContent={"space-between"}>
                  <Typography fontWeight={700}>Tanggal</Typography>{" "}
                  <Typography>
                    {moment(data.startDate).format(COMMON_DATE_ONLY)}
                  </Typography>
                </Stack>
                <Stack direction={"row"} justifyContent={"space-between"}>
                  <Typography fontWeight={700}>Durasi</Typography>{" "}
                  <Typography>{data.days + " Hari"}</Typography>
                </Stack>
              </Stack>
            ),
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
            name: "message",
            label: "Pesan",
            style: { width: 100 },
            render: (data) => data.message || "-",
          },
          {
            name: "_action",
            label: "",
            style: { width: 50 },
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
