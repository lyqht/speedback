import Header from '@/components/Header';

const GeneralLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full">
      <main className="flex h-full flex-col justify-between">
        <div id="main-content" className="h-full p-8">
          <Header />
          {children}
        </div>
        <div className="relative w-full">
          <img
            id="bottom-background"
            alt="Background waves"
            className="-z-20 w-full bg-cover opacity-60"
            src={`/bottom_waves.svg`}
          />
          <div className="absolute bottom-0 right-0 flex flex-col items-end p-4 font-dynapuff text-lg text-white">
            <p>
              Made by{` `}
              <a
                className="underline decoration-white decoration-4 underline-offset-4"
                href={`https://esteetey.dev/`}
              >
                @lyqht
              </a>
            </p>
            <a
              className="flex flex-row items-center underline decoration-white decoration-4 underline-offset-4"
              href={`https://github.com/lyqht/speedback`}
            >
              <img
                className="mt-2 h-8 w-8 rounded bg-white"
                src="https://api.iconify.design/charm:github.svg"
                alt="GitHub"
              />
            </a>
          </div>
        </div>
      </main>
    </div>
  );
};

export default GeneralLayout;
