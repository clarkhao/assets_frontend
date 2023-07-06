import type { Meta, StoryObj } from "@storybook/react";
import { getByRole, userEvent, within } from "@storybook/testing-library";
import Avatar from "../../component/ui/Avatar";

const meta: Meta<typeof Avatar> = {
  title: "UI/Avatar",
  component: Avatar,
  tags: ["autodocs"],
  parameters: {
    layout: 'centered'
  }
};

export default meta;
type Story = StoryObj<typeof Avatar>;

export const IconAvailable: Story = {
  args: {
    size: 100,
    iconUrl: "/avatar.svg",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
  },
};
export const IconNotAvailable: Story = {
  args: {
    size: 100,
    iconUrl: undefined,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
  },
};
