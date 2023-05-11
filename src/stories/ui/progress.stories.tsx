import type { Meta, StoryObj } from "@storybook/react";
import { getByRole, userEvent, within } from "@storybook/testing-library";
import Progress from "../../component/ui/ProgressUI";

const meta: Meta<typeof Progress> = {
  title: "UI/Progress",
  component: Progress,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Progress>;

export const Primary: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
  },
};
