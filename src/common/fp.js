import { curry } from 'ramda'
import { Either } from 'ramda-fantasy'

const { Right, Left } = Either

export const tryCatch = f => {
  try {
    return Right(f())
  } catch (e) {
    return Left(e)
  }
}

export const fromNullable = x => x != null ? Right(x) : Left(null)
export const fold = curry((props, v) => v.fold(props))