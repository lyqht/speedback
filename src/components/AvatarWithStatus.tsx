import Avvvatars from 'avvvatars-react';
import { Badge } from 'flowbite-react';

interface AvatarProps {
  name: string;
}

interface CrewAvatarProps extends AvatarProps {
  ready: boolean;
}

const Captain: React.FC<AvatarProps> = ({ name }) => {
  return (
    <div className="p-4 w-1/2">
      <div className="flex justify-center items-center">
        <div className="relative">
          <Avvvatars value={name} style="shape" size={48} />
          <Badge
            style={{ position: `absolute`, bottom: -12, left: 2 }}
            color="purple"
          >
            Host
          </Badge>
        </div>
        <p className="px-4">{name}</p>
      </div>
    </div>
  );
};

const Crew: React.FC<CrewAvatarProps> = ({ name, ready }) => {
  return (
    <div className="p-4 border-4 border-solid border-slate-400">
      <div className="flex">
        <div>
          <Avvvatars value={name} style="shape" />
          <div className="absolute bottom-0 right-0">
            {ready ? (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
            ) : (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
            )}
          </div>
        </div>
        <p>{name}</p>
      </div>
    </div>
  );
};

export default {
  Crew,
  Captain,
};
