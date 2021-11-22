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

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID as string
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET as string
const REFRESH_TOKEN = process.env.SPOTIFY_REFRESH_TOKEN as string

async function getRefreshedToken() {
  const body = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: REFRESH_TOKEN,
  })
  const result = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    body,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`,
    },
  })
  const json = await result.json()
  return json.access_token
}

const login: NextApiHandler = async (req, res) => {
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: CLIENT_ID,
    scope: [
      'playlist-read-private',
      'playlist-modify-private',
      'user-read-private',
      'user-read-email',
      'user-read-playback-state',
      'user-modify-playback-state',
      'user-read-currently-playing',
      'user-library-read',
      'user-read-playback-position',
      'user-read-recently-played',
      'user-top-read',
      'streaming',
    ].join(' '),
    redirect_uri: 'http://localhost:3000/api/spotify/token',
  })
  res.redirect(`https://accounts.spotify.com/authorize?${params}`)
}

const info: NextApiHandler = async (req, res) => {
  const accessToken = await getRefreshedToken()
  const result = await fetch('https://api.spotify.com/v1/me', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  const json = await result.json()
  res.json({ ...json, ok: 1 })
}

const token: NextApiHandler = async (req, res) => {
  const { code } = req.query
  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code: code.toString(),
    redirect_uri: 'http://localhost:3000/api/spotify/token',
  })
  const result = await fetch(`https://accounts.spotify.com/api/token`, {
    method: 'POST',
    body,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`,
    },
  })
  const json = await result.json()
  res.json({ ...json, ok: 3 })
}

const playing: NextApiHandler = async (req, res) => {
  const accessToken = await getRefreshedToken()
  const result = await fetch('https://api.spotify.com/v1/me/player', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  const text = await result.text()
  if (text) {
    const json = JSON.parse(text)
    res.json({ ...json, isPlaying: true, ok: 1 })
  } else {
    res.json({ isPlaying: false, ok: 1 })
  }
}

const actions = {
  login,
  info,
  token,
  playing,
}

const SpotifyApi: NextApiHandler = async (req, res) => {
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

export default SpotifyApi
