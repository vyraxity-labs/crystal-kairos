type RandomizeList<T> = {
  list: T[]
  total: number
  withReplacement?: boolean
}

export const randomize = <T>({
  list,
  total,
  withReplacement = false,
}: RandomizeList<T>): T[] => {
  if (list.length === 0) return []
  if (!withReplacement && total > list.length) {
    throw new Error(
      `Cannot select ${total} items without replacement from a list of ${list.length} items.`,
    )
  }

  const result: T[] = []
  let newList = [...list] // avoid mutating the original

  for (let i = 0; i < total; i++) {
    const randomIndex = Math.floor(Math.random() * newList.length)
    result.push(newList[randomIndex])

    if (!withReplacement) {
      newList.splice(randomIndex, 1) // more efficient than filter
    }
  }

  return result
}
