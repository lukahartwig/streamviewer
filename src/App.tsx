import { useQueryParam, ArrayParam } from "use-query-params";

import { CommandInput } from "./CommandInput";
import { TwitchPlayer } from "./TwitchPlayer";

const MAX_STREAMS = 8;

const lookupLayout = (size: number, index: number): number[] => {
  switch (size) {
    case 1:
      return [[12, 6]][index];
    case 2:
      return [
        [6, 6],
        [6, 6],
      ][index];
    case 3:
      return [
        [12, 3],
        [6, 3],
        [6, 3],
      ][index];
    case 4:
      return [
        [6, 3],
        [6, 3],
        [6, 3],
        [6, 3],
      ][index];
    case 5:
      return [
        [6, 3],
        [6, 3],
        [4, 3],
        [4, 3],
        [4, 3],
      ][index];
    case 6:
      return [
        [4, 3],
        [4, 3],
        [4, 3],
        [4, 3],
        [4, 3],
        [4, 3],
      ][index];
    case 7:
      return [
        [4, 3],
        [4, 3],
        [4, 3],
        [3, 3],
        [3, 3],
        [3, 3],
        [3, 3],
      ][index];
    case 8:
      return [
        [3, 3],
        [3, 3],
        [3, 3],
        [3, 3],
        [3, 3],
        [3, 3],
        [3, 3],
        [3, 3],
      ][index];
    default:
      return [];
  }
};

function App() {
  const [channels, setChannels] = useQueryParam("channel", ArrayParam);

  const handleChannelAdded = (...channels: string[]) => {
    setChannels(
      (state) =>
        Array.from(new Set([...(state || []), ...channels])).slice(
          0,
          MAX_STREAMS
        ),
      "replace"
    );
  };

  const handleChannelRemoved = (...channels: string[]) => {
    setChannels(
      (state) =>
        (state || []).filter((s) => s === null || !channels.includes(s)),
      "replace"
    );
  };

  const handleChannelSwapped = (channel1: string, channel2: string) => {
    setChannels((state) => {
      const parseIndex = (input: string): number => {
        let index = parseInt(input, 10);
        return isNaN(index) ? (state || []).indexOf(input) : index;
      };

      let i1 = parseIndex(channel1);
      let i2 = parseIndex(channel2);

      if (i1 < 0 || i2 < 0) {
        return state;
      }

      const oldState = state || [];
      const newState = [...oldState];
      newState[i2] = oldState[i1];
      newState[i1] = oldState[i2];

      return newState;
    }, "replace");
  };

  return (
    <div className="bg-black h-screen flex flex-col">
      <CommandInput
        onAdd={handleChannelAdded}
        onDelete={handleChannelRemoved}
        onSwap={handleChannelSwapped}
      />
      {channels && (
        <div className="flex-grow grid grid-cols-12 grid-rows-6">
          {channels.map((channel, i) => {
            if (channel === null) {
              return null;
            }

            const [col, row] = lookupLayout(channels.length, i);

            return (
              <TwitchPlayer
                key={channel}
                className={`col-span-${col} row-span-${row}`}
                channel={channel}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

export default App;
