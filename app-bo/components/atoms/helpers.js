export const getDarkColor = p => p.theme.palette[p.color].dark
export const getMainColor = p => p.theme.palette[p.color].main

export const getSmallerFontSize = p => {
  switch (p.size) {
    case 'large':
      return '1rem'

    case 'medium':
      return '0.875rem'

    case 'small':
      return '0.75rem'

    default:
      return '0rem'
  }
}
export const getFontSize = p => {
  switch (p.size) {
    case 'large':
      return '1.125rem'

    case 'medium':
      return '1rem'

    case 'small':
      return '0.875rem'

    default:
      return '0rem'
  }
}

export const getPadding = p => {
  switch (p.size) {
    case 'large':
      return '1rem 2rem'

    case 'medium':
      return '0.5rem 1rem'

    case 'small':
      return '0.25rem 0.5rem'

    default:
      return '0rem 0rem'
  }
}
