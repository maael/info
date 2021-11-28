import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { FaPlusCircle, FaSpinner } from 'react-icons/fa'
import cls from 'classnames'
import Overlay from '~/components/primitives/Overlay'
import useGuestbookMedia from '~/components/hooks/useGuestbookMedia'

export default function GuestbookPage() {
  const { data, isLoading } = useGuestbookMedia()
  const [selected, setSelected] = React.useState('')
  return (
    <Overlay>
      <h1 className="mt-5 text-4xl text-center uppercase neon text-gradient bg-gradient-to-br from-pink-600 via-pink-700 to-yellow-600">
        Guestbook
      </h1>
      <div className="flex flex-col h-full">
        {selected ? (
          <div className="flex flex-col items-center justify-center mt-3">
            <Image
              src={selected}
              height={'400%'}
              width={'400%'}
              objectFit="contain"
              className="bg-white bg-opacity-50 cursor-help"
              onClick={() => setSelected('')}
              title={new URL(selected).pathname
                .replace('/guestbook/', '')
                .replace('.png', '')
                .split('---')[0]
                .replace('-', ' ')}
            />
            <caption className="mt-2 text-xl">
              "
              {new URL(selected).pathname
                .replace('/guestbook/', '')
                .replace('.png', '')
                .split('---')[0]
                .replace('-', ' ')}
              "{' on '}
              {(new URL(selected).pathname.replace('/guestbook/', '').replace('.png', '').split('---')[1] || '')
                .split('--')[0]
                .split('-')
                .reverse()
                .join('/') || 'Unknown'}
            </caption>
          </div>
        ) : null}
        {isLoading ? (
          <div>
            <FaSpinner className="animate-spin mx-auto mt-3 text-4xl" />
          </div>
        ) : null}
        <div className="flex flex-row flex-wrap items-start justify-center flex-1 pb-20 overflow-y-auto">
          {data.map((i) => (
            <div
              key={i}
              className={cls('m-4 bg-white bg-opacity-50 cursor-help border-2 border-gray-700', {
                'border-white border-dotted': selected === i,
              })}
              onClick={() => setSelected((s) => (s === i ? '' : i))}
            >
              <Image
                src={i}
                height={100}
                width={100}
                objectFit="contain"
                title={new URL(i).pathname
                  .replace('/guestbook/', '')
                  .replace('.png', '')
                  .split('---')[0]
                  .replace('-', ' ')}
              />
            </div>
          ))}
        </div>
      </div>
      <Link href="/guestbook/new">
        <a>
          <FaPlusCircle className="absolute text-5xl cursor-pointer bottom-5 right-5" />
        </a>
      </Link>
    </Overlay>
  )
}
