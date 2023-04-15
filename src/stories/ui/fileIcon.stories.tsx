import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { within, userEvent } from '@storybook/testing-library';
import FileIcon from '../../component/ui/FileIcon';

export default {
    title: 'UI/FileIcon',
    component: FileIcon,
} as ComponentMeta<typeof FileIcon>;

const Template: ComponentStory<typeof FileIcon> = (args) => <FileIcon {...args} />;

export const FileIconStory = Template.bind({});
FileIconStory.args = {};
FileIconStory.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);
}