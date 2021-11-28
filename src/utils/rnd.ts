export function getRandomInt(imin: number, imax: number) {
  const min = Math.ceil(imin)
  const max = Math.floor(imax)
  return Math.floor(Math.random() * (max - min) + min)
}

export function getRandomFromList<T>(list: T[]) {
  return list[Math.floor(Math.random() * list.length)]
}
