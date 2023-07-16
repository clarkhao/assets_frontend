import type { Meta, StoryObj } from '@storybook/react';
import { userEvent, within } from '@storybook/testing-library';
import Table from '../../component/composite/Table';

const meta: Meta<typeof Table> = {
  title: 'Composite/Table',
  component: Table,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {},
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);
  }
};