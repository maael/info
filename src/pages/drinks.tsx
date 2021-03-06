import * as React from 'react'
import { FaCocktail, FaDice, FaInfoCircle, FaRandom, FaTimesCircle, FaUser, FaGlassWhiskey } from 'react-icons/fa'
import cls from 'classnames'
import { v4 as uuid } from 'uuid'
import NeonText from '~/components/primitives/NeonText'
import Overlay from '~/components/primitives/Overlay'
import { getDrinks, getStock } from '~/utils/data'
import { Drink, Stock } from '~/utils/types'
import { getRandomFromList, getRandomInt } from '~/utils/rnd'
import useFilter from '~/components/hooks/useFilter'

enum RandomState {
  Idle,
  Thinking,
}

type ExtendedStock = Stock & { amount: string }

export default function DrinksPage({ drinks, stock }: { drinks: Drink[]; stock: Stock[] }) {
  const inStockDrinks = drinks.filter((d) => d.inStock)
  const [selectedDrink, setSelectedDrink] = React.useState<Drink | null>(null)
  const [selectedShot, setSelectedShot] = React.useState<string | null>(null)
  const [randomState, setRandomState] = React.useState(RandomState.Idle)
  const { search, setSearch, filtered } = useFilter(drinks, 'name,description,ingredients.name,ingredients.type')
  return (
    <Overlay>
      <h1 className="mt-5 text-5xl text-center uppercase neon text-gradient bg-gradient-to-br from-pink-600 via-pink-700 to-yellow-600">
        Drinks
      </h1>
      <div className="flex flex-col items-center mx-2 mt-2 mb-2">
        <input
          placeholder={`Search ${inStockDrinks.length} drink${inStockDrinks.length === 1 ? '' : 's'}...`}
          className="w-11/12 px-2 py-1 mb-2 text-white bg-gray-800 border border-gray-900 rounded-md"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div>
          <button
            className="px-2 py-1 mx-1 text-4xl text-gray-700 bg-pink-600 rounded-md hover:text-gray-800 hover:bg-pink-700"
            onClick={() => setSelectedDrink(getRandomFromList(drinks.filter((d) => d.inStock)))}
          >
            <FaRandom />
          </button>
          <button
            className={cls(
              'bg-pink-600 rounded-md text-gray-700 px-2 py-1 mx-1 hover:text-gray-800 hover:bg-pink-700 text-4xl',
              { 'animate-pulse': randomState === RandomState.Thinking }
            )}
            disabled={randomState === RandomState.Thinking}
            onClick={async () => {
              setRandomState(RandomState.Thinking)
              try {
                const alcohol: ExtendedStock[] = Array.from({ length: getRandomInt(1, 3) })
                  .map(() => getRandomFromList(stock.filter((s) => s.type === 'alcohol')))
                  .map((i) => {
                    const amount = getRandomInt(1, 2)
                    return { ...i, amount: `${amount} shot${amount === 1 ? '' : 's'}` }
                  })
                const mixer: ExtendedStock[] = Array.from({ length: getRandomInt(1, 3) })
                  .map(() => getRandomFromList(stock.filter((s) => s.type === 'mixers')))
                  .map((i, idx) => {
                    const shots = getRandomInt(1, 2)
                    const amount = idx === 0 ? 'fill to the top' : `${shots} shot${shots === 1 ? '' : 's'}`
                    return { ...i, amount }
                  })
                const misc: ExtendedStock[] = Array.from({ length: getRandomInt(0, 2) }).map(() =>
                  getRandomFromList(stock.filter((s) => s.type === 'misc') as ExtendedStock[])
                )
                const name = getDrinkName()
                let description = ''
                const id = `generated-${uuid()}`
                const rndDrink: Drink = {
                  name,
                  description,
                  steps: DEFAULT_STEPS,
                  ingredients: [
                    ...new Set(
                      [
                        [...new Map<string, ExtendedStock>(alcohol.map((a) => [a.name, a])).values()],
                        [...new Map<string, ExtendedStock>(mixer.map((a) => [a.name, a])).values()],
                        [...new Map<string, ExtendedStock>(misc.map((a) => [a.name, a])).values()],
                      ].flat()
                    ),
                  ],
                  addedBy: 'RNGesus',
                  id,
                  inStock: true,
                }
                setSelectedDrink(rndDrink)
                try {
                  const { output } = await fetch(
                    `/api/info/generatetext?input=A drink called ${name} tastes like`
                  ).then((r) => r.json())
                  const formattedDescription = output.join(' ')
                  description = `${formattedDescription.slice(0, 1).toUpperCase()}${formattedDescription.slice(1)}`
                } catch (e) {
                  console.warn(e)
                }
                setSelectedDrink((d) => (d?.id === id ? { ...d, description } : d))
              } finally {
                setRandomState(RandomState.Idle)
              }
            }}
          >
            <FaDice />
          </button>
          <button
            className="px-2 py-1 mx-1 text-4xl text-gray-700 bg-pink-600 rounded-md hover:text-gray-800 hover:bg-pink-700"
            onClick={() => setSelectedShot(getRandomFromList(stock.filter((s) => s.type === 'alcohol')).name)}
          >
            <FaGlassWhiskey />
          </button>
        </div>
      </div>
      {randomState === RandomState.Thinking ? <div className="mb-2 text-center animate-pulse">Thinking...</div> : null}
      {selectedShot ? (
        <div
          onClick={() => setSelectedShot(null)}
          className="mb-4 cursor-pointer text-center relative animate-pulse font-bold py-4 text-gray-700 bg-pink-600 text-5xl"
        >
          {selectedShot} <FaTimesCircle className="text-2xl absolute right-4 top-7" />
        </div>
      ) : null}
      {selectedDrink ? (
        <div className="mb-10">
          <DrinkItem drink={selectedDrink} isOpen={true} onClick={() => setSelectedDrink(null)} />
        </div>
      ) : null}
      <div className="flex flex-col h-full pb-40 overflow-y-auto">
        {filtered.map((d) => (
          <DrinkItem key={d.id} drink={d} />
        ))}
      </div>
    </Overlay>
  )
}

function DrinkItem({ drink, isOpen: isOpenProp, onClick }: { drink: Drink; isOpen?: boolean; onClick?: () => void }) {
  const [isOpen, setIsOpen] = React.useState(!!isOpenProp)
  const Icon = onClick ? FaTimesCircle : FaInfoCircle
  return (
    <div
      className="flex flex-col px-4 py-3 mx-2 mb-2 bg-gray-800 rounded-md shadow-sm select-none"
      onClick={onClick || (() => setIsOpen((o) => !o))}
    >
      <div className="flex flex-row mb-1">
        <NeonText Element="h3" className="flex-1 text-4xl uppercase">
          {drink.name}
        </NeonText>
        <Icon className={cls('text-xl -mr-1', { 'opacity-60': !isOpen })} />
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
          {drink.ingredients ? (
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
          <h4 className="mt-1 mb-1 font-bold uppercase border-b border-pink-600">Steps</h4>
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

const DEFAULT_STEPS = ['Add ice to glass', 'Pour in ingredients and stir', 'Drink']

function getDrinkName() {
  const prefixes = [
    'Blood',
    'Monkey',
    'French',
    'Kermit',
    'Sex',
    'Purple',
    'Blue',
    'Old',
    'Whiskey',
    'Pina',
    'Cuba',
    'White',
    'Moscow',
    'Dark',
    'Wow',
    'The Puckering',
    'Sex in the',
    'Regretful',
    'Fizzy',
    'Your First',
    'The Pointless',
    'The Puking',
    'The Drunk',
    'The Belching',
    'The',
  ]
  const suffixes = [
    'on the Beach',
    'Party',
    'Lady',
    '75',
    'Mac',
    'Caesar',
    'Fizz',
    'Punch',
    'Cup',
    '& Sand',
    'Fashioned',
    'Rain',
    'Sour',
    'Colada',
    'Libre',
    'Breeze',
    'Mary',
    'Russian',
    'Mule',
    'Spritz',
    'Cocktail',
    'Stormy',
    '& Tonic',
    'Lagoon',
    'Sunrise',
    'Hawaii',
    'Mary',
    'Island Ice Tea',
  ]
  return `${getRandomFromList(prefixes)} ${getRandomFromList(suffixes)}`
}
