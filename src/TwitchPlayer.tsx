import { memo, useEffect, useRef } from "react";

type TwitchPlayerProps = {
  channel: string;
  className: string;
};

export const TwitchPlayer: React.FC<TwitchPlayerProps> = memo(
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

    return <div id={channel} data-testid={channel} className={className}></div>;
  }
);
