// app/layout.tsx
export const metadata = {
  title: '상용한자 2136 퀴즈',
  description: '간단한 한자 퀴즈 앱',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
