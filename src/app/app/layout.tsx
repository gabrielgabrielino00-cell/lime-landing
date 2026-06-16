export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="app-viewport">{children}</div>;
}