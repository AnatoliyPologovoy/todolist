import React, { memo } from 'react'
import { Button } from '@mui/material'
import { FilterType } from 'features/todolists-lists/tasks/tasks-reducers'

export type Props = {
    title: string
    color: string
    filter: FilterType
    onClickHandler: () => void
}

export const FilterButton: React.FC<Props> = memo((props) => {
    const { title, color, filter, onClickHandler } = props

    return (
        <Button
            size={'small'}
            variant={'contained'}
            disableElevation
            color={filter === color ? 'secondary' : 'primary'}
            onClick={onClickHandler}
        >
            {title}
        </Button>
    )
})
