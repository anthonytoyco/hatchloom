import { MOCK_STUDENT } from "@/lib/mock-data"
import type { StudentProfile } from "@/lib/types"
import { useQuery } from "@tanstack/react-query"

// Student profile comes from the Auth service (not LaunchPad scope).
// Mock-backed until Auth integration is added.
export function useStudent() {
  const { data, isLoading, error } = useQuery<StudentProfile>({
    queryKey: ["student"],
    queryFn: () => Promise.resolve(MOCK_STUDENT),
    staleTime: Infinity,
  })
  return { data: data ?? null, isLoading, error }
}
