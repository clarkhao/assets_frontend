import type { Meta, StoryObj } from '@storybook/react';
import { userEvent, within } from '@storybook/testing-library';
import Spin from '../../component/ui/Spin';

const meta: Meta<typeof Spin> = {
  title: 'UI/Spin',
  component: Spin,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {size: 20},
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);
  }
};