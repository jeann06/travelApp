import AppBar from "@/components/AppBar";

export default function DefaultLayout(props) {
  return (
    <div className="min-vh-100 d-flex flex-column">
      <AppBar />
      <main style={{ flex: 1 }}>{props.children}</main>
    </div>
  );
}
