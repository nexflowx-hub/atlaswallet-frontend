import { LegalPage } from "@/components/legal/legal-page";

export const metadata = { title: "Cookie Policy" };

export default function CookiesPage() {
  return (
    <LegalPage
      title="Cookie Policy"
      intro="This Cookie Policy explains how AtlasWallet uses cookies and similar technologies. We respect your choices — necessary cookies are always on, others require your consent."
      sections={[
        {
          h: "Necessary",
          body: [
            "Always on. These cookies are essential for the service to function — they maintain your session, secure the application against CSRF and XSS, and remember your cookie consent choice.",
          ],
        },
        {
          h: "Preferences",
          body: [
            "Consent-based. These cookies remember your language, display preferences and other personalization. Without them, the service still works — you simply see default preferences.",
          ],
        },
        {
          h: "Analytics",
          body: [
            "Off until valid consent where required. We may use anonymous usage analytics to understand how the service is used and to improve it. Where consent is required (e.g. UK GDPR PECR, EU ePrivacy, Brazil LGPD), analytics cookies are only set after you opt in.",
          ],
        },
        {
          h: "Marketing",
          body: [
            "Off until valid consent. Marketing cookies are only set if you opt in to marketing communications. We never use cross-site tracking pixels without your consent.",
          ],
        },
        {
          h: "Withdrawal",
          body: [
            "You can withdraw consent for non-essential cookies at any time from the cookie banner (which appears at the bottom-right) or from Settings → Notifications. Necessary cookies remain on.",
          ],
        },
        {
          h: "Actual deployed cookie list",
          body: [
            "Production deployment will populate this section with the actual cookies set by the service, including: name, purpose, category, retention, third-party status, and how to disable.",
            "Until verified, this list is intentionally a placeholder. We do not assume cookies we have not yet deployed.",
          ],
        },
      ]}
    />
  );
}
