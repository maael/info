import { useQuery } from 'react-query'

export default function useSpotifyInfo() {
  const { data, isLoading, error } = useQuery(
    'spotifyInfo',
    () => fetch('/api/spotify/playing').then((r) => r.json()),
    {
      refetchInterval: 10_000,
    }
  )
  const title = `${[data?.item?.name, data?.item?.artists?.map((a) => a.name).join(', ')]
    .filter(Boolean)
    .join(' - ')}`.trim()
  const albumArt = (data?.item?.album?.images || [])[0]
  const durationMs = data?.item?.duration_ms || 1
  const progressMs = data?.progress_ms || 0
  const percentage = (progressMs / durationMs) * 100
  const custom = {
    title,
    albumArt,
    durationMs,
    progressMs,
    percentage,
  }
  return { data, isLoading, error, custom }
}
