// Sponsor tier keys. 'partner' is a legacy alias kept only so existing
// documents that still carry the old singular `category: 'partner'` field
// keep resolving to the Silver tier without a database migration.
export type SponsorCategory = 'main' | 'gold' | 'silver' | 'bronze' | 'transporter' | 'support';

export type SponsorLike = {
  category?: string;
  categories?: string[];
};

const LEGACY_ALIASES: Record<string, SponsorCategory> = {
  partner: 'silver',
};

function normalize(cat: string): SponsorCategory {
  return (LEGACY_ALIASES[cat] ?? cat) as SponsorCategory;
}

// Sponsors written before the multi-category change only have a singular
// `category` field; newer ones have a `categories` array. This merges both
// so every consumer only has to deal with one shape.
export function getSponsorCategories(sponsor: SponsorLike): SponsorCategory[] {
  if (Array.isArray(sponsor.categories) && sponsor.categories.length > 0) {
    return sponsor.categories.map(normalize);
  }
  if (sponsor.category) {
    return [normalize(sponsor.category)];
  }
  return [];
}

export function sponsorHasCategory(sponsor: SponsorLike, category: SponsorCategory): boolean {
  return getSponsorCategories(sponsor).includes(category);
}

export const CATEGORY_LABELS: Record<SponsorCategory, string> = {
  main: 'Glavni',
  gold: 'Zlati',
  silver: 'Srebrni',
  bronze: 'Bronasti',
  transporter: 'Uradni prevoznik',
  support: 'Prijatelj kluba',
};
