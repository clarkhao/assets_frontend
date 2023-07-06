import type { Meta, StoryObj } from '@storybook/react';
import { userEvent, within } from '@storybook/testing-library';
import Popup from '../../component/layout/Popup';
import AvatarList from '../../component/ui/AvatarList';

const meta: Meta<typeof Popup> = {
  title: 'Layout/Popup',
  component: Popup,
  tags: ['autodocs'],
  
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    children: <AvatarList />
  },
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);
  }
};