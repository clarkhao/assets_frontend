import type { Meta, StoryObj } from "@storybook/react";
import { getByRole, userEvent, within } from "@storybook/testing-library";
import AvatarSelect from "../../component/composite/AvatarSelect";

const meta: Meta<typeof AvatarSelect> = {
  title: "Composite/AvatarSelect",
  component: AvatarSelect,
  tags: ["autodocs"],
  parameters: {
    layout: 'centered'
  }
};

export default meta;
type Story = StoryObj<typeof AvatarSelect>;

export const UserAvatar: Story = {
  args: { 
    isAdmin: false,
    iconUrl: "/avatar.svg",
   },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
  },
};
export const LargeAdminAvatar: Story = {
  args: {
    size: 100,
    isAdmin: true,
    iconUrl: "/avatar.svg",
    offset: {x: 0, y: 0}
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
  },
};
