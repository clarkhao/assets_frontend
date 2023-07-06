import type { Meta, StoryObj } from "@storybook/react";
import { getByRole, userEvent, within } from "@storybook/testing-library";
import ProfileComponent from "../../component/composite/Profile";

const meta: Meta<typeof ProfileComponent> = {
  title: "Composite/ProfileComponent",
  component: ProfileComponent,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
  },
};
