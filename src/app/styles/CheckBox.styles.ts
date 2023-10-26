import styled from 'styled-components'


import { StyledLabelProps } from '../../components/CheckBox/CheckBox.types'

export const Checkbox = styled('input')`
  display: none;
  &:checked + label::before {
    border-color: #b81716;
    background-color: #b81716;
    background-image: url('/checkbox.svg');
  }
`

export const Label = styled.label<StyledLabelProps>`
  cursor: pointer;
  font-size: 18px;
  max-width: max-content;
  color: white;
  display: inline-flex;
  align-items: center;
  user-select: none;
  position: relative;
  &::before {
    content: '';
    display: inline-block;
    width: 1em;
    height: 1em;
    flex-shrink: 0;
    flex-grow: 0;
    border: 1px solid #adb5bd;
    border-radius: 0.25em;
    margin-right: 0.5em;
    background-repeat: no-repeat;
    background-position: center center;
  }
`
