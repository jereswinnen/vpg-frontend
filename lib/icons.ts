import {
  ArrowRightIcon,
  Calendar1Icon,
  DownloadIcon,
  EyeIcon,
  HardHatIcon,
  InfoIcon,
  LeafIcon,
  ListTreeIcon,
  MailIcon,
  PhoneIcon,
  RulerIcon,
  WarehouseIcon,
  type LucideIcon,
} from "lucide-react";

export const iconMap: Record<string, LucideIcon> = {
  arrow: ArrowRightIcon,
  calendar: Calendar1Icon,
  download: DownloadIcon,
  eye: EyeIcon,
  hardhat: HardHatIcon,
  info: InfoIcon,
  leaf: LeafIcon,
  list: ListTreeIcon,
  mail: MailIcon,
  phone: PhoneIcon,
  ruler: RulerIcon,
  warehouse: WarehouseIcon,
};

export const iconOptions = Object.entries(iconMap).map(([key]) => ({
  value: key,
  label: key.charAt(0).toUpperCase() + key.slice(1),
}));

export function getIcon(name?: string): LucideIcon | null {
  if (!name) return null;
  return iconMap[name] || null;
}
