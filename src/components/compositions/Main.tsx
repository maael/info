import * as React from 'react'
import { GiWarPick } from 'react-icons/gi'
import { FaReact } from 'react-icons/fa'
import Head from 'next/head'
import useSpotifyInfo, { SAFE_SPACE } from '~/components/hooks/useSpotifyInfo'
import useWeatherInfo from '~/components/hooks/useWeather'
import useSteam from '~/components/hooks/useSteam'
import FitText from '~/components/primitives/FitText'
import AlbumArt from '~/components/primitives/AlbumArt'
import WeatherIcon from '~/components/primitives/WeatherIcon'
import EmojiFavicon from '~/components/primitives/EmojiFavicon'

export default function Main() {
  const {
    custom: { albumArt, track, artists, percentage, isPaused, durationMs, isPlaying },
  } = useSpotifyInfo()
  const { weather, temp } = useWeatherInfo()
  const { playersInDRG } = useSteam()
  const isLoading = [weather, temp, track, artists].filter(Boolean).length === 0
  return (
    <>
      {isPlaying ? (
        <>
          <EmojiFavicon emoji={isPaused ? '⏸' : '🎧'} />
          <Head>
            <title>{`${track} - ${artists}`.replace(new RegExp(SAFE_SPACE, 'g'), ' ')}</title>
          </Head>
        </>
      ) : null}
      <FitText className="text-center uppercase neon text-gradient bg-gradient-to-br from-pink-600 via-pink-700 to-yellow-600">
        {track || weather?.main || 'Loading...'}
      </FitText>
      {isLoading ? (
        <div className="flex items-center justify-center">
          <FaReact className="text-pink-600 text-9xl animate-pulse" />
        </div>
      ) : null}
      <FitText
        className="text-center uppercase neon text-gradient bg-gradient-to-br from-pink-600 via-pink-700 to-yellow-600"
        style={{ marginTop: 10 }}
      >
        {artists || weather?.description || ''}
      </FitText>
      {albumArt ? (
        <AlbumArt art={albumArt?.url} isPaused={isPaused} durationMs={durationMs} percentage={percentage} />
      ) : temp ? (
        <>
          <FitText
            className="text-center uppercase neon text-gradient bg-gradient-to-br from-pink-600 via-pink-700 to-yellow-600"
            style={{ marginTop: 10 }}
          >
            {temp.temp.toFixed(0) || ''}
            <span className="ml-2 text-5xl" style={{ verticalAlign: 'top' }}>
              º
            </span>
          </FitText>
          <WeatherIcon weather={weather} />
        </>
      ) : null}
      {playersInDRG.length ? (
        <div className="flex flex-row items-center justify-center gap-2 text-center text-pink-600">
          <GiWarPick className="text-xl" /> {playersInDRG.length} in Deep Rock Galactic
        </div>
      ) : null}
    </>
  )
}
