// utils/getTeamLogo.js
const logos = [
  "NK-IB-1975-Ljubljana.png",
  "Idrija.png",
  "ND-Bistrc.png",
  "NK-Dren-Vrhnika.png",
  "MNK-Izola.png",
  "NK-Roltek-Dob.png",
  "Rudar-Trbovlje.png",
  "NK-Šenčur.png",
  "NK-Skofja-Loka.png",
  "NK-Šobec-Lesce.png",
  "NK-Svoboda-Ljubljana.png",
  "NK-Vipava.png",
  "NK-Ziri.png",
  "tolmin-logo.png",
  "NK-Dob.png",
];

// Basic string similarity function
function similarity(a, b) {
  a = a.toLowerCase();
  b = b.toLowerCase();
  let matches = 0;
  for (let i = 0; i < Math.min(a.length, b.length); i++) {
    if (a[i] === b[i]) matches++;
  }
  return matches / Math.max(a.length, b.length);
}

// Main utility
export function getTeamLogo(name) {
  let bestMatch = null;
  let bestScore = 0;

  for (const logo of logos) {
    const baseName = logo.replace('.png', '');
    const score = similarity(name, baseName);
    if (score > bestScore) {
      bestScore = score;
      bestMatch = logo;
    }
  }

  // Only return if confidence is decent (e.g. > 0.4)
  if (bestScore > 0.4) {
    return `/team_logo/${bestMatch}`;
  }

  return '/logo/placeholder-team.png'; // No good match found
}
