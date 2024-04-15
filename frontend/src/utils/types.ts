export interface ResponseWithPagination<D> {
  data: D;
  pagination: {
    total: number;
    currentPage: number;
    totalPage: number;
  };
}

export interface OptionType {
  value?: string;
  label?: string;
}

export interface PaginationResponse {
  totalPage: number;
  currentPage: number;
  total: number;
}
