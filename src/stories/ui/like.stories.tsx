import type { Meta, StoryObj } from "@storybook/react";
import { getByRole, userEvent, within } from "@storybook/testing-library";
import Like from "../../component/ui/Like";

const meta: Meta<typeof Like> = {
  title: "UI/Like",
  component: Like,
  tags: ["autodocs"],
  parameters: {
    layout: 'centered'
  }
};

export default meta;
type Story = StoryObj<typeof Like>;

export const NotLike: Story = {
  args: {
    likes: 101,
    fileKey: 'presignedImage:⟨ZGY5M2Y1ZmEtZTQ5YS00YjM0LWI3NTUtZTcyMmMzNjc4MmFj:U3YvtkuZ.jpg⟩',
    isAuth: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
  },
};
