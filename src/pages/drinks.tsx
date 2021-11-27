import * as React from 'react'
import { FaCocktail, FaInfoCircle, FaUser } from 'react-icons/fa'
import cls from 'classnames'
import NeonText from '~/components/primitives/NeonText'
import Overlay from '~/components/primitives/Overlay'
import { getDrinks, getStock } from '~/utils/data'
import { Drink } from '~/utils/types'

export default function DrinksPage({ drinks }: { drinks: Drink[] }) {
  const numInStock = drinks.filter((d) => d.inStock).length
  return (
    <Overlay>
      <h1 className="mt-5 text-5xl text-center uppercase neon text-gradient bg-gradient-to-br from-pink-600 via-pink-700 to-yellow-600">
        Drinks
      </h1>
      <div className="flex flex-col items-center">
        <input
          placeholder={`Search ${numInStock} drink${numInStock === 1 ? '' : 's'}...`}
          className="w-11/12 px-2 py-1 mx-2 mt-2 mb-3 text-white bg-gray-800 border border-gray-900 rounded-md"
        />
      </div>
      <div className="flex flex-col h-full pb-40 overflow-y-scroll">
        {drinks.map((d) => (d.inStock ? <DrinkItem key={d.id} drink={d} /> : null))}
      </div>
    </Overlay>
  )
}

function DrinkItem({ drink }: { drink: Drink }) {
  const [isOpen, setIsOpen] = React.useState(false)
  return (
    <div
      className="flex flex-col px-4 py-3 mx-2 mb-2 bg-gray-800 rounded-md shadow-sm select-none"
      onClick={() => setIsOpen((o) => !o)}
    >
      <div className="flex flex-row mb-1">
        <NeonText Element="h3" className="flex-1 text-2xl uppercase">
          {drink.name}
        </NeonText>
        <FaInfoCircle className={cls('text-xl -mr-1', { 'opacity-60': !isOpen })} />
      </div>
      {drink.description ? (
        <p className="flex flex-row items-center mb-1 text-sm">
          <FaInfoCircle className="mr-2 text-sm" /> {drink.description}
        </p>
      ) : null}
      <p className="flex flex-row items-center mb-1">
        <FaCocktail className="mr-2 text-sm" /> {drink.ingredients.map((i) => i.name).join(', ')}
      </p>
      <p className="flex flex-row items-center mb-1 text-xs">
        <FaUser className="mr-2 text-sm" /> {drink.addedBy}
      </p>
      {isOpen ? (
        <div className="mt-2 mb-1">
          <h4 className="mb-1 font-bold uppercase border-b border-pink-600">Amounts</h4>
          {drink.steps ? (
            <ol className="flex flex-col">
              {drink.ingredients.map((i) => (
                <li key={i.name} className="mb-1">
                  - {[i.name, i.amount].filter(Boolean).join(', ')}
                </li>
              ))}
            </ol>
          ) : (
            <p>Make the drink</p>
          )}
          <h4 className="mb-1 font-bold uppercase border-b border-pink-600">Steps</h4>
          {drink.steps ? (
            <ol className="flex flex-col">
              {drink.steps.map((s, i) => (
                <li key={i} className="mb-1">
                  {i + 1}. {s}
                </li>
              ))}
            </ol>
          ) : (
            <p>Make the drink</p>
          )}
        </div>
      ) : null}
    </div>
  )
}

export async function getStaticProps() {
  const stock = await getStock()
  const drinks = await getDrinks(stock)
  return {
    props: { drinks, stock },
  }
}
