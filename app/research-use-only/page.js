import LegalLayout from "@/components/LegalLayout";

export const metadata = {
  title: "Research Use Only — KOVA Compounds",
  description:
    "KOVA compounds are supplied strictly for laboratory research. Not for human or veterinary use.",
};

export default function ResearchUseOnlyPage() {
  return (
    <LegalLayout
      title="Research Use Only"
      updated="August 8, 2026"
      intro="Everything KOVA supplies is a laboratory research material. It is not a medicine, a supplement, or a diagnostic product, and it is not for human or veterinary use under any circumstance."
    >
      <h2>Scope</h2>
      <p>
        All products offered by Kova Compounds LLC (&ldquo;KOVA&rdquo;) are
        supplied <strong>strictly for laboratory research use only</strong>,
        for example in vitro work, ex vivo work, or studies conducted under an
        approved animal protocol. They are sold exclusively to qualified
        researchers, academic institutions, and licensed laboratories.
      </p>

      <h2>What these products are not</h2>
      <ul>
        <li>They are <strong>not drugs or medicines</strong>, and have not been evaluated or approved by the FDA or any comparable authority.</li>
        <li>They are <strong>not dietary supplements</strong> and are not food.</li>
        <li>They are <strong>not cosmetics</strong> or personal care products.</li>
        <li>They are <strong>not diagnostic or therapeutic devices</strong>.</li>
        <li>They are <strong>not for human or veterinary administration</strong>, not by ingestion, injection, inhalation, or topical application.</li>
      </ul>

      <h2>Your obligations as a purchaser</h2>
      <p>By placing an order, you represent and confirm that:</p>
      <ul>
        <li>You are at least 21 years old and legally able to enter into this transaction.</li>
        <li>You are a qualified researcher, or are purchasing on behalf of a research institution or licensed laboratory.</li>
        <li>You will use the material solely for legitimate laboratory research.</li>
        <li>You will not administer it to yourself, to any other person, or to any animal outside an approved research protocol.</li>
        <li>You will not resell, repackage, or redistribute it for human or veterinary consumption.</li>
        <li>You are responsible for safe handling, storage, and disposal in line with your institution&apos;s requirements and all applicable law.</li>
        <li>You will comply with all federal, state, and local regulations governing the possession and use of research materials in your jurisdiction.</li>
      </ul>

      <h2>No medical advice</h2>
      <p>
        KOVA is not a pharmacy and does not provide medical advice,
        prescriptions, diagnoses, dosing guidance, or consultations. Nothing on
        this website, including product descriptions, research applications,
        educational articles, or support correspondence, should be read as a
        recommendation for human use. Any reference to research findings is
        provided for scientific context only.
      </p>

      <h2>Certificates of analysis</h2>
      <p>
        Each batch is accompanied by a batch-specific Certificate of Analysis
        documenting the applicable analytical testing. A COA reports the
        analytical characteristics of the material as tested. It is{" "}
        <strong>not</strong> a certification of safety, efficacy, or fitness for
        any use in humans or animals.
      </p>

      <h2>Refusal and cancellation of orders</h2>
      <p>
        We reserve the right to refuse, cancel, or limit any order at our sole
        discretion, including where we have reason to believe the material may
        be intended for human or veterinary use, for resale, or for any purpose
        inconsistent with this policy. We may request documentation of research
        credentials before fulfilling an order.
      </p>

      <h2>Assumption of risk</h2>
      <p>
        You assume full responsibility and liability for the proper handling,
        storage, use, and disposal of any material purchased from KOVA. To the
        fullest extent permitted by law, KOVA disclaims all liability for any
        loss, injury, or damage arising from misuse, including any use
        prohibited by this policy.
      </p>

      <h2>Questions</h2>
      <p>
        Contact <a href="mailto:info@kovacompounds.com">info@kovacompounds.com</a> with any
        questions about this policy or about the intended use of a specific
        material.
      </p>
    </LegalLayout>
  );
}
