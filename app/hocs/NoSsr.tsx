import dynamic from 'next/dynamic'

// eslint-disable-next-line react/jsx-no-useless-fragment
const NoSsrComponent = ({ children }) => (<>{children}</>) as any

export const NoSsr = dynamic(() => Promise.resolve(NoSsrComponent), {
  ssr: false,
})
