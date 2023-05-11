import type { Meta, StoryObj } from "@storybook/react";
import { getByRole, userEvent, within } from "@storybook/testing-library";
import DropZone from "../../component/ui/DropZoneUI";

const meta: Meta<typeof DropZone> = {
  title: "UI/DropZone",
  component: DropZone,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof DropZone>;

export const Primary: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
  },
};
