import * as React from 'react'
import Image from 'next/image'
import cls from 'classnames'
import { FaPauseCircle as PausedIco } from 'react-icons/fa'

export default function AlbumArt({
  art,
  percentage,
  isPaused,
  durationMs,
}: {
  art?: string
  percentage: number
  isPaused: boolean
  durationMs?: number
}) {
  const albumArtDivRef = React.useRef<HTMLDivElement>(null)
  const [size, setSize] = React.useState(0)
  const [localPercentage, setLocalPercentage] = React.useState(percentage)
  React.useEffect(() => {
    setLocalPercentage(percentage)
  }, [percentage])
  React.useEffect(() => {
    function handler() {
      setSize(Math.min(albumArtDivRef.current?.clientWidth || 0, albumArtDivRef.current?.clientHeight || 0) * 0.95)
    }
    setSize(Math.min(albumArtDivRef.current?.clientWidth || 0, albumArtDivRef.current?.clientHeight || 0) * 0.95)
    window.addEventListener('resize', handler)
    return () => {
      window.removeEventListener('resize', handler)
    }
  }, [])
  React.useEffect(() => {
    let interval: NodeJS.Timeout | undefined
    if (!isPaused) {
      interval = setInterval(() => {
        const onePercent = 10000 / (durationMs || 1)
        setLocalPercentage((p) => p + onePercent)
      }, 100)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isPaused, durationMs, localPercentage])
  return (
    <div className="flex items-center justify-center flex-1 mb-3" ref={albumArtDivRef}>
      <div
        className="relative inline-block h-full mx-auto my-2 overflow-hidden bg-gray-900 shadow-2xl rounded-2xl"
        style={{ width: size, height: size }}
      >
        <Image
          className={cls('inline transition-all', { 'opacity-60': isPaused })}
          src={art || '/images/Weezer.jpeg'}
          layout="fill"
          priority
        />
        {isPaused ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <PausedIco className="text-pink-600 filter drop-shadow-md" style={{ fontSize: size * 0.3 }} />
          </div>
        ) : null}
        <div className="absolute bottom-0 left-0 w-full h-2 bg-gray-600" />
        <div
          className="absolute bottom-0 left-0 h-2 transition-all ease-linear bg-pink-600"
          style={{ width: `${localPercentage}%` }}
        />
      </div>
    </div>
  )
}
