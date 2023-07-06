import type { Meta, StoryObj } from "@storybook/react";
import { userEvent, within } from "@storybook/testing-library";
import TopBar from "../../component/layout/TopBar";
import Logo from "../../component/ui/Logo";
import Selector from "../../component/ui/Selector";
import ThemeToggle from "../../component/ui/ThemeToggle";

const meta: Meta<typeof TopBar> = {
  title: "Layout/TopBar",
  component: TopBar,
  tags: ["autodocs"],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/react/configure/story-layout
    layout: "fullscreen",
  },
} satisfies Meta<typeof TopBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LogoutStory: Story = {
  args: {
    isAuth: false,
    left: (
      <Logo
        size={40}
        clickHandler={() => {
          window.location.href = "/";
        }}
      />
    ),
    rightOne: <Selector size={60} offsetY={26} />,
    rightTwo: <ThemeToggle size={60} />,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
  },
};
export const LoginStory: Story = {
  args: {
    isAuth: true,
    left: (
      <Logo
        size={40}
        clickHandler={() => {
          window.location.href = "/";
        }}
      />
    ),
    rightOne: <Selector size={60} offsetY={26} />,
    rightTwo: <ThemeToggle size={60} />,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
  },
};
