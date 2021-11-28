import * as React from 'react'
import { FaSearch } from 'react-icons/fa'
import Overlay from '~/components/primitives/Overlay'
import { getGameInfo } from '~/utils/data'
import { getRandomFromList } from '~/utils/rnd'

export default function GamesPage({ gameInfo }) {
  const [selected, setSelected] = React.useState<string | null>(null)
  return (
    <Overlay>
      <h1 className="mt-5 mb-3 text-5xl text-center uppercase neon text-gradient bg-gradient-to-br from-pink-600 via-pink-700 to-yellow-600">
        Games
      </h1>
      <div className="flex flex-col">
        <button
          className="my-2 mx-5 bg-pink-600 text-gray-700 rounded-md px-5 py-1 flex flex-row justify-between items-center"
          onClick={() => setSelected(getRandomFromList(gameInfo['Never Have I Ever']))}
        >
          Never Have I Ever...? <FaSearch className="ml-2" />
        </button>
        <button
          className="my-2 mx-5 bg-pink-600 text-gray-700 rounded-md px-5 py-1 flex flex-row justify-between items-center"
          onClick={() => setSelected(getRandomFromList(gameInfo['Outrage']))}
        >
          Outrage <FaSearch className="ml-2" />
        </button>
        {selected ? <div className="text-4xl text-center mt-10 mx-1 font-bold">{selected}</div> : null}
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
