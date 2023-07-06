import type { Meta, StoryObj } from "@storybook/react";
import { getByRole, userEvent, within } from "@storybook/testing-library";
import ProfileCard from "../../component/composite/ProfileCard";

const meta: Meta<typeof ProfileCard> = {
  title: "Composite/ProfileCard",
  component: ProfileCard,
  tags: ["autodocs"],
  parameters: {
    layout: "centered"
  }
};

export default meta;
type Story = StoryObj<typeof ProfileCard>;

export const Primary: Story = {
  args: {
    userinfo: {
      avatar: "/avatar.svg",
      name: "John Doe",
      email: "XXXXXXXXXXXXXXXXXXXX",
      limit: 5
    }
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
  },
};
