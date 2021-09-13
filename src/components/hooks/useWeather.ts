import { useQuery } from 'react-query'

export default function useWeatherInfo() {
  const { data, isLoading, error } = useQuery('weatherInfo', () => fetch('/api/info/weather').then((r) => r.json()), {
    refetchInterval: 10_000,
  })
  const weather = data?.weather || []
  return { data, isLoading, error, weather }
}
