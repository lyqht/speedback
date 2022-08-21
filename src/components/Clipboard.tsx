import { Button } from 'flowbite-react';
import { useState } from 'react';

interface Props {
  value: string;
  fieldToBeCopied: string;
}

const Clipboard: React.FC<Props> = ({ value, fieldToBeCopied }) => {
  const [isLinkCopied, setIsLinkCopied] = useState(false);

  const handleCopyClick = () => {
    navigator.clipboard.writeText(value);
    setIsLinkCopied(true);
    setTimeout(() => setIsLinkCopied(false), 5000);
  };

  return (
    <div className="flex flex-row rounded-full border py-2 px-4">
      <p className="pr-4">
        {fieldToBeCopied}: {value}
      </p>
      <button onClick={handleCopyClick}>
        {isLinkCopied ? `Copied!` : `Copy`}
      </button>
    </div>
  );
};

export default Clipboard;
