import { ArrowDown } from "lucide-react";

export function Stats() {
  return (
    <section className="min-h-screen w-full flex items-center bg-white border-b border-gray-100 px-6 sm:px-[8vw]">
      <div className="max-w-screen-xl w-full mx-auto grid lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-7">
          <h2 className="font-display uppercase font-medium text-black leading-[0.95] tracking-tight text-[clamp(2.6rem,6vw,5.5rem)]">
            Parceiro da indústria da<br /><span className="text-red-600">transformação da pedra.</span>
          </h2>
        </div>
        <div className="lg:col-span-5 lg:pl-12 lg:border-l border-gray-200">
          <span className="block text-[11px] font-medium tracking-[0.2em] text-gray-400 uppercase mb-4">Quem somos</span>
          <p className="text-gray-500 text-lg leading-relaxed font-light max-w-[40ch] mb-8">
            Somos uma empresa dedicada ao fornecimento de maquinaria nova e usada, ferramentas diamantadas, apoio técnico e formação para quem atua no sector da transformação de granitos, mármores, quartzos e cerâmicos.
          </p>
          <div className="flex items-center gap-3 text-[11px] tracking-[0.2em] text-gray-400 uppercase">
            <span>Deslize para explorar</span>
            <ArrowDown className="h-4 w-4 animate-bounce text-red-600" />
          </div>
        </div>
      </div>
    </section>
  );
}
