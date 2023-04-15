import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { within, userEvent } from '@storybook/testing-library';
import Check from '../../component/ui/Check';

export default {
    title: 'UI/Check',
    component: Check,
} as ComponentMeta<typeof Check>;

const Template: ComponentStory<typeof Check> = (args) => <Check {...args} />;

export const CheckStory = Template.bind({});
CheckStory.args = {};
CheckStory.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);
}