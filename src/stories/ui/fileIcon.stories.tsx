import type { Meta, StoryObj } from "@storybook/react";
import { getByRole, userEvent, within } from "@storybook/testing-library";
import FileIcon from "../../component/ui/FileIcon";

const meta: Meta<typeof FileIcon> = {
  title: "UI/FileIcon",
  component: FileIcon,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof FileIcon>;

export const Primary: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
  },
};
