import type { Meta, StoryObj } from "@storybook/react";
import { getByRole, userEvent, within } from "@storybook/testing-library";
import Uploader from "../../component/composite/assets/Uploader";

const meta: Meta<typeof Uploader> = {
  title: "Composite/Uploader",
  component: Uploader,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Uploader>;

export const Primary: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
  },
};
