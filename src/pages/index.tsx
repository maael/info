import * as React from 'react'
import Image from 'next/image'
import useSpotifyInfo from '~/components/hooks/useSpotifyInfo'
import ScrollingText from '~/components/primitives/ScrollingText'
import useWeatherInfo from '~/components/hooks/useWeather'
import useSteam from '~/components/hooks/useSteam'

export default function Index() {
  const {
    custom: { albumArt, track, artists, percentage },
  } = useSpotifyInfo()
  const { weather } = useWeatherInfo()
  const { playersInDRG } = useSteam()
  return (
    <div className="bg-gray-800 text-pink-600 h-full flex flex-col relative">
      <div className="flex-1 flex justify-center items-center">
        {albumArt ? (
          <div
            className="inline-block relative overflow-hidden rounded-2xl shadow-2xl m-2"
            style={{ width: `min(100vmin, ${albumArt.width}px)`, height: `min(100vmin, ${albumArt.height}px` }}
          >
            <Image className="inline" src={albumArt.url} layout="fill" priority />
            <div className="h-2 bg-gray-600 absolute bottom-0 left-0 w-full" />
            <div
              className="h-2 bg-pink-600 absolute bottom-0 left-0 transition-all ease-linear"
              style={{ width: `${percentage}%` }}
            />
          </div>
        ) : null}
        <ScrollingText
          timingCount={Math.max(track.length, artists.length)}
          className="neon text-gradient bg-gradient-to-br from-pink-600 via-pink-700 to-yellow-600 text-6xl uppercase py-10 absolute top-0 left-0 whitespace-nowrap indent"
        >
          {track || weather[0]?.main || 'Info'}
        </ScrollingText>
        <ScrollingText
          timingCount={Math.max(track.length, artists.length)}
          className="neon text-gradient bg-gradient-to-br from-pink-600 via-pink-700 to-yellow-600 text-5xl uppercase py-10 absolute top-20 left-0 whitespace-nowrap indent"
        >
          {artists || weather[0]?.description || 'Info'}
        </ScrollingText>
      </div>
      {playersInDRG.length ? <div className="text-center">{playersInDRG.length} in Deep Rock Galactic</div> : null}
    </div>
  )
}
