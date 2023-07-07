import { FC } from "react";
import TaskModule from "../moduleType"
import check from '../assets/icon-check.svg'

type Props = TaskModule & {
    handleComplete: (id?: number) => any,
    handleDelete: (id?: number) => any,
    index: number,
    dragStart: (index: number) => any,
    dragEnter: (index: number) => any,
    handleDrag: () => any,
    handleEdit: (id?: number) => any,
}

const Task: FC<Props> = ({ id, taskTitle, completed, index, handleComplete, handleDelete, dragStart, dragEnter, handleDrag, handleEdit }) => {
    return (
        <div
            className="task"
            onDragStart={() => dragStart(index)}
            onDragEnter={() => dragEnter(index)}
            onDragEnd={handleDrag}
            draggable
        >
            <li className={completed ? "completed" : ""}>
                <div onClick={() => handleComplete(id)}>
                    <span className="circle"><img src={completed ? check : ""} alt="" /></span>
                    <p>{taskTitle}</p>
                </div>
            </li>
            <span className="controls">
                <button className="complete" onClick={() => handleComplete(id)}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" width="30px" height="30px"><path d="M 26.980469 5.9902344 A 1.0001 1.0001 0 0 0 26.292969 6.2929688 L 11 21.585938 L 4.7070312 15.292969 A 1.0001 1.0001 0 1 0 3.2929688 16.707031 L 10.292969 23.707031 A 1.0001 1.0001 0 0 0 11.707031 23.707031 L 27.707031 7.7070312 A 1.0001 1.0001 0 0 0 26.980469 5.9902344 z" /></svg></button>
                <button className="edit" onClick={() => handleEdit(id)}><svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 24 24" width="48px" height="48px">    <path d="M 18 2 L 15.585938 4.4140625 L 19.585938 8.4140625 L 22 6 L 18 2 z M 14.076172 5.9238281 L 3 17 L 3 21 L 7 21 L 18.076172 9.9238281 L 14.076172 5.9238281 z"/></svg></button>
                <button className="delete" onClick={() => handleDelete(id)}><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"><path fill="#494C6B" fillRule="evenodd" d="M16.97 0l.708.707L9.546 8.84l8.132 8.132-.707.707-8.132-8.132-8.132 8.132L0 16.97l8.132-8.132L0 .707.707 0 8.84 8.132 16.971 0z"/></svg></button>
            </span>
        </div>
    )
}

export default Task