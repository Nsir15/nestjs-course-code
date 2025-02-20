export const wrapRequest = async <T, E>(request: Promise<T>): Promise<[E | null, T | null]> => {
  try {
    const res = await request
    return [null, res]
  } catch (error) {
    return [error as E, null]
  }
}
