import React, { useReducer } from 'react'
import { Button, Row, Col } from 'antd'
import Body from "../../../../components/bodyComponent";
let data = {
    1: `useState 的替代方案。它接收一个形如 (state, action) => newState 的 reducer，
    并返回当前的 state 以及与其配套的 dispatch 方法。`,
    2: `某些场景下，useReducer 会比 useState 更适用，
    例如 state 逻辑较复杂且包含多个子值，或者下一个 state 依赖于之前的 state 等`,
    3: `React 会确保 dispatch 函数的标识是稳定的，并且不会在组件重新渲染时改变`,
    4: `const [init, dispatch] = useReducer(reducer, { value: 0 })`,
    5: `const reducer = (state, action) => {
        switch (action.type) {
            case 'add':
                console.log(action);
                return {
                    ...state,
                    value: action.value + 1
                }
            case 'sub':
                return {
                    ...state,
                    value: action.value - 1
                }
        }
    }`,
    6: `dispatch({
        type,
        value: init.value
    })`

}
const reducer = (state, action) => {
    switch (action.type) {
        case 'add':
            console.log(action);
            return {
                ...state,
                value: action.value + 1
            }
        case 'sub':
            return {
                ...state,
                value: action.value - 1
            }
    }
}
export default function UseReducer() {
    const [init, dispatch] = useReducer(reducer, { value: 0 })
    const changeInit = (type) => {
        dispatch({
            type,
            value: init.value
        })
    }
    return (
        <>
            <Body title={"useReducer"} data={data} />
            <Row>
                <Col span={3}>
                    <span style={{lineHeight:2}}>{init.value}</span>
                </Col>
                <Col span={4}>
                    <Button onClick={() => changeInit('add')}>add</Button>
                </Col>
                <Col span={4}>
                    <Button onClick={() => changeInit('sub')}>sub</Button>
                </Col>
            </Row>
        </>
    )
}
