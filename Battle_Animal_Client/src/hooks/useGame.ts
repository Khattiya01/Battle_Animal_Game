import { fetchGame } from "@/api/manage/manage-game";
import { queryOptions, useQuery } from "@tanstack/react-query";

function fetchGameOptions({
  page,
  pageSize,
}: {
  page: string;
  pageSize: string;
}) {
  return queryOptions({
    queryKey: ["fetchGame", page, pageSize],
    queryFn: () => fetchGame({ page: page, pageSize: pageSize }),
    staleTime: 10 * 1000,
    refetchInterval: 10 * 1000,
    retry: false,
    // refetchOnWindowFocus: false,
    // enabled: false,
  });
}
export const useGame = ({
  page,
  pageSize,
}: {
  page: string;
  pageSize: string;
}) => {
  return useQuery(
    fetchGameOptions({
      page,
      pageSize,
    })
  );
};
