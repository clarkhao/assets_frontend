import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { within, userEvent } from '@storybook/testing-library';
import Uploader from '../../component/composite/assets/Uploader';

export default {
    title: 'Composite/Uploader',
    component: Uploader,
    
} as ComponentMeta<typeof Uploader>;

const Template: ComponentStory<typeof Uploader> = (args) => <Uploader {...args} />;

export const AssetsUpload = Template.bind({});
AssetsUpload.args = {}
AssetsUpload.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);
}