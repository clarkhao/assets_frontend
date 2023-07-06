import type { Meta, StoryObj } from '@storybook/react';
import { userEvent, within } from '@storybook/testing-library';
import Selector from '../../component/ui/Selector';

const meta: Meta<typeof Selector> = {
  title: 'UI/Selector',
  component: Selector,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof Selector>;

export const Primary: Story = {
  args: {},
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);
  }
};