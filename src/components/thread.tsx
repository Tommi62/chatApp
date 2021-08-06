
interface propType {
    id: number
}


const Thread = ({ id }: propType) => {

    return (
        <div>Thread id is {id}</div>
    )
}

export default Thread;