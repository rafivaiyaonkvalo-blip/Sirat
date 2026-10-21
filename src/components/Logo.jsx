import { brand } from '../config/brand';
import { getAssetUrl } from '../utils/assetHelper';

export default function Logo({ className = 'h-9 w-9' }) {
  return <img src={getAssetUrl(brand.logo)} alt={brand.name} className={className} />;
}
