import styled from 'styled-components'

export const CardTitle = styled.h2<{
  accent?: 'danger' | 'info' | 'primary' | 'secondary' | 'success' | 'warning'
  isFirst?: boolean
  withBottomMargin?: boolean
}>`
  color: ${p => p.theme.color[p.accent || 'secondary'].active};
  font-size: 125%;
  font-weight: 500;
  margin: ${p => (p.isFirst ? 0 : p.theme.padding.layout.medium)} 0 ${p => p.theme.padding.layout.small};
  padding-bottom: ${p => p.theme.padding.layout.tiny};
`
