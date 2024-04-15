import { Avatar, Badge, badgeClasses } from "@mui/joy";
import { useAllAttendanceQuery } from "../utils/hooks/useAllAttendanceQuery";


export default function AvatarWithOnline({ userId }: { userId: string }) {

    const { data } = useAllAttendanceQuery({
        date: new Date().toISOString(),
        userId: userId
    })


    return (
        <Badge
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            badgeInset="14%"
            color={"success"}
            sx={{
                [`& .${badgeClasses.badge}`]: {
                    '&::after': {
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        borderRadius: '50%',
                        border: '2px solid',
                        borderColor: 'success.500',
                        content: '""',
                    },
                },
            }}
        >
            <Avatar
                src={""}
                alt={"SM"}
                size="sm"
            />
        </Badge>
    )
}