import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";

const queryclient = new QueryClient();

// React tanstack query provider wrapper
export const QueryProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryclient}>{children}</QueryClientProvider>
  );
};
