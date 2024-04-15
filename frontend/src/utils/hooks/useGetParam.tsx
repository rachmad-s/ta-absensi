import { useLocation } from "react-router-dom";

export default function useGetParam() {
  const location = useLocation();

  return {
    param: (key: string) => new URLSearchParams(location.search).get(key),
  };
}
