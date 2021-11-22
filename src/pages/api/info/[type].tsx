import { NextApiHandler } from 'next'
import fetch from 'isomorphic-fetch'
import Cors from 'cors'

const cors = Cors({
  methods: ['GET', 'HEAD'],
  origin: process.env.ORIGIN,
})

function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result)
      }

      return resolve(result)
    })
  })
}

const OPEN_WEATHER_API_KEY = process.env.OPEN_WEATHER_API_KEY as string
const STEAM_API_KEY = process.env.STEAM_API_KEY as string
const STEAM_ID = '76561197996869787'

const weather: NextApiHandler = async (req, res) => {
  const result = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=Croydon,uk&appid=${OPEN_WEATHER_API_KEY}&units=metric`
  )
  const json = await result.json()
  res.json({ ...json, ok: 1 })
}

const steam: NextApiHandler = async (req, res) => {
  const result = await fetch(
    `http://api.steampowered.com/ISteamUser/GetFriendList/v0001/?key=${STEAM_API_KEY}&steamid=${STEAM_ID}&relationship=friend`
  )
  const { friendslist } = await result.json()
  const summaryResult = await fetch(
    `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${STEAM_API_KEY}&steamids=${friendslist.friends
      .map((f) => f.steamid)
      .join(',')}`
  )
  const summaries = await summaryResult.json()
  res.json({ ...summaries.response, ok: 1 })
}

const actions = {
  weather,
  steam,
}

const InfoApi: NextApiHandler = async (req, res) => {
  if (!['GET', 'HEAD'].includes(req.method as string)) {
    res.status(401).json({ error: 'Not implemented' })
    return
  }
  try {
    await runMiddleware(req, res, cors)
  } catch (e) {
    res.status(400).json({ error: 'Cors' })
    return
  }
  try {
    const action = actions[req.query.type.toString()]
    if (action) {
      await action(req, res)
    } else {
      throw new Error(`No match for ${req.query.type.toString()}`)
    }
  } catch (e) {
    console.error(e)
    res.status(400).json({ error: e.message })
  }
}

export default InfoApi
