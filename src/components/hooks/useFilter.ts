import Fuse from 'fuse.js'
import * as React from 'react'

export default function useFilter<T>(list: T[], keys?: string) {
  const [search, setSearch] = React.useState('')
  const fuse = React.useMemo(
    () =>
      new Fuse(list, {
        threshold: 0.4,
        isCaseSensitive: true,
        shouldSort: true,
        minMatchCharLength: 2,
        keys: keys?.split(',').map((i) => i.trim()),
        useExtendedSearch: true,
      }),
    [list, keys]
  )
  const filtered = React.useMemo(() => fuse.search(search.replace(/\s/g, '|')).map((v) => v.item), [fuse, search])
  return { search, setSearch, filtered: search.length > 1 ? filtered : list }
}
