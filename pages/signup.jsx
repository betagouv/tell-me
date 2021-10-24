import { useRouter } from 'next/router'

import SignupModal from '../app/organisms/SignupModal'

export default function SignupPage() {
  const router = useRouter()

  const goToIndex = () => {
    router.push('/')
  }

  return <SignupModal onDone={goToIndex} />
}
