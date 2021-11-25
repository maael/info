import * as React from 'react'
import { GiWarPick } from 'react-icons/gi'
import useSpotifyInfo from '~/components/hooks/useSpotifyInfo'
import useWeatherInfo from '~/components/hooks/useWeather'
import useSteam from '~/components/hooks/useSteam'
import FitText from '~/components/primitives/FitText'
import AlbumArt from '~/components/primitives/AlbumArt'
import WeatherIcon from '~/components/primitives/WeatherIcon'

export default function Index() {
  const {
    custom: { albumArt, track, artists, percentage, isPaused, durationMs },
  } = useSpotifyInfo()
  const { weather, temp } = useWeatherInfo()
  const { playersInDRG } = useSteam()
  return (
    <div className="relative flex flex-col flex-1 p-5 bg-gray-800">
      <FitText className="text-center uppercase neon text-gradient bg-gradient-to-br from-pink-600 via-pink-700 to-yellow-600">
        {track || weather?.main || 'Loading...'}
      </FitText>
      <FitText
        className="text-center uppercase neon text-gradient bg-gradient-to-br from-pink-600 via-pink-700 to-yellow-600"
        style={{ marginTop: 10 }}
      >
        {artists || weather?.description || ''}
      </FitText>
      {albumArt ? (
        <AlbumArt art={albumArt?.url} isPaused={isPaused} durationMs={durationMs} percentage={percentage} />
      ) : (
        <>
          <FitText
            className="text-center uppercase neon text-gradient bg-gradient-to-br from-pink-600 via-pink-700 to-yellow-600"
            style={{ marginTop: 10 }}
          >
            {temp?.temp.toFixed(0) || ''}
            <span className="text-5xl ml-2" style={{ verticalAlign: 'top' }}>
              º
            </span>
          </FitText>
          <WeatherIcon weather={weather} />
        </>
      )}
      {playersInDRG.length ? (
        <div className="text-center text-pink-600 flex flex-row justify-center items-center gap-2">
          <GiWarPick className="text-xl" /> {playersInDRG.length} in Deep Rock Galactic
        </div>
      ) : null}
    </div>
  )
}
