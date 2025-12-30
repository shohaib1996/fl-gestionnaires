import { getAccountRequestById } from "@/app/actions/projects/getAccountRequestById";
import { AccountRequestActions } from "@/components/dashboard/account-request/AccountRequestActions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import ShowDocuments from "./ShowDocuments";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AccountRequestDetailPage({ params }: PageProps) {
  const { id } = await params;
  const result = await getAccountRequestById(id);

  /* -------------------------
     Error state
  -------------------------- */
  if (!result.ok) {
    return (
      <div className="p-10 text-center">
        <h2 className="text-xl font-semibold text-foreground mb-2">
          Demande introuvable
        </h2>
        <p className="text-sm text-muted-foreground mb-6">
          {result.error ?? "Cette demande n’existe pas ou a été supprimée."}
        </p>

        <Link href="/dashboard/account-requests">
          <Button className="rounded-none">Retour à la liste</Button>
        </Link>
      </div>
    );
  }

  const request = result.data;

  if (!request) {
    return (
      <div className="p-10 text-center">
        <h2 className="text-xl font-semibold">Demande introuvable</h2>
        <Link href="/dashboard/account-requests">
          <Button className="mt-4 rounded-none">Retour à la liste</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col">
      {/* Top back header */}
      <header className="flex items-center gap-2 py-6 shrink-0">
        <Link href="/dashboard/account-requests">
          <Button className="flex items-center justify-center bg-[#326EA6] hover:bg-[#285b8b] text-white rounded-none px-3 h-7">
            <svg
              width="13"
              height="11"
              viewBox="0 0 13 11"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M13 10.9469C11.4097 9.01439 9.99743 7.91784 8.7633 7.65729C7.52917 7.39675 6.35418 7.35738 5.23835 7.53921V11L0 5.35279L5.23835 0V3.28932C7.30167 3.3055 9.0558 4.04239 10.5007 5.5C11.9455 6.95761 12.7786 8.77325 13 10.9469Z"
                fill="white"
              />
            </svg>
          </Button>
        </Link>
      </header>

      {/* Scroll container */}
      <div className="flex-1 bg-background rounded-xs border border-black/20 overflow-y-auto hide-scrollbar">
        {/* PAGE HEADER — keep green */}
        <section className="bg-white rounded-xs">
          <div className="flex items-center justify-between py-4 px-11 bg-[#63a053]/25">
            <h2 className="text-2xl font-bold text-[#7F7E83]">
              Demande de création de compte
            </h2>
            <StatusBadge status={request.status} />
          </div>
        </section>

        {/* ===== Informations personnelles ===== */}
        <SectionHeader title="Informations personnelles" />
        <SectionGrid>
          <Field label="Nom complet">
            {request.first_name} {request.last_name}
          </Field>
          <Field label="Email" span={2}>
            {request.email}
          </Field>
          <Field label="Téléphone">{request.phone_number}</Field>

          <Field label="Date de naissance">{request.birth_date}</Field>
          <Field label="Adresse" span={2}>
            {request.address}
          </Field>
        </SectionGrid>

        {/* ===== Documents d'identification ===== */}
        <SectionHeader title="Documents d'identification" />
        <SectionGrid>
          <Field label="Type de document" span={2}>
            {request.id_type?.join(", ") || "—"}
          </Field>
          <Field label="Numéro du document">{request.id_number || "—"}</Field>

          <ShowDocuments request={request} />
        </SectionGrid>

        {/* ===== Informations financières ===== */}
        <SectionHeader title="Informations financières" />
        <SectionGrid>
          <Field label="Sources de revenus" span={2}>
            {request.income_sources?.join(", ") || "—"}
          </Field>
          {request.other_income_source && (
            <Field label="Autre source">{request.other_income_source}</Field>
          )}
          <Field label="Origine des fonds confirmée">
            {request.funds_source_confirmed ? "Oui" : "Non"}
          </Field>
        </SectionGrid>

        {/* ===== Profession ===== */}
        <SectionHeader title="Profession" />
        <SectionGrid>
          <Field label="Profession">{request.occupation}</Field>
          {request.employer_name && (
            <Field label="Employeur" span={2}>
              {request.employer_name}
            </Field>
          )}
          {request.employer_address && (
            <Field label="Adresse de l'employeur" span={2}>
              {request.employer_address}
            </Field>
          )}
        </SectionGrid>

        {/* ===== Conformité & déclarations ===== */}
        <SectionHeader title="Conformité & déclarations" />
        <SectionGrid>
          <Field label="Conditions acceptées">
            {request.terms_accepted ? "Oui" : "Non"}
          </Field>
          <Field label="Politique de confidentialité acceptée">
            {request.privacy_accepted ? "Oui" : "Non"}
          </Field>

          {request.signature_url && (
            <DocumentPreview label="Signature" url={request.signature_url} />
          )}
          {request.signer_name && (
            <Field label="Nom du signataire">{request.signer_name}</Field>
          )}
        </SectionGrid>

        {/* ===== Admin Actions ===== */}
        <div className="px-11 py-8 flex gap-4 border-t border-border">
          <AccountRequestActions id={request.id} />
        </div>
      </div>
    </div>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="mt-8 bg-[#F2F6F8] dark:bg-neutral-700 text-sm py-3 px-11 text-gray-500 dark:text-white">
      {title}
    </div>
  );
}

function SectionGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-11 py-6">
      {children}
    </div>
  );
}

function Field({
  label,
  children,
  span = 1,
}: {
  label: string;
  children: React.ReactNode;
  span?: number;
}) {
  return (
    <div className={`col-span-${span} bg-[#F2F6F8] rounded-xs px-3 py-2`}>
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className="text-sm font-medium text-gray-800 dark:text-white">
        {children || "—"}
      </p>
    </div>
  );
}

function StatusBadge({ status }: { status: string | null }) {
  switch (status) {
    case "approved":
      return <Badge className="bg-[#63a053] text-white">Approuvée</Badge>;
    case "rejected":
      return <Badge variant="destructive">Rejetée</Badge>;
    default:
      return <Badge variant="secondary">En attente</Badge>;
  }
}

function DocumentPreview({ label, url }: { label: string; url: string }) {
  return (
    <div className="col-span-1 md:col-span-2 bg-[#F2F6F8] rounded-xs px-3 py-2">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <div className="relative h-10">
        <Image src={url} alt={label} fill className="object-contain" />
      </div>
    </div>
  );
}
