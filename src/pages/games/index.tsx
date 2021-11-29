import * as React from 'react'
import { FaSearch } from 'react-icons/fa'
import Overlay from '~/components/primitives/Overlay'
import { getGameInfo } from '~/utils/data'
import { getRandomFromList } from '~/utils/rnd'

export default function GamesPage({ gameInfo }) {
  const [selected, setSelected] = React.useState<string | null>(null)
  return (
    <Overlay>
      <div className="flex flex-col h-full">
        <h1 className="mt-5 mb-3 text-5xl text-center uppercase neon text-gradient bg-gradient-to-br from-pink-600 via-pink-700 to-yellow-600">
          Games
        </h1>
        <button
          className="flex flex-row items-center justify-between px-5 py-1 mx-5 my-2 text-xl text-gray-700 bg-pink-600 rounded-md"
          onClick={() => setSelected(getRandomFromList(gameInfo['Never Have I Ever']))}
        >
          Never Have I Ever...? <FaSearch className="ml-2" />
        </button>
        <button
          className="flex flex-row items-center justify-between px-5 py-1 mx-5 my-2 text-xl text-gray-700 bg-pink-600 rounded-md"
          onClick={() => setSelected(getRandomFromList(gameInfo['Outrage']))}
        >
          Outrage <FaSearch className="ml-2" />
        </button>
        <div className="flex items-center justify-center flex-1">
          {selected ? <div className="mx-2 mt-10 text-4xl font-bold text-center">{selected}</div> : null}
        </div>
      </div>
    </Overlay>
  )
}

export async function getStaticProps() {
  const gameInfo = await getGameInfo()
  return {
    props: { gameInfo },
  }
}
