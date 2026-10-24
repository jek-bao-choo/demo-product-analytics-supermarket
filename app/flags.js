// Datadog Feature Flags used by the demo. Create these in Datadog (string flags,
// environment "demo"); each variant value is the id of a hero slide.
export const SUPERMARKET_HERO_FLAG = 'supermarket_hero_campaign';
export const FURNITURE_MART_HERO_FLAG = 'furniture_mart_hero_campaign';

// Put the slide chosen by the flag first; unknown ids keep the original order.
export function leadWith(slides, id) {
  const lead = slides.find((s) => s.id === id);
  return lead ? [lead, ...slides.filter((s) => s !== lead)] : slides;
}
