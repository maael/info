import { promises as fs } from 'fs'
import p from 'path'
import { v4 as uuid } from 'uuid'
import { Drink, Stock } from '~/utils/types'

async function readDataLines(name: string) {
  const drinksStr = await fs.readFile(p.join(__dirname, '..', '..', '..', 'data', name), 'utf-8')
  return drinksStr.split('\n')
}

function getSections(lines: string[]) {
  return lines.reduce<string[][]>(
    (acc, l) => {
      if (l === '---') {
        acc.push([])
        return acc
      }
      acc[acc.length - 1].push(l)
      return acc
    },
    [[]]
  )
}

function cleanLine(l: string): string
function cleanLine(l?: string): string | undefined
function cleanLine(l) {
  return l ? l.replace(/#/g, '').trim() : l
}

function getNamedSections(level: string, lines: string[]) {
  let name: string | undefined
  return lines.reduce<{ [k: string]: string[] }>((acc, l) => {
    if (l.startsWith(`${level} `)) {
      name = cleanLine(l)
      acc[name] = []
      return acc
    } else if (l.startsWith('#')) {
      name = undefined
    } else if (name) {
      acc[name].push(l)
    }
    return acc
  }, {})
}

function cleanList(l?: string[]) {
  return (
    l
      ?.map((l) => l.trim())
      .filter(Boolean)
      .map((l) => l.replace(/^-/, '').trim()) || []
  )
}

const DEFAULT_STEPS = ['Add ice to glass', 'Pour in ingredients and stir', 'Drink']

export async function getDrinks(stock: Stock[]) {
  const lines = await readDataLines('drinks.md')
  const sections = getSections(lines)
  const items = sections.map((s) => {
    const cs = s.filter(Boolean)
    const nameIdx = cs.findIndex((l) => l.startsWith('#'))
    const name = cleanLine(cs[nameIdx] || 'Unknown')
    const description = cs[nameIdx + 1].startsWith('#') ? '' : cs[nameIdx + 1]
    const namedSections = getNamedSections('##', cs)
    const steps = cleanList(namedSections.Steps)
    const ingredients = cleanList(namedSections.Ingredients).map((i) => {
      const parts = i.split(',').map((p) => p.trim())
      const name = parts[0]
      const amount = parts[1] || ''
      return { name, type: 'Unknown', amount }
    })
    const inStock = ingredients.every((i) =>
      stock.some(
        (s) => s.name.toLowerCase() === i.name.toLowerCase() || s.alcoholType?.toLowerCase() === i.name.toLowerCase()
      )
    )
    const drink: Drink = {
      id: uuid(),
      name: name || '???',
      description,
      addedBy: 'Matt',
      ingredients,
      steps: steps.length ? steps : DEFAULT_STEPS,
      inStock,
    }
    return drink
  })
  return items
}

function getTable(fields: string[] | undefined, lines: string[], base: any) {
  if (!fields) return []
  const dataLines = lines.slice(2)
  const data = dataLines.map((d) => {
    const parts = d
      .split('|')
      .map((l) => l.trim())
      .slice(1, -1)
    return fields.reduce((acc, n, i) => ({ ...acc, [n]: n === 'inStock' ? parts[i] === '✅' : parts[i] }), base)
  })
  return data
}

const fieldMap = {
  Alcohol: ['name', 'alcoholType', 'inStock'],
  Mixers: ['name', 'inStock'],
  Misc: ['name', 'inStock'],
}

export async function getStock() {
  const lines = await readDataLines('stock.md')
  const cleanLines = lines.map((l) => l.trim().replace(/^---/, '')).filter(Boolean)
  const sections = getNamedSections('#', cleanLines)
  const data = Object.entries(sections).flatMap(([k, v]) => getTable(fieldMap[k], v, { type: k.toLowerCase() }))
  return data
}
