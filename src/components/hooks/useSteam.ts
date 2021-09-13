import { useQuery } from 'react-query'

export default function useSteam() {
  const { data, isLoading, error } = useQuery('steamInfo', () => fetch('/api/info/steam').then((r) => r.json()), {
    refetchInterval: 60_000 * 5,
  })
  const playersInGame = data?.players.filter((p) => p.gameextrainfo) || []
  const playersInDRG = playersInGame.filter((p) => p.gameextrainfo === 'Deep Rock Galactic')
  return { data, isLoading, error, playersInDRG }
}
