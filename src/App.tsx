import { FormEventHandler, useEffect, useRef, useState, memo } from "react";

type CommandInputProps = {
  onAdd: (channel: string) => void;
  onDelete: (channel: string) => void;
};

const CommandInput: React.FC<CommandInputProps> = ({ onAdd, onDelete }) => {
  const [visible, setVisible] = useState(false);
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyEvent = (event: KeyboardEvent) => {
      switch (event.key) {
        case ":":
          setVisible(true);
          inputRef.current?.focus();
          break;
        case "Escape":
          setVisible(false);
      }
    };

    document.body.addEventListener("keydown", handleKeyEvent);
    return () => {
      document.body.removeEventListener("keydown", handleKeyEvent);
    };
  }, []);

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

    const match = /(?<cmd>[a-z]+)\s+(?<arg>\w+)/.exec(input.trim());

    if (match !== null && match.groups !== undefined) {
      switch (match.groups.cmd) {
        case "add":
          onAdd(match.groups.arg);
          break;
        case "del":
          onDelete(match.groups.arg);
          break;
        default:
          console.log(`Unkown command: "${input}"`);
      }
    }

    setInput("");
  };

  return visible ? (
    <form className="fixed w-full" onSubmit={handleSubmit}>
      <input
        className="w-full bg-black text-green-600"
        ref={inputRef}
        value={input[0] === ":" ? input : `:${input}`}
        onChange={(e) => setInput(e.target.value.slice(1))}
      />
    </form>
  ) : null;
};

type TwitchPlayerProps = {
  channel: string;
  className: string;
};

const TwitchPlayer: React.FC<TwitchPlayerProps> = memo(
  ({ channel, className }) => {
    const ref = useRef();

    useEffect(() => {
      // @ts-ignore
      ref.current = new Twitch.Embed(channel, {
        width: "100%",
        height: "100%",
        layout: "video",
        channel,
      });

      return () => {
        // @ts-ignore
        ref.current?.destroy();
      };
    }, [channel]);

    return <div id={channel} className={className}></div>;
  }
);

function App() {
  const [channels, setChannels] = useState<Set<string>>(() => new Set());

  let layout: number[][];
  switch (channels.size) {
    case 1:
      layout = [[12, 6]];
      break;
    case 2:
      layout = [
        [6, 6],
        [6, 6],
      ];
      break;
    case 3:
      layout = [
        [12, 3],
        [6, 3],
        [6, 3],
      ];
      break;
    case 4:
      layout = [
        [6, 3],
        [6, 3],
        [6, 3],
        [6, 3],
      ];
      break;
    case 5:
      layout = [
        [6, 3],
        [6, 3],
        [4, 3],
        [4, 3],
        [4, 3],
      ];
      break;
    case 6:
      layout = [
        [4, 3],
        [4, 3],
        [4, 3],
        [4, 3],
        [4, 3],
        [4, 3],
      ];
      break;
    case 7:
      layout = [
        [4, 3],
        [4, 3],
        [4, 3],
        [3, 3],
        [3, 3],
        [3, 3],
        [3, 3],
      ];
      break;
    case 8:
      layout = [
        [3, 3],
        [3, 3],
        [3, 3],
        [3, 3],
        [3, 3],
        [3, 3],
        [3, 3],
      ];
      break;
  }

  return (
    <>
      <CommandInput
        onAdd={(channel: string) => {
          setChannels((state) => {
            const newState = new Set(state);
            if (newState.size < 8) {
              newState.add(channel);
            }
            return newState;
          });
        }}
        onDelete={(channel: string) => {
          setChannels((state) => {
            const newState = new Set(state);
            newState.delete(channel);
            return newState;
          });
        }}
      />
      <div className="h-screen grid grid-cols-12 grid-rows-6">
        {Array.from(channels).map((channel, i) => (
          <TwitchPlayer
            key={channel}
            className={`col-span-${layout[i][0]} row-span-${layout[i][1]}`}
            channel={channel}
          />
        ))}
      </div>
    </>
  );
}

export default App;
