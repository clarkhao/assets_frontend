import type { Meta, StoryObj } from "@storybook/react";
import { getByRole, userEvent, within } from "@storybook/testing-library";
import Check from "../../component/ui/Check";

const meta: Meta<typeof Check> = {
  title: "UI/Check",
  component: Check,
  tags: ["autodocs"],
  parameters: {
    layout: 'centered'
  }
};

export default meta;
type Story = StoryObj<typeof Check>;

export const Primary: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
  },
};
