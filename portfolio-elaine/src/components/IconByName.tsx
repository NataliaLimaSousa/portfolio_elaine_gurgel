import {
  ClipboardList,
  ShieldCheck,
  HeartHandshake,
  Wallet,
  Gauge,
  Compass,
  Users,
  TrendingUp,
  Stethoscope,
  type LucideProps,
} from "lucide-react";

const icons: Record<string, React.ComponentType<LucideProps>> = {
  ClipboardList,
  ShieldCheck,
  HeartHandshake,
  Wallet,
  Gauge,
  Compass,
  Users,
  TrendingUp,
};

export default function IconByName({ name, ...props }: { name: string } & LucideProps) {
  const Icon = icons[name] || Stethoscope;
  return <Icon aria-hidden="true" {...props} />;
}
