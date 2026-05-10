import {
  QueryClient,
  QueryClientProvider,
  MutationCache,
  QueryCache,
} from "@tanstack/react-query";
import { ReactNode } from "react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
  queryCache: new QueryCache({
    onError: (error) => {
      console.error(error);
    },
  }),

  mutationCache: new MutationCache({
    onError: (error) => {
      console.error(error);
    },
  }),
});

export const QueryProvider = ({ children }: { children: ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
