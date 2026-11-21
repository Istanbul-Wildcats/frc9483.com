import { RichText } from '@payloadcms/richtext-lexical/react'
import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'

/** Rich text from Payload, styled by the shared `.prose-site` rules in globals.css. */
export function RichBody({ data }: { data: unknown }) {
  if (!data) return null
  return (
    <div className="prose-site">
      <RichText data={data as DefaultTypedEditorState} />
    </div>
  )
}
