import Image from "next/image";
import SpotlightCard from "./SpotlightCard";
import SubscriptionButton from "./SubscriptionButton";

export default function Hero() {
  return (
    <div className="flex flex-col bg-[#E0E1DD] rounded-2xl inset-shadow-sm shadow-sm items-center overflow-hidden m-5 md:w-3/4">
      <SpotlightCard
        className="w-full bg-[#E0E1DD] p-0 md:p-0"
        spotlightColor="rgba(155,155,55,0.32)"
      >
        <section className="flex flex-col justify-between items-center text-center min-h-[500px] h-full md:pt-5">
          <div className="flex flex-col items-center w-full">
            <h2 className="text-3xl md:text-5xl font-bold mt-5 p-2 z-1">
              Wypróbuj{" "}
              <span className="text-blue-800 block sm:inline">Voice Clip</span>
            </h2>
            <p className="md:mt-2 text-md md:text-lg max-w-xl p-2 z-1">
              Konwertuj wiadomości głosowe w&nbsp;Messengerze na tekst. Szybko,
              wygodnie i&nbsp;bez zbędnego słuchania!
            </p>
            <div className="flex pb-8 sm:px-8 pt-2 z-1">
              <SubscriptionButton />
            </div>
          </div>
          <div className="flex justify-center w-full">
            <Image
              src="/phone-mockup-new.png"
              alt="Mockupy aplikacji dla dużych ekranów"
              width={1100}
              height={400}
              className="hidden sm:block z-1 object-contain"
              priority={true}
            />
            <Image
              src="/mobile-mockup.png"
              alt="Mockupy aplikacji dla urządzeń mobilnych"
              width={350}
              height={400}
              className="block sm:hidden px-2 z-1 object-contain"
              priority={true}
            />
          </div>
        </section>
      </SpotlightCard>
    </div>
  );
}
