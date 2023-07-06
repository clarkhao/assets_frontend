import type { Meta, StoryObj } from "@storybook/react";
import { getByRole, userEvent, within } from "@storybook/testing-library";
import Follower from "../../component/ui/Follower";
import { FiUploadCloud } from "react-icons/fi";

const meta: Meta<typeof Follower> = {
  title: "UI/Follower",
  component: Follower,
  tags: ["autodocs"],
  parameters: {
    layout: 'centered'
  }
};

export default meta;
type Story = StoryObj<typeof Follower>;

export const Primary: Story = {
  args: {
    data: {name: "上传", value: 5},
    icon: <FiUploadCloud />
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
  },
};
