import { NotFoundContent } from '@/components/site/NotFoundContent'
import { getT } from '@/lib/payload'

export default async function NotFound() {
  const [tr, en] = await Promise.all([getT('tr'), getT('en')])
  return (
    <NotFoundContent
      texts={{
        tr: { title: tr.notFoundTitle, back: tr.notFoundBack },
        en: { title: en.notFoundTitle, back: en.notFoundBack },
      }}
    />
  )
}
