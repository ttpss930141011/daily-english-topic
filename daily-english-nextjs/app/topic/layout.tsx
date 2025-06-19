export default function TopicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-800">
      {children}
    </div>
  );
}