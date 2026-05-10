import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryKey,
} from "@tanstack/react-query";
import { apiClient } from "./apiClient";

export const useFetch = <T,>(key: QueryKey, url: string) => {
  return useQuery<T, string>({
    queryKey: key,
    queryFn: async () => {
      const response = await apiClient.get(url);
      return response.data;
    },
  });
};

export const useCreate = <TVariables, TResponse>(
  url: string,
  queryKeyToInvalidate?: QueryKey,
) => {
  const queryClient = useQueryClient();
  return useMutation<TResponse, string, TVariables>({
    mutationFn: (data) => apiClient.post(url, data),
    onSuccess: () => {
      if (queryKeyToInvalidate) {
        queryClient.invalidateQueries({ queryKey: queryKeyToInvalidate });
      }
    },
  });
};

export const useUpdate = <TVariables, TResponse>(
  url: string,
  queryKeyToInvalidate?: QueryKey,
) => {
  const queryClient = useQueryClient();
  return useMutation<
    TResponse,
    string,
    { id: string | number; data: TVariables }
  >({
    mutationFn: ({ id, data }) => apiClient.patch(`${url}/${id}`, data),
    onSuccess: () => {
      if (queryKeyToInvalidate) {
        queryClient.invalidateQueries({ queryKey: queryKeyToInvalidate });
      }
    },
  });
};

export const useDelete = (url: string, queryKeyToInvalidate?: QueryKey) => {
  const queryClient = useQueryClient();
  return useMutation<void, string, string | number>({
    mutationFn: (id) => apiClient.delete(`${url}/${id}`),
    onSuccess: () => {
      if (queryKeyToInvalidate) {
        queryClient.invalidateQueries({ queryKey: queryKeyToInvalidate });
      }
    },
  });
};
