import type { Meta, StoryObj } from "@storybook/react";
import { getByRole, userEvent, within } from "@storybook/testing-library";
import Logo from "../../component/ui/Logo";

const meta: Meta<typeof Logo> = {
  title: "UI/Logo",
  component: Logo,
  tags: ["autodocs"],
  parameters: {
    layout: 'centered'
  }
};

export default meta;
type Story = StoryObj<typeof Logo>;

export const Primary: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
  },
};
