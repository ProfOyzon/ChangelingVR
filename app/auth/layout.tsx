export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-[calc(100svh-4rem)] w-full items-center justify-center bg-slate-900 p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6 rounded-md bg-slate-800 p-6 text-gray-100">
          {children}
        </div>
      </div>
    </div>
  );
}
