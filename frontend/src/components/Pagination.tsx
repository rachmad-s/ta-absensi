import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";
import { Box, Button, Divider, IconButton, iconButtonClasses } from "@mui/joy";
import { PaginationResponse } from "../utils/types";
import { useSearchParams } from "react-router-dom";
import { DEFAULT_TAKE } from "../utils/constant";

export default function Pagination({
  pagination,
}: {
  pagination: PaginationResponse;
}) {
  const [_, setSearchParams] = useSearchParams();

  const pages = Array(pagination.totalPage)
    .fill("")
    .map((_, index) => index + 1);

  const setPage = (skip: number) => {
    setSearchParams((params) => {
      params.set("skip", skip.toString());
      return params;
    });
  };

  return (
    <Box
      sx={{
        pt: 8,
      }}
    >
      <Box
        sx={{
          pt: 2,
          gap: 1,
          [`& .${iconButtonClasses.root}`]: { borderRadius: "50%" },
          display: "flex",
        }}
      >
        <Button
          size="sm"
          variant="outlined"
          color="primary"
          startDecorator={<KeyboardArrowLeft />}
          disabled={pagination.currentPage === 1}
          onClick={() => {
            setPage(
              Number((pagination.currentPage - 1) * DEFAULT_TAKE - DEFAULT_TAKE)
            );
          }}
        >
          Previous
        </Button>

        <Box sx={{ flex: 1 }} />
        {pages.map((page) => (
          <IconButton
            key={page}
            size="sm"
            variant={pagination.currentPage === page ? "solid" : "soft"}
            color="primary"
            onClick={() => {
              setPage(Number(page - 1) * DEFAULT_TAKE);
            }}
          >
            {page}
          </IconButton>
        ))}
        <Box sx={{ flex: 1 }} />

        <Button
          size="sm"
          variant="outlined"
          color="primary"
          endDecorator={<KeyboardArrowRight />}
          disabled={pagination.currentPage === pages.length}
          onClick={() => {
            setPage(Number(pagination.currentPage) * DEFAULT_TAKE);
          }}
        >
          Next
        </Button>
      </Box>
    </Box>
  );
}
