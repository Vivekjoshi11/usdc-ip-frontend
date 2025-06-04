import ConvertUSDC from "./components/ConvertUSDC";
import UsdcConverter from "./utils/deBridge";

export default function Home() {
  return (
    <main style={{ padding: 20 }}>
      <h1>USDC → IP Token Converter</h1>
      <ConvertUSDC />
      <UsdcConverter />
      
    </main>
  );
}
