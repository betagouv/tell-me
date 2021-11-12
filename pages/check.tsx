import styled from 'styled-components'

const StyledTable = styled.table`
  background-color: #2c292d;
  color: #fdf9f3;
  font-family: monospace;
  font-weight: 700;
  width: 100%;

  caption {
    font-size: 18px;
    padding: 0.5rem;
    text-align: left;
  }

  tr > th {
    color: #78dce8;
  }

  tr > td,
  tr > th {
    font-size: 16px;
    line-height: 1.5;
    padding: 0.5rem;
    text-align: left;
    vertical-align: top;
  }

  tr > td > pre {
    color: rgb(255, 216, 102);
    margin: 0;
  }
`

export default function CheckPage() {
  return (
    <>
      <StyledTable>
        <caption>Public Environment Variables</caption>

        <tr>
          <th scope="row">NEXT_PUBLIC_RSA_PUBLIC_KEY</th>
          <td>
            <pre>{process.env.NEXT_PUBLIC_RSA_PUBLIC_KEY}</pre>
          </td>
        </tr>
      </StyledTable>

      <style global jsx>{`
        body {
          background-color: #2c292d;
          padding: 0.5rem;
        }
      `}</style>
    </>
  )
}

export async function getStaticProps() {
  const isDebugMode = process.env.DEBUG === 'true'

  return {
    notFound: !isDebugMode,
    props: {},
    revalidate: 10,
  }
}
