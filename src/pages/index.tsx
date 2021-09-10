import Image from 'next/image'
import useSpotifyInfo from '~/components/hooks/useSpotifyInfo'

export default function Index() {
  const {
    custom: { albumArt, title, percentage },
  } = useSpotifyInfo()
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
            <div className="h-2 bg-pink-600 absolute bottom-0 left-0" style={{ width: `${percentage}%` }} />
          </div>
        ) : null}
        <div className="neon text-gradient bg-gradient-to-br from-pink-600 via-pink-700 to-yellow-600 text-6xl uppercase text-center py-10 absolute top-0 left-0 right-0">
          {title || 'Info'}
        </div>
      </div>
    </div>
  )
}
