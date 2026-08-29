import Link from "next/link";
import LegalLayout from "@/components/LegalLayout";

export const metadata = {
  title: "Shipping & Returns — KOVA Compounds",
  description:
    "Processing times, delivery, tracking, and the claims process for KOVA orders.",
};

export default function ShippingPage() {
  return (
    <LegalLayout
      title="Shipping & Returns"
      updated="August 8, 2026"
      intro="How and when your order ships, what to do if something arrives wrong, and the limits on returns for laboratory materials."
    >
      <h2>Processing times</h2>
      <p>
        Orders placed before <strong>2:00 PM ET</strong> on a business day are
        processed and shipped the same day. Orders placed after the cutoff, at
        weekends, or on public holidays are processed the next business day.
      </p>
      <p>
        Orders may be held beyond these times where payment verification,
        address verification, or research-eligibility checks are required.
      </p>

      <h2>Delivery</h2>
      <ul>
        <li>Domestic orders ship via <strong>USPS Priority Mail</strong>, typically delivered in <strong>2 business days</strong>.</li>
        <li>Tracking is provided by email for every shipment.</li>
        <li>Delivery windows are carrier estimates, not guarantees. We are not responsible for carrier delays, weather disruption, or incorrect addresses supplied at checkout.</li>
        <li>We currently ship within the United States only. [CONFIRM — remove or amend if the client ships internationally.]</li>
      </ul>

      <h2>Packaging and handling</h2>
      <p>
        Orders ship in discreet, unbranded outer packaging. Materials requiring
        temperature control are packed to maintain integrity for the expected
        transit window. On arrival, store as directed on the product page and
        the accompanying documentation, typically refrigerated at 2&ndash;8&nbsp;&deg;C,
        protected from light and moisture.
      </p>
      <p>
        <strong>Inspect your order on arrival.</strong> Material integrity after
        delivery depends on storage conditions we cannot observe, which is why
        the claims window below is short.
      </p>

      <h2>Shipping charges</h2>
      <p>
        Shipping is calculated at checkout based on destination and order
        contents. Any free-shipping threshold in force is shown in the cart.
        Charges are non-refundable except where an order is cancelled before
        dispatch or where we are at fault.
      </p>

      <h2>Returns</h2>
      <p>
        Because these are sensitive laboratory materials whose integrity depends
        on cold-chain and handling conditions we cannot verify once they leave
        our facility, <strong>all sales are final</strong>. We do not accept
        returns or exchanges for change of mind, incorrect ordering, or
        unsuitability for your protocol.
      </p>

      <h2>Damaged, incorrect, or out-of-specification orders</h2>
      <p>We will replace or refund where:</p>
      <ul>
        <li>The product arrived visibly damaged or with compromised packaging</li>
        <li>You received a different product, dose, or quantity than ordered</li>
        <li>The material is materially outside the specification stated on its Certificate of Analysis</li>
      </ul>
      <p>
        Contact <a href="mailto:info@kovacompounds.com">info@kovacompounds.com</a> within{" "}
        <strong>72 hours of delivery</strong> with your order number and clear
        photographs of the outer packaging, the product, and any batch labelling.
        Claims made outside this window, or without photographic evidence, cannot
        be assessed. Do not discard the packaging until the claim is resolved.
      </p>

      <h2>Non-delivery and lost shipments</h2>
      <p>
        If tracking shows no movement for <strong>7 business days</strong>,
        contact us and we will open a carrier trace. Where tracking shows an item
        as delivered but you have not received it, you must raise it with us
        within <strong>7 days</strong> of the recorded delivery date. Orders
        marked delivered to the address supplied at checkout are your
        responsibility once the carrier has completed delivery.
      </p>

      <h2>Refused, undeliverable, and seized shipments</h2>
      <p>
        Where a shipment is refused, unclaimed, or returned as undeliverable due
        to an incorrect address, the order will be refunded less shipping and a
        restocking fee of [RESTOCKING %]. We cannot resend materials that have
        completed a return transit, as cold-chain integrity can no longer be
        assured.
      </p>

      <h2>Order changes and cancellation</h2>
      <p>
        Contact us as soon as possible if you need to amend or cancel. We can
        usually accommodate changes before dispatch. Once an order has shipped it
        cannot be cancelled.
      </p>

      <h2>Research use</h2>
      <p>
        All shipments are supplied strictly for laboratory research. See our{" "}
        <Link href="/research-use-only">Research Use Only</Link> policy and{" "}
        <Link href="/terms">Terms &amp; Conditions</Link>.
      </p>

      <h2>Contact</h2>
      <p>
        <a href="mailto:info@kovacompounds.com">info@kovacompounds.com</a>
        <br />
        24/7 support
      </p>
    </LegalLayout>
  );
}
