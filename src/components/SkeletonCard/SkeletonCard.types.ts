export interface CheckboxProps {
  label: string
  checked: boolean
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  id: string
  name: string
  gray?: boolean
}

export interface StyledLabelProps {
  gray?: boolean
}
