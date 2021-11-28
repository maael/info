import { NextApiHandler } from 'next'
import fetch from 'isomorphic-fetch'
import Cors from 'cors'
import throat from 'throat'
import parse from 'date-fns/parse'
import compareAsc from 'date-fns/compareAsc'
import booste from 'booste'
import { getRandomInt } from '~/utils/rnd'

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
const RTT_USER = process.env.RTT_USER
const RTT_PASSWORD = process.env.RTT_PASSWORD
const BOOSTE_API_KEY = process.env.BOOSTE_API_KEY

async function fetchRtt(url: string) {
  return fetch(url, {
    headers: {
      Authorization: `Basic ${Buffer.from(`${RTT_USER}:${RTT_PASSWORD}`).toString('base64')}`,
    },
  }).then((r) => r.json())
}

async function fetchRttTo(from: string, to: string) {
  return fetchRtt(`https://api.rtt.io/api/v1/json/search/${from}/to/${to}`)
}

function formatTime(i?: string) {
  if (!i) return i
  const parts = i.split('')
  parts.splice(2, 0, ':')
  return parts.join('')
}

function parseToDate(d: any) {
  return parse(`${d.runDate} ${formatTime(d.locationDetail.realtimeDeparture)}`, 'yyyy-MM-dd HH:mm', new Date())
}

function mapTrainData(fromCRS: string, toCRS: string) {
  return async function (d: any) {
    return {
      from: d.location.name,
      to: d.filter.destination.name,
      trains: await Promise.all(
        (d.services || [])
          .filter((s) => s.isPassenger)
          .sort((a, b) => compareAsc(parseToDate(a), parseToDate(b)))
          .map(
            throat(2, async (s) => {
              const basic = {
                from: s.locationDetail.origin.map((o) => o.description).join(' & '),
                to: s.locationDetail.destination.map((o) => o.description).join(' & '),
                toCRS,
                fromCRS,
                bookedArrivalTime: formatTime(s.locationDetail.gbttBookedArrival),
                bookedArrivalDepartureTime: formatTime(s.locationDetail.gbttBookedDeparture),
                isLateArriving: s.locationDetail.realtimeArrival === s.locationDetail.gbttBookedArrival,
                isLateDeparting: s.locationDetail.realtimeArrival === s.locationDetail.gbttBookedDeparture,
                hasLeft: s.locationDetail.realtimeDepartureActual,
                arrivalTime: formatTime(s.locationDetail.realtimeArrival),
                arrivalDepartureTime: formatTime(s.locationDetail.realtimeDeparture),
                platform: s.locationDetail.platform,
                platformConfirmed: s.locationDetail.platformConfirmed,
                platformChanged: s.locationDetail.platformChanged,
                date: s.runDate,
                year: s.runDate.split('-')[0],
                month: s.runDate.split('-')[1],
                day: s.runDate.split('-')[2],
                serviceType: s.serviceType,
                serviceId: s.serviceUid,
                company: s.atocName,
                locations: [] as any[],
              }
              const extras = await expandServiceDetails(
                basic.serviceId,
                fromCRS,
                toCRS,
                basic.day,
                basic.month,
                basic.year
              )
              return Object.assign(basic, extras)
            })
          )
      ),
    }
  }
}

async function expandServiceDetails(
  serviceId: string,
  fromCRS: string,
  toCRS: string,
  day: number,
  month: number,
  year: number
) {
  return fetchRtt(`https://api.rtt.io/api/v1/json/service/${serviceId}/${year}/${month}/${day}`).then((d) => {
    const basic = {
      locations: d.locations.map((l) => ({
        crs: l.crs,
        name: l.description,
        expectedArrivalTime: formatTime(l.gbttBookedArrival),
        expectedDepartureTime: formatTime(l.gbttBookedDeparture),
        arrivalTime: formatTime(l.realtimeArrival),
        isArrivalTimeActual: l.realtimeArrivalActual,
        departureTime: formatTime(l.realtimeDeparture),
        isDepartureTimeActual: l.realtimeDepartureActual,
        platform: l.platform,
        platformConfirmed: l.platformConfirmed,
        platformChanged: l.platformChanged,
        arrivalLateness: l.realtimeGbttArrivalLateness || 0,
        departureLateness: l.realtimeGbttDepartureLateness || 0,
      })),
      toLocation: null,
      fromLocation: null,
      numberOfStops: 0,
    }
    const fromIdx = basic.locations.findIndex(({ crs }) => crs === fromCRS)
    const toIdx = basic.locations.findIndex(({ crs }) => crs === toCRS)
    basic.fromLocation = fromIdx === -1 ? null : basic.locations[fromIdx]
    basic.toLocation = toIdx === -1 ? null : basic.locations[toIdx]
    basic.numberOfStops = fromIdx > -1 && toIdx > -1 ? Math.abs(fromIdx - toIdx) : 0
    return basic
  })
}

const trains: NextApiHandler = async (_req, res) => {
  const baseStation = 'ECR'
  const [crawley, haywards_heath, brighton, london_bridge, three_bridges] = await Promise.all([
    fetchRttTo(baseStation, 'CRW').then(mapTrainData(baseStation, 'CRW')),
    fetchRttTo(baseStation, 'HHE').then(mapTrainData(baseStation, 'HHE')),
    fetchRttTo(baseStation, 'BTN').then(mapTrainData(baseStation, 'BTN')),
    fetchRttTo(baseStation, 'LBG').then(mapTrainData(baseStation, 'LBG')),
    fetchRttTo(baseStation, 'TBD').then(mapTrainData(baseStation, 'TBD')),
  ])
  res.json({ crawley, haywards_heath, brighton, london_bridge, three_bridges })
}

const weather: NextApiHandler = async (_req, res) => {
  const result = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=Croydon,uk&appid=${OPEN_WEATHER_API_KEY}&units=metric`
  )
  const json = await result.json()
  res.json({ ...json, ok: 1 })
}

const steam: NextApiHandler = async (_req, res) => {
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

const generatetext: NextApiHandler = async (req, res) => {
  const input = req.query.input.toString()
  const length = Number((req.query.length || '').toString() || getRandomInt(5, 10))
  console.info({ input, length })
  const output = await booste.gpt2(BOOSTE_API_KEY, input, length)
  res.json({
    input,
    output,
  })
}

const request: NextApiHandler = async (req, res) => {
  res.json({
    headers: req.headers,
    url: req.url,
  })
}

const actions = {
  weather,
  steam,
  trains,
  generatetext,
  request,
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
