import Hero from "../components/Hero";
import WhyChoose from "../components/WhyChoose";
import Detection from "./Detection";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <Hero />
      <WhyChoose />
      <div id="detection-studio" className="relative border-t border-slate-900">
        <Detection isEmbedded={true} />
      </div>
    </main>
  );
}
