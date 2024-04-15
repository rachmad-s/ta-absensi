/* eslint-disable jsx-a11y/anchor-is-valid */
import Chip from "@mui/joy/Chip";
import IconButton from "@mui/joy/IconButton";
import { ColorPaletteProp } from "@mui/joy/styles";
import * as React from "react";

import { DeleteOutlined, EditOutlined } from "@mui/icons-material";
import { Avatar, Stack, Typography } from "@mui/joy";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { deleteUser } from "../../utils/api/users.api";
import { User } from "../../utils/models/user.model";
import { useConfirmationDialog } from "../../utils/providers/ConfirmationProvider";
import { useToast } from "../../utils/providers/ToastProvider";
import { PaginationResponse } from "../../utils/types";
import Pagination from "../Pagination";
import Table from "../Table";

export default function UserTable({
  users,
  isLoading,
  pagination,
  onUpdateData,
  passive = false,
  tableLayout = "fixed",
  customAvatar,
}: {
  users: User[];
  isLoading?: boolean;
  pagination?: PaginationResponse;
  onUpdateData?: (user: User) => void;
  passive?: boolean;
  tableLayout?: string;
  customAvatar?: (data: User) => JSX.Element
}) {
  const { openConfirmation } = useConfirmationDialog();
  const queryClient = useQueryClient();

  const fireToast = useToast();

  const { mutateAsync: deleteUserMutation, isPending } = useMutation({
    mutationFn: (userId: string) => deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  return (
    <React.Fragment>
      <Table<User>
        extendEmptyPage={true}
        isLoading={isLoading}
        tableLayout={tableLayout}
        tableConfig={[
          {
            name: "name",
            label: "Nama",
            style: { width: 200 },
            render: (data) => (
              <Link to={`/dashboard/profile/${data.id}`} className="reset-link">
                <Stack direction={"row"} alignItems={"center"} spacing={1}>
                  {customAvatar ? customAvatar(data) : (
                    <Avatar
                      src={data.profile?.avatarUrl}
                      alt={data.profile?.name}
                      size="sm"
                    />
                  )}
                  <Stack>
                    <Typography>{data.profile?.name}</Typography>
                    <Typography sx={{ opacity: 0.4 }}>{data.email}</Typography>
                  </Stack>
                </Stack>
              </Link>
            ),
          },
          {
            name: "role",
            label: "Role",
            hide: passive,
            style: { width: 80 },
            render: ({ role }) => (
              <Chip
                variant="solid"
                size="sm"
                color={
                  {
                    ADMIN: "success",
                    USER: "warning",
                    HR: "primary",
                  }[role] as ColorPaletteProp
                }
              >
                {role}
              </Chip>
            ),
          },

          {
            name: "position",
            label: "Posisi",
            style: { width: 200 },
            render: (data) => data.profile?.position || "-",
          },
          {
            name: "department",
            label: "Department",
            render: (data) =>
              data.profile?.team && data.profile?.team.department.name ? (
                <Stack spacing={1}>
                  <Typography>{data.profile.team.department.name}</Typography>
                  <Chip size="sm" variant="soft" color="info">
                    {data.profile.team.name}
                  </Chip>
                </Stack>
              ) : (
                "-"
              ),
          },
          {
            name: "supervisor",
            label: "Supervisor",
            render: (data) => data.supervisor?.profile?.name || `-`,
          },
          {
            name: "_action",
            hide: passive,
            label: "",
            style: { width: 96 },
            render: (data) => (
              <>
                <IconButton
                  variant="plain"
                  color="success"
                  size="sm"
                  onClick={() => onUpdateData && onUpdateData(data)}
                >
                  <EditOutlined />
                </IconButton>
                <IconButton
                  variant="plain"
                  color="danger"
                  size="sm"
                  onClick={() => {
                    const { id, profile, email } = data;
                    const identifier = profile?.name || email;
                    openConfirmation({
                      message: (
                        <Typography>
                          Apakah Anda yakin untuk menghapus{" "}
                          <Typography fontWeight={800}>{identifier}</Typography>
                          ?
                        </Typography>
                      ),
                      buttonLabel: "Hapus",
                      buttonLoading: isPending,
                      onConfirm: async () => {
                        await deleteUserMutation(id);
                        fireToast({
                          message: `Berhasil menghapus ${identifier}!`,
                        });
                      },
                    });
                  }}
                >
                  <DeleteOutlined />
                </IconButton>
              </>
            ),
          },
        ]}
        tableData={users || []}
        keyIndex="id"
      />

      {pagination && <Pagination pagination={pagination} />}
    </React.Fragment>
  );
}
