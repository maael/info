import { useQuery } from 'react-query'

export default function useTrains() {
  const { data, isLoading, error, refetch, isFetching } = useQuery(
    'trainsInfo',
    () => fetch('/api/info/trains').then((r) => r.json()),
    {
      refetchInterval: 60_000 * 5,
      retry: true,
      retryDelay: 1_000,
    }
  )
  return { data, isLoading: isLoading || isFetching, error, refetch }
}
