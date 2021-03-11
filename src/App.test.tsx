import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import App from "./App";

function getCommandInput() {
  return screen.getByRole("textbox", { name: />/i });
}

function findChannel(channel: string) {
  return screen.findByTestId(channel);
}

function findAllChannels() {
  return screen.findAllByTestId(/channel[0-9]+/);
}

function enterCommand(text: string) {
  return userEvent.type(getCommandInput(), `${text}{enter}`);
}

beforeEach(() => {
  render(<App />);
});

test("empty input after submit", async () => {
  enterCommand("add channel1");
  expect(getCommandInput()).toHaveValue("");
});

test("add single stream", async () => {
  enterCommand("add channel1");
  await findChannel("channel1");
});

test("add multiple streams", async () => {
  enterCommand("add channel1 channel2");
  await findChannel("channel1");
  await findChannel("channel2");
});

test("add a channel twice does nothing", async () => {
  enterCommand("add channel1 channel1");
  await findChannel("channel1");
  await expect(findAllChannels()).resolves.toHaveLength(1);
});

test("add up to max number of streams", async () => {
  enterCommand(
    "add channel1 channel2 channel3 channel4 channel5 channel6 channel7 channel8 channel9"
  );
  await expect(findAllChannels()).resolves.toHaveLength(8);
});

test("remove single stream", async () => {
  enterCommand("add channel1 channel2");
  const channel1 = await findChannel("channel1");
  const channel2 = await findChannel("channel2");
  enterCommand("del channel1");
  expect(channel1).not.toBeInTheDocument();
  expect(channel2).toBeInTheDocument();
});

test("remove multiple streams", async () => {
  enterCommand("add channel1 channel2 channel3");
  const channel1 = await findChannel("channel1");
  const channel2 = await findChannel("channel2");
  const channel3 = await findChannel("channel3");
  enterCommand("del channel1 channel2");
  expect(channel1).not.toBeInTheDocument();
  expect(channel2).not.toBeInTheDocument();
  expect(channel3).toBeInTheDocument();
});

test("swap stream positions with index", async () => {
  enterCommand("add channel1 channel2");
  const channels = await findAllChannels();
  expect(channels[0]).toHaveAttribute("id", "channel1");
  expect(channels[1]).toHaveAttribute("id", "channel2");
  enterCommand("swap 0 1");
  const swappedChannels = await findAllChannels();
  expect(swappedChannels[0]).toHaveAttribute("id", "channel2");
  expect(swappedChannels[1]).toHaveAttribute("id", "channel1");
});

test("swap stream positions with names", async () => {
  enterCommand("add channel1 channel2");
  const channels = await findAllChannels();
  expect(channels[0]).toHaveAttribute("id", "channel1");
  expect(channels[1]).toHaveAttribute("id", "channel2");
  enterCommand("swap channel1 channel2");
  const swappedChannels = await findAllChannels();
  expect(swappedChannels[0]).toHaveAttribute("id", "channel2");
  expect(swappedChannels[1]).toHaveAttribute("id", "channel1");
});
