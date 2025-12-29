import NavBar from "./components/NavBar";
import Hero from "./components/Hero";
import Pricing from "./components/Pricing";
import PromoVid from "./components/PromoVid";
import Footer from "./components/Footer";
import FAQ from "./components/FAQ";
import ContactForm from "./components/ContactForm";

export default function Home() {
  return (
    <div
      className=" w-full "
      style={{
        background: "#ffffff",
        backgroundImage:
          "linear-gradient(0deg, transparent 0%, #fff 40%, #fff 40%, transparent 100%), url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAYAAADED76LAAAAIklEQVQoU2N89+7dfwYsQEhIiBEkzDgkFGDzAbIY2Cv4AACvrBgJjYNGfwAAAABJRU5ErkJggg==) ",
      }}
    >
      <NavBar />
      <div />
      <div className="flex justify-center pb-10 md:pb-30 pt-5 ">
        <Hero />
      </div>

      <div className=" flex justify-center pb-10 md:pb-30 ">
        <PromoVid />
      </div>

      <div className="justify-center pb-10 md:pb-30 bg-white">
        <Pricing />
      </div>
      <div className=" flex justify-center pb-10 md:pb-30 bg-white">
        <FAQ />
      </div>

      <div className="flex justify-center pb-10 md:pb-20 bg-white">
        <ContactForm />
      </div>
      <div className="bg-white">
        <Footer />
      </div>
    </div>
  );
}
