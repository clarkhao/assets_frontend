import type { Meta, StoryObj } from "@storybook/react";
import { getByRole, userEvent, within } from "@storybook/testing-library";
import Arrangement from "../../component/composite/Arrangement";

const meta: Meta<typeof Arrangement> = {
  title: "Composite/Arrangement",
  component: Arrangement,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Arrangement>;

export const Primary: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
  },
};
