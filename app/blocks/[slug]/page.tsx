import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { blocks, getBlock } from "@/lib/blocks"

export function generateStaticParams() {
  return blocks.map((b) => ({ slug: b.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const block = getBlock(slug)
  if (!block) return { title: "Block not found" }
  return {
    title: `${block.name} — Gofive Blocks`,
    description: block.description,
  }
}

// Chromeless full-screen render of a single block — used as the iframe source
// on the /blocks gallery and as the "Full screen" target. No site nav.
export default async function BlockFullScreen({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const block = getBlock(slug)
  if (!block) notFound()

  const Block = block.component
  return <Block />
}
