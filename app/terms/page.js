import Link from "next/link";
import LegalLayout from "@/components/LegalLayout";

export const metadata = {
  title: "Terms & Conditions — KOVA Compounds",
  description:
    "The terms governing use of the KOVA Compounds website and the purchase of research materials.",
};

export default function TermsPage() {
  return (
    <LegalLayout
      title="Terms & Conditions"
      updated="August 8, 2026"
      intro="These terms govern your use of this website and any purchase you make from KOVA. Please read them before ordering."
    >
      <h2>1. Agreement</h2>
      <p>
        This website is operated by Kova Compounds LLC (&ldquo;KOVA&rdquo;,
        &ldquo;we&rdquo;, &ldquo;us&rdquo;). By accessing the site or placing an
        order you agree to these Terms &amp; Conditions, our{" "}
        <Link href="/privacy">Privacy Policy</Link>, and our{" "}
        <Link href="/research-use-only">Research Use Only</Link> policy. If you
        do not agree, do not use the site.
      </p>

      <h2>2. Eligibility</h2>
      <p>
        You must be at least 21 years old and legally capable of entering a
        binding contract. By ordering you confirm you are a qualified researcher
        or are purchasing on behalf of a research institution or licensed
        laboratory. We may verify this and may refuse any order.
      </p>

      <h2>3. Research use only</h2>
      <p>
        All products are supplied strictly for laboratory research. They are not
        drugs, supplements, or diagnostic products and are not for human or
        veterinary use. The{" "}
        <Link href="/research-use-only">Research Use Only</Link> policy forms
        part of these terms and your order constitutes acceptance of it.
      </p>

      <h2>4. Products, pricing, and availability</h2>
      <ul>
        <li>Prices are in US dollars and exclude tax and shipping unless stated.</li>
        <li>We may change prices, specifications, or availability at any time without notice.</li>
        <li>We aim for accuracy but do not warrant that descriptions, images, or pricing are error-free. Where a material error is found, we may cancel the affected order and issue a full refund.</li>
        <li>Stock is not reserved until an order is accepted.</li>
      </ul>

      <h2>5. Orders and acceptance</h2>
      <p>
        Your order is an offer to purchase. A confirmation email acknowledges
        receipt but does not constitute acceptance. The contract forms when we
        dispatch the goods. We may refuse, cancel, or limit any order at our
        discretion, including for suspected misuse, resale, fraud, or failed
        payment verification.
      </p>

      <h2>6. Payment</h2>
      <p>
        Payment is processed by third-party payment providers. We do not store
        full card details. You warrant that you are authorised to use the
        payment method supplied. Orders may be held pending fraud or address
        verification.
      </p>

      <h2>7. Shipping, title, and risk</h2>
      <p>
        Shipping terms are set out in our{" "}
        <Link href="/shipping">Shipping &amp; Returns</Link> policy. Title and
        risk of loss pass to you on delivery to the carrier. Delivery estimates
        are estimates, not guarantees.
      </p>

      <h2>8. Returns</h2>
      <p>
        Because these are sensitive laboratory materials whose integrity depends
        on cold-chain and handling conditions we cannot verify once they leave
        our facility, <strong>all sales are final</strong> except where the
        goods arrive damaged, incorrect, or materially out of specification. See{" "}
        <Link href="/shipping">Shipping &amp; Returns</Link> for the claims
        process and time limits.
      </p>

      <h2>9. Disclaimer of warranties</h2>
      <p>
        Except as expressly stated in the Certificate of Analysis for a given
        batch, products are supplied <strong>&ldquo;as is&rdquo;</strong>{" "}
        without warranty of any kind, express or implied, including any implied
        warranty of merchantability or fitness for a particular purpose. No
        warranty of safety or efficacy for any use in humans or animals is made
        or implied.
      </p>

      <h2>10. Limitation of liability</h2>
      <p>
        To the fullest extent permitted by law, KOVA&apos;s total liability
        arising out of or relating to any order shall not exceed the amount you
        paid for the product giving rise to the claim. We are not liable for
        indirect, incidental, special, consequential, or punitive damages, or
        for loss of profits, data, or research outcomes.
      </p>

      <h2>11. Indemnity</h2>
      <p>
        You agree to indemnify and hold harmless KOVA, its officers, employees,
        and suppliers against any claim, loss, or expense arising from your use,
        misuse, storage, or disposal of any product, or from your breach of
        these terms.
      </p>

      <h2>12. Intellectual property</h2>
      <p>
        All site content, including text, imagery, branding, and layout, is
        owned by KOVA or its licensors and may not be reproduced without written
        permission.
      </p>

      <h2>13. Changes</h2>
      <p>
        We may update these terms at any time. The version in force is the one
        published at the time of your order. Continued use of the site
        constitutes acceptance of the current terms.
      </p>

      <h2>14. Governing law</h2>
      <p>
        These terms are governed by the laws of the State of Utah, United
        States, without regard to conflict-of-laws principles. Any dispute shall
        be brought exclusively in the courts located in South Jordan, Utah.
      </p>

      <h2>15. Contact</h2>
      <p>
        Kova Compounds LLC
        <br />
        South Jordan, Utah
        <br />
        <a href="mailto:info@kovacompounds.com">info@kovacompounds.com</a>
        <br />
        24/7 support
      </p>
    </LegalLayout>
  );
}
