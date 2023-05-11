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
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
  },
};
