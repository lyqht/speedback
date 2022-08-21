import Avvvatars from 'avvvatars-react';
import { Badge } from 'flowbite-react';

interface AvatarProps {
  name: string;
  isUser?: boolean;
}

interface CrewAvatarProps extends AvatarProps {
  ready: boolean;
}

const Captain: React.FC<AvatarProps> = ({ name, isUser = false }) => {
  return (
    <div className="flex items-center justify-center pb-4">
      <div
        className={`relative ${
          isUser ? `rounded-full border-4 border-solid border-orange-400` : ``
        }`}
      >
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
  );
};

const Crew: React.FC<CrewAvatarProps> = ({ name, ready, isUser = false }) => {
  return (
    <div className="flex flex-row items-center">
      <div
        className={`relative ${
          isUser ? `rounded-full border-4 border-solid border-orange-400` : ``
        }`}
      >
        <Avvvatars value={name} style="shape" size={48} />
        <div className="absolute -bottom-2 left-6">
          {ready ? (
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="green"
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
              className="h-6 w-6"
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
      <p className="px-4">{name}</p>
    </div>
  );
};

export default {
  Crew,
  Captain,
};
