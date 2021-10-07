import { useRouter } from 'next/router'

import SignupModal from '../app-bo/components/organisms/SignupModal'

export default function SignupPage() {
  const router = useRouter()

  const goToIndex = () => {
    router.push('/')
  }

  return <SignupModal onDone={goToIndex} />
}
