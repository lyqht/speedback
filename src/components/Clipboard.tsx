import { useState } from 'react';
import { Button, TextInput } from 'flowbite-react';

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
    <div>
      <label htmlFor="copy-text"></label>
      <TextInput
        type="text"
        id="copy-text"
        placeholder={`Copy this ${fieldToBeCopied}`}
        value={value}
        pattern="^(https:\/\/)?[\w.-]+(\.(daily\.(co)))+[\/\/]+[\w.-]+$"
      />
      <Button onClick={handleCopyClick}>
        {isLinkCopied ? 'Copied!' : `Copy ${fieldToBeCopied}`}
      </Button>
    </div>
  );
};

export default Clipboard;
