import { ContactForm } from '@/components/site/ContactForm'
import { PageHeading } from '@/components/site/PageHeading'
import { isLocale } from '@/i18n/config'
import { getPage, getT, global } from '@/lib/payload'
import { pageMetadata } from '@/lib/seo'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return pageMetadata(locale as 'tr' | 'en', 'contact')
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: l } = await params
  if (!isLocale(l)) return null
  const [d, pg, s] = await Promise.all([getT(l), getPage('contact', l), global('site-settings', l)])
  const socials = s.socials?.filter((x) => /instagram|youtube/i.test(x.label)) ?? []
  return (
    <>
      <PageHeading>{pg.heading}</PageHeading>
      <section className="wrap sec grid items-start gap-14 !pt-0 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24">
        <div className="flex flex-col gap-8">
          <p className="h2 max-w-[560px]">{pg.intro || d.contactIntro}</p>
          {s.email && (
            <a href={`mailto:${s.email}`} className="inline-flex min-h-11 items-center text-xl underline decoration-line-strong underline-offset-8 transition-colors hover:decoration-white">
              {s.email}
            </a>
          )}
          {socials.length > 0 && (
            <div className="flex flex-wrap gap-x-8">
              {socials.map((x) => (
                <a key={x.id} href={x.url} target="_blank" rel="noopener" className="inline-flex min-h-11 items-center text-soft hover:text-white">
                  {x.label}<span className="sr-only"> ({d.newTab})</span>
                </a>
              ))}
            </div>
          )}
        </div>
        <ContactForm
          locale={l}
          labels={{
            name: d.formName, email: d.formEmail, topic: d.formTopic, message: d.formMessage,
            send: d.formSend, sending: d.formSending, successTitle: d.formSuccessTitle, successText: d.formSuccessText,
            topics: { sponsorship: d.topicSponsor, collaboration: d.topicCollab, join: d.topicJoin, other: d.topicOther },
          }}
        />
      </section>
    </>
  )
}
