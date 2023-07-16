import type { Meta, StoryObj } from "@storybook/react";
import { getByRole, userEvent, within } from "@storybook/testing-library";
import PostCard from "../../component/ui/PostCard";

const meta: Meta<typeof PostCard> = {
  title: "UI/PostCard",
  component: PostCard,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof PostCard>;

export const CardLoaded: Story = {
  args: {
    data: {
      id: "1",
      name: "name",
      publicUser: "user",
      createdTime: "2022-01-01T00:00:00.000Z",
      updatedTime: "2022-01-01T00:00:00.000Z",
      expiredTime: "",
      url: "https://api.slingacademy.com/public/sample-photos/1.jpeg",
      user: [],
      like: [{count: 1}],
      liked: false
    },
    cancel: true
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
  },
};
export const CardLoading: Story = {
  args: {
    data: undefined,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
  },
};
