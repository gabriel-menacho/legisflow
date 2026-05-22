import { realApi } from "@/lib/api-client";
import { mockApi } from "@/mocks/api-mock";

export { ApiError } from "@/lib/api-client";
export { getTokens, setTokens, clearTokens } from "@/lib/auth-tokens";
export { resetMockStore } from "@/mocks/store";

const useMock = process.env.NEXT_PUBLIC_MOCK_API === "true";

export const api = useMock ? mockApi : realApi;

export const isMockApi = useMock;
