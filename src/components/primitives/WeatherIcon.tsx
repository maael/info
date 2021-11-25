import * as React from 'react'
import { IconType } from 'react-icons'
import { WiCloudy, WiDaySunny } from 'react-icons/wi'
import { Weather } from '~/components/hooks/useWeather'

const WeatherIcon: React.FC<{ weather?: Weather }> = ({ weather }) => {
  const desc = weather?.description.toLowerCase() || ''
  let Icon: IconType | undefined
  if (desc.includes('cloud')) {
    Icon = WiCloudy
  } else if (desc.includes('sun')) {
    Icon = WiDaySunny
  }
  return Icon ? (
    <div className="text-center flex-1 flex justify-center items-center">
      <WiCloudy className="inline-block text-pink-600" style={{ fontSize: 'min(60vmin, 175px)' }} />
    </div>
  ) : null
}

export default WeatherIcon
