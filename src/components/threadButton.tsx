/* eslint-disable react-hooks/exhaustive-deps */
import { Button } from "@material-ui/core";
import { useState } from "react";
import { useEffect } from "react";
import { useChats } from '../hooks/apiHooks';

interface propType {
    id: number,
    setThreadOpen: Function,
    setThreadId: Function,
}

const ThreadButton = ({ id, setThreadOpen, setThreadId }: propType) => {
    const { getThreadName } = useChats();
    const [name, setName] = useState('');

    useEffect(() => {
        (async () => {
            try {
                console.log('THREADBUTTON: ', id)
                const threadName = await getThreadName(id)
                console.log('THREADNAME: ', threadName)
                setName(threadName)
            } catch (e) {
                console.log(e.message);
            }
        })();
    }, []);

    const openThread = () => {
        setThreadOpen(true)
        setThreadId(id)
    }

    return (
        <>
            <Button onClick={openThread} color="primary" variant="contained">{name}</Button>
        </>
    )
}

export default ThreadButton