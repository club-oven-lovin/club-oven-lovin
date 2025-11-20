export default function VendorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ backgroundColor: "#fff8f1", minHeight: "100vh", width: "100%" }}>
      {children}
    </div>
  );
}