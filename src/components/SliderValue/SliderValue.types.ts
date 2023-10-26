
export interface SliderValueProps {
    step: number
    min: number
    max: number
    title: string
    integer: boolean
    defaulFirstValue: number
    defaulSecondValue: number
    onChangeValue: (e: any) => void
}

