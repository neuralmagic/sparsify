import { merge } from 'ramda'
import { fromClass } from './common/component'
import { Image } from 'react-bootstrap'

export const image = fromClass(Image).contramap(merge({ alt: 'image' }))
export const neuralMagicLogo = image.contramap(merge({ src: 'assets/logo.svg' }))
export const neuralMagicLogoText = image.contramap(merge({ src: 'assets/logo_text.svg' }))
