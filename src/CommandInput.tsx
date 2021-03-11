import { useRef, useState, FormEventHandler } from "react";

type CommandInputProps = {
  onAdd: (...channel: string[]) => void;
  onDelete: (...channel: string[]) => void;
  onSwap: (channel1: string, channel2: string) => void;
};

export const CommandInput: React.FC<CommandInputProps> = ({
  onAdd,
  onDelete,
  onSwap,
}) => {
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

    const rawArgs = input
      .trim()
      .split(" ")
      .filter((arg) => arg !== "");

    if (rawArgs.length === 0) {
      console.log("early exit");
      return;
    }

    const [cmd, ...args] = rawArgs;

    switch (cmd.toLowerCase()) {
      case "add":
        if (args.length > 0) {
          onAdd(...args);
        }
        break;
      case "del":
      case "rm":
        if (args.length > 0) {
          onDelete(...args);
        }
        break;
      case "swap":
        if (args.length > 1) {
          onSwap(args[0], args[1]);
        }
        break;
      default:
        console.log(`Unkown command: "${input}"`);
    }

    setInput("");
  };

  return (
    <form className="text-green-600" onSubmit={handleSubmit}>
      <label className="flex">
        {">"}
        <input
          className="bg-black flex-grow pl-1"
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </label>
    </form>
  );
};
