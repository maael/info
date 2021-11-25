import Link from 'next/link'
import { FaPlusCircle } from 'react-icons/fa'
import Overlay from '~/components/primitives/Overlay'

export default function GuestbookPage() {
  return (
    <Overlay>
      <h1 className="mt-5 text-4xl text-center uppercase neon text-gradient bg-gradient-to-br from-pink-600 via-pink-700 to-yellow-600">
        Guestbook
      </h1>
      <Link href="/guestbook/new">
        <a>
          <FaPlusCircle className="absolute text-5xl cursor-pointer bottom-5 right-5" />
        </a>
      </Link>
    </Overlay>
  )
}
