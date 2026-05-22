export const MATTER_TYPE_KEYS = [
  "employment_contract",
  "nda",
  "litigation_response",
  "corporate_agreement",
  "policy",
  "general",
] as const;

export type MatterTypeKey = (typeof MATTER_TYPE_KEYS)[number];

export function isMatterTypeKey(value: string): value is MatterTypeKey {
  return (MATTER_TYPE_KEYS as readonly string[]).includes(value);
}
