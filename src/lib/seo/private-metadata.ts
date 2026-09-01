import type { Metadata } from "next";

/**
 * AtlasWallet — Private route metadata.
 * All authenticated/app pages are NOINDEX, NOFOLLOW.
 * Only public marketing/legal pages are indexable.
 */
export const privateMetadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false },
  },
};

export function privateTitle(title: string): Metadata {
  return { title, ...privateMetadata };
}
