import UnsubscribeClient from "./UnsubscribeClient";

export default function UnsubscribePage({
  searchParams,
}: {
  searchParams: { email?: string };
}) {
  return <UnsubscribeClient email={searchParams.email} />;
}
