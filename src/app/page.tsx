import ConvertUSDC from "./components/ConvertUSDC";
import UsdcConverter from "./utils/deBridge";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-8">USDC → IP Token Converter</h1>
      <div className="space-y-6 w-full max-w-md">
        <ConvertUSDC />
        <UsdcConverter />
      </div>
    </main>
  );
}
