import { useQuery } from 'react-query'

export const DATA_KEY = 'guestbookMedia'

export default function useGuestbookMedia() {
  const { data, isLoading, error, refetch, isFetching } = useQuery(
    DATA_KEY,
    () => fetch('/api/media').then((r) => r.json()),
    {
      refetchInterval: 60_000 * 30,
      retry: true,
      retryDelay: 1_000,
    }
  )
  const media = data?.media || []
  return { data: media, isLoading: isLoading || isFetching, error, refetch }
}
