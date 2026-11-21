
import Hero from "../components/Hero";
import Detection from "./Detection";

function Home() {
  return (
    <main className="min-h-screen">

      {/* Hero - Blue Section */}
      <section className="bg-slate-950">
        <Hero />
      </section>

      {/* Detection - White Section */}
      <section className="bg-white py-10 sm:py-14">
        <Detection />
      </section>

    </main>
  );
}

export default Home;
