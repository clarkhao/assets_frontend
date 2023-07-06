import type { Meta, StoryObj } from "@storybook/react";
import { getByRole, userEvent, within } from "@storybook/testing-library";
import List from "../../component/ui/ListUI";

const meta: Meta<typeof List> = {
  title: "UI/List",
  component: List,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof List>;

export const Primary: Story = {
  args: {
    list: [
      { id: "a.png", progress: 0, status: { upload: "", write: "" } },
      { id: "b.jpg", progress: 0, status: { upload: "F", write: "" } },
      { id: "b.jpg", progress: 50, status: { upload: "", write: "" } },
      { id: "b.jpg", progress: 99, status: { upload: "S", write: "F" } },
      { id: "b.jpg", progress: 100, status: { upload: "S", write: "S" } },
    ],
    nameMap: { "a.png": "a.png", "b.jpg": "b.jpg" },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
  },
};
