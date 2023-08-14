import React, { memo, useCallback } from 'react'
import { useActions } from 'common/hooks'
import { todoListsActions } from 'features/todolists-lists/todolists-reducers'
import { FilterButton } from 'common/components/filterButton/FilterButton'
import { FilterType } from 'features/todolists-lists/tasks/tasks-reducers'
import cl from './filterButtonsGroup.module.css'

type Props = {
    todoListId: string
    filter: FilterType
}

const FilterButtonsGroup: React.FC<Props> = memo(({ todoListId, filter }) => {
    const { changeTodolistFilter } = useActions(todoListsActions)

    const onClickButtonAll = useCallback(() => {
        changeTodolistFilter({ filter: 'all', id: todoListId })
    }, [])

    const onClickButtonComplied = useCallback(() => {
        changeTodolistFilter({ filter: 'complied', id: todoListId })
    }, [])

    const onClickButtonActive = useCallback(() => {
        changeTodolistFilter({ filter: 'active', id: todoListId })
    }, [])

    return (
        <div className={cl.wrapper}>
            <FilterButton
                title={'All'}
                color={'all'}
                filter={filter}
                onClickHandler={onClickButtonAll}
            />
            <FilterButton
                title={'Complied'}
                color={'complied'}
                filter={filter}
                onClickHandler={onClickButtonComplied}
            />
            <FilterButton
                title={'Active'}
                color={'active'}
                filter={filter}
                onClickHandler={onClickButtonActive}
            />
        </div>
    )
})

export default FilterButtonsGroup
