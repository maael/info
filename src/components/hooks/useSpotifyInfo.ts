import { useQuery } from 'react-query'

export const SAFE_SPACE = ' '

export default function useSpotifyInfo() {
  const { data, isLoading, error } = useQuery(
    'spotifyInfo',
    () => fetch('/api/spotify/playing').then((r) => r.json()),
    {
      refetchInterval: 10_000,
    }
  )
  const track = (data?.item?.name || '').replace(/\s/g, SAFE_SPACE)
  const artists = data?.item?.artists?.map((a) => a.name.replace(/\s/g, SAFE_SPACE)).join(`,${SAFE_SPACE}`) || ''
  const title = `${[track, artists].filter(Boolean).join(`${SAFE_SPACE}-${SAFE_SPACE}`)}`.trim()
  const albumArt = (data?.item?.album?.images || [])[0]
  const durationMs = data?.item?.duration_ms || 1
  const progressMs = data?.progress_ms || 0
  const percentage = (progressMs / durationMs) * 100
  const custom = {
    title,
    track,
    artists,
    albumArt,
    durationMs,
    progressMs,
    percentage,
    isPlaying: data?.isPlaying || false,
    isPaused: data?.isPlaying && !data?.is_playing,
    playlist: data?.context.type === 'playlist' ? data?.context.uri : null,
  }
  console.info('what', custom.playlist)
  return { data, isLoading, error, custom }
}
