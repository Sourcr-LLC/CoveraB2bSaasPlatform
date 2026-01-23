import { ImageWithFallback } from '../figma/ImageWithFallback';
import dashboardImage from 'figma:asset/a0b6de1972fd49c6d73c02c561c11fe74372539f.png';

export default function InteractiveHeroVisual() {
  return (
    <div className="w-full h-full min-w-[1024px] h-[700px] p-8">
      <div className="relative w-full h-full bg-[#fafaf9] overflow-hidden rounded-2xl shadow-xl ring-1 ring-slate-900/5">
        <ImageWithFallback 
          src={dashboardImage} 
          alt="Dashboard Preview" 
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}
