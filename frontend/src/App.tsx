import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./utils/providers/auth/auth.provider";
import Theme from "./Theme";
import Route from "./Route";
import { ToastProvider } from "./utils/providers/ToastProvider";
import { ConfirmationProvider } from "./utils/providers/ConfirmationProvider";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient();

export default function App() {
  return (
    <Theme>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthProvider>
            <ToastProvider>
              <ConfirmationProvider>
                <Route />
              </ConfirmationProvider>
            </ToastProvider>
          </AuthProvider>
        </BrowserRouter>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </Theme>
  );
}
