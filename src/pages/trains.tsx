import * as React from 'react'
import { FaSpinner, FaTrain } from 'react-icons/fa'
import cls from 'classnames'
import parse from 'date-fns/parse'
import differenceInMinutes from 'date-fns/differenceInMinutes'
import useTrains from '~/components/hooks/useTrain'
import Overlay from '~/components/primitives/Overlay'

export default function TrainsPage() {
  const { data, isLoading, refetch } = useTrains()
  const [destination, setDestination] = React.useState('crawley')
  return (
    <Overlay>
      <div className="flex flex-col h-full">
        <h1 className="mt-5 mb-2 text-5xl text-center uppercase neon text-gradient bg-gradient-to-br from-pink-600 via-pink-700 to-yellow-600">
          Trains
        </h1>
        <div className="flex flex-row items-center justify-center gap-2 mx-2 mb-2">
          <div className="flex flex-row flex-wrap items-center justify-center gap-1">
            <div
              className={cls('px-2 py-1 bg-gray-800 rounded-md cursor-pointer', {
                'bg-pink-600 text-gray-800': destination === 'crawley',
              })}
              onClick={() => setDestination('crawley')}
            >
              Crawley
            </div>
            <div
              className={cls('px-2 py-1 bg-gray-800 rounded-md cursor-pointer', {
                'bg-pink-600 text-gray-800': destination === 'three_bridges',
              })}
              onClick={() => setDestination('three_bridges')}
            >
              Three Bridges
            </div>
            <div
              className={cls('px-2 py-1 bg-gray-800 rounded-md cursor-pointer', {
                'bg-pink-600 text-gray-800': destination === 'brighton',
              })}
              onClick={() => setDestination('brighton')}
            >
              Brighton
            </div>
            <div
              className={cls('px-2 py-1 bg-gray-800 rounded-md cursor-pointer', {
                'bg-pink-600 text-gray-800': destination === 'haywards_heath',
              })}
              onClick={() => setDestination('haywards_heath')}
            >
              Haywards Heath
            </div>
            <div
              className={cls('px-2 py-1 bg-gray-800 rounded-md cursor-pointer', {
                'bg-pink-600 text-gray-800': destination === 'london_bridge',
              })}
              onClick={() => setDestination('london_bridge')}
            >
              London Bridge
            </div>
          </div>
          <div className="p-2 text-gray-700 bg-pink-600 rounded-full cursor-pointer">
            {isLoading ? <FaSpinner className="animate-spin" /> : <FaTrain onClick={() => refetch()} />}
          </div>
        </div>
        <div className="flex flex-col h-full gap-2 pb-2 overflow-y-scroll">
          {data && data[destination] && data[destination].trains
            ? data[destination].trains?.map((t) => (
                <div key={t.serviceId} className={cls('px-1 py-1 mx-2 bg-gray-800 rounded-md')}>
                  <div className="flex flex-col gap-1">
                    <div>
                      <div className="flex items-center gap-2 px-2 py-1 text-lg font-bold text-gray-800 bg-pink-600 rounded-md">
                        <span>{t.arrivalDepartureTime}</span>
                        <span
                          className="relative flex-1 overflow-hidden text-xs whitespace-nowrap overflow-ellipsis"
                          style={{ top: 2 }}
                        >
                          {t.to}
                        </span>
                        <span>Plat. {t.platform || '?'}</span>
                      </div>
                    </div>
                    <div className="flex flex-row items-center flex-1 gap-2 px-1 py-1">
                      <span className="flex flex-row items-center gap-1">
                        {t.fromLocation?.departureTime || '??:??'}{' '}
                        <span className="relative text-xs" style={{ top: 1 }}>
                          {t.fromCRS}
                        </span>
                      </span>
                      <span className="flex-1 border border-pink-600" />
                      <div className="flex flex-row items-center">
                        <span className="pr-2 text-sm border-r border-pink-600">
                          {t.numberOfStops || '?'} Stop{t.numberOfStops === 1 ? '' : 's'}
                        </span>
                        <span className="pl-2 text-sm border-l border-pink-600">
                          {getDuration(t.fromLocation?.departureTime, t.toLocation?.arrivalTime)}
                        </span>
                      </div>
                      <span className="flex-1 border border-pink-600" />
                      <span className="flex flex-row items-center gap-1">
                        <span className="relative text-xs" style={{ top: 1 }}>
                          {t.toCRS}
                        </span>{' '}
                        {t.toLocation?.arrivalTime || '??:??'}
                      </span>
                    </div>
                  </div>
                  <div></div>
                </div>
              ))
            : null}
        </div>
      </div>
    </Overlay>
  )
}

function getDuration(fromDeparture?: string, toArrival?: string) {
  if (!fromDeparture || !toArrival) return '?? mins'
  const fromDate = parse(fromDeparture, 'HH:mm', new Date())
  const toDate = parse(toArrival, 'HH:mm', new Date())
  return `${Math.abs(differenceInMinutes(fromDate, toDate))} mins`
}
