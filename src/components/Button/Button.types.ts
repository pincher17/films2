import { FilmsType } from '../../types/FilmsType';

export interface ButtonProps {
    onClick?: (e: React.MouseEvent<HTMLElement>) => void
    children: React.ReactNode
}

