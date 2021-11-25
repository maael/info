import Overlay from '~/components/primitives/Overlay'
import Paint from '~/components/primitives/Paint'

export default function GuestbookPage() {
  return (
    <Overlay>
      <div className="flex flex-col flex-1 h-full">
        <h1 className="mt-5 mb-4 text-4xl text-center uppercase neon text-gradient bg-gradient-to-br from-pink-600 via-pink-700 to-yellow-600">
          New Guestbook
        </h1>
        <div className="flex flex-1 mx-3 my-2">
          <Paint />
        </div>
      </div>
    </Overlay>
  )
}
