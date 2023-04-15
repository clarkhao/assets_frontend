import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { within, userEvent } from '@storybook/testing-library';
import List from '../../component/ui/ListUI';

export default {
    title: 'UI/List',
    component: List,
} as ComponentMeta<typeof List>;

const Template: ComponentStory<typeof List> = (args) => <List {...args} />;

export const ListStory = Template.bind({});
ListStory.args = {};
ListStory.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);
}