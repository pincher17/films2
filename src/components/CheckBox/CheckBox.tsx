import React from 'react'

import { Checkbox, Label } from '../../app/styles/CheckBox.styles'
import { CheckboxProps } from './CheckBox.types'

const CheckBox: React.FC<CheckboxProps> = (props) => {
  const { id, label, checked, onChange, gray, name } = props

  return (
    <>
      <Checkbox name={name} id={id} type="checkbox" checked={checked} onChange={onChange} />
      <Label gray={gray} htmlFor={id}>
        {label}
      </Label>
    </>
  )
}

export default CheckBox
