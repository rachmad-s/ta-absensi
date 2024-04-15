/* eslint-disable jsx-a11y/anchor-is-valid */
import * as React from "react";

import { Check, Close } from "@mui/icons-material";
import { Alert, Avatar, Button, Card, Chip, DialogContent, IconButton, Modal, ModalClose, ModalDialog, Stack, Typography } from "@mui/joy";
import moment from "moment";
import { Attendance } from "../utils/models/attendance.model";
import { useAuth } from "../utils/providers/auth/auth.hook";
import {
    COMMON_DATE_TIME, DAYS
} from "../utils/utils";
import Table from "./Table";

export default function AttendanceValidationTable({
    data,
    isLoading,
    onApprove,
    onReject,
}: {
    data: Attendance[];
    isLoading?: boolean;
    onApprove: (data: Attendance) => void;
    onReject: (data: Attendance) => void;
}) {
    const { user } = useAuth();

    const [photoDialog, setPhotoDialog] = React.useState({
        display: false,
        source: "",
        profilePict: "",
        similarity: 0
    })

    // const isApproved = (data: Attendance) =>
    //     data.requestActions &&
    //     data.requestActions.find((action) => action.createdBy === user?.user.id)
    //         ?.status === "APPROVED";

    // const isRejected = (data: Attendance) =>
    //     data.requestActions &&
    //     data.requestActions.find((action) => action.createdBy === user?.user.id)
    //         ?.status === "REJECTED";

    return (
        <React.Fragment>
            <Table<Attendance>
                isLoading={isLoading}
                tableConfig={[
                    {
                        name: "name",
                        label: "Nama",
                        style: { width: 90 },
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
                        label: "Tanggal",
                        style: { width: 70 },
                        render: (data) => (
                            <Typography>
                                {`${DAYS[moment(data.date).day()]}, ${moment(data.date).format(COMMON_DATE_TIME)}`}
                            </Typography>
                        ),
                    },
                    {
                        name: "type",
                        label: "Absensi",
                        style: { width: 50 },
                        render: (data) => (
                            data.type === "IN" ? (
                                <Chip variant="soft" color="success">Clock In</Chip>
                            ) : (
                                <Chip variant="soft" color="danger">Clock Out</Chip>
                            )
                        ),
                    },
                    {
                        name: "photo",
                        label: "Foto",
                        style: { width: 80 },
                        render: (data) => (
                            <IconButton onClick={() => setPhotoDialog({ display: true, source: data.photoUrl, profilePict: data.user.profile?.avatarUrl || "", similarity: data.similarity })}>
                                <img width={200} src={data.photoUrl} style={{ borderRadius: "12px" }}></img>
                            </IconButton>
                        ),
                    },
                    {
                        name: "_action",
                        label: "",
                        style: { width: 70 },
                        render: (data) =>
                            data.status === "REJECTED" ? (
                                <Typography color="danger" level="title-md">
                                    Ditolak
                                </Typography>

                            ) : data.status === "APPROVED" ? (
                                <Typography color="success" level="title-md">
                                    Disetujui
                                </Typography>
                            )
                                : (
                                    <Stack direction={"row"} spacing={1}>
                                        <Button
                                            variant="solid"
                                            color="success"
                                            size="sm"
                                            onClick={() => onApprove(data)}
                                            startDecorator={
                                                <Check />
                                            }
                                        >
                                            Setuju
                                        </Button>
                                        <Button
                                            variant="solid"
                                            color="danger"
                                            size="sm"
                                            onClick={() => onReject(data)}
                                            startDecorator={
                                                <Close />
                                            }
                                        >
                                            Tolak

                                        </Button>
                                    </Stack>
                                ),
                    },
                ]}
                tableData={data || []}
                keyIndex="id"
            />

            <Modal open={photoDialog.display} onClose={() => setPhotoDialog({ display: false, source: "", profilePict: "", similarity: 0 })}>

                <ModalDialog variant="outlined" role="alertdialog">
                    <Typography level="title-lg"></Typography>
                    <ModalClose variant="plain" sx={{ m: 1 }} />
                    <DialogContent sx={{ pt: "2rem" }}>
                        <Stack direction={"row"} alignItems={"start"} gap={2}>
                            <Card>
                                <Typography level="title-lg">Foto Profil</Typography>
                                <img width={450} src={photoDialog.profilePict} />
                            </Card>
                            <Card>
                                <Typography level="title-lg">Foto Absensi</Typography>
                                <img width={450} src={photoDialog.source} />
                            </Card>
                        </Stack>
                        <Alert variant="soft" color="info" sx={{ mt: 1 }}>
                            <Typography level="title-lg">Hasil Face Recognition: {photoDialog.similarity}%</Typography>
                        </Alert>
                    </DialogContent>
                </ModalDialog>
            </Modal>
        </React.Fragment>
    );
}
