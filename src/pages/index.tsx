import * as React from 'react'
import Image from 'next/image'
import { WiCloudy, WiDaySunny } from 'react-icons/wi'
import { Textfit } from 'react-textfit'
import useSpotifyInfo from '~/components/hooks/useSpotifyInfo'
import useWeatherInfo from '~/components/hooks/useWeather'
import useSteam from '~/components/hooks/useSteam'

const FitText: React.FC<React.ComponentProps<typeof Textfit>> = ({ children, max, ...props }) => (
  <Textfit forceSingleModeWidth={true} mode="single" max={max ?? 100} {...props}>
    {children}
  </Textfit>
)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const WeatherIcon: React.FC<{ weather: any }> = ({ weather }) => {
  const desc = weather[0]?.description.toLowerCase() || ''
  if (desc.includes('cloud')) {
    return (
      <FitText className="text-center text-pink-600" max={300}>
        <WiCloudy className="inline-block" />
      </FitText>
    )
  } else if (desc.includes('sun')) {
    return (
      <FitText className="text-center text-yellow-600" max={300}>
        <WiDaySunny className="inline-block" />
      </FitText>
    )
  }
  return null
}

export default function Index() {
  const {
    custom: { albumArt, track, artists, percentage },
  } = useSpotifyInfo()
  const { weather } = useWeatherInfo()
  const { playersInDRG } = useSteam()
  return (
    <div className="relative flex flex-col flex-1 p-5 bg-gray-800">
      <FitText className="text-center uppercase neon text-gradient bg-gradient-to-br from-pink-600 via-pink-700 to-yellow-600">
        {track || weather[0]?.main || 'Loading...'}
      </FitText>
      <FitText
        className="text-center uppercase neon text-gradient bg-gradient-to-br from-pink-600 via-pink-700 to-yellow-600"
        style={{ marginTop: 10 }}
      >
        {artists || weather[0]?.description || ''}
      </FitText>
      {albumArt ? (
        <div className="flex items-center justify-center flex-1 mb-3">
          <div
            className="relative inline-block h-full mx-auto my-2 overflow-hidden bg-gray-900 shadow-2xl rounded-2xl"
            style={{ aspectRatio: 'auto 1/1' }}
          >
            <Image className="inline" src={albumArt.url} layout="fill" priority />
            <div className="absolute bottom-0 left-0 w-full h-2 bg-gray-600" />
            <div
              className="absolute bottom-0 left-0 h-2 transition-all ease-linear bg-pink-600"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      ) : (
        <WeatherIcon weather={weather} />
      )}
      {playersInDRG.length ? <div className="text-center">{playersInDRG.length} in Deep Rock Galactic</div> : null}
    </div>
  )
}
