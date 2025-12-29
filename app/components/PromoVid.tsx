import { Suspense } from "react";
export default function PromoVid() {
  return (
    <div className="flex items-center justify-center gap-12 p-8 ">
      <div className="relative w-80 h-[650px] bg-gray-900 rounded-[2.8rem] shadow-1xl border-6 border-gray-800">
        <div className="absolute -left-2 top-32 w-1 h-12 bg-gray-700 rounded-l-lg"></div>
        <div className="absolute -left-2 top-48 w-1 h-8 bg-gray-700 rounded-l-lg"></div>
        <div className="absolute -left-2 top-60 w-1 h-8 bg-gray-700 rounded-l-lg"></div>
        <div className="absolute -right-2 top-40 w-1 h-16 bg-gray-700 rounded-r-lg"></div>

        <div className="absolute inset-2 bg-black rounded-[2rem] overflow-hidden">
          <div className="absolute top-12 left-1/2 transform text-center -translate-x-1/2 bg-gray-900 text-white text-l font-medium px-3 py-1 rounded-full shadow-md">
            W kilka sekund!
          </div>

          <div className="w-full h-full flex items-end justify-center">
            <Suspense
              fallback={<p className="text-white">Ładowanie filmu...</p>}
            >
              <VideoComponent videoUrl="https://eydjpnzvgfozfrys.public.blob.vercel-storage.com/PromoVoiceClip-Vj8etJnr0ofmXahnPxjrovkPsoP9lE.mp4" />
            </Suspense>
          </div>
        </div>

        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-7 bg-gray-900 rounded-b-2xl flex items-center justify-center">
          <div className="w-12 h-1 bg-gray-700 rounded-full mr-2"></div>
          <div className="w-2 h-2 bg-gray-700 rounded-full"></div>
        </div>
      </div>

      <div className="hidden md:flex flex-col space-y-6 max-w-xs">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
            1
          </div>
          <div className="bg-[#E0E1DD] text-gray-800 px-4 py-3 rounded-2xl shadow-sm">
            <span className="text-sm font-medium">
              Przytrzymaj wiadomość głosową.
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
            2
          </div>
          <div className="bg-[#E0E1DD] text-gray-800 px-4 py-3 rounded-2xl shadow-sm">
            <span className="text-sm font-medium">
              Wpisz <strong>Voice Clip</strong> i prześlij dalej.
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-700 to-blue-700 text-white rounded-full flex items-center justify-center font-bold text-lg">
            3
          </div>
          <div className="bg-[#E0E1DD] text-gray-800 px-4 py-3 rounded-2xl shadow-sm">
            <span className="text-sm font-medium">
              Koniec! To takie proste.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function VideoComponent({ videoUrl }) {
  return (
    <video
      preload="none"
      muted
      autoPlay
      loop
      playsInline
      aria-label="Film promocyjny"
      className="h-3/4 w-full object-cover"
    >
      <source src={videoUrl} type="video/mp4" />
      Twoja przeglądarka nie obsługuje tego pliku.
    </video>
  );
}
