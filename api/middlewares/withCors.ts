import cors from 'cors'

export function withCors() {
  return cors({
    methods: ['GET'],
  })
}
