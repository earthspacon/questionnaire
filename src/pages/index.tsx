import { Questionnaire } from '@/features/questionnaire'

export default function Home() {
  return (
    <main className="w-full h-full min-h-screen">
      <Questionnaire.View.Form />
    </main>
  )
}
