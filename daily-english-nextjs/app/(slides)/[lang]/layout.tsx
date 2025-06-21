export default function SlideRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // This layout creates an independent layout hierarchy for slides
  // It bypasses the main [lang]/layout.tsx which contains AppHeader
  return (
    <div className="min-h-screen bg-slate-800">
      {children}
    </div>
  );
}