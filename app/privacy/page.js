import Link from "next/link";
import LegalLayout from "@/components/LegalLayout";

export const metadata = {
  title: "Privacy Policy — KOVA Compounds",
  description:
    "How KOVA Compounds collects, uses, stores, and shares your personal information.",
};

export default function PrivacyPage() {
  return (
    <LegalLayout
      title="Privacy Policy"
      updated="August 8, 2026"
      intro="What we collect, why we collect it, who we share it with, and the choices you have."
    >
      <h2>1. Who we are</h2>
      <p>
        Kova Compounds LLC (&ldquo;KOVA&rdquo;) operates this website and is
        the controller of the personal information described below. Contact us
        at <a href="mailto:info@kovacompounds.com">info@kovacompounds.com</a>.
      </p>

      <h2>2. Information we collect</h2>
      <h3>You give us</h3>
      <ul>
        <li>Name, email address, phone number</li>
        <li>Billing and shipping addresses</li>
        <li>Order history and correspondence with support</li>
        <li>Account credentials, if you create an account</li>
        <li>Research affiliation or credentials, where we request them</li>
      </ul>
      <h3>We collect automatically</h3>
      <ul>
        <li>IP address, browser type, device and operating system</li>
        <li>Pages viewed, referring URLs, and session activity</li>
        <li>Cookies and similar technologies (see section 6)</li>
      </ul>
      <h3>We do not store</h3>
      <p>
        Full payment card numbers. Card data is submitted directly to our
        payment processor and never stored on our servers.
      </p>

      <h2>3. How we use it</h2>
      <ul>
        <li>To process, fulfil, and ship your orders</li>
        <li>To confirm eligibility to purchase research materials</li>
        <li>To provide customer support and respond to enquiries</li>
        <li>To send order and shipping notifications</li>
        <li>To send marketing email where you have opted in. You can unsubscribe at any time</li>
        <li>To detect and prevent fraud and misuse</li>
        <li>To improve the site and our products</li>
        <li>To meet legal, tax, and regulatory obligations</li>
      </ul>

      <h2>4. Legal bases</h2>
      <p>
        Where the GDPR or similar law applies, we process personal data on the
        basis of contract performance (fulfilling your order), legitimate
        interests (fraud prevention, service improvement), consent (marketing,
        non-essential cookies), and legal obligation (tax and record keeping).
      </p>

      <h2>5. Who we share it with</h2>
      <p>
        We do not sell your personal information. We share it only with service
        providers acting on our behalf, under contract, and only as needed:
      </p>
      <ul>
        <li>Payment processors, to take payment</li>
        <li>Shipping carriers, to deliver your order</li>
        <li>Email and hosting providers, to run the site and send notifications</li>
        <li>Analytics providers, to understand site usage</li>
        <li>Professional advisers, and authorities where legally required</li>
      </ul>

      <h2>6. Cookies</h2>
      <p>
        We use cookies that are strictly necessary (cart contents, session,
        checkout, age verification), plus analytics and, where enabled,
        referral-tracking cookies. You can block cookies in your browser, but
        the cart and checkout will not function without the necessary ones.
      </p>

      <h2>7. Retention</h2>
      <p>
        We keep order and transaction records for as long as required by tax and
        commercial law, typically seven years. Marketing contact data is kept
        until you unsubscribe. Support correspondence is kept for [RETENTION
        PERIOD].
      </p>

      <h2>8. Your rights</h2>
      <p>
        Depending on where you live, you may have the right to access, correct,
        delete, or port your personal data; to object to or restrict processing;
        and to withdraw consent. California residents may request disclosure of
        the categories of information collected and may opt out of any
        &ldquo;sale&rdquo; or &ldquo;sharing&rdquo; of personal information. We
        do not sell personal information. To exercise any right, email{" "}
        <a href="mailto:info@kovacompounds.com">info@kovacompounds.com</a>. We will respond
        within the period required by applicable law.
      </p>

      <h2>9. Security</h2>
      <p>
        We use TLS encryption in transit, restrict access to personal data on a
        need-to-know basis, and rely on established processors for payment. No
        method of transmission or storage is completely secure, and we cannot
        guarantee absolute security.
      </p>

      <h2>10. Children</h2>
      <p>
        This site is not directed at anyone under 21 and we do not knowingly
        collect their personal information. If you believe a minor has provided
        us data, contact us and we will delete it.
      </p>

      <h2>11. International transfers</h2>
      <p>
        We are based in the United States and your information will be processed
        there. Where data is transferred from outside the US, we rely on
        appropriate safeguards as required by applicable law.
      </p>

      <h2>12. Changes</h2>
      <p>
        We may update this policy. Material changes will be signposted on this
        page with a revised &ldquo;last updated&rdquo; date. See also our{" "}
        <Link href="/terms">Terms &amp; Conditions</Link>.
      </p>

      <h2>13. Contact</h2>
      <p>
        Kova Compounds LLC
        <br />
        South Jordan, Utah
        <br />
        <a href="mailto:info@kovacompounds.com">info@kovacompounds.com</a>
      </p>
    </LegalLayout>
  );
}
