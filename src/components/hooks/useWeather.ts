import { useQuery } from 'react-query'

export interface Weather {
  id: number
  main: string
  description: string
  icon: string
}

export interface Temp {
  temp: number
  feels_like: number
  temp_min: number
  temp_max: number
  pressure: number
  humidity: number
}

export default function useWeatherInfo() {
  const { data, isLoading, error } = useQuery('weatherInfo', () => fetch('/api/info/weather').then((r) => r.json()), {
    refetchInterval: 60_000 * 60,
  })
  const weather: Weather | undefined = (data?.weather || [])[0]
  const temp: Temp | undefined = data?.main
  return { data, isLoading, error, weather, temp }
}
