import { LegalPage } from "@/components/legal/legal-page";
import { institutionalConfig } from "@/config/institutional-config";

export const metadata = { title: "Complaints" };

export default function ComplaintsPage() {
  return (
    <LegalPage
      title="Complaints"
      intro="If you are not satisfied with our service, we want to hear about it. This page explains how to make a complaint and how we handle it."
      sections={[
        {
          h: "How to complain",
          body: [
            `Send your complaint to ${institutionalConfig.contacts.email.value} with the subject 'Complaint'. Please include your account email, a description of the issue, dates and any reference numbers.`,
            `Alternative channels: WhatsApp ${institutionalConfig.contacts.whatsapp.display}, Telegram ${institutionalConfig.contacts.telegramManager.handle}. These are best-effort; email is the formal channel.`,
          ],
        },
        {
          h: "Acknowledgement",
          body: [
            "We acknowledge complaints within 2 business days of receipt. The acknowledgement includes a reference number and the name of the person handling your complaint.",
          ],
        },
        {
          h: "Investigation & response",
          body: [
            "We aim to provide a substantive response within 15 business days. Complex cases may take longer — if so, we will inform you of the extension and the expected timeline.",
            "Our response will set out our findings, our decision, and any remedial action we propose.",
          ],
        },
        {
          h: "Escalation",
          body: [
            "If you are not satisfied with our response, you may escalate within AtlasWallet by replying to the original complaint reference. We will assign a senior reviewer.",
            "If you remain dissatisfied, you may be entitled to refer your complaint to a competent external dispute resolution body or supervisory authority in your jurisdiction.",
          ],
        },
        {
          h: "Language",
          body: [
            "Complaints may be submitted in English, Portuguese or Spanish. We will respond in the same language where possible.",
          ],
        },
      ]}
    />
  );
}
