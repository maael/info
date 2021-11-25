import * as React from 'react'
import { FaCocktail, FaInfoCircle, FaUser } from 'react-icons/fa'
import cls from 'classnames'
import NeonText from '~/components/primitives/NeonText'
import Overlay from '~/components/primitives/Overlay'

const IN_STOCK_INGREDIENTS = ['Midori', 'Lemonade', 'Sour Mix', 'Rum']

const DRINKS = [
  {
    id: 1,
    name: 'Kermit Juice',
    description: 'Green and juicey',
    ingredients: [
      { name: 'Midori', amount: '1 shot' },
      { name: 'Sour Mix', amount: '3 shots' },
      { name: 'Lemonade', amount: 'Top it up' },
    ],
    steps: ['Do thing', 'do other thing'],
    addedBy: 'Matt',
  },
  {
    id: 2,
    name: 'Dark and Stormy and a super long name',
    description: 'Dark, stormy',
    ingredients: [
      {
        name: 'Rum',
        amount: '1 shot',
      },
    ],
    steps: ['Do thing', 'do other thing'],
    addedBy: 'Matt',
  },
  {
    id: 3,
    name: 'Kermit Juice',
    description: 'Green and juicey',
    ingredients: [
      { name: 'Midori', amount: '1 shot' },
      { name: 'Sour Mix', amount: '3 shots' },
      { name: 'Lemonade', amount: 'Top it up' },
    ],
    steps: ['Do thing', 'do other thing'],
    addedBy: 'Matt',
  },
  {
    id: 4,
    name: 'Dark and Stormy',
    description: 'Dark, stormy',
    ingredients: [
      {
        name: 'Rum',
        amount: '1 shot',
      },
    ],
    addedBy: 'Matt',
  },
  {
    id: 5,
    name: 'Kermit Juice',
    description: 'Green and juicey',
    ingredients: [
      { name: 'Midori', amount: '1 shot' },
      { name: 'Sour Mix', amount: '3 shots' },
      { name: 'Lemonade', amount: 'Top it up' },
    ],
    addedBy: 'Matt',
  },
  {
    id: 6,
    name: 'Dark and Stormy and a super long name',
    description: 'Dark, stormy',
    ingredients: [
      {
        name: 'Rum',
        amount: '1 shot',
      },
    ],
    addedBy: 'Matt',
  },
]

const IN_STOCK_DRINKS = DRINKS.filter((d) => d.ingredients.every(({ name }) => IN_STOCK_INGREDIENTS.includes(name)))

export default function DrinksPage() {
  return (
    <Overlay>
      <h1 className="mt-5 text-5xl text-center uppercase neon text-gradient bg-gradient-to-br from-pink-600 via-pink-700 to-yellow-600">
        Drinks
      </h1>
      <div className="flex flex-col items-center">
        <input
          placeholder="Search..."
          className="w-11/12 px-2 py-1 mx-2 mt-2 mb-3 text-white bg-gray-800 border border-gray-900 rounded-md"
        />
      </div>
      <div className="flex flex-col h-full gap-2 pb-40 overflow-y-scroll">
        {IN_STOCK_DRINKS.map((d) => (
          <DrinkItem key={d.id} drink={d} />
        ))}
      </div>
    </Overlay>
  )
}

function DrinkItem({ drink }: { drink: typeof DRINKS[0] }) {
  const [isOpen, setIsOpen] = React.useState(false)
  return (
    <div
      className="flex flex-col gap-1 px-4 py-3 mx-2 bg-gray-800 rounded-md shadow-sm select-none"
      onClick={() => setIsOpen((o) => !o)}
    >
      <div className="flex flex-row">
        <NeonText Element="h3" className="flex-1 text-2xl uppercase">
          {drink.name}
        </NeonText>
        <FaInfoCircle className={cls('text-xl -mr-1', { 'opacity-60': !isOpen })} />
      </div>
      <p className="flex flex-row items-center gap-2 text-sm">
        <FaInfoCircle className="text-sm" /> {drink.description}
      </p>
      <p className="flex flex-row items-center gap-2">
        <FaCocktail className="text-sm" /> {drink.ingredients.map((i) => i.name).join(', ')}
      </p>
      <p className="flex flex-row items-center gap-2 text-xs">
        <FaUser className="text-sm" /> {drink.addedBy}
      </p>
      {isOpen ? (
        <div className="mt-2 mb-3">
          <h4 className="mb-2 font-bold uppercase border-b border-pink-600">Steps</h4>
          {drink.steps ? (
            <ol className="flex flex-col gap-1">
              {drink.steps.map((s, i) => (
                <li key={i}>
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
