import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { within, userEvent } from '@storybook/testing-library';
import Progress from '../../component/ui/ProgressUI';

export default {
    title: 'UI/Progress',
    component: Progress,
} as ComponentMeta<typeof Progress>;

const Template: ComponentStory<typeof Progress> = (args) => <Progress {...args} />;

export const ProgressStory = Template.bind({});
ProgressStory.args = {value: 0, text: 'uploading...'};
ProgressStory.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);
}