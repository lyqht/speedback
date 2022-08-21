import Header from '@/components/Header';

const GeneralLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full">
      <main className="h-full justify-between flex flex-col">
        <div id="main-content" className="p-8 h-full">
          <Header />
          {children}
        </div>
        <div className="w-full relative">
          <img
            id="bottom-background"
            alt="Background waves"
            className="w-full bg-cover opacity-60 -z-20"
            src={`/bottom_waves.svg`}
          />
          <div className="font-dynapuff absolute bottom-0 right-0 text-white text-lg p-4 flex flex-col items-end">
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
              className="flex flex-row underline decoration-white decoration-4 underline-offset-4 items-center"
              href={`https://github.com/lyqht/speedback`}
            >
              <img
                className="w-8 h-8 mt-2 bg-white rounded"
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
