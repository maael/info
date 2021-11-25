import { useRouter } from 'next/router'
import slugify from 'slugify'
import Overlay from '~/components/primitives/Overlay'
import Paint from '~/components/primitives/Paint'

export default function GuestbookPage() {
  const { push } = useRouter()
  return (
    <Overlay>
      <div className="flex flex-col flex-1 h-full">
        <h1 className="mt-5 mb-4 text-4xl text-center uppercase neon text-gradient bg-gradient-to-br from-pink-600 via-pink-700 to-yellow-600">
          New Entry
        </h1>
        <div className="flex flex-1 mx-3 my-2">
          <Paint
            onSave={async (name, blob) => {
              if (!blob) return
              console.info('what', slugify(name), name, blob)
              const formData = new FormData()
              formData.append('name', slugify(name))
              formData.append('file', blob, `${slugify(name)}.png`)
              const res = await fetch('/api/media', { method: 'POST', body: formData })
              if (res.ok) {
                push('/guestbook')
              }
            }}
          />
        </div>
      </div>
    </Overlay>
  )
}
