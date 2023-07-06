//应用
import React from 'react';
//style
import style from './CardLayout.module.css';
import { useTheme } from '@mui/material/styles';
import {css} from '@emotion/react';

export type cardType = {
    children: React.ReactNode,
    /**
     * height
     */
    height: string;
    /**
     * width
     */
    width: string;
}

function CardLayout(props: cardType) {
    const theme = useTheme();
    return (
        <main className={style.layout}
            css={css`
            --card-background-color: ${theme.palette.background.default};
            --card-height: ${props.height};
            --card-width: ${props.width};
            `}>
            {props.children}
        </main>
    )
}

export default CardLayout;