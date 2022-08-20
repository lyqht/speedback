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
    <div className="border shadow border-indigo-600">
      <p className="w-full p-4 font-bold">{value}</p>
      <Button onClick={handleCopyClick}>
        {isLinkCopied ? `Copied!` : `Copy ${fieldToBeCopied}`}
      </Button>
    </div>
  );
};

export default Clipboard;
