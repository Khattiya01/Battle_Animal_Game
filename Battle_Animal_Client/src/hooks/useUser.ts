import { fetchUser } from "@/api/manage/manage-user";
import { queryOptions, useQuery } from "@tanstack/react-query";

function fetchUserOptions({
  page,
  pageSize,
}: {
  page: string;
  pageSize: string;
}) {
  return queryOptions({
    queryKey: ["fetchUser", page, pageSize],
    queryFn: () => fetchUser({ page: page, pageSize: pageSize }),
    staleTime: 10 * 1000,
    refetchInterval: 10 * 1000,
    retry: false,
    // refetchOnWindowFocus: false,
    // enabled: false,
  });
}
export const useUser = ({
  page,
  pageSize,
}: {
  page: string;
  pageSize: string;
}) => {
  return useQuery(
    fetchUserOptions({
      page,
      pageSize,
    })
  );
};
