/**
 * Site-wide configuration.
 * Fill these in when the real endpoints and profiles exist. Empty values are
 * handled honestly by the UI (forms complete locally; social links are hidden).
 */
export const SITE = {
  name: 'AI Bharat',
  owner: 'Core5 Systems and Services Pvt. Ltd.',
  /** POST endpoint that receives JSON form submissions (Build With Us, Contact). */
  formEndpoint: '' as string,
  /** Public contact email, e.g. 'hello@example.com'. */
  contactEmail: '' as string,
  social: {
    linkedin: '',
    x: '',
    github: '',
    youtube: '',
  } as Record<string, string>,
}
