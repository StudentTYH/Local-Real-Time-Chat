import React, { useState } from 'react';
import { Input } from 'antd';
import { Button, Flex } from 'antd';

export const Input_ID = ({ onData }:{ onData:(data:string)=> void  }) => {
    const [inputValue, setInputValue] = useState<string>(''); // 用于存储输入框的值

    // 处理Input输入的变化
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    // // 点击按钮时，发起请求
    // const handleButtonClick_id = async () => {
    // try {
    //     const response = await fetch('http://localhost:8765/get_psychology_report', {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json',
    //     },
    //     credentials: 'include',
    //     body: JSON.stringify({ user_id: inputValue }), // 将输入的ID传给后端
    //     });
        
    //     const result = await response.json();
    //     console.log('Success:', result);
    //     // 这里可以根据需求处理返回结果，比如展示在页面上
    // } catch (error) {
    //     console.error('Error:', error);
    // }
    // };



    const handleButtonClick_id = async () => {
        onData(inputValue);
    };
    


    return (
        <>
        <Flex gap="small" wrap>
        <Input 
        placeholder="输入要查询的ID" 
        value={inputValue} 
        onChange={handleInputChange} 
        style={{ width: '70%' }} 
        />
        <Button onClick={handleButtonClick_id}>确定</Button>
        </Flex>
        </>
);
};
