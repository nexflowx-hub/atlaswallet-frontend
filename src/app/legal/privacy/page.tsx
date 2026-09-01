import { LegalPage } from "@/components/legal/legal-page";
import { institutionalConfig } from "@/config/institutional-config";

export const metadata = { title: "Privacy Notice" };

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Notice"
      intro={`This Privacy Notice explains how ${institutionalConfig.entity.legalName} collects, uses and protects your personal data, with supplements for the UK, EU/EEA and Brazil.`}
      sections={[
        {
          h: "Controller & contact",
          body: [
            `Controller: ${institutionalConfig.entity.legalName}, ${institutionalConfig.entity.registeredOffice}.`,
            `Contact: ${institutionalConfig.contacts.email.value}. For privacy-specific requests, use the same email with subject 'Privacy request'.`,
          ],
        },
        {
          h: "Data categories",
          list: [
            "Identification data (name, date of birth, nationality, country of residence)",
            "Contact data (email, phone, address)",
            "Account & session data (auth, login history, device identifiers)",
            "Transaction data (operations, balances, quotes, settlements)",
            "Source-of-funds/wealth data where required",
            "Technical data (IP, browser, usage logs) — only necessary or consented",
          ],
        },
        {
          h: "Purposes & legal bases",
          list: [
            "Service performance (contract performance) — providing the account and operations you requested",
            "Legal & regulatory compliance (legal obligation) — AML, KYC, sanctions, fraud prevention",
            "Security & fraud prevention (legitimate interest) — protecting the service and other users",
            "Communications (consent) — marketing, where you opt in; revocable at any time",
            "Product improvement (consent or legitimate interest) — analytics only with valid consent where required",
          ],
        },
        {
          h: "Recipients",
          body: [
            "Your personal data may be shared with: (i) providers supporting payment rails and crypto networks; (ii) identity verification and risk-screening providers; (iii) cloud infrastructure providers acting as processors; (iv) competent authorities where required by law.",
            "AtlasWallet never sells your personal data.",
          ],
        },
        {
          h: "International transfers",
          body: [
            "AtlasWallet operates across the UK, EU/EEA and Brazil. Where data crosses borders, we apply appropriate safeguards such as Standard Contractual Clauses, the UK International Data Transfer Agreement, or other recognized transfer mechanisms.",
          ],
        },
        {
          h: "Retention",
          body: [
            "We retain personal data for as long as necessary to provide the service and to comply with legal, regulatory, tax and AML obligations. Some retention periods are extended for fraud and AML purposes.",
          ],
        },
        {
          h: "Security",
          body: [
            "We use industry-standard technical and organizational measures including encryption in transit and at rest, access controls, audit logging, and separation of authentication from financial authority.",
          ],
        },
        {
          h: "Your rights",
          list: [
            "Access — request a copy of your personal data",
            "Rectification — correct inaccurate data",
            "Erasure — request deletion where legally permitted",
            "Restriction — limit processing in defined cases",
            "Portability — receive data in a structured format",
            "Objection — object to processing based on legitimate interest or marketing",
            "Withdraw consent — at any time, for consent-based processing",
          ],
        },
        {
          h: "Supervisory complaints",
          body: [
            "If you are not satisfied with our response, you may lodge a complaint with the competent supervisory authority in your jurisdiction.",
          ],
        },
        {
          h: "UK supplement",
          body: [institutionalConfig.regions.UK.privacy + "."],
        },
        {
          h: "EU/EEA supplement",
          body: [institutionalConfig.regions.EU_EEA.privacy + "."],
        },
        {
          h: "Brazil supplement",
          body: [
            institutionalConfig.regions.Brazil.privacy + ". You may exercise your rights under the LGPD (Lei Geral de Proteção de Dados) including confirmation of processing, access, correction, anonymization, portability and deletion of personal data, subject to legal exceptions.",
          ],
        },
      ]}
    />
  );
}
