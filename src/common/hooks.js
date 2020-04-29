import { curry, mergeRight } from 'ramda'
import { useRef, useState, useEffect } from 'react'

export const useHover = curry((name, c) => {
  const [isHovered, setHovered] = useState(false)
  const ref = useRef(null)
  const handleMouseOver = () => setHovered(true)
  const handleMouseOut = () => setHovered(false)

  useEffect(
    () => {
      const node = ref.current
      if (node) {
        node.addEventListener('mouseenter', handleMouseOver)
        node.addEventListener('mouseleave', handleMouseOut)

        return () => {
          node.removeEventListener('mouseenter', handleMouseOver)
          node.removeEventListener('mouseleave', handleMouseOut)
        }
      }
    },
    [ref.current])

  return c.contramap(mergeRight({
    [name]: isHovered,
    [`set${name[0].toUpperCase()}${name.slice(1)}`]: setHovered,
    ref
  }))
})

export const useOutsideClick = curry((fn, c) => {
  const ref = useRef(null)
  
  const handleClick = e => {
    if (ref.current && !ref.current.contains(e.target)) {
      fn()
    }
  }

  useEffect(() => {
    document.addEventListener("click", handleClick)

    return () => {
      document.removeEventListener("click", handleClick)
    }
  }, [ref.current])

  return c.contramap(mergeRight({ ref }))
})