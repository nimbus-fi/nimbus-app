import BackgroundDots from "@/components/ui/background-dots";
import StrategyHeading from "@/components/strategy/heading";
// import { getAllStrategies } from "../../utils/api/strategy";
import DeFiStrategies from "@/components/StrategyCard";

export default async function StrategiesPage() {
  // const { data } = await getAllStrategies();

  return (
    <div>
      <BackgroundDots />
      <StrategyHeading />
      <DeFiStrategies />
    </div>
  );
}

export const revalidate = 60 * 60 * 24;
